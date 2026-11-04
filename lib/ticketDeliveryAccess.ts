import { timingSafeEqual } from 'crypto';
import { getTicketByTicketId } from '@/lib/ticketsStore';
export async function ticketForDelivery(ticketId:string,token:string) {
  if(!ticketId||!token)return null;
  const t=await getTicketByTicketId(ticketId);
  if(!t||!['PAID','SUCCESS','FREE'].includes(t.payment_status)||t.ticket_status==='CANCELLED')return null;
  const a=Buffer.from(token),b=Buffer.from(t.qr_token);
  return a.length===b.length&&timingSafeEqual(a,b)?t:null;
}
