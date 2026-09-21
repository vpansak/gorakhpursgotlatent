import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    let query = `
      SELECT o.*, e.title as event_title, p.razorpay_payment_id, p.payment_method
      FROM ticket_orders o
      LEFT JOIN events e ON o.event_id = e.id
      LEFT JOIN payments p ON o.id = p.order_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += ' AND o.payment_status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (o.customer_name LIKE ? OR o.customer_email LIKE ? OR o.order_number LIKE ? OR o.razorpay_order_id LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    query += ' ORDER BY o.created_at DESC';

    const orders = db.prepare(query).all(...params);

    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch orders ledger' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.role)) {
      return NextResponse.json({ error: 'Only Admins can issue refunds or update payment status' }, { status: 403 });
    }

    const { orderId, newStatus, refundNotes } = await req.json();

    if (!orderId || !newStatus) {
      return NextResponse.json({ error: 'Order ID and status required' }, { status: 400 });
    }

    db.prepare('UPDATE ticket_orders SET payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newStatus, orderId);

    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, target_type, target_id, details)
      VALUES (?, ?, 'PAYMENT_STATUS_UPDATE', 'ORDERS', ?, ?)
    `).run(`log-${Date.now()}`, session.id, orderId, `Updated payment status to ${newStatus}. Notes: ${refundNotes || 'None'}`);

    return NextResponse.json({ success: true, message: `Order payment status updated to ${newStatus}` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update order' }, { status: 500 });
  }
}
