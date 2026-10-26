import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { generateAppId } from '@/lib/helpers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName, stageName, dob, email, whatsapp, phone, instagramUrl, youtubeUrl, socialUrl,
      city, location, profession, category, shortIntro, whyGgl, previousShows, socialInfo,
      managementName, managerContact, availability, preferredDate, travelReq, accommodationReq,
      specialReq, importantInfo, profilePhotoUrl, pressKitUrl, docUrl
    } = body;

    const effectiveFullName = (fullName || '').toString().trim();
    const effectiveEmail = (email || '').toString().trim();
    const effectiveWhatsapp = (whatsapp || phone || '').toString().trim();
    const effectiveCity = (city || location || '').toString().trim();
    const effectiveProfession = (profession || 'Influencer / Guest').toString().trim();
    const effectiveCategory = (category || 'Special Guest').toString().trim();

    if (!effectiveFullName || !effectiveEmail || !effectiveWhatsapp || !effectiveCity) {
      await db.execute("CREATE TABLE IF NOT EXISTS guest_payment_links (token TEXT PRIMARY KEY, app_id TEXT NOT NULL, amount NUMERIC(10,2) NOT NULL, status TEXT NOT NULL DEFAULT 'PENDING', razorpay_order_id TEXT, razorpay_payment_id TEXT, created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, paid_at TIMESTAMPTZ)");
    const token = `gstpay-${Date.now().toString(36)}-${crypto.randomBytes(18).toString('hex')}`;
    await db.execute("INSERT INTO guest_payment_links (token, app_id, amount, status) VALUES (?, ?, 49.00, 'PENDING')", [token, appId]);

    return NextResponse.json({ error: 'Please complete all required fields' }, { status: 400 });
    }

    const appId = generateAppId('GST');
    const id = `gst-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    await db.execute(`
      INSERT INTO guest_applications (
        id, app_id, full_name, stage_name, dob, email, whatsapp, phone, instagram_url,
        youtube_url, social_url, city, location, profession, category, short_intro,
        why_ggl, previous_shows, social_info, management_name, manager_contact,
        availability, preferred_date, travel_req, accommodation_req, special_req,
        important_info, profile_photo_url, press_kit_url, doc_url, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PAYMENT_PENDING')
    `, [
      id, appId, effectiveFullName, (stageName || '').toString().trim(), (dob || '').toString().trim(),
      effectiveEmail, effectiveWhatsapp, (phone || '').toString().trim(),
      (instagramUrl || '').toString().trim(), (youtubeUrl || '').toString().trim(), (socialUrl || '').toString().trim(),
      effectiveCity, (location || '').toString().trim(),
      effectiveProfession, effectiveCategory, (shortIntro || '').toString().trim(),
      (whyGgl || '').toString().trim(), (previousShows || '').toString().trim(),
      (socialInfo || '').toString().trim(), (managementName || '').toString().trim(), (managerContact || '').toString().trim(),
      (availability || '').toString().trim(), (preferredDate || '').toString().trim(),
      (travelReq || '').toString().trim(), (accommodationReq || '').toString().trim(), (specialReq || '').toString().trim(),
      (importantInfo || '').toString().trim(), (profilePhotoUrl || '').toString().trim(), (pressKitUrl || '').toString().trim(), (docUrl || '').toString().trim()
    ]);

    await db.execute(`
      INSERT INTO application_status_history (id, app_type, app_id, old_status, new_status, changed_by, reason)
      VALUES (?, 'GUEST', ?, NULL, 'SUBMITTED', 'SYSTEM', 'Guest application submitted (free)')
    `, [`his-${Date.now()}`, appId]);

    return NextResponse.json({
      success: true,
      message: 'Guest application details saved. Pay ₹49 to submit your application.',
      appId,
      status: 'PAYMENT_PENDING',
      paymentUrl: `/guest-payment/${token}`,
    });
  } catch (err: any) {
    console.error('Error submitting guest application:', err);
    return NextResponse.json({ error: err.message || 'Submission failed' }, { status: 500 });
  }
}
