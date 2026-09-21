import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateAppId } from '@/lib/helpers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName, dob, gender, email, whatsapp, altPhone, city, state,
      instagramUrl, youtubeUrl, socialUrl, talentCategory, primaryTalent,
      experienceYrs, shortBio, performanceDesc, achievements, duration,
      preferredType, stageReq, soundReq, equipmentReq, travelReq,
      accommodationReq, importantInfo, profilePhotoUrl, perfPhotoUrl, docUrl, optDocUrl
    } = body;

    if (!fullName || !email || !whatsapp || !city || !state || !talentCategory || !primaryTalent) {
      return NextResponse.json({ error: 'Please complete all required fields' }, { status: 400 });
    }

    const appId = generateAppId('PER');
    const id = `per-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const insert = db.prepare(`
      INSERT INTO performer_applications (
        id, app_id, full_name, dob, gender, email, whatsapp, alt_phone, city, state,
        instagram_url, youtube_url, social_url, talent_category, primary_talent,
        experience_yrs, short_bio, performance_desc, achievements, duration,
        preferred_type, stage_req, sound_req, equipment_req, travel_req,
        accommodation_req, important_info, profile_photo_url, perf_photo_url,
        doc_url, opt_doc_url, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED')
    `);

    insert.run(
      id, appId, fullName, dob || '', gender || '', email, whatsapp, altPhone || '', city, state,
      instagramUrl || '', youtubeUrl || '', socialUrl || '', talentCategory, primaryTalent,
      Number(experienceYrs) || 0, shortBio || '', performanceDesc || '', achievements || '', duration || '',
      preferredType || '', stageReq || '', soundReq || '', equipmentReq || '', travelReq || '',
      accommodationReq || '', importantInfo || '', profilePhotoUrl || '', perfPhotoUrl || '',
      docUrl || '', optDocUrl || ''
    );

    // Initial status history entry
    db.prepare(`
      INSERT INTO application_status_history (id, app_type, app_id, old_status, new_status, changed_by, reason)
      VALUES (?, 'PERFORMER', ?, NULL, 'SUBMITTED', 'SYSTEM', 'Initial Application Submission')
    `).run(`his-${Date.now()}`, appId);

    return NextResponse.json({
      success: true,
      message: 'Performer Application submitted successfully!',
      appId,
      status: 'SUBMITTED',
    });
  } catch (err: any) {
    console.error('Error submitting performer application:', err);
    return NextResponse.json({ error: err.message || 'Submission failed' }, { status: 500 });
  }
}
