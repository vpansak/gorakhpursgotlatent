import fs from 'node:fs';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';
export function load(file, dependencies, globals = {}) {
  const source = fs.readFileSync(new URL('../../' + file, import.meta.url), 'utf8');
  const names = [...source.matchAll(/export (?:async )?(?:function|const) (\w+)/g)].map(match => match[1]);
  const compiled = stripTypeScriptTypes(source, { mode: 'strip' })
    .replace(/import \{([^}]+)\} from ['"]([^'"]+)['"];?/g, (_, members, name) => `const {${members}} = require(${JSON.stringify(name)});`)
    .replace(/export default [^;]+;/g, '')
    .replace(/export (?=(async )?(function|const))/g, '') + '\n' + names.map(name => `exports.${name} = ${name};`).join('\n');
  const exports = {};
  vm.runInNewContext(compiled, { exports, require: (name) => {
    if (!(name in dependencies)) throw new Error('Unexpected import: ' + name);
    return dependencies[name];
  }, global: {}, TextEncoder, TextDecoder, URL, Request, Response, console, setTimeout, clearTimeout, process: { env: {} }, ...globals });
  return exports;
}
