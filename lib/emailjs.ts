export interface BookingEmailParams {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  ticketNumber: string;
  eventTitle: string;
  eventDate: string;
  startTime: string;
  venueName: string;
  categoryName: string;
  quantity: number;
  totalAmount: number;
  currency?: string;
}

export async function sendBookingConfirmationEmail(params: BookingEmailParams): Promise<{ success: boolean; message?: string }> {
  if (process.env.NITROSEND_API_KEY) {
    const body = `Hi ${params.customerName},

Your GGL ticket booking is confirmed successfully.

Ticket ID: ${params.ticketNumber}
Booking ID: ${params.orderNumber}
Event: ${params.eventTitle}
Date: ${params.eventDate}
Time: ${params.startTime}
Venue: ${params.venueName}
Category: ${params.categoryName}
Quantity: ${params.quantity}
Amount Paid: ${params.totalAmount} ${params.currency || 'INR'}

Please keep this email for your records. Your ticket/QR can be accessed from the GGL website using your booking details.

Support: help.gglatent@gmail.com
WhatsApp: +91 84238 58424

Regards,
Gorakhpur's Got Latent Team`;
    return sendNitrosendEmail(
      params.customerEmail,
      `🎟️ Ticket Confirmed | ${params.ticketNumber} | Gorakhpur's Got Latent`,
      body
    );
  }

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    console.warn('⚠️ EmailJS credentials missing on server. Email notification skipped.');
    return { success: false, message: 'EmailJS credentials not configured' };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    accessToken: privateKey, // Server-side security token for EmailJS REST API
    template_params: {
      to_name: params.customerName,
      to_email: params.customerEmail,
      email: params.customerEmail,
      user_email: params.customerEmail,
      reply_to: params.customerEmail,
      customer_name: params.customerName,
      customer_email: params.customerEmail,
      order_id: params.orderNumber,
      razorpay_order_id: params.razorpayOrderId,
      razorpay_payment_id: params.razorpayPaymentId,
      ticket_id: params.ticketNumber,
      event_name: params.eventTitle,
      event_date: params.eventDate,
      event_time: params.startTime,
      venue: params.venueName,
      ticket_category: params.categoryName,
      quantity: String(params.quantity),
      amount_paid: String(params.totalAmount),
      currency: params.currency || 'INR',
      website_url: appUrl,
      subject: `🎟️ Booking Confirmed — Gorakhpur’s Got Latent | ${params.eventTitle}`,
      help_email: 'help.gglatent@gmail.com',
      support_email: 'help.gglatent@gmail.com',
      contact_email: 'help.gglatent@gmail.com',
      Email: 'help.gglatent@gmail.com',
      help_whatsapp: '+91 84238 58424',
      support_whatsapp: '+91 84238 58424',
      whatsapp: '+91 84238 58424',
      WhatsApp: '+91 84238 58424',
      helpline: '+91 84238 58424',
      instagram_handle: '@gkp_got_latent',
      instagram_url: 'https://www.instagram.com/gkp_got_latent/',
      official_instagram: 'https://www.instagram.com/gkp_got_latent/',
    },
  };

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://gorakhpursgotlatent.vercel.app',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log(`📧 EmailJS: Booking confirmation email sent successfully to ${params.customerEmail}`);
      return { success: true };
    }

    const errorText = await res.text();
    console.warn(`⚠️ Primary EmailJS booking failed (${res.status}): ${errorText}. Trying backup service...`);

    // Backup failover service
    const backupRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://gorakhpursgotlatent.vercel.app',
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_BACKUP_SERVICE_ID,
        template_id: process.env.EMAILJS_BACKUP_TEMPLATE_ID,
        user_id: process.env.EMAILJS_BACKUP_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_BACKUP_PRIVATE_KEY,
        template_params: payload.template_params,
      }),
    });

    if (backupRes.ok) {
      console.log(`📧 EmailJS (Backup): Booking confirmation email sent successfully to ${params.customerEmail}`);
      return { success: true };
    }

    return { success: false, message: `EmailJS HTTP ${res.status}: ${errorText}` };
  } catch (err: any) {
    console.error('❌ EmailJS Exception:', err);
    return { success: false, message: err.message || 'Network error sending email' };
  }
}

