/** Server/build-only redaction: never import this policy into a client component. */
import policy from '../../scripts/source-redaction-policy.json';
const escape=(text:string)=>text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const externalPattern = new RegExp([
 ...policy.names.map(name=>[...name].map(escape).join('[\\s　]*')),
 ...policy.phrases.map(phrase=>phrase.split(/\s+/).map(escape).join('\\s*')),
].join('|'),'gi');
export function anonymizeSourceText(text:string):string {
 // Remove the complete private speaker credit (including transliterated aliases)
 // while retaining the original line count for source passage references.
 return text.replace(/^.*(?:主講人\/來源|講者介紹).*$/gm,line=>
  externalPattern.test(line)?(externalPattern.lastIndex=0,''): (externalPattern.lastIndex=0,line)
 ).replace(externalPattern,'').replace(/(?:醫師|營養師|博士)\s*[:：]\s*(?=\n|$)/g,'');
}
export function hasExternalAttribution(text:string):boolean {
 externalPattern.lastIndex=0;
 const found=externalPattern.test(text);
 externalPattern.lastIndex=0;
 return found;
}
export function anonymizeData<T>(value:T):T {
 if(typeof value==='string')return anonymizeSourceText(value) as T;
 if(Array.isArray(value))return value.map(item=>anonymizeData(item)) as T;
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,anonymizeData(item)])) as T;
 return value;
}
export function anonymizeGrounding<T extends {citations:{title:string;url:string}[];queries:string[];searchEntryHtml:string}>(value:T):T {
 const citations=value.citations.filter(c=>{
  try{return anonymizeSourceText(decodeURIComponent(c.url))===decodeURIComponent(c.url);}catch{return false;}
 }).map(c=>({...c,title:anonymizeSourceText(c.title)}));
 // Provider HTML can contain attributed snippets; the UI already supports plain
 // source links and search queries without rendering that optional HTML block.
 return {...value,citations,queries:value.queries.map(anonymizeSourceText),searchEntryHtml:''};
}
