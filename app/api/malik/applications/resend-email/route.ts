import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { sendPerformerApplicationEmail } from '@/lib/emailjs';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }

    const { appId } = await req.json();
    if (!appId) {
      return NextResponse.json({ error: 'Missing appId' }, { status: 400 });
    }

    const app = db.prepare('SELECT * FROM performer_applications WHERE app_id = ?').get(appId) as any;
    if (!app) {
      return NextResponse.json({ error: 'Performer application not found' }, { status: 404 });
    }

    const result = await sendPerformerApplicationEmail({
      application_id: app.app_id,
      full_name: app.full_name,
      email: app.email,
      mobile_number: app.mobile_number,
      whatsapp_number: app.whatsapp_number,
      alternate_contact: app.alternate_contact,
      performance_category: app.performance_category,
      performance_title: app.performance_title,
      performance_type: app.performance_type,
      performer_count: app.performer_count,
      performance_duration: app.performance_duration,
      performance_language: app.performance_language,
      city: app.city,
      age: app.age,
      instagram_url: app.instagram_url,
      youtube_url: app.youtube_url,
      facebook_url: app.facebook_url,
      special_requirements: app.special_requirements,
      discovery_source: app.discovery_source,
      additional_message: app.additional_message,
      payment_status: app.payment_status || 'PAYMENT_VERIFIED',
      order_id: app.order_id || 'N/A',
      payment_id: app.payment_id || 'N/A',
      payment_amount: app.payment_amount || 499,
      payment_verified_at: app.payment_verified_at || new Date().toISOString(),
      application_status: app.application_status || 'PAYMENT_VERIFIED',
    });

    if (result.success) {
      db.prepare("UPDATE performer_applications SET email_status = 'SENT', admin_email_status = 'SENT' WHERE app_id = ?").run(appId);
      return NextResponse.json({ success: true, message: 'Application email notification resent successfully!' });
    } else {
      return NextResponse.json({ error: `EmailJS dispatch failed: ${result.message}` }, { status: 500 });
    }
  } catch (err: any) {
    console.error('Error resending application email:', err);
    return NextResponse.json({ error: err.message || 'Server error resending email' }, { status: 500 });
  }
}
