import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL || '';

let sqlClientInstance: any = null;

function getSqlClient() {
  if (!sqlClientInstance && databaseUrl) {
    sqlClientInstance = neon(databaseUrl);
  }
  return sqlClientInstance;
}

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
  const client = getSqlClient();
  if (!client) {
    console.warn('⚠️ DATABASE_URL environment variable is not configured.');
    return [];
  }

  const normalized = normalizeSql(sqlText);
  let lastErr: any;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const rows = await client.query(normalized, params);
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
 * Ensures all required PostgreSQL tables exist in Neon DB
 */
export async function ensureDatabaseSchema() {
  if (global._schemaInitPromise) return global._schemaInitPromise;

  global._schemaInitPromise = (async () => {
    const client = getSqlClient();
    if (!client) return;

    try {
      // 1. team_applications
      await client.query(`
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

      // 2. performer_applications
      await client.query(`
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
      `);

      // 3. guest_applications
      await client.query(`
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
      `);

      // 4. sponsor_applications
      await client.query(`
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

      // 5. ticket_orders
      await client.query(`
        CREATE TABLE IF NOT EXISTS ticket_orders (
          id TEXT PRIMARY KEY,
          order_number TEXT UNIQUE NOT NULL,
          user_id TEXT,
          customer_name TEXT NOT NULL,
          customer_email TEXT NOT NULL,
          customer_phone TEXT NOT NULL,
          event_id TEXT NOT NULL,
          total_amount NUMERIC(10,2) NOT NULL,
          currency TEXT DEFAULT 'INR',
          payment_status TEXT DEFAULT 'PENDING',
          confirmation_email_status TEXT DEFAULT 'PENDING',
          razorpay_order_id TEXT,
          razorpay_payment_id TEXT,
          razorpay_signature TEXT,
          is_read INTEGER DEFAULT 0,
          read_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 6. application_status_history
      await client.query(`
        CREATE TABLE IF NOT EXISTS application_status_history (
          id TEXT PRIMARY KEY,
          app_type TEXT NOT NULL,
          app_id TEXT NOT NULL,
          old_status TEXT,
          new_status TEXT NOT NULL,
          changed_by TEXT NOT NULL,
          reason TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 7. application_notes
      await client.query(`
        CREATE TABLE IF NOT EXISTS application_notes (
          id TEXT PRIMARY KEY,
          app_type TEXT NOT NULL,
          app_id TEXT NOT NULL,
          author_id TEXT NOT NULL,
          author_name TEXT NOT NULL,
          note TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 8. users
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          password_hash TEXT NOT NULL,
          full_name TEXT NOT NULL,
          role TEXT DEFAULT 'USER',
          avatar_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 9. admin_otps
      await client.query(`
        CREATE TABLE IF NOT EXISTS admin_otps (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          otp_hash TEXT NOT NULL,
          attempts INTEGER DEFAULT 0,
          max_attempts INTEGER DEFAULT 5,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          is_used INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 10. ticket_application
      await client.query(`CREATE TABLE IF NOT EXISTS ticket_application (id TEXT PRIMARY KEY, ticket_id TEXT UNIQUE NOT NULL, booking_id TEXT, customer_name TEXT NOT NULL, mobile TEXT NOT NULL, email TEXT NOT NULL, instagram_id TEXT NOT NULL, date_of_birth TEXT NOT NULL, quantity INTEGER DEFAULT 1, amount NUMERIC(10,2) DEFAULT 0, razorpay_order_id TEXT, razorpay_payment_id TEXT, payment_status TEXT DEFAULT 'PAID', ticket_status TEXT DEFAULT 'VALID', qr_token TEXT NOT NULL, checked_in INTEGER DEFAULT 0, checked_in_at TIMESTAMP WITH TIME ZONE, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);`);

      // 11. tickets
      await client.query(`
        CREATE TABLE IF NOT EXISTS tickets (
          id TEXT PRIMARY KEY,
          ticket_id TEXT UNIQUE NOT NULL,
          booking_id TEXT,
          customer_name TEXT NOT NULL,
          mobile TEXT NOT NULL,
          email TEXT NOT NULL,
          instagram_id TEXT NOT NULL,
          date_of_birth TEXT NOT NULL,
          quantity INTEGER DEFAULT 1,
          amount NUMERIC(10,2) DEFAULT 0,
          razorpay_order_id TEXT,
          razorpay_payment_id TEXT,
          payment_status TEXT DEFAULT 'PAID',
          ticket_status TEXT DEFAULT 'VALID',
          qr_token TEXT NOT NULL,
          checked_in INTEGER DEFAULT 0,
          checked_in_at TIMESTAMP WITH TIME ZONE,
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
    await ensureDatabaseSchema();
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
    await ensureDatabaseSchema();
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
