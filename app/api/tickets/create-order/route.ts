import { NextResponse } from 'next/server';
import { razorpay, isRazorpayConfigured } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, mobile, email, instagramId, quantity = 1, termsAgreed } = body;

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
    const formattedDob = '';

    // Quantity & Pricing (₹149 per ticket)
    const qty = Math.max(1, Math.min(10, Number(quantity) || 1));
    const ticketPrice = 149;
    const totalAmount = qty * ticketPrice;
    const amountPaise = totalAmount * 100;

    const bookingId = `ord-ggl-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || '';

    if (!isRazorpayConfigured() || !razorpay || !razorpayKeyId) {
      return NextResponse.json(
        { error: 'Payment gateway is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    let razorpayOrderId = '';
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
            quantity: String(qty),
            event: "Gorakhpur's Got Latent Live Show",
          },
        });
        razorpayOrderId = rzpOrder.id;
      } catch (rzpErr: any) {
        console.error('Razorpay order creation failed:', rzpErr?.message || rzpErr);
        return NextResponse.json(
          { error: 'Unable to create payment order. Please try again.' },
          { status: 502 }
        );
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
