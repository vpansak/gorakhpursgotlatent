import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateAppId } from '@/lib/helpers';

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
    if (!effectiveFullName || !effectiveEmail || !effectiveMobile || !effectiveEmail.includes('@')) {
      return NextResponse.json({ error: 'Full name, valid email, and mobile number are required.' }, { status: 400 });
    }

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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NOT_REQUIRED', '0.00', 'SUBMITTED', 'SUBMITTED')
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


    try {
      await db.execute(`
        INSERT INTO application_status_history (id, app_type, app_id, old_status, new_status, changed_by, reason)
        VALUES (?, 'PERFORMER', ?, NULL, 'SUBMITTED', 'SYSTEM', 'Performer application submitted for free')
      `, [`his-${Date.now()}`, appId]);
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'Your performer application has been submitted successfully. No application fee is required.',
      appId,
      status: 'SUBMITTED',
      paymentAmount: 0,
    });
  } catch (err: any) {
    console.error('Error submitting performer application:', err);
    return NextResponse.json({ error: err.message || 'Submission failed' }, { status: 500 });
  }
}
