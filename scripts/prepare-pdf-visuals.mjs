import {readFileSync,writeFileSync,existsSync,mkdirSync,copyFileSync,cpSync} from 'node:fs';
import {createHash} from 'node:crypto';
const source=JSON.parse(readFileSync('src/data/pdf-source-index.json','utf8'));
const manual=JSON.parse(readFileSync('src/data/visual-page-curation.json','utf8'));
const ai=existsSync('src/data/visual-ai-captions.json')?JSON.parse(readFileSync('src/data/visual-ai-captions.json','utf8')):{};
const captions={...ai,...manual};
const decks=source.decks.map(d=>{
 const file=`public${d.fileUrl}`;
 if(!existsSync(file)||createHash('sha256').update(readFileSync(file)).digest('hex')!==d.sha256)throw new Error(`Missing/changed original PDF: ${d.id}`);
 return {...d,pages:d.pages.map(({text,textMethod,...p})=>{
  const c=captions[p.id];if(!c)throw new Error(`Missing page-specific caption: ${p.id}; generate and review it before publishing.`);
  if(!existsSync(`public${p.image}`)||!existsSync(`public${p.thumbnail}`))throw new Error(`Missing slide: ${p.id}; run npm run visuals:extract`);
  return {...p,title:c.title,caption:c.caption,captionMethod:manual[p.id]?'editorial':ai[p.id]?'gemini-3.8-flash':'topic-guide'};
 })};
});
const result={version:1,dpi:200,publication:'original-pdfs-authorized',pageCount:decks.reduce((sum,d)=>sum+d.pageCount,0),figureCount:decks.reduce((sum,d)=>sum+d.figures.length,0),decks};
writeFileSync('src/data/visual-assets-manifest.json',JSON.stringify(result,null,2)+'\n');
mkdirSync('public/pdfjs',{recursive:true});
copyFileSync('node_modules/pdfjs-dist/build/pdf.worker.min.mjs','public/pdfjs/pdf.worker.min.mjs');
copyFileSync('node_modules/pdfjs-dist/LICENSE','public/pdfjs/LICENSE');
console.log(`Prepared ${decks.length} original PDFs, ${result.pageCount} slides, ${result.figureCount} embedded images and PDF.js worker.`);

for(const folder of ['cmaps','standard_fonts','wasm'])cpSync(`node_modules/pdfjs-dist/${folder}`,`public/pdfjs/${folder}`,{recursive:true});
