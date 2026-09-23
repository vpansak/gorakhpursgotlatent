import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const event = await db.queryOne<any>("SELECT * FROM events WHERE status = 'PUBLISHED' ORDER BY event_date ASC LIMIT 1");

    if (!event) {
      return NextResponse.json({ success: false, message: 'No upcoming published events' });
    }

    const categories = await db.query("SELECT * FROM ticket_categories WHERE event_id = ? AND status = 'ACTIVE' ORDER BY sort_order ASC", [event.id]);

    return NextResponse.json({
      success: true,
      event,
      categories,
    });
  } catch (err: any) {
    console.error('Active event error:', err);
    return NextResponse.json({ error: err.message || 'Failed to load active event' }, { status: 500 });
  }
}
