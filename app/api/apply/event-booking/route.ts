import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateAppId } from '@/lib/helpers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orgName, contactPerson, email, whatsapp, phone, city, venue, eventDate,
      expectedAudience, eventType, eventDesc, perfDuration, budgetRange,
      travelReq, accommodationReq, techReq, stageReq, addInfo, docUrl
    } = body;

    if (!orgName || !contactPerson || !email || !whatsapp || !city || !eventDate) {
      return NextResponse.json({ error: 'Please complete all required event booking fields' }, { status: 400 });
    }

    const appId = generateAppId('EVT');
    const id = `evt-app-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const insert = db.prepare(`
      INSERT INTO event_booking_applications (
        id, app_id, org_name, contact_person, email, whatsapp, phone, city, venue,
        event_date, expected_audience, event_type, event_desc, perf_duration,
        budget_range, travel_req, accommodation_req, tech_req, stage_req, add_info,
        doc_url, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED')
    `);

    insert.run(
      id, appId, orgName, contactPerson, email, whatsapp, phone || '', city, venue || '',
      eventDate, expectedAudience || '', eventType || '', eventDesc || '', perfDuration || '',
      budgetRange || '', travelReq || '', accommodationReq || '', techReq || '',
      stageReq || '', addInfo || '', docUrl || ''
    );

    db.prepare(`
      INSERT INTO application_status_history (id, app_type, app_id, old_status, new_status, changed_by, reason)
      VALUES (?, 'EVENT_BOOKING', ?, NULL, 'SUBMITTED', 'SYSTEM', 'Initial Event Booking Request')
    `).run(`his-${Date.now()}`, appId);

    return NextResponse.json({
      success: true,
      message: 'Show / Event Booking request submitted successfully!',
      appId,
      status: 'SUBMITTED',
    });
  } catch (err: any) {
    console.error('Error submitting event booking application:', err);
    return NextResponse.json({ error: err.message || 'Submission failed' }, { status: 500 });
  }
}
