import { NextRequest, NextResponse } from 'next/server';
import { requestAdminOtp } from '@/lib/otp';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid administrator email.' },
        { status: 400 }
      );
    }

    const result = await requestAdminOtp(email);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Unable to send verification code.',
          cooldownSeconds: result.cooldownSeconds,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Verification code sent to: ${email.trim().toLowerCase()}`,
      cooldownSeconds: result.cooldownSeconds || 60,
      expiresInSeconds: result.expiresInSeconds || 300,
    });
  } catch (err: any) {
    console.error('Error in send-otp route:', err);
    return NextResponse.json(
      { success: false, error: 'Unable to process verification request. Please try again.' },
      { status: 500 }
    );
  }
}
