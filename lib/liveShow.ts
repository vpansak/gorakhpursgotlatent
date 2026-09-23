import { query, queryOne, execute } from './db';
import crypto from 'crypto';

export interface LiveShowState {
  id: string;
  current_performer_id: string | null;
  status: 'READY' | 'ON_STAGE' | 'BEFORE_SCORING' | 'JUDGING' | 'SCORES_LOCKED' | 'AVERAGE_CALCULATED' | 'RESULT_REVEALED' | 'COMPLETED';
  timer_seconds: number;
  timer_running: number;
  timer_started_at: number | null;
  emergency_blank: number;
  judges_open: number;
  audience_open: number;
  calculated_average: number | null;
  reveal_status: 'HIDDEN' | 'REVEALED';
  sound_trigger: string | null;
  updated_at: string;
}

export interface LivePerformer {
  id: string;
  name: string;
  act: string;
  photo_url: string | null;
  running_order: number;
  secret_prediction: number | null;
  status: string;
  created_at?: string;
}

export interface LiveJudge {
  id: string;
  name: string;
  pin: string;
  slot_number: number;
  is_active: number;
  avatar_url?: string;
}

export interface LiveScore {
  id: string;
  performer_id: string;
  judge_id: string;
  score: number;
  is_locked: number;
  updated_at: string;
  judge_name?: string;
  slot_number?: number;
}

export interface LiveHistoryItem {
  id: string;
  performer_id: string;
  performer_name: string;
  act: string;
  judge_scores: string;
  judge_average: number;
  contestant_prediction: number;
  difference: number;
  result: 'WINNER' | 'NOT A MATCH';
  created_at: string;
}

// 5 Canonical GGL Judges
export const DEFAULT_JUDGES = [
  { id: 'judge-1', name: 'Naveen Varma', pin: '1001', slot: 1 },
  { id: 'judge-2', name: 'Brijesh Birju', pin: '1002', slot: 2 },
  { id: 'judge-3', name: 'Alok Akan', pin: '1003', slot: 3 },
  { id: 'judge-4', name: 'Pawan Kumar', pin: '1004', slot: 4 },
  { id: 'judge-5', name: 'Shristi Dubey', pin: '1005', slot: 5 },
];

let isInitialized = false;