export interface PerformerEmailParams {
  application_id: string;
  created_at?: string;
  full_name: string;
  age: number | string;
  email: string;
  mobile_number: string;
  whatsapp_number: string;
  call_number?: string;
  alternate_contact?: string;
  city: string;
  performance_category: string;
  performance_title: string;
  performance_description: string;
  performance_type: string;
  performer_count: number | string;
  performance_duration: string;
  performance_language: string;
  special_requirements?: string;
  instagram_url: string;
  youtube_url?: string;
  facebook_url?: string;
  discovery_source?: string;
  additional_message?: string;
  payment_status: string;
  payment_amount: number | string;
  payment_currency?: string;
  order_id: string;
  payment_id: string;
  payment_verified_at: string;
  application_status: string;
  admin_notes?: string;
}

export async function sendPerformerApplicationEmail(params: PerformerEmailParams): Promise<{ success: boolean; message?: string }> {
  if (process.env.NITROSEND_API_KEY) {
    const adminBody = `New performer audition application received.

Application ID: ${params.application_id}
Name: ${params.full_name}
Email: ${params.email}
Mobile: ${params.mobile_number}
WhatsApp: ${params.whatsapp_number}
Age: ${params.age}
City: ${params.city}
Category: ${params.performance_category}
Act: ${params.performance_title}
Description: ${params.performance_description}
Instagram: ${params.instagram_url}
Payment Status: ${params.payment_status}

Please review it in the GGL admin panel.`;

    const userBody = `Hi ${params.full_name},

Thank you for applying to Gorakhpur's Got Latent.

Your performer audition application has been received successfully.

Application ID: ${params.application_id}
Status: ${params.application_status || 'SUBMITTED'}

Please keep your Application ID for future communication. If you are shortlisted, the GGL team will contact you through the details provided.

Support: help.gglatent@gmail.com
WhatsApp: +91 84238 58424

Regards,
Gorakhpur's Got Latent Team`;

    const results = await Promise.all([
      sendNitrosendEmail('alooksingh1@gmail.com', `🎤 Performer Application | ${params.application_id}`, adminBody),
      params.email.toLowerCase() !== 'alooksingh1@gmail.com'
        ? sendNitrosendEmail(params.email, `🎤 GGL Performer Application Received | ${params.application_id}`, userBody)
        : Promise.resolve({ success: false, message: 'Applicant is admin address' }),
    ]);

    return results.some(r => r.success)
      ? { success: true }
      : { success: false, message: results.map(r => r.message).filter(Boolean).join(' | ') };
  }

  // Credentials for Admin Notification Email (vpansak / template_b3h1egs)
  const adminServiceId = process.env.EMAILJS_PERFORMER_SERVICE_ID;
  const adminTemplateId = process.env.EMAILJS_PERFORMER_TEMPLATE_ID;
  const adminPublicKey = process.env.EMAILJS_PERFORMER_PUBLIC_KEY;
  const adminPrivateKey = process.env.EMAILJS_PERFORMER_PRIVATE_KEY;

  // Credentials for Applicant Welcome / Confirmation Email (service_15li5i6 / template_41t6fmb)
  const userServiceId = process.env.EMAILJS_SERVICE_ID;
  const userTemplateId = process.env.EMAILJS_TEMPLATE_ID;
  const userPublicKey = process.env.EMAILJS_PUBLIC_KEY;
  const userPrivateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!adminServiceId || !adminTemplateId || !adminPublicKey || !adminPrivateKey || !userServiceId || !userTemplateId || !userPublicKey || !userPrivateKey) {
    console.warn('⚠️ Performer EmailJS credentials are not fully configured.');
    return { success: false, message: 'EmailJS performer credentials not configured' };
  }

  // Format social URLs with "Not Provided" fallback for optional ones
  const youtubeUrlFormatted = (params.youtube_url && params.youtube_url.trim()) ? params.youtube_url.trim() : 'Not Provided';
  const facebookUrlFormatted = (params.facebook_url && params.facebook_url.trim()) ? params.facebook_url.trim() : 'Not Provided';
  const specialReqFormatted = (params.special_requirements && params.special_requirements.trim()) ? params.special_requirements.trim() : 'Not Provided';
  const addMsgFormatted = (params.additional_message && params.additional_message.trim()) ? params.additional_message.trim() : 'Not Provided';
  const callNumFormatted = params.call_number || params.alternate_contact || params.mobile_number || 'N/A';

  const summaryMessage = `🎤 NEW PERFORMER AUDITION APPLICATION RECEIVED!

🆔 Application ID: ${params.application_id}
👤 Performer Name: ${params.full_name}
📱 Mobile Number: ${params.mobile_number}
💬 WhatsApp Number: ${params.whatsapp_number}
📧 Performer Email: ${params.email}
🎂 Age: ${params.age || 'N/A'}
📍 City: ${params.city}
📸 Instagram: ${params.instagram_url}

🎭 Performance Category: ${params.performance_category}
🎵 Act Title: ${params.performance_title}
📝 Act Details: ${params.performance_description}
⌛ Duration: ${params.performance_duration || 'N/A'}

💰 Payment Status: ${params.payment_status} (Amount: ₹${params.payment_amount || 0})
--------------------------------------------------
Gorakhpur's Got Latent Admin Notification System`;

  let adminSuccess = false;
  let userSuccess = false;
  let lastError = '';

  const headers = {
    'Content-Type': 'application/json',
    'Origin': 'https://gorakhpursgotlatent.vercel.app',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  };

  // 1. DISPATCH TO ADMIN (alooksingh1@gmail.com) -> New Performer Application Notification Template (template_b3h1egs)
  try {
    const adminPayload = {
      service_id: adminServiceId,
      template_id: adminTemplateId,
      user_id: adminPublicKey,
      accessToken: adminPrivateKey,
      template_params: {
        to_email: 'alooksingh1@gmail.com',
        to_name: 'Gorakhpur’s Got Latent Admin Team',
        admin_email: 'alooksingh1@gmail.com',
        email: 'alooksingh1@gmail.com',
        user_email: 'alooksingh1@gmail.com',
        customer_email: 'alooksingh1@gmail.com',
        performer_email: params.email,
        applicant_email: params.email,
        reply_to: params.email,
        subject: `🎤 GGL Performer Application | ${params.application_id} | ${params.full_name}`,
        application_id: params.application_id,
        created_at: params.created_at || new Date().toISOString(),
        application_status: params.application_status,
        full_name: params.full_name,
        name: params.full_name,
        customer_name: params.full_name,
        age: String(params.age || 'N/A'),
        mobile_number: params.mobile_number,
        whatsapp_number: params.whatsapp_number,
        call_number: callNumFormatted,
        alternate_contact: callNumFormatted,
        city: params.city,
        performance_category: params.performance_category,
        performance_title: params.performance_title,
        performance_description: params.performance_description,
        performance_type: params.performance_type || 'Solo',
        performer_count: String(params.performer_count || 1),
        performance_duration: params.performance_duration || 'N/A',
        performance_language: params.performance_language || 'Hindi / English',
        special_requirements: specialReqFormatted,
        instagram_url: params.instagram_url,
        youtube_url: youtubeUrlFormatted,
        facebook_url: facebookUrlFormatted,
        discovery_source: params.discovery_source || 'Not Provided',
        additional_message: addMsgFormatted,
        payment_status: params.payment_status,
        payment_amount: String(params.payment_amount || 0),
        payment_currency: params.payment_currency || 'INR',
        razorpay_order_id: params.order_id || 'N/A',
        razorpay_payment_id: params.payment_id || 'N/A',
        payment_verified_at: params.payment_verified_at || new Date().toISOString(),
        admin_notes: params.admin_notes || '',
        message: summaryMessage,
        instagram_handle: '@gkp_got_latent',
        official_instagram: 'https://www.instagram.com/gkp_got_latent/',
      },
    };

    const resAdmin = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(adminPayload),
    });

    if (resAdmin.ok) {
      console.log(`📧 EmailJS: Admin notification email sent successfully to alooksingh1@gmail.com`);
      adminSuccess = true;
    } else {
      const errText = await resAdmin.text();
      console.error(`❌ EmailJS Error sending to admin (${resAdmin.status}): ${errText}`);
      lastError = `Admin email HTTP ${resAdmin.status}: ${errText}`;
    }
  } catch (err: any) {
    console.error('❌ EmailJS Exception sending to admin:', err);
    lastError = err.message;
  }

  // 2. DISPATCH TO APPLICANT (params.email) -> Welcome / Application Received Template (template_41t6fmb)
  const applicantEmail = (params.email || '').trim();
  if (applicantEmail && applicantEmail.includes('@') && applicantEmail.toLowerCase() !== 'alooksingh1@gmail.com') {
    try {
      const userPayload = {
        service_id: userServiceId,
        template_id: userTemplateId,
        user_id: userPublicKey,
        accessToken: userPrivateKey,
        template_params: {
          to_email: applicantEmail,
          to_name: params.full_name || 'Performer Applicant',
          full_name: params.full_name || 'Performer Applicant',
          name: params.full_name || 'Performer Applicant',
          customer_name: params.full_name || 'Performer Applicant',
          user_name: params.full_name || 'Performer Applicant',
          performer_name: params.full_name || 'Performer Applicant',
          applicant_name: params.full_name || 'Performer Applicant',
          user_full_name: params.full_name || 'Performer Applicant',
          performer_full_name: params.full_name || 'Performer Applicant',
          display_name: params.full_name || 'Performer Applicant',
          first_name: (params.full_name || 'Performer').split(' ')[0],
          Name: params.full_name || 'Performer Applicant',
          FullName: params.full_name || 'Performer Applicant',
          UserName: params.full_name || 'Performer Applicant',
          PerformerName: params.full_name || 'Performer Applicant',
          ApplicantName: params.full_name || 'Performer Applicant',
          CustomerName: params.full_name || 'Performer Applicant',
          email: applicantEmail,
          user_email: applicantEmail,
          customer_email: applicantEmail,
          reply_to: 'alooksingh1@gmail.com',
          subject: `🎟️ Welcome to Gorakhpur’s Got Latent | Performer Application ${params.application_id}`,
          application_id: params.application_id,
          app_id: params.application_id,
          order_id: params.application_id,
          ticket_id: params.application_id,
          Application_ID: params.application_id,
          App_ID: params.application_id,
          talent_category: params.performance_category,
          performance_category: params.performance_category,
          category: params.performance_category,
          ticket_category: params.performance_category,
          Talent_Category: params.performance_category,
          Performance_Category: params.performance_category,
          city: params.city,
          venue: params.city,
          location: params.city,
          City: params.city,
          application_status: params.application_status || 'SUBMITTED',
          status: params.application_status || 'SUBMITTED',
          payment_status: params.payment_status || 'SUBMITTED',
          Application_Status: params.application_status || 'SUBMITTED',
          Status: params.application_status || 'SUBMITTED',
          mobile_number: params.mobile_number,
          mobile: params.mobile_number,
          phone: params.mobile_number,
          created_at: params.created_at || new Date().toISOString(),
          help_email: 'help.gglatent@gmail.com',
          support_email: 'help.gglatent@gmail.com',
          contact_email: 'help.gglatent@gmail.com',
          Email: 'help.gglatent@gmail.com',
          Help_Email: 'help.gglatent@gmail.com',
          Support_Email: 'help.gglatent@gmail.com',
          help_whatsapp: '+91 84238 58424',
          support_whatsapp: '+91 84238 58424',
          whatsapp: '+91 84238 58424',
          WhatsApp: '+91 84238 58424',
          Help_WhatsApp: '+91 84238 58424',
          Support_WhatsApp: '+91 84238 58424',
          helpline: '+91 84238 58424',
          instagram_handle: '@gkp_got_latent',
          instagram_url: 'https://www.instagram.com/gkp_got_latent/',
          official_instagram: 'https://www.instagram.com/gkp_got_latent/',
          Helpline: '+91 84238 58424',
        },
      };

      const resUser = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers,
        body: JSON.stringify(userPayload),
      });

      if (resUser.ok) {
        console.log(`📧 EmailJS: Performer welcome email sent successfully to ${applicantEmail}`);
        userSuccess = true;
      } else {
        const errText = await resUser.text();
        console.error(`❌ EmailJS Error sending welcome email to applicant ${applicantEmail} (${resUser.status}): ${errText}`);
      }
    } catch (err: any) {
      console.error(`❌ EmailJS Exception sending welcome email to ${applicantEmail}:`, err);
    }
  }

  return (adminSuccess || userSuccess) ? { success: true } : { success: false, message: lastError };
}

