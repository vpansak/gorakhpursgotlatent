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
async function executeWithRetry<T = any>(sqlText: string, params: any[] = [], retries = 2): Promise<T[]> {
  const normalized = normalizeSql(sqlText);
  let lastErr: any;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const rows = await sqlClient.query(normalized, params);
      return (rows || []) as T[];
    } catch (err: any) {
      lastErr = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 100 * attempt));
      }
    }
  }
  console.warn('Database query notice (using safe fallback):', lastErr?.message || lastErr, '| SQL:', sqlText);
  return [];
}

/**
 * Compatible Pool wrapper providing pg-like interface backed by stateless HTTP client
 */
export const pool = {
  query: async (sqlText: string, params: any[] = []) => {
    try {
      const rows = await executeWithRetry(sqlText, params);
      return { rows, rowCount: Array.isArray(rows) ? rows.length : 0 };
    } catch (err) {
      console.warn('pool.query notice:', err);
      return { rows: [], rowCount: 0 };
    }
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
 * Lightweight database schema initialization (non-blocking)
 */
export async function ensureDatabaseSchema() {
  if (global._schemaInitPromise) return global._schemaInitPromise;

  global._schemaInitPromise = (async () => {
    try {
      await sqlClient.query(`
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

        CREATE TABLE IF NOT EXISTS performer_applications (
          id TEXT PRIMARY KEY,
          app_id TEXT UNIQUE NOT NULL,
          user_id TEXT,
          full_name TEXT NOT NULL,
          email TEXT NOT NULL,
          mobile_number TEXT NOT NULL,
          whatsapp_number TEXT,
          call_number TEXT,
          city TEXT NOT NULL,
          state TEXT DEFAULT 'Uttar Pradesh',
          instagram_url TEXT,
          performance_category TEXT,
          performance_title TEXT,
          performance_description TEXT,
          performance_type TEXT,
          performer_count INTEGER DEFAULT 1,
          performance_duration TEXT,
          performance_language TEXT,
          payment_status TEXT DEFAULT 'PENDING_WHATSAPP',
          payment_amount NUMERIC(10,2) DEFAULT 199.00,
          application_status TEXT DEFAULT 'SUBMITTED',
          status TEXT DEFAULT 'SUBMITTED',
          tags TEXT DEFAULT '',
          is_featured INTEGER DEFAULT 0,
          is_read INTEGER DEFAULT 0,
          read_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS guest_applications (
          id TEXT PRIMARY KEY,
          app_id TEXT UNIQUE NOT NULL,
          user_id TEXT,
          full_name TEXT NOT NULL,
          stage_name TEXT,
          dob TEXT,
          email TEXT NOT NULL,
          whatsapp TEXT NOT NULL,
          phone TEXT,
          instagram_url TEXT,
          youtube_url TEXT,
          social_url TEXT,
          city TEXT NOT NULL,
          location TEXT,
          profession TEXT,
          category TEXT NOT NULL,
          short_intro TEXT,
          why_ggl TEXT,
          status TEXT DEFAULT 'SUBMITTED',
          tags TEXT DEFAULT '',
          is_featured INTEGER DEFAULT 0,
          is_read INTEGER DEFAULT 0,
          read_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sponsor_applications (
          id TEXT PRIMARY KEY,
          app_id TEXT UNIQUE NOT NULL,
          user_id TEXT,
          company_name TEXT NOT NULL,
          contact_person TEXT NOT NULL,
          designation TEXT,
          biz_email TEXT NOT NULL,
          whatsapp TEXT NOT NULL,
          phone TEXT,
          website TEXT,
          instagram_url TEXT,
          social_url TEXT,
          industry TEXT,
          location TEXT,
          description TEXT,
          sponsorship_type TEXT,
          budget_est TEXT,
          preferred_package TEXT,
          message TEXT,
          status TEXT DEFAULT 'SUBMITTED',
          tags TEXT DEFAULT '',
          is_featured INTEGER DEFAULT 0,
          is_read INTEGER DEFAULT 0,
          read_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (err) {
      console.warn('Schema init notice:', err);
    }
  })();

  return global._schemaInitPromise;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    return await executeWithRetry<T>(sql, params);
  } catch (err) {
    console.warn('db.query notice:', err);
    return [];
  }
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function execute(sql: string, params: any[] = []): Promise<{ rowCount: number }> {
  try {
    const rows = await executeWithRetry(sql, params);
    return { rowCount: Array.isArray(rows) ? rows.length : 0 };
  } catch (err) {
    console.warn('db.execute notice:', err);
    return { rowCount: 0 };
  }
}

export const db: AppDatabase = {
  query,
  queryOne,
  execute,
  pool,
};

export function initDatabase() {
  ensureDatabaseSchema().catch((err) => console.warn('initDatabase notice:', err));
}

export default db;
