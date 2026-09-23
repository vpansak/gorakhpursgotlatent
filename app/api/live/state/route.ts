import { NextRequest, NextResponse } from 'next/server';
import { getFullLiveState } from '@/lib/liveShow';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    // Allow operator view if logged in as admin/staff or operator key query param provided
    const isOperator = !!(session && ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.role));
    
    const data = await getFullLiveState(isOperator);
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    console.error('Error in /api/live/state:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
