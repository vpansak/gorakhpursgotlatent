import { NextResponse, after } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { syncSheetsToS3, saveIndividualEntryToS3 } from '@/lib/storage';
import { generateAppId } from '@/lib/helpers';
import { sendPerformerApplicationEmail } from '@/lib/emailjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName, name, email, mobile, phone, whatsapp, city, age,
      performanceCategory, category, performanceTitle, performanceDescription,
      whyShouldSelectYou, performanceType, performerCount, duration, language, instagramUrl, instagram, interestedInTalentTrip
    } = body;

    const effectiveFullName = (fullName || name || '').toString().trim();
    const effectiveEmail = (email || '').toString().trim();
    const effectiveMobile = (mobile || whatsapp || phone || '').toString().trim();
    const effectiveCategory = (performanceCategory || category || 'Unique Talent').toString().trim();
    const effectiveCity = (city || '').toString().trim();
    const normalizedInstagram = (instagramUrl || instagram || '').toString().trim().replace(/^@+/, '');
    if (normalizedInstagram && /[^a-zA-Z0-9._]/.test(normalizedInstagram)) {
      return NextResponse.json({ error: 'Please enter a valid Instagram username, for example @your_handle.' }, { status: 400 });
    }
    const formattedInstagram = normalizedInstagram ? `@${normalizedInstagram}` : '';

    const appId = generateAppId('PER');
    const id = `per-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const parsedAge = parseInt((age || '').toString().replace(/\D/g, ''), 10) || 18;
    const parsedCount = parseInt((performerCount || '1').toString().replace(/\D/g, ''), 10) || 1;

    await db.execute(`
      INSERT INTO performer_applications (
        id, app_id, full_name, email, mobile_number, whatsapp_number, call_number,
        performance_category, performance_title, performance_description, performance_type,
        performer_count, performance_duration, performance_language, instagram_url,
        city, age, interested_in_talent_trip, payment_status, payment_amount, application_status, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PAYMENT_PENDING', '0.00', 'LEAD', 'LEAD')
    `, [
      id,
      appId,
      effectiveFullName,
      effectiveEmail,
      effectiveMobile,
      effectiveMobile,
      effectiveMobile,
      effectiveCategory,
      (performanceTitle || 'Audition Act').toString().trim(),
      (performanceDescription || '').toString().trim(),
      (performanceType || 'Solo').toString().trim(),
      parsedCount,
      (duration || '2 Minutes').toString().trim(),
      (language || 'Hindi').toString().trim(),
      formattedInstagram,
      effectiveCity,
      parsedAge,
      (interestedInTalentTrip || 'No').toString().trim() === 'Yes' ? 'Yes' : 'No'
    ]);

    // Create a pending ₹10 performer application payment link. The application remains a lead until Razorpay confirms payment.
    const paymentToken = crypto.randomBytes(24).toString('hex');
    await db.execute("CREATE TABLE IF NOT EXISTS performer_payment_links (token TEXT PRIMARY KEY, app_id TEXT NOT NULL, amount NUMERIC(10,2) NOT NULL, status TEXT NOT NULL DEFAULT 'PENDING', razorpay_order_id TEXT, razorpay_payment_id TEXT, created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, paid_at TIMESTAMPTZ)");
    await db.execute("INSERT INTO performer_payment_links (token, app_id, amount, status) VALUES (?, ?, 10.00, 'PENDING')", [paymentToken, appId]);

    try {
      await db.execute(`
        INSERT INTO application_status_history (id, app_type, app_id, old_status, new_status, changed_by, reason)
        VALUES (?, 'PERFORMER', ?, NULL, 'LEAD', 'SYSTEM', 'Performer application submitted; awaiting ₹10 fee')
      `, [`his-${Date.now()}`, appId]);
    } catch (e) {}

    saveIndividualEntryToS3('performers/all', appId, {
      id,
      app_id: appId,
      full_name: effectiveFullName,
      email: effectiveEmail,
      mobile_number: effectiveMobile,
      performance_category: effectiveCategory,
      status: 'LEAD',
      created_at: new Date().toISOString()
    }).catch((err: any) => console.error('S3 individual performer save error:', err));

    syncSheetsToS3().catch(err => console.error('S3 sync error:', err));

    // Dispatch email after the application response so the applicant never gets
    // stuck on the form while the email provider is retrying.
    after(async () => {
      try {
        const emailResult = await sendPerformerApplicationEmail({
          application_id: appId,
          created_at: new Date().toISOString(),
          full_name: effectiveFullName,
          email: effectiveEmail,
          mobile_number: effectiveMobile,
          whatsapp_number: effectiveMobile,
          call_number: effectiveMobile,
          alternate_contact: effectiveMobile,
          performance_category: effectiveCategory,
          performance_title: (performanceTitle || 'Audition Act').toString().trim(),
          performance_description: (performanceDescription || '').toString().trim(),
          additional_message: (whyShouldSelectYou || '').toString().trim(),
          performance_type: (performanceType || 'Solo').toString().trim(),
          performer_count: parsedCount,
          performance_duration: (duration || '2 Minutes').toString().trim(),
          performance_language: (language || 'Hindi').toString().trim(),
          city: effectiveCity,
          age: parsedAge,
          instagram_url: formattedInstagram,
          payment_status: 'PAYMENT_PENDING',
          order_id: 'N/A',
          payment_id: 'N/A',
          payment_amount: 0,
          payment_verified_at: new Date().toISOString(),
          application_status: 'LEAD',
        });
        if (emailResult.success) {
          await db.execute("UPDATE performer_applications SET email_status = 'SENT', admin_email_status = 'SENT' WHERE app_id = ?", [appId]).catch(e => console.error(e));
        } else {
          console.warn(`⚠️ Performer application email notice for ${appId}: ${emailResult.message}`);
        }
      } catch (emailErr) {
        console.error(`❌ Performer application email dispatch failed for ${appId}:`, emailErr);
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Performer Audition Application submitted successfully!',
      appId,
      status: 'LEAD',
      paymentUrl: new URL('/performer-payment/' + paymentToken, req.url).toString(),
      amount: 10,
    });
  } catch (err: any) {
    console.error('Error submitting performer application:', err);
    return NextResponse.json({ error: err.message || 'Submission failed' }, { status: 500 });
  }
}
