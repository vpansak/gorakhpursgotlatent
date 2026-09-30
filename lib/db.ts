import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_pay1mTgz2qSi@ep-fancy-voice-b52wvbws-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require';
if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL environment variable is not explicitly set; using default Neon pooler connection.');
}

// Stateless Neon HTTP client: zero TCP connection drops, fast HTTPS requests
const sqlClient = neon(databaseUrl);

declare global {
  var _schemaInitPromise: Promise<void> | undefined;
}

/**
 * Converts SQLite '?' placeholders to PostgreSQL '$1, $2, ...' syntax
 */
export function normalizeSql(sql: string): string {
  if (!sql.includes('?')) return sql;
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
}

/**
 * Executes queries using stateless HTTP client with automatic retry logic for transient errors
 */
async function executeWithRetry<T = any>(sqlText: string, params: any[] = [], retries = 3): Promise<T[]> {
  const normalized = normalizeSql(sqlText);
  let lastErr: any;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const rows = await sqlClient.query(normalized, params);
      return rows as T[];
    } catch (err: any) {
      lastErr = err;
      if (attempt < retries) {
        console.warn(`⚠️ DB query attempt ${attempt} failed (${err?.message || err}). Retrying in ${150 * attempt}ms...`);
        await new Promise((r) => setTimeout(r, 150 * attempt));
      }
    }
  }
  console.error('Database query error after retries:', lastErr, '| SQL:', sqlText);
  throw lastErr;
}

/**
 * Compatible Pool wrapper providing pg-like interface backed by stateless HTTP client
 */
export const pool = {
  query: async (sqlText: string, params: any[] = []) => {
    const rows = await executeWithRetry(sqlText, params);
    return { rows, rowCount: Array.isArray(rows) ? rows.length : 0 };
  },
  end: async () => {},
};

export interface AppDatabase {
  query: <T = any>(sql: string, params?: any[]) => Promise<T[]>;
  queryOne: <T = any>(sql: string, params?: any[]) => Promise<T | null>;
  execute: (sql: string, params?: any[]) => Promise<{ rowCount: number }>;
  pool: typeof pool;
  [key: string]: any;
}

/**
 * Automatically ensures missing columns and tables exist in Database
 */
export async function ensureDatabaseSchema() {
  if (global._schemaInitPromise) return global._schemaInitPromise;

  global._schemaInitPromise = (async () => {
    try {
      // 1. Ensure team_applications table
      await executeWithRetry(`
        CREATE TABLE IF NOT EXISTS team_applications (
          id TEXT PRIMARY KEY,
          app_id TEXT UNIQUE NOT NULL,
          full_name TEXT NOT NULL,
          mobile_number TEXT NOT NULL,
          email TEXT NOT NULL,
          dob TEXT,
          address TEXT,
          instagram_url TEXT,
          about TEXT,
          status TEXT DEFAULT 'SUBMITTED',
          is_read INTEGER DEFAULT 0,
          read_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 2. Add is_read and read_at columns to application tables & ticket_orders if missing
      const tablesWithReadStatus = [
        'performer_applications',
        'guest_applications',
        'sponsor_applications',
        'event_booking_applications',
        'ticket_orders',
      ];

      for (const table of tablesWithReadStatus) {
        await executeWithRetry(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS is_read INTEGER DEFAULT 0`);
        await executeWithRetry(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE`);
      }

      // 3. Ensure computerji_scores table
      await executeWithRetry(`
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
      console.error('Schema auto-repair error:', err);
    }
  })();

  return global._schemaInitPromise;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  await ensureDatabaseSchema();
  return executeWithRetry<T>(sql, params);
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function execute(sql: string, params: any[] = []): Promise<{ rowCount: number }> {
  await ensureDatabaseSchema();
  const rows = await executeWithRetry(sql, params);
  return { rowCount: Array.isArray(rows) ? rows.length : 0 };
}

export const db: AppDatabase = {
  query,
  queryOne,
  execute,
  pool,
};

export function initDatabase() {
  ensureDatabaseSchema().catch((err) => console.error('initDatabase error:', err));
}

export default db;


