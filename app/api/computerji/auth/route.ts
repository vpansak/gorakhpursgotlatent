import { NextResponse } from 'next/server';
import { hasOperatorAccess } from '@/lib/operatorAccess';
import { scopedSessionToken } from '@/lib/scopedSession';
export const dynamic = 'force-dynamic';
export async function GET() {
  return NextResponse.json({ success: true, authenticated: await hasOperatorAccess() });
}
export async function POST(req: Request) {
  if (await hasOperatorAccess()) return NextResponse.json({ success: true });
  const body = await req.json().catch(() => ({}));
  const configured = process.env.GGL_OPERATOR_PIN;
  if (!configured || String(body.password || '') !== configured) return NextResponse.json({ success: false, error: 'Please sign in through the Admin Portal, or use your configured operator PIN.' }, { status: 403 });
  const response = NextResponse.json({ success: true });
  response.cookies.set('ggl_computerji_session', scopedSessionToken('computerji', 'operator'), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 8 * 60 * 60 });
  return response;
}
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('ggl_computerji_session', '', { path: '/', maxAge: 0 });
  return response;
}
