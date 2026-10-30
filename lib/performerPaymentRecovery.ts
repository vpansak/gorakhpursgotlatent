import { db } from '@/lib/db';
import { matchesCapturedPerformerPayment, recordVerifiedPerformerPayment } from '@/lib/performerPaymentVerification';

export async function recoverPerformerLink(link: any, gateway: any) {
  if (!link.razorpay_order_id || link.status === 'PAID') return false;
  const result = await gateway.orders.fetchPayments(link.razorpay_order_id);
  const captured = result.items.find((payment: any) => matchesCapturedPerformerPayment(link, payment));
  if (!captured) return false;
  await recordVerifiedPerformerPayment(link, captured);
  return true;
}

export async function recoverPerformerPaymentId(paymentId: string, gateway: any) {
  if (!/^pay_[A-Za-z0-9]+$/.test(paymentId)) throw new Error('Enter a valid Razorpay payment ID');
  const payment = await gateway.payments.fetch(paymentId);
  if (payment.status !== 'captured') throw new Error('Payment is not captured. No paid tick was added.');
  const link = await db.queryOneStrict('SELECT * FROM performer_payment_links WHERE razorpay_order_id=? LIMIT 1', [payment.order_id]);
  if (!link || !matchesCapturedPerformerPayment(link, payment)) {
    throw new Error('Payment does not match a GGL performer payment link. No paid tick was added.');
  }
  await recordVerifiedPerformerPayment(link, payment);
  return { appId: link.app_id, paymentId: payment.id, amount: Number(link.amount), status: 'PAID' };
}

export async function recoverPendingPerformerPayments(gateway: any) {
  // Retry oldest checks first; a failing or still unpaid link cannot starve later payments.
  await db.queryStrict('ALTER TABLE performer_payment_links ADD COLUMN IF NOT EXISTS last_checked_at TIMESTAMPTZ');
  const links = await db.queryStrict(`SELECT l.* FROM performer_payment_links l
    JOIN performer_applications p ON p.app_id=l.app_id
    WHERE l.status='PENDING' AND l.razorpay_order_id IS NOT NULL
      AND (l.last_checked_at IS NULL OR l.last_checked_at < CURRENT_TIMESTAMP - INTERVAL '30 seconds')
      AND COALESCE(p.payment_status,'') <> 'REFUNDED'
    ORDER BY l.last_checked_at ASC NULLS FIRST, l.created_at DESC LIMIT 12`);
  let verified = 0;
  let failed = 0;
  for (let offset = 0; offset < links.length; offset += 3) {
    await Promise.all(links.slice(offset, offset + 3).map(async (link: any) => {
      await db.queryStrict('UPDATE performer_payment_links SET last_checked_at=CURRENT_TIMESTAMP WHERE token=?', [link.token]);
      try { if (await recoverPerformerLink(link, gateway)) verified++; }
      catch { failed++; }
    }));
  }
  return { checked: links.length, verified, failed };
}
