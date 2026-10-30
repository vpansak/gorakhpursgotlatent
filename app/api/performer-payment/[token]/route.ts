import { matchesCapturedPerformerPayment, recordVerifiedPerformerPayment } from '@/lib/performerPaymentVerification';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendPerformerApplicationEmail } from '@/lib/emailjs';
import { syncSheetsToS3, saveIndividualEntryToS3 } from '@/lib/storage';
import {
  getRazorpayKeyId,
  getRazorpayInstance,
  isRazorpayConfigured,
  verifyRazorpaySignature
} from '@/lib/razorpay';

async function ensureTable() {
  await db.queryStrict(
    "CREATE TABLE IF NOT EXISTS performer_payment_links (token TEXT PRIMARY KEY, app_id TEXT NOT NULL, amount NUMERIC(10,2) NOT NULL, status TEXT NOT NULL DEFAULT 'PENDING', razorpay_order_id TEXT, razorpay_payment_id TEXT, created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, paid_at TIMESTAMPTZ)"
  );
}

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  try {
    await ensureTable();
    const { token } = await ctx.params;
    const rows = await db.queryStrict(
      `SELECT l.token, l.amount, l.status, l.razorpay_payment_id,
              p.app_id, p.full_name, p.email, p.mobile_number, p.whatsapp_number,
              p.city, p.performance_category, p.performance_title,
              p.performance_description, p.instagram_url, p.age
       FROM performer_payment_links l
       JOIN performer_applications p ON p.app_id = l.app_id
       WHERE l.token = ? LIMIT 1`,
      [token]
    );

    if (!rows[0]) {
      return NextResponse.json({ error: 'Payment link not found' }, { status: 404 });
    }

    const payment = rows[0];

    // Recover checkout callbacks missed due to a tab closing, using the gateway's captured payment.
    if (payment.status !== 'PAID') {
      const [link] = await db.queryStrict('SELECT * FROM performer_payment_links WHERE token=?', [token]);
      const gateway = getRazorpayInstance();
      if (link?.razorpay_order_id && gateway) {
        const result = await gateway.orders.fetchPayments(link.razorpay_order_id);
        const captured = result.items.find((entry: any) => matchesCapturedPerformerPayment(link, entry));
        if (captured) {
          await recordVerifiedPerformerPayment(link, captured);
          payment.status = 'PAID'; payment.razorpay_payment_id = captured.id;
        }
      }
    }

    return NextResponse.json({
      success: true,
      payment,
      keyId: getRazorpayKeyId()
    });
  } catch (e: any) {
    console.error('Error loading performer payment details:', e);
    return NextResponse.json({ error: e.message || 'Unable to load payment details' }, { status: 500 });
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  try {
    await ensureTable();
    const { token } = await ctx.params;
    const b = await req.json();

    const link = await db.queryOneStrict('SELECT * FROM performer_payment_links WHERE token = ?', [token]);
    if (!link) {
      return NextResponse.json({ error: 'Payment link not found' }, { status: 404 });
    }

    if (link.status === 'PAID') {
      return NextResponse.json({ success: true, status: 'PAID' });
    }

    const rzp = getRazorpayInstance();

    if (b.action === 'create-order') {
      if (!rzp || !isRazorpayConfigured()) {
        console.error('Application Razorpay not configured for performer payment.');
        return NextResponse.json(
          { error: 'Online payment is temporarily unavailable. Please contact GGL support.' },
          { status: 503 }
        );
      }

      const orderAmountPaise = Math.round(Number(link.amount) * 100);
      // Reuse the original order: retries must not orphan a payment still completing in UPI.
      const order = link.razorpay_order_id ? await rzp.orders.fetch(link.razorpay_order_id) : await rzp.orders.create({
        amount: orderAmountPaise,
        currency: 'INR',
        receipt: ('ggl' + token).slice(0, 40),
        notes: { app_id: link.app_id, performer_payment_token: token }
      });

      if (!link.razorpay_order_id) {
        const bound = await db.queryStrict('UPDATE performer_payment_links SET razorpay_order_id = ? WHERE token = ? AND razorpay_order_id IS NULL RETURNING razorpay_order_id', [order.id, token]);
        if (!bound.length) return NextResponse.json({ error: 'Checkout already started. Please retry to use the existing order.' }, { status: 409 });
      }
      const p = await db.queryOneStrict('SELECT full_name, email, mobile_number FROM performer_applications WHERE app_id = ?', [link.app_id]);

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: orderAmountPaise,
        currency: 'INR',
        keyId: getRazorpayKeyId(),
        name: p?.full_name || 'GGL Performer',
        email: p?.email || '',
        phone: p?.mobile_number || ''
      });
    }

    if (b.action === 'verify') {
      const o = b.razorpay_order_id;
      const pid = b.razorpay_payment_id;
      const sig = b.razorpay_signature;

      if (!rzp || !isRazorpayConfigured() || !o || !pid || !sig || o !== link.razorpay_order_id || !verifyRazorpaySignature(o, pid, sig)) {
        console.error('Performer payment signature verification failed for token:', token, 'orderId:', o);
        return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
      }

      const payment = await rzp.payments.fetch(pid);
      const expectedAmountPaise = Math.round(Number(link.amount) * 100);

      if (!matchesCapturedPerformerPayment(link, payment)) {
        console.error('Payment not captured or amount mismatch. Status:', payment.status, 'Amount:', payment.amount, 'Expected:', expectedAmountPaise);
        return NextResponse.json({ error: 'Payment is not captured or amount mismatch' }, { status: 400 });
      }

      await recordVerifiedPerformerPayment(link, payment);

      const p = await db.queryOneStrict(
        `SELECT app_id, full_name, email, mobile_number, whatsapp_number,
                performance_category, performance_title, performance_description,
                performance_type, performer_count, performance_duration,
                performance_language, city, age, instagram_url, interested_in_talent_trip
         FROM performer_applications WHERE app_id = ?`,
        [link.app_id]
      );

      if (p) {
        const emailResult = await sendPerformerApplicationEmail({
          application_id: p.app_id,
          created_at: new Date().toISOString(),
          full_name: p.full_name,
          email: p.email,
          mobile_number: p.mobile_number,
          whatsapp_number: p.whatsapp_number,
          call_number: p.mobile_number,
          alternate_contact: p.mobile_number,
          performance_category: p.performance_category,
          performance_title: p.performance_title,
          performance_description: p.performance_description,
          additional_message: '',
          performance_type: p.performance_type,
          performer_count: p.performer_count,
          performance_duration: p.performance_duration,
          performance_language: p.performance_language,
          city: p.city,
          age: p.age,
          instagram_url: p.instagram_url,
          payment_status: 'PAID',
          order_id: o,
          payment_id: pid,
          payment_amount: Number(link.amount),
          payment_verified_at: new Date().toISOString(),
          application_status: 'SUBMITTED'
        }).catch((err: any) => {
          console.warn('Performer email send error:', err);
          return { success: false, message: err?.message };
        });

        if (emailResult && emailResult.success) {
          await db.queryStrict("UPDATE performer_applications SET email_status = 'SENT', admin_email_status = 'SENT' WHERE app_id = ?", [p.app_id]).catch(() => {});
        }

        saveIndividualEntryToS3('performers/all', p.app_id, {
          ...p,
          payment_status: 'PAID',
          payment_amount: Number(link.amount),
          status: 'SUBMITTED',
          created_at: new Date().toISOString()
        }).catch((err) => console.error('S3 performer save error:', err));

        saveIndividualEntryToS3('performers/paid', p.app_id, {
          ...p,
          payment_status: 'PAID',
          payment_amount: Number(link.amount),
          status: 'SUBMITTED',
          created_at: new Date().toISOString()
        }).catch(() => {});

        syncSheetsToS3().catch((err) => console.error('S3 sync error:', err));

        await db.queryStrict(
          "INSERT INTO application_status_history (id, app_type, app_id, old_status, new_status, changed_by, reason) VALUES (?, 'PERFORMER', ?, 'PAYMENT_PENDING', 'SUBMITTED', 'SYSTEM', 'Razorpay performer payment verified')",
          ['his-' + Date.now(), link.app_id]
        ).catch(() => {});
      }

      return NextResponse.json({ success: true, status: 'PAID' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (e: any) {
    console.error('Performer payment processing error:', e);
    return NextResponse.json({ error: e.message || 'Payment processing failed' }, { status: 500 });
  }
}
