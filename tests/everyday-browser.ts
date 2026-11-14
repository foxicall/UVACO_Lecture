import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { products } from '../src/data/uvaco-products';
import { homepageNote } from '../src/data/everyday-language';
const base=process.env.TEST_BASE_URL||'http://localhost:3002';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
const results:unknown[]=[];
try {
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});const page=await context.newPage();page.setDefaultTimeout(20000);
  await page.goto(base,{waitUntil:'networkidle'});
  assert.equal(await page.getByText(homepageNote,{exact:true}).count(),1);
  assert.equal(await page.locator('.homepage-note').innerText(),homepageNote);
  for(const p of products){
   await page.selectOption('#product-select',p.id);
   await page.locator('.product-intro h2').filter({hasText:p.name}).waitFor();
   assert.equal(await page.locator('.product-deck .science-details').getAttribute('open'),null);
   assert.doesNotMatch(await page.locator('.product-deck').innerText(),/SOD|GABA|MFSD2A|NGF|BDNF|不保證療效|非藥品|僅供參考|不能取代/);
   await page.getByRole('tab',{name:'原料小故事',exact:true}).click();
   assert.doesNotMatch(await page.locator('.product-deck').innerText(),/SOD|GABA|MFSD2A|NGF|BDNF|不保證療效|非藥品|僅供參考|不能取代/);
  }
  await page.selectOption('#product-select','995');
  await page.locator('.product-deck .science-details>summary').click();
  assert.match(await page.locator('.product-deck .science-content').innerText(),/SOD/);
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag2aaa']).analyze();results.push({width,state:'science-open',violations:audit.violations});
  await page.locator('.product-deck .science-details>summary').click();
  await page.screenshot({path:`test-results/everyday-${width}.png`,fullPage:true});
  await page.locator('.homepage-note').scrollIntoViewIfNeeded();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const footerAudit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag2aaa']).analyze();results.push({width,state:'footer',violations:footerAudit.violations});
  await context.close();console.log(`${width}px: twelve plain product stories, optional source detail and single homepage note passed.`);
 }
 await writeFile('test-results/everyday-accessibility.json',JSON.stringify(results,null,2));
 assert.deepEqual(results.flatMap((r:any)=>r.violations),[]);
}finally{await browser.close();}
