import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { syncSheetsToS3, saveIndividualEntryToS3 } from '@/lib/storage';
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'FREE', '0.00', 'SUBMITTED', 'SUBMITTED')
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
        VALUES (?, 'PERFORMER', ?, NULL, 'SUBMITTED', 'SYSTEM', 'Initial Performer Audition Form Submission')
      `, [`his-${Date.now()}`, appId]);
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'Free application saved successfully.',
      appId,
      status: 'SUBMITTED',
    });
  } catch (err: any) {
    console.error('Error submitting performer application:', err);
    return NextResponse.json({ error: err.message || 'Submission failed' }, { status: 500 });
  }
}
