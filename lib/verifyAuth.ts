import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'ggl_verify_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;

function getSecret(): string {
  return process.env.GGL_VERIFY_SESSION_SECRET || 'ggl_verify_default_session_secret_key_2026';
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('hex');
}

export function createVerifySession(): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function isVerifySessionValid(token: string | undefined | null): boolean {
  const secret = getSecret();
  if (!secret || !token) return false;

  const [expiresAt, signature] = token.split('.');
  if (!expiresAt || !signature || !/^\d+$/.test(expiresAt)) return false;
  const expires = Number(expiresAt);
  if (!Number.isFinite(expires) || expires < Math.floor(Date.now() / 1000)) return false;

  const expected = sign(expiresAt);
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isVerifyAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return isVerifySessionValid(cookieStore.get(COOKIE_NAME)?.value);
}

export function getVerifyCookieName(): string {
  return COOKIE_NAME;
}

export function getVerifySessionTtl(): number {
  return SESSION_TTL_SECONDS;
}
