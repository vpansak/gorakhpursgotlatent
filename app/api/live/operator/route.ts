import { NextRequest, NextResponse } from 'next/server';
import { execute, query, queryOne } from '@/lib/db';
import { calculateJudgeAverage, revealLiveResult, ensureLiveShowTables, getFullLiveState } from '@/lib/liveShow';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await ensureLiveShowTables();
    const body = await req.json();
    const { action } = body;

    switch (action) {
      // 1. SELECT CURRENT PERFORMER
      case 'SET_PERFORMER': {
        const { performerId } = body;
        if (!performerId) return NextResponse.json({ success: false, error: 'Missing performerId' }, { status: 400 });

        await execute(`
          UPDATE live_show_state 
          SET current_performer_id = ?,
              status = 'BEFORE_SCORING',
              calculated_average = NULL,
              reveal_status = 'HIDDEN',
              timer_running = 0,
              sound_trigger = 'ENTRY',
              updated_at = CURRENT_TIMESTAMP
          WHERE id = 'main'
        `, [performerId]);

        await execute(`UPDATE live_performers SET status = 'ON_STAGE' WHERE id = ?`, [performerId]);
        break;
      }

      // 2. SET SECRET PREDICTION
      case 'SET_PREDICTION': {
        const { performerId, prediction } = body;
        if (!performerId) return NextResponse.json({ success: false, error: 'Missing performerId' }, { status: 400 });
        const numericPred = prediction !== '' && prediction !== null ? Math.round(Number(prediction) * 100) / 100 : null;

        await execute(`
          UPDATE live_performers 
          SET secret_prediction = ? 
          WHERE id = ?
        `, [numericPred, performerId]);
        break;
      }

      // 3. TIMER ACTIONS
      case 'START_TIMER': {
        await execute(`
          UPDATE live_show_state 
          SET timer_running = 1,
              timer_started_at = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = 'main'
        `, [Date.now()]);
        break;
      }

      case 'PAUSE_TIMER': {
        const { remainingSeconds } = body;
        await execute(`
          UPDATE live_show_state 
          SET timer_running = 0,
              timer_seconds = ?,
              timer_started_at = NULL,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = 'main'
        `, [remainingSeconds !== undefined ? Number(remainingSeconds) : 180]);
        break;
      }

      case 'RESET_TIMER': {
        const seconds = body.seconds !== undefined ? Number(body.seconds) : 180;
        await execute(`
          UPDATE live_show_state 
          SET timer_running = 0,
              timer_seconds = ?,
              timer_started_at = NULL,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = 'main'
        `, [seconds]);
        break;
      }

      // 4. EMERGENCY BLANK TOGGLE
      case 'TOGGLE_EMERGENCY_BLANK': {
        const state = await queryOne<any>('SELECT emergency_blank FROM live_show_state WHERE id = ?', ['main']);
        const currentBlank = state?.emergency_blank ? 1 : 0;
        const newBlank = body.forceState !== undefined ? (body.forceState ? 1 : 0) : (currentBlank ? 0 : 1);

        await execute(`
          UPDATE live_show_state 
          SET emergency_blank = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = 'main'
        `, [newBlank]);
        break;
      }

      // 5. JUDGES OPEN / CLOSED
      case 'TOGGLE_JUDGES_OPEN': {
        const state = await queryOne<any>('SELECT judges_open FROM live_show_state WHERE id = ?', ['main']);
        const currentOpen = state?.judges_open ? 1 : 0;
        const newOpen = body.forceState !== undefined ? (body.forceState ? 1 : 0) : (currentOpen ? 0 : 1);

        await execute(`
          UPDATE live_show_state 
          SET judges_open = ?,
              status = CASE WHEN ? = 1 THEN 'JUDGING' ELSE status END,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = 'main'
        `, [newOpen, newOpen]);
        break;
      }

      // 6. AUDIENCE OPEN / CLOSED
      case 'TOGGLE_AUDIENCE_OPEN': {
        const state = await queryOne<any>('SELECT audience_open FROM live_show_state WHERE id = ?', ['main']);
        const currentOpen = state?.audience_open ? 1 : 0;
        const newOpen = body.forceState !== undefined ? (body.forceState ? 1 : 0) : (currentOpen ? 0 : 1);

        await execute(`
          UPDATE live_show_state 
          SET audience_open = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = 'main'
        `, [newOpen]);
        break;
      }

      // 7. OPERATOR DIRECT SCORE ENTRY
      case 'SET_JUDGE_SCORE': {
        const { performerId, judgeId, score } = body;
        if (!performerId || !judgeId) return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });

        const numScore = Math.min(10, Math.max(0, Math.round(Number(score) * 100) / 100));
        const scoreId = `sc-${performerId}-${judgeId}`;

        // Upsert score
        await execute(`
          INSERT INTO live_scores (id, performer_id, judge_id, score, is_locked)
          VALUES (?, ?, ?, ?, 0)
          ON CONFLICT(performer_id, judge_id) 
          DO UPDATE SET score = EXCLUDED.score, is_locked = 0, updated_at = CURRENT_TIMESTAMP
        `, [scoreId, performerId, judgeId, numScore]);

        // Update state to JUDGING if in BEFORE_SCORING
        await execute(`
          UPDATE live_show_state 
          SET status = CASE WHEN status = 'BEFORE_SCORING' THEN 'JUDGING' ELSE status END,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = 'main'
        `);
        break;
      }

      // 7b. BATCH SCORE ENTRY FOR ALL 5 JUDGES
      case 'SET_ALL_JUDGE_SCORES': {
        const { performerId, scores } = body;
        if (!performerId || !scores || typeof scores !== 'object') {
          return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
        }

        for (const [judgeId, rawVal] of Object.entries(scores)) {
          if (rawVal !== '' && rawVal !== null && rawVal !== undefined) {
            const numScore = Math.min(10, Math.max(0, Math.round(Number(rawVal) * 100) / 100));
            if (!isNaN(numScore)) {
              const scoreId = `sc-${performerId}-${judgeId}`;
              await execute(`
                INSERT INTO live_scores (id, performer_id, judge_id, score, is_locked)
                VALUES (?, ?, ?, ?, 0)
                ON CONFLICT(performer_id, judge_id) 
                DO UPDATE SET score = EXCLUDED.score, is_locked = 0, updated_at = CURRENT_TIMESTAMP
              `, [scoreId, performerId, judgeId, numScore]);
            }
          }
        }

        await execute(`
          UPDATE live_show_state 
          SET status = CASE WHEN status = 'BEFORE_SCORING' THEN 'JUDGING' ELSE status END,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = 'main'
        `);
        break;
      }

      // 8. LOCK / UNLOCK JUDGE SCORES
      case 'LOCK_SCORES': {
        const { performerId } = body;
        await execute('UPDATE live_scores SET is_locked = 1 WHERE performer_id = ?', [performerId]);
        await execute(`
          UPDATE live_show_state 
          SET status = 'SCORES_LOCKED',
              updated_at = CURRENT_TIMESTAMP
          WHERE id = 'main'
        `);
        await execute(`UPDATE live_performers SET status = 'SCORES_LOCKED' WHERE id = ?`, [performerId]);
        break;
      }

      case 'UNLOCK_SCORES': {
        const { performerId } = body;
        await execute('UPDATE live_scores SET is_locked = 0 WHERE performer_id = ?', [performerId]);
        await execute(`
          UPDATE live_show_state 
          SET status = 'JUDGING',
              calculated_average = NULL,
              reveal_status = 'HIDDEN',
              updated_at = CURRENT_TIMESTAMP
          WHERE id = 'main'
        `);
        await execute(`UPDATE live_performers SET status = 'JUDGING' WHERE id = ?`, [performerId]);
        break;
      }

      // 9. CALCULATE AVERAGE
      case 'CALCULATE_AVERAGE': {
        const { performerId, force } = body;
        if (!performerId) return NextResponse.json({ success: false, error: 'Missing performerId' }, { status: 400 });

        const result = await calculateJudgeAverage(performerId, !!force);
        return NextResponse.json({ success: true, ...result });
      }

      // 10. REVEAL RESULT
      case 'REVEAL_RESULT': {
        const { performerId } = body;
        if (!performerId) return NextResponse.json({ success: false, error: 'Missing performerId' }, { status: 400 });

        const result = await revealLiveResult(performerId);
        return NextResponse.json({ success: true, ...result });
      }

      // 11. NEXT ACT / ADVANCE
      case 'NEXT_ACT': {
        const { currentPerformerId } = body;
        // Mark current act completed
        if (currentPerformerId) {
          await execute(`UPDATE live_performers SET status = 'COMPLETED' WHERE id = ?`, [currentPerformerId]);
        }

        // Find next performer in running order
        const currentPerf = await queryOne<any>('SELECT running_order FROM live_performers WHERE id = ?', [currentPerformerId]);
        const nextOrder = (currentPerf?.running_order || 0) + 1;
        const nextPerf = await queryOne<any>('SELECT id FROM live_performers WHERE running_order >= ? AND status != \'COMPLETED\' ORDER BY running_order ASC LIMIT 1', [nextOrder]);

        if (nextPerf) {
          await execute(`
            UPDATE live_show_state 
            SET current_performer_id = ?,
                status = 'BEFORE_SCORING',
                calculated_average = NULL,
                reveal_status = 'HIDDEN',
                timer_running = 0,
                timer_seconds = 180,
                sound_trigger = 'ENTRY',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = 'main'
          `, [nextPerf.id]);
          await execute(`UPDATE live_performers SET status = 'ON_STAGE' WHERE id = ?`, [nextPerf.id]);
        }
        break;
      }

      // 12. SOUND TRIGGER
      case 'TRIGGER_SOUND': {
        const { sound } = body;
        await execute(`
          UPDATE live_show_state 
          SET sound_trigger = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = 'main'
        `, [sound]);
        break;
      }

      // 13. ADD PERFORMER
      case 'ADD_PERFORMER': {
        const { name, act, photoUrl, secretPrediction } = body;
        if (!name || !act) return NextResponse.json({ success: false, error: 'Name and Act required' }, { status: 400 });

        const countRow = await queryOne<any>('SELECT COUNT(*) as count FROM live_performers');
        const nextOrder = (Number(countRow?.count) || 0) + 1;
        const id = 'perf-' + Date.now();

        await execute(`
          INSERT INTO live_performers (id, name, act, photo_url, running_order, secret_prediction, status)
          VALUES (?, ?, ?, ?, ?, ?, 'READY')
        `, [id, name, act, photoUrl || '', nextOrder, secretPrediction ? Number(secretPrediction) : null]);
        break;
      }

      // 14. RESET CURRENT ACT / RETRY
      case 'RESET_ACT': {
        const { performerId } = body;
        if (performerId) {
          await execute('DELETE FROM live_scores WHERE performer_id = ?', [performerId]);
          await execute(`
            UPDATE live_show_state 
            SET status = 'BEFORE_SCORING',
                calculated_average = NULL,
                reveal_status = 'HIDDEN',
                timer_running = 0,
                timer_seconds = 180,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = 'main'
          `);
          await execute(`UPDATE live_performers SET status = 'ON_STAGE' WHERE id = ?`, [performerId]);
        }
        break;
      }

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }

    const updatedState = await getFullLiveState(true);
    return NextResponse.json({ success: true, ...updatedState });
  } catch (err: any) {
    console.error('Operator route error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
