import { NextResponse } from 'next/server';
import { deleteTicketRecord } from '@/lib/ticketsStore';

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let ticketId = searchParams.get('ticketId') || '';

    if (!ticketId) {
      const body = await req.json().catch(() => ({}));
      ticketId = body.ticketId || body.id || '';
    }

    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID is required for deletion.' }, { status: 400 });
    }

    const success = await deleteTicketRecord(ticketId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: `✓ Ticket ${ticketId} has been deleted successfully.`,
      });
    } else {
      return NextResponse.json({ error: `Failed to delete ticket ${ticketId}` }, { status: 500 });
    }
  } catch (err: any) {
    console.error('Error deleting ticket:', err);
    return NextResponse.json({ error: err?.message || 'Delete operation failed' }, { status: 500 });
  }
}
