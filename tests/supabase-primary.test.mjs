import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/load.mjs';
function primary(fail=false){
 const calls=[];
 const database=load('lib/db.ts',{
  './directDatabase':{queryPrimaryDatabase:async(sql,params)=>{calls.push({sql,params});if(fail)throw new Error('database offline');return [{id:'saved'}];}},
  './recoveryRuntime':{managedRecoveryReady:async()=>{throw new Error('Blob must not be accessed');}},
  './startReplicaWorker':{startReplicaWorker:async()=>{throw new Error('No legacy worker');}},
  '@neondatabase/serverless':{neon:()=>{throw new Error('No Neon query');}},
  './replicaMirror':{archiveReplicaEvents:async()=>{throw new Error('No Blob archive');}},
  './scheduleReplicaMirror':{scheduleReplicaMirror:()=>{throw new Error('No mirror');}},
 },{process:{env:{GGL_PRIMARY_DATABASE:'supabase',GGL_RECOVERY_ENABLED:'1',GGL_REPLICA_SYNC_ENABLED:'1'}}});
 return {database,calls};
}
test('Supabase primary saves and admin reads share one source without Blob, Neon, schema seeding or replication',async()=>{
 const f=primary();await f.database.queryStrict('INSERT INTO performer_applications(id) VALUES(?) RETURNING id',['saved']);
 assert.equal((await f.database.queryStrict('SELECT id FROM performer_applications'))[0].id,'saved');
 assert.equal(f.calls.length,2);assert.match(f.calls[0].sql,/\$1/);
});
test('Supabase primary failure never retries an uncertain mutation or returns a successful empty application',async()=>{
 const f=primary(true);await assert.rejects(f.database.query('INSERT INTO performer_applications(id) VALUES(?)',['saved']),/offline/);assert.equal(f.calls.length,1);
});
test('cutover rejects lost rows, changed content, pending changes and mismatched log positions',()=>{
 const {verifyCutoverCopies}=load('lib/directDatabase.ts',{'pg':{},'./supabaseTls':{}});
 const source={provider:'neon',state:{position:'63'},operations:63,pending:0,tables:[{table:'performer_applications',count:133,fingerprint:'same'}]};
 const target={...source,provider:'supabase'};
 assert.equal(verifyCutoverCopies([source,target]).performers,133);
 assert.throws(()=>verifyCutoverCopies([source,{...target,state:{position:'62'}}]),/UNSYNCED/);
 assert.throws(()=>verifyCutoverCopies([source,{...target,pending:1}]),/UNSYNCED/);
 assert.throws(()=>verifyCutoverCopies([source,{...target,tables:[{table:'performer_applications',count:133,fingerprint:'changed'}]}]),/CONTENT/);
});
