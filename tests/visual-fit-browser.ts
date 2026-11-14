import {chromium,type Locator} from 'playwright-core';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';

const base=process.env.TEST_BASE_URL||'http://localhost:3002';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']});
await mkdir('test-results',{recursive:true});

/** Check the painted page, not just whether an image loaded successfully.
 * A contained image can still be cropped when its element exceeds its parent. */
async function assertCompleteSlide(view:Locator,label:string){
 const media=view.locator('img,canvas');
 await media.evaluate(async el=>{if(el instanceof HTMLImageElement)await el.decode();});
 const result=await media.evaluate(el=>{
  const bounds=el.getBoundingClientRect(),frame=el.closest('.pdf-visual')!.getBoundingClientRect();
  const width=el instanceof HTMLImageElement?el.naturalWidth:(el as HTMLCanvasElement).width;
  const height=el instanceof HTMLImageElement?el.naturalHeight:(el as HTMLCanvasElement).height;
  const scale=Math.min(bounds.width/width,bounds.height/height);
  const painted={left:bounds.left+(bounds.width-width*scale)/2,top:bounds.top+(bounds.height-height*scale)/2,width:width*scale,height:height*scale};
  return {fit:getComputedStyle(el).objectFit,painted,frame:{left:frame.left,top:frame.top,right:frame.right,bottom:frame.bottom,width:frame.width,height:frame.height}};
 });
 assert.equal(result.fit,'contain',label);
 assert.ok(result.painted.width>0&&result.painted.height>0,`${label}: empty slide`);
 assert.ok(result.painted.left>=result.frame.left-1&&result.painted.top>=result.frame.top-1&&result.painted.left+result.painted.width<=result.frame.right+1&&result.painted.top+result.painted.height<=result.frame.bottom+1,`${label}: slide cropped: ${JSON.stringify(result)}`);
}

async function assertFullscreen(box:Locator,label:string){
 await assertCompleteSlide(box.locator('.pdf-visual'),label);
 const layout=await box.evaluate(el=>{
  const window=el.querySelector('.visual-zoom-window')!.getBoundingClientRect();
  const slide=el.querySelector('.pdf-visual')!.getBoundingClientRect();
  const visible=[el,...el.querySelectorAll('.dialog-heading,.visual-zoom-tools,.visual-provenance')].every(node=>{
   const r=node.getBoundingClientRect();return r.left>=0&&r.top>=0&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1;
  });
  return {visible,height:window.height,fits:slide.left>=window.left-1&&slide.top>=window.top-1&&slide.right<=window.right+1&&slide.bottom<=window.bottom+1,scrolls:el.scrollHeight>el.clientHeight+1};
 });
 assert.ok(layout.visible&&layout.fits&&!layout.scrolls&&layout.height>32,`${label}: fullscreen layout clipped: ${JSON.stringify(layout)}`);
}

try{
 for(const {width,height,large=false} of [{width:1600,height:820},{width:1366,height:650},{width:1024,height:768},{width:390,height:844},{width:844,height:390},{width:390,height:844,large:true}]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
  const page=await context.newPage();page.setDefaultTimeout(30000);
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'networkidle'});
  if(large){await page.getByRole('button',{name:'字體大小：100%，點選切換'}).click();await page.getByRole('button',{name:'字體大小：125%，點選切換'}).click();}
  const label=`${width}×${height}${large?' 140%':''}`;
  await page.getByRole('button',{name:'神經修復',exact:true}).click();
  await assertCompleteSlide(page.locator('.visual-carousel-image .pdf-visual'),`${label} story preview`);
  await page.locator('.visual-carousel .visual-expand').click();
  const box=page.locator('.visual-lightbox');
  await assertFullscreen(box,`${label} landscape image`);
  await box.getByRole('button',{name:'放大原圖',exact:true}).click();
  await page.waitForTimeout(350);
  assert.match(await box.locator('.visual-zoom-content').getAttribute('style')||'',/scale\(1\./);
  await box.getByRole('button',{name:'適合畫面'}).click();await page.waitForTimeout(350);
  await assertFullscreen(box,`${label} reset to fit`);
  await box.getByRole('button',{name:'以 PDF 繪製'}).click();
  await box.locator('[data-pdf-state=ready]').waitFor({timeout:60000});
  await assertFullscreen(box,`${label} landscape PDF canvas`);
  await page.screenshot({path:`test-results/slide-fit-landscape-${width}-${height}${large?'-large':''}.png`});
  await page.keyboard.press('Escape');await page.keyboard.press('Escape');
  await page.locator('#product-select').selectOption('huoyi');
  await assertCompleteSlide(page.locator('.product-deck .pdf-visual'),`${label} product preview`);
  await page.getByRole('button',{name:'全島總覽',exact:true}).click();
  await page.locator('.header-ppt').click();
  await page.locator('#deck-tab-longevity-3').click();
  await assertCompleteSlide(page.locator('.pdf-keynote-image .pdf-visual'),`${label} portrait preview`);
  await page.getByRole('button',{name:'全螢幕播放',exact:true}).click();
  await assertFullscreen(box,`${label} portrait image`);
  await box.getByRole('button',{name:'以 PDF 繪製'}).click();
  await box.locator('[data-pdf-state=ready]').waitFor({timeout:60000});
  await assertFullscreen(box,`${label} portrait PDF canvas`);
  if(width===390&&!large){
   await page.setViewportSize({width:844,height:390});
   await page.waitForTimeout(500);await box.locator('[data-pdf-state=ready]').waitFor({timeout:60000});
   await assertFullscreen(box,'rotate device to landscape');
  }
  await page.screenshot({path:`test-results/slide-fit-portrait-${width}-${height}${large?'-large':''}.png`});
  assert.deepEqual(errors,[]);
  await context.close();console.log(`${label}: entire landscape/portrait images and PDFs fit; previews, zoom/reset and controls passed.`);
 }
}finally{await browser.close();}