export async function ensureLiveShowTables() {
  if (isInitialized) return;

  try {
    // 1. Ensure Postgres tables
    await execute(`
      CREATE TABLE IF NOT EXISTS live_show_state (
        id VARCHAR(50) PRIMARY KEY,
        current_performer_id VARCHAR(100),
        status VARCHAR(50) DEFAULT 'BEFORE_SCORING',
        timer_seconds INT DEFAULT 180,
        timer_running INT DEFAULT 0,
        timer_started_at BIGINT,
        emergency_blank INT DEFAULT 0,
        judges_open INT DEFAULT 1,
        audience_open INT DEFAULT 1,
        calculated_average NUMERIC(5,2),
        reveal_status VARCHAR(20) DEFAULT 'HIDDEN',
        sound_trigger VARCHAR(50),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await execute(`
      CREATE TABLE IF NOT EXISTS live_performers (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        act VARCHAR(255) NOT NULL,
        photo_url TEXT,
        running_order INT DEFAULT 1,
        secret_prediction NUMERIC(5,2),
        status VARCHAR(50) DEFAULT 'READY',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await execute(`
      CREATE TABLE IF NOT EXISTS live_judges (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        pin VARCHAR(20) NOT NULL,
        slot_number INT NOT NULL,
        is_active INT DEFAULT 1,
        avatar_url TEXT
      );
    `);

    await execute(`
      CREATE TABLE IF NOT EXISTS live_scores (
        id VARCHAR(100) PRIMARY KEY,
        performer_id VARCHAR(100) NOT NULL,
        judge_id VARCHAR(100) NOT NULL,
        score NUMERIC(5,2) NOT NULL,
        is_locked INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT uq_perf_judge UNIQUE (performer_id, judge_id)
      );
    `);

    await execute(`
      CREATE TABLE IF NOT EXISTS live_history (
        id VARCHAR(100) PRIMARY KEY,
        performer_id VARCHAR(100) NOT NULL,
        performer_name VARCHAR(255) NOT NULL,
        act VARCHAR(255) NOT NULL,
        judge_scores TEXT NOT NULL,
        judge_average NUMERIC(5,2) NOT NULL,
        contestant_prediction NUMERIC(5,2) NOT NULL,
        difference NUMERIC(5,2) NOT NULL,
        result VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await execute(`
      CREATE TABLE IF NOT EXISTS live_audience_votes (
        id VARCHAR(100) PRIMARY KEY,
        performer_id VARCHAR(100) NOT NULL,
        vote_value INT DEFAULT 1,
        voter_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await execute(`
      CREATE TABLE IF NOT EXISTS live_sponsors (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        tagline VARCHAR(255),
        logo_url TEXT,
        tier VARCHAR(50) DEFAULT 'PLATINUM',
        is_active INT DEFAULT 1
      );
    `);

    // 2. Seed Judges if missing
    for (const j of DEFAULT_JUDGES) {
      const existing = await queryOne('SELECT id FROM live_judges WHERE id = ?', [j.id]);
      if (!existing) {
        await execute(
          'INSERT INTO live_judges (id, name, pin, slot_number, is_active) VALUES (?, ?, ?, ?, 1)',
          [j.id, j.name, j.pin, j.slot]
        );
      }
    }

    // 3. Seed test performers if table empty
    const perfCountRow = await queryOne<any>('SELECT COUNT(*) as count FROM live_performers');
    if (!perfCountRow || Number(perfCountRow.count) === 0) {
      await execute(`
        INSERT INTO live_performers (id, name, act, photo_url, running_order, secret_prediction, status)
        VALUES 
          ('perf-1', 'Naveen Varma', 'Comedy', '/images/naveen-varma.png', 1, 7.60, 'ON_STAGE'),
          ('perf-2', 'Aryan Mishra', 'Beatboxing & Rap', '', 2, 8.00, 'READY'),
          ('perf-3', 'Priya Singh', 'Sufi Kathak Fusion', '', 3, 8.50, 'READY'),
          ('perf-4', 'Rahul Tiwari', 'Mimicry & Roast', '', 4, 7.00, 'READY');
      `);
    }

    // 4. Seed sponsors if empty
    const sponsorCountRow = await queryOne<any>('SELECT COUNT(*) as count FROM live_sponsors');
    if (!sponsorCountRow || Number(sponsorCountRow.count) === 0) {
      await execute(`
        INSERT INTO live_sponsors (id, name, tagline, tier, is_active)
        VALUES 
          ('spon-1', 'Gorakhpur Club', 'Official Hospitality Partner', 'PLATINUM', 1),
          ('spon-2', 'Purvanchal Beats', 'Sound & Audio Experience', 'GOLD', 1),
          ('spon-3', 'Royal Residency Gorakhpur', 'Comfort & Luxury Stay', 'GOLD', 1),
          ('spon-4', 'Kashi Gold', 'Jewels of Purvanchal', 'SILVER', 1);
      `);
    }

    // 5. Ensure single main live_show_state row
    const stateRow = await queryOne<any>('SELECT id FROM live_show_state WHERE id = ?', ['main']);
    if (!stateRow) {
      await execute(`
        INSERT INTO live_show_state (id, current_performer_id, status, timer_seconds, timer_running, emergency_blank, judges_open, audience_open, reveal_status)
        VALUES ('main', 'perf-1', 'BEFORE_SCORING', 180, 0, 0, 1, 1, 'HIDDEN');
      `);
    }

    isInitialized = true;
  } catch (err) {
    console.error('Error ensuring live show tables:', err);
  }
}

/**
 * Fetch full live state.
 * If isOperator is false, secret_prediction is strictly SANITIZED and hidden
 * unless reveal_status === 'REVEALED' and status === 'RESULT_REVEALED'.
 */
export async function getFullLiveState(isOperator = false) {
  await ensureLiveShowTables();

  const state = await queryOne<LiveShowState>('SELECT * FROM live_show_state WHERE id = ?', ['main']);
  const judges = await query<LiveJudge>('SELECT id, name, slot_number, is_active, avatar_url' + (isOperator ? ', pin' : '') + ' FROM live_judges ORDER BY slot_number ASC');
  const performers = await query<LivePerformer>('SELECT * FROM live_performers ORDER BY running_order ASC');
  const sponsors = await query<any>('SELECT * FROM live_sponsors WHERE is_active = 1');
  const history = await query<LiveHistoryItem>('SELECT * FROM live_history ORDER BY created_at DESC LIMIT 20');

  let currentPerformer: LivePerformer | null = null;
  let scores: LiveScore[] = [];
  let audienceVoteCount = 0;

  if (state?.current_performer_id) {
    currentPerformer = performers.find(p => p.id === state.current_performer_id) || null;
    scores = await query<LiveScore>(`
      SELECT s.*, j.name as judge_name, j.slot_number
      FROM live_scores s
      JOIN live_judges j ON s.judge_id = j.id
      WHERE s.performer_id = ?
      ORDER BY j.slot_number ASC
    `, [state.current_performer_id]);

    const votesRow = await queryOne<any>('SELECT COUNT(*) as count FROM live_audience_votes WHERE performer_id = ?', [state.current_performer_id]);
    audienceVoteCount = Number(votesRow?.count) || 0;
  }

  // Count scored judges
  const scoredJudgesCount = scores.filter(s => s.score !== null && s.score !== undefined).length;

  // REVEAL RESULT DATA: only calculated and exposed when revealed
  let revealData: {
    judgeAverage: number | null;
    contestantPrediction: number | null;
    difference: number | null;
    result: 'WINNER' | 'NOT A MATCH' | null;
  } | null = null;

  const isRevealed = state?.reveal_status === 'REVEALED' && state?.status === 'RESULT_REVEALED';

  if (isRevealed && currentPerformer && state.calculated_average !== null) {
    const avg = Number(state.calculated_average);
    const pred = Number(currentPerformer.secret_prediction ?? 0);
    // Normalized comparison to 2 decimal places to avoid floating point anomalies
    const normalizedAvg = Math.round(avg * 100) / 100;
    const normalizedPred = Math.round(pred * 100) / 100;
    const diff = Math.round(Math.abs(normalizedAvg - normalizedPred) * 100) / 100;
    const isWinner = diff === 0;

    revealData = {
      judgeAverage: normalizedAvg,
      contestantPrediction: normalizedPred,
      difference: diff,
      result: isWinner ? 'WINNER' : 'NOT A MATCH'
    };
  }

  // Strict sanitization for Public Display, Audience, and Judges:
  // If not operator and not officially revealed, hide secret prediction completely!
  let safePerformer = currentPerformer ? { ...currentPerformer } : null;
  let safePerformers = performers.map(p => ({ ...p }));

  if (!isOperator && !isRevealed) {
    if (safePerformer) {
      safePerformer.secret_prediction = null;
    }
    safePerformers = safePerformers.map(p => ({
      ...p,
      secret_prediction: null
    }));
  }

  return {
    state,
    currentPerformer: safePerformer,
    performers: safePerformers,
    judges,
    scores,
    scoredJudgesCount,
    totalJudgesCount: judges.length || 5,
    audienceVoteCount,
    sponsors,
    history,
    revealData,
    isOperator,
    isRevealed
  };
}

/**
 * Calculate the exact 2-decimal average of judge scores.
 * Enforces 5/5 judge scores entered unless override is requested.
 */
export async function calculateJudgeAverage(performerId: string, overrideJudgeCount = false) {
  await ensureLiveShowTables();

  const judges = await query<LiveJudge>('SELECT id FROM live_judges WHERE is_active = 1');
  const scores = await query<LiveScore>('SELECT * FROM live_scores WHERE performer_id = ?', [performerId]);

  if (!overrideJudgeCount && scores.length < judges.length) {
    throw new Error(`Cannot calculate average: Only ${scores.length}/${judges.length} judges have submitted scores.`);
  }

  if (scores.length === 0) {
    throw new Error('No scores entered.');
  }

  const sum = scores.reduce((acc, curr) => acc + Number(curr.score), 0);
  const rawAverage = sum / scores.length;
  // Normalized 2-decimal precision (e.g. 7.60)
  const normalizedAverage = Math.round(rawAverage * 100) / 100;

  // Lock scores and update state
  await execute('UPDATE live_scores SET is_locked = 1 WHERE performer_id = ?', [performerId]);
  await execute(`
    UPDATE live_show_state 
    SET calculated_average = ?, 
        status = 'AVERAGE_CALCULATED',
        reveal_status = 'HIDDEN',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = 'main'
  `, [normalizedAverage]);

  await execute(`UPDATE live_performers SET status = 'AVERAGE_CALCULATED' WHERE id = ?`, [performerId]);

  return {
    average: normalizedAverage,
    judgeCount: scores.length,
    scores
  };
}

/**
 * Officially Reveal the result.
 * Computes exact match, difference, WINNER / NOT A MATCH, logs to history.
 */
export async function revealLiveResult(performerId: string) {
  await ensureLiveShowTables();

  const state = await queryOne<LiveShowState>('SELECT * FROM live_show_state WHERE id = ?', ['main']);
  const performer = await queryOne<LivePerformer>('SELECT * FROM live_performers WHERE id = ?', [performerId]);

  if (!performer) {
    throw new Error('Performer not found.');
  }

  let avg = state?.calculated_average !== null && state?.calculated_average !== undefined ? Number(state.calculated_average) : null;
  if (avg === null) {
    // Calculate on the fly if needed
    const calc = await calculateJudgeAverage(performerId, true);
    avg = calc.average;
  }

  const scores = await query<LiveScore>(`
    SELECT s.score, j.name as judge_name 
    FROM live_scores s 
    JOIN live_judges j ON s.judge_id = j.id 
    WHERE s.performer_id = ? 
    ORDER BY j.slot_number ASC
  `, [performerId]);

  const pred = Number(performer.secret_prediction ?? 0);
  const normalizedAvg = Math.round(avg * 100) / 100;
  const normalizedPred = Math.round(pred * 100) / 100;
  const diff = Math.round(Math.abs(normalizedAvg - normalizedPred) * 100) / 100;
  const isWinner = diff === 0;
  const resultText: 'WINNER' | 'NOT A MATCH' = isWinner ? 'WINNER' : 'NOT A MATCH';
  const soundTrigger = isWinner ? 'WINNER' : 'SUSPENSE';

  // Update show state to RESULT_REVEALED and reveal_status = 'REVEALED'
  await execute(`
    UPDATE live_show_state 
    SET status = 'RESULT_REVEALED',
        reveal_status = 'REVEALED',
        sound_trigger = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = 'main'
  `, [soundTrigger]);

  await execute(`
    UPDATE live_performers 
    SET status = 'RESULT_REVEALED' 
    WHERE id = ?
  `, [performerId]);

  // Insert or update live_history
  const historyId = 'hist-' + performerId + '-' + Date.now();
  await execute(`
    INSERT INTO live_history (
      id, performer_id, performer_name, act, judge_scores, judge_average, 
      contestant_prediction, difference, result
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    historyId,
    performer.id,
    performer.name,
    performer.act,
    JSON.stringify(scores),
    normalizedAvg,
    normalizedPred,
    diff,
    resultText
  ]);

  return {
    judgeAverage: normalizedAvg,
    contestantPrediction: normalizedPred,
    difference: diff,
    result: resultText,
    scores
  };
}
