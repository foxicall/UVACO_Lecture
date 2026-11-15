import {chromium,type Locator,type Page} from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {toxinDrainageDefinition,toxinObservations} from '../src/data/toxin-drainage';
import {endocrineBrainBrakeDefinition} from '../src/data/endocrine-brain-brake';
import {resolutionMyelinDefinition} from '../src/data/resolution-myelin';
import type {ScienceModuleDefinition,ScienceTrack} from '../src/data/science-module-types';
import {thematicDecks,type ThematicDeck} from '../src/data/thematic-decks';
import {productById} from '../src/data/uvaco-products';
import policy from '../scripts/source-redaction-policy.json';

const base=process.env.TEST_BASE_URL||'http://localhost:3002';
const definitions=[toxinDrainageDefinition,endocrineBrainBrakeDefinition,resolutionMyelinDefinition];
const deckIds=new Map(definitions.map((definition,index)=>[definition.id,`longevity-${index+2}`]));
const audits:{width:number;module:string;state:string;violations:unknown[]}[]=[];
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
await mkdir('test-results',{recursive:true});

async function anonymous(scope:Locator){
 const text=await scope.innerText();for(const token of [...policy.names,...policy.phrases])assert.ok(!text.toLowerCase().includes(token.toLowerCase()),`Excluded attribution: ${token}`);
}
async function noOverflow(scope:Locator,label:string){
 const result=await scope.evaluate(el=>({page:document.documentElement.scrollWidth>innerWidth+1,chart:el.scrollWidth>el.clientWidth+1,clipped:[...el.querySelectorAll<HTMLElement>('button')].filter(button=>button.offsetWidth&&button.scrollWidth>button.clientWidth+1).map(button=>button.textContent)}));
 assert.deepEqual(result,{page:false,chart:false,clipped:[]},label);
 const short=await scope.locator('button').evaluateAll(buttons=>buttons.filter(button=>button.getBoundingClientRect().width&&button.getBoundingClientRect().height<59).map(button=>button.textContent));
 assert.deepEqual(short,[],`${label}: control shorter than 60px`);
}
async function moduleView(keynote:Locator,definition:ScienceModuleDefinition){
 await keynote.locator(`#deck-tab-${deckIds.get(definition.id)}`).click();
 const chart=keynote.locator(`[data-science-module="${definition.id}"]`);await chart.waitFor();assert.equal(await keynote.locator('.homocysteine-master,.gut-brain-master,.science-module-master').count(),1,'Only the selected simulator may remain mounted');return chart;
}
async function mode(chart:Locator,value:'stress'|'support'){
 await chart.locator(`[data-science-state="${value}"]`).click();assert.equal(await chart.getAttribute('data-science-mode'),value);
}
async function readTrack(chart:Locator,track:ScienceTrack){
 await chart.locator(`[data-science-track="${track.id}"]`).click();
 const flow=chart.locator(`[data-science-flow-track="${track.id}"]`);await flow.waitFor();
 assert.equal(await flow.locator('[data-science-node]').count(),track.nodes.length);
 const node=track.nodes.at(-1)!;await flow.locator(`[data-science-node="${node.id}"]`).click();await flow.getByText(node.detail,{exact:true}).waitFor();
 await flow.locator('[data-science-edge]').first().waitFor({state:'attached'});
 const edges=await flow.locator('[data-science-edge]').evaluateAll(elements=>elements.map(el=>{
  const path=el as SVGPathElement,root=path.closest('.science-flow')!,matrix=path.getScreenCTM()!;
  const start=path.getPointAtLength(0).matrixTransform(matrix),end=path.getPointAtLength(path.getTotalLength()).matrixTransform(matrix);
  const distances=[{point:start,id:path.dataset.from},{point:end,id:path.dataset.to}].map(({point,id})=>{const node=[...root.querySelectorAll<HTMLElement>('[data-science-node]')].find(n=>n.dataset.scienceNode===id);if(!node)return Infinity;const r=node.getBoundingClientRect();return Math.hypot(Math.max(r.left-point.x,0,point.x-r.right),Math.max(r.top-point.y,0,point.y-r.bottom));});
  const marker=path.getAttribute('marker-end')?.match(/#([^)]*)/)?.[1];
  return {from:path.dataset.from,to:path.dataset.to,length:path.getTotalLength(),marker:!!marker&&!!document.getElementById(marker),distances};
 }));
 assert.deepEqual(edges.map(edge=>`${edge.from}>${edge.to}`),track.nodes.slice(1).map((node,index)=>`${track.nodes[index].id}>${node.id}`));
 for(const edge of edges)assert.ok(edge.length>0&&edge.marker&&edge.distances.every(value=>value<30),`${track.id}: disconnected arrow ${JSON.stringify(edge)}`);
}
async function explore(chart:Locator,definition:ScienceModuleDefinition,deep:boolean){
 assert.equal(await chart.locator('[data-science-stage]').count(),definition.stages.length);
 for(const stage of definition.stages){
  await chart.locator(`[data-science-stage="${stage.id}"]`).click();await chart.getByText(stage.explanation,{exact:true}).waitFor();
  assert.deepEqual(await chart.locator('[data-science-track]').evaluateAll(buttons=>buttons.map(button=>button.getAttribute('data-science-track'))),stage.tracks.map(track=>track.id));
  for(const track of deep?stage.tracks:stage.tracks.slice(0,1))await readTrack(chart,track);
  assert.deepEqual(await chart.locator('[data-science-product]').evaluateAll(buttons=>buttons.map(button=>button.getAttribute('data-science-product'))),stage.productIds);
 }
 const panel=chart.locator('.science-evidence');await panel.locator(':scope>summary').click();
 for(const item of definition.evidence)await panel.getByText(item.text,{exact:true}).waitFor();
 const values=await panel.innerText();await mode(chart,'stress');assert.equal(await panel.innerText(),values,'Mode cannot rewrite observational or experimental evidence');
 await mode(chart,'support');await panel.locator(':scope>summary').click();
}
async function completeImage(view:Locator,label:string){
 const image=view.locator('img');await image.evaluate(async el=>{await (el as HTMLImageElement).decode();});
 const result=await image.evaluate(el=>{const image=el as HTMLImageElement,box=image.getBoundingClientRect(),frame=image.closest('.pdf-visual')!.getBoundingClientRect(),scale=Math.min(box.width/image.naturalWidth,box.height/image.naturalHeight),width=image.naturalWidth*scale,height=image.naturalHeight*scale,left=box.left+(box.width-width)/2,top=box.top+(box.height-height)/2;return {fit:getComputedStyle(image).objectFit,visible:width>0&&height>0&&left>=frame.left-1&&top>=frame.top-1&&left+width<=frame.right+1&&top+height<=frame.bottom+1};});
 assert.deepEqual(result,{fit:'contain',visible:true},label);
}
async function gallery(page:Page,keynote:Locator,deck:ThematicDeck){
 const drawer=keynote.locator(`[data-deck-gallery="${deck.id}"]`);await drawer.locator(':scope>summary').click();
 await drawer.locator('[data-gallery-page]').first().waitFor();
 assert.deepEqual(await drawer.locator('[data-gallery-page]').evaluateAll(buttons=>buttons.map(button=>button.getAttribute('data-gallery-page'))),deck.pages.map(slide=>slide.id));
 await completeImage(drawer.locator('.pdf-visual'),`${deck.id}: first source preview`);
 const last=deck.pages.at(-1)!;await drawer.locator(`[data-gallery-page="${last.id}"]`).click();await completeImage(drawer.locator('.pdf-visual'),`${deck.id}: last source preview`);
 await drawer.getByRole('button',{name:'點擊全螢幕放大',exact:true}).click();const lightbox=page.locator('.visual-lightbox');await lightbox.waitFor();
 await completeImage(lightbox.locator('.pdf-visual'),`${deck.id}: full source image`);
 assert.match(await lightbox.locator('.visual-provenance a').getAttribute('href')||'',new RegExp(`#page=${last.pdfPageNumber}$`));
 await page.keyboard.press('Escape');await drawer.getByRole('button',{name:'國語語音導讀',exact:true}).click();
 await anonymous(drawer);await noOverflow(drawer,`${deck.id}: source gallery`);await drawer.locator(':scope>summary').click();
}
async function audit(page:Page,chart:Locator,width:number,module:string,state:string){
 await anonymous(chart);await noOverflow(chart,`${width}px ${module} ${state}`);
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();audits.push({width,module,state,violations:result.violations});
 await writeFile('test-results/science-modules-accessibility.json',JSON.stringify(audits,null,2));
 await chart.locator('.science-toolbar').scrollIntoViewIfNeeded();await page.screenshot({path:`test-results/science-${module}-${width}-${state}.png`});
}
async function openKeynote(page:Page){await page.locator('.header-ppt').click();const keynote=page.locator('.thematic-keynote-dialog');await keynote.waitFor();return keynote;}

try{
 for(const width of [1440,768,390]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage();page.setDefaultTimeout(25000);
  const errors:string[]=[],missing:string[]=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});page.on('response',response=>{if(response.url().startsWith(base)&&response.status()>=400)missing.push(response.url());});
  await page.addInitScript({content:`window.scienceSpeech=[];Object.defineProperty(window,'speechSynthesis',{value:{speak:u=>window.scienceSpeech.push({text:u.text,lang:u.lang,rate:u.rate}),cancel:()=>{},pause:()=>{},resume:()=>{},getVoices:()=>[]}});`});
  await page.goto(base,{waitUntil:'networkidle'});let keynote=await openKeynote(page);
  await keynote.locator('.homocysteine-master').waitFor();assert.equal(await keynote.locator('.pdf-filmstrip').count(),0,'Normal launch opens the interactive first topic');
  for(const definition of definitions){
   const chart=await moduleView(keynote,definition);assert.equal(await chart.getAttribute('data-science-mode'),'support');assert.equal(await chart.getAttribute('data-science-motion'),'reduced');assert.equal(await chart.locator('animateMotion,animateTransform,animate').count(),0);
   const initialScene=await chart.locator('[data-science-scene]').first().innerHTML();await mode(chart,'stress');assert.notEqual(await chart.locator('[data-science-scene]').first().innerHTML(),initialScene,`${definition.id}: modes must change the visual scene`);
   if(definition.id==='endocrine'){assert.equal(await chart.locator('[data-endocrine-channel=gaba]').getAttribute('data-channel-state'),'lower');assert.equal(await chart.locator('[data-endocrine-channel=nmda]').getAttribute('data-channel-state'),'increased');}
   if(definition.id==='resolution')assert.equal(await chart.locator('[data-resolution-myelin]').getAttribute('data-resolution-myelin'),'damaged');
   await chart.locator('[data-science-state=support]').focus();await page.keyboard.press('Enter');assert.equal(await chart.getAttribute('data-science-mode'),'support');
   if(definition.id==='toxin'){assert.equal(await chart.locator('[data-toxin-observation]').count(),5);for(const observation of toxinObservations){await chart.locator(`[data-toxin-observation="${observation.id}"]`).click();await chart.getByText(observation.detail,{exact:true}).waitFor();}}
   await chart.getByRole('button',{name:'聽本段導讀',exact:true}).click();await explore(chart,definition,width===1440);await audit(page,chart,width,definition.id,'support');
  }
  for(const deck of thematicDecks){
   await keynote.locator(`#deck-tab-${deck.id}`).click();
   const selector=deck.id==='longevity-6'?'.gut-brain-master':['longevity-1','longevity-5'].includes(deck.id)?'.homocysteine-master':'.science-module-master';
   await keynote.locator(selector).waitFor();assert.equal(await keynote.locator('.homocysteine-master,.gut-brain-master,.science-module-master').count(),1,'Exactly one simulator per selected topic');assert.equal(await keynote.locator('.pdf-filmstrip').count(),0);await gallery(page,keynote,deck);
   await keynote.getByRole('button',{name:'科學圖解',exact:true}).click();assert.equal(await keynote.locator('.pdf-filmstrip>button').count(),deck.pageCount);
   await keynote.locator('.pdf-filmstrip>button').last().click();assert.equal(await keynote.locator('.slide-counter').innerText(),`${deck.pageCount} / ${deck.pageCount}`);
   await keynote.locator(`#deck-tab-${deck.id}`).click();await keynote.locator(selector).waitFor();assert.equal(await keynote.locator('[data-deck-gallery][open]').count(),0,'Returning to a deck starts with a compact source drawer');
  }
  await page.keyboard.press('Escape');
  if(width===1440){
   const destinations=new Map<string,{definition:ScienceModuleDefinition;stageId:string}>();for(const definition of definitions)for(const stage of definition.stages)for(const id of stage.productIds)if(!destinations.has(id))destinations.set(id,{definition,stageId:stage.id});
   for(const [id,{definition,stageId}] of destinations){
    keynote=await openKeynote(page);const chart=await moduleView(keynote,definition);await chart.locator(`[data-science-stage="${stageId}"]`).click();await chart.locator(`[data-science-product="${id}"]`).click();
    await page.locator('.product-deck').waitFor();assert.equal(await page.locator('#product-select').inputValue(),id);assert.equal(await page.locator('.product-intro h2').innerText(),productById.get(id)!.name);await page.locator(`.island-label[data-product-id="${id}"][aria-pressed="true"]`).waitFor({state:'attached'});await page.getByRole('button',{name:'全島總覽',exact:true}).click();
   }
  }
  await page.getByRole('button',{name:'三個健康故事專區',exact:true}).click();const hub=page.locator('.triangle-dialog');await hub.waitFor();const sourceCard=hub.locator('.mechanism-card').first();await sourceCard.locator(':scope>summary').click();await sourceCard.getByRole('button',{name:'開啟對應簡報',exact:true}).click();keynote=page.locator('.thematic-keynote-dialog');await keynote.locator('.pdf-filmstrip').waitFor();assert.equal(await keynote.getByRole('button',{name:'科學圖解',exact:true}).getAttribute('aria-pressed'),'true','A requested source page must bypass the default simulator');assert.equal(await keynote.locator('#deck-tab-longevity-6').getAttribute('aria-selected'),'true');await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'字體大小：100%，點選切換'}).click();await page.getByRole('button',{name:'字體大小：125%，點選切換'}).click();keynote=await openKeynote(page);
  for(const definition of definitions){const chart=await moduleView(keynote,definition);await noOverflow(chart,`${definition.id} ${width}px 140%`);await chart.locator(`[data-science-stage="${definition.stages.at(-1)!.id}"]`).click();await readTrack(chart,definition.stages.at(-1)!.tracks[0]);await audit(page,chart,width,definition.id,'large');}
  const speech=await page.evaluate(()=>(window as unknown as {scienceSpeech:{text:string;lang:string;rate:number}[]}).scienceSpeech);assert.equal(speech.length,9);for(const utterance of speech){assert.equal(utterance.lang,'zh-TW');assert.ok(Math.abs(utterance.rate-.92)<.00001);}
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);await context.close();console.log(`${width}px: three modules, six default simulators, 147 source pages, full-image gallery, product routes and 140% passed.`);
 }
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'}),page=await context.newPage();await page.goto(base,{waitUntil:'networkidle'});const keynote=await openKeynote(page);
 for(const definition of definitions){
  const chart=await moduleView(keynote,definition);await mode(chart,'stress');await chart.locator('[data-science-pause]').click();assert.equal(await chart.getAttribute('data-science-motion'),'paused');assert.equal(await chart.locator('animateMotion,animateTransform,animate').count(),0);
  await chart.locator('[data-science-pause]').click();assert.equal(await chart.getAttribute('data-science-motion'),'running');
  const motion=chart.locator('[data-science-scene] animateMotion').first();await motion.waitFor({state:'attached'});
  const before=await motion.evaluate(el=>{const p=el.parentElement as unknown as SVGGraphicsElement,m=p.getCTM()!;return {x:m.e,y:m.f};});await page.waitForTimeout(300);const after=await motion.evaluate(el=>{const p=el.parentElement as unknown as SVGGraphicsElement,m=p.getCTM()!;return {x:m.e,y:m.f};});assert.ok(Math.hypot(after.x-before.x,after.y-before.y)>.1,`${definition.id}: scene particles must actually move`);
  await mode(chart,'support');assert.ok(await chart.locator('[data-science-scene] animateMotion').count()>0);
 }
 await context.close();assert.ok(audits.every(result=>result.violations.length===0),'Accessibility failures: test-results/science-modules-accessibility.json');
}finally{await browser.close();}
