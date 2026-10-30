import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { load } from './helpers/load.mjs';

async function fixture() {
  const pg = new PGlite();
  await pg.exec(`CREATE TABLE performer_applications(app_id TEXT PRIMARY KEY,payment_status TEXT,payment_amount NUMERIC,payment_id TEXT,order_id TEXT,payment_verified_at TIMESTAMPTZ,application_status TEXT,status TEXT,updated_at TIMESTAMPTZ);
    CREATE TABLE performer_payment_links(token TEXT PRIMARY KEY,app_id TEXT,amount NUMERIC,status TEXT,razorpay_order_id TEXT,razorpay_payment_id TEXT,paid_at TIMESTAMPTZ,created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP);
    INSERT INTO performer_applications(app_id,payment_status) VALUES('APP-1','FREE');
    INSERT INTO performer_payment_links(token,app_id,amount,status,razorpay_order_id) VALUES('token-1','APP-1',799,'PENDING','order_one');`);
  const queryStrict=async(sql,params=[])=>{let n=0;return(await pg.query(sql.replace(/\?/g,()=>'$'+(++n)),params)).rows;};
  const db={queryStrict,queryOneStrict:async(...args)=>(await queryStrict(...args))[0]};
  const verification=load('lib/performerPaymentVerification.ts',{'@/lib/db':{db}});
  const recovery=load('lib/performerPaymentRecovery.ts',{'@/lib/db':{db},'@/lib/performerPaymentVerification':verification});
  const captured={id:'pay_test',order_id:'order_one',status:'captured',amount:79900,currency:'INR'};
  return {pg,db,recovery,captured};
}
test('admin recovers a captured payment when both checkout callback and webhook were missed',async()=>{
  const {pg,db,recovery,captured}=await fixture();
  try {
    // Reproduce the legacy production schema that caused captured payments to fail saving.
    await pg.exec('ALTER TABLE performer_applications DROP COLUMN payment_verified_at');
    const gateway={orders:{fetchPayments:async()=>({items:[captured]})}};
    assert.equal((await recovery.recoverPendingPerformerPayments(gateway)).verified,1);
    const app=await db.queryOneStrict('SELECT * FROM performer_applications');
    assert.equal(app.payment_status,'PAID'); assert.equal(app.payment_id,'pay_test');
    assert.equal((await recovery.recoverPendingPerformerPayments(gateway)).checked,0);
  } finally {await pg.close();}
});
test('verification by ID binds captured amount/currency/order, never by supplied phone or screenshot',async()=>{
  const {pg,db,recovery,captured}=await fixture();
  try {
    for(const patch of [{status:'authorized'},{status:'failed'},{amount:100},{currency:'USD'},{order_id:'other'}]) {
      await assert.rejects(recovery.recoverPerformerPaymentId('pay_test',{payments:{fetch:async()=>({...captured,...patch})}}));
      assert.equal((await db.queryOneStrict('SELECT payment_status FROM performer_applications')).payment_status,'FREE');
    }
    const result=await recovery.recoverPerformerPaymentId('pay_test',{payments:{fetch:async()=>captured}});
    assert.equal(result.appId,'APP-1'); assert.equal(result.amount,799);
  } finally {await pg.close();}
});
test('one gateway failure does not prevent another captured link from being recovered',async()=>{
  const {pg,db,recovery,captured}=await fixture();
  try {
    await pg.exec(`INSERT INTO performer_applications(app_id,payment_status) VALUES('APP-2','FREE'); INSERT INTO performer_payment_links(token,app_id,amount,status,razorpay_order_id) VALUES('token-2','APP-2',799,'PENDING','order_bad');`);
    const result=await recovery.recoverPendingPerformerPayments({orders:{fetchPayments:async(id)=>{if(id==='order_bad')throw new Error('Gateway timeout');return {items:[captured]};}}});
    assert.equal(result.verified,1);assert.equal(result.failed,1);
    assert.equal((await db.queryOneStrict("SELECT payment_status FROM performer_applications WHERE app_id='APP-2'")).payment_status,'FREE');
  } finally {await pg.close();}
});
test('reconciliation endpoint rejects an unauthenticated request before gateway access',async()=>{
  const route=load('app/api/malik/performer-payment/reconcile/route.ts',{'next/server':{NextResponse:{json:(body,init)=>Response.json(body,init)}},'@/lib/auth':{getSession:async()=>null},'@/lib/razorpay':{getRazorpayInstance:()=>{throw new Error('Must not access gateway');}},'@/lib/performerPaymentRecovery':{}});
  assert.equal((await route.POST(new Request('https://test.invalid',{method:'POST',body:'{}'}))).status,403);
});
