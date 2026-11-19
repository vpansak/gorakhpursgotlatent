type Node = 'neon' | 'supabase';
type Entry = { sequence: number; path: string };
type Manifest = {
  version: 1; status: 'PREPARING' | 'READY'; active: Node; head: number; fence: number;
  nodes: Record<Node, { applied: number; dirty: boolean }>;
  lease: { owner: string; expires: number } | null;
  pending: { id: string; intentPath: string; touched: Node[] } | null;
  entries: Entry[]; previousBlock: string | null;
};
type Store = { read: (path:string)=>Promise<{value:any;etag:string}|null>; create:(path:string,value:unknown)=>Promise<string>; cas:(path:string,value:unknown,etag:string)=>Promise<string> };
type Lease = { state: Manifest; etag: string; owner: string };
const rootPath = 'ggl-recovery/control.json';

export function createRecoveryJournal(store: Store, options: { now?:()=>number; id?:()=>string; leaseMs?:number } = {}) {
  const now=options.now||Date.now, id=options.id||(()=>crypto.randomUUID()), leaseMs=options.leaseMs||60000;
  async function read() {
    const document=await store.read(rootPath);
    if (!document) throw new Error('JOURNAL_NOT_INITIALIZED');
    const state=document.value as Manifest;
    if (state.version!==1 || !Number.isSafeInteger(state.head) || state.head<0 || !Number.isSafeInteger(state.fence) || state.fence<0 || !['PREPARING','READY'].includes(state.status) || !['neon','supabase'].includes(state.active) || !state.nodes?.neon || !state.nodes?.supabase) throw new Error('INVALID_JOURNAL_MANIFEST');
    return {state,etag:document.etag};
  }
  async function assertLease(lease: Lease) {
    const current=await read();
    if(current.state.lease?.owner!==lease.owner || current.state.lease.expires<=now() || current.etag!==lease.etag) throw new Error('JOURNAL_LEASE_LOST');
  }
  async function update(lease: Lease, state: Manifest) {
    await assertLease(lease);
    try { lease.etag=await store.cas(rootPath,state,lease.etag); lease.state=state; }
    catch(error) { if((error as {code?:string})?.code==='CONFLICT') throw new Error('JOURNAL_LEASE_LOST'); throw error; }
  }
  async function initialize() {
    const state: Manifest={version:1,status:'PREPARING',active:'neon',head:0,fence:0,nodes:{neon:{applied:0,dirty:false},supabase:{applied:0,dirty:false}},lease:null,pending:null,entries:[],previousBlock:null};
    try { await store.create(rootPath,state); }
    catch(error) { if((error as {code?:string})?.code!=='CONFLICT') throw error; }
    return read();
  }
  async function acquire() {
    const current=await read();
    if(current.state.lease && current.state.lease.expires>now()) throw new Error('JOURNAL_BUSY');
    const owner=id();
    const state={...current.state,fence:current.state.fence+1,lease:{owner,expires:now()+leaseMs}};
    const etag=await store.cas(rootPath,state,current.etag);
    return {owner,state,etag} as Lease;
  }
  async function renew(lease:Lease) {await update(lease,{...lease.state,lease:{owner:lease.owner,expires:now()+leaseMs}});}
  async function begin(lease:Lease,intent:unknown) {
    if(lease.state.status!=='READY') throw new Error('JOURNAL_NOT_READY');
    if(lease.state.pending) throw new Error('JOURNAL_PENDING_RECOVERY_REQUIRED');
    const operation=id(), intentPath=`ggl-recovery/intents/${operation}.json`;
    await assertLease(lease);
    await store.create(intentPath,{id:operation,intent,createdAt:now()});
    await update(lease,{...lease.state,pending:{id:operation,intentPath,touched:[]}});
    return operation;
  }
  async function touch(lease:Lease,node:Node) {
    if(!lease.state.pending) throw new Error('JOURNAL_NO_PENDING_OPERATION');
    const pending={...lease.state.pending,touched:[...new Set([...lease.state.pending.touched,node])]};
    await update(lease,{...lease.state,pending,nodes:{...lease.state.nodes,[node]:{...lease.state.nodes[node],dirty:true}}});
  }
  async function commit(lease:Lease,node:Node,payload:unknown) {
    const pending=lease.state.pending;
    if(!pending || !pending.touched.includes(node)) throw new Error('JOURNAL_OPERATION_NOT_STARTED');
    await assertLease(lease);
    const sequence=lease.state.head+1, pathname=`ggl-recovery/entries/${sequence}-${lease.owner}-${id()}.json`;
    await store.create(pathname,{sequence,operation:pending.id,node,payload,committedAt:now()});
    let previousBlock=lease.state.previousBlock, entries=[...lease.state.entries];
    if(entries.length>=128) {
      const block=`ggl-recovery/index/${entries[0].sequence}-${lease.owner}-${id()}.json`;
      await store.create(block,{entries,previousBlock}); previousBlock=block; entries=[];
    }
    entries.push({sequence,path:pathname});
    const nodes={...lease.state.nodes,[node]:{applied:sequence,dirty:false}};
    // Publication is the commit point. A DB write alone must never produce success.
    await update(lease,{...lease.state,active:node,head:sequence,nodes,pending:null,entries,previousBlock});
    return sequence;
  }
  async function markSynced(lease:Lease,node:Node,sequence:number) {
    if(lease.state.pending?.touched.includes(node)) throw new Error('NODE_HAS_UNRESOLVED_WRITE');
    if(!Number.isSafeInteger(sequence)||sequence<lease.state.nodes[node].applied || sequence>lease.state.head) throw new Error('INVALID_REPLICA_POSITION');
    await update(lease,{...lease.state,nodes:{...lease.state.nodes,[node]:{applied:sequence,dirty:false}}});
  }
  async function abortTouch(lease:Lease,node:Node) {
    // The executor must prove rollback/absence of a committed operation while
    // holding this node's DB fencing lock before invoking this method.
    if(!lease.state.pending) throw new Error('JOURNAL_NO_PENDING_OPERATION');
    await update(lease,{...lease.state,pending:{...lease.state.pending,touched:lease.state.pending.touched.filter(n=>n!==node)},nodes:{...lease.state.nodes,[node]:{...lease.state.nodes[node],dirty:false}}});
  }
  async function abortIntent(lease:Lease) {
    if(!lease.state.pending || lease.state.pending.touched.length) throw new Error('JOURNAL_UNRESOLVED_DATABASE_WRITE');
    await update(lease,{...lease.state,pending:null});
  }
  async function switchActive(lease:Lease,node:Node) {
    if(lease.state.pending || lease.state.nodes[node].dirty || lease.state.nodes[node].applied!==lease.state.head) throw new Error('REPLICA_NOT_READY');
    await update(lease,{...lease.state,active:node});
  }
  async function activate(lease:Lease) {
    if(lease.state.pending || Object.values(lease.state.nodes).some(node=>node.dirty||node.applied!==lease.state.head)) throw new Error('REPLICA_NOT_READY');
    await update(lease,{...lease.state,status:'READY'});
  }
  async function release(lease:Lease) {
    const current=await read();
    if(current.state.lease?.owner!==lease.owner) return false;
    await store.cas(rootPath,{...current.state,lease:null},current.etag);
    return true;
  }
  async function entriesAfter(sequence:number) {
    const {state}=await read();
    if(!Number.isSafeInteger(sequence)||sequence<0||sequence>state.head) throw new Error('INVALID_REPLICA_POSITION');
    if(sequence===state.head)return [];
    const entries=[...state.entries]; let block=state.entries[0]?.sequence<=sequence+1?null:state.previousBlock;
    while(block) {
      const document=await store.read(block);
      if(!document || !Array.isArray(document.value.entries)) throw new Error('JOURNAL_INDEX_MISSING');
      entries.unshift(...document.value.entries);
      if(document.value.entries[0]?.sequence<=sequence) break;
      block=document.value.previousBlock;
    }
    const requested=entries.filter(entry=>entry.sequence>sequence).sort((a,b)=>a.sequence-b.sequence);
    if(requested.length && (requested[0].sequence!==sequence+1 || requested.at(-1)?.sequence!==state.head)) throw new Error('JOURNAL_SEQUENCE_GAP');
    for(let i=1;i<requested.length;i++) if(requested[i].sequence!==requested[i-1].sequence+1) throw new Error('JOURNAL_SEQUENCE_GAP');
    return requested;
  }
  return {read,initialize,acquire,begin,touch,commit,markSynced,activate,release,entriesAfter,assertLease,renew,abortTouch,abortIntent,switchActive};
}
