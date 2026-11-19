import { get } from '@vercel/blob';
export const runtime='nodejs';
export async function GET(_request:Request,{params}:{params:Promise<{file:string}>}){
 const {file}=await params;
 if(!/^\d+-[a-f0-9]{16}\.(jpg|jpeg|png|webp|pdf)$/.test(file))return new Response('Media not found',{status:404});
 try{
  const blob=await get(`ggl-public-media/${file}`,{token:process.env.BLOB_READ_WRITE_TOKEN,access:'private',useCache:false,abortSignal:AbortSignal.timeout(15000)});
  if(!blob?.stream||blob.statusCode!==200)return new Response('Media not found',{status:404});
  const ext=file.split('.').pop()!;const types:Record<string,string>={jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',pdf:'application/pdf'};
  return new Response(blob.stream,{headers:{'Content-Type':types[ext],'X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=31536000, immutable','Content-Security-Policy':"default-src 'none'; sandbox"}});
 }catch{return new Response('Media is temporarily unavailable',{status:503});}
}
