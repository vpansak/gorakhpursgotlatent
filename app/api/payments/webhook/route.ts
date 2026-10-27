import { recordVerifiedPerformerPayment, matchesCapturedPerformerPayment } from '@/lib/performerPaymentVerification';
import { getRazorpayInstance } from '@/lib/razorpay';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyWebhookSignature } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    if (!webhookSecret || !signature) return NextResponse.json({ error: 'Webhook verification unavailable' }, { status: 401 });
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      // Re-fetch captured performer payments from Razorpay before recording a paid tick.
      const link = await db.queryOneStrict('SELECT * FROM performer_payment_links WHERE razorpay_order_id=? LIMIT 1', [razorpayOrderId]);
      if (link) {
        const gateway = getRazorpayInstance();
        if (!gateway) throw new Error('Payment gateway unavailable');
        const captured = await gateway.payments.fetch(razorpayPaymentId);
        if (!matchesCapturedPerformerPayment(link, captured)) return NextResponse.json({ error: 'Payment mismatch' }, { status: 400 });
        await recordVerifiedPerformerPayment(link, captured);
        return NextResponse.json({ status: 'ok' });
      }

      // Find corresponding ticket order
      const order = await db.queryOne('SELECT * FROM ticket_orders WHERE razorpay_order_id = ?', [razorpayOrderId]);

      if (order && order.payment_status !== 'PAID') {
        await db.execute(`
          UPDATE ticket_orders
          SET payment_status = 'PAID', razorpay_payment_id = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `, [razorpayPaymentId, order.id]);

        console.log(`✅ Webhook: Order ${order.order_number} marked as PAID via Razorpay webhook`);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
