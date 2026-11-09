import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export function scopedSessionToken(purpose: string, subject: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Secure session configuration is missing');
  const payload = Buffer.from(JSON.stringify({ purpose, subject, expires: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
  return `${payload}.${createHmac('sha256', secret).update(payload).digest('hex')}`;
}
export function readScopedToken(token: string, purpose: string): string | null {
  const secret = process.env.JWT_SECRET;
  if (!secret || !token) return null;
  try {
    const [payload, signature, extra] = token.split('.');
    if (!payload || !/^[a-f0-9]{64}$/.test(signature || '') || extra) return null;
    const expected = createHmac('sha256', secret).update(payload).digest();
    const supplied = Buffer.from(signature, 'hex');
    if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.purpose === purpose && typeof data.subject === 'string' && Number.isFinite(data.expires) && data.expires > Date.now() ? data.subject : null;
  } catch { return null; }
}
export async function scopedSession(purpose: string): Promise<string | null> {
  return readScopedToken((await cookies()).get(`ggl_${purpose}_session`)?.value || '', purpose);
}
