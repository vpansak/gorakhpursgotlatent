import { getSession } from '@/lib/auth';
import { channelConfig } from '@/lib/meta/core';
import { inboxUsage, listInbox, pauseConversation } from '@/lib/meta/store';
export const runtime='nodejs';
export const dynamic='force-dynamic';
async function authorized(){const s=await getSession();return Boolean(s && ['ADMIN','SUPER_ADMIN'].includes(s.role));}
export async function GET() {
 if(!await authorized())return Response.json({error:'Admin login required'},{status:403});
 const channels=(['whatsapp','instagram'] as const).map(channel=>{
   const c=channelConfig(channel);
   return {channel,accountConfigured:Boolean(c.account),tokenConfigured:Boolean(c.token),secretConfigured:Boolean(c.secret),
     verificationConfigured:Boolean(c.verifyToken),versionConfigured:/^v\d+\.\d+$/.test(c.version),autoReply:c.enabled,pilotSendersConfigured:c.allowed.length>0};
 });
 try{return Response.json({activated:process.env.META_MESSAGING_ACTIVATED==='true',channels,messages:await listInbox(),usage:await inboxUsage()},
   {headers:{'Cache-Control':'private, no-store'}});}
 catch{return Response.json({channels,error:'Inbox database migration/configuration is not ready; no replies were sent'},{status:503,headers:{'Cache-Control':'private, no-store'}});}
}
export async function POST(req:Request) {
 if(!await authorized())return Response.json({error:'Admin login required'},{status:403});
 // Cookie-authenticated mutation requires the same origin (no cross-site pause requests).
 if(req.headers.get('origin')!==new URL(req.url).origin)return Response.json({error:'Origin rejected'},{status:403});
 const b=await req.json().catch(()=>null);
 if(b?.action!=='pause'||!['whatsapp','instagram'].includes(b.channel)||!/^\d{4,40}$/.test(b.account)||!/^\d{4,40}$/.test(b.sender))return Response.json({error:'Invalid conversation'},{status:400});
 try{await pauseConversation(b.channel,b.account,b.sender);return Response.json({paused:true});}
 catch{return Response.json({error:'Inbox unavailable'},{status:503});}
}
