import { db } from '@/lib/db';
import { sendAgentEmail, emailSendKey } from '@/lib/agentEmail';
import { createTicketPdf } from '@/lib/ticketPdf';
import type { TicketRecord } from '@/lib/ticketTypes';
export async function sendTicketPdf(ticket:TicketRecord,email:string) {
  const recipient=email.trim().toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)||recipient.length>254)throw new Error('Enter a valid email address');
  await db.queryStrict(`CREATE TABLE IF NOT EXISTS ticket_email_deliveries (send_key TEXT PRIMARY KEY,ticket_id TEXT NOT NULL,email TEXT NOT NULL,payload JSONB NOT NULL,status TEXT NOT NULL DEFAULT 'PENDING',created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)`);
  const key=emailSendKey(ticket.ticket_id,recipient);
  let entry=await db.queryOneStrict('SELECT * FROM ticket_email_deliveries WHERE send_key=?',[key]);
  if(entry?.status==='ACCEPTED')return;
  if(!entry){
    const count=await db.queryOneStrict('SELECT COUNT(*) AS n FROM ticket_email_deliveries WHERE ticket_id=?',[ticket.ticket_id]);
    if(Number(count?.n)>=3)throw new Error('This ticket has already been emailed to three addresses. Please contact GGL support.');
    const pdf=await createTicketPdf(ticket);
    const payload={to:recipient,subject:`Your GGL ticket — ${ticket.ticket_id}`,body_text:`Hi ${ticket.customer_name},\n\nYour verified GGL ticket PDF is attached.\nTicket ID: ${ticket.ticket_id}\nAdmits: ${ticket.quantity}\nAmount paid: INR ${ticket.amount}\n\nDownload: https://www.gkpgotlatent.in/ticket/verify/${ticket.ticket_id}\nKeep this ticket private.\nGorakhpur's Got Latent Team`,attachments:[{filename:`GGL-Ticket-${ticket.ticket_id}.pdf`,content_type:'application/pdf',content_base64:pdf.toString('base64')}]};
    await db.queryStrict("INSERT INTO ticket_email_deliveries(send_key,ticket_id,email,payload) VALUES (?,?,?,?::jsonb) ON CONFLICT(send_key) DO NOTHING",[key,ticket.ticket_id,recipient,JSON.stringify(payload)]);
    entry=await db.queryOneStrict('SELECT * FROM ticket_email_deliveries WHERE send_key=?',[key]);
  }
  await sendAgentEmail(typeof entry.payload==='string'?JSON.parse(entry.payload):entry.payload,key);
  await db.queryStrict("UPDATE ticket_email_deliveries SET status='ACCEPTED' WHERE send_key=?",[key]);
}
