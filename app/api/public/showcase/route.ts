import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const performers = await db.query(`
      SELECT app_id, full_name, city, talent_category, primary_talent, short_bio, profile_photo_url
      FROM performer_applications
      WHERE status = 'APPROVED' AND is_featured = 1
    `);

    const guests = await db.query(`
      SELECT app_id, full_name, stage_name, city, profession, category, short_intro, profile_photo_url
      FROM guest_applications
      WHERE status = 'APPROVED' AND is_featured = 1
    `);

    const sponsors = await db.query(`
      SELECT app_id, company_name, industry, sponsorship_type, preferred_package, message, logo_url
      FROM sponsor_applications
      WHERE status = 'APPROVED' AND is_featured = 1
    `);

    const settingsRows = await db.query('SELECT key, value FROM settings');
    const settings: Record<string, string> = {};
    settingsRows.forEach((row: any) => {
      settings[row.key] = row.value;
    });

    return NextResponse.json({
      success: true,
      performers,
      guests,
      sponsors,
      settings,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch showcase content' }, { status: 500 });
  }
}
