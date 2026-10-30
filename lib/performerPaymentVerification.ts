import { db } from '@/lib/db';

export function matchesCapturedPerformerPayment(link: any, payment: any) {
  return payment.status === 'captured' && payment.currency === 'INR'
    && payment.order_id === link.razorpay_order_id
    && Number(payment.amount) === Math.round(Number(link.amount) * 100)
    && Boolean(payment.id) && Number(link.amount) > 0;
}

// Update the link and application atomically, so polling never sees a partial paid state.
export async function recordVerifiedPerformerPayment(link: any, payment: any) {
  if (!matchesCapturedPerformerPayment(link, payment)) throw new Error('Payment does not match this performer order');
  const rows = await db.queryStrict(`WITH paid AS (
    UPDATE performer_payment_links SET status='PAID', razorpay_payment_id=?, paid_at=COALESCE(paid_at,CURRENT_TIMESTAMP)
    WHERE token=? AND app_id=? AND razorpay_order_id=? AND amount=?
      AND EXISTS (SELECT 1 FROM performer_applications a WHERE a.app_id=performer_payment_links.app_id AND COALESCE(a.payment_status,'') <> 'REFUNDED') RETURNING app_id, amount
  ) UPDATE performer_applications p SET payment_status='PAID', payment_amount=paid.amount,
    payment_id=?, order_id=?, payment_verified_at=COALESCE(p.payment_verified_at,CURRENT_TIMESTAMP),
    application_status=CASE WHEN p.application_status='PAYMENT_PENDING' THEN 'SUBMITTED' ELSE p.application_status END,
    status=CASE WHEN p.status='PAYMENT_PENDING' THEN 'SUBMITTED' ELSE p.status END,
    updated_at=CURRENT_TIMESTAMP FROM paid WHERE p.app_id=paid.app_id RETURNING p.app_id`,
    [payment.id, link.token, link.app_id, payment.order_id, link.amount, payment.id, payment.order_id]);
  if (!rows.length) throw new Error('Verified payment could not be saved');
}
