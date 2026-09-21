import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const appId = searchParams.get('appId')?.trim().toUpperCase();

    if (!appId) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }

    let result: any = null;
    let type = '';

    if (appId.startsWith('GGL-PER-')) {
      type = 'Performer Application';
      result = db.prepare('SELECT app_id, full_name, talent_category, primary_talent, city, status, created_at, updated_at FROM performer_applications WHERE app_id = ?').get(appId);
    } else if (appId.startsWith('GGL-GST-')) {
      type = 'Guest / Influencer Application';
      result = db.prepare('SELECT app_id, full_name, stage_name, category, city, status, created_at, updated_at FROM guest_applications WHERE app_id = ?').get(appId);
    } else if (appId.startsWith('GGL-SPN-')) {
      type = 'Brand Sponsor Application';
      result = db.prepare('SELECT app_id, company_name, contact_person, sponsorship_type, status, created_at, updated_at FROM sponsor_applications WHERE app_id = ?').get(appId);
    } else if (appId.startsWith('GGL-EVT-')) {
      type = 'Show Booking Application';
      result = db.prepare('SELECT app_id, org_name, contact_person, city, event_date, status, created_at, updated_at FROM event_booking_applications WHERE app_id = ?').get(appId);
    } else {
      return NextResponse.json({ error: 'Invalid Application ID format. Example: GGL-PER-123456' }, { status: 400 });
    }

    if (!result) {
      return NextResponse.json({ error: `No application found for ID: ${appId}` }, { status: 404 });
    }

    // Fetch status history timeline
    const history = db.prepare('SELECT old_status, new_status, reason, created_at FROM application_status_history WHERE app_id = ? ORDER BY created_at ASC').all(appId);

    return NextResponse.json({
      success: true,
      type,
      application: result,
      history,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Error fetching application status' }, { status: 500 });
  }
}
