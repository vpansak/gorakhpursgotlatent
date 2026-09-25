import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || './data/ggl.db';
const fullPath = path.resolve(process.cwd(), dbPath);

const dir = path.dirname(fullPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(fullPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function createSchema() {
  db.exec(`
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

    CREATE TABLE IF NOT EXISTS performer_applications (
      id TEXT PRIMARY KEY,
      app_id TEXT UNIQUE NOT NULL,
      user_id TEXT,
      full_name TEXT NOT NULL,
      dob TEXT,
      gender TEXT,
      email TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      alt_phone TEXT,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      instagram_url TEXT,
      youtube_url TEXT,
      social_url TEXT,
      talent_category TEXT NOT NULL,
      primary_talent TEXT NOT NULL,
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
      status TEXT DEFAULT 'SUBMITTED' CHECK(status IN ('SUBMITTED', 'UNDER REVIEW', 'SHORTLISTED', 'INTERVIEW / AUDITION', 'APPROVED', 'REJECTED', 'ON HOLD')),
      tags TEXT DEFAULT '',
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

    CREATE TABLE IF NOT EXISTS application_notes (
      id TEXT PRIMARY KEY,
      app_type TEXT NOT NULL,
      app_id TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      note TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

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

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      action TEXT NOT NULL,
      target_type TEXT,
      target_id TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function seed() {
  console.log("🌱 Creating schema and seeding Gorakhpur's Got Latent Database...");
  createSchema();

  const superAdminPassword = await bcrypt.hash('admin123', 10);
  const staffPassword = await bcrypt.hash('staff123', 10);
  const scannerPassword = await bcrypt.hash('scanner123', 10);

  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, email, phone, password_hash, full_name, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertUser.run('usr-admin-01', 'admin@ggllive.in', '+919876543210', superAdminPassword, 'Executive Admin', 'SUPER_ADMIN');
  insertUser.run('usr-staff-01', 'staff@ggllive.in', '+919876543211', staffPassword, 'Show Manager', 'STAFF');
  insertUser.run('usr-scan-01', 'scanner@ggllive.in', '+919876543212', scannerPassword, 'Gate Ticket Scanner', 'TICKET_STAFF');

  const eventId = 'evt-ggl-s1-01';
  const insertEvent = db.prepare(`
    INSERT OR REPLACE INTO events (
      id, title, slug, subtitle, description, event_date, start_time, end_time,
      venue_name, venue_address, city, poster_url, banner_url, status, terms,
      sales_start_at, sales_end_at, capacity
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertEvent.run(
    eventId,
    "Gorakhpur's Got Latent - 1st Show Live Showcase",
    "ggl-season-1-live",
    "Where Talent Meets the Stage • Live Performance & Celebrity Roast",
    "Experience the biggest raw talent hunt and live entertainment phenomenon of Purvanchal! Watch top musicians, stand-up comedians, dancers, beatboxers, and unique performers compete live in front of celebrity judges.",
    "2026-09-26",
    "13:00",
    "18:00",
    "New Uday Marriage Lawn",
    "Near BRD Medical College, Gorakhpur, Uttar Pradesh",
    "Gorakhpur",
    "/logo.png",
    "/logo.png",
    "PUBLISHED",
    "1. Entry allowed only with a valid digital QR ticket.\n2. Gates open at 12:00 PM. Event starts strictly at 1:00 PM.\n3. Tickets are non-refundable.\n4. Age limit 12+.\n5. Outside food and professional cameras strictly prohibited.",
    "2026-09-01T00:00:00Z",
    "2026-09-26T13:00:00Z",
    1200
  );

  const insertCategory = db.prepare(`
    INSERT OR REPLACE INTO ticket_categories (
      id, event_id, name, price, available_qty, max_per_order, description, status, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCategory.run('cat-gen-01', eventId, 'General Entry Pass', 299.00, 600, 6, 'General seating area access. Live view of main stage, food stalls access.', 'ACTIVE', 1);
  insertCategory.run('cat-vip-02', eventId, 'VIP Fan Zone', 799.00, 300, 4, 'Front-middle row seating close to judges, express queue entry, official GGL wristband.', 'ACTIVE', 2);
  insertCategory.run('cat-vvip-03', eventId, 'VVIP Front Row & Backstage Pass', 1999.00, 50, 2, 'Exclusive Front Row Sofas directly in front of stage, VIP lounge access, Meet & Greet with judges & performers after show.', 'ACTIVE', 3);

  const insertPerformer = db.prepare(`
    INSERT OR REPLACE INTO performer_applications (
      id, app_id, full_name, dob, gender, email, whatsapp, city, state,
      talent_category, primary_talent, experience_yrs, short_bio, performance_desc,
      status, is_featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertPerformer.run('per-01', 'GGL-PER-109283', 'Aarav Sharma & The Desi Beat', '1999-05-12', 'Male', 'aarav.beat@gmail.com', '+919811223344', 'Gorakhpur', 'Uttar Pradesh', 'Music / Fusion', 'Bhojpuri Fusion Rock & Beatboxing', 5, 'High energy fusion band blending classical harmonium with modern beatboxing and electric guitar.', '10-minute explosive fusion performance combining folk melodies with modern hip-hop beats.', 'APPROVED', 1);
  insertPerformer.run('per-02', 'GGL-PER-847201', 'Riya Srivastav', '2001-08-20', 'Female', 'riya.dance@gmail.com', '+919822334455', 'Gorakhpur', 'Uttar Pradesh', 'Dance', 'Contemporary Semi-Classical', 4, 'National level solo dancer specializing in dramatic storytelling through movement.', 'Solo semi-classical dance performance on stage lighting effects.', 'APPROVED', 1);

  const insertGuest = db.prepare(`
    INSERT OR REPLACE INTO guest_applications (
      id, app_id, full_name, stage_name, email, whatsapp, city, profession, category,
      short_intro, why_ggl, status, is_featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertGuest.run('gst-01', 'GGL-GST-592019', 'Samarth Verma', 'Samarth Standup', 'samarth.comedy@gmail.com', '+919833445566', 'Lucknow', 'Standup Comedian & Content Creator', 'Celebrity Judge & Guest Host', 'Popular North Indian comedian with over 1.2M YouTube subscribers.', 'Excited to judge raw untapped talent in Gorakhpur and host the live roast round!', 'APPROVED', 1);

  const insertSponsor = db.prepare(`
    INSERT OR REPLACE INTO sponsor_applications (
      id, app_id, company_name, contact_person, biz_email, whatsapp, industry,
      sponsorship_type, preferred_package, message, status, is_featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertSponsor.run('spn-01', 'GGL-SPN-294012', 'Purvanchal Motors & EV', 'Vikramaditya Singh', 'sponsorship@purvanchalmotors.com', '+919844556677', 'Automotive & EV', 'Title Sponsor', 'Platinum Title Sponsor', 'Proud title sponsor empowering local youth and talent in Gorakhpur.', 'APPROVED', 1);

  console.log("🎉 Database seeded successfully!");
}

seed().catch(console.error);
