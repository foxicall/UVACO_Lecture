import {chromium} from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {visualDecks,pillarVisuals,productVisuals} from '../src/data/visual-assets-manifest';
import {pillars} from '../src/data/lecture-poster';
const base=process.env.TEST_BASE_URL||'http://localhost:3002';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
const reports:unknown[]=[];await mkdir('test-results',{recursive:true});
try{
 for(const width of [1440,768,390]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});const page=await context.newPage();page.setDefaultTimeout(25000);const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript({content:`window.visualVoice=[];Object.defineProperty(window,'speechSynthesis',{value:{speak:u=>window.visualVoice.push({text:u.text,lang:u.lang,rate:u.rate}),cancel:()=>{},pause:()=>{},resume:()=>{},getVoices:()=>[]}});`});
  await page.goto(base,{waitUntil:'networkidle'});
  assert.equal(await page.locator('.ios-header').evaluate(el=>el.getBoundingClientRect().height),48);
  for(const pillar of pillars){
   await page.getByRole('button',{name:pillar.name,exact:true}).click();const story=page.locator('.visual-story-dialog');
   for(let stage=0;stage<3;stage++){
    const img=story.locator('.visual-carousel .pdf-visual>img');await img.waitFor();await img.evaluate(async(el:HTMLImageElement)=>{await el.decode();});
    assert.equal(await img.getAttribute('src'),new URL(base).pathname.replace(/\/$/,'')+`/extracted-slides/${pillarVisuals[pillar.id][stage][0].pageId.replace(/-\d+$/,'')}/page-${String(Number(pillarVisuals[pillar.id][stage][0].pageId.slice(-3))).padStart(2,'0')}.webp`);
    await story.getByRole('button',{name:'聽白話圖解導讀',exact:true}).click();
    if(pillar.id==='repair'&&stage===0){const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();reports.push({width,view:'story',violations:axe.violations});await page.screenshot({path:`test-results/visual-story-${width}.png`});}
    if(stage<2)await story.getByRole('button',{name:stage===0?'接著，看身體怎麼了':'再來，認識照顧與原料'}).click();
   }
   assert.equal(await story.locator('.visual-product-bridges>button').count(),3);
   await story.locator('.visual-product-bridges>button').first().click();await page.locator('.product-deck .visual-carousel').waitFor();await page.getByRole('button',{name:'全島總覽',exact:true}).click();
  }
  for(const id of Object.keys(productVisuals)){await page.locator('#product-select').selectOption(id);await page.locator('.product-deck .pdf-visual img').evaluate(async(el:HTMLImageElement)=>{await el.decode();});await page.locator('.product-deck').getByRole('button',{name:'下一張圖解',exact:true}).click();await page.getByRole('button',{name:'全島總覽',exact:true}).click();}
  await page.locator('.header-ppt').click();const keynote=page.locator('.pdf-keynote-dialog');await keynote.waitFor();
  assert.equal(await keynote.getByRole('tab').count(),9);
  for(const deck of visualDecks){await keynote.getByRole('tab',{name:new RegExp(deck.title)}).click();assert.equal(await keynote.locator('.pdf-filmstrip>button').count(),deck.pageCount);await keynote.locator('.pdf-keynote-image img').evaluate(async(el:HTMLImageElement)=>{await el.decode();});await keynote.locator('.pdf-filmstrip>button').last().click();assert.equal(await keynote.locator('.slide-counter').innerText(),`${deck.pageCount} / ${deck.pageCount}`);await keynote.getByRole('button',{name:'上一頁',exact:true}).click();await page.keyboard.press('Home');assert.equal(await keynote.locator('.slide-counter').innerText(),`1 / ${deck.pageCount}`);}
  await keynote.getByRole('tab',{name:/大腦森林/}).click();await keynote.getByRole('button',{name:'下一頁',exact:true}).click();
  await page.screenshot({path:`test-results/visual-keynote-${width}.png`});const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();reports.push({width,view:'keynote',violations:audit.violations});
  await keynote.getByRole('button',{name:'全螢幕原圖檢視',exact:true}).click();const box=page.locator('.visual-lightbox');await box.getByRole('button',{name:'放大原圖',exact:true}).click();await page.waitForTimeout(300);assert.match(await box.locator('.react-transform-component').getAttribute('style')||'',/scale\(1\./);
  await box.getByRole('button',{name:'適合畫面'}).click();await box.getByRole('button',{name:'以 PDF 繪製'}).click();await box.locator('[data-pdf-state="ready"]').waitFor({timeout:60000});assert.ok(await box.locator('canvas').evaluate(el=>(el as HTMLCanvasElement).width)>=await box.locator('.pdf-live-canvas').evaluate(el=>el.clientWidth)*1.9);await page.screenshot({path:`test-results/visual-pdf-${width}.png`});
  await page.keyboard.press('Escape');assert.equal(await keynote.count(),1);await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false);assert.deepEqual(errors,[]);await context.close();console.log(`${width}px: four storyboards, twelve drawers, nine complete decks, zoom, PDF.js, keyboard and TTS passed.`);
 }
 const context=await browser.newContext({viewport:{width:1280,height:1000}});const page=await context.newPage();await page.route('**/extracted-slides/brain-forest/page-01.webp',r=>r.abort());await page.goto(base,{waitUntil:'networkidle'});await page.locator('.header-ppt').click();await page.getByRole('tab',{name:/大腦森林/}).click();await page.locator('.pdf-keynote-image [data-pdf-state="ready"]').waitFor({timeout:60000});await context.close();console.log('Broken pre-rendered image successfully recovered through the original PDF.');
 await writeFile('test-results/visual-accessibility.json',JSON.stringify(reports,null,2));assert.ok(reports.every((r:any)=>r.violations.length===0),'Accessibility violations: inspect visual-accessibility.json');
}finally{await browser.close();}
