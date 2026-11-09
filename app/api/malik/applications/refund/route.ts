import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { processRazorpayRefund } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.role)) {
      return NextResponse.json({ error: 'Only Admins can process refunds' }, { status: 403 });
    }

    const { appId, refundReason } = await req.json();
    if (!appId) {
      return NextResponse.json({ error: 'Missing appId' }, { status: 400 });
    }

    const app = await db.queryOne<any>('SELECT * FROM performer_applications WHERE app_id = ?', [appId]);
    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (!app.payment_id) {
      return NextResponse.json({ error: 'No verified Razorpay Payment ID associated with this application to refund' }, { status: 400 });
    }

    if (app.payment_status === 'REFUNDED' || app.refund_id) return NextResponse.json({ error: 'This payment has already been refunded.' }, { status: 409 });
    const refundAmount = Number(app.payment_amount);
    if (!Number.isFinite(refundAmount) || refundAmount <= 0) return NextResponse.json({ error: 'A verified positive payment amount is required.' }, { status: 400 });

    // Call Razorpay Refund API
    const refundResult = await processRazorpayRefund(app.payment_id, refundAmount, refundReason || 'Performer application rejection refund');

    if (!refundResult.success || !refundResult.refundId) {
      return NextResponse.json({ error: refundResult.error || 'Razorpay did not confirm the refund. Payment status has not changed.' }, { status: 502 });
    }
    const refundId = refundResult.refundId;
    const now = new Date().toISOString();

    // Update database
    await db.execute(`
      UPDATE performer_applications
      SET payment_status = 'REFUNDED',
          application_status = 'REFUNDED',
          status = 'REFUNDED',
          refund_id = ?,
          refund_amount = ?,
          refund_status = 'PROCESSED',
          refund_processed_at = ?,
          refund_reason = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE app_id = ?
    `, [refundId, refundAmount, now, refundReason || 'Admin Approved Refund', appId]);

    // Audit log
    await db.execute(`
      INSERT INTO application_status_history (id, app_type, app_id, old_status, new_status, changed_by, reason)
      VALUES (?, 'PERFORMER', ?, ?, 'REFUNDED', ?, ?)
    `, [`his-${Date.now()}`, appId, app.application_status || 'REJECTED', session.full_name, refundReason || 'Razorpay Refund Processed']);

    return NextResponse.json({
      success: true,
      refundId,
      refundAmount,
      message: `Refund of ₹${refundAmount} processed successfully for ${app.full_name} (${appId}).`,
    });
  } catch (err: any) {
    console.error('Error processing application refund:', err);
    return NextResponse.json({ error: err.message || 'Refund processing server error' }, { status: 500 });
  }
}
