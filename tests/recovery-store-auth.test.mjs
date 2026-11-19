import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/load.mjs';
test('journal explicitly uses its project credential instead of implicit request OIDC and disables read deduplication',async()=>{
 const calls=[];
 const {recoveryJournalStore}=load('lib/recoveryJournalStore.ts',{'@vercel/blob':{
  BlobPreconditionFailedError:class extends Error{},
  get:async(path,options)=>{calls.push(options);return{statusCode:200,stream:new Response('{"head":1}').body,blob:{etag:'etag'}};},
  put:async(path,body,options)=>{calls.push(options);return{etag:'new-etag'};},
 }},{AbortSignal,process:{env:{BLOB_READ_WRITE_TOKEN:'project-read-write-test',VERCEL_OIDC_TOKEN:'different-request-credential'}}});
 const store=recoveryJournalStore();assert.equal((await store.read('ggl-recovery/control.json')).value.head,1);
 await store.create('ggl-recovery/example.json',{head:1});await store.cas('ggl-recovery/control.json',{head:2},'etag');
 for(const options of calls)assert.equal(options.token,'project-read-write-test');
 assert.equal(calls[0].useCache,false);assert.ok(calls[0].abortSignal);assert.equal(calls[0].headers['accept-encoding'],'identity');assert.equal(calls[2].ifMatch,'etag');
});
