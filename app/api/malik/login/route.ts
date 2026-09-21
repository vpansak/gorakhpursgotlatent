import { NextResponse } from 'next/server';
import { authenticateUser, setSessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const session = await authenticateUser(email.trim().toLowerCase(), password);

    if (!session) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    await setSessionCookie(session);

    return NextResponse.json({
      success: true,
      user: session,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
