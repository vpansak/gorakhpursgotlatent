import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { load } from './helpers/load.mjs';
const env={META_GRAPH_VERSION:'v26.0',META_WA_ACCOUNT_ID:'12345',META_WA_ACCESS_TOKEN:'fake',META_WA_APP_SECRET:'test-only',META_WA_VERIFY_TOKEN:'verify',META_WA_AUTO_REPLY:'true',META_WA_PILOT_SENDERS:'919999000001',META_MESSAGING_ACTIVATED:'true'};
const core=load('lib/meta/core.ts',{'node:crypto':crypto},{AbortSignal,fetch:()=>{throw Error('Unexpected real network');}});
const now=Date.now();
const incoming={channel:'whatsapp',account:'12345',sender:'919999000001',id:'wamid.test',at:now-1000,text:'How to apply?',kind:'text',echo:false};
function wa(messages,account='12345'){return{object:'whatsapp_business_account',entry:[{changes:[{field:'messages',value:{metadata:{phone_number_id:account},messages}}]}]};}
function sig(body){return'sha256='+crypto.createHmac('sha256','test-only').update(body).digest('hex');}
test('raw-body signature rejects missing, tampered and wrong-app payloads',()=>{
 const raw='{"object":"whatsapp_business_account"}';assert.equal(core.verifySignature(raw,sig(raw),'test-only'),true);
 for(const s of ['',sig(raw).toUpperCase(),'sha256=bad'])assert.equal(core.verifySignature(raw,s,'test-only'),false);
 assert.equal(core.verifySignature(raw+' ',sig(raw),'test-only'),false);assert.equal(core.verifySignature(raw,sig(raw),'another'),false);
});
test('WhatsApp parser pins recipient account, ignores status notices and malformed identities',()=>{
 const m={from:incoming.sender,id:incoming.id,timestamp:String(Math.floor(now/1000)),type:'text',text:{body:'apply'}};
 assert.equal(core.parseIncoming('whatsapp',wa([m]),'12345',now).length,1);
 assert.equal(core.parseIncoming('whatsapp',wa([m],'99999'),'12345',now).length,0);
 assert.equal(core.parseIncoming('whatsapp',wa([{...m,from:'bad/recipient'}]),'12345',now).length,0);
 assert.equal(core.parseIncoming('whatsapp',{object:'instagram',entry:[]},'12345').length,0);
 assert.equal(core.parseIncoming('whatsapp',wa([{...m,timestamp:String((now+120000)/1000)}]),'12345',now).length,0);
});
test('Instagram parser separates customer message, human echo, attachment and wrong account',()=>{
 const event={sender:{id:'778899'},recipient:{id:'12345'},timestamp:now,message:{mid:'ig.1',text:'hi'}};
 const p={object:'instagram',entry:[{id:'12345',messaging:[event]}]};
 assert.equal(core.parseIncoming('instagram',p,'12345',now)[0].sender,'778899');
 assert.equal(core.parseIncoming('instagram',p,'99999',now).length,0);
 p.entry[0].messaging=[{...event,sender:{id:'12345'},recipient:{id:'778899'},message:{mid:'echo',text:'hello',is_echo:true}}];
 assert.equal(core.parseIncoming('instagram',p,'12345',now)[0].echo,true);
 p.entry[0].messaging=[{...event,message:{mid:'media',attachments:[{type:'image'}]}}];
 assert.equal(core.replyPlan(core.parseIncoming('instagram',p,'12345',now)[0]).action,'handoff');
});
test('sending needs all activation switches, pinned identity, pilot permission and open window',()=>{
 assert.equal(core.canSend(incoming,env,now),true);
 for(const override of [{META_MESSAGING_ACTIVATED:'false'},{META_WA_AUTO_REPLY:'false'},{META_WA_PILOT_SENDERS:''},{META_WA_ACCESS_TOKEN:''},{META_GRAPH_VERSION:'latest'}])assert.equal(core.canSend(incoming,{...env,...override},now),false);
 for(const override of [{account:'00000'},{sender:'other'},{echo:true},{at:now-24*3600000},{at:now+1}])assert.equal(core.canSend({...incoming,...override},env,now),false);
 assert.equal(core.canSend(incoming,{},now),false);
});
test('routine help contains no unsolicited fee/video and never claims a submission or selection',()=>{
 const plan=core.replyPlan(incoming);assert.equal(plan.action,'reply');assert.ok(plan.text.includes('https://www.gkpgotlatent.in/apply/performer'));
 assert.ok(!/799|₹|payment|वीडियो/i.test(plan.text));
 assert.equal(core.replyPlan(incoming,[{direction:'outbound',text:plan.text}]).action,'handoff');
 for(const text of ['Have I been selected?','I paid 799','refund please','application status','I submitted the form','please call me','stop','नहीं submit हो रहा'])assert.equal(core.replyPlan({...incoming,text}).action,'handoff',text);
 assert.equal(core.replyPlan({...incoming,text:'thanks'}).action,'ignore');
});
test('provider send uses fixed API hosts and verified recipient; errors do not expose provider secrets',async()=>{
 const requests=[];const send=async(url,options)=>{requests.push({url,options});return Response.json({messages:[{id:'sent1'}]});};
 assert.equal(await core.deliver(incoming,'reply',env,send),'sent1');assert.equal(requests[0].url,'https://graph.facebook.com/v26.0/12345/messages');
 assert.equal(JSON.parse(requests[0].options.body).to,incoming.sender);
 await assert.rejects(()=>core.deliver(incoming,'x',{},send));assert.equal(requests.length,1);
 await assert.rejects(()=>core.deliver(incoming,'x',env,async()=>Response.json({secret:'MUST-NOT-LEAK'},{status:400})),/HTTP 400/);
 const ig={...incoming,channel:'instagram'};const igEnv={...env,META_IG_ACCOUNT_ID:'12345',META_IG_ACCESS_TOKEN:'fake',META_IG_AUTO_REPLY:'true',META_IG_PILOT_SENDERS:incoming.sender};
 await core.deliver(ig,'hi',igEnv,async(url,opts)=>{assert.equal(url,'https://graph.instagram.com/v26.0/12345/messages');assert.equal(JSON.parse(opts.body).recipient.id,incoming.sender);return Response.json({message_id:'ig.sent'});});
});
async function database(mockCore=core){
 const db=new PGlite();await db.exec(fs.readFileSync(new URL('../migrations/20261109_meta_inbox.sql',import.meta.url),'utf8'));
 const store=load('lib/meta/store.ts',{'@neondatabase/serverless':{neon:()=>({query:async(q,p)=>(await db.query(q,p)).rows})},'node:crypto':crypto,'./core':mockCore},{process:{env:{DATABASE_URL:'test-only'}}});
 return{db,store};
}
test('durable inbox deduplicates and creates drafts without provider calls or cross-user history',async()=>{
 const{db,store}=await database();try{
 await store.ingest([incoming,incoming,{...incoming,id:'second',sender:'919999000002'}]);
 assert.equal((await store.listInbox()).length,2);await store.processInbox();
 const rows=(await db.query('SELECT state FROM ggl_meta_messages')).rows;assert.equal(rows.length,2);assert.ok(rows.every(r=>r.state==='draft'));
 }finally{await db.close();}
});
test('ambiguous delivery is held for human reconciliation; webhook replay cannot send again',async()=>{
 let calls=0;const{db,store}=await database({...core,canSend:()=>true,deliver:async()=>{calls++;throw Error('timeout after provider may accept');}});
 try{await store.ingest([incoming]);await store.processInbox();await store.ingest([incoming]);await store.processInbox();assert.equal(calls,1);
 const [row]=(await store.listInbox());assert.equal(row.state,'needs_human');assert.equal(row.paused,true);
 }finally{await db.close();}
});
test('confirmed outbound history prevents repeats; own echo is ignored but human takeover pauses',async()=>{
 let calls=0;const{db,store}=await database({...core,canSend:()=>true,deliver:async()=>{calls++;return'outbound-1';}});
 try{await store.ingest([incoming]);await store.processInbox();assert.equal(calls,1);
 await store.ingest([{...incoming,id:'outbound-1',echo:true}]);assert.equal((await store.listInbox()).some(m=>m.paused),false);
 await store.ingest([{...incoming,id:'next-inbound'}]);await store.processInbox();assert.equal(calls,1);assert.ok((await store.listInbox()).some(m=>m.state==='needs_human'));
 }finally{await db.close();}
});
test('stale processing work can recover; sending intents are never requeued',async()=>{
 const{db,store}=await database();try{await store.ingest([incoming,{...incoming,id:'uncertain',sender:'919999000002'}]);
 await db.query("UPDATE ggl_meta_messages SET state=CASE WHEN provider_id='uncertain' THEN 'sending' ELSE 'processing' END");
 await store.processInbox();const rows=(await db.query('SELECT provider_id,state FROM ggl_meta_messages')).rows;
 assert.equal(rows.find(x=>x.provider_id==='uncertain').state,'sending');assert.equal(rows.find(x=>x.provider_id===incoming.id).state,'draft');
 }finally{await db.close();}
});
test('webhook authentication, account pinning and DB retry acknowledgements',async()=>{
 let writes=0;const webhook=load('lib/meta/webhook.ts',{'next/server':{after:()=>{}},'./core':core,'./store':{ingest:async()=>{writes++;throw Error('database down');},processInbox:async()=>{}}},{process:{env},Buffer});
 const challenge=new Request('https://example.com/api/meta/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=verify&hub.challenge=123');
 // core defaults belong to its own context; pass an env-bound config adapter.
 const bound=load('lib/meta/webhook.ts',{'next/server':{after:()=>{}},'./core':{...core,channelConfig:c=>core.channelConfig(c,env)},'./store':{ingest:async()=>{writes++;throw Error('database down');},processInbox:async()=>{}}},{Buffer});
 assert.equal(await bound.verifyWebhook(challenge,'whatsapp').text(),'123');
 const raw=JSON.stringify(wa([{from:incoming.sender,id:'hook',timestamp:String(Math.floor(now/1000)),type:'text',text:{body:'hi'}}]));
 const req=s=>new Request('https://example.com/hook',{method:'POST',headers:{'x-hub-signature-256':s},body:raw});
 assert.equal((await bound.receiveWebhook(req('bad'),'whatsapp')).status,401);assert.equal(writes,0);
 assert.equal((await bound.receiveWebhook(req(sig(raw)),'whatsapp')).status,503);assert.equal(writes,1);
 assert.equal(webhook.verifyWebhook(challenge,'whatsapp').status,503);
});
test('inbox administration and worker reject anonymous requests before database or provider access',async()=>{
 const route=load('app/api/malik/inbox/route.ts',{'@/lib/auth':{getSession:async()=>null},'@/lib/meta/core':core,'@/lib/meta/store':{inboxUsage:()=>{throw Error('unexpected DB');},listInbox:()=>{throw Error('unexpected DB');},pauseConversation:()=>{throw Error('unexpected mutation');}}});
 assert.equal((await route.GET()).status,403);assert.equal((await route.POST(new Request('https://example.com',{method:'POST'}))).status,403);
 const worker=load('app/api/meta/process/route.ts',{'@/lib/meta/core':core,'@/lib/meta/store':{processInbox:()=>{throw Error('unexpected worker');}}});
 assert.equal((await worker.POST(new Request('https://example.com',{method:'POST'}))).status,401);
});
test('daily send budget is reserved atomically and blocks provider calls after the cap',async()=>{
 let calls=0;const{db,store}=await database({...core,canSend:()=>true,dailyReplyLimit:()=>1,deliver:async()=>{calls++;return`sent-${calls}`;}});
 try{await store.ingest([incoming,{...incoming,id:'other-person',sender:'919999000002'}]);await store.processInbox();
 assert.equal(calls,1);assert.equal((await store.inboxUsage())[0].attempts,1);
 assert.ok((await store.listInbox()).some(x=>x.reason?.includes('cap reached')));
 }finally{await db.close();}
});
