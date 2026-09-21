import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF', 'TICKET_STAFF'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Revenue calculation
    const revenueRow = db.prepare("SELECT SUM(total_amount) as total FROM ticket_orders WHERE payment_status = 'PAID'").get() as any;
    const totalRevenue = revenueRow?.total || 0;

    // Total orders count
    const paidOrdersRow = db.prepare("SELECT COUNT(*) as count FROM ticket_orders WHERE payment_status = 'PAID'").get() as any;
    const totalOrders = paidOrdersRow?.count || 0;

    // Tickets count & Check-ins
    const ticketsRow = db.prepare('SELECT COUNT(*) as count FROM tickets').get() as any;
    const checkedInRow = db.prepare('SELECT COUNT(*) as count FROM tickets WHERE status = "USED"').get() as any;
    const totalTickets = ticketsRow?.count || 0;
    const totalCheckedIn = checkedInRow?.count || 0;

    // Applications breakdown
    const perfCount = (db.prepare('SELECT COUNT(*) as count FROM performer_applications').get() as any)?.count || 0;
    const guestCount = (db.prepare('SELECT COUNT(*) as count FROM guest_applications').get() as any)?.count || 0;
    const sponsorCount = (db.prepare('SELECT COUNT(*) as count FROM sponsor_applications').get() as any)?.count || 0;
    const eventCount = (db.prepare('SELECT COUNT(*) as count FROM event_booking_applications').get() as any)?.count || 0;

    // Recent Orders
    const recentOrders = db.prepare(`
      SELECT o.*, e.title as event_title
      FROM ticket_orders o
      JOIN events e ON o.event_id = e.id
      ORDER BY o.created_at DESC LIMIT 6
    `).all();

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalTickets,
        totalCheckedIn,
        applications: {
          performers: perfCount,
          guests: guestCount,
          sponsors: sponsorCount,
          eventBookings: eventCount,
          total: perfCount + guestCount + sponsorCount + eventCount,
        },
      },
      recentOrders,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch stats' }, { status: 500 });
  }
}
