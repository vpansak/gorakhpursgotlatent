import { NextResponse } from 'next/server';

/**
 * Legacy performer verification endpoint retired.
 *
 * The old implementation accepted order/payment IDs as sufficient proof when
 * RAZORPAY_KEY_SECRET was absent, and did not verify capture status or amount.
 * Performer applications must now be verified only through the token-bound
 * /api/performer-payment/[token] flow, which checks the dedicated application
 * credentials, stored order ID, Razorpay signature, captured status, and amount.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: 'This legacy verification endpoint is disabled. Please use the secure performer payment link flow.',
      code: 'LEGACY_PAYMENT_VERIFICATION_DISABLED',
    },
    { status: 410 }
  );
}
