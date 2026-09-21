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
  full_name: string;
  email: string;
  mobile_number: string;
  whatsapp_number: string;
  alternate_contact: string;
  performance_category: string;
  performance_title: string;
  performance_type: string;
  performer_count: number | string;
  performance_duration: string;
  performance_language: string;
  city: string;
  age: number | string;
  instagram_url: string;
  youtube_url: string;
  facebook_url: string;
  special_requirements: string;
  discovery_source: string;
  additional_message: string;
  payment_status: string;
  order_id: string;
  payment_id: string;
  payment_amount: number | string;
  payment_verified_at: string;
  application_status: string;
}

export async function sendPerformerApplicationEmail(params: PerformerEmailParams): Promise<{ success: boolean; message?: string }> {
  const serviceId = process.env.EMAILJS_SERVICE_ID || 'service_15li5i6';
  const templateId = process.env.EMAILJS_PERFORMER_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID || 'template_41t6fmb';
  const publicKey = process.env.EMAILJS_PUBLIC_KEY || 'K2hOwDJVfSGpJ3nih';
  const privateKey = process.env.EMAILJS_PRIVATE_KEY || '30mafPjRgPPn5im53Idzh';

  const recipients = ['gkpgotlatent@gmail.com', 'alooksingh1@gmail.com'];
  let allSuccess = true;
  const errors: string[] = [];

  for (const recipientEmail of recipients) {
    const payload = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: {
        to_email: recipientEmail,
        to_name: 'Gorakhpur’s Got Latent Admin Team',
        subject: `New Performer Application – ${params.application_id} – ${params.full_name}`,
        application_id: params.application_id,
        full_name: params.full_name,
        email: params.email,
        mobile_number: params.mobile_number,
        whatsapp_number: params.whatsapp_number,
        alternate_contact: params.alternate_contact || 'N/A',
        performance_category: params.performance_category,
        performance_title: params.performance_title,
        performance_type: params.performance_type || 'Solo',
        performer_count: String(params.performer_count || 1),
        performance_duration: params.performance_duration || 'N/A',
        performance_language: params.performance_language || 'N/A',
        city: params.city,
        age: String(params.age || 'N/A'),
        instagram_url: params.instagram_url || 'N/A',
        youtube_url: params.youtube_url || 'N/A',
        facebook_url: params.facebook_url || 'N/A',
        special_requirements: params.special_requirements || 'None',
        discovery_source: params.discovery_source || 'N/A',
        additional_message: params.additional_message || 'N/A',
        payment_status: params.payment_status,
        order_id: params.order_id || 'N/A',
        payment_id: params.payment_id || 'N/A',
        payment_amount: String(params.payment_amount || 499),
        payment_verified_at: params.payment_verified_at || new Date().toISOString(),
        application_status: params.application_status,
      },
    };

    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ EmailJS Error for ${recipientEmail}: ${errorText}`);
        allSuccess = false;
        errors.push(`${recipientEmail}: ${errorText}`);
      } else {
        console.log(`📧 EmailJS: Performer application notification sent to ${recipientEmail}`);
      }
    } catch (err: any) {
      console.error(`❌ EmailJS Exception for ${recipientEmail}:`, err);
      allSuccess = false;
      errors.push(`${recipientEmail}: ${err.message}`);
    }
  }

  return { success: allSuccess, message: errors.join('; ') };
}
