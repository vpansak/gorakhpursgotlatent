import { after } from 'next/server';
import { channelConfig, parseIncoming, secureEqual, verifySignature } from './core';
import type { Channel } from './core';
import { ingest, processInbox } from './store';
const headers = { 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff' };
export function verifyWebhook(req:Request, channel:Channel) {
  const c=channelConfig(channel), url=new URL(req.url);
  if (!c.verifyToken) return Response.json({error:'Meta channel is not configured'},{status:503,headers});
  if (url.searchParams.get('hub.mode')!=='subscribe' || !secureEqual(url.searchParams.get('hub.verify_token')||'',c.verifyToken)) {
    return Response.json({error:'Verification rejected'},{status:403,headers});
  }
  return new Response(url.searchParams.get('hub.challenge')||'',{headers:{...headers,'Content-Type':'text/plain'}});
}
export async function receiveWebhook(req:Request, channel:Channel) {
  const c=channelConfig(channel);
  if (!c.secret || !c.account) return Response.json({error:'Meta channel is not configured'},{status:503,headers});
  // Keep body bounded even when the sender omits Content-Length.
  const reader=req.body?.getReader();let bytes=0;const chunks:Uint8Array[]=[];
  if (!reader) return Response.json({error:'Missing payload'},{status:400,headers});
  for (;;) {
    const {done,value}=await reader.read();if(done)break;
    bytes+=value.length;if(bytes>1024*1024){await reader.cancel();return Response.json({error:'Payload too large'},{status:413,headers});}
    chunks.push(value);
  }
  const raw=Buffer.concat(chunks).toString('utf8');
  if (!verifySignature(raw,req.headers.get('x-hub-signature-256')||'',c.secret)) return Response.json({error:'Invalid signature'},{status:401,headers});
  let payload;try{payload=JSON.parse(raw);}catch{return Response.json({error:'Invalid JSON'},{status:400,headers});}
  const events=parseIncoming(channel,payload,c.account);
  if(events.length>100)return Response.json({error:'Too many events'},{status:413,headers});
  try {
    // Persist before 200. A DB failure returns 503 so Meta can redeliver the webhook.
    if(events.length) {
      await ingest(events);
      after(async()=>{try{await processInbox();}catch{console.error('Meta inbox worker needs attention');}});
    }
    return Response.json({received:true},{headers});
  } catch {
    return Response.json({error:'Inbox temporarily unavailable'},{status:503,headers});
  }
}
