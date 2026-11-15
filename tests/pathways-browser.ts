import {chromium,type Locator,type Page} from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {biochemicalPathways,pathwayById,pillarPathwayIds,productPathwayIds,type PathwayId} from '../src/data/biochemical-pathways';
import {thematicDecks} from '../src/data/thematic-decks';
import {pillars} from '../src/data/lecture-poster';
import {products} from '../src/data/uvaco-products';
import policy from '../scripts/source-redaction-policy.json';

const base=process.env.TEST_BASE_URL||'http://localhost:3002';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
const reports:{width:number;view:string;violations:unknown[]}[]=[];
await mkdir('test-results',{recursive:true});
function anonymous(text:string){for(const token of [...policy.names,...policy.phrases])assert.ok(!text.toLowerCase().includes(token.toLowerCase()),`Visible external attribution: ${token}`);}
async function noEarlyProducts(story:Locator){
 const text=await story.innerText();
 for(const product of products)assert.ok(!text.includes(product.name),`Product ${product.name} appears before the ingredient act`);
 assert.equal(await story.locator('.pathway-node-products,.pathway-product-links').count(),0);
 assert.equal(await story.getByRole('button',{name:'點亮相關島嶼',exact:true}).count(),0);
 anonymous(text);
}
async function choosePathway(card:Locator,id:PathwayId){
 const current=await card.getAttribute('data-pathway');
 if(current!==id)await card.locator('.pathway-picker select').selectOption(id);
 assert.equal(await card.getAttribute('data-pathway'),id);
}
async function showOtherPathways(story:Locator){
 const details=story.locator('.story-other-pathways');
 if(await details.count()&&await details.getAttribute('open')===null)await details.locator(':scope > summary').click();
 const card=story.locator('.biochemical-pathway-card');await card.waitFor();return card;
}
async function exercisePathway(card:Locator,id:PathwayId,page:Page){
 await choosePathway(card,id);
 const data=pathwayById.get(id)!;
 assert.equal(await card.locator('.pathway-lanes>button').count(),data.lanes.length);
 for(const lane of data.lanes){
  await card.locator('.pathway-lanes').getByRole('button',{name:lane.title,exact:true}).click();
  assert.equal(await card.locator('.pathway-node').count(),lane.nodes.length);
  const last=card.locator(`.pathway-node[data-node="${lane.nodes.at(-1)!.id}"]`);
  await last.click();assert.equal(await last.getAttribute('aria-pressed'),'true');
  assert.equal(await card.locator('.pathway-node-explanation h5').innerText(),lane.nodes.at(-1)!.label);
  await last.press('Home');
  assert.equal(await card.locator('.pathway-node[aria-pressed=true]').getAttribute('data-node'),lane.nodes[0].id);
  await page.keyboard.press('ArrowRight');
  assert.equal(await card.locator('.pathway-node[aria-pressed=true]').getAttribute('data-node'),lane.nodes[1].id);
 }
}
async function audit(page:Page,width:number,view:string){
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 reports.push({width,view,violations:result.violations});
 await writeFile('test-results/pathways-accessibility.json',JSON.stringify(reports,null,2));
 await page.screenshot({path:`test-results/pathways-${view}-${width}.png`});
}

