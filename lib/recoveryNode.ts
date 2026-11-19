import { createHash } from 'node:crypto';
import { replicaTables, applyReplicaEvents, refreshReplicaContents, alignReplicaSequences } from './replicaJournal';
import { encodeRecoveryValue, decodeRecoveryValue } from './recoveryValues';

type Query = (sql:string,params?:any[])=>Promise<Record<string,any>[]>;
type Connection = { query:Query; close:()=>Promise<void> };
type Store = { create:(path:string,value:unknown)=>Promise<string> };
export function createRecoveryNode(name:'neon'|'supabase',open:()=>Promise<Connection>,store:Store) {
  async function transaction<T>(fence:number,callback:(query:Query,state:{position:number;fence:number})=>Promise<T>) {
    const connection=await open();let commitSent=false;
    try {
      await connection.query('BEGIN');
      await connection.query('SELECT pg_advisory_xact_lock(714033921)');
      const [row]=await connection.query('SELECT position::text,fence::text FROM ggl_replica.ledger_state WHERE singleton=true FOR UPDATE');
      if(!row||!Number.isSafeInteger(fence)||Number(row.fence)>fence)throw new Error('DATABASE_WRITER_FENCED');
      await connection.query('UPDATE ggl_replica.ledger_state SET fence=$1 WHERE singleton=true',[fence]);
      await connection.query("SET LOCAL TIME ZONE 'UTC'");
      const result=await callback(connection.query,{position:Number(row.position),fence:Number(row.fence)});
      commitSent=true;await connection.query('COMMIT');return result;
    } catch(error) {
      let rolledBack=false;
      try {await connection.query('ROLLBACK');rolledBack=!commitSent;}catch{}
      if(error&&typeof error==='object')Object.assign(error,{rolledBack});
      throw error;
    } finally {await connection.close();}
  }
  async function read(sql:string,params:any[],position:number) {
    const connection=await open();
    try {
      await connection.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
      const [state]=await connection.query('SELECT position::text FROM ggl_replica.ledger_state WHERE singleton=true');
      if(Number(state?.position)!==position)throw new Error('DATABASE_POSITION_MISMATCH');
      const rows=await connection.query(sql,params);
      await connection.query('COMMIT');return rows;
    } catch(error) {await connection.query('ROLLBACK').catch(()=>{});throw error;}
    finally {await connection.close();}
  }
  async function operation(id:string,sql:string,params:any[],position:number,fence:number) {
    const hash=createHash('sha256').update(JSON.stringify({sql,params:encodeRecoveryValue(params)})).digest('hex');
    return transaction(fence,async(query,state)=>{
      const [existing]=await query('SELECT sql_hash,payload FROM ggl_replica.operations WHERE id=$1::uuid',[id]);
      if(existing){if(existing.sql_hash!==hash)throw new Error('OPERATION_ID_REUSED');return existing.payload;}
      if(state.position!==position)throw new Error('DATABASE_POSITION_MISMATCH');
      await query("SELECT set_config('ggl_replica.operation_id',$1,true)",[id]);
      const rows=await query(sql,params);
      const events=await query('SELECT id::text,table_name,operation,old_row::text,new_row::text FROM ggl_replica.outbox WHERE operation_id=$1::uuid ORDER BY sequence',[id]);
      const payload={sqlHash:hash,rows:encodeRecoveryValue(rows),events};
      await query('INSERT INTO ggl_replica.operations(id,sql_hash,payload) VALUES($1::uuid,$2,$3::jsonb)',[id,hash,JSON.stringify(payload)]);
      await query('UPDATE ggl_replica.ledger_state SET position=$1 WHERE singleton=true',[position+1]);
      return payload;
    });
  }
  async function find(id:string,fence:number) {
    return transaction(fence,async(query)=>{
      const [row]=await query('SELECT payload FROM ggl_replica.operations WHERE id=$1::uuid',[id]);
      return row?.payload||null;
    });
  }
  async function apply(record:any,fence:number) {
    return transaction(fence,async(query,state)=>{
      if(state.position>=record.sequence)return;
      if(state.position!==record.sequence-1)throw new Error('DATABASE_JOURNAL_GAP');
      await query("SELECT set_config('ggl_replica.apply','on',true)");
      await query('SET CONSTRAINTS ALL DEFERRED');
      await applyReplicaEvents(query,record.payload.events);
      await alignReplicaSequences(query,[...new Set<string>(record.payload.events.map((event:any)=>event.table_name))]);
      await query(`INSERT INTO ggl_replica.operations(id,sql_hash,payload) VALUES($1::uuid,$2,$3::jsonb)
        ON CONFLICT(id) DO UPDATE SET sql_hash=EXCLUDED.sql_hash,payload=EXCLUDED.payload`,[record.operation,record.payload.sqlHash,JSON.stringify(record.payload)]);
      await query('UPDATE ggl_replica.ledger_state SET position=$1 WHERE singleton=true',[record.sequence]);
    });
  }
  async function position(fence:number) {return transaction(fence,async(_query,state)=>state.position);}
  async function published(id:string) {
    const connection=await open();
    try{await connection.query('UPDATE ggl_replica.outbox SET delivered_at=clock_timestamp() WHERE operation_id=$1::uuid',[id]);}
    finally{await connection.close();}
  }
  async function rebuild(peer:ReturnType<typeof createRecoveryNode>,position:number,fence:number) {
    await transaction(fence,async()=>{}); // Fence out a delayed worker before inspecting local data.
    const local=await open();
    try {
      // Keep an independent private copy of unpublished local changes before replacing
      // a dirty replica. Nothing is silently thrown away during uncertain-commit recovery.
      const tables=await replicaTables(local.query);
      const label=(value:string)=>"'"+value.replace(/'/g,"''")+"'";
      const [snapshot]=await local.query(`SELECT jsonb_build_object(${tables.map(t=>`${label(t.name)},(SELECT COALESCE(jsonb_agg(to_jsonb(r)),'[]'::jsonb)::text FROM public."${t.name.replace(/"/g,'""')}" r)`).join(',')}) AS data`);
      const archive=`ggl-recovery/quarantine/${name}-${fence}-${crypto.randomUUID()}.json`;
      await store.create(archive,{node:name,position,fence,tables,data:snapshot.data});
      await peer.snapshotTransaction(fence,async(source)=>{
        await local.query('UPDATE ggl_replica.node SET active_node=$1 WHERE singleton=true',[peer.name]);
        await refreshReplicaContents(source,local.query,{allowQuarantinedWrites:true});
        await alignReplicaSequences(local.query);
      });
      await transaction(fence,async(query)=>{await query('UPDATE ggl_replica.ledger_state SET position=$1 WHERE singleton=true',[position]);});
      return archive;
    } finally {await local.close();}
  }
  async function snapshotTransaction<T>(fence:number,callback:(query:Query)=>Promise<T>) {
    return transaction(fence,async(query)=>callback(query));
  }
  return {name,read,operation,find,apply,position,published,rebuild,snapshotTransaction,decodeRows:(payload:any)=>decodeRecoveryValue(payload.rows)};
}
