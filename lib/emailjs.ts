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
    } else {
      const errorText = await res.text();
      console.error(`❌ EmailJS Error (${res.status}): ${errorText}`);
      return { success: false, message: `EmailJS HTTP ${res.status}: ${errorText}` };
    }
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
  const serviceId = process.env.EMAILJS_SERVICE_ID || 'vpansak';
  const templateId = process.env.EMAILJS_PERFORMER_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID || 'template_b3h1egs';
  const publicKey = process.env.EMAILJS_PUBLIC_KEY || 'jjG3XUesW7Yt8McRJ';
  const privateKey = process.env.EMAILJS_PRIVATE_KEY || 'G-re211vGlwHrNVCniNgz';

  const recipientEmails = 'help@gkpgotlatent.in, alooksingh1@gmail.com';

  // Format social URLs with "Not Provided" fallback for optional ones
  const youtubeUrlFormatted = (params.youtube_url && params.youtube_url.trim()) ? params.youtube_url.trim() : 'Not Provided';
  const facebookUrlFormatted = (params.facebook_url && params.facebook_url.trim()) ? params.facebook_url.trim() : 'Not Provided';
  const specialReqFormatted = (params.special_requirements && params.special_requirements.trim()) ? params.special_requirements.trim() : 'Not Provided';
  const addMsgFormatted = (params.additional_message && params.additional_message.trim()) ? params.additional_message.trim() : 'Not Provided';
  const callNumFormatted = params.call_number || params.alternate_contact || params.mobile_number || 'N/A';

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    accessToken: privateKey,
    template_params: {
      to_email: recipientEmails,
      to_name: 'Gorakhpur’s Got Latent Admin Team',
      subject: `🎤 GGL Application | ${params.application_id}`,
      application_id: params.application_id,
      created_at: params.created_at || new Date().toISOString(),
      application_status: params.application_status,
      full_name: params.full_name,
      age: String(params.age || 'N/A'),
      email: params.email,
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
      payment_amount: String(params.payment_amount || 199),
      payment_currency: params.payment_currency || 'INR',
      razorpay_order_id: params.order_id || 'N/A',
      razorpay_payment_id: params.payment_id || 'N/A',
      payment_verified_at: params.payment_verified_at || new Date().toISOString(),
      admin_notes: params.admin_notes || '',
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

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ EmailJS Error: ${errorText}`);
      return { success: false, message: errorText };
    } else {
      console.log(`📧 EmailJS: Performer application notification sent successfully to ${recipientEmails}`);
      return { success: true };
    }
  } catch (err: any) {
    console.error('❌ EmailJS Exception:', err);
    return { success: false, message: err.message };
  }
}
