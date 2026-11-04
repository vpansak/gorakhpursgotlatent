import test from 'node:test';
import assert from 'node:assert/strict';
import { timingSafeEqual,createHash } from 'node:crypto';
import { PDFDocument } from 'pdf-lib';
import { createTicketPdf } from '../lib/ticketPdf.ts';
import { load } from './helpers/load.mjs';
const ticket={ticket_id:'GGLT123456',customer_name:'राहुल शर्मा / Rahul',booking_id:'ord-1',mobile:'9999999999',email:'',quantity:3,amount:447,payment_status:'PAID',ticket_status:'VALID',qr_token:'secret-token',created_at:'2026-11-04T00:00:00Z'};
test('ticket PDF is a valid one-page file with embedded fonts and QR for three admissions',async()=>{
  const bytes=await createTicketPdf(ticket);assert.ok(bytes.length>1000);const pdf=await PDFDocument.load(bytes);assert.equal(pdf.getPageCount(),1);assert.equal(pdf.getPage(0).getWidth(),600);
});
test('PDF and email require the private ticket token and a valid payment',async()=>{
  let record=ticket;
  const lib=load('lib/ticketDeliveryAccess.ts',{'crypto':{timingSafeEqual},'@/lib/ticketsStore':{getTicketByTicketId:async()=>record}},{Buffer});
  assert.equal(await lib.ticketForDelivery(ticket.ticket_id,'wrong'),null);
  assert.equal((await lib.ticketForDelivery(ticket.ticket_id,'secret-token')).ticket_id,ticket.ticket_id);
  record={...ticket,payment_status:'PENDING'};assert.equal(await lib.ticketForDelivery(ticket.ticket_id,'secret-token'),null);
});
test('send to email rejects missing access and invalid email without calling the provider',async()=>{
  let sends=0;
  const route=load('app/api/tickets/email/route.ts',{'next/server':{NextResponse:{json:(b,i)=>Response.json(b,i)}},'@/lib/ticketDeliveryAccess':{ticketForDelivery:async()=>null},'@/lib/ticketEmail':{sendTicketPdf:async()=>sends++}});
  const req=body=>new Request('https://www.gkpgotlatent.in/api/tickets/email',{method:'POST',body:JSON.stringify(body)});
  assert.equal((await route.POST(req({email:'not-email'}))).status,400);assert.equal((await route.POST(req({email:'test@example.com'}))).status,403);assert.equal(sends,0);
});
test('ticket delivery stores PDF attachment once and prevents duplicate sends on retry',async()=>{
  let entry=null,sends=0,pdfs=0;
  const db={queryStrict:async(sql,args=[])=>{if(sql.startsWith('INSERT'))entry={payload:JSON.parse(args[3]),status:'PENDING'};if(sql.startsWith('UPDATE'))entry.status='ACCEPTED';return [];},queryOneStrict:async sql=>sql.includes('COUNT')?{n:0}:entry};
  const lib=load('lib/ticketEmail.ts',{'@/lib/db':{db},'@/lib/agentEmail':{emailSendKey:()=> 'stable-key',sendAgentEmail:async p=>{sends++;assert.equal(p.attachments[0].content_type,'application/pdf');assert.equal(Buffer.from(p.attachments[0].content_base64,'base64').toString(),'%PDF-test');}},'@/lib/ticketPdf':{createTicketPdf:async()=>{pdfs++;return Buffer.from('%PDF-test');}}});
  await lib.sendTicketPdf(ticket,'user@example.com');await lib.sendTicketPdf(ticket,'user@example.com');assert.equal(sends,1);assert.equal(pdfs,1);
});
test('admin application and payment notifications use separate stable events and include a protected details link',async()=>{
  const entries=new Map(),sent=[];let last;
  const db={queryOneStrict:async(sql,args)=>sql.includes('performer_applications')?{app_id:'APP-1',full_name:'Rahul',payment_status:'PAID'}:entries.get(args[0]),queryStrict:async(sql,args=[])=>{if(sql.startsWith('INSERT')&&!entries.has(args[0]))entries.set(args[0],{payload:JSON.parse(args[1]),status:'PENDING'});if(sql.startsWith('UPDATE'))entries.get(args[0]).status='ACCEPTED';return [];} };
  const lib=load('lib/performerAdminNotification.ts',{'@/lib/db':{db},'@/lib/agentEmail':{sendAgentEmail:async(p,key)=>sent.push({p,key})}});
  await lib.notifyPerformerAdmin('APP-1','APPLIED');await lib.notifyPerformerAdmin('APP-1','PAID');await lib.notifyPerformerAdmin('APP-1','PAID');
  assert.equal(sent.length,2);assert.notEqual(sent[0].key,sent[1].key);assert.equal(sent[0].p.to,'alooksingh1@gmail.com');assert.match(sent[0].p.body_text,/malik\/performer\/APP-1/);
});
