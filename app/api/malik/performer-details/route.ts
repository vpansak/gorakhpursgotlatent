import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { createPerformerDetailsToken } from '@/lib/performerDetails';
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  try {
    const { appId } = await req.json();
    const [p] = await db.queryStrict('SELECT app_id, full_name, mobile_number, whatsapp_number FROM performer_applications WHERE app_id = ?', [appId]);
    if (!p) return NextResponse.json({ error: 'Performer not found' }, { status: 404 });
    const token = await createPerformerDetailsToken(p.app_id);
    const formUrl = new URL(`/performer-details/${token}`, req.url).toString();
    let phone = String(p.whatsapp_number || p.mobile_number || '').replace(/\D/g, '');
    if (phone.length === 10) phone = '91' + phone;
    const text = `Hi ${p.full_name}! 🎤\n\nGGL ke liye apna detailed performer form fill kar dijiye. Aapki pehle wali details pre-filled hain; zarurat ho toh edit bhi kar sakte hain.\n\n${formUrl}\n\nPlease yeh personal link sirf apne paas rakhein. Thank you! 🙌`;
    return NextResponse.json({ success: true, formUrl, whatsappUrl: `https://api.whatsapp.com/send?${phone ? `phone=${phone}&` : ''}text=${encodeURIComponent(text)}` });
  } catch (error) { console.error('Performer detail link generation failed:', error instanceof Error ? error.message : 'Unknown error'); return NextResponse.json({ error: 'Could not create form link' }, { status: 500 }); }
}
