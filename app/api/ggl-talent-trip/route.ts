import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { generateAppId } from '@/lib/helpers';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'STAFF'];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fullName = String(body.fullName || '').trim();
    const age = Number.parseInt(String(body.age || ''), 10);
    const whatsapp = String(body.whatsapp || '').replace(/\D/g, '').slice(-10);
    const city = String(body.city || '').trim();
    const instagramId = String(body.instagramId || '').trim();
    const talent = String(body.talent || '').trim();
    const duration = String(body.duration || '').trim();
    const budget = String(body.budget || '').trim();
    const destinations = Array.isArray(body.destinations) ? body.destinations.map((x: unknown) => String(x).trim()).filter(Boolean) : [];
    const otherDestination = String(body.otherDestination || '').trim();

    if (!fullName || !Number.isFinite(age) || age < 1 || !/^[6-9]\d{9}$/.test(whatsapp) || !city || !talent || !duration || !budget || destinations.length === 0) {
      return NextResponse.json({ success: false, error: 'Please complete all required fields. Please provide a valid age and Indian mobile number.' }, { status: 400 });
    }

    const appId = generateAppId('TRP');
    const id = `trip-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    await db.execute(`
      INSERT INTO ggl_talent_trip_registrations
      (id, app_id, full_name, age, whatsapp, city, instagram_id, talent, preferred_duration, preferred_budget, destinations, other_destination, verification_status, entry_fee_status, participant_status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 'UNPAID', 'INTERESTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [id, appId, fullName, age, whatsapp, city, instagramId, talent, duration, budget, JSON.stringify(destinations), otherDestination]);
    return NextResponse.json({ success: true, appId });
  } catch (error: any) {
    console.error('GGL Talent Trip registration failed:', error);
    return NextResponse.json({ success: false, error: 'Registration could not be saved. Please try again in a moment.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !ADMIN_ROLES.includes(session.role)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    const registrations = await db.query('SELECT * FROM ggl_talent_trip_registrations ORDER BY created_at DESC');
    const sponsorships = await db.query("SELECT * FROM sponsor_applications WHERE sponsorship_type ILIKE '%talent trip%' OR message ILIKE '%talent trip%' ORDER BY created_at DESC");
    return NextResponse.json({ success: true, registrations, sponsorships });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Could not load registrations' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || !ADMIN_ROLES.includes(session.role)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    const body = await req.json();
    const appId = String(body.appId || '').trim();
    const allowed = ['verification_status', 'entry_fee_status', 'participant_status', 'final_contribution', 'final_destination', 'final_dates', 'final_duration'];
    const field = String(body.field || '');
    if (!appId || !allowed.includes(field)) return NextResponse.json({ success: false, error: 'Invalid update' }, { status: 400 });
    const value = String(body.value ?? '').trim();
    await db.execute(`UPDATE ggl_talent_trip_registrations SET ${field} = ?, updated_at = CURRENT_TIMESTAMP WHERE app_id = ?`, [value, appId]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Could not update registration' }, { status: 500 });
  }
}
