import { sleep } from 'workflow';
import { managedRecoveryReady,recoveryRuntime } from '../lib/recoveryRuntime';
import { runReplicaMirror } from '../lib/replicaMirror';

async function deliverBatch() {
  "use step";
  try {
    if(await managedRecoveryReady()){
      const result=await recoveryRuntime().coordinator.recover();
      return {pending:Object.values(result.nodes).some(value=>value==='PENDING')?(result.pending>0?result.pending:-1):0,delivered:0};
    }
    return await runReplicaMirror(5);
  }
  catch { console.warn('Replica unavailable; durable changes retained for retry.'); return { pending: -1, delivered: 0 }; }
}

export async function replicaSyncWorkflow() {
  "use workflow";
  await sleep('5s');
  for (;;) {
    const result = await deliverBatch();
    await sleep(result.pending === 0 || result.pending < 0 ? '5m' : '5s');
  }
}

// Hold the retired token so requests from an older deployment cannot restart
// a legacy worker after managed routing has taken over.
export async function retiredLegacyMirrorWorkflow() {
  "use workflow";
  for (;;) await sleep('30 days');
}
