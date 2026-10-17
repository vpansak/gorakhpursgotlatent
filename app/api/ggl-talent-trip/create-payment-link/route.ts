import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { getRazorpayInstance, getRazorpayKeyId } from '@/lib/razorpay';
import crypto from 'crypto';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'STAFF'];

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !ADMIN_ROLES.includes(session.role)) return NextResponse.json({ success:false, error:'Unauthorized' }, { status:403 });
    const body = await req.json();
    const appId = String(body.appId || '').trim();
    const amount = Number(body.amount);
    if (!appId || !Number.isFinite(amount) || amount < 1 || amount > 100000) {
      return NextResponse.json({ success:false, error:'Enter a valid payment amount between ₹1 and ₹1,00,000.' }, { status:400 });
    }
    const rows = await db.query<any>('SELECT * FROM ggl_talent_trip_registrations WHERE app_id = ?', [appId]);
    const person = rows[0];
    if (!person) return NextResponse.json({ success:false, error:'Registration not found.' }, { status:404 });
    if (person.verification_status !== 'VERIFIED') return NextResponse.json({ success:false, error:'Mark the participant VERIFIED before generating a payment link.' }, { status:400 });
    const razorpay = getRazorpayInstance();
    const keyId = getRazorpayKeyId();
    if (!razorpay || !keyId) return NextResponse.json({ success:false, error:'Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel.' }, { status:503 });
    const origin = new URL(req.url).origin;
    const paymentToken = `GGL-2026-${crypto.randomBytes(12).toString('hex')}`;
    const link = await razorpay.paymentLink.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      accept_partial: false,
      reference_id: appId,
      description: 'GGL Talent Trip entry fee',
      customer: { name: person.full_name, contact: String(person.whatsapp || '') },
      notify: { sms: false, email: false },
      reminder_enable: false,
      callback_url: `${origin}/api/ggl-talent-trip/payment-callback`,
      callback_method: 'get',
      notes: { app_id: appId, participant_name: String(person.full_name || '').slice(0, 200), fee_type: 'GGL_TALENT_TRIP_ENTRY_FEE' }
    });
    await db.execute(
      `UPDATE ggl_talent_trip_registrations SET payment_amount = ?, razorpay_payment_link_id = ?, payment_link_url = ?, payment_token = ?, payment_status = 'LINK_CREATED', entry_fee_status = 'UNPAID', updated_at = CURRENT_TIMESTAMP WHERE app_id = ?`,
      [amount, link.id, link.short_url, paymentToken, appId]
    );
    const paymentPageUrl = `${origin}/ggl_talent_trip/${paymentToken}`;
    return NextResponse.json({ success:true, url:paymentPageUrl, paymentUrl:link.short_url, amount, linkId:link.id, appId, whatsapp:person.whatsapp, name:person.full_name });
  } catch (error:any) {
    console.error('GGL Talent Trip payment link creation failed:', error);
    return NextResponse.json({ success:false, error:'Could not create payment link. Check Razorpay configuration and try again.' }, { status:500 });
  }
}
