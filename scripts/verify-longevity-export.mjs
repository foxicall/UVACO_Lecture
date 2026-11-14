import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
const manifest=JSON.parse(readFileSync('src/data/visual-assets-manifest.json','utf8'));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
let count=0,figures=0;
for(const deck of manifest.decks){
 if(hash(readFileSync(join('out',deck.fileUrl)))!==deck.sha256)throw new Error(`Reviewed PDF changed: ${deck.id}`);
 for(const page of deck.pages){if(hash(readFileSync(join('out',page.image)))!==page.sha256)throw new Error(`Missing/changed page: ${page.id}`);readFileSync(join('out',page.thumbnail));count++;}
 for(const figure of deck.figures){if(hash(readFileSync(join('out',figure.image)))!==figure.sha256)throw new Error(`Missing/changed embedded image: ${figure.id}`);figures++;}
}
if(readdirSync('out/pdfs').length!==manifest.decks.length)throw new Error('Unexpected public PDF');
readFileSync('out/pdfjs/pdf.worker.min.mjs');
console.log(`Verified ${manifest.decks.length} reviewed science PDFs, ${count} pages and ${figures} embedded images. Public assets follow the anonymous science publication policy.`);
