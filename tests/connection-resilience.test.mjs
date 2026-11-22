import test from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {load} from './helpers/load.mjs';
function fixture({failQuery=false,failRollback=false}={}) {
 const state={pools:[],queries:[],releases:[],warnings:[]};
 class Pool extends EventEmitter {
  constructor(config){super();this.config=config;state.pools.push(this);}
  async connect(){return {
   query:async(sql)=>{state.queries.push(sql);
    if(sql==='ROLLBACK'&&failRollback)throw new Error('connection lost');
    if(sql.startsWith('SELECT mode'))return {rows:[{mode:'SUPABASE_PRIMARY'}]};
    if(sql.startsWith('INSERT')&&failQuery)throw new Error('uncertain write');
    return {rows:[{id:'application'}]};
   },
   release:destroy=>state.releases.push(destroy)
  };}
 }
 const api=load('lib/directDatabase.ts',{'pg':{Pool},'./supabaseTls':{SUPABASE_ROOT_CA:'test-ca'}},{
  process:{env:{SUPABASE_DATABASE_URL:'postgresql://user:private@aws-0-region.pooler.supabase.com:6543/postgres'}},
  console:{warn:(...args)=>state.warnings.push(args)}
 });
 return {api,state};
}
test('idle connection failures are handled without throwing or leaking connection credentials',async()=>{
 const {api,state}=fixture();const c=await api.openDirectDatabase('supabase');c.close();
 assert.equal(state.pools[0].config.ssl.rejectUnauthorized,true);
 assert.doesNotThrow(()=>state.pools[0].emit('error',Object.assign(new Error('postgres://user:SECRET@private-host'),{code:'ECONNRESET'})));
 assert.equal(state.warnings.length,1);assert.doesNotMatch(JSON.stringify(state.warnings),/SECRET|private-host|postgres:/);
});
test('failed rollback destroys its connection and does not retry an uncertain mutation',async()=>{
 const {api,state}=fixture({failQuery:true,failRollback:true});
 await assert.rejects(api.queryPrimaryDatabase('INSERT INTO performer_applications VALUES ($1)',['test']),/uncertain write/);
 assert.equal(state.queries.filter(q=>q.startsWith('INSERT')).length,1);assert.deepEqual(state.releases,[true]);
});
test('ordinary SQL failure rolls back and releases cleanly; successful writes commit once',async()=>{
 const first=fixture({failQuery:true});await assert.rejects(first.api.queryPrimaryDatabase('INSERT INTO settings VALUES ($1)',['test']),/uncertain write/);
 assert.deepEqual(first.state.releases,[false]);assert.equal(first.state.queries.at(-1),'ROLLBACK');
 const second=fixture();await second.api.queryPrimaryDatabase('INSERT INTO settings VALUES ($1)',['test']);
 assert.equal(second.state.queries.at(-1),'COMMIT');assert.deepEqual(second.state.releases,[false]);
});
