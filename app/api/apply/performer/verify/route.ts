import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { syncSheetsToS3 } from '@/lib/storage';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { sendPerformerApplicationEmail } from '@/lib/emailjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { appId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!appId || !razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ error: 'Missing required payment verification parameters' }, { status: 400 });
    }

    // Fetch existing application from database
    const app = await db.queryOne<any>('SELECT * FROM performer_applications WHERE app_id = ?', [appId]);
    if (!app) {
      return NextResponse.json({ error: 'Application record not found' }, { status: 404 });
    }

    // Check if already verified
    if (app.payment_status === 'PAYMENT_VERIFIED' || app.payment_status === 'PAID') {
      return NextResponse.json({
        success: true,
        appId: app.app_id,
        message: 'Payment already verified',
        alreadyVerified: true,
      });
    }

    // Server-side signature verification
    const secret = process.env.RAZORPAY_KEY_SECRET;
    let isValid = false;

    if (secret && razorpay_signature) {
      isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    } else {
      console.warn('⚠️ RAZORPAY_KEY_SECRET not set or dummy mode. Validating request parameter presence.');
      isValid = Boolean(razorpay_order_id && razorpay_payment_id);
    }

    if (!isValid) {
      console.error(`❌ Payment Signature Verification Failed for App ID ${appId}`);
      return NextResponse.json({ error: 'Payment signature verification failed. Invalid transaction signature.' }, { status: 400 });
    }

    const verifiedAt = new Date().toISOString();

    // Update database with PAYMENT_VERIFIED / PAID
    await db.execute(`
      UPDATE performer_applications
      SET payment_status = 'PAID',
          application_status = 'PAYMENT_VERIFIED',
          status = 'PAYMENT_VERIFIED',
          payment_id = ?,
          order_id = ?,
          payment_verified_at = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE app_id = ?
    `, [razorpay_payment_id, razorpay_order_id, verifiedAt, appId]);

    // Audit status log
    await db.execute(`
      INSERT INTO application_status_history (id, app_type, app_id, old_status, new_status, changed_by, reason)
      VALUES (?, 'PERFORMER', ?, 'PAYMENT_PENDING', 'PAYMENT_VERIFIED', 'SYSTEM', 'Server-side Razorpay Payment Verified')
    `, [`his-${Date.now()}`, appId]);

    // Live S3 sheet sync for paid performers
    syncSheetsToS3().catch(err => console.error('S3 sync error:', err));

    // ONLY AFTER VERIFIED PAYMENT: Trigger EmailJS to both recipients
    const updatedApp = await db.queryOne<any>('SELECT * FROM performer_applications WHERE app_id = ?', [appId]);
    const emailResult = await sendPerformerApplicationEmail({
      application_id: updatedApp.app_id,
      created_at: updatedApp.created_at,
      full_name: updatedApp.full_name,
      email: updatedApp.email,
      mobile_number: updatedApp.mobile_number,
      whatsapp_number: updatedApp.whatsapp_number,
      call_number: updatedApp.call_number || updatedApp.alternate_contact || updatedApp.mobile_number,
      alternate_contact: updatedApp.alternate_contact || updatedApp.call_number || updatedApp.mobile_number,
      performance_category: updatedApp.performance_category,
      performance_title: updatedApp.performance_title,
      performance_description: updatedApp.performance_description,
      performance_type: updatedApp.performance_type,
      performer_count: updatedApp.performer_count,
      performance_duration: updatedApp.performance_duration,
      performance_language: updatedApp.performance_language,
      city: updatedApp.city,
      age: updatedApp.age,
      instagram_url: updatedApp.instagram_url,
      youtube_url: updatedApp.youtube_url,
      facebook_url: updatedApp.facebook_url,
      special_requirements: updatedApp.special_requirements,
      discovery_source: updatedApp.discovery_source,
      additional_message: updatedApp.additional_message,
      payment_status: 'PAID',
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      payment_amount: updatedApp.payment_amount || 199,
      payment_verified_at: verifiedAt,
      application_status: 'PAYMENT_VERIFIED',
      admin_notes: updatedApp.admin_notes || '',
    });

    if (emailResult.success) {
      await db.execute("UPDATE performer_applications SET email_status = 'SENT', admin_email_status = 'SENT' WHERE app_id = ?", [appId]);
    } else {
      console.warn(`⚠️ EmailJS notification failed for ${appId}, but payment remains VERIFIED: ${emailResult.message}`);
      await db.execute("UPDATE performer_applications SET email_status = 'FAILED', admin_email_status = 'FAILED' WHERE app_id = ?", [appId]);
    }

    return NextResponse.json({
      success: true,
      appId: updatedApp.app_id,
      paymentStatus: 'PAYMENT_VERIFIED',
      emailStatus: emailResult.success ? 'SENT' : 'FAILED',
      message: 'Payment verified and performer application recorded successfully!',
    });
  } catch (err: any) {
    console.error('Error verifying performer payment:', err);
    return NextResponse.json({ error: err.message || 'Payment verification server error' }, { status: 500 });
  }
}
