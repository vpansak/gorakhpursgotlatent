// Runtime helpers may verify existing schema without contending for the writer.
// Actual schema migrations must be applied to both nodes explicitly.
export async function existingRecoverySchema(sql:string,read:(sql:string,params:any[])=>Promise<any[]>) {
  const text=sql.trim().replace(/;\s*$/,'');
  if(text.includes(';'))return false;
  const create=text.match(/^CREATE\s+(?:UNIQUE\s+)?(?:TABLE|INDEX)\s+IF\s+NOT\s+EXISTS\s+((?:public\.)?[a-zA-Z_][a-zA-Z0-9_]*)\b/i);
  if(create){const [row]=await read('SELECT to_regclass($1) IS NOT NULL AS present',[create[1].includes('.')?create[1]:`public.${create[1]}`]);return row?.present===true;}
  const alter=text.match(/^ALTER\s+TABLE\s+(?:public\.)?([a-zA-Z_][a-zA-Z0-9_]*)\s+/i);
  if(alter){
    const rest=text.slice(alter[0].length);
    const columns=[...rest.matchAll(/(?:^|,)\s*ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\s+([a-zA-Z_][a-zA-Z0-9_]*)\b/gi)].map(match=>match[1]);
    if(!columns.length||/\b(DROP|RENAME|ALTER|CONSTRAINT)\b/i.test(rest))return false;
    const [row]=await read('SELECT count(*)::int AS count FROM information_schema.columns WHERE table_schema=$1 AND table_name=$2 AND column_name=ANY($3::text[])',['public',alter[1],columns]);
    return row?.count===new Set(columns).size;
  }
  return false;
}