export interface AdminOtpEmailParams {
  toEmail: string;
  otp: string;
}

/**
 * Send secure 6-digit OTP to authorized admin email address using EmailJS
 */
export async function sendAdminLoginOtpEmail(params: AdminOtpEmailParams): Promise<{ success: boolean; message?: string }> {
  const serviceId = process.env.EMAILJS_OTP_SERVICE_ID;
  const templateId = process.env.EMAILJS_OTP_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_OTP_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_OTP_PRIVATE_KEY;

  const { toEmail, otp } = params;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    console.warn('⚠️ Admin OTP EmailJS credentials are not configured.');
    return { success: false, message: 'EmailJS OTP credentials not configured' };
  }

  const templateParams = {
    to_email: toEmail,
    email: toEmail,
    user_email: toEmail,
    customer_email: toEmail,
    reply_to: toEmail,
    to_name: 'Administrator',
    otp: otp,
    verification_code: otp,
    subject: `GORAKHPUR’S GOT LATENT — Admin Verification Code: ${otp}`,
    title: "GORAKHPUR'S GOT LATENT",
    heading: 'ADMIN PORTAL',
    system_name: "GORAKHPUR'S GOT LATENT ADMIN PORTAL",
    message: `GORAKHPUR'S GOT LATENT\nADMIN PORTAL\n\nVerification requested for:\n${toEmail}\n\nYOUR ONE-TIME PASSWORD:\n${otp}\n\nOTP validity:\n5 minutes`,
  };

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    accessToken: privateKey,
    template_params: templateParams,
  };

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://gorakhpursgotlatent.vercel.app',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log(`📧 EmailJS: Admin OTP sent successfully to ${toEmail}`);
      return { success: true };
    }

    const errText = await res.text();
    console.warn(`⚠️ Primary EmailJS failed (${res.status}): ${errText}. Trying backup service...`);

    // Fallback service
    const backupRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://gorakhpursgotlatent.vercel.app',
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_BACKUP_SERVICE_ID,
        template_id: process.env.EMAILJS_BACKUP_TEMPLATE_ID,
        user_id: process.env.EMAILJS_BACKUP_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_BACKUP_PRIVATE_KEY,
        template_params: templateParams,
      }),
    });

    if (backupRes.ok) {
      console.log(`📧 EmailJS (Backup): Admin OTP sent successfully to ${toEmail}`);
      return { success: true };
    }

    const backupErr = await backupRes.text();
    console.error(`❌ EmailJS Backup Error: ${backupErr}`);
    return { success: false, message: backupErr || errText };
  } catch (err: any) {
    console.error('❌ EmailJS OTP exception:', err);
    return { success: false, message: err.message || 'Network error sending OTP' };
  }
}


