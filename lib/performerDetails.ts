import { combinedStageIntroduction, normalizePerformerCategory, PERFORMANCE_DURATIONS } from '@/lib/performerDetailsFields';
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
  const stored = p.detail_answers || {};
  const rawDuration = String(stored.duration || p.performance_duration || '').trim();
  const duration = rawDuration === '1.5' || /^1\.5\s*min/i.test(rawDuration) ? '1.5 minutes'
    : rawDuration === 'Below 1 minute' || rawDuration === 'below_1' ? 'Below 1 minute' : '';
  return {
    mobile: p.mobile_number || p.whatsapp_number || '', fullName: p.full_name || '',
    instagram: p.instagram_url || '', description: p.performance_description || '', actDetails: '',
    reportedPaymentStatus: ['PAID', 'PAYMENT_VERIFIED'].includes(p.payment_status) ? 'Paid' : 'Unpaid',
    ...stored,
    stageName: combinedStageIntroduction(stored),
    category: normalizePerformerCategory(stored.category || p.performance_category || ''),
    duration: (PERFORMANCE_DURATIONS as readonly string[]).includes(duration) ? duration : '',
    interestedInTalentTrip: ['Yes', 'No'].includes(stored.interestedInTalentTrip) ? stored.interestedInTalentTrip : '',
  };
}
