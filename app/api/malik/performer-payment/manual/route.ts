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
    const { appId, amount, reference, method } = await req.json();
    if (typeof appId !== 'string' || !appId.trim() || typeof amount !== 'number' || !Number.isFinite(amount)
      || amount <= 0 || amount > 1000000 || Math.abs(amount * 100 - Math.round(amount * 100)) > 0.000001
      || typeof reference !== 'string' || !reference.trim() || reference.trim().length > 200) {
      return NextResponse.json({ error: 'Enter a valid amount and payment UTR/reference (up to 200 characters)' }, { status: 400 });
    }
    await ensurePerformerDetailsTable();
    // Conditional update makes repeat clicks safe and preserves refunded/online-paid records.
    const rows = await db.queryStrict(`UPDATE performer_applications SET payment_status='PAID', payment_amount=?,
      manual_payment_reference=?, manual_payment_method=?, manual_payment_recorded_by=?, manual_payment_recorded_at=CURRENT_TIMESTAMP,
      application_status=CASE WHEN application_status='PAYMENT_PENDING' THEN 'SUBMITTED' ELSE application_status END,
      status=CASE WHEN status='PAYMENT_PENDING' THEN 'SUBMITTED' ELSE status END,
      updated_at=CURRENT_TIMESTAMP
      WHERE app_id=? AND COALESCE(payment_status,'') NOT IN ('PAID','PAYMENT_VERIFIED','REFUNDED')
        AND COALESCE(status,'') NOT IN ('REFUNDED','REJECTED_REFUND')
      RETURNING app_id`, [amount, reference.trim(), typeof method === 'string' ? method.trim().slice(0,80) : null, session.id, appId.trim()]);
    if (!rows.length) return NextResponse.json({ error: 'Performer not found, already paid, or refunded. Refresh the dashboard.' }, { status: 409 });
    return NextResponse.json({ success: true, appId: rows[0].app_id });
  } catch {
    return NextResponse.json({ error: 'Unable to record manual payment' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  try {
    const { appId, amount, reference, method, status, reason } = await req.json();
    if (typeof appId !== 'string' || !appId.trim() || !['PAID', 'UNPAID'].includes(status)
      || typeof reason !== 'string' || !reason.trim() || reason.length > 1000
      || (status === 'PAID' && (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0 || amount > 1000000
        || Math.abs(amount * 100 - Math.round(amount * 100)) > 0.000001
        || typeof reference !== 'string' || !reference.trim() || reference.length > 200))) {
      return NextResponse.json({ error: 'Enter valid payment details and a correction reason' }, { status: 400 });
    }
    await ensurePerformerDetailsTable();
    await db.queryStrict(`CREATE TABLE IF NOT EXISTS performer_manual_payment_history (
      id BIGSERIAL PRIMARY KEY, app_id TEXT NOT NULL, previous_payment JSONB NOT NULL,
      new_payment JSONB NOT NULL, changed_by TEXT NOT NULL, reason TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    // Lock the current record and refuse corrections for any gateway-paid application.
    // Record the previous receipt and correction atomically, including when undoing a mistake.
    const rows = await db.queryStrict(`WITH previous AS (
      SELECT p.* FROM performer_applications p WHERE p.app_id=?
        AND p.payment_status='PAID' AND p.manual_payment_reference IS NOT NULL
        AND p.manual_payment_recorded_by IS NOT NULL AND p.manual_payment_recorded_at IS NOT NULL
        AND p.payment_id IS NULL AND p.order_id IS NULL
        AND COALESCE(p.status,'') NOT IN ('REFUNDED','REJECTED_REFUND')
        AND NOT EXISTS (SELECT 1 FROM performer_payment_links l WHERE l.app_id=p.app_id AND l.status='PAID')
      FOR UPDATE
    ), changed AS (
      UPDATE performer_applications p SET payment_status=?, payment_amount=?, manual_payment_reference=?,
        manual_payment_method=?, manual_payment_recorded_by=?, manual_payment_recorded_at=?, updated_at=CURRENT_TIMESTAMP
      FROM previous WHERE p.app_id=previous.app_id
      RETURNING p.app_id, to_jsonb(previous) AS old_payment, to_jsonb(p) AS new_payment
    ) INSERT INTO performer_manual_payment_history(app_id,previous_payment,new_payment,changed_by,reason)
      SELECT app_id, old_payment, new_payment, ?, ? FROM changed RETURNING app_id`,
      [appId.trim(), status === 'PAID' ? 'PAID' : 'UNPAID', status === 'PAID' ? amount : 0,
        status === 'PAID' ? reference.trim() : null,
        status === 'PAID' && typeof method === 'string' ? method.trim().slice(0,80) : null,
        status === 'PAID' ? session.id : null, status === 'PAID' ? new Date().toISOString() : null,
        session.id, reason.trim()]);
    if (!rows.length) return NextResponse.json({ error: 'Only manual payments can be edited. Online, refunded or already changed payments are locked.' }, { status: 409 });
    return NextResponse.json({ success: true, appId: rows[0].app_id });
  } catch {
    return NextResponse.json({ error: 'Unable to correct manual payment' }, { status: 500 });
  }
}
