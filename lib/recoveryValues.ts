// Explicit transport tags prevent Buffer/Date/BigInt values from silently changing
// when operation intents and return values are persisted as JSON.
export function encodeRecoveryValue(value: any): any {
  if(value===null||value===undefined)return {kind:'null'};
  if(Buffer.isBuffer(value)||value instanceof Uint8Array)return {kind:'bytes',value:Buffer.from(value).toString('base64')};
  if(Object.prototype.toString.call(value)==='[object Date]')return {kind:'date',value:value.toISOString()};
  if(typeof value==='bigint')return {kind:'bigint',value:value.toString()};
  if(typeof value==='number') {if(!Number.isFinite(value))throw new Error('UNSUPPORTED_QUERY_NUMBER');return {kind:'number',value};}
  if(typeof value==='string'||typeof value==='boolean')return {kind:typeof value,value};
  if(Array.isArray(value))return {kind:'array',value:value.map(encodeRecoveryValue)};
  if(typeof value==='object')return {kind:'object',value:Object.entries(value).map(([key,item])=>[key,encodeRecoveryValue(item)])};
  throw new Error('UNSUPPORTED_QUERY_VALUE');
}
export function decodeRecoveryValue(value: any): any {
  switch(value?.kind){
    case 'null':return null;
    case 'bytes':return Buffer.from(value.value,'base64');
    case 'date':return new Date(value.value);
    case 'bigint':return BigInt(value.value);
    case 'number':case 'string':case 'boolean':return value.value;
    case 'array':return value.value.map(decodeRecoveryValue);
    case 'object':return Object.fromEntries(value.value.map(([key,item]:[string,any])=>[key,decodeRecoveryValue(item)]));
    default:throw new Error('INVALID_RECOVERY_VALUE');
  }
}
