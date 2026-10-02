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
  const serviceId = process.env.EMAILJS_SERVICE_ID || 'service_15li5i6';
  const templateId = process.env.EMAILJS_TEMPLATE_ID || 'template_41t6fmb';
  const publicKey = process.env.EMAILJS_PUBLIC_KEY || 'K2hOwDJVfSGpJ3nih';
  const privateKey = process.env.EMAILJS_PRIVATE_KEY || '30mafPjRgPPn5im53Idzh';

  if (!serviceId || !templateId || !publicKey) {
    console.warn('⚠️ EmailJS credentials missing on server. Email notification skipped.');
    return { success: false, message: 'EmailJS credentials not configured' };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

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
        service_id: 'vpansak',
        template_id: 'template_b3h1egs',
        user_id: 'jjG3XUesW7Yt8McRJ',
        accessToken: 'G-re211vGlwHrNVCniNgz',
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
  // Credentials for Admin Notification Email (vpansak / template_b3h1egs)
  const adminServiceId = process.env.EMAILJS_PERFORMER_SERVICE_ID || 'vpansak';
  const adminTemplateId = process.env.EMAILJS_PERFORMER_TEMPLATE_ID || 'template_b3h1egs';
  const adminPublicKey = process.env.EMAILJS_PERFORMER_PUBLIC_KEY || 'jjG3XUesW7Yt8McRJ';
  const adminPrivateKey = process.env.EMAILJS_PERFORMER_PRIVATE_KEY || 'G-re211vGlwHrNVCniNgz';

  // Credentials for Applicant Welcome / Confirmation Email (service_15li5i6 / template_41t6fmb)
  const userServiceId = process.env.EMAILJS_SERVICE_ID || 'service_15li5i6';
  const userTemplateId = process.env.EMAILJS_TEMPLATE_ID || 'template_41t6fmb';
  const userPublicKey = process.env.EMAILJS_PUBLIC_KEY || 'K2hOwDJVfSGpJ3nih';
  const userPrivateKey = process.env.EMAILJS_PRIVATE_KEY || '30mafPjRgPPn5im53Idzh';

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
  const serviceId = process.env.EMAILJS_OTP_SERVICE_ID || 'service_uvjpamq';
  const templateId = process.env.EMAILJS_OTP_TEMPLATE_ID || 'template_6l63rff';
  const publicKey = process.env.EMAILJS_OTP_PUBLIC_KEY || 'YRdAw-LarammkaqtX';
  const privateKey = process.env.EMAILJS_OTP_PRIVATE_KEY || 'ur81P_T37pPwE0ivVNSkq';

  const { toEmail, otp } = params;

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
        service_id: 'vpansak',
        template_id: 'template_b3h1egs',
        user_id: 'jjG3XUesW7Yt8McRJ',
        accessToken: 'G-re211vGlwHrNVCniNgz',
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
