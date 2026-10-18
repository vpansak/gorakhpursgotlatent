import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { generateAppId } from '@/lib/helpers';
import { getRazorpayInstance, getRazorpayKeyId } from '@/lib/razorpay';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fullName = String(body.fullName || '').trim().replace(/\s+/g, ' ');
    const email = String(body.email || '').trim().toLowerCase();
    const whatsapp = String(body.whatsapp || '').replace(/\D/g, '').slice(-10);
    const termsAccepted = body.termsAccepted === true;

    if (fullName.length < 2 || fullName.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[6-9]\d{9}$/.test(whatsapp) || !termsAccepted) {
      return NextResponse.json({ success: false, error: 'Please enter a valid name, email, Indian WhatsApp number, and accept the policy.' }, { status: 400 });
    }

    const razorpay = getRazorpayInstance();
    if (!razorpay || !getRazorpayKeyId()) {
      return NextResponse.json({ success: false, error: 'Online payment is temporarily unavailable. Please contact the GGL team.' }, { status: 503 });
    }

    const appId = generateAppId('TRP');
    const id = `qwer-trip-${crypto.randomUUID()}`;
    const amount = 999;
    const origin = new URL(req.url).origin;

    await db.execute(`
      INSERT INTO ggl_talent_trip_registrations
      (id, app_id, full_name, age, email, whatsapp, city, instagram_id, talent, preferred_duration, preferred_budget, destinations, other_destination, terms_accepted, verification_status, entry_fee_status, participant_status, payment_amount, payment_status, created_at, updated_at)
      VALUES (?, ?, ?, 0, ?, ?, 'Not provided', '', 'GGL Talent Tour registration', '7 Days (Tentative)', '₹999 registration fee', ?, '', TRUE, 'VERIFIED', 'UNPAID', 'PAYMENT_PENDING', ?, 'CREATED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [id, appId, fullName, email, whatsapp, JSON.stringify(['GGL Talent Tour']), amount]);

    const link = await razorpay.paymentLink.create({
      amount: amount * 100,
      currency: 'INR',
      accept_partial: false,
      reference_id: appId,
      description: 'GGL Talent Tour registration fee',
      customer: { name: fullName, email, contact: whatsapp },
      notify: { sms: false, email: false },
      reminder_enable: false,
      callback_url: `${origin}/api/ggl-talent-trip/payment-callback`,
      callback_method: 'get',
      notes: { app_id: appId, participant_name: fullName.slice(0, 200), fee_type: 'GGL_TALENT_TOUR_REGISTRATION_999' },
    });

    await db.execute(
      `UPDATE ggl_talent_trip_registrations SET razorpay_payment_link_id = ?, payment_link_url = ?, payment_status = 'LINK_CREATED', updated_at = CURRENT_TIMESTAMP WHERE app_id = ?`,
      [link.id, link.short_url, appId]
    );

    return NextResponse.json({ success: true, appId, paymentUrl: link.short_url, amount });
  } catch (error) {
    console.error('GGL Talent Tour registration/payment setup failed:', error);
    return NextResponse.json({ success: false, error: 'Could not prepare your payment. Please try again or contact GGL.' }, { status: 500 });
  }
}
