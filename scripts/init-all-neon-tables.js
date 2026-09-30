import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_kBRNLDK9ne7A@ep-ancient-hill-b5xedkzo-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(databaseUrl);

async function createAllTables() {
  console.log("🚀 Creating all missing tables in Neon PostgreSQL Database...");

  try {
    // 1. users table
    await sql`
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
    `;
    console.log("✓ Table 'users' created/verified");

    // 2. events table
    await sql`
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
        status TEXT DEFAULT 'PUBLISHED',
        terms TEXT,
        sales_start_at TEXT,
        sales_end_at TEXT,
        capacity INTEGER DEFAULT 1000,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("✓ Table 'events' created/verified");

    // 3. ticket_categories table
    await sql`
      CREATE TABLE IF NOT EXISTS ticket_categories (
        id TEXT PRIMARY KEY,
        event_id TEXT NOT NULL,
        name TEXT NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        available_qty INTEGER NOT NULL,
        max_per_order INTEGER DEFAULT 5,
        description TEXT,
        status TEXT DEFAULT 'ACTIVE',
        sort_order INTEGER DEFAULT 0
      );
    `;
    console.log("✓ Table 'ticket_categories' created/verified");

    // 4. ticket_orders table
    await sql`
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
    `;
    console.log("✓ Table 'ticket_orders' created/verified");

    // 5. tickets table
    await sql`
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
        status TEXT DEFAULT 'VALID',
        checked_in_at TIMESTAMP WITH TIME ZONE,
        checked_in_by TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("✓ Table 'tickets' created/verified");

    // 6. performer_applications table
    await sql`
      CREATE TABLE IF NOT EXISTS performer_applications (
        id TEXT PRIMARY KEY,
        app_id TEXT UNIQUE NOT NULL,
        user_id TEXT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        mobile_number TEXT NOT NULL,
        whatsapp_number TEXT,
        call_number TEXT,
        alt_phone TEXT,
        dob TEXT,
        gender TEXT,
        city TEXT NOT NULL,
        state TEXT DEFAULT 'Uttar Pradesh',
        instagram_url TEXT,
        youtube_url TEXT,
        social_url TEXT,
        talent_category TEXT,
        primary_talent TEXT,
        performance_category TEXT,
        performance_title TEXT,
        performance_description TEXT,
        performance_type TEXT,
        performer_count INTEGER DEFAULT 1,
        performance_duration TEXT,
        performance_language TEXT,
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
        payment_status TEXT DEFAULT 'PENDING_WHATSAPP',
        payment_amount NUMERIC(10,2) DEFAULT 199.00,
        payment_id TEXT,
        order_id TEXT,
        application_status TEXT DEFAULT 'SUBMITTED',
        status TEXT DEFAULT 'SUBMITTED',
        tags TEXT DEFAULT '',
        is_featured INTEGER DEFAULT 0,
        is_read INTEGER DEFAULT 0,
        read_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("✓ Table 'performer_applications' created/verified");

    // 7. guest_applications table
    await sql`
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
        status TEXT DEFAULT 'SUBMITTED',
        tags TEXT DEFAULT '',
        is_featured INTEGER DEFAULT 0,
        is_read INTEGER DEFAULT 0,
        read_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("✓ Table 'guest_applications' created/verified");

    // 8. sponsor_applications table
    await sql`
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
        status TEXT DEFAULT 'SUBMITTED',
        tags TEXT DEFAULT '',
        is_featured INTEGER DEFAULT 0,
        is_read INTEGER DEFAULT 0,
        read_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("✓ Table 'sponsor_applications' created/verified");

    // 9. event_booking_applications table
    await sql`
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
        status TEXT DEFAULT 'SUBMITTED',
        tags TEXT DEFAULT '',
        is_read INTEGER DEFAULT 0,
        read_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("✓ Table 'event_booking_applications' created/verified");

    // 10. team_applications table
    await sql`
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
    `;
    console.log("✓ Table 'team_applications' created/verified");

    // 11. application_notes table
    await sql`
      CREATE TABLE IF NOT EXISTS application_notes (
        id TEXT PRIMARY KEY,
        app_type TEXT NOT NULL,
        app_id TEXT NOT NULL,
        author_id TEXT NOT NULL,
        author_name TEXT NOT NULL,
        note TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("✓ Table 'application_notes' created/verified");

    // 12. application_status_history table
    await sql`
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
    `;
    console.log("✓ Table 'application_status_history' created/verified");

    // 13. computerji_scores table
    await sql`
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
    `;
    console.log("✓ Table 'computerji_scores' created/verified");

    console.log("🎉 ALL NEON POSTGRESQL TABLES CREATED SUCCESSFULLY!");
  } catch (err) {
    console.error("❌ Error creating Neon tables:", err);
  }
}

createAllTables();
