import { NextResponse } from 'next/server';

export async function GET() {
  const keyId = Boolean(process.env.RAZORPAY_KEY_ID);
  const keySecret = Boolean(process.env.RAZORPAY_KEY_SECRET);
  return NextResponse.json({
    success: keyId && keySecret,
    razorpayKeyIdConfigured: keyId,
    razorpayKeySecretConfigured: keySecret,
    message: keyId && keySecret
      ? 'Razorpay server configuration is present.'
      : 'Razorpay server configuration is incomplete.',
  }, { status: keyId && keySecret ? 200 : 503 });
}

// Production envs are read at runtime; this deployment ensures current Razorpay secrets are active.
