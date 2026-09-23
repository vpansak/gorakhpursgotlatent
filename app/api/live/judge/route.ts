import { NextRequest, NextResponse } from 'next/server';
import { execute, query, queryOne } from '@/lib/db';
import { ensureLiveShowTables } from '@/lib/liveShow';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await ensureLiveShowTables();
    const body = await req.json();
    const { action } = body;

    // 1. JUDGE LOGIN WITH PIN
    if (action === 'LOGIN') {
      const { pin } = body;
      if (!pin) {
        return NextResponse.json({ success: false, error: 'Please enter your 4-digit PIN' }, { status: 400 });
      }

      const judge = await queryOne<any>(
        'SELECT id, name, slot_number, is_active, avatar_url FROM live_judges WHERE pin = ? AND is_active = 1',
        [pin.trim()]
      );

      if (!judge) {
        return NextResponse.json({ success: false, error: 'Invalid PIN. Please check your credentials.' }, { status: 401 });
      }

      return NextResponse.json({ success: true, judge });
    }

    // 2. GET CURRENT ACT FOR JUDGE
    if (action === 'GET_ACT') {
      const { judgeId } = body;
      if (!judgeId) {
        return NextResponse.json({ success: false, error: 'Missing judgeId' }, { status: 400 });
      }

      const state = await queryOne<any>('SELECT * FROM live_show_state WHERE id = ?', ['main']);
      let currentPerformer: any = null;
      let existingScore: any = null;

      if (state?.current_performer_id) {
        // Fetch performer WITHOUT secret prediction
        currentPerformer = await queryOne<any>(
          'SELECT id, name, act, photo_url, running_order, status FROM live_performers WHERE id = ?',
          [state.current_performer_id]
        );

        // Fetch this judge's score ONLY
        existingScore = await queryOne<any>(
          'SELECT score, is_locked, updated_at FROM live_scores WHERE performer_id = ? AND judge_id = ?',
          [state.current_performer_id, judgeId]
        );
      }

      return NextResponse.json({
        success: true,
        state: {
          status: state?.status || 'BEFORE_SCORING',
          judges_open: state?.judges_open ?? 1,
          emergency_blank: state?.emergency_blank ?? 0
        },
        currentPerformer,
        existingScore: existingScore ? Number(existingScore.score) : null,
        isLocked: existingScore?.is_locked === 1 || state?.status === 'SCORES_LOCKED' || state?.status === 'AVERAGE_CALCULATED' || state?.status === 'RESULT_REVEALED'
      });
    }

    // 3. SUBMIT SCORE
    if (action === 'SUBMIT_SCORE') {
      const { judgeId, performerId, score } = body;
      if (!judgeId || !performerId || score === undefined || score === null) {
        return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
      }

      const state = await queryOne<any>('SELECT * FROM live_show_state WHERE id = ?', ['main']);
      if (state?.judges_open === 0) {
        return NextResponse.json({ success: false, error: 'Judge scoring is currently closed by the operator.' }, { status: 403 });
      }

      if (state?.status === 'SCORES_LOCKED' || state?.status === 'AVERAGE_CALCULATED' || state?.status === 'RESULT_REVEALED') {
        return NextResponse.json({ success: false, error: 'Scoring has already been locked for this act.' }, { status: 403 });
      }

      const numScore = Number(score);
      if (isNaN(numScore) || numScore < 0 || numScore > 10) {
        return NextResponse.json({ success: false, error: 'Score must be a number between 0 and 10' }, { status: 400 });
      }

      const normalizedScore = Math.round(numScore * 100) / 100;
      const scoreId = `sc-${performerId}-${judgeId}`;

      await execute(`
        INSERT INTO live_scores (id, performer_id, judge_id, score, is_locked)
        VALUES (?, ?, ?, ?, 0)
        ON CONFLICT(performer_id, judge_id)
        DO UPDATE SET score = EXCLUDED.score, updated_at = CURRENT_TIMESTAMP
      `, [scoreId, performerId, judgeId, normalizedScore]);

      // If show is in BEFORE_SCORING, transition to JUDGING
      if (state?.status === 'BEFORE_SCORING') {
        await execute(`UPDATE live_show_state SET status = 'JUDGING', updated_at = CURRENT_TIMESTAMP WHERE id = 'main'`);
      }

      return NextResponse.json({
        success: true,
        message: 'Score successfully recorded!',
        score: normalizedScore
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Judge route error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
