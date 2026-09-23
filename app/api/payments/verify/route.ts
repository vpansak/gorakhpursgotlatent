import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { syncSheetsToS3 } from '@/lib/storage';
import { verifyRazorpaySignature, isRazorpayConfigured } from '@/lib/razorpay';
import { generateTicketNumber, generateQrHash } from '@/lib/helpers';
import { sendBookingConfirmationEmail } from '@/lib/emailjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, categoryId, quantity, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!orderId || !categoryId || !quantity) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    // 1. Retrieve internal order with event & category details
    const order = db.prepare(`
      SELECT o.*, e.title as event_title, e.event_date, e.start_time, e.venue_name, c.name as category_name
      FROM ticket_orders o
      JOIN events e ON o.event_id = e.id
      JOIN ticket_categories c ON c.id = ?
      WHERE o.id = ?
    `).get(categoryId, orderId) as any;

    if (!order) {
      return NextResponse.json({ error: 'Order record not found' }, { status: 404 });
    }

    // Prevent double verification if already paid
    if (order.payment_status === 'PAID') {
      return NextResponse.json({ success: true, message: 'Order already processed and paid', orderId });
    }

    // 2. Perform HMAC signature check if Razorpay is configured
    if (isRazorpayConfigured()) {
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return NextResponse.json({ error: 'Razorpay payment signature headers missing' }, { status: 400 });
      }

      const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
      if (!isValid) {
        db.prepare(`
          INSERT INTO payments (id, order_id, razorpay_order_id, razorpay_payment_id, amount, status, error_description)
          VALUES (?, ?, ?, ?, ?, 'FAILED', 'Invalid signature verification')
        `).run(`pay-${Date.now()}`, orderId, razorpayOrderId, razorpayPaymentId, order.total_amount);

        db.prepare("UPDATE ticket_orders SET payment_status = 'FAILED' WHERE id = ?").run(orderId);

        return NextResponse.json({ error: 'Payment signature verification failed. Ticket generation aborted.' }, { status: 400 });
      }
    }

    // 3. Atomically update DB state inside SQLite Transaction
    const transaction = db.transaction(() => {
      // Mark order as PAID
      db.prepare(`
        UPDATE ticket_orders
        SET payment_status = 'PAID', razorpay_payment_id = ?, razorpay_signature = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(razorpayPaymentId || `pay_sim_${Date.now()}`, razorpaySignature || 'simulated_sig', orderId);

      // Decrement inventory
      db.prepare(`
        UPDATE ticket_categories
        SET available_qty = MAX(0, available_qty - ?)
        WHERE id = ?
      `).run(quantity, categoryId);

      // Generate digital tickets
      const insertTicket = db.prepare(`
        INSERT INTO tickets (
          id, ticket_number, order_id, category_id, event_id, customer_name,
          customer_email, customer_phone, qr_code_hash, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'VALID')
      `);

      const issuedTickets = [];

      for (let i = 0; i < Number(quantity); i++) {
        const ticketNumber = generateTicketNumber();
        const ticketId = `tkt-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`;
        const qrHash = generateQrHash(ticketNumber, orderId);

        insertTicket.run(
          ticketId,
          ticketNumber,
          orderId,
          categoryId,
          order.event_id,
          order.customer_name,
          order.customer_email,
          order.customer_phone,
          qrHash
        );

        issuedTickets.push({ ticketId, ticketNumber, qrHash });
      }

      // Log Payment Audit
      db.prepare(`
        INSERT INTO payments (id, order_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, status)
        VALUES (?, ?, ?, ?, ?, ?, 'PAID')
      `).run(
        `pay-${Date.now()}`,
        orderId,
        razorpayOrderId || order.razorpay_order_id || 'sim_order',
        razorpayPaymentId || `pay_sim_${Date.now()}`,
        razorpaySignature || 'sim_sig',
        order.total_amount
      );

      return issuedTickets;
    });

    const issuedTickets = transaction();
    const primaryTicketNumber = issuedTickets[0]?.ticketNumber || 'GGL-TKT-PASS';

    // 4. Trigger EmailJS Confirmation Email after successful payment & ticket issuance
    let emailStatus = 'SENT';
    const emailResult = await sendBookingConfirmationEmail({
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      orderNumber: order.order_number,
      razorpayOrderId: razorpayOrderId || order.razorpay_order_id || 'sim_order',
      razorpayPaymentId: razorpayPaymentId || `pay_sim_${Date.now()}`,
      ticketNumber: primaryTicketNumber,
      eventTitle: order.event_title,
      eventDate: order.event_date,
      startTime: order.start_time,
      venueName: order.venue_name,
      categoryName: order.category_name,
      quantity: Number(quantity),
      totalAmount: Number(order.total_amount),
      currency: 'INR',
    });

    if (!emailResult.success) {
      emailStatus = 'FAILED';
      console.warn(`⚠️ Email delivery failed, but ticket ${primaryTicketNumber} remains VALID in database.`);
    }

    db.prepare("UPDATE ticket_orders SET confirmation_email_status = ? WHERE id = ?").run(emailStatus, orderId);

    // Sync updated ticket orders sheet to S3
    syncSheetsToS3().catch(err => console.error('S3 sync error:', err));

    return NextResponse.json({
      success: true,
      message: 'Payment verified and tickets issued successfully!',
      orderId,
      orderNumber: order.order_number,
      paymentStatus: 'PAID',
      emailStatus,
      tickets: issuedTickets,
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: error.message || 'Payment verification failed' }, { status: 500 });
  }
}
