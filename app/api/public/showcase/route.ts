import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [performers,guests,sponsors]=await Promise.all([
      db.queryStrict(`SELECT p.app_id,p.full_name,p.city,
        p.performance_category AS talent_category,p.performance_title AS primary_talent,
        p.performance_description AS short_bio,to_jsonb(p)->>'profile_photo_url' AS profile_photo_url
        FROM performer_applications p WHERE p.status='APPROVED' AND p.is_featured=1`),
      db.queryStrict(`SELECT g.app_id,g.full_name,g.stage_name,g.city,g.profession,g.category,g.short_intro,
        to_jsonb(g)->>'profile_photo_url' AS profile_photo_url
        FROM guest_applications g WHERE g.status='APPROVED' AND g.is_featured=1`),
      db.queryStrict(`SELECT s.app_id,s.company_name,s.industry,s.sponsorship_type,s.website,
        to_jsonb(s)->>'logo_url' AS logo_url
        FROM sponsor_applications s WHERE s.status='APPROVED' AND s.is_featured=1`),
    ]);
    // Public cards contain approved display fields only, never internal settings,
    // database metadata, private pitches, budgets or applicant contact details.
    return NextResponse.json({success:true,performers,guests,sponsors,settings:{}},{headers:{'Cache-Control':'no-store'}});
  } catch {
    return NextResponse.json({error:'Failed to fetch showcase content'},{status:503});
  }
}
