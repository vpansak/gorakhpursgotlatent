import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
const sql = neon(databaseUrl);

async function insertTestAlokEntries() {
  console.log("🚀 Inserting test 'Alok' entries into all 4 categories...");

  try {
    // 1. Performer Test Entry
    await sql`
      INSERT INTO performer_applications (
        id, app_id, full_name, email, mobile_number, whatsapp_number, call_number,
        city, state, talent_category, primary_talent, performance_category, performance_title,
        performance_description, performance_type, performer_count, performance_duration,
        performance_language, experience_yrs, short_bio, status, application_status, payment_status
      ) VALUES (
        'per-alok-test-01',
        'GGL-PER-884920',
        'Alok Singh',
        'alok.performer@gmail.com',
        '+918423858424',
        '+918423858424',
        '+918423858424',
        'Gorakhpur',
        'Uttar Pradesh',
        'Standup Comedy & Singing',
        'Standup Comedy & Vocal Fusion',
        'Standup Comedy',
        'Purvanchal Comedy Special',
        '10-minute live standup comedy performance on Gorakhpur stage',
        'Solo',
        1,
        '10 Minutes',
        'Hindi / Bhojpuri',
        3,
        'Popular Standup Comedian and Creator from Gorakhpur',
        'SUBMITTED',
        'SUBMITTED',
        'PENDING_WHATSAPP'
      ) ON CONFLICT (app_id) DO NOTHING;
    `;
    console.log("✓ Performer entry created for 'Alok Singh' (ID: GGL-PER-884920)");

    // 2. Guest Test Entry
    await sql`
      INSERT INTO guest_applications (
        id, app_id, full_name, stage_name, email, whatsapp, phone, city,
        profession, category, short_intro, status
      ) VALUES (
        'gst-alok-test-01',
        'GGL-GST-773910',
        'Alok Singh',
        'Alok Live',
        'alok.guest@gmail.com',
        '+918423858424',
        '+918423858424',
        'Gorakhpur',
        'Content Creator & Celebrity Host',
        'Celebrity Judge & Guest Host',
        'Purvanchal top content creator and guest judge for live showcase.',
        'SUBMITTED'
      ) ON CONFLICT (app_id) DO NOTHING;
    `;
    console.log("✓ Guest entry created for 'Alok Singh' (ID: GGL-GST-773910)");

    // 3. Sponsor Test Entry
    await sql`
      INSERT INTO sponsor_applications (
        id, app_id, company_name, contact_person, designation, biz_email,
        whatsapp, phone, industry, sponsorship_type, budget_est, status
      ) VALUES (
        'spn-alok-test-01',
        'GGL-SPN-992041',
        'Alok Motors & Technology',
        'Alok Singh',
        'Founder & CEO',
        'alok.sponsor@alokmotors.com',
        '+918423858424',
        '+918423858424',
        'Automobile & Tech',
        'Platinum Title Sponsor',
        '₹5,00,000 Title Placement',
        'SUBMITTED'
      ) ON CONFLICT (app_id) DO NOTHING;
    `;
    console.log("✓ Sponsor entry created for 'Alok Motors (Alok Singh)' (ID: GGL-SPN-992041)");

    // 4. Team Test Entry
    await sql`
      INSERT INTO team_applications (
        id, app_id, full_name, mobile_number, email, address, about, status
      ) VALUES (
        'tem-alok-test-01',
        'GGL-EVT-662910',
        'Alok Singh',
        '+918423858424',
        'alok.team@gmail.com',
        'Civil Lines, Gorakhpur',
        'Lead Event Production & Live Operations Specialist',
        'SUBMITTED'
      ) ON CONFLICT (app_id) DO NOTHING;
    `;
    console.log("✓ Team entry created for 'Alok Singh' (ID: GGL-EVT-662910)");

    console.log("🎉 ALL TEST ENTRIES FOR 'ALOK SINGH' INSERTED SUCCESSFULLY!");
  } catch (err) {
    console.error("❌ Error inserting test entries:", err);
  }
}

insertTestAlokEntries();
