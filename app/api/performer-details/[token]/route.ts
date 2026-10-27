import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ensurePerformerDetailsTable, readPerformerDetailsToken, prefillPerformerDetails } from '@/lib/performerDetails';
import { validatePerformerDetails } from '@/lib/performerDetailsFields';
const noStore = { 'Cache-Control': 'private, no-store' };
type Context = { params: Promise<{ token: string }> };
export async function GET(_req: Request, context: Context) {
  const appId = await readPerformerDetailsToken((await context.params).token);
  if (!appId) return NextResponse.json({ error: 'This personal form link is invalid or expired. Please request a fresh link from GGL.' }, { status: 404, headers: noStore });
  try {
    await ensurePerformerDetailsTable();
    const [p] = await db.queryStrict(`SELECT p.*, d.answers AS detail_answers, d.submitted_at AS details_submitted_at FROM performer_applications p LEFT JOIN performer_details d ON d.app_id=p.app_id WHERE p.app_id=?`, [appId]);
    if (!p) return NextResponse.json({ error: 'Performer not found' }, { status: 404, headers: noStore });
    return NextResponse.json({ success: true, appId, answers: prefillPerformerDetails(p), submittedAt: p.details_submitted_at }, { headers: noStore });
  } catch { return NextResponse.json({ error: 'Unable to load your form. Please try again.' }, { status: 503, headers: noStore }); }
}
export async function POST(req: Request, context: Context) {
  const appId = await readPerformerDetailsToken((await context.params).token);
  if (!appId) return NextResponse.json({ error: 'Invalid or expired form link' }, { status: 404 });
  try {
    const body = await req.text();
    if (body.length > 120000) return NextResponse.json({ error: 'Form is too large' }, { status: 413 });
    let answers;
    try { answers = validatePerformerDetails(JSON.parse(body)); }
    catch (error: any) { return NextResponse.json({ error: error.message || 'Invalid form' }, { status: 400 }); }
    await ensurePerformerDetailsTable();
    // One statement saves both versions together; reported payment never changes verified payment fields.
    const rows = await db.queryStrict(`WITH saved AS (
      INSERT INTO performer_details (app_id, answers) SELECT app_id, ?::jsonb FROM performer_applications WHERE app_id=?
      ON CONFLICT (app_id) DO UPDATE SET answers=EXCLUDED.answers, updated_at=CURRENT_TIMESTAMP
      RETURNING app_id
    ) UPDATE performer_applications p SET full_name=?, mobile_number=?, whatsapp_number=?, instagram_url=?,
      performance_category=?, performance_description=?, performance_duration=CASE WHEN ?='' THEN p.performance_duration ELSE ? || ' Minutes' END,
      updated_at=CURRENT_TIMESTAMP FROM saved WHERE p.app_id=saved.app_id RETURNING p.app_id`,
      [JSON.stringify(answers), appId, answers.fullName, answers.mobile, answers.mobile, answers.instagram, answers.category, answers.description, answers.duration, answers.duration]);
    if (!rows.length) return NextResponse.json({ error: 'Performer not found' }, { status: 404 });
    return NextResponse.json({ success: true }, { headers: noStore });
  } catch { return NextResponse.json({ error: 'Your form could not be saved. Please try again.' }, { status: 503 }); }
}
