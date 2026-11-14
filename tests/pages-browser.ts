import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';

const base = (process.env.PAGES_TEST_BASE_URL || 'http://127.0.0.1:8080/UVACO_Lecture').replace(/\/$/, '');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const errors: string[] = [], failedAssets: string[] = [], apiRequests: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) failedAssets.push(response.url()); });
    page.on('request', request => { if (/\/api\/(concierge|clinical-analysis)/.test(request.url())) apiRequests.push(request.url()); });
    const response = await page.goto(`${base}/`, { waitUntil: 'networkidle' });
    assert.equal(response?.status(), 200);
    await page.locator('.island-label').last().waitFor({state:'attached'});
    assert.equal(await page.locator('.island-label').count(), 12);
    await page.getByRole('button', { name: '下一站，講座重點巡禮', exact: true }).click();
    assert.equal(await page.locator('.product-intro h2').innerText(), '995 生技營養品');
    await page.getByRole('button', { name: '💬 問問健康小幫手' }).click();
    await page.getByText('此公開版本提供本機文件導覽，這不是 AI 回答。點選問題，就能閱讀相關資料。').waitFor();
    await page.getByRole('button', { name: '排便不順、肚子脹，想了解腸道產品。' }).click();
    assert.ok((await page.locator('.ai-answer').innerText()).includes('這不是 AI 回答'));
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.product-intro h2').innerText(), '康爾喜');
    await page.getByRole('button', { name: '播放PPT', exact: true }).click();
    await page.getByRole('tab', { name: '居家與環境 4 頁', exact: true }).click();
    assert.equal(await page.locator('.keynote-thumbnails button').count(), 4);
    await page.getByRole('button', { name: '下一頁', exact: true }).click();
    assert.equal(await page.locator('.slide-counter').innerText(), '2 / 4');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: '三個健康故事專區', exact: true }).click();
    await page.getByRole('tab', { name: '我的關注', exact: true }).click();
    await page.locator('input[value=gut]').check();
    await page.getByRole('button', { name: '依文件整理我的關注', exact: true }).click();
    await page.getByText('靜態版文件整理・這不是AI回答', { exact: true }).waitFor();
    assert.equal(await page.locator('.result-products>div').count(), 2);
    await page.locator('.related-slides button').first().click();
    await page.locator('.slide-counter').waitFor();
    assert.equal(await page.locator('.slide-counter').innerText(), '2 / 4');
    await page.keyboard.press('Escape');
    const catalog = await page.goto(`${base}/products/`, { waitUntil: 'networkidle' });
    assert.equal(catalog?.status(), 200);
    assert.equal(await page.locator('.text-catalog article').count(), 12);
    await page.getByRole('link', { name: '← 返回健康群島' }).click();
    await page.waitForURL(`${base}/`);
    assert.deepEqual(apiRequests, [], 'Static guide must not call an unavailable API');
    assert.deepEqual(failedAssets, [], 'Static files must load under the repository base path');
    assert.deepEqual(errors, [], 'Static browser errors');
    console.log(`${width}px: static assets, twelve islands, local guide and base-path navigation passed.`);
    await page.close();
  }
} finally { await browser.close(); }
