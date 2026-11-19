import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { get } from '@vercel/blob';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getS3Client,S3_BUCKET } from '@/lib/storage';
import path from 'node:path';
import fs from 'node:fs';

export const runtime='nodejs';
export async function GET(_request:Request,{params}:{params:Promise<{file:string}>}) {
  const session=await getSession();
  if(!session||!['SUPER_ADMIN','ADMIN','STAFF'].includes(session.role))return new NextResponse('Unauthorized access to confidential documents',{status:403});
  const {file}=await params;
  if(!/^[a-zA-Z0-9_.-]+$/.test(file)||file.includes('..'))return new NextResponse('Invalid document name',{status:400});
  const type:Record<string,string>={'.pdf':'application/pdf','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'};
  const headers={'Content-Type':type[path.extname(file).toLowerCase()]||'application/octet-stream','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Disposition':`attachment; filename="${file}"`};
  try {
    if(process.env.BLOB_READ_WRITE_TOKEN){
      const document=await get(`ggl-private-documents/${file}`,{token:process.env.BLOB_READ_WRITE_TOKEN,access:'private',useCache:false,abortSignal:AbortSignal.timeout(15000)});
      if(document?.stream&&document.statusCode===200)return new Response(document.stream,{headers});
    }
    // Read compatibility for previously stored documents; new writes use Blob only.
    const s3=getS3Client();
    if(s3&&S3_BUCKET){
      try{const stored=await s3.send(new GetObjectCommand({Bucket:S3_BUCKET,Key:`documents/${file}`}));if(stored.Body)return new Response(new Uint8Array(await stored.Body.transformToByteArray()),{headers});}catch(error){if(!['NoSuchKey','NotFound'].includes((error as Error)?.name))throw error;}
    }
    for(const directory of ['private-assets','storage/private']){
      const oldFile=path.join(process.cwd(),directory,file);
      if(fs.existsSync(oldFile))return new Response(new Uint8Array(fs.readFileSync(oldFile)),{headers});
    }
    return new NextResponse('Document not found',{status:404});
  }catch{return new NextResponse('Private document storage temporarily unavailable',{status:503});}
}
