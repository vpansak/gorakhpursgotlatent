import { randomBytes } from 'crypto';
import { db } from '@/lib/db';
import { sendNitrosendEmail } from '@/lib/emailjs';

export const PERFORMER_SEAT_AMOUNT = 799;
export async function createPerformerInvitation(appId: string) {
  await db.queryStrict("CREATE TABLE IF NOT EXISTS performer_payment_links (token TEXT PRIMARY KEY, app_id TEXT NOT NULL, amount NUMERIC(10,2) NOT NULL, status TEXT NOT NULL DEFAULT 'PENDING', razorpay_order_id TEXT, razorpay_payment_id TEXT, created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, paid_at TIMESTAMPTZ)");
  const token = randomBytes(24).toString('hex');
  await db.queryStrict("INSERT INTO performer_payment_links(token,app_id,amount,status) VALUES (?,?,?,'PENDING')", [token, appId, PERFORMER_SEAT_AMOUNT]);
  // Fixed official origin: never trust a submitted URL or forwarded Host header.
  return `https://www.gkpgotlatent.in/performer-payment/${token}`;
}
const escape = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function performerInvitationMessage(p: {appId:string; name:string; mobile:string; age:number; instagram:string; paymentUrl:string}) {
  const subject = 'GGL Performer Application — Pay ₹799 to confirm your seat';
  const body = `Hi ${p.name}!\n\nYour GGL performer application has been received.\nApplication ID: ${p.appId}\nName: ${p.name}\nMobile: ${p.mobile}\nAge: ${p.age}\nInstagram: ${p.instagram || 'Not provided'}\n\nPay ₹799 to confirm your seat:\n${p.paymentUrl}\n\nThis personal link is only for your application. Payment is confirmed after Razorpay verification. If you have already paid, please contact GGL before paying again.\n\nGorakhpur's Got Latent Team`;
  const html = `<html><body style="background:#0b0c10;color:#eee;font-family:Arial,sans-serif;padding:24px"><div style="max-width:580px;margin:auto;padding:26px;border:1px solid #d9a928;border-radius:16px"><h2 style="color:#f6c344">GORAKHPUR’S GOT LATENT</h2><h3>Hi ${escape(p.name)}! 🎤</h3><p>Your performer application has been received.</p><p style="line-height:1.9">Application ID: <b>${escape(p.appId)}</b><br>Name: ${escape(p.name)}<br>Mobile: ${escape(p.mobile)}<br>Age: ${escape(p.age)}<br>Instagram: ${escape(p.instagram || 'Not provided')}</p><p><a href="${escape(p.paymentUrl)}" style="display:inline-block;background:#f6c344;color:#111;padding:16px 22px;border-radius:9px;text-decoration:none;font-weight:bold">Pay ₹799 to confirm your seat</a></p><p>This personal link belongs only to your application. Payment will be confirmed after Razorpay verification.</p><p>If you have already paid, contact GGL before paying again.</p><p style="word-break:break-all;font-size:12px">${escape(p.paymentUrl)}</p></div></body></html>`;
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
