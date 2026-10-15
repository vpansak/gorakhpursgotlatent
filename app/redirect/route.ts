import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.redirect(
    'https://youtube.com/@gkpgotlatent?si=_APjsf1z4sjN5jpT',
    { status: 307 }
  );
}
