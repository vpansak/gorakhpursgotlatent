import { start } from 'workflow/api';
import { HookConflictError } from 'workflow/errors';
import { replicaSyncWorkflow } from '../workflows/replicaSync';

export async function startReplicaWorker(_batchId: string) {
  try {
    const run = await start(replicaSyncWorkflow, [], {
      experimental_hook: { token: 'ggl-replica:recovery-v6' },
    });
    return run.runId;
  } catch (error) {
    if (HookConflictError.is(error) && error.conflictingRunId) return error.conflictingRunId;
    throw error;
  }
}
