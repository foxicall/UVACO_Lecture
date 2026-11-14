import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const base=process.env.TEST_BASE_URL||'http://localhost:3002';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
await mkdir('test-results',{recursive:true});
try {
 for(const width of [1440,768,390]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'no-preference'});
  const page=await context.newPage();page.setDefaultTimeout(20000);
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelectorAll('.island-label').length===12);
  const shell=page.locator('.canvas-shell');
  assert.equal(await shell.getAttribute('data-scene-scale'),'1.48');
  assert.equal(await shell.getAttribute('data-landmark-scale'),'1.35');
  const angle=async()=>Number(await shell.getAttribute('data-rotation'));
  const moving=async()=>{const before=await angle();await page.waitForTimeout(500);assert.ok(await angle()>before+.005,'Turntable advances while enabled');};
  const stopped=async()=>{await page.waitForTimeout(100);const before=await angle();await page.waitForTimeout(300);assert.equal(await angle(),before,'Reading or interaction must pause the turntable');};
  const layout=async()=>{
   const result=await page.locator('.roof-badges').evaluate(portal=>{
    const bounds=portal.getBoundingClientRect();
    const labels=Array.from(portal.querySelectorAll<HTMLButtonElement>('.landmark-label[data-label-visible=true]'));
    const boxes=labels.map(label=>({id:label.dataset.productId,box:label.querySelector('.landmark-badge')!.getBoundingClientRect()}));
    return {count:labels.length,fonts:labels.map(label=>getComputedStyle(label.querySelector('.landmark-badge')!).fontSize),clipped:boxes.filter(({box})=>box.left<bounds.left||box.right>bounds.right||box.top<bounds.top||box.bottom>bounds.bottom).map(b=>b.id),overlaps:boxes.flatMap((a,i)=>boxes.slice(i+1).filter(b=>a.box.left<b.box.right&&a.box.right>b.box.left&&a.box.top<b.box.bottom&&a.box.bottom>b.box.top).map(b=>[a.id,b.id]))};
   });
   assert.ok(result.count>=4,'Narrow-screen collision avoidance retains multiple readable roof badges');
   assert.deepEqual([...new Set(result.fonts)],['12px']);assert.deepEqual(result.clipped,[]);assert.deepEqual(result.overlaps,[]);
  };
  await moving();await layout();
  await page.getByRole('button',{name:'暫停自動旋轉',exact:true}).click();await stopped();
  const firstPosition=await page.locator('.island-label').first().boundingBox();
  await page.getByRole('button',{name:'開啟自動旋轉',exact:true}).click();await moving();
  await page.waitForTimeout(800);await layout();
  const secondPosition=await page.locator('.island-label').first().boundingBox();
  assert.notDeepEqual(firstPosition,secondPosition,'Roof badges travel with rotating buildings');
  const badge=page.locator('.island-label[data-label-visible=true]').first();
  await badge.focus();await stopped();
  await badge.evaluate(el=>el.blur());await moving();
  await badge.hover({force:true});await stopped();
  await page.mouse.move(2,2);await moving();
  await page.locator('#product-select').selectOption('995');await stopped();
  assert.equal(await page.locator('[data-product-id="995"]').getAttribute('data-label-visible'),'true');
  await page.getByRole('button',{name:'全島總覽',exact:true}).click();await moving();
  await page.getByRole('button',{name:'三個健康故事專區',exact:true}).click();await stopped();
  await page.keyboard.press('Escape');await moving();
  await page.getByRole('button',{name:'暫停自動旋轉',exact:true}).click();await stopped();
  await page.locator('#product-select').selectOption('huoyi');await page.getByRole('button',{name:'全島總覽',exact:true}).click();await stopped();
  await layout();await shell.screenshot({path:`test-results/archipelago-${width}.png`});assert.deepEqual(errors,[]);
  await context.close();console.log(`${width}px: roof attachment, compact collision-free badges, rotation, manual pause, hover/focus pause and reading pause passed.`);
 }
 const context=await browser.newContext({viewport:{width:390,height:1000},reducedMotion:'reduce'});const page=await context.newPage();await page.goto(base,{waitUntil:'networkidle'});await page.getByRole('button',{name:'開啟自動旋轉',exact:true}).waitFor();const angle=await page.locator('.canvas-shell').getAttribute('data-rotation');await page.waitForTimeout(500);assert.equal(await page.locator('.canvas-shell').getAttribute('data-rotation'),angle);await page.getByRole('button',{name:'開啟自動旋轉',exact:true}).click();await page.waitForTimeout(500);assert.notEqual(await page.locator('.canvas-shell').getAttribute('data-rotation'),angle);await context.close();
 console.log('Reduced-motion preference defaults to paused; explicit opt-in works.');
}finally{await browser.close();}
