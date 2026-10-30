import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getRazorpayInstance } from '@/lib/razorpay';
import { recoverPendingPerformerPayments, recoverPerformerPaymentId } from '@/lib/performerPaymentRecovery';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  try {
    const gateway = getRazorpayInstance();
    if (!gateway) return NextResponse.json({ error: 'Payment gateway unavailable' }, { status: 503 });
    const { paymentId } = await req.json();
    const result = paymentId
      ? await recoverPerformerPaymentId(String(paymentId).trim(), gateway)
      : await recoverPendingPerformerPayments(gateway);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error('Performer payment reconciliation failed:', error?.message);
    return NextResponse.json({ error: error?.error?.description || error.message || 'Payment verification unavailable' }, { status: 400 });
  }
}
