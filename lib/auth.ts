import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { db } from './db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || ''
);

export interface UserSession {
  id: string;
  email: string;
  full_name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'TICKET_STAFF' | 'USER';
}

export async function signToken(payload: UserSession): Promise<string> {
  if (!JWT_SECRET.length) throw new Error('Secure session configuration is missing');
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    if (!JWT_SECRET.length) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserSession;
  } catch (err) {
    return null;
  }
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('ggl_session')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSessionCookie(session: UserSession) {
  const token = await signToken(session);
  const cookieStore = await cookies();
  cookieStore.set('ggl_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('ggl_session');
}

export async function authenticateUser(email: string, password: string): Promise<UserSession | null> {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  const user = await db.queryOne<any>('SELECT * FROM users WHERE LOWER(email) = ? OR phone = ?', [cleanEmail, cleanEmail]);
  if (!user) return null;

  const valid = await bcrypt.compare(cleanPass, user.password_hash);
  if (!valid) return null;

  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
  };
}
