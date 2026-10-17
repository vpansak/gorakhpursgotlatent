import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const appId = (url.searchParams.get('appId') || '').trim();
  const paymentId = (url.searchParams.get('paymentId') || '').trim();
  if (!appId || !paymentId) return NextResponse.json({success:false,error:'Missing registration/payment reference.'},{status:400});
  try {
    const rows = await db.query<any>('SELECT app_id, full_name, age, whatsapp, city, instagram_id, talent, preferred_duration, preferred_budget, destinations, payment_amount, payment_status, razorpay_payment_id, paid_at FROM ggl_talent_trip_registrations WHERE app_id = ?', [appId]);
    const p = rows[0];
    if (!p || p.payment_status !== 'PAID' || p.razorpay_payment_id !== paymentId) return NextResponse.json({success:false,error:'Payment could not be confirmed for this registration.'},{status:403});
    return NextResponse.json({success:true,participant:{appId:p.app_id,name:p.full_name,age:p.age,whatsapp:p.whatsapp,city:p.city,instagramId:p.instagram_id||'',talent:p.talent||'',duration:p.preferred_duration,budget:p.preferred_budget,amount:p.payment_amount,paymentId:p.razorpay_payment_id,paidAt:p.paid_at}});
  } catch (e) {
    return NextResponse.json({success:false,error:'Could not retrieve payment confirmation.'},{status:500});
  }
}
