import { randomBytes } from 'crypto';
import { db } from '@/lib/db';
import { sendNitrosendEmail } from '@/lib/emailjs';

export async function createPerformerInvitation(appId: string, amount: number) {
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1000000 || !/^\d+(\.\d{1,2})?$/.test(String(amount))) throw new Error('Enter a valid team-decided participation amount');
  await db.queryStrict("CREATE TABLE IF NOT EXISTS performer_payment_links (token TEXT PRIMARY KEY, app_id TEXT NOT NULL, amount NUMERIC(10,2) NOT NULL, status TEXT NOT NULL DEFAULT 'PENDING', razorpay_order_id TEXT, razorpay_payment_id TEXT, created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, paid_at TIMESTAMPTZ)");
  const existing=await db.queryStrict<{token:string}>('SELECT token FROM performer_payment_links WHERE app_id=? AND amount=? ORDER BY created_at DESC LIMIT 1',[appId, amount]);
  if(existing[0]?.token)return `https://www.gkpgotlatent.in/performer-payment/${existing[0].token}`;
  const token = randomBytes(24).toString('hex');
  await db.queryStrict("INSERT INTO performer_payment_links(token,app_id,amount,status) VALUES (?,?,?,'PENDING')", [token, appId, amount]);
  // Fixed official origin: never trust a submitted URL or forwarded Host header.
  return `https://www.gkpgotlatent.in/performer-payment/${token}`;
}
const escape = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function performerInvitationMessage(p: {appId:string; name:string; mobile:string; age:number; instagram:string; paymentUrl?:string}) {
  const subject = 'GGL Performer Application Received';
  const paymentInstructions = p.paymentUrl ? `Review the team-confirmed participation amount on your official payment link: ${p.paymentUrl}` : 'Your application is free. After shortlisting, the GGL team will decide and communicate your participation amount before sending an official payment link.';
  const body = `Hi ${p.name}!\n\nYour GGL performer application has been received.\nApplication ID: ${p.appId}\nName: ${p.name}\nMobile: ${p.mobile}\nAge: ${p.age}\nInstagram: ${p.instagram || 'Not provided'}\n\n${paymentInstructions}\n\nUse only an official payment link sent by the GGL team. Payment is confirmed after Razorpay verification. If you have already paid, please contact GGL before paying again.\n\nGorakhpur's Got Latent Team`;
  const html = `<html><body style="background:#0b0c10;color:#eee;font-family:Arial,sans-serif;padding:24px"><div style="max-width:580px;margin:auto;padding:26px;border:1px solid #d9a928;border-radius:16px"><h2 style="color:#f6c344">GORAKHPUR’S GOT LATENT</h2><h3>Hi ${escape(p.name)}! 🎤</h3><p>Your performer application has been received.</p><p style="line-height:1.9">Application ID: <b>${escape(p.appId)}</b><br>Name: ${escape(p.name)}<br>Mobile: ${escape(p.mobile)}<br>Age: ${escape(p.age)}<br>Instagram: ${escape(p.instagram || 'Not provided')}</p><p><a href="${escape(p.paymentUrl || "https://www.gkpgotlatent.in/performer-policy")}" style="display:inline-block;background:#f6c344;color:#111;padding:16px 22px;border-radius:9px;text-decoration:none;font-weight:bold">${p.paymentUrl ? 'Review participation payment' : 'Read performer policy'}</a></p><p>${escape(paymentInstructions)}</p><p>Use only an official payment link sent by the GGL team. Payment will be confirmed after Razorpay verification.</p><p>If you have already paid, contact GGL before paying again.</p><p style="word-break:break-all;font-size:12px">${escape(p.paymentUrl || "")}</p></div></body></html>`;
  return {subject,body,html};
}
export async function emailPerformerInvitation(p: Parameters<typeof performerInvitationMessage>[0] & {email:string}) {
  const message = performerInvitationMessage(p);
  const result = await sendNitrosendEmail(p.email, message.subject, message.body, message.html, `ggl-performer-invitation-${p.appId}`);
  await db.queryStrict('UPDATE performer_applications SET email_status=? WHERE app_id=?', [result.success ? 'SENT' : 'FAILED', p.appId]);
  if (!result.success) console.error('Performer invitation email not accepted', {appId:p.appId});
  else console.info('Performer invitation accepted by NitroSend', {appId:p.appId});
  return result;
}

