import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {visualDecks,visualPages,visualFigures,visualPageCount,pillarVisuals,productVisuals,visualPageById} from '../src/data/visual-assets-manifest';
import {products} from '../src/data/uvaco-products';
import {slideRequestSchema,slideAnswerSchema} from '../src/lib/slide-explanation';
const hash=(bytes:Buffer)=>createHash('sha256').update(bytes).digest('hex');
test('all nine original PDFs and all 297 source pages retain exact provenance',async()=>{
 assert.equal(visualDecks.length,9);assert.equal(visualPageCount,297);assert.equal(visualPages.length,297);assert.equal(new Set(visualPages.map(p=>p.id)).size,297);
 assert.deepEqual(visualDecks.map(d=>d.pageCount),[88,10,37,43,55,19,14,13,18]);
 for(const deck of visualDecks){
  assert.equal(hash(await readFile(deck.sourcePath)),deck.sha256);
  assert.equal(hash(await readFile('public'+deck.fileUrl)),deck.sha256);
  assert.equal(deck.pages.length,deck.pageCount);
  for(const [i,page] of deck.pages.entries()){
   assert.equal(page.pageNumber,i+1);assert.equal(page.deckId,deck.id);
   assert.equal(hash(await readFile('public'+page.image)),page.sha256);
   assert.ok((await stat('public'+page.thumbnail)).size>0);
   assert.ok(page.width>=1600&&page.height>=1000);
   assert.ok(page.title.length>1&&page.caption.length>20);
   assert.notEqual(page.captionMethod,'topic-guide',`Every page needs a page-specific caption: ${page.id}`);
   assert.ok(page.pillars.length&&page.stages.length);
   assert.ok(page.figureIds.every(id=>deck.figures.some(f=>f.id===id&&f.pages.includes(page.pageNumber))));
  }
 }
});
test('all 429 embedded images remain accessible with page and topic mappings',async()=>{
 assert.equal(visualFigures.length,429);
 for(const f of visualFigures){assert.equal(hash(await readFile('public'+f.image)),f.sha256);assert.ok(f.pages.length&&f.pillars.length&&f.stages.length);assert.ok(['embedded-image','page-image'].includes(f.kind));}
});
test('four storyboards and all twelve products point to real source pages',()=>{
 assert.equal(Object.keys(pillarVisuals).length,4);
 for(const stages of Object.values(pillarVisuals)){assert.equal(stages.length,3);for(const refs of stages){assert.ok(refs.length>=2);for(const r of refs)assert.ok(visualPageById.has(r.pageId));}}
 assert.deepEqual(Object.keys(productVisuals).sort(),products.map(p=>p.id).sort());
 for(const refs of Object.values(productVisuals)){assert.equal(refs.length,3);for(const r of refs)assert.ok(visualPageById.has(r.pageId));}
 assert.match(visualPageById.get('brain-forest-007')!.caption,/不是人體神經顯微照片/);
 assert.match(visualPageById.get('longevity-6-005')!.caption,/不等於每個人都會臥床/);
});
test('image explanation accepts only bounded page IDs and three sentences',()=>{
 assert.ok(slideRequestSchema.safeParse({pageId:'brain-forest-009'}).success);
 for(const value of [{pageId:'../../.env'},{pageId:'https://example.com'},{pageId:'brain-forest-009',fileUrl:'/etc/passwd'},{pageId:'x'.repeat(600)}])assert.ok(!slideRequestSchema.safeParse(value).success);
 assert.ok(!slideAnswerSchema.safeParse({sentences:['only one']}).success);
});
