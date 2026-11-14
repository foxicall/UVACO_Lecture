import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {DOMParser} from '@xmldom/xmldom';
import {longevityDecks} from '../src/data/longevity-decks-manifest';
import privateIndex from '../src/data/longevity-private-index.json';
import {sourceAuthorNames} from '../src/data/clinical-sources';
import {products} from '../src/data/uvaco-products';

test('five uploaded PDFs preserve exact bytes and 233 source pages; missing deck two remains explicit',async()=>{
 assert.equal(privateIndex.filter(r=>r.pdf).length,5);
 assert.equal(privateIndex.reduce((n,r)=>n+r.pageCount,0),233);
 for(const source of privateIndex){
  assert.equal(createHash('sha256').update(await readFile(source.markdown)).digest('hex'),source.markdownSha256);
  if(source.pdf)assert.equal(createHash('sha256').update(await readFile(source.pdf)).digest('hex'),source.sha256);
 }
 assert.equal(longevityDecks[1].pdfAvailable,false);assert.ok(longevityDecks[1].sourceStatus.includes('尚未提供'));
});
test('all 22 public diagrams are safe, attributable reconstructions with valid page and product destinations',async()=>{
 assert.deepEqual(longevityDecks.map(d=>d.slides.length),[4,3,4,4,3,4]);
 const linked=new Set<string>();
 for(const deck of longevityDecks){
  assert.equal((await readdir(`public/longevity-pdf-assets/deck-${deck.number}`)).length,deck.slides.length);
  for(const slide of deck.slides){
   const bytes=await readFile(`public${slide.image}`);const svg=bytes.toString();
   assert.equal(createHash('sha256').update(bytes).digest('hex'),slide.assetSha256);
   const xml=new DOMParser().parseFromString(svg,'image/svg+xml');assert.equal(xml.documentElement!.nodeName,'svg');
   assert.ok(!/<(?:script|foreignObject|image)|\bon\w+=|javascript:|https?:/i.test(svg.replace('http://www.w3.org/2000/svg','')));
   assert.ok(slide.sourcePages.every(p=>p>=1&&p<=deck.originalPageCount));
   assert.ok(slide.productIds.every(id=>products.some(p=>p.id===id)));slide.productIds.forEach(id=>linked.add(id));
   for(const name of sourceAuthorNames){assert.ok(!svg.includes(name));assert.ok(!JSON.stringify(slide).includes(name));}
   assert.ok(slide.note.length>20&&slide.productNote.length>20);
  }
 }
 assert.equal(linked.size,12);
});
