import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { load } from './helpers/load.mjs';
const json = { NextResponse: { json: (body, init) => Response.json(body, init) } };
const unreachable = new Proxy({}, {get:()=>()=>{throw new Error('Unauthorized request reached data/gateway');}});

test('ticket and show mutation APIs reject anonymous requests before data access', async () => {
 for (const [file, methods, dependencies] of [
  ['app/api/tickets/delete/route.ts',['DELETE'],{'@/lib/ticketsStore':unreachable,'@/lib/auth':{getSession:async()=>null}}],
  ['app/api/tickets/search/route.ts',['GET'],{'@/lib/ticketsStore':unreachable,'@/lib/auth':{getSession:async()=>null}}],
  ['app/api/computerji/scores/route.ts',['GET','POST','DELETE'],{'@/lib/operatorAccess':{hasOperatorAccess:async()=>false},'@/lib/computerji-db':unreachable,'@/lib/episodeVisibility':{}}],
  ['app/api/live/operator/route.ts',['POST'],{'@/lib/operatorAccess':{hasOperatorAccess:async()=>false},'@/lib/db':unreachable,'@/lib/liveShow':unreachable,'crypto':crypto}],
  ['app/api/live/audio/upload/route.ts',['POST'],{'@/lib/operatorAccess':{hasOperatorAccess:async()=>false},'fs':unreachable,'path':{}}],
 ]) {
  const route = load(file, {'next/server':json,...dependencies});
  for (const method of methods) assert.equal((await route[method](new Request('https://example.test',{method}))).status,403,file);
 }
});

test('refund failure never updates paid status or invents a refund reference', async () => {
 let writes=0; let succeed=false;
 const route=load('app/api/malik/applications/refund/route.ts',{'next/server':json,'@/lib/auth':{getSession:async()=>({id:'admin',full_name:'Admin',role:'ADMIN'})},'@/lib/db':{db:{queryOne:async()=>({app_id:'A',full_name:'Artist',payment_id:'pay_real',payment_amount:599,payment_status:'PAID'}),execute:async()=>{writes++}}},'@/lib/razorpay':{processRazorpayRefund:async()=>succeed?{success:true,refundId:'rfnd_real'}:{success:false,error:'Gateway declined'}}});
 const req=()=>new Request('https://test.invalid',{method:'POST',body:JSON.stringify({appId:'A'})});
 let response=await route.POST(req());assert.equal(response.status,502);assert.equal(writes,0);assert.equal((await response.json()).success,undefined);
 succeed=true;response=await route.POST(req());assert.equal(response.status,200);assert.equal(writes,2);assert.equal((await response.json()).refundId,'rfnd_real');
});

test('scoped sessions reject tampering and reuse across judge/operator purposes', () => {
 const sessions=load('lib/scopedSession.ts',{'node:crypto':crypto,'next/headers':{}},{process:{env:{JWT_SECRET:'test-secret-for-scoped-sessions'}}});
 const token=sessions.scopedSessionToken('judge','judge-1');
 assert.equal(sessions.readScopedToken(token,'judge'),'judge-1');
 assert.equal(sessions.readScopedToken(token,'computerji'),null);
 assert.equal(sessions.readScopedToken(token+'0','judge'),null);
 assert.equal(sessions.readScopedToken(token+'.extra','judge'),null);
});

test('judge scoring rejects a supplied judge ID without a matching signed session', async()=>{
 const route=load('app/api/live/judge/route.ts',{'next/server':json,'@/lib/scopedSession':{scopedSession:async()=>null},'@/lib/db':{...unreachable,execute:()=>{throw Error('Must not write')},query:async()=>[],queryOne:async()=>{throw Error('Must not query')}},'@/lib/liveShow':{ensureLiveShowTables:async()=>{}}});
 const r=await route.POST(new Request('https://test.invalid',{method:'POST',body:JSON.stringify({action:'SUBMIT_SCORE',judgeId:'someone',performerId:'act',score:10})}));
 assert.equal(r.status,403);
});

test('OTP requires the exact unexpired unused code, limits attempts, and blocks replay', async()=>{
 const pg=new PGlite();
 try {
  await pg.exec(`CREATE TABLE admin_otps(id TEXT PRIMARY KEY,email TEXT,otp_hash TEXT,attempts INT DEFAULT 0,max_attempts INT DEFAULT 5,expires_at TIMESTAMPTZ,is_used INT DEFAULT 0,created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP);CREATE TABLE users(id TEXT,email TEXT,password_hash TEXT,full_name TEXT,role TEXT,created_at TIMESTAMPTZ,updated_at TIMESTAMPTZ);`);
  const query=async(sql,params=[])=>{let n=0;return(await pg.query(sql.replace(/\?/g,()=>'$'+(++n)),params)).rows};
  const db={queryStrict:query,queryOne:async(...args)=>(await query(...args))[0]||null,execute:query};
  const env={JWT_SECRET:'test-otp-secret'};
  const otp=load('lib/otp.ts',{'crypto':crypto,'./db':{db},'./emailjs':{},'./auth':{}},{process:{env}});
  const email='gkpgotlatent@gmail.com';const hash=crypto.createHmac('sha256',env.JWT_SECRET).update(`${email}:654321`).digest('hex');
  await pg.query("INSERT INTO admin_otps(id,email,otp_hash,expires_at) VALUES('otp', $1,$2,CURRENT_TIMESTAMP+INTERVAL '5 minutes')",[email,hash]);
  assert.equal((await otp.verifyAdminOtp('outsider@example.test','112200')).success,false);
  assert.equal((await otp.verifyAdminOtp(email,'000000')).success,false);
  assert.equal((await otp.verifyAdminOtp(email,'654321')).success,true);
  assert.equal((await otp.verifyAdminOtp(email,'654321')).success,false);
  await pg.exec("UPDATE admin_otps SET is_used=0,attempts=5");assert.equal((await otp.verifyAdminOtp(email,'654321')).success,false);
  await pg.exec("UPDATE admin_otps SET attempts=0,expires_at=CURRENT_TIMESTAMP-INTERVAL '1 minute'");assert.equal((await otp.verifyAdminOtp(email,'654321')).success,false);
 } finally {await pg.close();}
});

test('Indian phone normalization keeps valid country codes and rejects extra digits',()=>{
 const {indianMobile,whatsappNumber}=load('lib/phone.ts',{});
 assert.equal(whatsappNumber('98765 43210'),'919876543210');assert.equal(whatsappNumber('+91 98765 43210'),'919876543210');
 assert.equal(indianMobile('9876543210'),'9876543210');assert.equal(indianMobile('+91 9876543210'),'9876543210');
 for(const n of ['123','85856162828','1234567890'])assert.equal(indianMobile(n),null);
});

test('untouched guest defaults do not create phantom leads',()=>{
 const {hasUserEnteredData}=load('lib/leadCapture.ts',{'react':{}});
 const baseline={fullName:'',profession:'Content Creator / Influencer',category:'Celebrity Judge & Guest Panel',age:'18 Years'};
 assert.equal(hasUserEnteredData({...baseline},baseline),false);
 assert.equal(hasUserEnteredData({...baseline,fullName:'Artist'},baseline),true);
 assert.equal(hasUserEnteredData({...baseline,profession:'Actor'},baseline),true);
});
