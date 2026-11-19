import { archiveReplicaEvents } from './replicaMirror';
// One-time, opt-in setup using production secrets already held by Vercel.
import { neon } from '@neondatabase/serverless';
import { Pool } from 'pg';
import { installReplicaJournal,refreshReplicaContents } from './replicaJournal';
import { SUPABASE_ROOT_CA } from './supabaseTls';
export async function prepareReplica() {
let pool:Pool|undefined,client:any;
try{
  if(!process.env.DATABASE_URL||!process.env.SUPABASE_DATABASE_URL||!process.env.BLOB_READ_WRITE_TOKEN)throw new Error('CONFIGURATION_MISSING');
  const source=neon(process.env.DATABASE_URL);
  const query=async(s:string,p:any[]=[])=>await source.query(s,p);
  const url=new URL(process.env.SUPABASE_DATABASE_URL);
  if(!url.hostname.endsWith('.supabase.com')&&!url.hostname.endsWith('.supabase.co'))throw new Error('INVALID_TARGET');
  ['sslmode','sslcert','sslkey','sslrootcert'].forEach(k=>url.searchParams.delete(k));
  pool=new Pool({connectionString:url.toString(),ssl:{ca:SUPABASE_ROOT_CA,rejectUnauthorized:true},max:1,connectionTimeoutMillis:10000,query_timeout:50000,statement_timeout:45000});
  client=await pool.connect();const target=async(s:string,p:any[]=[])=> (await client.query(s,p)).rows;
  await installReplicaJournal(query,'neon');await installReplicaJournal(target,'supabase');
  // The guard update waits for in-flight statement locks. A short write pause
  // gives the baseline and its acknowledged log one consistent boundary.
  await query("UPDATE ggl_replica.node SET mode='PAUSED',pause_until=clock_timestamp()+interval '240 seconds' WHERE singleton=true");
  let delivered=0;
  try {
    const pending=await query("SELECT sequence::text,transaction_id::text,id::text,table_name,operation,old_row::text,new_row::text FROM ggl_replica.outbox WHERE delivered_at IS NULL ORDER BY sequence");
    await archiveReplicaEvents(pending);
    await refreshReplicaContents(query,target);
    const [lease]=await query('SELECT pause_until>clock_timestamp() AS valid FROM ggl_replica.node WHERE singleton=true');
    if(!lease.valid) throw new Error('PREPARE_PAUSE_EXPIRED');
    if(pending.length) await query('UPDATE ggl_replica.outbox SET delivered_at=clock_timestamp() WHERE id=ANY($1::uuid[])',[pending.map(row=>row.id)]);
    delivered=pending.length;
  } finally {
    await query("UPDATE ggl_replica.node SET mode='LEGACY',pause_until=NULL WHERE singleton=true");
  }
  await query('UPDATE ggl_replica.node SET ready=true WHERE singleton=true');
  await target('UPDATE ggl_replica.node SET ready=true WHERE singleton=true');
  return {prepared:true,delivered,automaticFailoverEnabled:false};
}finally{client?.release();await pool?.end().catch(()=>{});}
}
