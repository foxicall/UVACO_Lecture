import {chromium,type Locator,type Page} from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {gutDominoAxes,gutDistalPathways,gutRepairSteps,gutBarrierLayers,gutCaseStudy} from '../src/data/gut-brain-interactive';
import {thematicDecks} from '../src/data/thematic-decks';
import {products,productById} from '../src/data/uvaco-products';
import policy from '../scripts/source-redaction-policy.json';

const base=process.env.TEST_BASE_URL||'http://localhost:3002';
const sourceDeck=thematicDecks.find(deck=>deck.id==='longevity-6')!;
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
const audits:{width:number;state:string;violations:unknown[]}[]=[];
await mkdir('test-results',{recursive:true});
async function master(scope:Locator){const chart=scope.locator('.gut-brain-master');await chart.waitFor();return chart;}
async function mode(chart:Locator,value:'stress'|'support'){
 await chart.locator(`[data-gut-state="${value}"]`).click();assert.equal(await chart.getAttribute('data-gut-mode'),value);assert.equal(await chart.locator('.gut-barrier-scene').getAttribute('data-barrier-mode'),value);
}
async function anonymous(scope:Locator){const text=await scope.innerText();for(const token of [...policy.names,...policy.phrases])assert.ok(!text.toLowerCase().includes(token.toLowerCase()),`External attribution: ${token}`);}
async function noProducts(scope:Locator){
 assert.equal(await scope.locator('[data-gut-product]').count(),0);const text=await scope.innerText();for(const product of products)assert.ok(!text.includes(product.name),`Product before third act: ${product.name}`);await anonymous(scope);
}
async function noOverflow(chart:Locator,label:string){
 const result=await chart.evaluate(el=>({page:document.documentElement.scrollWidth>innerWidth+1,chart:el.scrollWidth>el.clientWidth+1,buttons:[...el.querySelectorAll<HTMLElement>('button')].filter(button=>button.offsetWidth>0&&button.scrollWidth>button.clientWidth+1).map(button=>button.textContent)}));
 assert.deepEqual(result,{page:false,chart:false,buttons:[]},label);
}
async function audit(page:Page,width:number,state:string,chart:Locator){
 await anonymous(chart);await noOverflow(chart,`${width}px ${state}`);
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();audits.push({width,state,violations:result.violations});
 await writeFile('test-results/gut-brain-accessibility.json',JSON.stringify(audits,null,2));await chart.screenshot({path:`test-results/gut-brain-${width}-${state}.png`});
}
async function barrier(chart:Locator){
 const scene=chart.locator('.gut-barrier-scene');
 await mode(chart,'stress');
 const leak=await scene.locator('path[data-barrier-flow="lps"]').evaluateAll(paths=>paths.map(el=>{
  const path=el as SVGPathElement,boundary=path.closest('svg')!.querySelector<SVGGElement>('[data-barrier-boundary="epithelium"]')!.getBBox();
  const start=path.getPointAtLength(0),end=path.getPointAtLength(path.getTotalLength());
  return {startAbove:start.y<boundary.y,endBelow:end.y>boundary.y+boundary.height,length:path.getTotalLength()};
 }));
 assert.ok(leak.length>0&&leak.every(path=>path.startAbove&&path.endBelow&&path.length>100),'LPS must actually cross the epithelial layer');
 assert.equal(await scene.locator('[data-junction-state]').getAttribute('data-junction-state'),'open');
 for(const layer of gutBarrierLayers){const button=scene.locator(`[data-barrier-layer="${layer.id}"]`);await button.click();assert.equal(await button.getAttribute('aria-pressed'),'true');}
 await mode(chart,'support');assert.equal(await scene.locator('[data-junction-state]').getAttribute('data-junction-state'),'closed');
 assert.equal(await scene.locator('path[data-barrier-flow="lps"]').count(),0,'Support state must not show LPS leakage');
 const scfa=await scene.locator('path[data-barrier-flow="scfa"]').evaluateAll(paths=>paths.map(el=>{
  const path=el as SVGPathElement,boundary=path.closest('svg')!.querySelector<SVGGElement>('[data-barrier-boundary="epithelium"]')!.getBBox(),end=path.getPointAtLength(path.getTotalLength());
  return end.y>=boundary.y&&end.y<=boundary.y+boundary.height;
 }));assert.ok(scfa.length>0&&scfa.every(Boolean),'SCFA paths should nourish the epithelial cells');
}
async function readTrack(chart:Locator,track:{id:string;nodes:{id:string;detail:string}[]}){
 const flow=chart.locator(`[data-gut-track="${track.id}"]`);await flow.waitFor();
 const node=flow.locator(`[data-gut-node="${track.nodes.at(-1)!.id}"]`);await node.click();assert.equal(await node.getAttribute('aria-pressed'),'true');assert.equal(await flow.locator('.gut-node-detail>p').innerText(),track.nodes.at(-1)!.detail);
 assert.equal(await flow.locator('[data-gut-node]').count(),track.nodes.length);
 await flow.locator('[data-gut-edge]').first().waitFor({state:'attached'});
 const edges=await flow.locator('[data-gut-edge]').evaluateAll(paths=>paths.map(el=>({from:el.getAttribute('data-from'),to:el.getAttribute('data-to'),arrow:!!el.getAttribute('marker-end'),length:(el as SVGPathElement).getTotalLength()})));
 assert.deepEqual(edges.map(edge=>`${edge.from}>${edge.to}`),track.nodes.slice(1).map((node,i)=>`${track.nodes[i].id}>${node.id}`));assert.ok(edges.every(edge=>edge.arrow&&edge.length>0));
}
async function explore(chart:Locator,deep=false){
 assert.equal(await chart.locator('[data-gut-axis]').count(),4);assert.equal(await chart.locator('[data-gut-distal]').count(),2);assert.equal(await chart.locator('[data-gut-step]').count(),5);
 for(const axis of gutDominoAxes){const button=chart.locator(`[data-gut-axis="${axis.id}"]`);await button.click();assert.equal(await button.getAttribute('aria-pressed'),'true');if(deep)for(const track of axis.tracks){await chart.locator(`[data-gut-axis-track="${track.id}"]`).click();await readTrack(chart,track);}}
 for(const pathway of gutDistalPathways){const button=chart.locator(`[data-gut-distal="${pathway.id}"]`);await button.click();assert.equal(await button.getAttribute('aria-pressed'),'true');if(deep)for(const track of pathway.tracks){await chart.locator(`[data-gut-distal-track="${track.id}"]`).click();await readTrack(chart,track);}}
 for(const step of gutRepairSteps){const button=chart.locator(`[data-gut-step="${step.id}"]`);await button.click();assert.equal(await button.getAttribute('aria-pressed'),'true');await chart.getByText(step.detail,{exact:true}).waitFor();}
}
async function casePanel(chart:Locator){
 const panel=chart.locator('.gut-case-panel');assert.equal(await panel.getAttribute('open'),null);await panel.locator(':scope>summary').click();
 await panel.getByText(gutCaseStudy.context,{exact:true}).waitFor();
 for(const metric of gutCaseStudy.measurements){await panel.getByText(metric.label,{exact:true}).waitFor();if(metric.afterLabel)assert.ok((await panel.locator(`[data-gut-measurement="${metric.id}"] .is-followup strong`).innerText()).startsWith(metric.afterLabel));}
 for(const age of gutCaseStudy.ages){await panel.getByText(age.label,{exact:true}).waitFor();await panel.getByText(age.note,{exact:true}).waitFor();}
 const values=await panel.locator('[data-gut-measurement] strong,.gut-case-ages strong').allTextContents();
 await mode(chart,'stress');assert.deepEqual(await panel.locator('[data-gut-measurement] strong,.gut-case-ages strong').allTextContents(),values,'Mechanism mode must not alter case measurements');
 await mode(chart,'support');assert.deepEqual(await panel.locator('[data-gut-measurement] strong,.gut-case-ages strong').allTextContents(),values);
 await anonymous(panel);await panel.locator(':scope>summary').click();
}
async function completeImage(view:Locator){
 const image=view.locator('img');await image.evaluate(async el=>{await (el as HTMLImageElement).decode();});
 const painted=await image.evaluate(el=>{const image=el as HTMLImageElement,box=image.getBoundingClientRect(),frame=image.closest('.pdf-visual')!.getBoundingClientRect(),scale=Math.min(box.width/image.naturalWidth,box.height/image.naturalHeight),width=image.naturalWidth*scale,height=image.naturalHeight*scale,left=box.left+(box.width-width)/2,top=box.top+(box.height-height)/2;return {fit:getComputedStyle(image).objectFit,visible:width>0&&height>0&&left>=frame.left-1&&top>=frame.top-1&&left+width<=frame.right+1&&top+height<=frame.bottom+1};});
 assert.deepEqual(painted,{fit:'contain',visible:true},'Entire source slide must fit inside the preview frame');
}
async function chooseProduct(chart:Locator,id:string){
 const owner=[...gutDominoAxes.map(item=>({selector:'data-gut-axis',item})),...gutDistalPathways.map(item=>({selector:'data-gut-distal',item})),...gutRepairSteps.map(item=>({selector:'data-gut-step',item}))].find(({item})=>item.productIds.includes(id));
 assert.ok(owner,`No route to product ${id}`);await chart.locator(`[${owner.selector}="${owner.item.id}"]`).click();return chart.locator(`[data-gut-product="${id}"]`).first();
}
async function visitProduct(page:Page,chart:Locator,id:string){
 await (await chooseProduct(chart,id)).click();await page.locator('.product-deck').waitFor();assert.equal(await page.locator('#product-select').inputValue(),id);assert.equal(await page.locator('.product-intro h2').innerText(),productById.get(id)!.name);
 await page.locator(`.island-label[data-product-id="${id}"][aria-pressed=true]`).waitFor({state:'attached'});await page.getByRole('button',{name:'全島總覽',exact:true}).click();
}
async function openHub(page:Page){await page.getByRole('button',{name:'三個健康故事專區',exact:true}).click();const hub=page.locator('.triangle-dialog');await hub.waitFor();return hub;}

