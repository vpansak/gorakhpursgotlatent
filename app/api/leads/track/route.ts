import { NextResponse } from 'next/server';
import { trackLead } from '@/lib/leadsStore';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      leadId, customerName, mobile, email, instagramId, dob, quantity,
      source, status, data
    } = body;

    const normalizedData = data && typeof data === 'object' ? data : {};
    const hasAnyData =
      Object.values(normalizedData).some((v: any) => v !== null && v !== undefined && String(v).trim() !== '') ||
      [customerName, mobile, email, instagramId, dob].some((v) => v !== null && v !== undefined && String(v).trim() !== '');

    if (!hasAnyData) {
      return NextResponse.json({ success: false, message: 'At least one form field is required' }, { status: 400 });
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
      data: normalizedData,
    });

    return NextResponse.json({ success: true, lead });
  } catch (err: any) {
    console.error('Error tracking lead:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Failed to save lead' }, { status: 500 });
  }
}
