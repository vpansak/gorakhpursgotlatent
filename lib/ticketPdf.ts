import 'regenerator-runtime/runtime.js';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { readFile } from 'fs/promises';
import path from 'path';
import QRCode from 'qrcode';
import type { TicketRecord } from '@/lib/ticketTypes';
export async function createTicketPdf(ticket: TicketRecord) {
  const doc=await PDFDocument.create();doc.registerFontkit(fontkit);
  doc.setCreationDate(new Date(ticket.created_at));doc.setModificationDate(new Date(ticket.created_at));
  const [latinBytes,hindiBytes]=await Promise.all(['NotoSans-Regular.ttf','NotoSansDevanagari-Regular.ttf'].map(name=>readFile(path.join(process.cwd(),'public/fonts',name))));
  const latin=await doc.embedFont(latinBytes),hindi=await doc.embedFont(hindiBytes);
  const page=doc.addPage([600,400]);page.drawRectangle({x:0,y:0,width:600,height:400,color:rgb(.04,.045,.065)});
  page.drawRectangle({x:18,y:18,width:564,height:364,borderColor:rgb(.95,.74,.25),borderWidth:1});
  const text=(value:unknown,x:number,y:number,size=12,max=340)=>{
    let s=String(value ?? '').replace(/[^\x20-\x7E\u0900-\u097f]/g,'');
    const runs=(v:string)=>v.match(/[\u0900-\u097f]+|[^\u0900-\u097f]+/g)||[];
    const fontFor=(v:string)=>/[\u0900-\u097f]/.test(v)?hindi:latin;
    const width=(v:string)=>runs(v).reduce((total,run)=>total+fontFor(run).widthOfTextAtSize(run,size),0);
    while(width(s)>max&&s.length)s=s.slice(0,-1);
    for(const run of runs(s)){const font=fontFor(run);page.drawText(run,{x,y,size,font,color:rgb(.96,.96,.96)});x+=font.widthOfTextAtSize(run,size);}
  };
  text("GORAKHPUR'S GOT LATENT",36,350,22,530);text('EPISODE 3 | OFFICIAL ADMISSION TICKET',36,322,12,530);
  text(ticket.customer_name,36,278,18);text('Ticket ID: '+ticket.ticket_id,36,245);text('Booking: '+ticket.booking_id,36,221,10);
  text('Mobile: '+ticket.mobile,36,197);text('ADMIT '+ticket.quantity+' '+(ticket.quantity===1?'PERSON':'PEOPLE'),36,166,18);
  text('Amount paid: INR '+Number(ticket.amount).toFixed(2),36,138);text('Payment: '+ticket.payment_status,36,114);
  text('Schedule / venue: check official GGL updates.',36,78,10,530);text('Show this QR ticket at entry. Keep your ticket private.',36,53,10,530);
  const qr=await QRCode.toDataURL(`https://www.gkpgotlatent.in/ticket/verify/${ticket.ticket_id}`,{width:300,margin:2});
  const image=await doc.embedPng(qr);page.drawImage(image,{x:402,y:142,width:154,height:154});text(ticket.ticket_id,402,120,12,154);
  return Buffer.from(await doc.save());
}
