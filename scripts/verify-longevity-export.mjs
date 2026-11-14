import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const decks=JSON.parse(readFileSync('src/data/longevity-decks-manifest.json','utf8'));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
let count=0;
for(const deck of decks) for(const slide of deck.slides){
  const file=join('out',slide.image);
  if(hash(readFileSync(file))!==slide.assetSha256) throw new Error(`Missing or stale public diagram: ${file}`);
  count++;
}
function scan(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?scan(join(dir,entry.name)):[join(dir,entry.name)]);}
for(const file of scan('out')){
  if(/\.pdf$/i.test(file)) throw new Error(`Original PDF must not be exported: ${file}`);
  if(/\.(?:html|js|json|svg)$/.test(file)&&/歐瀚文|王偉全|歐忠儒|洪佳琪|劉士銘|王凱瑜/.test(readFileSync(file,'utf8'))) throw new Error(`Original presenter attribution leaked into public export: ${file}`);
}
console.log(`Verified ${count} exported redrawn diagrams; no original PDFs or presenter names in the website export.`);
