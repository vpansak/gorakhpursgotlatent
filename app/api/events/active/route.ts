import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Dates are stored as ISO text. Do not advertise an expired show as the next
    // event, or infer a new date from a historical published record.
    const event = await db.queryOneStrict<any>(`SELECT * FROM events
      WHERE status = 'PUBLISHED'
        AND event_date ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
        AND event_date >= to_char(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata','YYYY-MM-DD')
      ORDER BY event_date ASC LIMIT 1`);

    if (!event) {
      return NextResponse.json({ success: false, message: 'No upcoming published events', event: null, categories: [] }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const categories = await db.queryStrict("SELECT * FROM ticket_categories WHERE event_id = ? AND status = 'ACTIVE' ORDER BY sort_order ASC", [event.id]);
    return NextResponse.json({ success: true, event, categories }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    console.error('Active event could not be loaded');
    return NextResponse.json({ error: 'Event information is temporarily unavailable. Please retry.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
