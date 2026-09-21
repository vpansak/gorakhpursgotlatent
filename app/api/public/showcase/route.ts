import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const performers = db.prepare(`
      SELECT app_id, full_name, city, talent_category, primary_talent, short_bio, profile_photo_url
      FROM performer_applications
      WHERE status = 'APPROVED' AND is_featured = 1
    `).all();

    const guests = db.prepare(`
      SELECT app_id, full_name, stage_name, city, profession, category, short_intro, profile_photo_url
      FROM guest_applications
      WHERE status = 'APPROVED' AND is_featured = 1
    `).all();

    const sponsors = db.prepare(`
      SELECT app_id, company_name, industry, sponsorship_type, preferred_package, message, logo_url
      FROM sponsor_applications
      WHERE status = 'APPROVED' AND is_featured = 1
    `).all();

    const settingsRows = db.prepare('SELECT key, value FROM settings').all() as any[];
    const settings: Record<string, string> = {};
    settingsRows.forEach(row => {
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
