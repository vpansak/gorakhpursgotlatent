import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminOtp } from '@/lib/otp';
import { setSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and 6-digit OTP code are required.' },
        { status: 400 }
      );
    }

    const result = await verifyAdminOtp(email, otp);

    if (!result.success || !result.session) {
      return NextResponse.json(
        { success: false, error: result.error || 'Invalid verification code.' },
        { status: 400 }
      );
    }

    // Set secure server-side session cookie (httpOnly, 7-day maxAge, lax)
    await setSessionCookie(result.session);

    return NextResponse.json({
      success: true,
      message: 'Authenticated successfully as administrator.',
      user: result.session,
    });
  } catch (err: any) {
    console.error('Error in verify-otp route:', err);
    return NextResponse.json(
      { success: false, error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
