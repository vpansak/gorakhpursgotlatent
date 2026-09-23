import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateAppId } from '@/lib/helpers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, mobile, email, dob, address, instagram, about } = body;

    if (!name || !mobile || !email || !address) {
      return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 });
    }

    const appId = generateAppId('EVT');
    const id = `tem-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const insert = db.prepare(`
      INSERT INTO team_applications (
        id, app_id, full_name, mobile_number, email, dob, address, instagram_url, about, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED')
    `);

    insert.run(
      id,
      appId,
      name.trim(),
      mobile.trim(),
      email.trim(),
      dob || '',
      address.trim(),
      instagram?.trim() || '',
      about?.trim() || ''
    );

    // Record status history
    try {
      db.prepare(`
        INSERT INTO application_status_history (id, app_type, app_id, old_status, new_status, changed_by, reason)
        VALUES (?, 'TEAM', ?, NULL, 'SUBMITTED', 'SYSTEM', 'Initial Team Application Submission')
      `).run(`his-${Date.now()}`, appId);
    } catch (e) {
      // Ignore history error if table not present
    }

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
