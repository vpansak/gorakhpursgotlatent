import { NextResponse } from 'next/server';
import { getVerifyCookieName } from '@/lib/verifyAuth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: getVerifyCookieName(),
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return response;
}
