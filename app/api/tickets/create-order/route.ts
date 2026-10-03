import { NextResponse } from 'next/server';
import { razorpay, isRazorpayConfigured } from '@/lib/razorpay';
import { validateAgeIs18Plus } from '@/lib/ticketsStore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, mobile, email, instagramId, dob, quantity = 1, termsAgreed } = body;

    // Validate mandatory fields (Only Full Name and Mobile are required)
    if (!customerName || !customerName.trim() || !mobile || !mobile.trim()) {
      return NextResponse.json(
        { error: 'Please provide both Full Name and Mobile Number.' },
        { status: 400 }
      );
    }

    if (!termsAgreed) {
      return NextResponse.json(
        { error: 'You must agree to the event terms and conditions to proceed.' },
        { status: 400 }
      );
    }

    // Optional fields with sensible defaults
    const cleanEmail = (email || '').trim();
    const cleanInsta = (instagramId || '').trim();
    const cleanDob = (dob || '').trim();

    let formattedDob = '2000-01-01';
    if (cleanDob) {
      const ageCheck = validateAgeIs18Plus(cleanDob);
      if (!ageCheck.is18Plus) {
        return NextResponse.json(
          { error: 'You must be 18 or above to book this ticket.' },
          { status: 400 }
        );
      }
      formattedDob = ageCheck.formattedDob;
    }

    // Quantity & Pricing (₹149 per ticket)
    const qty = Math.max(1, Math.min(10, Number(quantity) || 1));
    const ticketPrice = 149;
    const totalAmount = qty * ticketPrice;
    const amountPaise = totalAmount * 100;

    const bookingId = `ord-ggl-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_live_Tfu7PlxOWV6ohp';
    let razorpayOrderId = `rzp_ord_${bookingId}`;

    // Call Razorpay API if available
    if (razorpay) {
      try {
        const rzpOrder = await razorpay.orders.create({
          amount: amountPaise,
          currency: 'INR',
          receipt: bookingId,
          notes: {
            customer_name: customerName,
            customer_email: cleanEmail || 'attendee@gkpgotlatent.in',
            customer_mobile: mobile,
            instagram_id: cleanInsta || '@ggl_guest',
            dob: formattedDob,
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
      email: cleanEmail,
      instagramId: cleanInsta,
      dob: formattedDob,
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
