import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  return NextResponse.json(
    { error: 'Registration for Episode 2 will start soon! Stay tuned.' },
    { status: 400 }
  );
}
