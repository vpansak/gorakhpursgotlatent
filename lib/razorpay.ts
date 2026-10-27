import Razorpay from 'razorpay';
import crypto from 'crypto';

// ============================================================================
// Legacy / Ticket Booking Razorpay System (DO NOT TOUCH / UNTOUCHED)
// Uses RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
// ============================================================================

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

export function processRazorpayRefund(
  paymentId: string,
  amountInRupees?: number,
  notes?: string
): Promise<{ success: boolean; refundId?: string; error?: string }> {
  const instance = getRazorpayInstance();
  if (!instance) {
    return Promise.resolve({ success: false, error: 'Razorpay API credentials not configured on server' });
  }

  try {
    const refundOptions: any = {};
    if (amountInRupees && amountInRupees > 0) {
      refundOptions.amount = Math.round(amountInRupees * 100); // Amount in paise
    }
    if (notes) {
      refundOptions.notes = { reason: notes };
    }

    return instance.payments.refund(paymentId, refundOptions).then((refund: any) => ({
      success: true,
      refundId: refund.id,
    })).catch((err: any) => {
      console.error('Razorpay Refund API Error:', err);
      return { success: false, error: err?.error?.description || err.message || 'Refund failed' };
    });
  } catch (err: any) {
    console.error('Razorpay Refund API Error:', err);
    return Promise.resolve({ success: false, error: err?.error?.description || err.message || 'Refund failed' });
  }
}

// ============================================================================
// Guest & legacy application payment system (ISOLATED)
// Uses RAZORPAY_KEY_ID1 and RAZORPAY_KEY_SECRET1
// ============================================================================

export function getApplicationRazorpayKeyId(): string {
  const envVal = (process.env.RAZORPAY_KEY_ID1 || '').trim();
  // Safe fallback if env var is literal name "RAZORPAY_KEY_ID1" or not set
  if (!envVal || envVal === 'RAZORPAY_KEY_ID1') {
    return 'rzp_live_TsNW1CZgvmBXeM';
  }
  return envVal;
}

export function getApplicationRazorpayKeySecret(): string {
  return (process.env.RAZORPAY_KEY_SECRET1 || '').trim();
}

export function getApplicationRazorpayInstance(): Razorpay | null {
  const key_id = getApplicationRazorpayKeyId();
  const key_secret = getApplicationRazorpayKeySecret();
  if (!key_id || !key_secret) return null;
  try {
    return new Razorpay({ key_id, key_secret });
  } catch (err) {
    console.warn('Application Razorpay initialization notice:', err);
    return null;
  }
}

export function isApplicationRazorpayConfigured(): boolean {
  return Boolean(getApplicationRazorpayKeyId() && getApplicationRazorpayKeySecret());
}

export function verifyApplicationRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = getApplicationRazorpayKeySecret();
  if (!secret || !signature) return false;
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  const a = Buffer.from(expectedSignature, 'hex');
  const b = Buffer.from(signature, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
