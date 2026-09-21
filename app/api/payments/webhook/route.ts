import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyWebhookSignature } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

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

      // Find corresponding ticket order
      const order = db.prepare('SELECT * FROM ticket_orders WHERE razorpay_order_id = ?').get(razorpayOrderId) as any;

      if (order && order.payment_status !== 'PAID') {
        db.prepare(`
          UPDATE ticket_orders
          SET payment_status = 'PAID', razorpay_payment_id = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(razorpayPaymentId, order.id);

        console.log(`✅ Webhook: Order ${order.order_number} marked as PAID via Razorpay webhook`);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
