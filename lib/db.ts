import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_pay1mTgz2qSi@ep-fancy-voice-b52wvbws-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL environment variable is not explicitly set; using default Neon pooler connection.');
}

declare global {
  var _neonPool: Pool | undefined;
  var _schemaInitPromise: Promise<void> | undefined;
}

// Singleton connection pool for Next.js hot-reloading
export const pool: Pool = global._neonPool || new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
});

if (process.env.NODE_ENV !== 'production') {
  global._neonPool = pool;
}

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

/**
 * Automatically ensures missing columns and tables exist in Neon DB
 */
export async function ensureDatabaseSchema() {
  if (global._schemaInitPromise) return global._schemaInitPromise;

  global._schemaInitPromise = (async () => {
    try {
      // 1. Ensure team_applications table
      await pool.query(`
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
        await pool.query(`
          ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS is_read INTEGER DEFAULT 0;
          ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;
        `);
      }

      // 3. Ensure computerji_scores table
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
      console.error('Schema auto-repair error:', err);
    }
  })();

  return global._schemaInitPromise;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  await ensureDatabaseSchema();
  try {
    const normalized = normalizeSql(sql);
    const result = await pool.query(normalized, params);
    return result.rows as T[];
  } catch (err) {
    console.error('Database query error:', err, '| SQL:', sql);
    throw err;
  }
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function execute(sql: string, params: any[] = []): Promise<{ rowCount: number }> {
  await ensureDatabaseSchema();
  try {
    const normalized = normalizeSql(sql);
    const result = await pool.query(normalized, params);
    return { rowCount: result.rowCount || 0 };
  } catch (err) {
    console.error('Database execute error:', err, '| SQL:', sql);
    throw err;
  }
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

