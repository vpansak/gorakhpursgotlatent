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
