import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { searchTickets, getTicketStats } from '@/lib/ticketsStore';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF', 'TICKET_STAFF'].includes(session.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';

    const tickets = await searchTickets(q);
    const stats = await getTicketStats();

    return NextResponse.json({
      success: true,
      tickets,
      stats,
    });
  } catch (err: any) {
    console.error('Error fetching tickets search:', err);
    return NextResponse.json({ error: 'Failed to search tickets' }, { status: 500 });
  }
}
