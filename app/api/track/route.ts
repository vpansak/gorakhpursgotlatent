import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawAppId = searchParams.get('appId')?.trim() || '';
    const rawEmail = searchParams.get('email')?.trim() || '';
    const rawQuery = searchParams.get('query')?.trim() || '';

    const effectiveId = rawAppId || rawQuery;
    const effectiveEmail = rawEmail || (!rawAppId ? rawQuery : '');

    if (!effectiveId && !effectiveEmail) {
      return NextResponse.json(
        { error: 'Please enter your Application ID (e.g. GGL-2026-299093) or Registered Email address to track your application.' },
        { status: 400 }
      );
    }

    // Normalize Unicode dashes (en-dash, em-dash) to standard ASCII '-'
    const cleanId = effectiveId.replace(/[\u2010-\u2015\u2212]/g, '-').trim().toUpperCase();
    const strippedId = cleanId.replace(/[^A-Z0-9]/gi, '');
    const emailLower = effectiveEmail.toLowerCase().trim();

    let result: any = null;
    let type = '';

    // Helper to generate flexible SQL WHERE clause
    const getWhereClause = (emailCol: string = 'email') => {
      const conditions: string[] = [];
      const params: any[] = [];

      if (cleanId) {
        conditions.push(`UPPER(TRIM(app_id)) = ?`);
        params.push(cleanId);
        conditions.push(`UPPER(TRIM(id)) = ?`);
        params.push(cleanId);
        if (strippedId) {
          conditions.push(`REPLACE(UPPER(app_id), '-', '') = ?`);
          params.push(strippedId);
        }
      }

      if (emailLower) {
        conditions.push(`LOWER(TRIM(${emailCol})) = ?`);
        params.push(emailLower);
      }

      return {
        clause: conditions.join(' OR '),
        params
      };
    };

    // 1. Check performer_applications table
    const perWhere = getWhereClause('email');
    if (perWhere.clause) {
      result = await db.queryOne(`
        SELECT app_id, full_name, email, mobile_number, whatsapp_number, city, age,
               performance_category, performance_title, performance_type, performer_count,
               performance_duration, performance_language, special_requirements,
               payment_status, application_status, status, payment_amount, order_id,
               payment_id, payment_verified_at, created_at, updated_at
        FROM performer_applications
        WHERE ${perWhere.clause}
        ORDER BY created_at DESC LIMIT 1
      `, perWhere.params);
    }

    if (result) {
      type = 'Performer Application';
    } else {
      // 2. Check team_applications
      const teamWhere = getWhereClause('email');
      if (teamWhere.clause) {
        result = await db.queryOne(`
          SELECT app_id, full_name, email, mobile_number, address, status, created_at, updated_at
          FROM team_applications
          WHERE ${teamWhere.clause}
          ORDER BY created_at DESC LIMIT 1
        `, teamWhere.params);
      }

      if (result) {
        type = 'Crew & Team Application';
      } else {
        // 3. Check guest_applications
        const guestWhere = getWhereClause('email');
        if (guestWhere.clause) {
          result = await db.queryOne(`
            SELECT app_id, full_name, email, category, city, status, created_at, updated_at
            FROM guest_applications
            WHERE ${guestWhere.clause}
            ORDER BY created_at DESC LIMIT 1
          `, guestWhere.params);
        }

        if (result) {
          type = 'Guest / Influencer Application';
        } else {
          // 4. Check sponsor_applications
          const sponsorWhere = getWhereClause('biz_email');
          if (sponsorWhere.clause) {
            result = await db.queryOne(`
              SELECT app_id, company_name, biz_email AS email, contact_person, sponsorship_type, status, created_at, updated_at
              FROM sponsor_applications
              WHERE ${sponsorWhere.clause}
              ORDER BY created_at DESC LIMIT 1
            `, sponsorWhere.params);
          }

          if (result) {
            type = 'Brand Sponsor Application';
          } else {
            // 5. Check event_booking_applications
            const eventWhere = getWhereClause('email');
            if (eventWhere.clause) {
              result = await db.queryOne(`
                SELECT app_id, org_name, email, contact_person, city, event_date, status, created_at, updated_at
                FROM event_booking_applications
                WHERE ${eventWhere.clause}
                ORDER BY created_at DESC LIMIT 1
              `, eventWhere.params);
            }

            if (result) {
              type = 'Show Booking Application';
            } else {
              // 6. Check ticket_orders fallback
              const ticketWhere = getWhereClause('customer_email');
              if (ticketWhere.clause) {
                result = await db.queryOne(`
                  SELECT order_number AS app_id, customer_name AS full_name, customer_email AS email,
                         customer_phone AS mobile_number, total_amount, payment_status AS status,
                         created_at, updated_at
                  FROM ticket_orders
                  WHERE ${ticketWhere.clause}
                  ORDER BY created_at DESC LIMIT 1
                `, ticketWhere.params);
              }

              if (result) {
                type = 'Audience Ticket Order';
              }
            }
          }
        }
      }
    }

    if (!result) {
      return NextResponse.json(
        { error: 'No application found with the provided credentials. Please double check your Application ID.' },
        { status: 404 }
      );
    }

    const matchedAppId = (result.app_id || result.id || cleanId).toUpperCase();

    // Fetch status history timeline
    const history = await db.query(
      'SELECT old_status, new_status, reason, created_at FROM application_status_history WHERE UPPER(app_id) = ? ORDER BY created_at ASC',
      [matchedAppId]
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
