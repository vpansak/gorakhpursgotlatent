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

    const targetPerformerId = performerId || state?.current_performer_id;
    if (!targetPerformerId) {
      return NextResponse.json({ success: false, error: 'No active performer on stage.' }, { status: 400 });
    }

    const voterId = req.headers.get('x-forwarded-for') || 'anon-' + Math.random().toString(36).substring(7);
    const voteId = `vote-${targetPerformerId}-${Date.now()}-${Math.random().toString(36).substring(5)}`;

    await execute(`
      INSERT INTO live_audience_votes (id, performer_id, vote_value, voter_id)
      VALUES (?, ?, ?, ?)
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
