import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { randomBytes } from 'node:crypto';
import { getSession } from '@/lib/auth';

export const runtime='nodejs';
const types:Record<string,string>={'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.pdf':'application/pdf','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'};
export async function POST(req:Request) {
  const session=await getSession();
  if(!session||!['SUPER_ADMIN','ADMIN','STAFF'].includes(session.role))return NextResponse.json({error:'Staff authentication required'},{status:403});
  try {
    const form=await req.formData();const file=form.get('file');
    if(!file||typeof file==='string')return NextResponse.json({error:'No file uploaded'},{status:400});
    if(file.size>15*1024*1024)return NextResponse.json({error:'File size exceeds 15MB limit'},{status:400});
    const ext=file.name.toLowerCase().match(/\.[^.]+$/)?.[0]||'';
    if(!types[ext])return NextResponse.json({error:'Invalid document format. Allowed: JPG, PNG, PDF, DOCX'},{status:400});
    if(!process.env.BLOB_READ_WRITE_TOKEN)return NextResponse.json({error:'Private storage is temporarily unavailable. Please retry.'},{status:503});
    const safeName=`doc-${Date.now()}-${randomBytes(12).toString('hex')}${ext}`;
    await put(`ggl-private-documents/${safeName}`,Buffer.from(await file.arrayBuffer()),{token:process.env.BLOB_READ_WRITE_TOKEN,access:'private',addRandomSuffix:false,allowOverwrite:false,contentType:types[ext]});
    return NextResponse.json({success:true,fileKey:safeName,docUrl:`/api/malik/documents/${safeName}`},{headers:{'Cache-Control':'private, no-store'}});
  }catch{return NextResponse.json({error:'Private document could not be saved. Please retry.'},{status:503});}
}
