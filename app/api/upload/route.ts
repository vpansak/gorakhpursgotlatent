import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { randomBytes } from 'node:crypto';
import { getSession } from '@/lib/auth';
export const runtime='nodejs';
const types:Record<string,string>={'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.pdf':'application/pdf'};
export async function POST(req:Request){
 const session=await getSession();
 if(!session||!['SUPER_ADMIN','ADMIN','STAFF'].includes(session.role))return NextResponse.json({error:'Staff authentication required'},{status:403});
 try{
  const form=await req.formData(),file=form.get('file');
  if(!file||typeof file==='string')return NextResponse.json({error:'No file uploaded'},{status:400});
  if(file.size>10*1024*1024)return NextResponse.json({error:'File size exceeds 10MB limit'},{status:400});
  const ext=file.name.toLowerCase().match(/\.[^.]+$/)?.[0]||'';
  if(!types[ext])return NextResponse.json({error:'Invalid file format. Allowed: JPG, PNG, WEBP, PDF'},{status:400});
  if(!process.env.BLOB_READ_WRITE_TOKEN)return NextResponse.json({error:'Media storage is temporarily unavailable. Please retry.'},{status:503});
  const filename=`${Date.now()}-${randomBytes(8).toString('hex')}${ext}`;
  await put(`ggl-public-media/${filename}`,Buffer.from(await file.arrayBuffer()),{token:process.env.BLOB_READ_WRITE_TOKEN,access:'private',addRandomSuffix:false,allowOverwrite:false,contentType:types[ext]});
  return NextResponse.json({success:true,url:`/api/media/${filename}`,filename});
 }catch{return NextResponse.json({error:'Media upload could not be saved. Please retry.'},{status:503});}
}
