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
    if(body?.action==='prepare') return Response.json({success:true,...await prepareReplica()},{headers});
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
      const runId=await startReplicaWorker('operator-'+crypto.randomUUID());
      return Response.json({success:true,runId,...await runReplicaMirror(10),automaticSyncEnabled:process.env.GGL_REPLICA_SYNC_ENABLED==='1',automaticFailoverEnabled:false},{headers});
    }
    return Response.json({error:'Invalid action'},{status:400,headers});
  } catch(error) {
    console.error('Replica operation failed',{code:(error as {code?:string})?.code || 'REPLICA_OPERATION_FAILED'});
    return Response.json({success:false,code:'REPLICA_OPERATION_FAILED',automaticFailoverEnabled:false},{status:503,headers});
  }
}
