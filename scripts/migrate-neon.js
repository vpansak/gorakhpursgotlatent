import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const databaseUrl = 'postgresql://neondb_owner:npg_N3PsaDziloM4@ep-cold-paper-b5liftd3-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

async function init() {
  console.log('Starting Neon Postgres Schema Setup...');
  
  await pool.query(`
    -- Users Table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT DEFAULT 'USER' CHECK(role IN ('SUPER_ADMIN', 'ADMIN', 'STAFF', 'TICKET_STAFF', 'USER')),
      avatar_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Ticket Categories Table
    CREATE TABLE IF NOT EXISTS ticket_categories (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      available_qty INTEGER NOT NULL,
      max_per_order INTEGER DEFAULT 5,
      description TEXT,
      status TEXT DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'INACTIVE', 'SOLD_OUT')),
      sort_order INTEGER DEFAULT 0
    );

    -- Ticket Orders Table
    CREATE TABLE IF NOT EXISTS ticket_orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      user_id TEXT,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      event_id TEXT NOT NULL REFERENCES events(id),
      total_amount NUMERIC(10,2) NOT NULL,
      currency TEXT DEFAULT 'INR',
      payment_status TEXT DEFAULT 'PENDING' CHECK(payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
      confirmation_email_status TEXT DEFAULT 'PENDING' CHECK(confirmation_email_status IN ('PENDING', 'SENT', 'FAILED')),
      razorpay_order_id TEXT,
      razorpay_payment_id TEXT,
      razorpay_signature TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Tickets Table
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      ticket_number TEXT UNIQUE NOT NULL,
      order_id TEXT NOT NULL REFERENCES ticket_orders(id),
      category_id TEXT NOT NULL REFERENCES ticket_categories(id),
      event_id TEXT NOT NULL REFERENCES events(id),
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      qr_code_hash TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'VALID' CHECK(status IN ('VALID', 'USED', 'CANCELLED')),
      checked_in_at TIMESTAMP WITH TIME ZONE,
      checked_in_by TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Performer Applications
    CREATE TABLE IF NOT EXISTS performer_applications (
      id TEXT PRIMARY KEY,
      app_id TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      mobile_number TEXT NOT NULL,
      whatsapp_number TEXT NOT NULL,
      call_number TEXT,
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
      payment_amount NUMERIC(10,2) DEFAULT 199.00,
      payment_currency TEXT DEFAULT 'INR',
      payment_verified_at TIMESTAMP WITH TIME ZONE,
      application_status TEXT DEFAULT 'PAYMENT_PENDING',
      email_status TEXT DEFAULT 'PENDING',
      admin_email_status TEXT DEFAULT 'PENDING',
      admin_notes TEXT,
      refund_id TEXT,
      refund_amount NUMERIC(10,2),
      refund_status TEXT,
      refund_requested_at TIMESTAMP WITH TIME ZONE,
      refund_processed_at TIMESTAMP WITH TIME ZONE,
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
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Guest Applications (Panel Guests & Judges)
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
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Application Notes
    CREATE TABLE IF NOT EXISTS application_notes (
      id TEXT PRIMARY KEY,
      app_type TEXT NOT NULL,
      app_id TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      note TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Payments Audit Table
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      razorpay_order_id TEXT NOT NULL,
      razorpay_payment_id TEXT,
      razorpay_signature TEXT,
      amount NUMERIC(10,2) NOT NULL,
      currency TEXT DEFAULT 'INR',
      status TEXT NOT NULL,
      payment_method TEXT,
      error_code TEXT,
      error_description TEXT,
      raw_response TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Audit Logs
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      target_type TEXT,
      target_id TEXT,
      details TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Settings Table
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Dedicated Views for Paid vs All Performers
    CREATE OR REPLACE VIEW view_paid_performers AS
      SELECT * FROM performer_applications WHERE payment_status = 'PAID';

    CREATE OR REPLACE VIEW view_all_performers AS
      SELECT * FROM performer_applications;
  `);

  console.log('All tables and views created successfully!');

  // Check if admin exists
  const adminCheck = await pool.query("SELECT id FROM users WHERE email = 'admin@gorakhpurgotlatent.com'");
  if (adminCheck.rows.length === 0) {
    console.log('Seeding default admin user...');
    const hash = await bcrypt.hash('Malik@GGL2026', 10);
    await pool.query(`
      INSERT INTO users (id, email, phone, password_hash, full_name, role)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, ['user-admin-1', 'admin@gorakhpurgotlatent.com', '+919999999999', hash, 'Malik (Super Admin)', 'SUPER_ADMIN']);
    console.log('Admin user seeded: admin@gorakhpurgotlatent.com / Malik@GGL2026');
  }

  // Check if active event exists
  const eventCheck = await pool.query("SELECT id FROM events WHERE slug = 'gorakhpur-live-auditions-2026'");
  if (eventCheck.rows.length === 0) {
    console.log('Seeding default launch event...');
    await pool.query(`
      INSERT INTO events (id, title, slug, subtitle, description, event_date, start_time, venue_name, venue_address, city, capacity, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [
      'evt-ggl-2026-1',
      "Gorakhpur's Got Latent - Live Mega Auditions & Roast",
      'gorakhpur-live-auditions-2026',
      "Purvanchal's #1 Live Talent & Comedy Show",
      "Experience raw talent, hilarious judge roasts, and unscripted performances live in Gorakhpur.",
      '2026-09-26',
      '13:00',
      'Gorakhpur Club Ground',
      'Civil Lines, Near Golghar, Gorakhpur, UP 273001',
      'Gorakhpur',
      1000,
      'PUBLISHED'
    ]);

    // Add ticket categories
    await pool.query(`
      INSERT INTO ticket_categories (id, event_id, name, price, available_qty, description, sort_order)
      VALUES 
      ('cat-general', 'evt-ggl-2026-1', 'General Entry', 199.00, 500, 'Access to ground seating arena', 1),
      ('cat-vip', 'evt-ggl-2026-1', 'VIP Front Row', 499.00, 200, 'Front row seating & closest view to the stage', 2),
      ('cat-fan', 'evt-ggl-2026-1', 'Celebrity Fan Pit', 999.00, 50, 'Exclusive access with judge interaction zone & badge', 3)
    `);
    console.log('Event & ticket categories seeded!');
  }

  console.log('Neon Database Setup Complete!');
  await pool.end();
}

init().catch(e => {
  console.error('Setup failed:', e);
  process.exit(1);
});
