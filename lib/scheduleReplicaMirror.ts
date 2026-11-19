import { after } from 'next/server';
import { runReplicaMirror } from './replicaMirror';

export function scheduleReplicaMirror() {
  if(process.env.GGL_REPLICA_SYNC_ENABLED!=='1')return;
  try{
    after(async()=>{try{await runReplicaMirror();}catch{console.warn('Replica mirror pending: durable changes retained for retry.');}});
  }catch{
    // CLI/setup code runs an explicit sync. Never launch an untracked promise
    // when no request lifecycle is available.
  }
}
