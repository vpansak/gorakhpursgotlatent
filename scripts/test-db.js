import { saveTicketRecord, getAllTickets, getTicketByTicketId, checkInTicket } from '../lib/ticketsStore.js';

async function testFullTicketFlow() {
  console.log('Testing full ticket flow with Neon PostgreSQL...');
  
  const sampleTicket = {
    id: `tck-${Date.now()}`,
    ticket_id: 'GGLT542495',
    booking_id: `ord-ggl-${Date.now()}`,
    customer_name: 'Alok Singh',
    mobile: '08738869635',
    email: 'alok@gmi.com',
    instagram_id: '@alok',
    date_of_birth: '13 April 2008',
    quantity: 1,
    amount: 0,
    razorpay_order_id: 'free_order_542495',
    razorpay_payment_id: 'free_pass_542495',
    payment_status: 'PAID',
    ticket_status: 'VALID',
    qr_token: 'qr_542495_token',
    checked_in: 0,
    checked_in_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // 1. Save ticket
  console.log('Saving ticket GGLT542495 to Neon DB...');
  await saveTicketRecord(sampleTicket);
  console.log('✅ Ticket saved.');

  // 2. Query ticket back
  console.log('Querying ticket GGLT542495...');
  const found = await getTicketByTicketId('GGLT542495');
  console.log('Found ticket:', found ? `SUCCESS (${found.customer_name})` : 'NOT FOUND');

  // 3. Query all tickets
  const all = await getAllTickets();
  console.log('Total tickets in database:', all.length);

  // 4. Test Check-in
  console.log('Testing check-in for GGLT542495...');
  const checkinRes = await checkInTicket('GGLT542495');
  console.log('Check-in Result:', checkinRes.message);

  // 5. Test Duplicate Check-in
  console.log('Testing duplicate check-in...');
  const dupRes = await checkInTicket('GGLT542495');
  console.log('Duplicate Result:', dupRes.message);
}

testFullTicketFlow();
