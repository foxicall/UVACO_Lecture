import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir,writeFile } from 'node:fs/promises';
import { pillars } from '../src/data/lecture-poster';
import { pillarStories } from '../src/data/four-pillars-story';
import { productById } from '../src/data/uvaco-products';
const base=process.env.TEST_BASE_URL||'http://localhost:3002';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
const reports:unknown[]=[];await mkdir('test-results',{recursive:true});
try{
 for(const width of [1440,768,390]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage();page.setDefaultTimeout(20000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript({content:`window.storyVoice=[];Object.defineProperty(window,'speechSynthesis',{value:{speak:u=>window.storyVoice.push({text:u.text,lang:u.lang,rate:u.rate}),cancel:()=>{},pause:()=>{},resume:()=>{},getVoices:()=>[]}});`});
  await page.goto(base,{waitUntil:'networkidle'});await page.locator('.island-label').last().waitFor({state:'attached'});
  assert.equal(await page.locator('.product-deck').count(),0);
  assert.equal(await page.locator('.ios-header').evaluate(el=>el.getBoundingClientRect().height),48);
  assert.equal(await page.locator('.pillar-segments').evaluate(el=>el.scrollWidth>el.clientWidth),false);
  const audit=async(stage:number)=>{const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag2aaa']).analyze();reports.push({width,stage,violations:result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});};
  for(const [index,pillar] of pillars.entries()){
   await page.getByRole('button',{name:pillar.name,exact:true}).click();const sheet=page.locator('.pillar-story-dialog');await sheet.waitFor();
   assert.equal(await sheet.locator('.story-stage').getAttribute('data-stage'),'1');assert.equal(await page.locator('.product-deck').count(),0);assert.equal(await sheet.locator('.product-bridges').count(),0);
   assert.equal(await sheet.locator('.story-steps button').nth(2).isDisabled(),true);
   const symptom=sheet.getByRole('checkbox').first();await symptom.check();assert.equal(await symptom.isChecked(),true);
   await sheet.getByRole('button',{name:'聽語音導覽',exact:true}).click();
   if(index===0){await audit(1);await page.screenshot({path:`test-results/story-${width}-1.png`});}
   await sheet.getByRole('button',{name:'接著，看身體怎麼了'}).click();
   assert.equal(await sheet.locator('.story-stage').getAttribute('data-stage'),'2');assert.equal(await sheet.locator('.product-bridges').count(),0);assert.equal(await sheet.locator('.science-details').getAttribute('open'),null);
   for(const chemical of pillarStories[pillar.id].chemicals){await sheet.getByRole('button',{name:new RegExp(chemical.name)}).click();assert.equal(await sheet.locator('.chemical-story h4').innerText(),chemical.metaphor);assert.equal(await sheet.locator('.chemical-flow li').count(),3);}
   if(index===0){await audit(2);await page.screenshot({path:`test-results/story-${width}-2.png`});}
   await sheet.getByRole('button',{name:'上一幕',exact:true}).click();assert.equal(await sheet.getByRole('checkbox').first().isChecked(),true);
   await sheet.getByRole('button',{name:'接著，看身體怎麼了'}).click();await sheet.getByRole('button',{name:'再來，認識照顧與原料'}).click();
   assert.equal(await sheet.locator('.product-bridges>button').count(),3);
   if(index===0){await audit(3);await page.screenshot({path:`test-results/story-${width}-3.png`});}
   const target=pillarStories[pillar.id].bridges[0].productId;await sheet.locator('.product-bridges>button').first().click();
   await page.locator('.product-deck').waitFor();assert.equal(await page.locator('.product-intro h2').innerText(),productById.get(target)!.name);assert.equal(await page.getByRole('tab',{name:'身體的需要',exact:true}).getAttribute('aria-selected'),'true');await page.getByRole('heading',{name:'為什麼身體需要它？',exact:true}).waitFor();
   assert.equal(await page.locator('.canvas-shell').getAttribute('data-rotating'),'false');assert.equal(await page.locator(`[data-product-id="${target}"]`).getAttribute('aria-pressed'),'true');
   await page.getByRole('button',{name:'全島總覽',exact:true}).click();
  }
  await page.getByRole('button',{name:'下一站，講座重點巡禮',exact:true}).click();assert.equal(await page.locator('.pillar-story-dialog .story-stage').getAttribute('data-stage'),'1');assert.equal(await page.locator('.product-deck').count(),0);await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('button',{name:'下一站，講座重點巡禮',exact:true}).evaluate(el=>el===document.activeElement),true);
  await page.getByRole('button',{name:'字體大小：100%，點選切換'}).click();await page.getByRole('button',{name:'字體大小：125%，點選切換'}).click();await page.getByRole('button',{name:'自律神經',exact:true}).click();
  for(let stage=1;stage<=3;stage++){assert.equal(await page.locator('.pillar-story-dialog').evaluate(el=>el.scrollWidth>el.clientWidth+1),false,`Story overflow at ${width}/140%/stage${stage}`);if(stage<3)await page.getByRole('button',{name:stage===1?'接著，看身體怎麼了':'再來，認識照顧與原料'}).click();}
  await page.screenshot({path:`test-results/story-${width}-large.png`});await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'字體大小：140%，點選切換'}).click();
  const voices=await page.evaluate(()=>(window as any).storyVoice);assert.equal(voices.length,4);assert.ok(voices.every((v:any)=>v.lang==='zh-TW'&&Math.abs(v.rate-.92)<.00001));
  assert.equal(await page.locator('.homepage-note').count(),1);assert.deepEqual(errors,[]);await context.close();console.log(`${width}px: all four stories, staged product access, chemical diagrams, source context, voice, focus return and 140% font passed.`);
 }
 await writeFile('test-results/pillar-story-accessibility.json',JSON.stringify(reports,null,2));assert.deepEqual(reports.flatMap((r:any)=>r.violations),[]);
}finally{await browser.close();}
