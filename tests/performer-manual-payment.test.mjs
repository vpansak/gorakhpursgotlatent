import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { load } from './helpers/load.mjs';

async function fixture(role = 'ADMIN') {
  const pg = new PGlite();
  await pg.exec(`CREATE TABLE performer_applications(app_id TEXT PRIMARY KEY,payment_status TEXT,payment_amount NUMERIC,payment_id TEXT,order_id TEXT,manual_payment_reference TEXT,manual_payment_method TEXT,manual_payment_recorded_by TEXT,manual_payment_recorded_at TIMESTAMPTZ,application_status TEXT,status TEXT,updated_at TIMESTAMPTZ);
    CREATE TABLE performer_payment_links(app_id TEXT,status TEXT);
    INSERT INTO performer_applications(app_id,payment_status,status) VALUES ('APP-1','FREE','SHORTLISTED'),('APP-2','PAID','SUBMITTED'),('APP-3','REFUNDED','REFUNDED');`);
  const db = {queryStrict: async(sql,params=[])=>{let n=0;return(await pg.query(sql.replace(/\?/g,()=>'$'+(++n)),params)).rows;}};
  const route = load('app/api/malik/performer-payment/manual/route.ts', {
    'next/server': {NextResponse:{json:(body,init)=>Response.json(body,init)}},
    '@/lib/auth':{getSession:async()=>role ? {id:'admin-1',role} : null},
    '@/lib/db':{db}, '@/lib/performerDetails':{ensurePerformerDetailsTable:async()=>{}},
  });
  const patch = (body)=>route.PATCH(new Request('https://example.test/api/manual',{method:'PATCH',body:JSON.stringify(body)}));
  const post = (body)=>route.POST(new Request('https://example.test/api/manual',{method:'POST',body:JSON.stringify(body)}));
  return {pg, post, patch};
}

test('manual receipt records amount, reference, administrator and time without inventing Razorpay IDs; repeat/paid/refunded updates are rejected',async()=>{
  const {pg,post}=await fixture();
  try {
    assert.equal((await post({appId:'APP-1',amount:799,reference:' UTR123 '})).status,200);
    const {rows:[row]}=await pg.query("SELECT * FROM performer_applications WHERE app_id='APP-1'");
    assert.equal(row.payment_status,'PAID');assert.equal(Number(row.payment_amount),799);
    assert.equal(row.manual_payment_reference,'UTR123');assert.equal(row.manual_payment_recorded_by,'admin-1');assert.ok(row.manual_payment_recorded_at);
    assert.equal(row.payment_id,null);assert.equal(row.order_id,null);assert.equal(row.status,'SHORTLISTED');
    for(const appId of ['APP-1','APP-2','APP-3','missing']) assert.equal((await post({appId,amount:799,reference:'other'})).status,409);
  } finally {await pg.close();}
});
test('manual receipt requires authorized admin and validated amount/reference',async()=>{
  for(const role of [null,'USER','TICKET_STAFF']) {
    const {pg,post}=await fixture(role);
    try {assert.equal((await post({appId:'APP-1',amount:799,reference:'UTR'})).status,403);} finally {await pg.close();}
  }
  const {pg,post}=await fixture();
  try {
    for(const patch of [{amount:0},{amount:-1},{amount:'799'},{amount:799.001},{reference:''},{reference:'x'.repeat(201)}]) assert.equal((await post({appId:'APP-1',amount:799,reference:'UTR',...patch})).status,400);
  } finally {await pg.close();}
});
test('paid badge accepts recorded manual receipts but rejects self-reported payment',()=>{
  const {hasVerifiedPerformerPayment}=load('lib/performerDetailsFields.ts',{});
  const item={payment_status:'PAID',payment_amount:799,manual_payment_reference:'UTR',manual_payment_recorded_by:'admin',manual_payment_recorded_at:'2026-11-09'};
  assert.equal(hasVerifiedPerformerPayment(item),true);
  assert.equal(hasVerifiedPerformerPayment({...item,manual_payment_recorded_by:null}),false);
  assert.equal(hasVerifiedPerformerPayment({...item,status:'REFUNDED'}),false);
  assert.equal(hasVerifiedPerformerPayment({payment_status:'PAID',reportedPaymentStatus:'Paid via QR'}),false);
});

test('manual edits preserve history, allow corrections and undo, and block gateway payments',async()=>{
  const {pg,post,patch}=await fixture();
  try {
    await post({appId:'APP-1',amount:799,reference:'UTR1',method:'Google Pay'});
    const changes={appId:'APP-1',status:'PAID',amount:800,reference:'UTR2',method:'PhonePe',reason:'Correct receipt'};
    assert.equal((await patch({...changes,reason:''})).status,400);
    assert.equal((await patch(changes)).status,200);
    let {rows:[row]}=await pg.query("SELECT * FROM performer_applications WHERE app_id='APP-1'");
    assert.equal(Number(row.payment_amount),800);assert.equal(row.manual_payment_method,'PhonePe');
    const {rows:[audit]}=await pg.query('SELECT * FROM performer_manual_payment_history');
    assert.equal(audit.previous_payment.manual_payment_reference,'UTR1');assert.equal(audit.new_payment.manual_payment_reference,'UTR2');
    await pg.exec("INSERT INTO performer_payment_links VALUES('APP-1','PAID')");
    assert.equal((await patch(changes)).status,409);
    await pg.exec("DELETE FROM performer_payment_links");
    await pg.exec("UPDATE performer_applications SET payment_id='pay_online' WHERE app_id='APP-1'");
    assert.equal((await patch({...changes,status:'UNPAID'})).status,409);
    await pg.exec("UPDATE performer_applications SET payment_id=NULL WHERE app_id='APP-1'");
    assert.equal((await patch({...changes,status:'UNPAID'})).status,200);
    ({rows:[row]}=await pg.query("SELECT * FROM performer_applications WHERE app_id='APP-1'"));
    assert.equal(row.payment_status,'UNPAID');assert.equal(Number(row.payment_amount),0);assert.equal(row.manual_payment_reference,null);
    assert.equal(row.status,'SHORTLISTED');
    assert.equal((await pg.query('SELECT * FROM performer_manual_payment_history')).rows.length,2);
    assert.equal((await patch({...changes,status:'UNPAID'})).status,409);
    assert.equal((await patch({...changes,appId:'APP-2'})).status,409);
  } finally {await pg.close();}
});
test('manual edit is forbidden to unauthenticated and non-admin users',async()=>{
  const {pg,patch}=await fixture('USER');
  try {assert.equal((await patch({appId:'APP-1',status:'UNPAID',reason:'Mistake'})).status,403);} finally {await pg.close();}
});
