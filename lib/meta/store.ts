import { neon } from '@neondatabase/serverless';
import { randomUUID } from 'node:crypto';
import { canSend, dailyReplyLimit, deliver, replyPlan } from './core';
import type { Incoming } from './core';

// Stateless HTTP client; fail closed. Never use the app's permissive empty-result fallback.
function sql() {
  if (!process.env.DATABASE_URL) throw new Error('Inbox database not configured');
  return neon(process.env.DATABASE_URL);
}
export async function ingest(messages: Incoming[]) {
  const db = sql();
  for (const m of messages) {
    if (m.echo) {
      const known = await db.query(`SELECT id FROM ggl_meta_messages WHERE channel=$1 AND account=$2
        AND (provider_id=$3 OR outbound_id=$3) AND (direction='outbound' OR state='sent') LIMIT 1`,[m.channel,m.account,m.id]);
      if (known.length) continue; // Our own confirmed API delivery is not a human takeover.
    }
    await db.query(`WITH c AS (
      INSERT INTO ggl_meta_conversations(channel,account,sender,paused,pause_reason)
      VALUES($1,$2,$3,$4,$5) ON CONFLICT(channel,account,sender) DO UPDATE
      SET paused=ggl_meta_conversations.paused OR EXCLUDED.paused,
          pause_reason=CASE WHEN EXCLUDED.paused THEN EXCLUDED.pause_reason ELSE ggl_meta_conversations.pause_reason END
      RETURNING channel,account,sender
    ) INSERT INTO ggl_meta_messages(channel,account,sender,provider_id,message_at,text,kind,direction,state)
      SELECT channel,account,sender,$6,to_timestamp($7::double precision/1000),$8,$9,$10,$11 FROM c
      ON CONFLICT(channel,account,provider_id) DO NOTHING`,
      [m.channel,m.account,m.sender,m.echo,m.echo?'Human/platform echo; automation paused':null,m.id,m.at,m.text,m.kind,m.echo?'echo':'inbound',m.echo?'observed':'pending']);
  }
}
export async function listInbox() {
  return sql().query(`SELECT m.*, c.paused, c.pause_reason FROM ggl_meta_messages m
    JOIN ggl_meta_conversations c USING(channel,account,sender)
    ORDER BY m.id DESC LIMIT 100`);
}
export async function inboxUsage() {
  return sql().query(`SELECT day,channel,account,attempts FROM ggl_meta_daily_usage
    WHERE day>=CURRENT_DATE-7 ORDER BY day DESC,channel`);
}
export async function pauseConversation(channel:string, account:string, sender:string) {
  await sql().query(`UPDATE ggl_meta_conversations SET paused=TRUE,pause_reason='Paused by administrator'
    WHERE channel=$1 AND account=$2 AND sender=$3`,[channel,account,sender]);
}
export async function processInbox() {
  const db = sql();
  // Recover only work that had not reached a send attempt. Never requeue 'sending'.
  await db.query(`UPDATE ggl_meta_messages m SET state='pending'
    WHERE m.state='processing' AND NOT EXISTS (SELECT 1 FROM ggl_meta_conversations c
      WHERE c.channel=m.channel AND c.account=m.account AND c.sender=m.sender AND c.lease_until>NOW())`);
  // Atomically reserve the event and its conversation. Concurrent workers cannot reply twice.
  let processed = 0;
  for (let i=0; i<5; i++) {
    const lease = randomUUID();
    const [row] = await db.query(`WITH candidate AS (
      SELECT c.channel,c.account,c.sender FROM ggl_meta_conversations c
      WHERE NOT c.paused AND (c.lease_until IS NULL OR c.lease_until<NOW())
        AND EXISTS (SELECT 1 FROM ggl_meta_messages m WHERE m.channel=c.channel AND m.account=c.account
          AND m.sender=c.sender AND m.state='pending' AND m.direction='inbound')
      ORDER BY c.channel,c.account,c.sender FOR UPDATE SKIP LOCKED LIMIT 1
    ), locked AS (
      UPDATE ggl_meta_conversations c SET lease_token=$1,lease_until=NOW()+INTERVAL '90 seconds'
      FROM candidate k WHERE c.channel=k.channel AND c.account=k.account AND c.sender=k.sender RETURNING c.*
    ), next AS (
      SELECT m.id FROM ggl_meta_messages m JOIN locked c USING(channel,account,sender)
      WHERE m.state='pending' AND m.direction='inbound' ORDER BY m.id FOR UPDATE SKIP LOCKED LIMIT 1
    ) UPDATE ggl_meta_messages SET state='processing' WHERE id IN (SELECT id FROM next) RETURNING *`,[lease]);
    if (!row) break;
    try {
      const m: Incoming = {channel:row.channel,account:row.account,sender:row.sender,id:row.provider_id,
        at:new Date(row.message_at).getTime(),text:row.text,kind:row.kind,echo:false};
      const history = await db.query(`SELECT direction,text FROM ggl_meta_messages
        WHERE channel=$1 AND account=$2 AND sender=$3 AND id<>$4 ORDER BY id DESC LIMIT 20`,[m.channel,m.account,m.sender,row.id]);
      const plan = replyPlan(m,history.map(h => ({direction:String(h.direction),text:String(h.text)})));
      if (plan.action === 'ignore') {
        await db.query("UPDATE ggl_meta_messages SET state='ignored',reason=$2 WHERE id=$1",[row.id,plan.reason]);
      } else if (plan.action === 'handoff') {
        await db.query("UPDATE ggl_meta_messages SET state='needs_human',reason=$2 WHERE id=$1",[row.id,plan.reason]);
        await db.query(`UPDATE ggl_meta_conversations SET paused=TRUE,pause_reason=$4
          WHERE channel=$1 AND account=$2 AND sender=$3`,[m.channel,m.account,m.sender,plan.reason]);
      } else if (!canSend(m)) {
        await db.query("UPDATE ggl_meta_messages SET state='draft',draft=$2,reason='Sending disabled or reply window/allow-list not eligible' WHERE id=$1",[row.id,plan.text]);
      } else {
        // Persist intent BEFORE network call. Never automatically retry 'sending' or uncertain outcomes.
        const claimed = await db.query(`UPDATE ggl_meta_messages SET state='sending',draft=$2 WHERE id=$1
          AND EXISTS(SELECT 1 FROM ggl_meta_conversations c WHERE c.channel=$3 AND c.account=$4 AND c.sender=$5
          AND c.lease_token=$6 AND c.lease_until>NOW() AND NOT c.paused) RETURNING id`,[row.id,plan.text,m.channel,m.account,m.sender,lease]);
        if (!claimed.length) {
          await db.query("UPDATE ggl_meta_messages SET state='needs_human',reason='Conversation paused or lease lost' WHERE id=$1",[row.id]);
          continue;
        }
        try {
          const recent = await db.query(`SELECT COUNT(*)::integer AS n FROM ggl_meta_messages
            WHERE channel=$1 AND account=$2 AND sender=$3 AND direction='outbound' AND created_at>NOW()-INTERVAL '24 hours'`,[m.channel,m.account,m.sender]);
          const budget = Number(recent[0]?.n||0)>=5 ? [] : await db.query(`INSERT INTO ggl_meta_daily_usage(day,channel,account,attempts)
            VALUES(CURRENT_DATE,$1,$2,1) ON CONFLICT(day,channel,account)
            DO UPDATE SET attempts=ggl_meta_daily_usage.attempts+1 WHERE ggl_meta_daily_usage.attempts<$3 RETURNING attempts`,[m.channel,m.account,dailyReplyLimit()]);
          if (!budget.length) {
            await db.query("UPDATE ggl_meta_messages SET state='needs_human',reason='Daily or conversation reply cap reached. No provider call made.' WHERE id=$1",[row.id]);
            continue;
          }
          const providerId = await deliver(m,plan.text);
          await db.query(`WITH sent AS (UPDATE ggl_meta_messages SET state='sent',outbound_id=$2 WHERE id=$1 RETURNING *)
            INSERT INTO ggl_meta_messages(channel,account,sender,provider_id,message_at,text,kind,direction,state)
            SELECT channel,account,sender,$2,NOW(),draft,'text','outbound','sent' FROM sent
            ON CONFLICT(channel,account,provider_id) DO NOTHING`,[row.id,providerId]);
        } catch {
          await db.query("UPDATE ggl_meta_messages SET state='needs_human',reason='Send outcome uncertain. Reconcile in Meta inbox before any manual retry.' WHERE id=$1",[row.id]);
          await db.query(`UPDATE ggl_meta_conversations SET paused=TRUE,pause_reason='Send requires reconciliation'
            WHERE channel=$1 AND account=$2 AND sender=$3`,[m.channel,m.account,m.sender]);
        }
      }
      processed++;
    } finally {
      await db.query(`UPDATE ggl_meta_conversations SET lease_token=NULL,lease_until=NULL
        WHERE channel=$1 AND account=$2 AND sender=$3 AND lease_token=$4`,[row.channel,row.account,row.sender,lease]);
    }
  }
  return processed;
}