try{
 for(const width of [1440,768,390]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage();page.setDefaultTimeout(30000);
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript({content:`window.visualVoice=[];Object.defineProperty(window,'speechSynthesis',{value:{speak:u=>window.visualVoice.push({text:u.text,lang:u.lang,rate:u.rate}),cancel:()=>{},pause:()=>{},resume:()=>{},getVoices:()=>[]}});`});
  await page.goto(base,{waitUntil:'networkidle'});
  assert.equal(await page.locator('.ios-header').evaluate(el=>el.getBoundingClientRect().height),48);
  const tested=new Set<PathwayId>();
  for(const pillar of pillars){
   await page.getByRole('button',{name:pillar.name,exact:true}).click();const story=page.locator('.visual-story-dialog');
   await story.locator('.medical-stat-svg').waitFor();await noEarlyProducts(story);
   await story.getByRole('button',{name:'聽生活與數據導讀',exact:true}).click();
   await story.getByRole('button',{name:'看生理位置',exact:true}).click();
   await story.locator('.medical-anatomy-svg').waitFor();
   const regions=story.locator('.medical-region-controls>button');
   await regions.last().click();assert.equal(await regions.last().getAttribute('aria-pressed'),'true');
   await noEarlyProducts(story);
   if(pillar.id==='repair')await audit(page,width,'anatomy');
   await story.getByRole('button',{name:'接著，看身體怎麼了',exact:true}).click();
   const card=await showOtherPathways(story);
   for(const id of pillarPathwayIds[pillar.id]){
    await choosePathway(card,id);await noEarlyProducts(story);
    if(!tested.has(id)){await exercisePathway(card,id,page);tested.add(id);}
   }
   await card.getByRole('button',{name:'國語語音導讀',exact:true}).click();
   if(pillar.id==='repair')await audit(page,width,'pathway');
   await story.getByRole('button',{name:'再來，認識照顧與原料',exact:true}).click();
   assert.equal(await story.locator('.visual-product-bridges>button').count(),3);
   await story.locator('.story-source-gallery>summary').click();
   await story.locator('.visual-carousel .pdf-visual>img').evaluate(async el=>{await (el as HTMLImageElement).decode();});
   await story.locator('.visual-product-bridges>button').first().click();
   await page.locator('.product-deck .biochemical-pathway-card').waitFor();
   await page.getByRole('button',{name:'全島總覽',exact:true}).click();
  }
  assert.deepEqual([...tested].sort(),biochemicalPathways.map(pathway=>pathway.id).sort());
  console.log(`${width}px: all four stories and eight interactive pathways passed.`);
  for(const product of products){
   await page.locator('#product-select').selectOption(product.id);
   const drawer=page.locator('.product-deck'),card=drawer.locator('.biochemical-pathway-card');await card.waitFor();
   assert.ok(productPathwayIds[product.id].includes(await card.getAttribute('data-pathway') as PathwayId));
   assert.ok(await card.locator(`[data-product-link="${product.id}"]`).count()>0,`${product.id} missing precise node ingredient link`);
   anonymous(await drawer.innerText());
   if(product.id==='995'){
    await card.getByRole('button',{name:'放大看圖解',exact:true}).click();
    await page.locator('.visual-lightbox .pdf-visual>img').evaluate(async el=>{await (el as HTMLImageElement).decode();});
    await page.keyboard.press('Escape');assert.equal(await page.locator('#product-select').inputValue(),product.id);
   }
   const pathway=pathwayById.get(await card.getAttribute('data-pathway') as PathwayId)!;
   const route=[...new Set(pathway.products.map(link=>link.productId))];
   await card.getByRole('button',{name:'點亮相關島嶼',exact:true}).click();
   assert.equal(await page.locator('#product-select').inputValue(),route[0]);
   assert.match(await page.locator('.tour-status').innerText(),new RegExp(`1 / ${route.length} 站`));
   await page.getByRole('button',{name:'全島總覽',exact:true}).click();
  }
  console.log(`${width}px: twelve product-to-node island routes passed.`);
  await page.locator('.header-ppt').click();const keynote=page.locator('.thematic-keynote-dialog');await keynote.waitFor();
  assert.equal(await keynote.getByRole('tab').count(),6);
  for(const deck of thematicDecks){
   await keynote.locator(`#deck-tab-${deck.id}`).click();
   await keynote.getByRole('button',{name:'科學圖解',exact:true}).click();
   assert.equal(await keynote.locator('.pdf-filmstrip>button').count(),deck.pageCount);
   await keynote.locator('.pdf-filmstrip>button').last().click();
   assert.equal(await keynote.locator('.slide-counter').innerText(),`${deck.pageCount} / ${deck.pageCount}`);
   await page.keyboard.press('Home');assert.equal(await keynote.locator('.slide-counter').innerText(),`1 / ${deck.pageCount}`);
   if(deck.id==='longevity-1'){
    const source=deck.pages[0];assert.notEqual(source.pageNumber,source.pdfPageNumber,'Test requires a filtered source page');
    await keynote.getByRole('button',{name:'全螢幕播放',exact:true}).click();
    const lightbox=page.locator('.visual-lightbox');await lightbox.waitFor();
    assert.match(await lightbox.locator('.visual-provenance a').getAttribute('href')||'',new RegExp(`#page=${source.pdfPageNumber}$`));
    await lightbox.getByRole('button',{name:'以 PDF 繪製',exact:true}).click();
    await lightbox.locator('[data-pdf-state=ready]').waitFor({timeout:60000});
    await page.keyboard.press('Escape');
   }
   await keynote.getByRole('button',{name:'互動代謝路徑',exact:true}).click();
   for(const id of deck.pathwayIds)await choosePathway(keynote.locator('.biochemical-pathway-card'),id);
   anonymous(await keynote.innerText());
  }
  await audit(page,width,'keynote');
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'字體大小：100%，點選切換'}).click();await page.getByRole('button',{name:'字體大小：125%，點選切換'}).click();
  await page.getByRole('button',{name:'人體修復能力',exact:true}).click();
  await page.getByRole('button',{name:'接著，看身體怎麼了',exact:true}).click();
  const largeCard=await showOtherPathways(page.locator('.visual-story-dialog'));
  assert.ok(await largeCard.locator('.pathway-node').first().evaluate(el=>el.getBoundingClientRect().height)>=44);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Horizontal overflow at ${width}px / 140%`);
  await page.screenshot({path:`test-results/pathways-large-${width}.png`});
  const speech=await page.evaluate(()=>(window as unknown as {visualVoice:{text:string;lang:string;rate:number}[]}).visualVoice);
  assert.ok(speech.length>=8);assert.ok(speech.every(utterance=>utterance.lang==='zh-TW'&&Math.abs(utterance.rate-.92)<.00001));
  for(const utterance of speech)anonymous(utterance.text);
  assert.deepEqual(errors,[]);
  await context.close();console.log(`${width}px: four SVG stories, eight interactive pathways, twelve ingredient routes, six topic decks, TTS and 140% reading passed.`);
 }
 const fallback=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});const page=await fallback.newPage();
 await page.route('**/extracted-slides/**',route=>route.abort());
 await page.goto(base,{waitUntil:'networkidle'});await page.getByRole('button',{name:'人體修復能力',exact:true}).click();
 await page.locator('.medical-stat-svg').waitFor();await page.getByRole('button',{name:'接著，看身體怎麼了',exact:true}).click();
 await page.locator('.pathway-flow-svg').waitFor();assert.ok(await page.locator('.pathway-node').count()>1,'Built-in diagram must work without extracted pictures');
 await page.keyboard.press('Escape');await page.locator('.header-ppt').click();
 await page.locator('.pdf-keynote-image [data-pdf-state=ready]').waitFor({timeout:60000});
 await fallback.close();
 await writeFile('test-results/pathways-accessibility.json',JSON.stringify(reports,null,2));
 assert.ok(reports.every(report=>report.violations.length===0),'Accessibility violations: see test-results/pathways-accessibility.json');
}finally{await browser.close();}
