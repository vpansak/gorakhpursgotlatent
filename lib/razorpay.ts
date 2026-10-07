import Razorpay from 'razorpay';
import crypto from 'crypto';

export function getRazorpayKeyId(): string {
  return process.env.RAZORPAY_KEY_ID || '';
}

export function getRazorpayKeySecret(): string {
  return process.env.RAZORPAY_KEY_SECRET || '';
}

export function getRazorpayInstance(): Razorpay | null {
  const key_id = getRazorpayKeyId();
  const key_secret = getRazorpayKeySecret();
  if (!key_id || !key_secret) return null;
  try {
    return new Razorpay({ key_id, key_secret });
  } catch (err) {
    console.warn('Razorpay initialization notice:', err);
    return null;
  }
}

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
  const instance = getRazorpayInstance();
  if (!instance) {
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

    const refund = await instance.payments.refund(paymentId, refundOptions);
    return { success: true, refundId: refund.id };
  } catch (err: any) {
    console.error('Razorpay Refund API Error:', err);
    return { success: false, error: err?.error?.description || err.message || 'Refund failed' };
  }
}
