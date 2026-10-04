import { NextResponse } from 'next/server';
import { isVerifyAuthenticated } from '@/lib/verifyAuth';

export async function GET() {
  return NextResponse.json({ authenticated: await isVerifyAuthenticated() });
}
