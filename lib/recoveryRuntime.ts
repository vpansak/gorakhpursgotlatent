import { startReplicaWorker } from './startReplicaWorker';
import { Pool } from 'pg';
import { createRecoveryJournal } from './recoveryJournal';
import { recoveryJournalStore } from './recoveryJournalStore';
import { createRecoveryNode } from './recoveryNode';
import { createRecoveryCoordinator } from './recoveryCoordinator';
import { SUPABASE_ROOT_CA } from './supabaseTls';

const pools:Partial<Record<'neon'|'supabase',Pool>>={};
export function recoveryRuntime() {
  const store=recoveryJournalStore();
  const journal=createRecoveryJournal(store,{leaseMs:90000});
  function node(name:'neon'|'supabase') {
    return createRecoveryNode(name,async()=>{
      if(!pools[name]) {
        const raw=process.env[name==='neon'?'DATABASE_URL':'SUPABASE_DATABASE_URL'];
        if(!raw)throw new Error('DATABASE_NOT_CONFIGURED');
        const url=new URL(raw);
        if(name==='supabase'&&!url.hostname.endsWith('.supabase.com')&&!url.hostname.endsWith('.supabase.co'))throw new Error('INVALID_REPLICA_HOST');
        if(name==='neon'&&!url.hostname.endsWith('.neon.tech'))throw new Error('INVALID_PRIMARY_HOST');
        ['sslmode','sslcert','sslkey','sslrootcert'].forEach(key=>url.searchParams.delete(key));
        pools[name]=new Pool({connectionString:url.toString(),ssl:name==='supabase'?{ca:SUPABASE_ROOT_CA,rejectUnauthorized:true}:{rejectUnauthorized:true},max:2,connectionTimeoutMillis:5000,query_timeout:25000,statement_timeout:20000,idleTimeoutMillis:10000,allowExitOnIdle:true});
      }
      const client=await pools[name]!.connect();
      return {query:async(sql:string,params:any[]=[]) => (await client.query(sql,params)).rows,close:async()=>{client.release();}};
    },store);
  }
  const nodes={neon:node('neon'),supabase:node('supabase')};
  return {store,journal,nodes,coordinator:createRecoveryCoordinator(journal,nodes,store)};
}
export async function managedRecoveryReady() {
  if(process.env.GGL_RECOVERY_ENABLED!=='1')return false;
  const document=await recoveryJournalStore().read('ggl-recovery/control.json');
  if(!document)return false;
  if(document.value.status!=='READY')throw new Error('Database recovery cutover in progress. Please retry shortly.');
  return true;
}
export async function executeManagedQuery(sql:string,params:any[]) {
  const {coordinator}=recoveryRuntime();
  if(!/^\s*(SELECT|SHOW|EXPLAIN)\b/i.test(sql))await startReplicaWorker('managed');
  return /^\s*(SELECT|SHOW|EXPLAIN)\b/i.test(sql)?coordinator.read(sql,params):coordinator.write(sql,params);
}
