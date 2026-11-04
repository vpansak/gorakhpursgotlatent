import { db } from '@/lib/db';
import { sendAgentEmail } from '@/lib/agentEmail';
export async function notifyPerformerAdmin(appId:string,event:'APPLIED'|'PAID') {
  const p=await db.queryOneStrict('SELECT * FROM performer_applications WHERE app_id=?',[appId]);
  if(!p)return;
  const link=`https://www.gkpgotlatent.in/malik/performer/${encodeURIComponent(appId)}`;
  const heading=event==='PAID'?'Performer payment verified':'New performer application';
  // Snapshot payload persists across retries so one event cannot send duplicate mail.
  await db.queryStrict(`CREATE TABLE IF NOT EXISTS performer_admin_notifications (event_key TEXT PRIMARY KEY,payload JSONB NOT NULL,status TEXT NOT NULL DEFAULT 'PENDING',created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)`);
  const key=`ggl-performer-${event.toLowerCase()}-${appId}`;
  const body=[heading,...Object.entries(p).map(([k,v])=>`${k}: ${typeof v==='object'?JSON.stringify(v):String(v??'')}`),'',`View all details (admin login required): ${link}`].join('\n');
  const payload={to:'alooksingh1@gmail.com',subject:`GGL | ${heading} | ${p.full_name} | ${appId}`,body_text:body};
  await db.queryStrict('INSERT INTO performer_admin_notifications(event_key,payload) VALUES (?,?::jsonb) ON CONFLICT(event_key) DO NOTHING',[key,JSON.stringify(payload)]);
  const entry=await db.queryOneStrict('SELECT * FROM performer_admin_notifications WHERE event_key=?',[key]);
  if(entry.status==='ACCEPTED')return;
  await sendAgentEmail(typeof entry.payload==='string'?JSON.parse(entry.payload):entry.payload,key);
  await db.queryStrict("UPDATE performer_admin_notifications SET status='ACCEPTED' WHERE event_key=?",[key]);
}
