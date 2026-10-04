import { NextResponse } from 'next/server';
import {
  createVerifySession,
  getVerifyCookieName,
  getVerifySessionTtl,
} from '@/lib/verifyAuth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = String(body?.id || '').trim();
    const password = String(body?.password || '').trim();

    const expectedId = String(process.env.GGL_VERIFY_ID || '').trim();
    const expectedPassword = String(process.env.GGL_VERIFY_PASSWORD || '').trim();

    if (!expectedId || !expectedPassword || !process.env.GGL_VERIFY_SESSION_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Staff verification is not configured on the server.' },
        { status: 503 }
      );
    }

    if (id !== expectedId || password !== expectedPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID or Password. Access Denied.' },
        { status: 401 }
      );
    }

    const token = createVerifySession();
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Staff verification is not configured on the server.' },
        { status: 503 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: getVerifyCookieName(),
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: getVerifySessionTtl(),
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid login request.' }, { status: 400 });
  }
}
