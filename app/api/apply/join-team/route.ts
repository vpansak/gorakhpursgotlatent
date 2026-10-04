import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateAppId } from '@/lib/helpers';
import { syncSheetsToS3, saveIndividualEntryToS3 } from '@/lib/storage';
import { sendGenericApplicationEmails } from '@/lib/emailjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, fullName, mobile, phone, whatsapp, email, dob, address, city, instagram, instagramUrl, about, shortIntro } = body;
    const effectiveName = (name || fullName || '').toString().trim();
    const effectiveMobile = (mobile || phone || whatsapp || '').toString().trim();
    const effectiveEmail = (email || '').toString().trim();
    const effectiveAddress = (address || city || '').toString().trim();
    const effectiveDob = (dob || '').toString().trim();
    const effectiveInstagram = (instagramUrl || instagram || '').toString().trim();
    const effectiveAbout = (about || shortIntro || '').toString().trim();

    if (!effectiveName || !effectiveMobile || !effectiveEmail) {
      return NextResponse.json({ error: 'Please fill in all required fields (Name, Mobile, Email)' }, { status: 400 });
    }

    const appId = generateAppId('EVT');
    const id = `tem-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    await db.execute(`
      INSERT INTO team_applications (
        id, app_id, full_name, mobile_number, email, dob, address, instagram_url, about, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED')
    `, [
      id,
      appId,
      effectiveName,
      effectiveMobile,
      effectiveEmail,
      effectiveDob,
      effectiveAddress,
      effectiveInstagram,
      effectiveAbout
    ]);

    // Record status history
    try {
      await db.execute(`
        INSERT INTO application_status_history (id, app_type, app_id, old_status, new_status, changed_by, reason)
        VALUES (?, 'TEAM', ?, NULL, 'SUBMITTED', 'SYSTEM', 'Initial Team Application Submission')
      `, [`his-${Date.now()}`, appId]);
    } catch (e) {
      // Ignore history error if table not present
    }

    // Save individual team recruit record to Neon S3 folder: team/
    saveIndividualEntryToS3('team', appId, {
      id,
      app_id: appId,
      full_name: effectiveName,
      mobile_number: effectiveMobile,
      email: effectiveEmail,
      dob: effectiveDob,
      address: effectiveAddress,
      instagram_url: effectiveInstagram,
      about: effectiveAbout,
      status: 'SUBMITTED',
      created_at: new Date().toISOString()
    }).catch(err => console.error('S3 individual team save error:', err));

    // Trigger instant background sync to Neon S3 sheets/team/team_applications.csv
    syncSheetsToS3().catch(err => console.error('S3 sheet sync warning:', err));

    const emailResult = await sendGenericApplicationEmails({
      applicationType: 'TEAM',
      applicationId: appId,
      name: effectiveName,
      email: effectiveEmail,
      mobile: effectiveMobile,
      summary: `City/Address: ${effectiveAddress || 'N/A'}\nInstagram: ${effectiveInstagram || 'N/A'}\nAbout: ${effectiveAbout || 'N/A'}`,
    });
    if (!emailResult.success) console.warn('Team application email warning:', emailResult.message);


    return NextResponse.json({
      success: true,
      message: 'Team application saved successfully!',
      appId,
      status: 'SUBMITTED',
    });
  } catch (err: any) {
    console.error('Error saving team application:', err);
    return NextResponse.json({ error: err.message || 'Submission failed' }, { status: 500 });
  }
}
