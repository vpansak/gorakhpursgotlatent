import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { load } from './helpers/load.mjs';
import * as jose from 'jose';
const fields = load('lib/performerDetailsFields.ts', {});
const queries = load('lib/adminApplicationQueries.ts', {});
const json = { NextResponse: { json: (body, init) => Response.json(body, init) } };
const valid = { mobile: '9876543210', fullName: 'Test Performer', category: 'Poetry / Shayari', description: 'A poem', funnyFacts: 'Two fun facts', funnyIncident: 'A funny story', reportedPaymentStatus: 'Paid via QR', duration: '1.5 minutes', interestedInTalentTrip: 'No' };
function strict(pg) { return async (sql, params = []) => { let index=0; const normalized=sql.replace(/\?/g, () => '$'+(++index)); return (await pg.query(normalized, params)).rows; }; }
async function database() {
  const pg = new PGlite();
  await pg.exec(`CREATE TABLE performer_applications (
    app_id TEXT PRIMARY KEY, full_name TEXT, mobile_number TEXT, whatsapp_number TEXT, instagram_url TEXT,
    performance_category TEXT, performance_description TEXT, performance_duration TEXT, interested_in_talent_trip TEXT,
    payment_status TEXT, payment_amount NUMERIC, payment_id TEXT, order_id TEXT, payment_verified_at TIMESTAMPTZ,
    application_status TEXT DEFAULT 'SUBMITTED', status TEXT DEFAULT 'SUBMITTED', is_read INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE performer_payment_links(token TEXT PRIMARY KEY, app_id TEXT, amount NUMERIC, status TEXT DEFAULT 'PENDING', razorpay_order_id TEXT, razorpay_payment_id TEXT, paid_at TIMESTAMPTZ);
    INSERT INTO performer_applications(app_id,full_name,mobile_number,payment_status,payment_amount) VALUES ('TEST-1','Original Name','9876543210','FREE',0);
    INSERT INTO performer_payment_links(token,app_id,amount,razorpay_order_id) VALUES ('test-payment-token','TEST-1',799,'order_test');`);
  await pg.exec(fs.readFileSync(new URL('../migrations/20261027_performer_details.sql', import.meta.url), 'utf8'));
  return pg;
}
test('mobile comes first, required questions are enforced, and payment declaration cannot set verified fields', () => {
  assert.equal(fields.performerDetailFields[0].key, 'mobile');
  assert.throws(() => fields.validatePerformerDetails({ ...valid, funnyFacts: '' }), /required/);
  assert.throws(() => fields.validatePerformerDetails({ ...valid, reportedPaymentStatus: 'VERIFIED' }), /Invalid/);
  const clean=fields.validatePerformerDetails({ ...valid, payment_status: 'PAID', verified_payment_id: 'forged' });
  assert.equal(clean.payment_status, undefined);
  assert.equal(clean.verified_payment_id, undefined);
  assert.ok(!fields.performerDetailFields.some(field => /guardian/i.test(field.key)));
});
test('personal form link rejects invalid tokens before database access', async () => {
  const route=load('app/api/performer-details/[token]/route.ts', {
    'next/server': json, '@/lib/db': { db: { queryStrict: () => { throw new Error('Must not query'); } } },
    '@/lib/performerDetails': { readPerformerDetailsToken: async () => null }, '@/lib/performerDetailsFields': fields,
  });
  assert.equal((await route.GET(new Request('https://test.invalid'), { params: Promise.resolve({ token:'bad' }) })).status,404);
});
test('detail form round-trip saves long answers, permits edits and keeps paid declaration separate', async () => {
  const pg=await database();
  try {
    const queryStrict=strict(pg);
    const details=load('lib/performerDetails.ts', { '@/lib/db': { db: { queryStrict } }, '@/lib/performerDetailsFields': fields, jose });
    const route=load('app/api/performer-details/[token]/route.ts', {
      'next/server':json, '@/lib/db': { db: { queryStrict } }, '@/lib/performerDetails': { ...details, readPerformerDetailsToken:async ()=>'TEST-1' }, '@/lib/performerDetailsFields':fields,
    });
    const context={params:Promise.resolve({token:'fixture-token'})};
    let result=await (await route.GET(new Request('https://test.invalid'),context)).json();
    assert.equal(result.answers.fullName,'Original Name');
    const body={...valid,offLimitTopics:'Private topic\n'.repeat(200),instagram:'@test_user'};
    const save=await route.POST(new Request('https://test.invalid',{method:'POST',body:JSON.stringify(body)}),context);
    assert.equal(save.status,200,await save.text());
    result=await (await route.GET(new Request('https://test.invalid'),context)).json();
    assert.equal(result.answers.offLimitTopics,body.offLimitTopics.trim());
    assert.ok(result.submittedAt);
    let [record]=await queryStrict(queries.performerSelect+queries.performerOrder);
    assert.equal(record.full_name,'Test Performer');
    assert.equal(record.detail_answers.instagram,'@test_user');
    assert.equal(record.payment_status,'FREE');
    assert.equal(fields.hasVerifiedPerformerPayment(record),false);
    body.fullName='Edited Name';
    assert.equal((await route.POST(new Request('https://test.invalid',{method:'POST',body:JSON.stringify(body)}),context)).status,200);
    [record]=await queryStrict(queries.performerSelect+queries.performerOrder);
    assert.equal(record.full_name,'Edited Name');
    assert.equal((await pg.query('SELECT * FROM performer_details')).rows.length,1);
  } finally { await pg.close(); }
});
test('captured matching ₹799 payment creates automatic tick; wrong order, currency, amount or pending payment cannot', async () => {
  const pg=await database();
  try {
    const queryStrict=strict(pg);
    const verification=load('lib/performerPaymentVerification.ts',{ '@/lib/db':{ db:{ queryStrict } } });
    const [link]=await queryStrict('SELECT * FROM performer_payment_links');
    const captured={id:'pay_test',order_id:'order_test',amount:79900,currency:'INR',status:'captured'};
    for(const patch of [{order_id:'wrong'},{amount:2900},{currency:'USD'},{status:'authorized'}]) {
      await assert.rejects(verification.recordVerifiedPerformerPayment(link,{...captured,...patch}),/does not match/);
    }
    assert.equal((await queryStrict('SELECT payment_status FROM performer_applications'))[0].payment_status,'FREE');
    await verification.recordVerifiedPerformerPayment(link,captured);
    await verification.recordVerifiedPerformerPayment(link,captured); // retry is idempotent
    const [record]=await queryStrict(queries.performerSelect+queries.performerOrder);
    assert.equal(fields.hasVerifiedPerformerPayment(record),true);
    assert.equal(record.payment_id,'pay_test');
    assert.equal(Number(record.payment_amount),799);
    assert.equal(fields.hasVerifiedPerformerPayment({...record,payment_status:'REFUNDED'}),false);
  } finally { await pg.close(); }
});
test('personal links are signed, application-bound, expiring and cannot be forged', async () => {
  const secret='test-only-performer-detail-secret';
  const details=load('lib/performerDetails.ts',{'@/lib/db':{db:{}},'@/lib/performerDetailsFields':fields,jose},{process:{env:{JWT_SECRET:secret}}});
  const token=await details.createPerformerDetailsToken('TEST-1');
  assert.equal(await details.readPerformerDetailsToken(token),'TEST-1');
  assert.equal(await details.readPerformerDetailsToken(token.slice(0,-8)+'modified'),null);
  const expired=await new jose.SignJWT({purpose:'performer-details',appId:'TEST-1'}).setProtectedHeader({alg:'HS256'}).setExpirationTime('1 second ago').sign(new TextEncoder().encode(secret));
  assert.equal(await details.readPerformerDetailsToken(expired),null);
});
test('only admin staff can generate the personal link; WhatsApp is a draft with line breaks', async () => {
  const dependencies={
    'next/server':json,'@/lib/auth':{getSession:async()=>null},
    '@/lib/db':{db:{queryStrict:async()=>[{app_id:'TEST-1',full_name:'Fixture Person',mobile_number:'9876543210'}]}},
    '@/lib/performerDetails':{createPerformerDetailsToken:async()=> 'signed-fixture-token'},
  };
  let route=load('app/api/malik/performer-details/route.ts',dependencies);
  assert.equal((await route.POST(new Request('https://example.test',{method:'POST',body:'{}'}))).status,403);
  dependencies['@/lib/auth'].getSession=async()=>({role:'ADMIN'});
  route=load('app/api/malik/performer-details/route.ts',dependencies);
  const result=await(await route.POST(new Request('https://example.test',{method:'POST',body:JSON.stringify({appId:'TEST-1'})}))).json();
  const url=new URL(result.whatsappUrl);
  assert.equal(url.searchParams.get('phone'),'919876543210');
  assert.ok(url.searchParams.get('text').includes('\n\n'));
  assert.ok(url.searchParams.get('text').includes(result.formUrl));
});
test('updated category order, duration choices and question order match the production brief', () => {
  assert.deepEqual(Array.from(fields.PERFORMER_CATEGORIES).slice(0,4),['Comedy','Mimicry','Magic','Unusual Talent']);
  assert.ok(!fields.PERFORMER_CATEGORIES.some(value=>/dance|singing/i.test(value)));
  assert.ok(fields.PERFORMER_CATEGORIES.includes('Music (Unique / Original)'));
  assert.deepEqual(Array.from(fields.PERFORMANCE_DURATIONS),['1.5 minutes','Below 1 minute']);
  const keys=fields.performerDetailFields.map(field=>field.key);
  assert.equal(keys.at(-1),'stageName');
  assert.ok(!keys.includes('introduction'));
  assert.deepEqual(Array.from(keys).slice(keys.indexOf('funnyFacts'),keys.indexOf('technicalRequirements')+1),['funnyFacts','hostTopics','stageExperience','offLimitTopics','technicalRequirements']);
  for(const patch of [{duration:'2'},{duration:'1'},{interestedInTalentTrip:''},{category:'Dance'}]) assert.throws(()=>fields.validatePerformerDetails({...valid,...patch}));
});
test('legacy introduction answers are merged and old duration/trip defaults are not silently selected', () => {
  const details=load('lib/performerDetails.ts',{'@/lib/db':{db:{}},'@/lib/performerDetailsFields':fields,jose});
  const answers=details.prefillPerformerDetails({full_name:'Fixture',performance_category:'Singing',performance_duration:'2 Minutes',interested_in_talent_trip:'No',detail_answers:{stageName:'Stage Persona',introduction:'Welcome this performer'}});
  assert.equal(answers.stageName,'Stage Persona — Welcome this performer');
  assert.equal(answers.category,'Music (Unique / Original)');
  assert.equal(answers.duration,'');
  assert.equal(answers.interestedInTalentTrip,'');
  const edited=details.prefillPerformerDetails({detail_answers:{duration:'Below 1 minute',interestedInTalentTrip:'Yes'}});
  assert.equal(edited.duration,'Below 1 minute');
  assert.equal(edited.interestedInTalentTrip,'Yes');
});
