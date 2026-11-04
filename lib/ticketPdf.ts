import { PDFDocument } from 'pdf-lib';
import { getTicketImage } from '@/lib/ticketVisual';
import type { TicketRecord } from '@/lib/ticketTypes';
export async function ticketPdfFromImage(png:Uint8Array) {
  const doc=await PDFDocument.create();
  const image=await doc.embedPng(png);
  const page=doc.addPage();page.setSize(image.width,image.height);
  page.drawImage(image,{x:0,y:0,width:image.width,height:image.height});
  return Buffer.from(await doc.save());
}
export async function createTicketPdf(ticket:TicketRecord) {return ticketPdfFromImage(await getTicketImage(ticket));}
