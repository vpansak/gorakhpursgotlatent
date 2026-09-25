import { pool } from './db';

export interface ComputerJiDbRecord {
  contestant_id: number;
  contestant_name: string;
  category: string;
  phone: string;
  judge_scores: Record<string, string>;
  raw_average: number;
  rounded_average: number;
  contestant_score: string;
  result: 'WIN' | 'LOSE' | null;
  status: 'COMPLETED';
  saved_at: string;
  created_at?: string;
  updated_at?: string;
  days_left?: number;
}

/**
 * Ensures table exists and performs 10-day TTL cleanup
 */
export async function ensureComputerJiTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS computerji_scores (
        contestant_id INT PRIMARY KEY,
        contestant_name VARCHAR(255) NOT NULL,
        category VARCHAR(255),
        phone VARCHAR(50),
        judge_scores JSONB,
        raw_average NUMERIC(5,2),
        rounded_average NUMERIC(5,2),
        contestant_score VARCHAR(50),
        result VARCHAR(50),
        status VARCHAR(50) DEFAULT 'COMPLETED',
        saved_at VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    console.error('Failed to create/verify computerji_scores table:', err);
  }
}

/**
 * Automatically delete records older than 10 days
 */
export async function purgeExpiredComputerJiScores(): Promise<number> {
  try {
    const res = await pool.query(
      `DELETE FROM computerji_scores WHERE created_at < NOW() - INTERVAL '10 days'`
    );
    return res.rowCount || 0;
  } catch (err) {
    console.error('Error purging expired computerji scores:', err);
    return 0;
  }
}

/**
 * Get all saved scores (with 10-day TTL pruning applied first)
 */
export async function getAllComputerJiScores(): Promise<ComputerJiDbRecord[]> {
  await ensureComputerJiTable();
  await purgeExpiredComputerJiScores();

  try {
    const res = await pool.query(`
      SELECT 
        contestant_id,
        contestant_name,
        category,
        phone,
        judge_scores,
        raw_average::float,
        rounded_average::float,
        contestant_score,
        result,
        status,
        saved_at,
        created_at,
        updated_at,
        GREATEST(0, CEIL(10 - EXTRACT(EPOCH FROM (NOW() - created_at)) / 86400))::int AS days_left
      FROM computerji_scores 
      ORDER BY contestant_id ASC
    `);

    return res.rows.map((row: any) => ({
      contestant_id: Number(row.contestant_id),
      contestant_name: row.contestant_name,
      category: row.category,
      phone: row.phone,
      judge_scores: typeof row.judge_scores === 'string' ? JSON.parse(row.judge_scores) : (row.judge_scores || {}),
      raw_average: row.raw_average,
      rounded_average: row.rounded_average,
      contestant_score: row.contestant_score,
      result: row.result,
      status: row.status || 'COMPLETED',
      saved_at: row.saved_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      days_left: row.days_left ?? 10,
    }));
  } catch (err) {
    console.error('Error fetching computerji scores:', err);
    return [];
  }
}

/**
 * Save or update a Computer Ji score record into Neon PostgreSQL
 */
export async function upsertComputerJiScore(record: {
  contestantId: number;
  contestantName: string;
  category: string;
  phone: string;
  judgeScores: Record<string, string>;
  rawAverage: number;
  roundedAverage: number;
  contestantScore: string;
  result: 'WIN' | 'LOSE' | null;
  status?: string;
  savedAt: string;
}): Promise<boolean> {
  await ensureComputerJiTable();
  await purgeExpiredComputerJiScores();

  try {
    await pool.query(
      `
      INSERT INTO computerji_scores (
        contestant_id,
        contestant_name,
        category,
        phone,
        judge_scores,
        raw_average,
        rounded_average,
        contestant_score,
        result,
        status,
        saved_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      ON CONFLICT (contestant_id) DO UPDATE SET
        contestant_name = EXCLUDED.contestant_name,
        category = EXCLUDED.category,
        phone = EXCLUDED.phone,
        judge_scores = EXCLUDED.judge_scores,
        raw_average = EXCLUDED.raw_average,
        rounded_average = EXCLUDED.rounded_average,
        contestant_score = EXCLUDED.contestant_score,
        result = EXCLUDED.result,
        status = EXCLUDED.status,
        saved_at = EXCLUDED.saved_at,
        updated_at = NOW();
      `,
      [
        record.contestantId,
        record.contestantName,
        record.category,
        record.phone,
        JSON.stringify(record.judgeScores || {}),
        record.rawAverage || 0,
        record.roundedAverage || 0,
        record.contestantScore || '',
        record.result,
        record.status || 'COMPLETED',
        record.savedAt,
      ]
    );

    return true;
  } catch (err) {
    console.error('Error upserting computerji score:', err);
    return false;
  }
}

/**
 * Delete a specific computerji score record
 */
export async function deleteComputerJiScore(contestantId: number): Promise<boolean> {
  try {
    await pool.query('DELETE FROM computerji_scores WHERE contestant_id = $1', [contestantId]);
    return true;
  } catch (err) {
    console.error('Error deleting computerji score:', err);
    return false;
  }
}
