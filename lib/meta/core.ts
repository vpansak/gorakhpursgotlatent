import { createHmac, timingSafeEqual } from 'node:crypto';

export type Channel = 'whatsapp' | 'instagram';
export interface Incoming {
  channel: Channel; account: string; sender: string; id: string;
  at: number; text: string; kind: string; echo: boolean;
}
export function secureEqual(a: string, b: string): boolean {
  if (!a || !b) return false;
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export function verifySignature(body: string, signature: string, secret: string): boolean {
  if (!secret || !/^sha256=[a-f0-9]{64}$/.test(signature)) return false;
  return secureEqual(signature, `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`);
}
export function channelConfig(channel: Channel, env = process.env) {
  const prefix = channel === 'whatsapp' ? 'META_WA' : 'META_IG';
  return {
    account: env[`${prefix}_ACCOUNT_ID`] || '', token: env[`${prefix}_ACCESS_TOKEN`] || '',
    secret: env[`${prefix}_APP_SECRET`] || '', verifyToken: env[`${prefix}_VERIFY_TOKEN`] || '',
    version: env.META_GRAPH_VERSION || '', enabled: env[`${prefix}_AUTO_REPLY`] === 'true',
    // Explicit customer allow-list for a reviewed pilot; '*' requires separate broad activation approval.
    allowed: (env[`${prefix}_PILOT_SENDERS`] || '').split(',').map(s => s.trim()).filter(Boolean),
  };
}
export function parseIncoming(channel: Channel, payload: any, account: string, now = Date.now()): Incoming[] {
  if (!account || payload?.object !== (channel === 'whatsapp' ? 'whatsapp_business_account' : 'instagram')) return [];
  const output: Incoming[] = [];
  const add = (sender: unknown, id: unknown, at: number, text: unknown, kind: string, echo = false) => {
    if (typeof sender !== 'string' || !/^\d{4,40}$/.test(sender) || sender === account || typeof id !== 'string' || !id || id.length > 512) return;
    if (!Number.isFinite(at) || at <= 0 || at > now + 60000) return;
    output.push({ channel, account, sender, id, at, text: typeof text === 'string' ? text.slice(0,8000) : '', kind, echo });
  };
  for (const entry of Array.isArray(payload.entry) ? payload.entry : []) {
    if (channel === 'whatsapp') {
      for (const change of Array.isArray(entry.changes) ? entry.changes : []) {
        const v = change.value;
        if (change.field !== 'messages' || v?.metadata?.phone_number_id !== account) continue;
        for (const m of Array.isArray(v.messages) ? v.messages : []) {
          add(m.from, m.id, Number(m.timestamp) * 1000, m.text?.body, m.type || 'unknown');
        }
      }
    } else {
      if (String(entry.id) !== account) continue;
      for (const e of Array.isArray(entry.messaging) ? entry.messaging : []) {
        if (e.message?.is_echo) {
          if (String(e.sender?.id) === account) add(String(e.recipient?.id || ''), e.message.mid, Number(e.timestamp), e.message.text, 'text', true);
          continue;
        }
        if (String(e.recipient?.id) !== account || !e.message || e.message.is_deleted || e.message.is_unsupported) continue;
        add(String(e.sender?.id || ''), e.message.mid, Number(e.timestamp), e.message.text, e.message.attachments?.length ? 'attachment' : 'text');
      }
    }
  }
  return output;
}
export function replyPlan(message: Incoming, history: {direction:string; text:string}[] = []) {
  const text = message.text.trim().toLowerCase();
  const handoff = (reason: string) => ({ action: 'handoff' as const, reason, text: '' });
  if (message.kind !== 'text') return handoff('Media or unsupported message requires a person to review.');
  // Financial, selection, identity, scheduling and high-impact decisions always go to staff.
  if (/(pay|paid|fee|refund|799|discount|select|shortlist|confirm|application.?id|submitted|applied|completed|error|problem|दिक्कत|submit.*(ki|kar|ho|done)|appl(y|ied).*done|status|date|venue|location|complaint|human|admin|stop|मत भेज|बंद|पैस|फीस|चयन|भुगतान|जमा|तारीख|शिकायत|नहीं.*(submit|apply))/iu.test(text)) return handoff('Staff decision, verification, opt-out or specific account question.');
  let answer = '';
  if (/(apply|application|form|perform|audition|register|आवेदन|फॉर्म|ऑडिशन|परफॉर्म)/iu.test(text)) {
    answer = 'नमस्ते! यह GGL का automated assistant है। 🙏 एपिसोड 3 में परफॉर्म करने के लिए अपना आवेदन यहाँ भर सकते हैं: https://www.gkpgotlatent.in/apply/performer\nअपना नाम, मोबाइल, ईमेल, उम्र (18+), शहर और अपने अनोखे टैलेंट/परफॉर्मेंस की जानकारी लिखें। नियम पढ़कर फॉर्म जमा करें। अगर किसी फ़ील्ड में दिक्कत है तो बताइए। आवेदन से चयन की गारंटी नहीं होती।';
  } else if (/^(hi|hello|hey|hii+|namaste|नमस्ते|हेलो)[!.,\s🙏]*$/iu.test(text)) {
    answer = 'नमस्ते! 🙏 यह GGL का automated assistant है। आप performer application, अपने talent या किसी और सवाल के बारे में बता सकते हैं। जहाँ टीम की मदद ज़रूरी होगी, आपकी बात उनके लिए रखेंगे।';
  } else if (/(clip|video|sample|क्लिप|वीडियो)/iu.test(text)) {
    answer = 'आप अपनी परफॉर्मेंस की क्लिप इसी चैट में भेज सकते हैं। टीम उसे रिव्यू करेगी। क्लिप भेजने या आवेदन करने से चयन तय नहीं होता।';
  } else if (/^(thanks?|thank you|ok(ay)?|धन्यवाद|शुक्रिया)[!.,\s🙏]*$/iu.test(text)) {
    return { action: 'ignore' as const, reason: 'Acknowledgement; no repeated follow-up.', text: '' };
  } else return handoff('No reviewed answer; needs the full context and a human response.');
  if (history.some(m => m.direction === 'outbound' && m.text === answer)) return handoff('The same help was already sent; avoid repetitive replies.');
  return { action: 'reply' as const, reason: 'Reviewed routine assistance', text: answer };
}
export function canSend(message: Incoming, env = process.env, now = Date.now()): boolean {
  const c = channelConfig(message.channel, env);
  return env.META_MESSAGING_ACTIVATED === 'true' && c.enabled && Boolean(c.account && c.token && /^v\d+\.\d+$/.test(c.version))
    && message.account === c.account && message.sender !== c.account && !message.echo
    && message.at <= now && now - message.at < 23 * 60 * 60 * 1000
    && (c.allowed.includes(message.sender) || c.allowed.includes('*'));
}
export function dailyReplyLimit(env = process.env): number {
  const n=Number(env.META_DAILY_REPLY_LIMIT || '20');
  return Number.isInteger(n) && n>=1 && n<=100 ? n : 20;
}
export async function deliver(message: Incoming, text: string, env = process.env, send = fetch) {
  if (!canSend(message, env)) throw new Error('Sending disabled, identity mismatch or reply window expired');
  const c = channelConfig(message.channel, env);
  const host = message.channel === 'whatsapp' ? 'graph.facebook.com' : 'graph.instagram.com';
  const body = message.channel === 'whatsapp'
    ? { messaging_product:'whatsapp', recipient_type:'individual', to:message.sender, type:'text', text:{body:text} }
    : { recipient:{id:message.sender}, message:{text} };
  const res = await send(`https://${host}/${c.version}/${c.account}/messages`, {
    method:'POST', headers:{Authorization:`Bearer ${c.token}`,'Content-Type':'application/json'},
    body:JSON.stringify(body), signal:AbortSignal.timeout(10000),
  });
  // Do not expose provider response bodies/tokens to logs or the inbox.
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Meta send returned HTTP ${res.status}`);
  const id = message.channel === 'whatsapp' ? result.messages?.[0]?.id : result.message_id;
  if (typeof id !== 'string' || !id) throw new Error('Meta send outcome requires manual reconciliation');
  return id;
}
