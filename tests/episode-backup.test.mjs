import test from 'node:test';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { load } from './helpers/load.mjs';
const backup = load('lib/episodeBackup.ts', {'node:zlib':zlib,'node:crypto':crypto},{Buffer});
test('ZIP retains exact JSON, multiline content and correct CRC', () => {
 const data=Buffer.from(JSON.stringify([{name:'Test गोरखपुर',mobile:'+919999999999',text:'line 1\nline 2'}]));
 const zip=backup.backupZip([{name:'01-Performers/records.json',data}]);
 assert.equal(zip.readUInt32LE(0),0x04034b50);
 const nameLength=zip.readUInt16LE(26);const size=zip.readUInt32LE(18);
 const unpacked=zlib.inflateRawSync(zip.subarray(30+nameLength,30+nameLength+size));
 assert.equal(unpacked.toString(),data.toString());assert.equal(backup.crc32(unpacked),zip.readUInt32LE(14));
 assert.equal(zip.readUInt32LE(zip.length-22),0x06054b50);assert.equal(zip.readUInt16LE(zip.length-12),1);
});
test('CSV quotes commas, multiline answers and nested fields and blocks formula execution',()=>{
 const csv=backup.backupCsv([{name:'A, B',mobile:'+91999',notes:'a\nb',extra:{role:'performer'},formula:'=HYPERLINK("x")'}]);
 assert.ok(csv.startsWith('\uFEFF'));assert.ok(csv.includes('"A, B"'));assert.ok(csv.includes("'+91999"));assert.ok(csv.includes("'=HYPERLINK"));assert.ok(csv.includes('a\nb'));
});
test('all eight categories are present and only team and talent trip are retained',()=>{
 assert.equal(backup.BACKUP_GROUPS.length,8);
 assert.deepEqual(Array.from(backup.BACKUP_GROUPS.filter(g=>g.keepOnWebsite),g=>g.table).sort(),['ggl_talent_trip_registrations','team_applications']);
});
test('unauthenticated backup requests return before reading any database',async()=>{
 const route=load('app/api/malik/episode-backup/route.ts',{'next/server':{NextResponse:{json:(body,init)=>Response.json(body,init)}},'@neondatabase/serverless':{neon:()=>{throw Error('Must not access DB')}},'@/lib/auth':{getSession:async()=>null},'@/lib/episodeBackup':backup,process:{env:{}}});
 assert.equal((await route.GET()).status,403);
});
