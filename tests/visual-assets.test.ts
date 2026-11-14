import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {visualDecks,visualPages,visualFigures,visualPageCount,pillarVisuals,productVisuals,visualPageById} from '../src/data/visual-assets-manifest';
import {products} from '../src/data/uvaco-products';
import {slideRequestSchema,slideAnswerSchema} from '../src/lib/slide-explanation';
import {POST as explainSlide} from '../src/app/api/slide-explanation/route';
import redactionPolicy from '../scripts/source-redaction-policy.json';
const hash=(bytes:Buffer)=>createHash('sha256').update(bytes).digest('hex');

test('reviewed PDFs retain private source hashes and contiguous public page routes',async()=>{
 assert.equal(visualDecks.length,10);
 assert.equal(visualPageCount,visualPages.length);
 assert.equal(new Set(visualPages.map(p=>p.id)).size,visualPageCount);
 const originals=new Set<string>();
 for(const folder of ['葡眾/lectures-pdf','葡眾/visual-pdf']){
  for(const file of await readdir(folder))if(file.endsWith('.pdf'))originals.add(hash(await readFile(`${folder}/${file}`)));
 }
 assert.equal(originals.size,9,'Nine original uploads must remain archived');
 const manuscriptHashes=new Set(await Promise.all((await readdir('葡眾/lectures')).filter(file=>file.endsWith('.md')).map(async file=>hash(await readFile(`葡眾/lectures/${file}`)))));
 for(const deck of visualDecks){
  assert.equal(hash(await readFile('public'+deck.fileUrl)),deck.sha256);
  assert.ok(deck.sourceKind==='redrawn-markdown'?manuscriptHashes.has(deck.sourceSha256):originals.has(deck.sourceSha256),`${deck.id}: private source hash lost`);
  assert.equal(deck.pages.length,deck.pageCount);
  assert.equal(deck.dpi,120,'Rasterization must stay within the reviewed memory budget');
  assert.equal((await readdir(`public/extracted-slides/${deck.id}`)).length,deck.pageCount*2,'Excluded source pages must not remain publicly reachable');
  for(const [index,page] of deck.pages.entries()){
   assert.equal(page.pdfPageNumber,index+1);
   assert.equal(page.deckId,deck.id);
   assert.equal(page.id,`${deck.id}-${String(page.pageNumber).padStart(3,'0')}`);
   assert.ok(!(deck.excludedPages as number[]).includes(page.pageNumber));
   assert.equal(hash(await readFile('public'+page.image)),page.sha256);
   assert.ok((await stat('public'+page.thumbnail)).size>0);
   assert.ok(Math.max(page.width,page.height)>=1200&&Math.min(page.width,page.height)>=600,`${page.id}: unreadably small image`);
   assert.ok(page.width*page.height<=20_000_000,`${page.id}: excessive raster memory`);
   assert.ok(page.title.length>1&&page.caption.length>20);
   assert.notEqual(page.captionMethod,'topic-guide',`Every page needs a page-specific caption: ${page.id}`);
   assert.ok(page.pillars.length&&page.stages.length);
   assert.ok(page.figureIds.every(id=>deck.figures.some(f=>f.id===id&&f.pages.includes(page.pageNumber))));
  }
 }
 assert.ok(visualDecks.filter(d=>d.id.startsWith('longevity-')&&d.id!=='longevity-2').some(d=>d.pageCount<d.originalPageCount));
 for(const token of [...redactionPolicy.names,...redactionPolicy.phrases])assert.ok(!JSON.stringify(visualDecks).toLowerCase().includes(token.toLowerCase()),`Published manifest contains external attribution: ${token}`);
});

test('every published figure is reachable only from a retained scientific page',async()=>{
 assert.ok(visualFigures.length>0);
 for(const deck of visualDecks){
  const files=await readdir(`public/extracted-figures/${deck.id}`).catch((error:NodeJS.ErrnoException)=>{if(error.code==='ENOENT')return [];throw error;});
  assert.equal(files.length,deck.figures.length,'Old unredacted figure files must be removed');
  for(const f of deck.figures){
   assert.equal(hash(await readFile('public'+f.image)),f.sha256);
   assert.ok(f.pages.length&&f.pillars.length&&f.stages.length);
   assert.ok(f.pages.every(number=>deck.pages.some(page=>page.pageNumber===number&&page.figureIds.includes(f.id))));
   assert.ok(['embedded-image','page-image'].includes(f.kind));
  }
 }
});

test('four storyboards and all twelve products point to retained scientific pages',()=>{
 assert.equal(Object.keys(pillarVisuals).length,4);
 for(const stages of Object.values(pillarVisuals)){assert.equal(stages.length,3);for(const refs of stages){assert.ok(refs.length>=2);for(const r of refs)assert.ok(visualPageById.has(r.pageId),r.pageId);}}
 assert.deepEqual(Object.keys(productVisuals).sort(),products.map(p=>p.id).sort());
 for(const refs of Object.values(productVisuals)){assert.equal(refs.length,3);for(const r of refs)assert.ok(visualPageById.has(r.pageId),r.pageId);}
 assert.match(visualPageById.get('brain-forest-007')!.caption,/不是人體神經顯微照片/);
 assert.match(visualPageById.get('longevity-6-005')!.caption,/不等於每個人都會臥床/);
});

test('excluded covers and biographies cannot enter the image explanation API',async()=>{
 for(const pageId of ['longevity-1-001','longevity-1-002','longevity-4-002','longevity-5-043','longevity-6-003','longevity-6-055']){
  assert.equal(visualPageById.has(pageId),false,pageId);
  const response=await explainSlide(new Request('http://localhost:3000/api/slide-explanation',{method:'POST',headers:{origin:'http://localhost:3000','content-type':'application/json'},body:JSON.stringify({pageId})}));
  assert.equal(response.status,404,pageId);
 }
});

test('image explanation accepts only bounded page IDs and three sentences',()=>{
 assert.ok(slideRequestSchema.safeParse({pageId:'brain-forest-009'}).success);
 for(const value of [{pageId:'../../.env'},{pageId:'https://example.com'},{pageId:'brain-forest-009',fileUrl:'/etc/passwd'},{pageId:'x'.repeat(600)}])assert.ok(!slideRequestSchema.safeParse(value).success);
 assert.ok(!slideAnswerSchema.safeParse({sentences:['only one']}).success);
});
