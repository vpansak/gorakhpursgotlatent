import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const events = db.prepare('SELECT * FROM events ORDER BY created_at DESC').all();

    // Attach categories to each event
    const eventsWithCategories = events.map((event: any) => {
      const categories = db.prepare('SELECT * FROM ticket_categories WHERE event_id = ? ORDER BY sort_order ASC').all(event.id);
      return { ...event, categories };
    });

    return NextResponse.json({ success: true, events: eventsWithCategories });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title, subtitle, description, eventDate, startTime, endTime,
      venueName, venueAddress, city, posterUrl, bannerUrl, terms, capacity, categories
    } = body;

    if (!title || !eventDate || !startTime || !venueName || !city) {
      return NextResponse.json({ error: 'Title, Date, Time, Venue and City are required' }, { status: 400 });
    }

    const eventId = `evt-${Date.now()}`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    db.prepare(`
      INSERT INTO events (
        id, title, slug, subtitle, description, event_date, start_time, end_time,
        venue_name, venue_address, city, poster_url, banner_url, terms, capacity, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED')
    `).run(
      eventId, title, `${slug}-${Date.now().toString().slice(-4)}`, subtitle || '',
      description || '', eventDate, startTime, endTime || '', venueName, venueAddress || '',
      city, posterUrl || '/logo.png', bannerUrl || '/logo.png', terms || '', Number(capacity) || 1000
    );

    // Add ticket categories
    if (categories && Array.isArray(categories)) {
      const insertCategory = db.prepare(`
        INSERT INTO ticket_categories (id, event_id, name, price, available_qty, max_per_order, description, status, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?)
      `);

      categories.forEach((cat: any, index: number) => {
        insertCategory.run(
          `cat-${Date.now()}-${index}`,
          eventId,
          cat.name,
          Number(cat.price),
          Number(cat.availableQty),
          Number(cat.maxPerOrder) || 5,
          cat.description || '',
          index + 1
        );
      });
    }

    return NextResponse.json({ success: true, message: 'Event and Ticket Categories created successfully!', eventId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create event' }, { status: 500 });
  }
}
