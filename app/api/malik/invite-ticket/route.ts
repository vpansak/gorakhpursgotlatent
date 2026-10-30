import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { ensureTicketsTable } from '@/lib/ticketsStore';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN','ADMIN','STAFF'].includes(session.role)) {
      return NextResponse.json({ error: 'Admin login required' }, { status: 403 });
    }
    const body = await req.json();
    const quantity = Number(body.quantity ?? 1);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      return NextResponse.json({ error: 'Ticket quantity must be a whole number from 1 to 10' }, { status: 400 });
    }
    const name = String(body.name || '').trim();
    const mobile = String(body.mobile || '').trim();
    const digits = mobile.replace(/\\D/g, '');
    if (name.length < 2 || name.length > 100 || digits.length < 10 || digits.length > 15) {
      return NextResponse.json({ error: 'Valid guest name and mobile number required' }, { status: 400 });
    }
    await ensureTicketsTable();
    const ticketId = 'GGLT' + crypto.randomInt(100000, 1000000);
    const id = crypto.randomUUID();
    const bookingId = 'INV-' + Date.now().toString(36).toUpperCase();
    const qrToken = crypto.randomBytes(24).toString('hex');
    const ticket = {
      id, ticket_id: ticketId, booking_id: bookingId, customer_name: name,
      mobile, email: '', instagram_id: '', quantity, amount: 0,
      razorpay_order_id: '', razorpay_payment_id: '', payment_status: 'PAID',
      ticket_status: 'VALID' as const, qr_token: qrToken, checked_in: 0,
      checked_in_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    };
    await db.execute(`INSERT INTO tickets (id,ticket_id,booking_id,customer_name,mobile,email,instagram_id,quantity,amount,razorpay_order_id,razorpay_payment_id,payment_status,ticket_status,qr_token,checked_in,checked_in_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [ticket.id,ticket.ticket_id,ticket.booking_id,ticket.customer_name,ticket.mobile,ticket.email,ticket.instagram_id,ticket.quantity,ticket.amount,ticket.razorpay_order_id,ticket.razorpay_payment_id,ticket.payment_status,ticket.ticket_status,ticket.qr_token,ticket.checked_in,ticket.checked_in_at]);
    await db.execute(`INSERT INTO ticket_application (id,ticket_id,booking_id,customer_name,mobile,email,instagram_id,quantity,amount,razorpay_order_id,razorpay_payment_id,payment_status,ticket_status,qr_token,checked_in,checked_in_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT (ticket_id) DO NOTHING`, [ticket.id,ticket.ticket_id,ticket.booking_id,ticket.customer_name,ticket.mobile,ticket.email,ticket.instagram_id,ticket.quantity,ticket.amount,ticket.razorpay_order_id,ticket.razorpay_payment_id,ticket.payment_status,ticket.ticket_status,ticket.qr_token,ticket.checked_in,ticket.checked_in_at]);
    return NextResponse.json({ success: true, ticket, message: 'Complimentary invite ticket created' });
  } catch (err: any) {
    console.error('Invite ticket creation failed', err);
    return NextResponse.json({ error: err?.message || 'Could not create invite ticket' }, { status: 500 });
  }
}