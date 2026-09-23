import Database from 'better-sqlite3';
import { Pool } from 'pg';
import path from 'path';
import fs from 'fs';

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

const dbPath = process.env.DATABASE_PATH || './data/ggl.db';
const fullPath = path.resolve(process.cwd(), dbPath);

// Ensure directory exists
const dir = path.dirname(fullPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Initialize SQLite database instance
const rawDb = new Database(fullPath);

// Enable Foreign Keys and WAL Mode for high performance
rawDb.pragma('journal_mode = WAL');
rawDb.pragma('foreign_keys = ON');

export type AppDatabase = typeof rawDb & {
  query: <T = any>(sql: string, params?: any[]) => Promise<T[]>;
  queryOne: <T = any>(sql: string, params?: any[]) => Promise<T | null>;
  execute: (sql: string, params?: any[]) => Promise<{ rowCount: number }>;
  pool: Pool;
};

export const db: AppDatabase = rawDb as AppDatabase;

export function initDatabase() {
  db.exec(`
    -- Users Table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT DEFAULT 'USER' CHECK(role IN ('SUPER_ADMIN', 'ADMIN', 'STAFF', 'TICKET_STAFF', 'USER')),
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Events Table
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      subtitle TEXT,
      description TEXT,
      event_date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT,
      venue_name TEXT NOT NULL,
      venue_address TEXT NOT NULL,
      city TEXT NOT NULL,
      poster_url TEXT,
      banner_url TEXT,
      status TEXT DEFAULT 'PUBLISHED' CHECK(status IN ('DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED')),
      terms TEXT,
      sales_start_at TEXT,
      sales_end_at TEXT,
      capacity INTEGER DEFAULT 1000,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Ticket Categories Table
    CREATE TABLE IF NOT EXISTS ticket_categories (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      available_qty INTEGER NOT NULL,
      max_per_order INTEGER DEFAULT 5,
      description TEXT,
      status TEXT DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'INACTIVE', 'SOLD_OUT')),
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );

    -- Ticket Orders Table
    CREATE TABLE IF NOT EXISTS ticket_orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      user_id TEXT,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      event_id TEXT NOT NULL,
      total_amount REAL NOT NULL,
      currency TEXT DEFAULT 'INR',
      payment_status TEXT DEFAULT 'PENDING' CHECK(payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
      confirmation_email_status TEXT DEFAULT 'PENDING' CHECK(confirmation_email_status IN ('PENDING', 'SENT', 'FAILED')),
      razorpay_order_id TEXT,
      razorpay_payment_id TEXT,
      razorpay_signature TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id)
    );

    -- Tickets Table
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      ticket_number TEXT UNIQUE NOT NULL,
      order_id TEXT NOT NULL,
      category_id TEXT NOT NULL,
      event_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      qr_code_hash TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'VALID' CHECK(status IN ('VALID', 'USED', 'CANCELLED')),
      checked_in_at DATETIME,
      checked_in_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES ticket_orders(id),
      FOREIGN KEY (category_id) REFERENCES ticket_categories(id),
      FOREIGN KEY (event_id) REFERENCES events(id)
    );

    -- Performer Applications
    CREATE TABLE IF NOT EXISTS performer_applications (
      id TEXT PRIMARY KEY,
      app_id TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      mobile_number TEXT NOT NULL,
      whatsapp_number TEXT NOT NULL,
      alternate_contact TEXT,
      performance_category TEXT NOT NULL,
      performance_title TEXT NOT NULL,
      performance_description TEXT NOT NULL,
      performance_type TEXT,
      performer_count INTEGER DEFAULT 1,
      performance_duration TEXT,
      performance_language TEXT,
      special_requirements TEXT,
      instagram_url TEXT,
      youtube_url TEXT,
      facebook_url TEXT,
      city TEXT NOT NULL,
      age INTEGER NOT NULL,
      discovery_source TEXT,
      additional_message TEXT,
      payment_status TEXT DEFAULT 'PAYMENT_PENDING',
      payment_id TEXT,
      order_id TEXT,
      payment_amount REAL DEFAULT 199.00,
      payment_currency TEXT DEFAULT 'INR',
      payment_verified_at DATETIME,
      application_status TEXT DEFAULT 'PAYMENT_PENDING',
      email_status TEXT DEFAULT 'PENDING',
      admin_email_status TEXT DEFAULT 'PENDING',
      refund_id TEXT,
      refund_amount REAL,
      refund_status TEXT,
      refund_requested_at DATETIME,
      refund_processed_at DATETIME,
      refund_reason TEXT,
      user_id TEXT,
      dob TEXT,
      gender TEXT,
      state TEXT,
      social_url TEXT,
      talent_category TEXT,
      primary_talent TEXT,
      experience_yrs INTEGER DEFAULT 0,
      short_bio TEXT,
      performance_desc TEXT,
      achievements TEXT,
      duration TEXT,
      preferred_type TEXT,
      stage_req TEXT,
      sound_req TEXT,
      equipment_req TEXT,
      travel_req TEXT,
      accommodation_req TEXT,
      important_info TEXT,
      profile_photo_url TEXT,
      perf_photo_url TEXT,
      doc_url TEXT,
      opt_doc_url TEXT,
      status TEXT DEFAULT 'PAYMENT_PENDING',
      tags TEXT DEFAULT '',
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Auto-migrate missing columns for performer_applications
  try {
    const columns = (db.prepare("PRAGMA table_info(performer_applications)").all() as any[]).map(c => c.name);
    const requiredCols = [
      { name: 'call_number', type: 'TEXT' },
      { name: 'admin_notes', type: 'TEXT' },
      { name: 'mobile_number', type: 'TEXT' },
      { name: 'whatsapp_number', type: 'TEXT' },
      { name: 'alternate_contact', type: 'TEXT' },
      { name: 'performance_category', type: 'TEXT' },
      { name: 'performance_title', type: 'TEXT' },
      { name: 'performance_description', type: 'TEXT' },
      { name: 'performance_type', type: 'TEXT' },
      { name: 'performer_count', type: 'INTEGER DEFAULT 1' },
      { name: 'performance_duration', type: 'TEXT' },
      { name: 'performance_language', type: 'TEXT' },
      { name: 'special_requirements', type: 'TEXT' },
      { name: 'facebook_url', type: 'TEXT' },
      { name: 'age', type: 'INTEGER' },
      { name: 'discovery_source', type: 'TEXT' },
      { name: 'additional_message', type: 'TEXT' },
      { name: 'payment_status', type: "TEXT DEFAULT 'PAYMENT_PENDING'" },
      { name: 'payment_id', type: 'TEXT' },
      { name: 'order_id', type: 'TEXT' },
      { name: 'payment_amount', type: 'REAL DEFAULT 199.00' },
      { name: 'payment_currency', type: "TEXT DEFAULT 'INR'" },
      { name: 'payment_verified_at', type: 'DATETIME' },
      { name: 'application_status', type: "TEXT DEFAULT 'PAYMENT_PENDING'" },
      { name: 'email_status', type: "TEXT DEFAULT 'PENDING'" },
      { name: 'admin_email_status', type: "TEXT DEFAULT 'PENDING'" },
      { name: 'refund_id', type: 'TEXT' },
      { name: 'refund_amount', type: 'REAL' },
      { name: 'refund_status', type: 'TEXT' },
      { name: 'refund_requested_at', type: 'DATETIME' },
      { name: 'refund_processed_at', type: 'DATETIME' },
      { name: 'refund_reason', type: 'TEXT' },
    ];

    for (const col of requiredCols) {
      if (!columns.includes(col.name)) {
        db.exec(`ALTER TABLE performer_applications ADD COLUMN ${col.name} ${col.type}`);
      }
    }
  } catch (err) {
    console.error('Migration error on performer_applications:', err);
  }

  db.exec(`
    -- Guest Applications
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
      previous_shows TEXT,
      social_info TEXT,
      management_name TEXT,
      manager_contact TEXT,
      availability TEXT,
      preferred_date TEXT,
      travel_req TEXT,
      accommodation_req TEXT,
      special_req TEXT,
      important_info TEXT,
      profile_photo_url TEXT,
      press_kit_url TEXT,
      doc_url TEXT,
      status TEXT DEFAULT 'SUBMITTED' CHECK(status IN ('SUBMITTED', 'UNDER REVIEW', 'CONTACTED', 'SHORTLISTED', 'APPROVED', 'SCHEDULED', 'COMPLETED', 'REJECTED')),
      tags TEXT DEFAULT '',
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Sponsor Applications
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
      campaign_obj TEXT,
      expected_audience TEXT,
      event_preference TEXT,
      message TEXT,
      requirements TEXT,
      logo_url TEXT,
      brand_deck_url TEXT,
      doc_url TEXT,
      status TEXT DEFAULT 'SUBMITTED' CHECK(status IN ('SUBMITTED', 'UNDER REVIEW', 'CONTACTED', 'NEGOTIATION', 'PROPOSAL SENT', 'APPROVED', 'ACTIVE', 'COMPLETED', 'REJECTED')),
      tags TEXT DEFAULT '',
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Event Booking Applications
    CREATE TABLE IF NOT EXISTS event_booking_applications (
      id TEXT PRIMARY KEY,
      app_id TEXT UNIQUE NOT NULL,
      user_id TEXT,
      org_name TEXT NOT NULL,
      contact_person TEXT NOT NULL,
      email TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      phone TEXT,
      city TEXT NOT NULL,
      venue TEXT,
      event_date TEXT,
      expected_audience TEXT,
      event_type TEXT,
      event_desc TEXT,
      perf_duration TEXT,
      budget_range TEXT,
      travel_req TEXT,
      accommodation_req TEXT,
      tech_req TEXT,
      stage_req TEXT,
      add_info TEXT,
      doc_url TEXT,
      status TEXT DEFAULT 'SUBMITTED' CHECK(status IN ('SUBMITTED', 'UNDER REVIEW', 'CONTACTED', 'DISCUSSION', 'PROPOSAL', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
      tags TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Team / Volunteer Applications
    CREATE TABLE IF NOT EXISTS team_applications (
      id TEXT PRIMARY KEY,
      app_id TEXT UNIQUE NOT NULL,
      user_id TEXT,
      full_name TEXT NOT NULL,
      mobile_number TEXT NOT NULL,
      email TEXT NOT NULL,
      dob TEXT,
      address TEXT NOT NULL,
      instagram_url TEXT,
      about TEXT,
      status TEXT DEFAULT 'SUBMITTED' CHECK(status IN ('SUBMITTED', 'UNDER REVIEW', 'CONTACTED', 'SHORTLISTED', 'APPROVED', 'REJECTED')),
      tags TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Application Notes
    CREATE TABLE IF NOT EXISTS application_notes (
      id TEXT PRIMARY KEY,
      app_type TEXT NOT NULL,
      app_id TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      note TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Application Status History
    CREATE TABLE IF NOT EXISTS application_status_history (
      id TEXT PRIMARY KEY,
      app_type TEXT NOT NULL,
      app_id TEXT NOT NULL,
      old_status TEXT,
      new_status TEXT NOT NULL,
      changed_by TEXT NOT NULL,
      reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Payments Audit Table
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      razorpay_order_id TEXT NOT NULL,
      razorpay_payment_id TEXT,
      razorpay_signature TEXT,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'INR',
      status TEXT NOT NULL,
      payment_method TEXT,
      error_code TEXT,
      error_description TEXT,
      raw_response TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES ticket_orders(id)
    );

    -- Audit Logs
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      target_type TEXT,
      target_id TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Settings Table
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Auto initialize schema on module load
initDatabase();

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const normalized = normalizeSql(sql);
    const result = await pool.query(normalized, params);
    return result.rows as T[];
  } catch (neonErr) {
    try {
      const stmt = rawDb.prepare(sql);
      return stmt.all(...params) as T[];
    } catch (err) {
      console.error('Database query fallback error:', err);
      return [];
    }
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
  } catch (neonErr) {
    console.error('Neon execute error:', neonErr);
  }

  // Also dual-write to local SQLite if applicable
  try {
    const stmt = rawDb.prepare(sql);
    const res = stmt.run(...params);
    if (!rowCount) rowCount = res.changes;
  } catch (e) {}

  return { rowCount };
}

// Assign to db object as well for convenience
(db as any).query = query;
(db as any).queryOne = queryOne;
(db as any).execute = execute;
(db as any).pool = pool;

