import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { syncSheetsToS3, saveIndividualEntryToS3 } from '@/lib/storage';
import { sendGenericApplicationEmails } from '@/lib/emailjs';
import { getRazorpayInstance, isRazorpayConfigured, verifyRazorpaySignature } from '@/lib/razorpay';

async function ensureTable() {
  await db.execute("CREATE TABLE IF NOT EXISTS guest_payment_links (token TEXT PRIMARY KEY, app_id TEXT NOT NULL, amount NUMERIC(10,2) NOT NULL, status TEXT NOT NULL DEFAULT 'PENDING', razorpay_order_id TEXT, razorpay_payment_id TEXT, created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, paid_at TIMESTAMPTZ)");
}

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  try {
    await ensureTable();
    const { token } = await ctx.params;
    const rows = await db.query(`SELECT l.token,l.amount,l.status,l.razorpay_payment_id,g.app_id,g.full_name,g.stage_name,g.email,g.whatsapp,g.city,g.profession,g.category,g.instagram_url,g.youtube_url,g.why_ggl FROM guest_payment_links l JOIN guest_applications g ON g.app_id=l.app_id WHERE l.token=? LIMIT 1`, [token]);
    if (!rows[0]) return NextResponse.json({ error: 'Guest payment link not found' }, { status: 404 });
    const payment = rows[0];
    return NextResponse.json({ success: true, payment, keyId: process.env.RAZORPAY_KEY_ID || '' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Unable to load guest payment details' }, { status: 500 });
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  try {
    await ensureTable();
    const { token } = await ctx.params;
    const b = await req.json();
    const link = await db.queryOne('SELECT * FROM guest_payment_links WHERE token=?', [token]);
    if (!link) return NextResponse.json({ error: 'Guest payment link not found' }, { status: 404 });
    if (link.status === 'PAID') return NextResponse.json({ success: true, status: 'PAID' });
    const rzp = getRazorpayInstance();
    if (b.action === 'create-order') {
      if (!rzp || !isRazorpayConfigured()) return NextResponse.json({ error: 'Online payment is temporarily unavailable. Please contact GGL support.' }, { status: 503 });
      const order = await rzp.orders.create({
        amount: Math.round(Number(link.amount) * 100), currency: 'INR',
        receipt: ('gglguest' + token).slice(0, 40),
        notes: { app_id: link.app_id, guest_payment_token: token }
      });
      await db.execute('UPDATE guest_payment_links SET razorpay_order_id=? WHERE token=?', [order.id, token]);
      const p = await db.queryOne('SELECT full_name,email,whatsapp FROM guest_applications WHERE app_id=?', [link.app_id]);
      return NextResponse.json({ success: true, orderId: order.id, amount: Math.round(Number(link.amount) * 100), currency: 'INR', keyId: process.env.RAZORPAY_KEY_ID, name: p?.full_name || 'GGL Guest', email: p?.email || '', phone: p?.whatsapp || '' });
    }
    if (b.action === 'verify') {
      const o = b.razorpay_order_id, pid = b.razorpay_payment_id, sig = b.razorpay_signature;
      if (!rzp || !isRazorpayConfigured() || !o || !pid || !sig || o !== link.razorpay_order_id || !verifyRazorpaySignature(o, pid, sig)) return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
      const payment = await rzp.payments.fetch(pid);
      if (payment.status !== 'captured' || Number(payment.amount) !== Math.round(Number(link.amount) * 100)) return NextResponse.json({ error: 'Payment is not captured or amount mismatch' }, { status: 400 });
      await db.execute("UPDATE guest_payment_links SET status='PAID',razorpay_payment_id=?,paid_at=CURRENT_TIMESTAMP WHERE token=?", [pid, token]);
      await db.execute("UPDATE guest_applications SET status='SUBMITTED' WHERE app_id=?", [link.app_id]);
      await db.execute("INSERT INTO application_status_history (id,app_type,app_id,old_status,new_status,changed_by,reason) VALUES (?, 'GUEST', ?, 'PAYMENT_PENDING', 'SUBMITTED', 'SYSTEM', '₹100 Razorpay payment verified')", [`his-${Date.now()}`, link.app_id]);
      const p = await db.queryOne('SELECT * FROM guest_applications WHERE app_id=?', [link.app_id]);
      if (p) {
        const emailResult = await sendGenericApplicationEmails({
          applicationType: 'GUEST', applicationId: p.app_id, name: p.full_name, email: p.email,
          mobile: p.whatsapp, summary: `Profession: ${p.profession}\nCategory: ${p.category}\nCity: ${p.city}\nStage Name: ${p.stage_name || 'N/A'}\nPayment: ₹100 PAID\nPayment ID: ${pid}`
        });
        saveIndividualEntryToS3('panel', p.app_id, { ...p, status: 'SUBMITTED', payment_status: 'PAID', payment_amount: 100, payment_id: pid, created_at: new Date().toISOString() }).catch(err => console.error('Guest S3 save error:', err));
        syncSheetsToS3().catch(err => console.error('Guest sheets sync error:', err));
        if (!emailResult.success) console.warn('Guest application email warning:', emailResult.message);
      }
      return NextResponse.json({ success: true, status: 'PAID' });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Guest payment processing failed' }, { status: 500 });
  }
}
