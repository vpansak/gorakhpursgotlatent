import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/load.mjs';
const visibility=load('lib/episodeVisibility.ts',{});
const old={id:'old',created_at:'2026-11-03T12:00:00Z'};
const fresh={id:'fresh',created_at:'2026-11-05T12:00:00Z'};
test('old website categories are archived while new Episode 3 submissions stay visible',()=>{
 for(const category of ['performer','sponsor','guest','tickets','orders','leads','computerji']){
  const rows=visibility.currentEpisodeRows([old,fresh],category);assert.equal(rows.length,1);assert.equal(rows[0].id,'fresh');
 }
 assert.equal(old.id,'old');assert.equal(old.created_at,'2026-11-03T12:00:00Z');
});
test('Join Team and all eight Talent Trip records are preserved without filtering',()=>{
 const team=[old,fresh]; const trip=Array.from({length:8},(_,id)=>({...old,id}));
 assert.equal(visibility.currentEpisodeRows(team,'team'),team);assert.equal(visibility.currentEpisodeRows(trip,'talentTrip'),trip);
 assert.equal(visibility.currentEpisodeRows(trip,'talentTrip').length,8);
});
test('old or missing timestamps do not revive historical entries; new scores on reused contestants do appear',()=>{
 assert.equal(visibility.currentEpisodeRows([{created_at:visibility.WEBSITE_ARCHIVE_BEFORE},{}],'performer').length,0);
 assert.equal(visibility.currentEpisodeRows([{...old,updated_at:fresh.created_at}],'computerji').length,1);
});
test('master export and polling use the same episode view, with team preserved and no writes',async()=>{
 const queries=load('lib/adminApplicationQueries.ts',{});
 const route=load('app/api/malik/applications/route.ts',{'next/server':{NextResponse:{json:(b,i)=>Response.json(b,i)}},'@/lib/episodeVisibility':visibility,'@/lib/adminApplicationQueries':queries,'@/lib/performerDetails':{ensurePerformerDetailsTable:async()=>{}},'@/lib/auth':{getSession:async()=>({role:'ADMIN'})},'@/lib/db':{db:{queryStrict:async(sql)=>{assert.doesNotMatch(sql,/DELETE|UPDATE|INSERT/);return [old,fresh]}}}});
 const all=await (await route.GET(new Request('https://test.invalid/?type=all'))).json();
 assert.equal(all.counts.performers,1);assert.equal(all.counts.sponsors,1);assert.equal(all.counts.guests,1);assert.equal(all.counts.team,2);
 const poll=await (await route.GET(new Request('https://test.invalid/?type=performer'))).json();assert.deepEqual(poll.items,all.data.performers);
});
