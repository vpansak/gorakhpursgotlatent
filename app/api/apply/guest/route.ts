import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { syncSheetsToS3 } from '@/lib/storage';
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

    if (!fullName || !email || !whatsapp || !city || !profession || !category) {
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED')
    `, [
      id, appId, fullName, stageName || '', dob || '', email, whatsapp, phone || '',
      instagramUrl || '', youtubeUrl || '', socialUrl || '', city, location || '',
      profession, category, shortIntro || '', whyGgl || '', previousShows || '',
      socialInfo || '', managementName || '', managerContact || '', availability || '',
      preferredDate || '', travelReq || '', accommodationReq || '', specialReq || '',
      importantInfo || '', profilePhotoUrl || '', pressKitUrl || '', docUrl || ''
    ]);

    await db.execute(`
      INSERT INTO application_status_history (id, app_type, app_id, old_status, new_status, changed_by, reason)
      VALUES (?, 'GUEST', ?, NULL, 'SUBMITTED', 'SYSTEM', 'Initial Guest Application Submission')
    `, [`his-${Date.now()}`, appId]);

    syncSheetsToS3().catch(err => console.error('S3 sync error:', err));

    return NextResponse.json({
      success: true,
      message: 'Guest / Influencer Application submitted successfully!',
      appId,
      status: 'SUBMITTED',
    });
  } catch (err: any) {
    console.error('Error submitting guest application:', err);
    return NextResponse.json({ error: err.message || 'Submission failed' }, { status: 500 });
  }
}
