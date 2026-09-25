import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { id, password } = await req.json();

    const cleanId = String(id || '').trim();
    const cleanPass = String(password || '').trim();

    // Accept operator ID 8528085859 with password being the same mobile number (8528085859) or GGL@GKP
    if (cleanId === '8528085859' && (cleanPass === cleanId || cleanPass === '8528085859' || cleanPass === 'GGL@GKP')) {
      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
        operator: {
          id: '8528085859',
          role: 'COMPUTERJI_OPERATOR',
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'गलत Operator ID या Security Password!' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
