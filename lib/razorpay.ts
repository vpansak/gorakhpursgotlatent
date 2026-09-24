import Razorpay from 'razorpay';
import crypto from 'crypto';

const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_live_Tfu7PlxOWV6ohp';
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'Zrc5y0HMxWaQuqBfNijKwFgP';

export const razorpay = key_id && key_secret ? new Razorpay({ key_id, key_secret }) : null;

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!key_secret) return false;
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', key_secret)
    .update(body.toString())
    .digest('hex');
  return expectedSignature === signature;
}

export function verifyWebhookSignature(body: string, signature: string, webhookSecret: string): boolean {
  if (!webhookSecret) return false;
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
}

export async function processRazorpayRefund(
  paymentId: string,
  amountInRupees?: number,
  notes?: string
): Promise<{ success: boolean; refundId?: string; error?: string }> {
  if (!razorpay) {
    return { success: false, error: 'Razorpay API credentials not configured on server' };
  }

  try {
    const refundOptions: any = {};
    if (amountInRupees && amountInRupees > 0) {
      refundOptions.amount = Math.round(amountInRupees * 100); // Amount in paise
    }
    if (notes) {
      refundOptions.notes = { reason: notes };
    }

    const refund = await razorpay.payments.refund(paymentId, refundOptions);
    return { success: true, refundId: refund.id };
  } catch (err: any) {
    console.error('Razorpay Refund API Error:', err);
    return { success: false, error: err?.error?.description || err.message || 'Refund failed' };
  }
}
