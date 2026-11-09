import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {
  createVerifySession,
  getVerifyCookieName,
  getVerifySessionTtl,
} from '@/lib/verifyAuth';

export async function POST(req: Request) {
  try {
    const staff = await getSession();
    if (staff && ['SUPER_ADMIN','ADMIN','STAFF','TICKET_STAFF'].includes(staff.role)) return NextResponse.json({ success: true });
    const body = await req.json();
    const id = String(body?.id || '').trim();
    const password = String(body?.password || '').trim();

    const expectedId = String(process.env.GGL_VERIFY_ID || '').trim();
    const expectedPassword = String(process.env.GGL_VERIFY_PASSWORD || '').trim();

    if (!expectedId || !expectedPassword || id !== expectedId || password !== expectedPassword) {
      return NextResponse.json(
        { success: false, error: 'Sign in through the admin portal or use your configured gate staff credentials.' },
        { status: 401 }
      );
    }

    const token = createVerifySession();
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Staff verification session generation failed.' },
        { status: 500 }
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
