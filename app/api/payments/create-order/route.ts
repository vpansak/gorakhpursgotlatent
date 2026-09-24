import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { razorpay, isRazorpayConfigured } from '@/lib/razorpay';
import { generateOrderNumber } from '@/lib/helpers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventId, categoryId, quantity, customerName, customerEmail, customerPhone } = body;

    if (!eventId || !categoryId || !quantity || quantity < 1 || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json({ error: 'All attendee and ticket selection fields are required' }, { status: 400 });
    }

    // 1. Fetch event
    const event = db.prepare("SELECT * FROM events WHERE id = ? AND status = 'PUBLISHED'").get(eventId) as any;
    if (!event) {
      return NextResponse.json({ error: 'Selected event is not active or available' }, { status: 404 });
    }

    // 2. Fetch ticket category
    const category = db.prepare("SELECT * FROM ticket_categories WHERE id = ? AND event_id = ? AND status = 'ACTIVE'").get(categoryId, eventId) as any;
    if (!category) {
      return NextResponse.json({ error: 'Ticket category not found or inactive' }, { status: 404 });
    }

    // Check inventory
    if (category.available_qty < quantity) {
      return NextResponse.json({ error: `Only ${category.available_qty} tickets remaining for ${category.name}` }, { status: 400 });
    }

    if (quantity > category.max_per_order) {
      return NextResponse.json({ error: `Maximum ${category.max_per_order} tickets allowed per transaction` }, { status: 400 });
    }

    // 3. Server-side total calculation (NEVER trust frontend price)
    const unitPrice = Number(category.price);
    const totalAmount = unitPrice * Number(quantity);
    const orderNumber = generateOrderNumber();
    const orderId = `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    let razorpayOrderId = `rzp_mock_${orderNumber}`;

    // 4. Call Razorpay if configured
    if (isRazorpayConfigured() && razorpay) {
      try {
        const rzpOrder = await razorpay.orders.create({
          amount: Math.round(totalAmount * 100), // Amount in paise
          currency: 'INR',
          receipt: orderNumber,
          notes: {
            event: event.title,
            category: category.name,
            quantity: String(quantity),
            customer_name: customerName,
            customer_email: customerEmail,
          },
        });
        razorpayOrderId = rzpOrder.id;
      } catch (rzpErr: any) {
        console.error('Razorpay order creation failed:', rzpErr);
        const errMsg = rzpErr?.error?.description || rzpErr?.message || (rzpErr?.statusCode === 401 ? 'Razorpay Authentication Failed: Key ID and Secret do not match' : 'Failed to create Razorpay order');
        return NextResponse.json({ error: `Razorpay Error: ${errMsg}` }, { status: 400 });
      }
    } else {
      console.warn("⚠️ Razorpay is not configured with live keys. Mode: Sandbox Order Simulation.");
    }

    // 5. Insert order into DB
    const insertOrder = db.prepare(`
      INSERT INTO ticket_orders (
        id, order_number, customer_name, customer_email, customer_phone,
        event_id, total_amount, currency, payment_status, razorpay_order_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)
    `);

    insertOrder.run(
      orderId,
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      eventId,
      totalAmount,
      'INR',
      razorpayOrderId
    );

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      razorpayOrderId,
      amount: totalAmount,
      amountPaise: Math.round(totalAmount * 100),
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_live_Tfu7PlxOWV6ohp',
      eventName: event.title,
      categoryName: category.name,
      quantity,
      isConfigured: isRazorpayConfigured(),
    });
  } catch (error: any) {
    console.error('Error creating ticket order:', error);
    const msg = error?.error?.description || error?.message || 'Failed to create payment order';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
