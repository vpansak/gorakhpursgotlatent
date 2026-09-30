import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawAppId = searchParams.get('appId')?.trim();
    const rawEmail = searchParams.get('email')?.trim();

    if (!rawAppId || !rawEmail) {
      return NextResponse.json({ error: 'Both Application ID and Registered Email address are required to track application status.' }, { status: 400 });
    }

    const appIdUpper = rawAppId.toUpperCase();
    const emailLower = rawEmail.toLowerCase();

    let result: any = null;
    let type = '';

    // 1. Check performer_applications table (case-insensitive on app_id/id and email)
    result = await db.queryOne(`
      SELECT app_id, full_name, email, mobile_number, whatsapp_number, city, age,
             performance_category, performance_title, performance_type, performer_count,
             performance_duration, performance_language, special_requirements,
             payment_status, application_status, status, payment_amount, order_id,
             payment_id, payment_verified_at, created_at, updated_at
      FROM performer_applications
      WHERE (UPPER(TRIM(app_id)) = ? OR UPPER(TRIM(id)) = ?) AND LOWER(TRIM(email)) = ?
    `, [appIdUpper, appIdUpper, emailLower]);

    if (result) {
      type = 'Performer Application';
    } else {
      // 2. Check team_applications
      result = await db.queryOne(`
        SELECT app_id, full_name, email, mobile_number, address, status, created_at, updated_at
        FROM team_applications
        WHERE (UPPER(TRIM(app_id)) = ? OR UPPER(TRIM(id)) = ?) AND LOWER(TRIM(email)) = ?
      `, [appIdUpper, appIdUpper, emailLower]);

      if (result) {
        type = 'Crew & Team Application';
      } else {
        // 3. Check guest_applications
        result = await db.queryOne(`
          SELECT app_id, full_name, email, category, city, status, created_at, updated_at
          FROM guest_applications
          WHERE (UPPER(TRIM(app_id)) = ? OR UPPER(TRIM(id)) = ?) AND LOWER(TRIM(email)) = ?
        `, [appIdUpper, appIdUpper, emailLower]);

        if (result) {
          type = 'Guest / Influencer Application';
        } else {
          // 4. Check sponsor_applications (check both biz_email and email column fallback)
          result = await db.queryOne(`
            SELECT app_id, company_name, biz_email AS email, contact_person, sponsorship_type, status, created_at, updated_at
            FROM sponsor_applications
            WHERE (UPPER(TRIM(app_id)) = ? OR UPPER(TRIM(id)) = ?) AND LOWER(TRIM(biz_email)) = ?
          `, [appIdUpper, appIdUpper, emailLower]);

          if (result) {
            type = 'Brand Sponsor Application';
          } else {
            // 5. Check event_booking_applications
            result = await db.queryOne(`
              SELECT app_id, org_name, email, contact_person, city, event_date, status, created_at, updated_at
              FROM event_booking_applications
              WHERE (UPPER(TRIM(app_id)) = ? OR UPPER(TRIM(id)) = ?) AND LOWER(TRIM(email)) = ?
            `, [appIdUpper, appIdUpper, emailLower]);

            if (result) {
              type = 'Show Booking Application';
            } else {
              // 6. Check ticket_orders fallback (for audience ticket orders)
              result = await db.queryOne(`
                SELECT order_number AS app_id, customer_name AS full_name, customer_email AS email,
                       customer_phone AS mobile_number, total_amount, payment_status AS status,
                       created_at, updated_at
                FROM ticket_orders
                WHERE (UPPER(TRIM(order_number)) = ? OR UPPER(TRIM(id)) = ?) AND LOWER(TRIM(customer_email)) = ?
              `, [appIdUpper, appIdUpper, emailLower]);

              if (result) {
                type = 'Audience Ticket Order';
              }
            }
          }
        }
      }
    }

    if (!result) {
      return NextResponse.json({ error: 'Invalid Application ID or Registered Email address. Please verify your registered credentials.' }, { status: 404 });
    }

    // Fetch status history timeline
    const history = await db.query(
      'SELECT old_status, new_status, reason, created_at FROM application_status_history WHERE UPPER(app_id) = ? ORDER BY created_at ASC',
      [appIdUpper]
    );

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

