import { ticketForDelivery } from '@/lib/ticketDeliveryAccess';
import { createTicketPdf } from '@/lib/ticketPdf';
export async function POST(req:Request){
  const {ticketId,token}=await req.json();
  const ticket=await ticketForDelivery(String(ticketId||''),String(token||''));
  if(!ticket)return Response.json({error:'Verified ticket access required'},{status:403});
  return new Response(new Uint8Array(await createTicketPdf(ticket)),{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="GGL-Ticket-${ticket.ticket_id}.pdf"`,'Cache-Control':'no-store'}});
}
