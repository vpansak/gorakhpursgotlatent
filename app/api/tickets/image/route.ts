import { ticketForDelivery } from '@/lib/ticketDeliveryAccess';
import { getTicketImage } from '@/lib/ticketVisual';
export async function POST(req:Request){
  const {ticketId,token}=await req.json();
  const ticket=await ticketForDelivery(String(ticketId||''),String(token||''));
  if(!ticket)return Response.json({error:'Verified ticket access required'},{status:403});
  return new Response(new Uint8Array(await getTicketImage(ticket)),{headers:{'Content-Type':'image/png','Cache-Control':'private, no-store'}});
}
