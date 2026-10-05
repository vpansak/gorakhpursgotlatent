import { NextResponse, after } from 'next/server';

export const maxDuration = 60;
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { sendBookingConfirmationEmail } from '@/lib/emailjs';
import { 
  generateUniqueTicketId, 
  generateQrToken, 
  saveTicketRecord, 
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

    if (!process.env.RAZORPAY_KEY_SECRET) {
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

    const ticketId = generateUniqueTicketId();
    const qrToken = generateQrToken(ticketId);
    const now = new Date().toISOString();

    const ticketRecord: TicketRecord = {
      id: `tck-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      ticket_id: ticketId,
      booking_id: bookingId || `ord-${Date.now()}`,
      customer_name: customerName || 'Audience Guest',
      mobile: mobile || '',
      email: email || '',
      instagram_id: instagramId ? (instagramId.startsWith('@') ? instagramId : `@${instagramId}`) : '@ggl_fan',
      date_of_birth: '',
      quantity: Number(quantity) || 1,
      amount: Number(amount) || 149,
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
      after(async () => {
        try {
          const res = await sendBookingConfirmationEmail({
            customerName: ticketRecord.customer_name,
            customerEmail: ticketRecord.email,
            orderNumber: ticketRecord.booking_id,
            razorpayOrderId: ticketRecord.razorpay_order_id,
            razorpayPaymentId: ticketRecord.razorpay_payment_id,
            ticketNumber: ticketRecord.ticket_id,
            eventTitle: 'Gorakhpur\'s Got Latent',
            eventDate: 'As announced on the official website',
            startTime: 'As announced on the official website',
            venueName: 'Gorakhpur',
            categoryName: 'Show Ticket',
            quantity: ticketRecord.quantity,
            totalAmount: ticketRecord.amount,
            currency: 'INR',
          });
          if (!res.success) console.warn('Ticket confirmation email warning:', res.message);
        } catch (err) {
          console.error('Ticket confirmation email error:', err);
        }
      });
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
