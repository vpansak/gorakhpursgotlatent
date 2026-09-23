import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateAppId } from '@/lib/helpers';
import { syncSheetsToS3, saveIndividualEntryToS3 } from '@/lib/storage';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, mobile, email, dob, address, instagram, about } = body;

    if (!name || !mobile || !email || !address) {
      return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 });
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
      name.trim(),
      mobile.trim(),
      email.trim(),
      dob || '',
      address.trim(),
      instagram?.trim() || '',
      about?.trim() || ''
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
      full_name: name.trim(),
      mobile_number: mobile.trim(),
      email: email.trim(),
      dob: dob || '',
      address: address.trim(),
      instagram_url: instagram?.trim() || '',
      about: about?.trim() || '',
      status: 'SUBMITTED',
      created_at: new Date().toISOString()
    }).catch(err => console.error('S3 individual team save error:', err));

    // Trigger instant background sync to Neon S3 sheets/team/team_applications.csv
    syncSheetsToS3().catch(err => console.error('S3 sheet sync warning:', err));

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