export interface GenericApplicationEmailParams {
  applicationType: 'GUEST' | 'SPONSOR' | 'TEAM';
  applicationId: string;
  name: string;
  email: string;
  mobile?: string;
  summary?: string;
}

function escapeEmailHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function sendNitrosendEmail(to: string, subject: string, body: string): Promise<{ success: boolean; message?: string }> {
  const apiKey = process.env.NITROSEND_API_KEY;
  if (!apiKey) return { success: false, message: 'NITROSEND_API_KEY not configured' };

  const logoUrl = 'https://www.gkpgotlatent.in/logo-transparent.png';
  const html = `<div style="margin:0;padding:20px 12px;background:#f6f6f6;font-family:Arial,Helvetica,sans-serif;color:#222;">
    <div style="width:100%;max-width:560px;margin:0 auto;background:#fff;border:1px solid #e5e5e5;border-radius:10px;padding:20px 18px;box-sizing:border-box;text-align:left;">
      <div style="text-align:center;margin:0 0 14px;">
        <img src="${logoUrl}" alt="Gorakhpur's Got Latent" width="58" style="display:block;width:58px;height:auto;margin:0 auto;border:0;">
      </div>
      <div style="font-size:15px;line-height:1.65;word-break:break-word;overflow-wrap:anywhere;">${escapeEmailHtml(body).replace(/\\n/g, '<br>')}</div>
      <div style="margin-top:18px;padding-top:12px;border-top:1px solid #eee;text-align:center;font-size:12px;line-height:1.6;color:#666;">
        <a href="https://www.gkpgotlatent.in/" style="color:#b00000;text-decoration:none;">Website</a>
        &nbsp;·&nbsp;
        <a href="mailto:help.gglatent@gmail.com" style="color:#b00000;text-decoration:none;">Email</a>
        &nbsp;·&nbsp;
        <a href="https://wa.me/918423858424" style="color:#b00000;text-decoration:none;">WhatsApp</a>
      </div>
    </div>
  </div>`;

  try {
    const res = await fetch('https://api.nitrosend.com/v1/my/messages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `ggl-${to.toLowerCase()}-${subject}`.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 240),
      },
      body: JSON.stringify({ channel: 'email', to, subject, html, body }),
    });

    if (res.ok) return { success: true };
    const errorText = await res.text();

    // Nitrosend may temporarily defer admission (503), sometimes returning a
    // retry_at timestamp. Respect that hint when it is short enough to wait for,
    // then retry the same idempotent request a few times with backoff.
    if (res.status === 503) {
      let retryAtMs = 0;
      try {
        const parsed = JSON.parse(errorText);
        if (parsed?.retry_at) {
          const t = Date.parse(parsed.retry_at);
          if (Number.isFinite(t)) retryAtMs = t;
        }
      } catch {}

      const delays = [3500, 7000, 12000];
      for (let attempt = 0; attempt < delays.length; attempt++) {
        const backoffMs = delays[attempt];
        const hintedWait = retryAtMs ? Math.max(0, retryAtMs - Date.now()) : 0;
        const waitMs = Math.min(Math.max(backoffMs, hintedWait), 20000);
        await new Promise(resolve => setTimeout(resolve, waitMs));

        const retry = await fetch('https://api.nitrosend.com/v1/my/messages', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Idempotency-Key': `ggl-${to.toLowerCase()}-${subject}`.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 240),
          },
          body: JSON.stringify({ channel: 'email', to, subject, html, body }),
        });

        if (retry.ok) return { success: true };

        const retryText = await retry.text();
        console.error(`❌ Nitrosend retry ${attempt + 1} error:`, retry.status, retryText);
        if (retry.status !== 503) {
          return { success: false, message: `Nitrosend HTTP ${retry.status}: ${retryText}` };
        }

        retryAtMs = 0;
        try {
          const retryParsed = JSON.parse(retryText);
          if (retryParsed?.retry_at) {
            const t = Date.parse(retryParsed.retry_at);
            if (Number.isFinite(t)) retryAtMs = t;
          }
        } catch {}
      }

      return { success: false, message: `Nitrosend HTTP 503: ${errorText}` };
    }
    console.error('❌ Nitrosend error:', res.status, errorText);
    return { success: false, message: `Nitrosend HTTP ${res.status}: ${errorText}` };
  } catch (err: any) {
    console.error('❌ Nitrosend exception:', err);
    return { success: false, message: err?.message || 'Nitrosend network error' };
  }
}

