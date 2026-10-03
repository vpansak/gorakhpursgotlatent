import { NextResponse } from 'next/server';
import { trackLead } from '@/lib/leadsStore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { leadId, customerName, mobile, email, instagramId, dob, quantity, source, status } = body;

    if (!mobile || !mobile.trim() || mobile.trim().length < 5) {
      return NextResponse.json({ success: false, message: 'Valid mobile number required to track lead' }, { status: 400 });
    }

    const lead = await trackLead({
      leadId,
      customerName,
      mobile,
      email,
      instagramId,
      dob,
      quantity,
      source,
      status,
    });

    return NextResponse.json({ success: true, lead });
  } catch (err: any) {
    console.error('Error tracking lead:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Failed to track lead' }, { status: 500 });
  }
}
