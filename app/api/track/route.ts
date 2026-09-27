import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const appId = searchParams.get('appId')?.trim().toUpperCase();
    const email = searchParams.get('email')?.trim().toLowerCase();

    if (!appId || !email) {
      return NextResponse.json({ error: 'Both Application ID and Registered Email address are required to track application status.' }, { status: 400 });
    }

    let result: any = null;
    let type = '';

    // 1. Check performer_applications table by app_id and email
    result = await db.queryOne(`
      SELECT app_id, full_name, email, mobile_number, whatsapp_number, city, age,
             performance_category, performance_title, performance_type, performer_count,
             performance_duration, performance_language, special_requirements,
             payment_status, application_status, status, payment_amount, order_id,
             payment_id, payment_verified_at, created_at, updated_at
      FROM performer_applications
      WHERE app_id = ? AND LOWER(email) = ?
    `, [appId, email]);

    if (result) {
      type = 'Performer Application';
    } else {
      // 2. Check team_applications
      result = await db.queryOne('SELECT app_id, full_name, email, mobile_number, address, status, created_at, updated_at FROM team_applications WHERE app_id = ? AND LOWER(email) = ?', [appId, email]);
      if (result) {
        type = 'Crew & Team Application';
      } else {
        // 3. Check guest_applications
        result = await db.queryOne('SELECT app_id, full_name, email, category, city, status, created_at, updated_at FROM guest_applications WHERE app_id = ? AND LOWER(email) = ?', [appId, email]);
        if (result) {
          type = 'Guest / Influencer Application';
        } else {
          // 4. Check sponsor_applications (check both biz_email and email column fallback)
          result = await db.queryOne('SELECT app_id, company_name, biz_email AS email, contact_person, sponsorship_type, status, created_at, updated_at FROM sponsor_applications WHERE app_id = ? AND (LOWER(biz_email) = ? OR LOWER(email) = ?)', [appId, email, email]);
          if (result) {
            type = 'Brand Sponsor Application';
          } else {
            // 5. Check event_booking_applications
            result = await db.queryOne('SELECT app_id, org_name, email, contact_person, city, event_date, status, created_at, updated_at FROM event_booking_applications WHERE app_id = ? AND LOWER(email) = ?', [appId, email]);
            if (result) {
              type = 'Show Booking Application';
            }
          }
        }
      }
    }

    if (!result) {
      return NextResponse.json({ error: 'Invalid Application ID or Registered Email address. Please verify your registered credentials.' }, { status: 404 });
    }

    // Fetch status history timeline
    const history = await db.query('SELECT old_status, new_status, reason, created_at FROM application_status_history WHERE app_id = ? ORDER BY created_at ASC', [result.app_id]);

    return NextResponse.json({
      success: true,
      type,
      application: result,
      history,
    });
  } catch (err: any) {
    console.error('Error tracking application:', err);
    return NextResponse.json({ error: 'Error fetching application status' }, { status: 500 });
  }
}
