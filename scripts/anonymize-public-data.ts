import {readdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {anonymizeData,anonymizeSourceText,hasExternalAttribution} from '../src/lib/public-copy';

const generatedByExtractor=new Set(['src/data/pdf-source-index.json','src/data/visual-assets-manifest.json']);
async function files(folder:string):Promise<string[]> {
 const result:string[]=[];
 for(const entry of await readdir(folder,{withFileTypes:true})){
  const path=join(folder,entry.name);
  if(entry.isDirectory())result.push(...await files(path));
  else if(/\.(?:json|tsx?|md)$/.test(entry.name))result.push(path);
 }
 return result;
}
let changed=0;
for(const path of await files('src/data')){
 if(generatedByExtractor.has(path))continue;
 const before=await readFile(path,'utf8');
 if(!hasExternalAttribution(before))continue;
 const after=path.endsWith('.json')?JSON.stringify(anonymizeData(JSON.parse(before)),null,2)+'\n':anonymizeSourceText(before);
 if(after!==before){await writeFile(path,after);changed++;}
}
if(!process.argv.includes('--prepare')){
 for(const path of await files('src')){
  if(hasExternalAttribution(await readFile(path,'utf8')))throw new Error(`External attribution remains in ${path}`);
 }
}
console.log(`Public copy anonymized in ${changed} files; private source documents remain unchanged${process.argv.includes('--prepare')?' (extraction verification deferred)':''}.`);
