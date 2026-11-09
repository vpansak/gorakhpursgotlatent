import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/load.mjs';
const { winnerPrizeAmount } = load('lib/winnerPrize.ts', {});
const { verifiedTicketOrder } = load('lib/verifiedTicketOrder.ts', {});
const order = { id: 'order_1', amount: 44700, currency: 'INR', notes: { quantity: '3' } };
const payment = { id: 'pay_1', order_id: 'order_1', amount: 44700, currency: 'INR', status: 'captured' };
test('prize uses announced 2x participation payment including paise', () => {
  assert.equal(winnerPrizeAmount(799), 1598); assert.equal(winnerPrizeAmount('499.50'),999); assert.equal(winnerPrizeAmount('0.01'),0.02);
});
test('invalid prize amounts never display a payout', () => {
  for (const amount of ['', 'bad', '-2', 0, -1, Infinity, NaN, '10.001', Number.MAX_SAFE_INTEGER]) assert.equal(winnerPrizeAmount(amount),null);
});
test('ticket quantities come from captured gateway order', () => {
  const verified = verifiedTicketOrder(order,payment,'order_1','pay_1'); assert.equal(verified.quantity,3); assert.equal(verified.amount,447);
});
test('wrong payment, order, currency, amount and fractional admission count fail closed', () => {
  for (const changed of [{status:'authorized'},{order_id:'other'},{amount:14900},{currency:'USD'},{id:'wrong'}]) assert.equal(verifiedTicketOrder(order,{...payment,...changed},'order_1','pay_1'),null);
  for (const quantity of ['1.5','10','0','-1','bad']) assert.equal(verifiedTicketOrder({...order,notes:{quantity}},payment,'order_1','pay_1'),null);
});
test('missing performer contact details are rejected before database access', async () => {
 const route=load('app/api/apply/performer/route.ts',{'next/server':{NextResponse:{json:(body,init)=>Response.json(body,init)}},'@/lib/db':{db:{queryStrict:()=>{throw Error('Must not write')}}},'@/lib/storage':{},'@/lib/helpers':{},'@/lib/performerInvitation':{},'@/lib/performerAdminNotification':{}});
 for (const termsAccepted of [undefined,false,'true']) assert.equal((await route.POST(new Request('https://test.invalid',{method:'POST',body:JSON.stringify({termsAccepted})}))).status,400);
});
test('forged browser ticket amount is ignored and a callback retry reuses the saved ticket', async () => {
 let saved;let existing=null;
 const route=load('app/api/tickets/verify-payment/route.ts',{'next/server':{NextResponse:{json:(body,init)=>Response.json(body,init)}},'@/lib/episode2':{EPISODE_2:{}},'@/lib/razorpay':{verifyRazorpaySignature:()=>true,getRazorpayKeySecret:()=> 'test',getRazorpayInstance:()=>({orders:{fetch:async()=>({...order,notes:{...order.notes,customer_name:'Confirmed Name'}})},payments:{fetch:async()=>payment}})},'@/lib/verifiedTicketOrder':{verifiedTicketOrder},'@/lib/emailjs':{},'@/lib/ticketEmail':{},'@/lib/ticketsStore':{generateUniqueTicketId:()=> 'TICKET',generateQrToken:()=> 'QR',getTicketByTicketId:async()=>existing,saveTicketRecord:async t=>{saved=t;existing=t}}});
 const req=()=>new Request('https://test.invalid',{method:'POST',body:JSON.stringify({razorpay_order_id:'order_1',razorpay_payment_id:'pay_1',razorpay_signature:'sig',quantity:10,amount:1,customerName:'Forged'})});
 assert.equal((await route.POST(req())).status,200);assert.equal(saved.quantity,3);assert.equal(saved.amount,447);assert.equal(saved.customer_name,'Confirmed Name');assert.equal((await (await route.POST(req())).json()).ticket.ticket_id,'TICKET');
});
