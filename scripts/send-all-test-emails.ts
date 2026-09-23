import {
  sendAdminLoginOtpEmail,
  sendBookingConfirmationEmail,
  sendPerformerApplicationEmail
} from '../lib/emailjs';

const TARGET_EMAIL = 'alooksingh1@gmail.com';

async function sendAllTestEmails() {
  console.log(`\n==================================================`);
  console.log(`🚀 TRIGGERING ALL EMAILJS EMAILS TO: ${TARGET_EMAIL}`);
  console.log(`==================================================\n`);

  const results: any[] = [];

  // 1. ADMIN LOGIN OTP EMAIL
  console.log(`[1/3] Sending GGL Admin Login OTP Email...`);
  try {
    const resOtp = await sendAdminLoginOtpEmail({
      toEmail: TARGET_EMAIL,
      otp: '749201',
    });
    console.log(`Admin OTP Email Result:`, resOtp);
    results.push({ name: 'Admin Login OTP Email', result: resOtp });
  } catch (err: any) {
    console.error(`Admin OTP Email Error:`, err);
    results.push({ name: 'Admin Login OTP Email', error: err.message });
  }

  // Brief delay between sends to respect rate limits
  await new Promise(r => setTimeout(r, 1500));

  // 2. TICKET BOOKING CONFIRMATION EMAIL
  console.log(`\n[2/3] Sending Ticket Purchase & Booking Confirmation Email...`);
  try {
    const resTicket = await sendBookingConfirmationEmail({
      customerName: 'Alok Singh',
      customerEmail: TARGET_EMAIL,
      orderNumber: 'GGL-ORD-982103',
      razorpayOrderId: 'order_test_live_9821',
      razorpayPaymentId: 'pay_test_live_9821',
      ticketNumber: 'GGL-TKT-VIP-001',
      eventTitle: "Gorakhpur's Got Latent — Grand Show 2026",
      eventDate: '25 October 2026',
      startTime: '06:00 PM',
      venueName: 'Yogi Gorakhnath Auditorium, Gorakhpur',
      categoryName: 'VIP All-Access Seat',
      quantity: 2,
      totalAmount: 1998,
      currency: 'INR'
    });
    console.log(`Ticket Confirmation Email Result:`, resTicket);
    results.push({ name: 'Ticket Confirmation Email', result: resTicket });
  } catch (err: any) {
    console.error(`Ticket Confirmation Email Error:`, err);
    results.push({ name: 'Ticket Confirmation Email', error: err.message });
  }

  await new Promise(r => setTimeout(r, 1500));

  // 3. PERFORMER APPLICATION AUDITION EMAIL (₹199 Paid)
  console.log(`\n[3/3] Sending Performer Audition Application (₹199 Paid) Email...`);
  try {
    const resPerformer = await sendPerformerApplicationEmail({
      application_id: 'GGL-PER-994120',
      created_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      full_name: 'Alok Singh (Test Performer)',
      age: 24,
      email: TARGET_EMAIL,
      mobile_number: '9876543210',
      whatsapp_number: '9876543210',
      call_number: '9876543210',
      city: 'Gorakhpur',
      performance_category: 'Stand-up Comedy & Satire',
      performance_title: 'Gorakhpur Express Standup Special',
      performance_description: 'Live standup comedy and mimicry act showcasing Gorakhpur city stories and regional comedy.',
      performance_type: 'Solo',
      performer_count: 1,
      performance_duration: '3 to 5 Minutes',
      performance_language: 'Bhojpuri & Hindi',
      special_requirements: 'Stage Mic + Lapel Mic with Stand',
      instagram_url: 'https://instagram.com/gorakhpurgotlatent',
      youtube_url: 'https://youtube.com/@gorakhpurgotlatent',
      discovery_source: 'Instagram Official Reel',
      additional_message: 'Ready for live audition on main stage.',
      payment_status: 'PAID',
      payment_amount: 199,
      payment_currency: 'INR',
      order_id: 'order_rzp_perf_199_test',
      payment_id: 'pay_rzp_perf_199_test',
      payment_verified_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      application_status: 'PAYMENT_VERIFIED',
      admin_notes: 'Instant EmailJS Dispatch Test to alooksingh1@gmail.com',
    });
    console.log(`Performer Application Email Result:`, resPerformer);
    results.push({ name: 'Performer Application Email', result: resPerformer });
  } catch (err: any) {
    console.error(`Performer Application Email Error:`, err);
    results.push({ name: 'Performer Application Email', error: err.message });
  }

  console.log(`\n==================================================`);
  console.log(`SUMMARY OF DISPATCHED EMAILS:`);
  console.log(JSON.stringify(results, null, 2));
  console.log(`==================================================\n`);
}

sendAllTestEmails();
