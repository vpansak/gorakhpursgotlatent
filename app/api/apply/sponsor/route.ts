import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { syncSheetsToS3, saveIndividualEntryToS3 } from '@/lib/storage';
import { generateAppId } from '@/lib/helpers';
import { sendGenericApplicationEmails } from '@/lib/emailjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      companyName, contactPerson, designation, bizEmail, email, whatsapp, phone, mobile, website,
      instagramUrl, socialUrl, industry, location, description, sponsorshipType,
      budgetEst, preferredPackage, campaignObj, expectedAudience, eventPreference,
      message, requirements, logoUrl, brandDeckUrl, docUrl
    } = body;

    const effectiveCompanyName = (companyName || '').toString().trim();
    const effectiveContactPerson = (contactPerson || '').toString().trim();
    const effectiveEmail = (bizEmail || email || '').toString().trim();
    const effectiveWhatsapp = (whatsapp || phone || mobile || '').toString().trim();
    const effectivePhone = (phone || mobile || '').toString().trim();

    if (!effectiveCompanyName || !effectiveContactPerson || !effectiveEmail || !effectiveWhatsapp) {
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
      id,
      appId,
      effectiveCompanyName,
      effectiveContactPerson,
      (designation || '').toString().trim(),
      effectiveEmail,
      effectiveWhatsapp,
      effectivePhone,
      (website || '').toString().trim(),
      (instagramUrl || '').toString().trim(),
      (socialUrl || '').toString().trim(),
      (industry || '').toString().trim(),
      (location || '').toString().trim(),
      (description || '').toString().trim(),
      (sponsorshipType || 'General Brand Sponsorship').toString().trim(),
      (budgetEst || 'Custom Quote by Management').toString().trim(),
      (preferredPackage || 'Custom Package').toString().trim(),
      (campaignObj || '').toString().trim(),
      (expectedAudience || '').toString().trim(),
      (eventPreference || '').toString().trim(),
      (message || '').toString().trim(),
      (requirements || '').toString().trim(),
      (logoUrl || '').toString().trim(),
      (brandDeckUrl || '').toString().trim(),
      (docUrl || '').toString().trim()
    ]);

    await db.execute(`
      INSERT INTO application_status_history (id, app_type, app_id, old_status, new_status, changed_by, reason)
      VALUES (?, 'SPONSOR', ?, NULL, 'SUBMITTED', 'SYSTEM', 'Initial Sponsor Application Submission')
    `, [`his-${Date.now()}`, appId]);

    // Save individual brand record to Neon S3 folder: sponsors/
    saveIndividualEntryToS3('sponsors', appId, {
      id,
      app_id: appId,
      company_name: effectiveCompanyName,
      contact_person: effectiveContactPerson,
      designation: (designation || '').toString().trim(),
      biz_email: effectiveEmail,
      whatsapp: effectiveWhatsapp,
      phone: effectivePhone,
      website: (website || '').toString().trim(),
      sponsorship_type: (sponsorshipType || 'General Brand Sponsorship').toString().trim(),
      budget_est: (budgetEst || 'Custom Quote').toString().trim(),
      industry: (industry || '').toString().trim(),
      location: (location || '').toString().trim(),
      status: 'SUBMITTED',
      created_at: new Date().toISOString()
    }).catch(err => console.error('S3 individual sponsor save error:', err));

    syncSheetsToS3().catch(err => console.error('S3 sync error:', err));

    const emailResult = await sendGenericApplicationEmails({
      applicationType: 'SPONSOR',
      applicationId: appId,
      name: effectiveContactPerson,
      email: effectiveEmail,
      mobile: effectiveWhatsapp,
      summary: `Company: ${effectiveCompanyName}\nDesignation: ${(designation || '').toString().trim() || 'N/A'}\nIndustry: ${(industry || '').toString().trim() || 'N/A'}\nLocation: ${(location || '').toString().trim() || 'N/A'}\nSponsorship Type: ${(sponsorshipType || 'General Brand Sponsorship').toString().trim()}`,
    });
    if (!emailResult.success) console.warn('Sponsor application email warning:', emailResult.message);


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
