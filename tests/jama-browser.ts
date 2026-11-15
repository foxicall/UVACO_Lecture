import {chromium,type Locator,type Page} from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {earlyNutritionStudy as study} from '../src/data/early-nutrition-jama';
import type {NutritionStrategy} from '../src/data/early-nutrition-types';
import {products,productById} from '../src/data/uvaco-products';
import policy from '../scripts/source-redaction-policy.json';

const base=process.env.TEST_BASE_URL||'http://localhost:3002';
const audits:{width:number;state:string;violations:unknown[]}[]=[];
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
await mkdir('test-results',{recursive:true});

async function chart(scope:Locator){const result=scope.locator('.jama-early-master');await result.waitFor();return result;}
async function anonymous(scope:Locator){
 const text=(await scope.innerText()).toLowerCase();
 for(const token of [...policy.names,...policy.phrases,'吳教授'])assert.ok(!text.includes(token.toLowerCase()),`Excluded attribution: ${token}`);
}
async function noProducts(scope:Locator){
 assert.equal(await scope.locator('[data-jama-product]').count(),0,'Product links appear only in the third story act');
 const text=await scope.innerText();for(const product of products)assert.ok(!text.includes(product.name),`Early clinical explanation contains a product name: ${product.name}`);
 await anonymous(scope);
}
async function noOverflow(scope:Locator,label:string){
 const result=await scope.evaluate(el=>({page:document.documentElement.scrollWidth>innerWidth+1,chart:el.scrollWidth>el.clientWidth+1,clipped:[...el.querySelectorAll<HTMLElement>('button')].filter(button=>button.offsetWidth&&button.scrollWidth>button.clientWidth+1).map(button=>button.textContent)}));
 assert.deepEqual(result,{page:false,chart:false,clipped:[]},label);
 const short=await scope.locator('button').evaluateAll(buttons=>buttons.filter(button=>button.getBoundingClientRect().width&&button.getBoundingClientRect().height<59).map(button=>button.textContent));
 assert.deepEqual(short,[],`${label}: control shorter than 60px`);
}
async function select(scope:Locator,strategy:NutritionStrategy){
 await scope.locator(`[data-jama-strategy-option="${strategy}"]`).click();
 assert.equal(await scope.getAttribute('data-jama-strategy'),strategy);
 assert.equal(await scope.locator(`[data-jama-strategy-option="${strategy}"]`).getAttribute('aria-pressed'),'true');
}
async function endpoints(scope:Locator){
 assert.equal(await scope.locator('[data-jama-endpoint]').count(),2);
 const values:unknown[]=[];
 for(const endpoint of study.endpoints){
  const card=scope.locator(`[data-jama-endpoint="${endpoint.id}"]`);await card.waitFor();
  for(const arm of ['early','routine'] as const){
   const row=card.locator(`[data-jama-arm="${arm}"]`);assert.equal(await row.count(),1);
   const risk=Number(await row.getAttribute('data-risk'));
   const expected=endpoint.events[arm]/study.strategies[arm].n*100;
   assert.ok(Math.abs(risk-expected)<.051,`${endpoint.id}/${arm}: plotted risk must match its numerator and denominator`);
   const text=await card.locator(`[data-jama-group="${arm}"] [data-jama-count]`).innerText();assert.match(text,new RegExp(`${endpoint.events[arm]}\\s*[/／]\\s*${study.strategies[arm].n}`),`${endpoint.id}/${arm}: show event counts with the percentage`);
   values.push({endpoint:endpoint.id,arm,risk});
  }
 }
 return values;
}
async function controls(scope:Locator){
 assert.equal(await scope.getAttribute('data-jama-strategy'),'early');
 assert.equal(await scope.getAttribute('data-jama-motion'),'reduced');
 assert.equal(await scope.locator('animate,animateMotion,animateTransform').count(),0);
 const primary=study.endpoints.find(endpoint=>endpoint.id==='weight')!;
 for(const arm of ['early','routine'] as const){
  const summary=scope.locator(`[data-jama-summary-arm="${arm}"] strong`);
  assert.equal(await summary.innerText(),`${(primary.events[arm]/study.strategies[arm].n*100).toFixed(1)}%`,'The headline compares the two observed trial groups');
 }
 const initial=await endpoints(scope);
 await select(scope,'routine');assert.deepEqual(await endpoints(scope),initial,'Strategy selection highlights evidence without changing observed trial results');
 await scope.locator('[data-jama-strategy-option=early]').focus();await scope.page().keyboard.press('Enter');
 assert.equal(await scope.getAttribute('data-jama-strategy'),'early');assert.deepEqual(await endpoints(scope),initial);
 const sizes=await scope.evaluate(el=>[...el.querySelectorAll('p')].filter(p=>p.offsetWidth&&p.offsetHeight).map(p=>parseFloat(getComputedStyle(p).fontSize)));
 assert.ok(sizes.some(size=>size>=22),'Main explanation must use senior-readable body type');
}
async function sourceDetails(scope:Locator){
 const summaries=scope.locator('details>summary');
 for(let i=0;i<await summaries.count();i++){const summary=summaries.nth(i);if(await summary.evaluate(el=>!(el.parentElement as HTMLDetailsElement).open))await summary.click();}
 await scope.getByText(study.economics.context,{exact:true}).waitFor();
 for(const insight of study.insights)await scope.getByText(insight.body,{exact:true}).waitFor();
 for(const source of study.sources){const link=scope.locator('a').filter({hasText:source.label});assert.ok(await link.count()>0,source.label);assert.equal(await link.first().getAttribute('href'),source.url);}
 await scope.getByText(study.bridge,{exact:true}).waitFor();
 const context=await scope.getByText(study.economics.context,{exact:true}).innerText();
 await select(scope,'routine');assert.equal(await scope.getByText(study.economics.context,{exact:true}).innerText(),context);await select(scope,'early');
}
async function audit(page:Page,scope:Locator,width:number,state:string){
 await anonymous(scope);await noOverflow(scope,`${width}px ${state}`);
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();audits.push({width,state,violations:result.violations});
 await writeFile('test-results/jama-accessibility.json',JSON.stringify(audits,null,2));
 await scope.locator('[data-jama-strategy-option=early]').scrollIntoViewIfNeeded();
 await page.screenshot({path:`test-results/jama-${width}-${state}.png`});
}
async function openKeynote(page:Page){await page.locator('.header-ppt').click();const keynote=page.locator('.thematic-keynote-dialog');await keynote.waitFor();return keynote;}
async function openJama(page:Page){const keynote=await openKeynote(page);await keynote.getByRole('button',{name:/JAMA.*2026/}).click();return {keynote,study:await chart(keynote)};}
async function productDestination(page:Page,id:string){
 await page.locator('.product-deck').waitFor();assert.equal(await page.locator('#product-select').inputValue(),id);
 assert.equal(await page.locator('.product-intro h2').innerText(),productById.get(id)!.name);
 await page.locator(`.island-label[data-product-id="${id}"][aria-pressed=true]`).waitFor({state:'attached'});
}

