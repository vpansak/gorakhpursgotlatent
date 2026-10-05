import Razorpay from 'razorpay';
import crypto from 'crypto';

const DEFAULT_KEY_ID = 'rzp_live_Tk6bjDQFjKC5xq';
const DEFAULT_KEY_SECRET = '715LdSIifcBz05sRpAlAAfgS';

export function getRazorpayKeyId(): string {
  return process.env.RAZORPAY_KEY_ID || DEFAULT_KEY_ID;
}

export function getRazorpayKeySecret(): string {
  return process.env.RAZORPAY_KEY_SECRET || DEFAULT_KEY_SECRET;
}

export function getRazorpayInstance(): Razorpay {
  return new Razorpay({
    key_id: getRazorpayKeyId(),
    key_secret: getRazorpayKeySecret(),
  });
}

export const razorpay = new Razorpay({
  key_id: getRazorpayKeyId(),
  key_secret: getRazorpayKeySecret(),
});

export function isRazorpayConfigured(): boolean {
  return Boolean(getRazorpayKeyId() && getRazorpayKeySecret());
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = getRazorpayKeySecret();
  if (!secret) return false;
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
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
