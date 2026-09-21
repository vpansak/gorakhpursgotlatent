import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF', 'TICKET_STAFF'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized ticket verification access' }, { status: 403 });
    }

    const body = await req.json();
    const { ticketQuery, action, staffName } = body;

    if (!ticketQuery) {
      return NextResponse.json({ error: 'Ticket number or QR Hash required' }, { status: 400 });
    }

    const cleanQuery = ticketQuery.trim();

    // Query by ticket_number or qr_code_hash
    const ticket = db.prepare(`
      SELECT t.*, c.name as category_name, c.price as category_price, e.title as event_title, e.event_date, e.venue_name, o.order_number, o.payment_status
      FROM tickets t
      JOIN ticket_categories c ON t.category_id = c.id
      JOIN events e ON t.event_id = e.id
      JOIN ticket_orders o ON t.order_id = o.id
      WHERE t.ticket_number = ? OR t.qr_code_hash = ? OR t.id = ?
    `).get(cleanQuery, cleanQuery, cleanQuery) as any;

    if (!ticket) {
      return NextResponse.json({
        status: 'INVALID',
        message: 'Invalid Ticket! No matching ticket record found in system.',
      });
    }

    // Check payment status
    if (ticket.payment_status !== 'PAID') {
      return NextResponse.json({
        status: 'UNPAID',
        message: `Ticket payment status is ${ticket.payment_status}. Access Denied.`,
        ticket,
      });
    }

    // Check if already used
    if (ticket.status === 'USED') {
      return NextResponse.json({
        status: 'ALREADY_USED',
        message: `⚠️ WARNING: Ticket was ALREADY CHECKED IN on ${ticket.checked_in_at} by ${ticket.checked_in_by || 'Staff'}!`,
        ticket,
      });
    }

    // If request action is to CHECK_IN / MARK AS USED
    if (action === 'CHECK_IN') {
      db.prepare(`
        UPDATE tickets
        SET status = 'USED', checked_in_at = CURRENT_TIMESTAMP, checked_in_by = ?
        WHERE id = ?
      `).run(session.full_name || staffName || 'Gate Staff', ticket.id);

      db.prepare(`
        INSERT INTO audit_logs (id, user_id, action, target_type, target_id, details)
        VALUES (?, ?, 'TICKET_CHECKIN', 'TICKETS', ?, ?)
      `).run(`log-${Date.now()}`, session.id, ticket.id, `Checked in ticket ${ticket.ticket_number} at gate`);

      const updatedTicket = { ...ticket, status: 'USED', checked_in_at: new Date().toISOString(), checked_in_by: session.full_name };

      return NextResponse.json({
        status: 'CHECKED_IN_SUCCESS',
        message: `🎉 TICKET CHECK-IN SUCCESSFUL! Entry Approved.`,
        ticket: updatedTicket,
      });
    }

    // Valid ticket preview
    return NextResponse.json({
      status: 'VALID',
      message: '✅ VALID TICKET - Ready for Entry Check-In',
      ticket,
    });
  } catch (err: any) {
    console.error('Ticket verification error:', err);
    return NextResponse.json({ error: err.message || 'Verification system error' }, { status: 500 });
  }
}
