// Isolated private-object preflight. No application or database records are touched.
import {get,put,del,BlobPreconditionFailedError} from '@vercel/blob';
import {randomUUID} from 'node:crypto';
if(process.env.GGL_RECOVERY_PREFLIGHT!=='1')process.exit(0);
const name=`ggl-recovery/preflight/${randomUUID()}.json`;
let latest;
try{
  if(!process.env.BLOB_READ_WRITE_TOKEN)throw new Error('MISSING_JOURNAL_CONFIGURATION');
  latest=await put(name,JSON.stringify({revision:1,padding:'x'.repeat(8192)}),{token:process.env.BLOB_READ_WRITE_TOKEN,access:'private',addRandomSuffix:false,allowOverwrite:false,contentType:'application/json'});
  const first=await get(name,{token:process.env.BLOB_READ_WRITE_TOKEN,access:'private',useCache:false,headers:{'accept-encoding':'identity','cache-control':'no-cache, no-store'}});
  if(!first?.stream||JSON.parse(await new Response(first.stream).text()).revision!==1)throw new Error('PRIVATE_READ_FAILED');
  if(first.blob.etag!==latest.etag)throw new Error('READ_WRITE_ETAG_MISMATCH');
  const previous=first.blob.etag;
  latest=await put(name,JSON.stringify({revision:2,padding:'x'.repeat(8192)}),{token:process.env.BLOB_READ_WRITE_TOKEN,access:'private',addRandomSuffix:false,allowOverwrite:true,ifMatch:previous,contentType:'application/json'});
  let rejected=false;
  try{await put(name,'{"revision":3}',{token:process.env.BLOB_READ_WRITE_TOKEN,access:'private',addRandomSuffix:false,allowOverwrite:true,ifMatch:previous,contentType:'application/json'});}catch(error){if(error instanceof BlobPreconditionFailedError)rejected=true;else throw error;}
  if(!rejected)throw new Error('CONDITIONAL_WRITE_NOT_ENFORCED');
  const last=await get(name,{token:process.env.BLOB_READ_WRITE_TOKEN,access:'private',useCache:false,headers:{'accept-encoding':'identity','cache-control':'no-cache, no-store'}});
  if(!last?.stream||JSON.parse(await new Response(last.stream).text()).revision!==2)throw new Error('CONSISTENT_READ_FAILED');
  console.log('GGL_RECOVERY_PREFLIGHT_OK: private writes, origin reads and stale-writer rejection verified.');
}catch{
  console.error('GGL_RECOVERY_PREFLIGHT_FAILED: automatic failover must remain disabled.');process.exitCode=1;
}finally{
  if(latest)await del(latest.url,{token:process.env.BLOB_READ_WRITE_TOKEN,ifMatch:latest.etag}).catch(()=>{});
}
