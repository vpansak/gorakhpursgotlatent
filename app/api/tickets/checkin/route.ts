import { NextResponse } from 'next/server';
import { checkInTicket } from '@/lib/ticketsStore';
import { isVerifyAuthenticated } from '@/lib/verifyAuth';

export async function POST(req: Request) {
  try {
    if (!(await isVerifyAuthenticated())) {
      return NextResponse.json({ error: 'Staff authentication required.' }, { status: 401 });
    }

    const body = await req.json();
    const { ticketId, code } = body;

    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID is required for check-in.' }, { status: 400 });
    }

    // Staff session authentication above is required; no separate confirmation code is needed at the gate.

    const result = await checkInTicket(ticketId);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        isDuplicate: result.isDuplicate || false,
        message: result.message,
        ticket: result.ticket,
      }, { status: 200 });
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
