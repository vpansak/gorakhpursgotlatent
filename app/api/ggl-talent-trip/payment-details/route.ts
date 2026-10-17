import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token') || '';
  if (!token || token.length > 200) return NextResponse.json({ success:false, error:'Invalid payment invitation.' }, { status:400 });
  try {
    const rows = await db.query<any>(
      `SELECT app_id, full_name, age, whatsapp, city, instagram_id, talent, preferred_duration, preferred_budget, destinations, other_destination, verification_status, payment_amount, payment_status, payment_link_url, razorpay_payment_link_id, payment_token
       FROM ggl_talent_trip_registrations WHERE payment_token = ?`,
      [token]
    );
    const p = rows[0];
    if (!p || p.verification_status !== 'VERIFIED' || !p.payment_link_url || !p.razorpay_payment_link_id) return NextResponse.json({ success:false, error:'This payment invitation is invalid or expired. Contact GGL.' }, { status:404 });
    if (p.payment_status === 'PAID') return NextResponse.json({ success:false, error:'This registration is already marked paid.' }, { status:409 });
    let destinations: string[] = [];
    try { destinations = Array.isArray(p.destinations) ? p.destinations : JSON.parse(p.destinations || '[]'); } catch {}
    return NextResponse.json({ success:true, participant:{
      appId:p.app_id, name:p.full_name, age:p.age, whatsapp:p.whatsapp, city:p.city,
      instagramId:p.instagram_id || '', talent:p.talent || '', duration:p.preferred_duration,
      budget:p.preferred_budget, destinations, otherDestination:p.other_destination || '',
      amount:Number(p.payment_amount), paymentUrl:p.payment_link_url
    } }, { headers:{'Cache-Control':'no-store, private'} });
  } catch (error) {
    console.error('GGL trip payment details error:', error);
    return NextResponse.json({ success:false, error:'Could not load payment details.' }, { status:500 });
  }
}