export async function sendGenericApplicationEmails(params: GenericApplicationEmailParams): Promise<{ success: boolean; message?: string }> {
  const adminSubject = `GGL ${params.applicationType} Application | ${params.applicationId} | ${params.name}`;
  const userSubject = `GGL Application Received | ${params.applicationId}`;

  const adminBody = `A new ${params.applicationType.toLowerCase()} application has been submitted.

Application ID: ${params.applicationId}
Name: ${params.name}
Email: ${params.email}
Mobile: ${params.mobile || 'N/A'}

Details:
${params.summary || 'Submitted through the official GGL website.'}

Please review this application in the GGL admin panel.

Gorakhpur's Got Latent Admin`;

  const userBody = `Hi ${params.name},

Thank you for contacting Gorakhpur's Got Latent.

Your ${params.applicationType.toLowerCase()} application has been received successfully.

Application ID: ${params.applicationId}
Status: SUBMITTED

Our team will review the information and contact you if further action is required.

For support:
help.gglatent@gmail.com
WhatsApp: +91 84238 58424

Regards,
Gorakhpur's Got Latent Team`;

  if (process.env.NITROSEND_API_KEY) {
    const results = await Promise.all([
      sendNitrosendEmail('alooksingh1@gmail.com', adminSubject, adminBody),
      sendNitrosendEmail(params.email, userSubject, userBody),
    ]);
    return results.some(r => r.success)
      ? { success: true }
      : { success: false, message: results.map(r => r.message).filter(Boolean).join(' | ') };
  }

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    return { success: false, message: 'No transactional email provider is configured' };
  }

  const sendEmailJs = async (to: string, subject: string, message: string) => {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          to_email: to,
          email: to,
          user_email: to,
          to_name: params.name,
          customer_name: params.name,
          name: params.name,
          application_id: params.applicationId,
          app_id: params.applicationId,
          application_status: 'SUBMITTED',
          status: 'SUBMITTED',
          subject,
          message,
          help_email: 'help.gglatent@gmail.com',
          support_email: 'help.gglatent@gmail.com',
          help_whatsapp: '+91 84238 58424',
          instagram_handle: '@gkp_got_latent',
          instagram_url: 'https://www.instagram.com/gkp_got_latent/',
        },
      }),
    });
    return response.ok;
  };

  const results = await Promise.all([
    sendEmailJs('alooksingh1@gmail.com', adminSubject, adminBody),
    params.email.toLowerCase() !== 'alooksingh1@gmail.com'
      ? sendEmailJs(params.email, userSubject, userBody)
      : Promise.resolve(false),
  ]);

  return results.some(Boolean) ? { success: true } : { success: false, message: 'EmailJS delivery failed' };
}
