import { Resvg } from '@resvg/resvg-js';
import { toDataURL } from 'qrcode';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { db } from '@/lib/db';
import type { TicketRecord } from '@/lib/ticketTypes';
const esc=(s:unknown)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]!));
export async function renderTicketImage(ticket:TicketRecord) {
  const mascot=(await readFile(join(process.cwd(),'public/ggl-mascot.jpg'))).toString('base64');
  const qr=await toDataURL(`https://www.gkpgotlatent.in/ticket/verify/${ticket.ticket_id}`,{width:320,margin:2});
  const quantity=Number(ticket.quantity)||1;
  let nameX=264;
  const nameRuns=(ticket.customer_name.slice(0,38).match(/[\u0900-\u097f]+|[^\u0900-\u097f]+/g)||[]).map(run=>{
    const tag=`<text x="${nameX}" y="199" font-size="25" fill="#fff" font-family="${/[\u0900-\u097f]/.test(run)?'Noto Sans Devanagari':'Noto Sans'}">${esc(run)}</text>`;
    nameX+=Array.from(run).filter(c=>!/[\u093a-\u094f\u0951-\u0957\u0962-\u0963]/.test(c)).length*14;return tag;
  }).join('');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="480" viewBox="0 0 1200 480"><defs><linearGradient id="bg"><stop stop-color="#261705"/><stop offset=".5" stop-color="#08080b"/><stop offset="1" stop-color="#270b0b"/></linearGradient><clipPath id="frame"><rect x="3" y="3" width="1194" height="474" rx="24"/></clipPath></defs><g clip-path="url(#frame)"><rect width="1200" height="480" fill="url(#bg)"/><path d="M235 0V480M920 0V480" stroke="#b78528" stroke-dasharray="7 7"/><image href="data:image/jpeg;base64,${mascot}" x="18" y="72" width="198" height="255" preserveAspectRatio="xMidYMid meet"/><text x="118" y="366" text-anchor="middle" fill="#f9ca60" font-size="20" font-weight="bold">GGL OFFICIAL</text><text x="118" y="398" text-anchor="middle" fill="#aaa" font-size="15">ADMISSION PASS</text><g font-family="Noto Sans, Noto Sans Devanagari" fill="#fff"><text x="264" y="53" font-size="15" fill="#f9ca60" letter-spacing="3">OFFICIAL ADMISSION PASS</text><text x="264" y="91" font-size="29" font-weight="bold">GORAKHPUR’S GOT LATENT</text><text x="264" y="132" font-size="25" font-weight="bold" fill="#f9ca60">TICKETS × ${quantity} · ADMIT ${quantity} ${quantity===1?'PERSON':'PEOPLE'}</text><text x="264" y="168" fill="#aaa" font-size="13">NAME</text>${nameRuns}<text x="264" y="238" fill="#aaa" font-size="13">TICKET ID</text><text x="264" y="268" fill="#f9ca60" font-size="23">${esc(ticket.ticket_id)}</text><text x="590" y="238" fill="#aaa" font-size="13">MOBILE</text><text x="590" y="268" font-size="22">${esc(ticket.mobile)}</text><text x="264" y="307" fill="#aaa" font-size="13">TOTAL PRICE</text><text x="264" y="337" fill="#f9ca60" font-size="24">₹${Number(ticket.amount).toFixed(2)}</text><text x="590" y="307" fill="#aaa" font-size="13">BOOKING DATE</text><text x="590" y="337" font-size="19">${esc(new Date(ticket.created_at).toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata'}))}</text><path d="M264 360H894" stroke="#73541e"/><text x="264" y="393" font-size="22" font-weight="bold" fill="#f9ca60">EPISODE 3</text><text x="264" y="422" font-size="15">Date, time &amp; venue: official updates coming soon.</text><text x="264" y="454" fill="#6ee7b7" font-size="16">${esc(ticket.payment_status)} · QR VERIFIED ENTRY</text><text x="1060" y="55" text-anchor="middle" fill="#f9ca60" font-size="19">ADMIT ${quantity} ${quantity===1?'PERSON':'PEOPLE'}</text><text x="1060" y="85" text-anchor="middle" fill="#aaa" font-size="13">SCAN AT VENUE</text><image href="${qr}" x="950" y="112" width="220" height="220"/><text x="1060" y="370" text-anchor="middle" fill="#f9ca60" font-size="23">${esc(ticket.ticket_id)}</text><text x="1060" y="409" text-anchor="middle" fill="#aaa" font-size="14">18+ · KEEP TICKET PRIVATE</text></g></g><rect x="3" y="3" width="1194" height="474" rx="24" fill="none" stroke="#efbf4a" stroke-width="3"/></svg>`;
  return Buffer.from(new Resvg(svg,{font:{fontFiles:['NotoSans-Regular.ttf','NotoSansDevanagari-Regular.ttf'].map(f=>join(process.cwd(),'public/fonts',f)),loadSystemFonts:false,defaultFontFamily:'Noto Sans'}}).render().asPng());
}
export async function getTicketImage(ticket:TicketRecord) {
  await db.queryStrict('CREATE TABLE IF NOT EXISTS ticket_visuals (ticket_id TEXT PRIMARY KEY,png BYTEA NOT NULL,created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)');
  let saved=await db.queryOneStrict('SELECT png FROM ticket_visuals WHERE ticket_id=?',[ticket.ticket_id]);
  if(!saved){const png=await renderTicketImage(ticket);await db.queryStrict('INSERT INTO ticket_visuals(ticket_id,png) VALUES (?,?) ON CONFLICT(ticket_id) DO NOTHING',[ticket.ticket_id,png]);saved=await db.queryOneStrict('SELECT png FROM ticket_visuals WHERE ticket_id=?',[ticket.ticket_id]);}
  if(!saved?.png)throw new Error('Ticket image could not be saved');
  return Buffer.from(saved.png);
}
