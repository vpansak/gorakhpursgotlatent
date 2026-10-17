import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { getRazorpayKeySecret } from '@/lib/razorpay';

function validSignature(payload: string, signature: string) {
  const secret = getRazorpayKeySecret();
  if (!secret || !signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(signature, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const linkId = url.searchParams.get('razorpay_payment_link_id') || '';
  const appId = url.searchParams.get('razorpay_payment_link_reference_id') || '';
  const status = url.searchParams.get('razorpay_payment_link_status') || '';
  const paymentId = url.searchParams.get('razorpay_payment_id') || '';
  const signature = url.searchParams.get('razorpay_signature') || '';
  const callbackPayload = `${linkId}|${appId}|${status}|${paymentId}`;
  if (!linkId || !appId || !paymentId || status.toLowerCase() !== 'paid' || !validSignature(callbackPayload, signature)) {
    return NextResponse.redirect(new URL('/ggl_talent_trip/payment-status?status=verification_failed', url.origin));
  }
  try {
    const rows = await db.query<any>('SELECT app_id, razorpay_payment_link_id, payment_amount FROM ggl_talent_trip_registrations WHERE app_id = ?', [appId]);
    const record = rows[0];
    if (!record || record.razorpay_payment_link_id !== linkId) {
      return NextResponse.redirect(new URL('/ggl_talent_trip/payment-status?status=link_mismatch', url.origin));
    }
    await db.execute(
      `UPDATE ggl_talent_trip_registrations SET payment_status = 'PAID', entry_fee_status = 'PAID', razorpay_payment_id = ?, paid_at = CURRENT_TIMESTAMP, participant_status = 'DOCUMENTS_PENDING', updated_at = CURRENT_TIMESTAMP WHERE app_id = ? AND razorpay_payment_link_id = ?`,
      [paymentId, appId, linkId]
    );
    return NextResponse.redirect(new URL(`/ggl_talent_trip/complete?appId=${encodeURIComponent(appId)}&paymentId=${encodeURIComponent(paymentId)}`, url.origin));
  } catch (error) {
    console.error('GGL Talent Trip payment callback error:', error);
    return NextResponse.redirect(new URL('/ggl_talent_trip/payment-status?status=server_error', url.origin));
  }
}
