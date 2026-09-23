import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_N3PsaDziloM4@ep-cold-paper-b5liftd3-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Neon PostgreSQL Connection Pool
export const pool: Pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
});

/**
 * Converts SQLite '?' placeholders to PostgreSQL '$1, $2, ...' syntax
 */
export function normalizeSql(sql: string): string {
  if (!sql.includes('?')) return sql;
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
}

export interface AppDatabase {
  query: <T = any>(sql: string, params?: any[]) => Promise<T[]>;
  queryOne: <T = any>(sql: string, params?: any[]) => Promise<T | null>;
  execute: (sql: string, params?: any[]) => Promise<{ rowCount: number }>;
  pool: Pool;
  [key: string]: any;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const normalized = normalizeSql(sql);
    const result = await pool.query(normalized, params);
    return result.rows as T[];
  } catch (err) {
    console.error('Database query error:', err);
    return [];
  }
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function execute(sql: string, params: any[] = []): Promise<{ rowCount: number }> {
  let rowCount = 0;
  try {
    const normalized = normalizeSql(sql);
    const result = await pool.query(normalized, params);
    rowCount = result.rowCount || 0;
  } catch (err) {
    console.error('Database execute error:', err);
  }
  return { rowCount };
}

export const db: AppDatabase = {
  query,
  queryOne,
  execute,
  pool,
};

export function initDatabase() {
  // Schema is hosted and managed on Neon PostgreSQL
}

export default db;
