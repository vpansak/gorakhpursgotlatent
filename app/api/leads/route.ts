import { NextResponse } from 'next/server';
import { getLeads, deleteLead } from '@/lib/leadsStore';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF', 'TICKET_STAFF'].includes(session.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const leads = await getLeads();
    return NextResponse.json({ success: true, leads });
  } catch (err: any) {
    console.error('Error fetching leads:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF', 'TICKET_STAFF'].includes(session.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Lead ID parameter required' }, { status: 400 });
    }

    await deleteLead(id);
    return NextResponse.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting lead:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Failed to delete lead' }, { status: 500 });
  }
}
