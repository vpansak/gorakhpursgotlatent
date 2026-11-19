import { sleep } from 'workflow';
import { runReplicaMirror } from '../lib/replicaMirror';

async function deliverBatch() {
  "use step";
  try { return await runReplicaMirror(5); }
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
