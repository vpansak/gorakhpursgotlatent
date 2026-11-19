import { encodeRecoveryValue, decodeRecoveryValue } from './recoveryValues';

type NodeName='neon'|'supabase';
type Journal=ReturnType<typeof import('./recoveryJournal').createRecoveryJournal>;
type Node=ReturnType<typeof import('./recoveryNode').createRecoveryNode>;
type Lease=Awaited<ReturnType<Journal['acquire']>>;
type Store={read:(path:string)=>Promise<{value:any}|null>};
const other=(node:NodeName):NodeName=>node==='neon'?'supabase':'neon';

/** One externally fenced writer. The private journal publication is the commit point. */
export function createRecoveryCoordinator(journal:Journal,nodes:Record<NodeName,Node>,store:Store) {
  async function locked<T>(action:(lease:Lease)=>Promise<T>) {
    let lease:Lease|undefined;
    const deadline=Date.now()+60000;
    while(Date.now()<deadline) {
      try {lease=await journal.acquire();break;}
      catch(error){if(!['JOURNAL_BUSY','CONFLICT'].includes((error as any)?.code||(error as Error)?.message))throw error;await new Promise(resolve=>setTimeout(resolve,150+Math.floor(Math.random()*150)));}
    }
    if(!lease)throw new Error('RECOVERY_BUSY_RETRY');
    try {if(lease.state.status!=='READY')throw new Error('RECOVERY_NOT_READY');return await action(lease);}
    finally {await journal.release(lease).catch(()=>{});}
  }
  async function catchUp(lease:Lease,name:NodeName,limit=Number.POSITIVE_INFINITY) {
    const node=nodes[name];
    if(lease.state.nodes[name].dirty) {
      if(lease.state.pending?.touched.includes(name))throw new Error('UNRESOLVED_NODE_WRITE');
      const peer=other(name);
      if(lease.state.nodes[peer].dirty||lease.state.nodes[peer].applied!==lease.state.head)throw new Error('NO_CLEAN_RECOVERY_SOURCE');
      await journal.renew(lease);
      await node.rebuild(nodes[peer],lease.state.head,lease.state.fence);
    }
    let position=await node.position(lease.state.fence);
    if(position>lease.state.head)throw new Error('UNPUBLISHED_DATABASE_STATE');
    for(const entry of (await journal.entriesAfter(position)).slice(0,limit)) {
      await journal.renew(lease);
      const document=await store.read(entry.path);
      if(!document||document.value.sequence!==entry.sequence)throw new Error('RECOVERY_ENTRY_MISSING');
      await node.apply(document.value,lease.state.fence);position=entry.sequence;
    }
    if(lease.state.nodes[name].applied!==position||lease.state.nodes[name].dirty)await journal.markSynced(lease,name,position);
  }
  async function executePending(lease:Lease,name:NodeName,intent:any) {
    if(!lease.state.pending)throw new Error('NO_RECOVERY_INTENT');
    await catchUp(lease,name);
    const operation=lease.state.pending.id;
    await journal.touch(lease,name);
    try {
      const payload=await nodes[name].operation(operation,intent.sql,decodeRecoveryValue(intent.params) as any[],lease.state.head,lease.state.fence);
      await journal.commit(lease,name,payload);
      await nodes[name].published(operation).catch(()=>{});
      return nodes[name].decodeRows(payload);
    } catch(error) {
      if((error as any)?.rolledBack)await journal.abortTouch(lease,name);
      throw error;
    }
  }
  async function settle(lease:Lease) {
    const pending=lease.state.pending;
    if(!pending)return;
    const document=await store.read(pending.intentPath);
    if(!document||document.value.id!==pending.id)throw new Error('RECOVERY_INTENT_MISSING');
    for(const name of [...pending.touched]) {
      let payload:any;
      try {payload=await nodes[name].find(pending.id,lease.state.fence);}
      catch {continue;}
      if(payload) {
        await journal.commit(lease,name,payload);
        await nodes[name].published(pending.id).catch(()=>{});
        return;
      }
      await journal.abortTouch(lease,name);
    }
    const available=([lease.state.active,other(lease.state.active)] as NodeName[]).filter(name=>!lease.state.nodes[name].dirty);
    let last:unknown=new Error('NO_CLEAN_DATABASE');
    for(const name of available) {
      try {await executePending(lease,name,document.value.intent);return;}
      catch(error){last=error;}
    }
    throw last;
  }
  async function write(sql:string,params:any[]=[]) {
    return locked(async lease=>{
      await settle(lease);
      await journal.begin(lease,{sql,params:encodeRecoveryValue(params)});
      const preferred=lease.state.active;
      let last:unknown;
      for(const name of [preferred,other(preferred)]) {
        try {return await executePending(lease,name,{sql,params:encodeRecoveryValue(params)});}
        catch(error) {
          last=error;
          // Constraint/syntax/data errors are not outages and must not be replayed elsewhere.
          if(/^(22|23|42)/.test(String((error as any)?.code||''))) {
            if(!lease.state.pending?.touched.length)await journal.abortIntent(lease);
            throw error;
          }
        }
      }
      throw last;
    });
  }
  async function read(sql:string,params:any[]=[]) {
    const snapshot=await journal.read();
    if(snapshot.state.status==='READY'&&!snapshot.state.pending&&!snapshot.state.nodes[snapshot.state.active].dirty&&snapshot.state.nodes[snapshot.state.active].applied===snapshot.state.head) {
      try{return await nodes[snapshot.state.active].read(sql,params,snapshot.state.head);}catch{}
    }
    return locked(async lease=>{
      await settle(lease);
      let last:unknown;
      for(const name of [lease.state.active,other(lease.state.active)]) {
        try {
          await catchUp(lease,name);
          const rows=await nodes[name].read(sql,params,lease.state.head);
          if(name!==lease.state.active)await journal.switchActive(lease,name);
          return rows;
        }catch(error){last=error;}
      }
      throw last;
    });
  }
  async function recover() {
    return locked(async lease=>{
      await settle(lease);
      const results:Record<string,string>={};
      for(const name of [lease.state.active,other(lease.state.active)]) {
        try{await catchUp(lease,name,3);results[name]=lease.state.nodes[name].applied===lease.state.head&&!lease.state.nodes[name].dirty?'CAUGHT_UP':'PENDING';}catch{results[name]='PENDING';}
      }
      return {active:lease.state.active,head:lease.state.head,nodes:results,pending:Math.max(...Object.values(lease.state.nodes).map(node=>lease.state.head-node.applied))};
    });
  }
  return {read,write,recover};
}
