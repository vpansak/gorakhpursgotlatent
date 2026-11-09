import { indianMobile } from '@/lib/phone';
import { NextResponse } from 'next/server';
import { getRazorpayKeyId, getRazorpayInstance, isRazorpayConfigured } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, mobile: rawMobile, email, instagramId, quantity = 1 } = body;
    const mobile = indianMobile(rawMobile);

    // Validate mandatory fields (Only Full Name and Mobile are required)
    if (typeof customerName !== 'string' || !customerName.trim() || !mobile) {
      return NextResponse.json(
        { error: 'Please provide your full name and a valid 10-digit Indian mobile number.' },
        { status: 400 }
      );
    }

    // Terms checkbox was removed from the booking UI, so do not require termsAgreed here.

    // Optional fields with sensible defaults
    const cleanEmail = (email || '').trim();
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return NextResponse.json({error:'Enter a valid email address or leave it blank.'},{status:400});
    const cleanInsta = (instagramId || '').trim();

    // Quantity & Pricing (₹149 per ticket)
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 5) return NextResponse.json({ error: 'Choose between 1 and 5 tickets.' }, { status: 400 });
    const ticketPrice = 149;
    const totalAmount = qty * ticketPrice;
    const amountPaise = totalAmount * 100;

    const bookingId = `ord-ggl-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const razorpayKeyId = getRazorpayKeyId();
    const rzpInstance = getRazorpayInstance();

    if (!isRazorpayConfigured() || !rzpInstance || !razorpayKeyId) {
      return NextResponse.json(
        { error: 'Payment gateway is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    let razorpayOrderId = '';
    try {
        const rzpOrder = await rzpInstance.orders.create({
          amount: amountPaise,
          currency: 'INR',
          receipt: bookingId,
          notes: {
            customer_name: customerName,
            customer_email: cleanEmail,
            customer_mobile: mobile,
            instagram_id: cleanInsta || '@ggl_guest',
            quantity: String(qty),
            event: "Gorakhpur's Got Latent Episode 3",
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
