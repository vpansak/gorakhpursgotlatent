import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { load } from './helpers/load.mjs';

function fixture(sendResult = {success:true}) {
  const queries=[], emails=[];
  const db={queryStrict:async(...args)=>{queries.push(args);return [];}};
  const lib=load('lib/performerInvitation.ts',{'crypto':{randomBytes},'@/lib/db':{db},'@/lib/emailjs':{sendNitrosendEmail:async(...args)=>{emails.push(args);return sendResult;}}});
  return {lib,queries,emails};
}
const person={appId:'APP-RAHUL',name:'Rahul <script>',mobile:'9999999999',age:22,instagram:'@rahul',email:'rahul@example.com',paymentUrl:'https://www.gkpgotlatent.in/performer-payment/token-rahul'};
test('each applicant receives a separate unpredictable official payment link bound to 799',async()=>{
  const {lib,queries}=fixture();
  const a=await lib.createPerformerInvitation('APP-RAHUL'),b=await lib.createPerformerInvitation('APP-ROHIT');
  assert.notEqual(a,b);assert.match(a,/^https:\/\/www.gkpgotlatent.in\/performer-payment\/[a-f0-9]{48}$/);
  const inserts=queries.filter(([sql])=>sql.startsWith('INSERT'));
  assert.equal(inserts[0][1][1],'APP-RAHUL');assert.equal(inserts[1][1][1],'APP-ROHIT');
  assert.equal(inserts[0][1][2],799);
});
test('email contains applicant fields and personal CTA, safely escapes HTML, uses NitroSend stable retry key',async()=>{
  const {lib,queries,emails}=fixture();await lib.emailPerformerInvitation(person);
  const [to,subject,body,html,key]=emails[0];
  assert.equal(to,person.email);assert.match(subject,/799/);
  for(const value of [person.appId,person.mobile,'22','@rahul',person.paymentUrl])assert.ok(body.includes(value));
  assert.ok(html.includes('Rahul &lt;script&gt;'));assert.ok(!html.includes('Rahul <script>'));
  assert.ok(html.includes(`href="${person.paymentUrl}"`));assert.equal(key,'ggl-performer-invitation-APP-RAHUL');
  assert.equal(queries.at(-1)[1][0],'SENT');
});
test('email failure is recorded without changing performer payment status',async()=>{
  const {lib,queries}=fixture({success:false});assert.equal((await lib.emailPerformerInvitation(person)).success,false);
  assert.equal(queries.at(-1)[1][0],'FAILED');assert.ok(queries.every(([sql])=>!sql.includes('payment_status')));
});
test('submission persists application before email and never marks an unpaid applicant paid',async()=>{
  const queries=[],callbacks=[],sent=[];
  const route=load('app/api/apply/performer/route.ts',{
    'next/server':{after:cb=>callbacks.push(cb),NextResponse:{json:(body,init)=>Response.json(body,init)}},
    '@/lib/db':{db:{queryStrict:async(...args)=>{queries.push(args);return [];},execute:async()=>{}}},
    '@/lib/storage':{},'@/lib/helpers':{generateAppId:()=>person.appId},
    '@/lib/performerInvitation':{createPerformerInvitation:async()=>{assert.ok(queries[0][0].includes('INSERT INTO performer_applications'));return person.paymentUrl;},emailPerformerInvitation:async p=>sent.push(p)}
  });
  const req=body=>new Request('https://www.gkpgotlatent.in/api/apply/performer',{method:'POST',body:JSON.stringify(body)});
  assert.equal((await route.POST(req({termsAccepted:true,email:'bad'}))).status,400);
  const res=await route.POST(req({termsAccepted:true,fullName:'Rahul',email:person.email,mobile:person.mobile,age:22,instagram:'rahul'}));
  const json=await res.json();assert.equal(json.success,true);assert.equal(json.paymentUrl,person.paymentUrl);
  assert.equal(sent.length,0);assert.equal(callbacks.length,1);await callbacks[0]();assert.equal(sent[0].email,person.email);
  assert.ok(queries[0][0].includes("'FREE'"));
});