try{
 for(const width of [1440,768,390]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage();page.setDefaultTimeout(25000);
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.addInitScript({content:`window.gutSpeech=[];Object.defineProperty(window,'speechSynthesis',{value:{speak:u=>window.gutSpeech.push({text:u.text,lang:u.lang,rate:u.rate}),cancel:()=>{},pause:()=>{},resume:()=>{},getVoices:()=>[]}});`});
  await page.goto(base,{waitUntil:'networkidle'});assert.equal(await page.locator('.ios-header').evaluate(el=>el.getBoundingClientRect().height),48);
  for(const name of ['慢性發炎','自律神經']){
   await page.getByRole('button',{name,exact:true}).click();const story=page.locator('.visual-story-dialog');await story.waitFor();await noProducts(story);assert.equal(await story.locator('.gut-brain-master').count(),0);
   await story.getByRole('button',{name:'接著，看身體怎麼了',exact:true}).click();let chart=await master(story);await barrier(chart);await explore(chart,name==='慢性發炎');await noProducts(story);
   assert.equal(await chart.getAttribute('data-gut-motion'),'reduced');assert.equal(await chart.locator('.gut-barrier-scene').getAttribute('data-barrier-running'),'false');assert.equal(await chart.locator('animateMotion,animateTransform,animate').count(),0);
   await chart.locator('[data-gut-state=stress]').focus();await page.keyboard.press('Enter');assert.equal(await chart.getAttribute('data-gut-mode'),'stress');
   await chart.locator('[data-gut-state=support]').focus();await page.keyboard.press('Space');assert.equal(await chart.getAttribute('data-gut-mode'),'support');
   await chart.getByRole('button',{name:'聽腦腸軸導讀',exact:true}).click();
   if(name==='慢性發炎'){await casePanel(chart);await audit(page,width,'story-science',chart);}
   await story.getByRole('button',{name:'再來，認識照顧與原料',exact:true}).click();chart=await master(story);await visitProduct(page,chart,'kanger');
  }
  let hub=await openHub(page),chart=await master(hub);
  for(const name of ['自律神經','慢性發炎']){await hub.locator('.triangle-node').filter({hasText:name}).click();chart=await master(hub);await mode(chart,'stress');await mode(chart,'support');}
  await audit(page,width,'hub',chart);
  await hub.locator('.triangle-node').filter({hasText:'細胞自癒力'}).click();assert.equal(await hub.locator('.gut-brain-master').count(),0);await hub.locator('.homocysteine-master').waitFor();await page.keyboard.press('Escape');
  for(const product of products){hub=await openHub(page);chart=await master(hub);await visitProduct(page,chart,product.id);}
  await page.locator('.header-ppt').click();const keynote=page.locator('.thematic-keynote-dialog');await keynote.waitFor();await keynote.locator('#deck-tab-longevity-6').click();chart=await master(keynote);
  assert.equal(await keynote.getByRole('button',{name:'腸腦與免疫互動圖',exact:true}).getAttribute('aria-pressed'),'true');
  const gallery=chart.locator('.gut-source-gallery');await gallery.locator(':scope>summary').click();
  await gallery.locator('[data-gut-page]').first().waitFor();
  assert.deepEqual(await gallery.locator('[data-gut-page]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-gut-page'))),sourceDeck.pages.map(slide=>slide.id));
  const last=sourceDeck.pages.at(-1)!;await gallery.locator(`[data-gut-page="${last.id}"]`).click();
  await completeImage(gallery.locator('.gut-gallery-stage .pdf-visual'));
  await gallery.getByRole('button',{name:'放大腦腸軸原圖',exact:true}).click();const lightbox=page.locator('.visual-lightbox');await lightbox.waitFor();
  assert.match(await lightbox.locator('.visual-provenance a').getAttribute('href')||'',new RegExp(`#page=${last.pdfPageNumber}$`));await completeImage(lightbox.locator('.pdf-visual'));await page.keyboard.press('Escape');
  await gallery.getByRole('button',{name:'聽這張圖解',exact:true}).click();await anonymous(gallery);await gallery.locator(':scope>summary').click();
  await keynote.getByRole('button',{name:'科學圖解',exact:true}).click();assert.equal(await keynote.locator('.pdf-filmstrip>button').count(),23);assert.equal(await keynote.locator('.slide-counter').innerText(),'1 / 23');
  await keynote.getByRole('button',{name:'下一頁',exact:true}).click();assert.equal(await keynote.locator('.slide-counter').innerText(),'2 / 23');
  await keynote.getByRole('button',{name:'腸腦與免疫互動圖',exact:true}).click();await master(keynote);
  await keynote.locator('#deck-tab-longevity-5').click();assert.equal(await keynote.locator('.gut-brain-master').count(),0);assert.equal(await keynote.getByRole('button',{name:'科學圖解',exact:true}).getAttribute('aria-pressed'),'true');
  await keynote.locator('#deck-tab-longevity-6').click();chart=await master(keynote);await audit(page,width,'keynote',chart);await visitProduct(page,chart,'ningkang');
  await page.getByRole('button',{name:'字體大小：100%，點選切換'}).click();await page.getByRole('button',{name:'字體大小：125%，點選切換'}).click();hub=await openHub(page);chart=await master(hub);
  await chart.locator('.gut-case-panel>summary').click();await noOverflow(chart,`${width}px at 140%`);await chart.screenshot({path:`test-results/gut-brain-${width}-large.png`});
  const speech=await page.evaluate(()=>(window as unknown as {gutSpeech:{text:string;lang:string;rate:number}[]}).gutSpeech);assert.equal(speech.length,3);for(const utterance of speech){assert.equal(utterance.lang,'zh-TW');assert.ok(Math.abs(utterance.rate-.92)<.00001);}for(const utterance of speech.slice(0,2))for(const product of products)assert.ok(!utterance.text.includes(product.name),'Early narration contains a product name');
  assert.deepEqual(errors,[]);await context.close();console.log(`${width}px: barrier modes, 4 axes, 2 distal pathways, 5R, 12 islands, case provenance, 23-slide gallery and 140% passed.`);
 }
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'}),page=await context.newPage();await page.goto(base,{waitUntil:'networkidle'});const chart=await master(await openHub(page));
 await mode(chart,'stress');await chart.locator('[data-gut-pause]').click();assert.equal(await chart.getAttribute('data-gut-motion'),'paused');assert.equal(await chart.locator('animateMotion,animateTransform,animate').count(),0);
 await chart.locator('[data-gut-pause]').click();assert.equal(await chart.getAttribute('data-gut-motion'),'running');
 const leaked=await chart.locator('.gut-barrier-scene').evaluate(el=>[...el.querySelectorAll('path[data-barrier-flow="lps"]')].some(path=>[...el.querySelectorAll('animateMotion')].some(particle=>particle.getAttribute('path')===path.getAttribute('d'))));assert.ok(leaked,'Running stress mode needs particles following actual LPS leak paths');
 const particle=chart.locator('.gut-barrier-particle-lps').first(),before=await particle.evaluate(el=>({x:(el as SVGGraphicsElement).getCTM()!.e,y:(el as SVGGraphicsElement).getCTM()!.f}));await page.waitForTimeout(300);const after=await particle.evaluate(el=>({x:(el as SVGGraphicsElement).getCTM()!.e,y:(el as SVGGraphicsElement).getCTM()!.f}));assert.ok(Math.hypot(after.x-before.x,after.y-before.y)>.1,'LPS particles must actually move along the leak route');
 await mode(chart,'support');assert.ok(await chart.locator('.gut-barrier-scene animateMotion').count()>0);assert.equal(await chart.locator('.gut-barrier-scene path[data-barrier-flow=lps]').count(),0);
 await context.close();assert.ok(audits.every(result=>result.violations.length===0),'Accessibility violations: test-results/gut-brain-accessibility.json');
}finally{await browser.close();}
