import { after } from 'next/server';
import { managedRecoveryReady,recoveryRuntime } from './recoveryRuntime';
import { runReplicaMirror } from './replicaMirror';

export function scheduleReplicaMirror() {
  if(process.env.GGL_REPLICA_SYNC_ENABLED!=='1')return;
  try{
    after(async()=>{try{if(await managedRecoveryReady())await recoveryRuntime().coordinator.recover();else await runReplicaMirror();}catch{console.warn('Replica mirror pending: durable changes retained for retry.');}});
  }catch{
    // CLI/setup code runs an explicit sync. Never launch an untracked promise
    // when no request lifecycle is available.
  }
}
