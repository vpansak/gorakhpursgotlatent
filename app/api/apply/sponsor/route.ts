import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { syncSheetsToS3, saveIndividualEntryToS3 } from '@/lib/storage';
import { generateAppId } from '@/lib/helpers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      companyName, contactPerson, designation, bizEmail, whatsapp, phone, website,
      instagramUrl, socialUrl, industry, location, description, sponsorshipType,
      budgetEst, preferredPackage, campaignObj, expectedAudience, eventPreference,
      message, requirements, logoUrl, brandDeckUrl, docUrl
    } = body;

    if (!companyName || !contactPerson || !bizEmail || !whatsapp) {
      return NextResponse.json({ error: 'Please complete all required brand sponsorship details' }, { status: 400 });
    }

    const appId = generateAppId('SPN');
    const id = `spn-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    await db.execute(`
      INSERT INTO sponsor_applications (
        id, app_id, company_name, contact_person, designation, biz_email, whatsapp,
        phone, website, instagram_url, social_url, industry, location, description,
        sponsorship_type, budget_est, preferred_package, campaign_obj, expected_audience,
        event_preference, message, requirements, logo_url, brand_deck_url, doc_url, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SUBMITTED')
    `, [
      id, appId, companyName, contactPerson, designation || '', bizEmail, whatsapp,
      phone || '', website || '', instagramUrl || '', socialUrl || '', industry || '',
      location || '', description || '', sponsorshipType || 'General Brand Sponsorship',
      budgetEst || 'Custom Quote by Management', preferredPackage || 'Custom Package',
      campaignObj || '', expectedAudience || '', eventPreference || '', message || '',
      requirements || '', logoUrl || '', brandDeckUrl || '', docUrl || ''
    ]);

    await db.execute(`
      INSERT INTO application_status_history (id, app_type, app_id, old_status, new_status, changed_by, reason)
      VALUES (?, 'SPONSOR', ?, NULL, 'SUBMITTED', 'SYSTEM', 'Initial Sponsor Application Submission')
    `, [`his-${Date.now()}`, appId]);

    // Save individual brand record to Neon S3 folder: sponsors/
    saveIndividualEntryToS3('sponsors', appId, {
      id,
      app_id: appId,
      company_name: companyName,
      contact_person: contactPerson,
      designation: designation || '',
      biz_email: bizEmail,
      whatsapp,
      phone: phone || '',
      website: website || '',
      sponsorship_type: sponsorshipType || 'General Brand Sponsorship',
      budget_est: budgetEst || 'Custom Quote',
      industry: industry || '',
      location: location || '',
      status: 'SUBMITTED',
      created_at: new Date().toISOString()
    }).catch(err => console.error('S3 individual sponsor save error:', err));

    syncSheetsToS3().catch(err => console.error('S3 sync error:', err));

    return NextResponse.json({
      success: true,
      message: 'Sponsor Application submitted successfully!',
      appId,
      status: 'SUBMITTED',
    });
  } catch (err: any) {
    console.error('Error submitting sponsor application:', err);
    return NextResponse.json({ error: err.message || 'Submission failed' }, { status: 500 });
  }
}
