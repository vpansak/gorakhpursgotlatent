import { NextResponse } from 'next/server';
import { ticketForDelivery } from '@/lib/ticketDeliveryAccess';
import { sendTicketPdf } from '@/lib/ticketEmail';
export const maxDuration=60;
export async function POST(req:Request){
  try {
    const {ticketId,token,email}=await req.json();
    if(typeof email!=='string'||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))return NextResponse.json({error:'Enter a valid email address'},{status:400});
    const ticket=await ticketForDelivery(String(ticketId||''),String(token||''));
    if(!ticket)return NextResponse.json({error:'Verified ticket access required'},{status:403});
    await sendTicketPdf(ticket,email);
    return NextResponse.json({success:true,message:'Your ticket PDF has been sent to your email. Please check inbox and spam.'});
  }catch(e:any){return NextResponse.json({error:e.message||'Unable to email ticket'},{status:502});}
}
