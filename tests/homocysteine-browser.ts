import {chromium,type Locator,type Page} from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {products,productById} from '../src/data/uvaco-products';
import policy from '../scripts/source-redaction-policy.json';

const base=process.env.TEST_BASE_URL||'http://localhost:3002';
const productIds=['995','360','antrodia','dikang','huoyi','kangyue','kangbei','antrodia-drops','lisheng'];
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
const audits:{width:number;state:string;violations:unknown[]}[]=[];
await mkdir('test-results',{recursive:true});

async function diagram(scope:Locator){const chart=scope.locator('.homocysteine-master');await chart.waitFor();return chart;}
async function selectMode(chart:Locator,mode:'blocked'|'recycling'){
 await chart.locator(`[data-hcy-state="${mode}"]`).click();
 assert.equal(await chart.getAttribute('data-hcy-mode'),mode);
}
async function anonymous(scope:Locator){
 const text=await scope.innerText();
 for(const token of [...policy.names,...policy.phrases])assert.ok(!text.toLowerCase().includes(token.toLowerCase()),`External attribution: ${token}`);
}
async function noProducts(scope:Locator){
 assert.equal(await scope.locator('[data-hcy-product]').count(),0,'Early story must not render product buttons');
 const text=await scope.innerText();for(const product of products)assert.ok(!text.includes(product.name),`Early story mentions ${product.name}`);
}
async function noOverflow(page:Page,chart:Locator,label:string){
 const result=await chart.evaluate(el=>({page:document.documentElement.scrollWidth>innerWidth+1,chart:el.scrollWidth>el.clientWidth+1,nodes:[...el.querySelectorAll<HTMLElement>('[data-hcy-node]')].filter(node=>node.scrollWidth>node.clientWidth+1).map(node=>node.dataset.hcyNode)}));
 assert.deepEqual(result,{page:false,chart:false,nodes:[]},label);
 assert.ok(await chart.getByRole('button').first().evaluate(el=>el.getBoundingClientRect().height)>=44,`${label}: small state control`);
}
async function topology(chart:Locator){
 await chart.locator('path[data-hcy-edge]').first().waitFor({state:'attached'});
 const edges=await chart.locator('path[data-hcy-edge]').evaluateAll(elements=>elements.map(element=>{
  const path=element as SVGPathElement,root=path.closest('.homocysteine-master')!,matrix=path.getScreenCTM()!;
  const start=path.getPointAtLength(0).matrixTransform(matrix),end=path.getPointAtLength(path.getTotalLength()).matrixTransform(matrix);
  const distances=[{point:start,id:path.dataset.from},{point:end,id:path.dataset.to}].map(({point,id})=>{const node=id?.startsWith('vascular-')?root.querySelectorAll<HTMLElement>('[data-hcy-vascular]')[Number(id.slice(9))]:[...root.querySelectorAll<HTMLElement>('[data-hcy-node]')].find(n=>n.dataset.hcyNode===id);if(!node)return Infinity;const r=node.getBoundingClientRect();return Math.hypot(Math.max(r.left-point.x,0,point.x-r.right),Math.max(r.top-point.y,0,point.y-r.bottom));});
  const marker=path.getAttribute('marker-end')||'',id=marker.match(/#([^)]*)/u)?.[1];
  return {id:path.dataset.hcyEdge,from:path.dataset.from,to:path.dataset.to,length:path.getTotalLength(),marker:!!id&&!!document.getElementById(id),startDistance:distances[0],endDistance:distances[1]};
 }));
 const pairs=edges.map(edge=>`${edge.from}>${edge.to}`);
 for(const pair of ['methionine>sam','sam>sah','sah>hcy','hcy>sah','hcy>folate','folate>methionine','hcy>betaine','betaine>methionine','hcy>cystathionine','cystathionine>cysteine','cysteine>gsh'])assert.ok(pairs.includes(pair),`Missing directed route ${pair}`);
 assert.ok(!pairs.includes('folate>betaine')&&!pairs.includes('betaine>folate'),'MTR and BHMT must remain independent alternatives');
 for(const edge of edges){assert.ok(edge.marker&&edge.length>10,`Missing actual arrowhead: ${edge.id}`);assert.ok(edge.startDistance<50&&edge.endDistance<50,`Arrow geometry is detached/reversed: ${JSON.stringify(edge)}`);}
}
async function audit(page:Page,width:number,state:string,chart:Locator){
 await noOverflow(page,chart,`${width}px ${state}`);await anonymous(chart);
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 audits.push({width,state,violations:result.violations});await writeFile('test-results/homocysteine-accessibility.json',JSON.stringify(audits,null,2));
 await chart.screenshot({path:`test-results/homocysteine-${width}-${state}.png`});
}
async function openHub(page:Page){
 await page.getByRole('button',{name:'三個健康故事專區',exact:true}).click();const hub=page.locator('.triangle-dialog');await hub.waitFor();
 const feature=hub.locator('.hub-feature-switch').getByRole('button',{name:'同半胱胺酸雙路徑',exact:true});if(await feature.count())await feature.click();return hub;
}
async function openStory(page:Page,name:string){
 await page.getByRole('button',{name,exact:true}).click();const story=page.locator('.visual-story-dialog');await story.waitFor();return story;
}
async function visitProduct(page:Page,chart:Locator,id:string){
 await chart.locator(`[data-hcy-product="${id}"]`).first().click();
 await page.locator('.product-deck').waitFor();assert.equal(await page.locator('#product-select').inputValue(),id);assert.equal(await page.locator('.product-intro h2').innerText(),productById.get(id)!.name);
 await page.locator(`.island-label[data-product-id="${id}"][aria-pressed="true"]`).waitFor({state:'attached'});
 await page.getByRole('button',{name:'全島總覽',exact:true}).click();
}

try{
 for(const width of [1440,768,390]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage();page.setDefaultTimeout(20000);
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.addInitScript({content:`window.hcySpeech=[];Object.defineProperty(window,'speechSynthesis',{value:{speak:u=>window.hcySpeech.push({text:u.text,lang:u.lang,rate:u.rate}),cancel:()=>{},pause:()=>{},resume:()=>{},getVoices:()=>[]}});`});
  await page.goto(base,{waitUntil:'networkidle'});
  for(const name of ['人體修復能力','神經修復']){
   const story=await openStory(page,name);await noProducts(story);assert.equal(await story.locator('.homocysteine-master').count(),0);
   await story.getByRole('button',{name:'接著，看身體怎麼了',exact:true}).click();let chart=await diagram(story);
   assert.equal(await chart.getAttribute('data-hcy-mode'),'recycling');await noProducts(story);
   await selectMode(chart,'blocked');await noProducts(story);await topology(chart);
   assert.equal(await chart.getAttribute('data-hcy-motion'),'reduced');assert.equal(await chart.locator('animateMotion').count(),0);
   await chart.getByRole('button',{name:'聽雙路徑導讀',exact:true}).click();
   if(name==='人體修復能力')await audit(page,width,'blocked',chart);
   await chart.locator('[data-hcy-state="recycling"]').focus();await page.keyboard.press('Enter');assert.equal(await chart.getAttribute('data-hcy-mode'),'recycling');
   await chart.locator('[data-hcy-state="blocked"]').focus();await page.keyboard.press('Space');assert.equal(await chart.getAttribute('data-hcy-mode'),'blocked');
   assert.equal(await story.locator('.story-other-pathways').getAttribute('open'),null);
   await story.locator('.story-other-pathways>summary').click();await story.locator('.biochemical-pathway-card').waitFor();await noProducts(story);
   await story.getByRole('button',{name:'再來，認識照顧與原料',exact:true}).click();chart=await diagram(story);
   assert.deepEqual([...new Set(await chart.locator('[data-hcy-product]').evaluateAll(nodes=>nodes.map(n=>(n as HTMLElement).dataset.hcyProduct)))].sort(),[...productIds].sort());
   if(name==='人體修復能力')await audit(page,width,'story-products',chart);
   await visitProduct(page,chart,'995');
  }
  let hub=await openHub(page),chart=await diagram(hub);
  for(const name of ['細胞自癒力','慢性發炎']){await hub.locator('.triangle-node').filter({hasText:name}).click();chart=await diagram(hub);await selectMode(chart,'blocked');await selectMode(chart,'recycling');}
  await audit(page,width,'hub',chart);
  await hub.locator('.triangle-node').filter({hasText:'自律神經'}).click();assert.equal(await hub.locator('.homocysteine-master').count(),0);await page.keyboard.press('Escape');
  for(const id of productIds){
   hub=await openHub(page);chart=await diagram(hub);await visitProduct(page,chart,id);
  }
  await page.locator('.header-ppt').click();const keynote=page.locator('.thematic-keynote-dialog');await keynote.waitFor();
  await keynote.getByRole('button',{name:'同半胱胺酸雙路徑',exact:true}).click();chart=await diagram(keynote);assert.equal(await keynote.getByRole('button',{name:'全螢幕播放',exact:true}).count(),0);
  await keynote.locator('#deck-tab-longevity-5').click();await diagram(keynote);
  await keynote.locator('#deck-tab-longevity-2').click();assert.equal(await keynote.locator('.homocysteine-master').count(),0);assert.equal(await keynote.getByRole('button',{name:'科學圖解',exact:true}).getAttribute('aria-pressed'),'true');
  await keynote.locator('#deck-tab-longevity-1').click();assert.equal(await keynote.locator('.homocysteine-master').count(),0);await keynote.getByRole('button',{name:'同半胱胺酸雙路徑',exact:true}).click();chart=await diagram(keynote);
  await audit(page,width,'keynote',chart);await visitProduct(page,chart,'360');
  await page.getByRole('button',{name:'字體大小：100%，點選切換'}).click();await page.getByRole('button',{name:'字體大小：125%，點選切換'}).click();
  hub=await openHub(page);chart=await diagram(hub);await noOverflow(page,chart,`${width}px 140%`);await chart.screenshot({path:`test-results/homocysteine-${width}-large.png`});
  const speech=await page.evaluate(()=>(window as unknown as {hcySpeech:{text:string;lang:string;rate:number}[]}).hcySpeech);
  assert.equal(speech.length,2);for(const utterance of speech){assert.equal(utterance.lang,'zh-TW');assert.ok(Math.abs(utterance.rate-.92)<.00001);for(const product of products)assert.ok(!utterance.text.includes(product.name),'Early narration must be product-free');}
  assert.deepEqual(errors,[]);await context.close();console.log(`${width}px: two modes, directed SVG routes, two stories/hub axes, nine island links, deck 1/5, keyboard and 140% passed.`);
 }
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'}),page=await context.newPage();
 await page.goto(base,{waitUntil:'networkidle'});const chart=await diagram(await openHub(page));
 await chart.getByRole('button',{name:'暫停動畫',exact:true}).click();assert.equal(await chart.getAttribute('data-hcy-motion'),'paused');assert.equal(await chart.locator('animateMotion').count(),0);
 await chart.getByRole('button',{name:'繼續動畫',exact:true}).click();await chart.getByRole('button',{name:'暫停動畫',exact:true}).waitFor();
 assert.equal(await chart.getAttribute('data-hcy-motion'),'running');assert.ok(await chart.locator('animateMotion').count()>0);
 await context.close();assert.ok(audits.every(result=>result.violations.length===0),'Accessibility failures: test-results/homocysteine-accessibility.json');
}finally{await browser.close();}
