import { NextRequest, NextResponse } from 'next/server';
import { execute } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF', 'TICKET_STAFF'].includes(session.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, id, isRead } = body;

    if (!type || !id) {
      return NextResponse.json({ success: false, error: 'Missing type or id' }, { status: 400 });
    }

    const readVal = isRead ? 1 : 0;
    const readAt = isRead ? new Date().toISOString() : null;

    let sql = '';
    switch (type) {
      case 'performer':
        sql = 'UPDATE performer_applications SET is_read = ?, read_at = ? WHERE app_id = ? OR id = ?';
        break;
      case 'guest':
      case 'panel':
        sql = 'UPDATE guest_applications SET is_read = ?, read_at = ? WHERE app_id = ? OR id = ?';
        break;
      case 'sponsor':
        sql = 'UPDATE sponsor_applications SET is_read = ?, read_at = ? WHERE app_id = ? OR id = ?';
        break;
      case 'team':
        sql = 'UPDATE team_applications SET is_read = ?, read_at = ? WHERE app_id = ? OR id = ?';
        break;
      case 'order':
        sql = 'UPDATE ticket_orders SET is_read = ?, read_at = ? WHERE order_number = ? OR id = ?';
        break;
      default:
        return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
    }

    await execute(sql, [readVal, readAt, id, id]);

    return NextResponse.json({
      success: true,
      message: `Marked as ${isRead ? 'READ' : 'UNREAD'} successfully`,
      isRead: Boolean(readVal)
    });
  } catch (err: any) {
    console.error('Error updating mark as read status:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
