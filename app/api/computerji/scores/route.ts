import { NextResponse } from 'next/server';
import {
  getAllComputerJiScores,
  upsertComputerJiScore,
  deleteComputerJiScore,
} from '@/lib/computerji-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const scores = await getAllComputerJiScores();
    return NextResponse.json({
      success: true,
      data: scores,
      count: scores.length,
    });
  } catch (err: any) {
    console.error('API Error in GET /api/computerji/scores:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch scores' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || typeof body.contestantId !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid contestant record' },
        { status: 400 }
      );
    }

    const ok = await upsertComputerJiScore({
      contestantId: body.contestantId,
      contestantName: body.contestantName || '',
      category: body.category || '',
      phone: body.phone || '',
      judgeScores: body.judgeScores || {},
      rawAverage: Number(body.rawAverage || 0),
      roundedAverage: Number(body.roundedAverage || 0),
      contestantScore: String(body.contestantScore || ''),
      result: body.result || null,
      status: body.status || 'COMPLETED',
      savedAt: body.savedAt || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    });

    if (!ok) {
      return NextResponse.json(
        { success: false, error: 'Database save failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Record saved successfully to admin panel & database (retained for 10 days)',
    });
  } catch (err: any) {
    console.error('API Error in POST /api/computerji/scores:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to save score' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const contestantId = searchParams.get('id');

    if (!contestantId) {
      return NextResponse.json(
        { success: false, error: 'Missing contestant id' },
        { status: 400 }
      );
    }

    const ok = await deleteComputerJiScore(parseInt(contestantId, 10));
    return NextResponse.json({ success: ok });
  } catch (err: any) {
    console.error('API Error in DELETE /api/computerji/scores:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to delete' },
      { status: 500 }
    );
  }
}
