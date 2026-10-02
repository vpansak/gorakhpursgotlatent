import { NextResponse } from 'next/server';
import { razorpay, isRazorpayConfigured } from '@/lib/razorpay';
import { validateAgeIs18Plus } from '@/lib/ticketsStore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, mobile, email, instagramId, dob, quantity = 1, termsAgreed } = body;

    // Validate mandatory fields
    if (!customerName || !mobile || !email || !instagramId || !dob) {
      return NextResponse.json(
        { error: 'Please fill all required attendee details (Full Name, Mobile, Email, Instagram ID, and Date of Birth).' },
        { status: 400 }
      );
    }

    if (!termsAgreed) {
      return NextResponse.json(
        { error: 'You must agree to the event terms and conditions to proceed.' },
        { status: 400 }
      );
    }

    // Age validation (18+)
    const ageCheck = validateAgeIs18Plus(dob);
    if (!ageCheck.is18Plus) {
      return NextResponse.json(
        { error: 'You must be 18 or above to book this ticket.' },
        { status: 400 }
      );
    }

    // Quantity validation (1 to 10)
    const qty = Math.max(1, Math.min(10, Number(quantity) || 1));
    const ticketPrice = 0;
    const totalAmount = 0;
    const amountPaise = 0;

    const bookingId = `ord-ggl-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_Tfu7PlxOWV6ohp';
    let razorpayOrderId = `free_order_${bookingId}`;

    // Call Razorpay API if available
    if (razorpay) {
      try {
        const rzpOrder = await razorpay.orders.create({
          amount: amountPaise,
          currency: 'INR',
          receipt: bookingId,
          notes: {
            customer_name: customerName,
            customer_email: email,
            customer_mobile: mobile,
            instagram_id: instagramId,
            dob: ageCheck.formattedDob,
            quantity: String(qty),
            event: "Gorakhpur's Got Latent Live Show",
          },
        });
        razorpayOrderId = rzpOrder.id;
      } catch (rzpErr: any) {
        console.warn('Razorpay order creation fallback:', rzpErr?.message || rzpErr);
      }
    }

    return NextResponse.json({
      success: true,
      bookingId,
      razorpayOrderId,
      amount: totalAmount,
      amountPaise,
      currency: 'INR',
      keyId: razorpayKeyId,
      customerName,
      mobile,
      email,
      instagramId,
      dob: ageCheck.formattedDob,
      quantity: qty,
      ticketPrice,
    });
  } catch (err: any) {
    console.error('Error creating ticket order:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to create ticket order. Please check your network and try again.' },
      { status: 500 }
    );
  }
}
