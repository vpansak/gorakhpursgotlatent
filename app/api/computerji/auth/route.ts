import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { id, password } = await req.json();

    const expectedId = '8528085859';
    const expectedPassword = 'GGL@GKP';

    if (String(id || '').trim() === expectedId && String(password || '').trim() === expectedPassword) {
      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
        operator: {
          id: expectedId,
          role: 'COMPUTERJI_OPERATOR',
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid ID or Password. Kripya sahi ID aur Password dalein.' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
