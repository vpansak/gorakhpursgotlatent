import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  await clearSessionCookie();

  const accept = req.headers.get('accept') || '';
  if (accept.includes('text/html') || req.headers.get('content-type') === 'application/x-www-form-urlencoded') {
    return NextResponse.redirect(new URL('/malik', req.url), 303);
  }

  return NextResponse.json({ success: true, redirect: '/malik' });
}

export async function GET(req: NextRequest) {
  await clearSessionCookie();
  return NextResponse.redirect(new URL('/malik', req.url), 303);
}
