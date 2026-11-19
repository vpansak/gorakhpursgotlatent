import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from './helpers/load.mjs';
function fixture(failArchive=false){
  const state={transactions:0,archived:false,scheduled:0};
  const client={query(sql,params){const promise=Promise.resolve([]);promise.sql=sql;promise.params=params;return promise;},async transaction(queries){state.transactions++;assert.match(queries[1].sql,/transaction_id=txid_current/);return[[{app_id:'new-app'}],[{id:'event',new_row:'full details'}]];}};
  const db=load('lib/db.ts',{
    './recoveryRuntime':{managedRecoveryReady:async()=>false,executeManagedQuery:async()=>{throw new Error('Unexpected managed call');}},
    './directDatabase':{queryPrimaryDatabase:async()=>{throw new Error('Unexpected primary call');}},
    './startReplicaWorker':{startReplicaWorker:async()=> 'test-run'},
    '@neondatabase/serverless':{neon:()=>client},
    './replicaMirror':{archiveReplicaEvents:async(events)=>{assert.equal(events.length,1);if(failArchive)throw new Error('archive offline');state.archived=true;}},
    './scheduleReplicaMirror':{scheduleReplicaMirror:()=>{assert.ok(state.archived);state.scheduled++;}},
  },{process:{env:{DATABASE_URL:'postgresql://user:test@neon.invalid/db',GGL_REPLICA_SYNC_ENABLED:'1'}}});
  return{db,state};
}
test('save and change capture are atomic; private archive completes before successful response',async()=>{
  const f=fixture();const result=await f.db.pool.query('INSERT INTO performer_applications(id) VALUES($1) RETURNING app_id',['new-app']);
  assert.equal(result.rows[0].app_id,'new-app');assert.ok(f.state.archived);assert.equal(f.state.scheduled,1);assert.equal(f.state.transactions,1);
});
test('archive failure never returns a successful empty write or blindly reruns committed mutation',async()=>{
  const f=fixture(true);await assert.rejects(f.db.pool.query('UPDATE performer_applications SET status=$1',['SUBMITTED']),/archive offline/);
  assert.equal(f.state.transactions,1);assert.equal(f.state.scheduled,0);
});
test('managed application saves and admin reads use shared routing even when Neon client is unavailable',async()=>{
  const calls=[];
  const database=load('lib/db.ts',{
    './recoveryRuntime':{managedRecoveryReady:async()=>true,executeManagedQuery:async(sql,params)=>{calls.push({sql,params});return [{app_id:'managed-app'}];}},
    './directDatabase':{queryPrimaryDatabase:async()=>{throw new Error('Unexpected primary call');}},
    './startReplicaWorker':{startReplicaWorker:async()=> 'run'},
    '@neondatabase/serverless':{neon:()=>{throw new Error('Must not use Neon directly');}},
    './replicaMirror':{archiveReplicaEvents:async()=>{}},
    './scheduleReplicaMirror':{scheduleReplicaMirror:()=>{}},
  },{process:{env:{GGL_RECOVERY_ENABLED:'1'}}});
  await database.queryStrict('INSERT INTO performer_applications(id) VALUES(?)',['app']);
  const rows=await database.queryStrict('SELECT * FROM performer_applications');
  assert.equal(rows[0].app_id,'managed-app');assert.match(calls[0].sql,/\$1/);assert.match(calls[1].sql,/SELECT/);
});
