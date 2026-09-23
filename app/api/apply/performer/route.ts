import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { syncSheetsToS3 } from '@/lib/storage';
import { generatePerformerAppId } from '@/lib/helpers';
import { razorpay } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      mobileNumber,
      whatsappNumber,
      callNumber,
      alternateContact,
      performanceCategory,
      performanceTitle,
      performanceDescription,
      performanceType,
      performerCount,
      performanceDuration,
      performanceLanguage,
      specialRequirements,
      instagramUrl,
      youtubeUrl,
      facebookUrl,
      city,
      age,
      discoverySource,
      additionalMessage,
      consent,
    } = body;

    // 1. Required field validation
    if (!fullName || !email || !mobileNumber || !whatsappNumber || !city || !age || !performanceCategory || !performanceTitle || !performanceDescription) {
      return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json({ error: 'You must agree to the terms and consent declaration to proceed' }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // Phone numbers validation
    const cleanMobile = (mobileNumber || '').replace(/[^0-9]/g, '');
    const cleanWhatsapp = (whatsappNumber || '').replace(/[^0-9]/g, '');
    if (cleanMobile.length < 10) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number' }, { status: 400 });
    }
    if (cleanWhatsapp.length < 10) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit WhatsApp number' }, { status: 400 });
    }

    // Social Media Rules:
    // Instagram is REQUIRED
    if (!instagramUrl || !instagramUrl.trim()) {
      return NextResponse.json({ error: 'Instagram Profile URL is required' }, { status: 400 });
    }
    try {
      const parsedInsta = new URL(instagramUrl.trim());
      if (!parsedInsta.protocol.startsWith('http')) throw new Error();
    } catch {
      return NextResponse.json({ error: 'Please enter a valid Instagram Profile URL (e.g. https://instagram.com/yourhandle)' }, { status: 400 });
    }

    // YouTube is OPTIONAL (validate if provided)
    if (youtubeUrl && youtubeUrl.trim()) {
      try {
        const parsedYt = new URL(youtubeUrl.trim());
        if (!parsedYt.protocol.startsWith('http')) throw new Error();
      } catch {
        return NextResponse.json({ error: 'Please enter a valid YouTube URL or leave it empty' }, { status: 400 });
      }
    }

    // Facebook is OPTIONAL (validate if provided)
    if (facebookUrl && facebookUrl.trim()) {
      try {
        const parsedFb = new URL(facebookUrl.trim());
        if (!parsedFb.protocol.startsWith('http')) throw new Error();
      } catch {
        return NextResponse.json({ error: 'Please enter a valid Facebook URL or leave it empty' }, { status: 400 });
      }
    }

    const appId = generatePerformerAppId();
    const id = `per-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const feeAmount = 199; // Rs. 199 audition registration fee
    const effectiveCallNumber = (callNumber || alternateContact || mobileNumber).trim();

    // 2. Create Razorpay Order
    let razorpayOrderId = `ord_demo_${Date.now()}`;
    if (razorpay) {
      try {
        const order = await razorpay.orders.create({
          amount: feeAmount * 100, // paise
          currency: 'INR',
          receipt: appId,
          notes: {
            appId,
            applicantName: fullName,
            email,
          },
        });
        razorpayOrderId = order.id;
      } catch (rzErr: any) {
        console.error('Razorpay Order Creation Error:', rzErr);
        const errMsg = rzErr?.error?.description || rzErr?.message || (rzErr?.statusCode === 401 ? 'Razorpay Authentication Failed: Key ID and Secret do not match' : 'Failed to create Razorpay order');
        return NextResponse.json({ error: `Razorpay Error: ${errMsg}` }, { status: 400 });
      }
    }

    // 3. Save to database with PAYMENT_PENDING
    await db.execute(`
      INSERT INTO performer_applications (
        id, app_id, full_name, email, mobile_number, whatsapp_number, call_number, alternate_contact,
        performance_category, performance_title, performance_description, performance_type,
        performer_count, performance_duration, performance_language, special_requirements,
        instagram_url, youtube_url, facebook_url, city, age, discovery_source, additional_message,
        payment_status, application_status, order_id, payment_amount, payment_currency,
        talent_category, primary_talent, status
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        'PAYMENT_PENDING', 'PAYMENT_PENDING', ?, ?, 'INR',
        ?, ?, 'PAYMENT_PENDING'
      )
    `, [
      id, appId, fullName, email, mobileNumber, whatsappNumber, effectiveCallNumber, alternateContact || '',
      performanceCategory, performanceTitle, performanceDescription, performanceType || 'Solo',
      Number(performerCount) || 1, performanceDuration || '3 to 5 Minutes', performanceLanguage || '', specialRequirements || '',
      instagramUrl.trim(), (youtubeUrl && youtubeUrl.trim()) ? youtubeUrl.trim() : '', (facebookUrl && facebookUrl.trim()) ? facebookUrl.trim() : '', city, Number(age) || 18, discoverySource || '', additionalMessage || '',
      razorpayOrderId, feeAmount,
      performanceCategory, performanceTitle
    ]);

    // Audit status log
    await db.execute(`
      INSERT INTO application_status_history (id, app_type, app_id, old_status, new_status, changed_by, reason)
      VALUES (?, 'PERFORMER', ?, NULL, 'PAYMENT_PENDING', 'SYSTEM', 'Performer Application Created')
    `, [`his-${Date.now()}`, appId]);

    // Live S3 sheet sync for performers
    syncSheetsToS3().catch(err => console.error('S3 sync error:', err));

    return NextResponse.json({
      success: true,
      appId,
      razorpayOrderId,
      amount: feeAmount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || '',
      message: 'Application recorded. Please complete payment.',
    });
  } catch (err: any) {
    console.error('Error creating performer application:', err);
    return NextResponse.json({ error: err.message || 'Server error creating application' }, { status: 500 });
  }
}
