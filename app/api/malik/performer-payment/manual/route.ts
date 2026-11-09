import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { ensurePerformerDetailsTable } from '@/lib/performerDetails';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  try {
    const { appId, amount, reference } = await req.json();
    if (typeof appId !== 'string' || !appId.trim() || typeof amount !== 'number' || !Number.isFinite(amount)
      || amount <= 0 || amount > 1000000 || Math.abs(amount * 100 - Math.round(amount * 100)) > 0.000001
      || typeof reference !== 'string' || !reference.trim() || reference.trim().length > 200) {
      return NextResponse.json({ error: 'Enter a valid amount and payment UTR/reference (up to 200 characters)' }, { status: 400 });
    }
    await ensurePerformerDetailsTable();
    // Conditional update makes repeat clicks safe and preserves refunded/online-paid records.
    const rows = await db.queryStrict(`UPDATE performer_applications SET payment_status='PAID', payment_amount=?,
      manual_payment_reference=?, manual_payment_recorded_by=?, manual_payment_recorded_at=CURRENT_TIMESTAMP,
      application_status=CASE WHEN application_status='PAYMENT_PENDING' THEN 'SUBMITTED' ELSE application_status END,
      status=CASE WHEN status='PAYMENT_PENDING' THEN 'SUBMITTED' ELSE status END,
      updated_at=CURRENT_TIMESTAMP
      WHERE app_id=? AND COALESCE(payment_status,'') NOT IN ('PAID','PAYMENT_VERIFIED','REFUNDED')
        AND COALESCE(status,'') NOT IN ('REFUNDED','REJECTED_REFUND')
      RETURNING app_id`, [amount, reference.trim(), session.id, appId.trim()]);
    if (!rows.length) return NextResponse.json({ error: 'Performer not found, already paid, or refunded. Refresh the dashboard.' }, { status: 409 });
    return NextResponse.json({ success: true, appId: rows[0].app_id });
  } catch {
    return NextResponse.json({ error: 'Unable to record manual payment' }, { status: 500 });
  }
}
