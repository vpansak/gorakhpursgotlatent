import { db } from '@/lib/db';
import { SignJWT, jwtVerify } from 'jose';

let ready: Promise<void> | undefined;
export function ensurePerformerDetailsTable() {
  return ready ||= db.queryStrict(`CREATE TABLE IF NOT EXISTS performer_details (
    app_id TEXT PRIMARY KEY REFERENCES performer_applications(app_id),
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).then(() => {}).catch((error) => { ready = undefined; throw error; });
}
function secret() {
  const signingSecret = process.env.PERFORMER_DETAIL_LINK_SECRET || process.env.JWT_SECRET;
  if (!signingSecret) throw new Error('Secure form links are not configured');
  return new TextEncoder().encode(signingSecret);
}
export async function createPerformerDetailsToken(appId: string) {
  return new SignJWT({ purpose: 'performer-details', appId }).setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt().setExpirationTime('30d').sign(secret());
}
export async function readPerformerDetailsToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'] });
    return payload.purpose === 'performer-details' && typeof payload.appId === 'string' ? payload.appId : null;
  } catch { return null; }
}
export function prefillPerformerDetails(p: Record<string, any>) {
  const duration = String(p.performance_duration || '').match(/^[123]\b/)?.[0] || '';
  return {
    mobile: p.mobile_number || p.whatsapp_number || '', fullName: p.full_name || '',
    stageName: '', instagram: p.instagram_url || '', category: p.performance_category || '',
    description: p.performance_description || '', actDetails: '', duration,
    reportedPaymentStatus: ['PAID', 'PAYMENT_VERIFIED'].includes(p.payment_status) ? 'Paid' : 'Unpaid',
    ...(p.detail_answers || {}),
  };
}
