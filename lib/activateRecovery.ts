import { getHookByToken,getRun,start } from 'workflow/api';
import { HookConflictError,HookNotFoundError } from 'workflow/errors';
import { retiredLegacyMirrorWorkflow } from '../workflows/replicaSync';
import { prepareReplica } from './prepareReplica';
import { recoveryRuntime } from './recoveryRuntime';
import { replicaTables } from './replicaJournal';
import { startReplicaWorker } from './startReplicaWorker';

export async function activateRecovery() {
  if(process.env.GGL_RECOVERY_ENABLED!=='1')throw new Error('MANAGED_ROUTING_NOT_DEPLOYED');
  const runtime=recoveryRuntime();
  const existing=await runtime.store.read('ggl-recovery/control.json');
  if(existing?.value.status==='READY')return {alreadyActive:true,...await runtime.coordinator.recover()};
  // Retire the deployment-pinned legacy consumer before publishing managed routing.
  const token='ggl-replica:neon-mirror-v1';
  try {
    const hook=await getHookByToken(token);
    await getRun(hook.runId).cancel();
  } catch(error){if(!HookNotFoundError.is(error))throw error;}
  try {await start(retiredLegacyMirrorWorkflow,[],{experimental_hook:{token}});}
  catch(error){if(!HookConflictError.is(error))throw error;throw new Error('LEGACY_WORKER_NOT_RETIRED');}
  const worker=await startReplicaWorker('cutover');
  let baseline:string|undefined;
  await prepareReplica({beforeResume:async(source,target)=>{
    const tables=await replicaTables(source);
    const literal=(value:string)=>"'"+value.replace(/'/g,"''")+"'";
    const [snapshot]=await source(`SELECT jsonb_build_object(${tables.map(t=>`${literal(t.name)},(SELECT COALESCE(jsonb_agg(to_jsonb(r)),'[]'::jsonb)::text FROM public."${t.name.replace(/"/g,'""')}" r)`).join(',')}) AS data`);
    baseline=`ggl-recovery/baselines/${crypto.randomUUID()}.json`;
    await runtime.store.create(baseline,{version:1,tables,data:snapshot.data,createdAt:Date.now()});
    await runtime.journal.initialize();
    const lease=await runtime.journal.acquire();
    try {
      if(lease.state.head!==0||lease.state.pending)throw new Error('UNEXPECTED_RECOVERY_STATE');
      for(const query of [source,target]) {
        await query('UPDATE ggl_replica.ledger_state SET position=0 WHERE singleton=true');
        await query("UPDATE ggl_replica.node SET mode='MANAGED',pause_until=NULL,ready=true WHERE singleton=true");
      }
      await runtime.journal.activate(lease);
    } finally {await runtime.journal.release(lease);}
  }});
  return {automaticSyncEnabled:true,automaticFailoverEnabled:true,worker,baselineArchived:!!baseline};
}
