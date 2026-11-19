import { neon } from '@neondatabase/serverless';
import { Pool } from 'pg';
import { recoveryJournalStore } from './recoveryJournalStore';
import { pendingReplicaEvents, syncReplicaJournal } from './replicaJournal';
import { SUPABASE_ROOT_CA } from './supabaseTls';

let mirrorWork:Promise<any>|null=null;
export async function archiveReplicaEvents(events:Record<string,any>[]) {
  const store=recoveryJournalStore();
  for(const event of events) {
    if(!/^[0-9a-f-]{36}$/i.test(event.id)||!/^\d+$/.test(String(event.sequence)))throw new Error('INVALID_REPLICA_EVENT');
    const path=`ggl-recovery/legacy-events/neon/${String(event.sequence).padStart(20,'0')}-${event.id}.json`;
    const record={origin:'neon',event};
    try{await store.create(path,record);}catch(error){
      if((error as {code?:string})?.code!=='CONFLICT')throw error;
      const stored=await store.read(path);
      const fields=['sequence','transaction_id','id','table_name','operation','old_row','new_row'];
      if(!stored||stored.value.origin!=='neon'||fields.some(key=>stored.value.event?.[key]!==event[key]))throw new Error('RECOVERY_ARCHIVE_CONFLICT');
    }
  }
}
export async function runReplicaMirror(maxBatches=3) {
  if(mirrorWork)return mirrorWork;
  mirrorWork=(async()=>{
    if(!process.env.DATABASE_URL||!process.env.SUPABASE_DATABASE_URL)throw new Error('REPLICA_NOT_CONFIGURED');
    const source=neon(process.env.DATABASE_URL);
    const query=async(sql:string,params:any[]=[])=>await source.query(sql,params);
    const url=new URL(process.env.SUPABASE_DATABASE_URL);
    if(!url.hostname.endsWith('.supabase.com')&&!url.hostname.endsWith('.supabase.co'))throw new Error('INVALID_REPLICA_HOST');
    ['sslmode','sslcert','sslkey','sslrootcert'].forEach(key=>url.searchParams.delete(key));
    const pool=new Pool({connectionString:url.toString(),ssl:{ca:SUPABASE_ROOT_CA,rejectUnauthorized:true},max:1,connectionTimeoutMillis:6000,query_timeout:45000,statement_timeout:40000});
    let client;
    try{
      client=await pool.connect();let delivered=0;
      const target=async(sql:string,params:any[]=[])=> (await client!.query(sql,params)).rows;
      for(let batch=0;batch<maxBatches;batch++){
        const events=await pendingReplicaEvents(query);if(!events.length)break;
        await archiveReplicaEvents(events);
        const result=await syncReplicaJournal(query,target,events);delivered+=result.delivered;
      }
      const [remaining]=await query('SELECT count(*)::text AS count FROM ggl_replica.outbox WHERE delivered_at IS NULL');
      return{delivered,pending:Number(remaining.count)};
    }finally{client?.release();await pool.end().catch(()=>{});}
  })().finally(()=>{mirrorWork=null;});
  return mirrorWork;
}

export async function verifyReplicaEvents(ids:string[]) {
  const url=new URL(process.env.SUPABASE_DATABASE_URL!);
  if(!url.hostname.endsWith('.supabase.com')&&!url.hostname.endsWith('.supabase.co'))throw new Error('INVALID_REPLICA_HOST');
  ['sslmode','sslcert','sslkey','sslrootcert'].forEach(key=>url.searchParams.delete(key));
  const pool=new Pool({connectionString:url.toString(),ssl:{ca:SUPABASE_ROOT_CA,rejectUnauthorized:true},max:1,connectionTimeoutMillis:6000});
  try {
    const result=await pool.query('SELECT count(*)::int AS count FROM ggl_replica.applied WHERE id=ANY($1::uuid[])',[ids]);
    return result.rows[0].count===ids.length;
  } finally { await pool.end(); }
}
