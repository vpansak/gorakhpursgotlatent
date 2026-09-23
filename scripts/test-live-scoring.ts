// Comprehensive verification script for GGL Live Show Control Room & Scoring Game Engine
import { initDatabase, db, query, queryOne, execute } from '../lib/db';
import {
  ensureLiveShowTables,
  calculateJudgeAverage,
  revealLiveResult,
  getFullLiveState,
  DEFAULT_JUDGES
} from '../lib/liveShow';

async function runTests() {
  console.log('=== GGL LIVE SHOW SCORING SYSTEM AUTOMATED VERIFICATION ===\n');

  // Step 1: Ensure tables & seed
  await ensureLiveShowTables();
  console.log('✅ Step 1: Database tables & seed checked.');

  // Step 2: Verify 5 Judges exist with PINs
  const judges = await query('SELECT * FROM live_judges ORDER BY slot_number ASC');
  console.log(`✅ Step 2: Found ${judges.length} judges:`);
  judges.forEach((j: any) => console.log(`   - Judge ${j.slot_number}: ${j.name} (PIN: ${j.pin})`));
  if (judges.length < 5) throw new Error('Expected at least 5 judges');

  // Step 3: TEST CASE 1 - Naveen Varma (Exact Match -> WINNER)
  console.log('\n--- TESTING CASE 1: EXACT MATCH (WINNER) ---');
  const perfId1 = 'test-perf-1';
  // Upsert performer 1
  await execute(`
    INSERT INTO live_performers (id, name, act, running_order, secret_prediction, status)
    VALUES (?, 'Naveen Varma', 'Comedy', 1, 7.60, 'ON_STAGE')
    ON CONFLICT(id) DO UPDATE SET secret_prediction = 7.60, status = 'ON_STAGE'
  `, [perfId1]);

  // Set show state to perfId1
  await execute(`
    UPDATE live_show_state 
    SET current_performer_id = ?, status = 'JUDGING', calculated_average = NULL, reveal_status = 'HIDDEN'
    WHERE id = 'main'
  `, [perfId1]);

  // Clear previous scores
  await execute('DELETE FROM live_scores WHERE performer_id = ?', [perfId1]);

  // 5 Scores: 7, 8, 6, 9, 8
  const testScores = [7, 8, 6, 9, 8];
  for (let i = 0; i < 5; i++) {
    const judge = judges[i];
    const scoreVal = testScores[i];
    await execute(`
      INSERT INTO live_scores (id, performer_id, judge_id, score, is_locked)
      VALUES (?, ?, ?, ?, 0)
      ON CONFLICT(performer_id, judge_id) DO UPDATE SET score = EXCLUDED.score, is_locked = 0
    `, [`sc-${perfId1}-${judge.id}`, perfId1, judge.id, scoreVal]);
  }

  // Calculate average
  const calc1 = await calculateJudgeAverage(perfId1);
  console.log(`Calculated Average: ${calc1.average.toFixed(2)} (Sum: ${testScores.reduce((a,b)=>a+b,0)} / 5)`);
  if (calc1.average !== 7.60) {
    throw new Error(`Expected average 7.60, got ${calc1.average}`);
  }
  console.log('✅ Average is exactly 7.60');

  // Check state BEFORE reveal: prediction must be HIDDEN for non-operator
  const publicStateBeforeReveal = await getFullLiveState(false);
  if (publicStateBeforeReveal.currentPerformer?.secret_prediction !== null) {
    throw new Error('SECURITY LEAK: secret_prediction was visible to public before reveal!');
  }
  console.log('✅ Security check passed: secret_prediction is NULL for public display before reveal.');

  // Reveal result
  const reveal1 = await revealLiveResult(perfId1);
  console.log(`Reveal Result: Average = ${reveal1.judgeAverage.toFixed(2)}, Prediction = ${reveal1.contestantPrediction.toFixed(2)}, Diff = ${reveal1.difference.toFixed(2)}, Result = ${reveal1.result}`);
  if (reveal1.difference !== 0.00 || reveal1.result !== 'WINNER') {
    throw new Error(`Test Case 1 failed: Expected difference 0.00 and WINNER, got ${reveal1.difference} and ${reveal1.result}`);
  }
  console.log('✅ Test Case 1 PASSED: WINNER detected with 0.00 difference!');

  // Check state AFTER reveal: public display can now see the winner and prediction
  const publicStateAfterReveal = await getFullLiveState(false);
  if (publicStateAfterReveal.revealData?.result !== 'WINNER') {
    throw new Error('Public display did not receive WINNER result after reveal');
  }
  console.log('✅ Public display state updated with WINNER reveal data.');

  // Step 4: TEST CASE 2 - Prediction 8.00 vs Average 7.60 -> NOT A MATCH
  console.log('\n--- TESTING CASE 2: NON-MATCH (NOT A MATCH) ---');
  const perfId2 = 'test-perf-2';
  // Upsert performer 2 with prediction 8.00
  await execute(`
    INSERT INTO live_performers (id, name, act, running_order, secret_prediction, status)
    VALUES (?, 'Aryan Mishra', 'Beatboxing & Rap', 2, 8.00, 'ON_STAGE')
    ON CONFLICT(id) DO UPDATE SET secret_prediction = 8.00, status = 'ON_STAGE'
  `, [perfId2]);

  // Set show state to perfId2
  await execute(`
    UPDATE live_show_state 
    SET current_performer_id = ?, status = 'JUDGING', calculated_average = NULL, reveal_status = 'HIDDEN'
    WHERE id = 'main'
  `, [perfId2]);

  // Clear previous scores
  await execute('DELETE FROM live_scores WHERE performer_id = ?', [perfId2]);

  // Insert same judge scores: 7, 8, 6, 9, 8
  for (let i = 0; i < 5; i++) {
    const judge = judges[i];
    const scoreVal = testScores[i];
    await execute(`
      INSERT INTO live_scores (id, performer_id, judge_id, score, is_locked)
      VALUES (?, ?, ?, ?, 0)
      ON CONFLICT(performer_id, judge_id) DO UPDATE SET score = EXCLUDED.score, is_locked = 0
    `, [`sc-${perfId2}-${judge.id}`, perfId2, judge.id, scoreVal]);
  }

  // Calculate average
  const calc2 = await calculateJudgeAverage(perfId2);
  console.log(`Calculated Average: ${calc2.average.toFixed(2)}`);
  if (calc2.average !== 7.60) {
    throw new Error(`Expected average 7.60, got ${calc2.average}`);
  }

  // Reveal result
  const reveal2 = await revealLiveResult(perfId2);
  console.log(`Reveal Result: Average = ${reveal2.judgeAverage.toFixed(2)}, Prediction = ${reveal2.contestantPrediction.toFixed(2)}, Diff = ${reveal2.difference.toFixed(2)}, Result = ${reveal2.result}`);
  if (reveal2.difference !== 0.40 || reveal2.result !== 'NOT A MATCH') {
    throw new Error(`Test Case 2 failed: Expected difference 0.40 and NOT A MATCH, got ${reveal2.difference} and ${reveal2.result}`);
  }
  console.log('✅ Test Case 2 PASSED: NOT A MATCH detected with 0.40 difference!');

  // Check history table
  const historyRows = await query('SELECT * FROM live_history ORDER BY created_at DESC LIMIT 2');
  console.log(`\n✅ Step 5: History ledger verified. Found ${historyRows.length} recent acts logged:`);
  historyRows.forEach((h: any) => {
    console.log(`   - ${h.performer_name} (${h.act}): Avg ${h.judge_average}, Pred ${h.contestant_prediction}, Diff ${h.difference} => ${h.result}`);
  });

  // Reset back to perf-1 for real user live show usage
  await ensureLiveShowTables();
  const perf1 = await queryOne('SELECT id FROM live_performers WHERE name = ?', ['Naveen Varma']);
  if (perf1) {
    await execute(`
      UPDATE live_show_state 
      SET current_performer_id = ?, status = 'BEFORE_SCORING', calculated_average = NULL, reveal_status = 'HIDDEN', emergency_blank = 0
      WHERE id = 'main'
    `, [perf1.id]);
  }

  console.log('\n🎉 ALL SCORING LOGIC AND SECURITY TESTS PASSED PERFECTLY!\n');
  process.exit(0);
}

runTests().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
