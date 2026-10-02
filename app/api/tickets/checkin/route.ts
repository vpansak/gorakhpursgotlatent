import { NextResponse } from 'next/server';
import { checkInTicket, getTicketByTicketId } from '@/lib/ticketsStore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ticketId } = body;

    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID is required for check-in.' }, { status: 400 });
    }

    const result = await checkInTicket(ticketId);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        isDuplicate: result.isDuplicate || false,
        message: result.message,
        ticket: result.ticket,
      }, { status: 200 }); // Return 200 so UI can display warning banner nicely
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      ticket: result.ticket,
    });
  } catch (err: any) {
    console.error('Error checking in ticket:', err);
    return NextResponse.json({ error: err?.message || 'Check-in failed' }, { status: 500 });
  }
}