try{
 for(const width of [1440,768,390]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'}),page=await context.newPage();page.setDefaultTimeout(25000);
  const errors:string[]=[],missing:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  page.on('response',response=>{if(response.url().startsWith(base)&&response.status()>=400)missing.push(response.url());});
  await page.addInitScript({content:`window.jamaSpeech=[];Object.defineProperty(window,'speechSynthesis',{value:{speak:u=>window.jamaSpeech.push({text:u.text,lang:u.lang,rate:u.rate}),cancel:()=>{},pause:()=>{},resume:()=>{},getVoices:()=>[]}});`});
  await page.goto(base,{waitUntil:'networkidle'});
  let {keynote,study:module}=await openJama(page);
  await controls(module);await sourceDetails(module);
  assert.equal(await module.locator('[data-jama-action]').count(),4);
  const linked=await module.locator('[data-jama-product]').evaluateAll(buttons=>buttons.map(button=>button.getAttribute('data-jama-product')));
  assert.deepEqual([...new Set(linked)].sort(),products.map(product=>product.id).sort());
  await module.locator('.voice-button').click();await audit(page,module,width,'keynote');
  await keynote.locator('#deck-tab-longevity-4').click();await keynote.locator('[data-science-module=resolution]').waitFor();assert.equal(await keynote.locator('.jama-early-master').count(),0);
  await keynote.getByRole('button',{name:'科學圖解',exact:true}).click();await keynote.locator('.pdf-filmstrip>button').nth(2).click();const selected=await keynote.locator('.pdf-filmstrip>[aria-current=page]').getAttribute('data-page-id');
  await keynote.getByRole('button',{name:/JAMA.*2026/}).click();await chart(keynote);await keynote.getByRole('button',{name:'返回原專題',exact:true}).click();
  assert.equal(await keynote.locator('.pdf-filmstrip>[aria-current=page]').getAttribute('data-page-id'),selected,'Opening clinical evidence should preserve the selected source page');await page.keyboard.press('Escape');
  for(const title of ['人體修復能力','慢性發炎']){
   await page.locator('.pillar-segments').getByRole('button',{name:title,exact:true}).click();const story=page.locator('.pillar-story-dialog');
   assert.equal(await story.locator('.jama-early-master').count(),0);
   await story.getByRole('button',{name:'接著，看身體怎麼了',exact:true}).click();const explanation=await chart(story);await noProducts(explanation);await endpoints(explanation);
   await story.getByRole('button',{name:'再來，認識照顧與原料',exact:true}).click();const action=await chart(story);assert.ok(await action.locator('[data-jama-product]').count()>0);
   if(width===1440){await action.locator('[data-jama-product="995"]').first().click();await productDestination(page,'995');await page.getByRole('button',{name:'全島總覽',exact:true}).click();}else await page.keyboard.press('Escape');
  }
  for(const id of ['995','360']){
   await page.locator('#product-select').selectOption(id);const drawer=page.locator('.product-deck'),disclosure=drawer.locator('.product-jama-evidence');
   assert.equal(await disclosure.getAttribute('open'),null);await disclosure.locator(':scope>summary').click();const embedded=await chart(disclosure);await controls(embedded);await audit(page,embedded,width,`product-${id}`);
   await disclosure.locator(':scope>summary').click();await disclosure.locator('.jama-early-master').waitFor({state:'detached'});assert.equal(await disclosure.locator('.jama-early-master').count(),0,'Closed product evidence should release its interactive component');
   await page.getByRole('button',{name:'全島總覽',exact:true}).click();
  }
  if(width===1440){
   for(const id of products.map(product=>product.id)){
    ({keynote,study:module}=await openJama(page));await module.locator(`[data-jama-product="${id}"]`).first().click();await productDestination(page,id);await page.getByRole('button',{name:'全島總覽',exact:true}).click();
   }
   for(const action of study.actions){
    ({keynote,study:module}=await openJama(page));await module.locator(`[data-jama-action-select="${action.id}"]`).click();await productDestination(page,action.productIds[0]);
    assert.equal(await page.locator('.tour-status').innerText(),`1 / ${action.productIds.length} 站`,'The action card opens its complete product route');await page.getByRole('button',{name:'全島總覽',exact:true}).click();
   }
  }
  await page.getByRole('button',{name:'字體大小：100%，點選切換'}).click();await page.getByRole('button',{name:'字體大小：125%，點選切換'}).click();
  ({keynote,study:module}=await openJama(page));await controls(module);await audit(page,module,width,'large');await page.keyboard.press('Escape');
  await page.locator('#product-select').selectOption('995');const large=page.locator('.product-jama-evidence');await large.locator(':scope>summary').click();await audit(page,await chart(large),width,'product-large');
  const speech=await page.evaluate(()=>(window as unknown as {jamaSpeech:{text:string;lang:string;rate:number}[]}).jamaSpeech);assert.ok(speech.length>0);for(const utterance of speech){assert.equal(utterance.lang,'zh-TW');assert.ok(Math.abs(utterance.rate-.92)<.00001);}
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);await context.close();console.log(`${width}px: fixed clinical counts, strategy controls, stories, 995/360 drawers, product routes and 140% passed.`);
 }
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'}),page=await context.newPage();await page.goto(base,{waitUntil:'networkidle'});const {study:module}=await openJama(page);
 await module.locator('[data-jama-pause]').click();assert.equal(await module.getAttribute('data-jama-motion'),'paused');
 assert.equal(await module.locator('animate,animateMotion,animateTransform').count(),0);
 await page.waitForTimeout(350);assert.equal(await module.evaluate(el=>el.getAnimations({subtree:true}).filter(animation=>animation.playState==='running').length),0,'Pause stops all in-module animations');
 await module.locator('[data-jama-pause]').click();assert.equal(await module.getAttribute('data-jama-motion'),'running');
 const smil=module.locator('animateMotion');
 if(await smil.count()){
  const before=await smil.first().evaluate(el=>{const matrix=(el.parentElement as unknown as SVGGraphicsElement).getCTM()!;return {x:matrix.e,y:matrix.f};});await page.waitForTimeout(300);const after=await smil.first().evaluate(el=>{const matrix=(el.parentElement as unknown as SVGGraphicsElement).getCTM()!;return {x:matrix.e,y:matrix.f};});assert.ok(Math.hypot(after.x-before.x,after.y-before.y)>.1,'Narrative particles must actually move');
 }else{
  const before=await module.evaluate(el=>el.getAnimations({subtree:true}).filter(animation=>animation.playState==='running').map(animation=>Number(animation.currentTime)));
  assert.ok(before.length>0,'An enabled animation must run');await page.waitForTimeout(200);const after=await module.evaluate(el=>el.getAnimations({subtree:true}).filter(animation=>animation.playState==='running').map(animation=>Number(animation.currentTime)));assert.ok(after.some((time,index)=>time>before[index]));
 }
 await context.close();assert.ok(audits.every(item=>item.violations.length===0),'Accessibility failures: test-results/jama-accessibility.json');
}finally{await browser.close();}
