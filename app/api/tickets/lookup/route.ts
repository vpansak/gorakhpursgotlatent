import { NextResponse } from 'next/server';
import { getTicketByTicketId } from '@/lib/ticketsStore';
import { isVerifyAuthenticated } from '@/lib/verifyAuth';

export async function POST(req: Request) {
  try {
    if (!(await isVerifyAuthenticated())) {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const body = await req.json();
    const { ticketId } = body;

    if (!ticketId || !ticketId.trim()) {
      return NextResponse.json({ error: 'Ticket ID is required for lookup.' }, { status: 400 });
    }

    const ticket = await getTicketByTicketId(ticketId.trim());

    if (!ticket) {
      return NextResponse.json({
        success: false,
        status: 'INVALID',
        message: `✕ INVALID TICKET ID: Ticket "${ticketId}" not found in database.`,
      }, { status: 200 });
    }

    // Check payment validity
    const isPaidOrFree =
      ticket.payment_status === 'PAID' ||
      ticket.payment_status === 'FREE' ||
      ticket.payment_status === 'SUCCESS' ||
      Number(ticket.amount) === 0;

    if (!isPaidOrFree) {
      return NextResponse.json({
        success: false,
        status: 'UNPAID',
        ticket,
        message: `✕ UNPAID TICKET: Payment status is ${ticket.payment_status}.`,
      }, { status: 200 });
    }

    // Check if already checked in / used / expired
    if (ticket.checked_in === 1) {
      return NextResponse.json({
        success: true,
        status: 'ALREADY_USED',
        ticket,
        message: `⚠️ USED TICKET: Ticket ${ticket.ticket_id} has ALREADY been used for entry.`,
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      status: 'VALID',
      ticket,
      message: `✓ VALID TICKET FOUND: Enter code "11" to confirm entry and mark ticket as USED.`,
    });
  } catch (err: any) {
    console.error('Error looking up ticket:', err);
    return NextResponse.json({ error: err?.message || 'Lookup failed' }, { status: 500 });
  }
}
