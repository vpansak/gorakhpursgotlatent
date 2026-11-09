import { createHmac } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { execute, query, queryOne } from '@/lib/db';
import { ensureLiveShowTables } from '@/lib/liveShow';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await ensureLiveShowTables();
    const performerId = req.nextUrl.searchParams.get('performerId');
    if (!performerId) {
      const state = await queryOne<any>('SELECT current_performer_id, audience_open FROM live_show_state WHERE id = ?', ['main']);
      const countRow = await queryOne<any>('SELECT COUNT(*) as count FROM live_audience_votes WHERE performer_id = ?', [state?.current_performer_id]);
      return NextResponse.json({
        success: true,
        performerId: state?.current_performer_id,
        audienceOpen: state?.audience_open === 1,
        votes: Number(countRow?.count) || 0
      });
    }

    const countRow = await queryOne<any>('SELECT COUNT(*) as count FROM live_audience_votes WHERE performer_id = ?', [performerId]);
    return NextResponse.json({
      success: true,
      performerId,
      votes: Number(countRow?.count) || 0
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureLiveShowTables();
    const body = await req.json();
    const { performerId, voteType } = body;

    const state = await queryOne<any>('SELECT audience_open, current_performer_id FROM live_show_state WHERE id = ?', ['main']);
    if (state?.audience_open === 0) {
      return NextResponse.json({ success: false, error: 'Audience voting is currently closed by the operator.' }, { status: 403 });
    }

    if (performerId && performerId !== state?.current_performer_id) return NextResponse.json({ success: false, error: 'Voting is only available for the current performer.' }, { status: 409 });
    const targetPerformerId = state?.current_performer_id;
    if (!targetPerformerId) {
      return NextResponse.json({ success: false, error: 'No active performer on stage.' }, { status: 400 });
    }

    const address = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '').split(',')[0].trim();
    const secret = process.env.JWT_SECRET;
    if (!address || !secret) return NextResponse.json({ success: false, error: 'Voting verification unavailable. Please try again later.' }, { status: 503 });
    const voterId = createHmac('sha256', secret).update(address).digest('hex');
    const voteId = createHmac('sha256', secret).update(`${targetPerformerId}:${voterId}`).digest('hex');
    await execute(`
      INSERT INTO live_audience_votes (id, performer_id, vote_value, voter_id)
      VALUES (?, ?, ?, ?) ON CONFLICT (id) DO NOTHING
    `, [voteId, targetPerformerId, 1, voterId]);

    const countRow = await queryOne<any>('SELECT COUNT(*) as count FROM live_audience_votes WHERE performer_id = ?', [targetPerformerId]);
    return NextResponse.json({
      success: true,
      performerId: targetPerformerId,
      totalVotes: Number(countRow?.count) || 0,
      message: 'Vote cast successfully!'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
