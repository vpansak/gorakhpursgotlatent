import { head } from '@vercel/blob';
import { getHookByToken,start } from 'workflow/api';
import { HookNotFoundError,HookConflictError } from 'workflow/errors';
import { retiredLegacyMirrorWorkflow } from '@/workflows/replicaSync';
import { db } from '@/lib/db';
import { activateRecovery } from '@/lib/activateRecovery';
import { recoveryRuntime,managedRecoveryReady } from '@/lib/recoveryRuntime';
import { createRecoveryCoordinator } from '@/lib/recoveryCoordinator';
import { getRun } from 'workflow/api';
import { timingSafeEqual } from 'node:crypto';
import { prepareReplica } from '@/lib/prepareReplica';
import { neon } from '@neondatabase/serverless';
import { archiveReplicaEvents, verifyReplicaEvents, runReplicaMirror } from '@/lib/replicaMirror';
import { startReplicaWorker } from '@/lib/startReplicaWorker';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;
const headers = { 'Cache-Control': 'private, no-store' };
export async function POST(request: Request) {
  const secret = process.env.GGL_REPLICA_SERVICE_TOKEN;
  const supplied = request.headers.get('authorization')?.replace(/^Bearer /,'') || '';
  if (!secret || Buffer.byteLength(secret)!==Buffer.byteLength(supplied) || !timingSafeEqual(Buffer.from(secret),Buffer.from(supplied))) return Response.json({error:'Unauthorized'},{status:403,headers});
  const body=await request.json().catch(()=>null);
  try {
    if(body?.action==='activate')return Response.json({success:true,...await activateRecovery()},{headers});
    if(body?.action==='rotate-worker'){
      const token='ggl-replica:recovery-v2';
      try{const hook=await getHookByToken(token);await getRun(hook.runId).cancel();}catch(error){if(!HookNotFoundError.is(error))throw error;}
      try{await start(retiredLegacyMirrorWorkflow,[],{experimental_hook:{token}});}catch(error){if(!HookConflictError.is(error))throw error;}
      return Response.json({success:true,runId:await startReplicaWorker('upgrade')},{headers});
    }
    if(body?.action==='journal-diagnostic'){
      const [document,metadata]=await Promise.all([recoveryRuntime().store.read('ggl-recovery/control.json'),head('ggl-recovery/control.json')]);
      return Response.json({success:true,readETag:document?.etag,storageETag:metadata.etag,sameETag:document?.etag===metadata.etag,size:metadata.size,head:document?.value.head,pending:!!document?.value.pending},{headers});
    }
    if(body?.action==='status'){
      const managed=await managedRecoveryReady();
      const state=managed?(await recoveryRuntime().journal.read()).state:null;
      const recovery=state?{active:state.active,head:state.head,nodes:state.nodes,pendingOperation:!!state.pending,writerBusy:!!state.lease&&state.lease.expires>Date.now(),leaseExpires:state.lease?.expires}:null;
      const runId=await startReplicaWorker('status');
      return Response.json({success:true,managed,automaticSyncEnabled:process.env.GGL_REPLICA_SYNC_ENABLED==='1',automaticFailoverEnabled:managed,recovery,runId,workerStatus:await getRun(runId).status},{headers});
    }
    if(body?.action==='prepare'&&await managedRecoveryReady())return Response.json({error:'Managed recovery is already active; baseline refresh is disabled.'},{status:409,headers});
    if(body?.action==='prepare') return Response.json({success:true,...await prepareReplica()},{headers});
    if(body?.action==='admin-read-test') {
      const rows=await db.queryStrict('SELECT count(*)::int AS performers FROM performer_applications');
      return Response.json({success:true,sharedAdminReadVerified:true,performers:rows[0].performers,managed:await managedRecoveryReady()},{headers});
    }
    if(body?.action==='managed-self-test') {
      if(!await managedRecoveryReady())throw new Error('MANAGED_ROUTING_NOT_ACTIVE');
      const runtime=recoveryRuntime();
      const results=[];
      for(const unavailable of ['neon','supabase'] as const) {
        const unavailableNode=new Proxy(runtime.nodes[unavailable],{get(target,key){if(key==='name'||key==='decodeRows')return target[key];return async()=>{throw new Error('Isolated outage simulation');};}});
        const nodes={...runtime.nodes,[unavailable]:unavailableNode};
        const test=createRecoveryCoordinator(runtime.journal,nodes,runtime.store);
        const key='__ggl_recovery_test_'+crypto.randomUUID();
        await test.write(`DO $test$ BEGIN INSERT INTO settings(key,value) VALUES('${key}','recovery-test'); DELETE FROM settings WHERE key='${key}'; END $test$`);
        const active=(await runtime.journal.read()).state.active;
        const rows=await runtime.coordinator.read('SELECT count(*)::int AS count FROM settings WHERE key=$1',[key]);
        if(rows[0].count!==0||active===unavailable)throw new Error('MANAGED_TEST_FAILED');
        await runtime.coordinator.recover();
        results.push({unavailable,storedOn:active,adminReadVerified:true,testRecordPersisted:false});
      }
      return Response.json({success:true,tests:results,recovery:await runtime.coordinator.recover(),automaticFailoverEnabled:true},{headers});
    }
    if(body?.action==='self-test') {
      const source=neon(process.env.DATABASE_URL!);
      const key='__ggl_replica_test_'+crypto.randomUUID();
      const result=await source.transaction([
        source.query('INSERT INTO settings(key,value) VALUES($1,$2)',[key,'replica-test']),
        source.query('DELETE FROM settings WHERE key=$1',[key]),
        source.query('SELECT sequence::text,transaction_id::text,id::text,table_name,operation,old_row::text,new_row::text FROM ggl_replica.outbox WHERE transaction_id=txid_current() ORDER BY sequence'),
      ]);
      const events=result[2];
      if(events.length!==2)throw new Error('TEST_CAPTURE_FAILED');
      await archiveReplicaEvents(events);
      const runId=await startReplicaWorker(events[0].id);
      await runReplicaMirror(10);
      const verified=await verifyReplicaEvents(events.map(row=>row.id));
      if(!verified)throw new Error('TEST_DELIVERY_FAILED');
      return Response.json({success:true,captureVerified:true,privateArchiveVerified:true,targetDeliveryVerified:true,testRecordPersisted:false,runId,automaticFailoverEnabled:false},{headers});
    }
    if(body?.action==='sync') {
      if(await managedRecoveryReady())return Response.json({success:true,automaticFailoverEnabled:true,...await recoveryRuntime().coordinator.recover()},{headers});
      const runId=await startReplicaWorker('operator-'+crypto.randomUUID());
      return Response.json({success:true,runId,...await runReplicaMirror(10),automaticSyncEnabled:process.env.GGL_REPLICA_SYNC_ENABLED==='1',automaticFailoverEnabled:false},{headers});
    }
    return Response.json({error:'Invalid action'},{status:400,headers});
  } catch(error) {
    const message=(error as Error)?.message||'';
    const code=/^[A-Z][A-Z0-9_]{2,80}$/.test(message)?message:String((error as {code?:string})?.code||'REPLICA_OPERATION_FAILED');
    console.error('Replica operation failed',{code,errorType:(error as Error)?.name});
    return Response.json({success:false,code},{status:503,headers});
  }
}
