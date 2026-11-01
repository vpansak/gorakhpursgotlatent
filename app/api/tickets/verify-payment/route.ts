import { NextResponse } from 'next/server';
import { EPISODE_2 } from '@/lib/episode2';
import { verifyRazorpaySignature, getRazorpayKeySecret, getRazorpayInstance } from '@/lib/razorpay';
import { verifiedTicketOrder } from '@/lib/verifiedTicketOrder';
import { sendBookingConfirmationEmail } from '@/lib/emailjs';
import {
  generateUniqueTicketId,
  generateQrToken,
  saveTicketRecord,
  getTicketByTicketId,
  TicketRecord
} from '@/lib/ticketsStore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerName,
      mobile,
      email,
      instagramId,
      quantity = 1,
      amount = 149
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Payment verification data is incomplete.' },
        { status: 400 }
      );
    }

    if (!getRazorpayKeySecret()) {
      return NextResponse.json(
        { success: false, error: 'Payment gateway is not configured on the server.' },
        { status: 503 }
      );
    }

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed.' },
        { status: 400 }
      );
    }

    const gateway = getRazorpayInstance();
    if (!gateway) return NextResponse.json({ success: false, error: 'Payment gateway unavailable.' }, { status: 503 });
    const [order, payment] = await Promise.all([
      gateway.orders.fetch(razorpay_order_id),
      gateway.payments.fetch(razorpay_payment_id),
    ]);
    const verified = verifiedTicketOrder(order, payment, razorpay_order_id, razorpay_payment_id);
    if (!verified) return NextResponse.json({ success: false, error: 'Captured ticket payment does not match this order.' }, { status: 400 });
    const existing = await getTicketByTicketId(razorpay_payment_id);
    if (existing) return NextResponse.json({ success: true, ticket: existing, message: 'Your ticket is already confirmed.' });

    const ticketId = generateUniqueTicketId();
    const qrToken = generateQrToken(ticketId);
    const now = new Date().toISOString();

    const ticketRecord: TicketRecord = {
      id: `tck-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      ticket_id: ticketId,
      booking_id: String(order.receipt || bookingId || `ord-${Date.now()}`),
      customer_name: String(order.notes?.customer_name || 'Audience Guest'),
      mobile: String(order.notes?.customer_mobile || ''),
      email: String(order.notes?.customer_email || ''),
      instagram_id: String(order.notes?.instagram_id || '@ggl_guest'),
      quantity: verified.quantity,
      amount: verified.amount,
      razorpay_order_id,
      razorpay_payment_id,
      payment_status: 'PAID',
      ticket_status: 'VALID',
      qr_token: qrToken,
      checked_in: 0,
      checked_in_at: null,
      created_at: now,
      updated_at: now,
    };

    await saveTicketRecord(ticketRecord);

    if (ticketRecord.email) {
      sendBookingConfirmationEmail({
        customerName: ticketRecord.customer_name,
        customerEmail: ticketRecord.email,
        orderNumber: ticketRecord.booking_id,
        razorpayOrderId: ticketRecord.razorpay_order_id,
        razorpayPaymentId: ticketRecord.razorpay_payment_id,
        ticketNumber: ticketRecord.ticket_id,
        eventTitle: 'Gorakhpur\'s Got Latent',
        eventDate: `${EPISODE_2.weekday}, ${EPISODE_2.date}`,
        startTime: EPISODE_2.time,
        venueName: `${EPISODE_2.venue}, Gorakhpur`,
        categoryName: 'Show Ticket',
        quantity: ticketRecord.quantity,
        totalAmount: ticketRecord.amount,
        currency: 'INR',
      }).then((res) => {
        if (!res.success) console.warn('Ticket confirmation email warning:', res.message);
      }).catch((err) => console.error('Ticket confirmation email error:', err));
    }


    return NextResponse.json({
      success: true,
      ticket: ticketRecord,
      message: '🎉 TICKET CONFIRMED: Your GGL ticket has been successfully booked.',
    });
  } catch (err: any) {
    console.error('Error verifying ticket payment:', err);
    return NextResponse.json(
      { error: err?.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
