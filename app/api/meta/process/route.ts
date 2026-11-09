import { secureEqual } from '@/lib/meta/core';
import { processInbox } from '@/lib/meta/store';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=60;
export async function POST(req:Request) {
  const secret=process.env.META_WORKER_SECRET;
  if(!secret || !secureEqual(req.headers.get('authorization')||'',`Bearer ${secret}`))return Response.json({error:'Unauthorized'},{status:401});
  try {return Response.json({processed:await processInbox()},{headers:{'Cache-Control':'no-store'}});}
  catch {return Response.json({error:'Inbox unavailable; inspect configuration and migration'},{status:503});}
}
