import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './helpers/load.mjs';
test('guest application saves as submitted without a payment link or gateway call',async()=>{
  const writes=[];
  const route=load('app/api/apply/guest/route.ts',{'next/server':{NextResponse:{json:(b,i)=>Response.json(b,i)}},'@/lib/db':{db:{queryStrict:async(sql,p)=>{writes.push(sql);return[];},execute:async sql=>writes.push(sql)}},'@/lib/helpers':{generateAppId:()=> 'GST-TEST'}});
  const r=await route.POST(new Request('https://test.invalid',{method:'POST',body:JSON.stringify({fullName:'Test guest',email:'test@example.com',whatsapp:'9999999999',city:'Gorakhpur'})}));
  const j=await r.json();assert.equal(r.status,200);assert.equal(j.status,'SUBMITTED');assert.equal(j.paymentUrl,undefined);assert.ok(writes.some(sql=>sql.includes("'SUBMITTED'")));assert.ok(writes.every(sql=>!sql.includes('guest_payment_links')&&!sql.includes('PAYMENT_PENDING')));
});
