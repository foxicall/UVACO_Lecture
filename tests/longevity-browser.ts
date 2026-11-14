import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { longevityDecks } from '../src/data/longevity-decks-manifest';

const base = process.env.TEST_BASE_URL || 'http://localhost:3002';
await mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
const report: unknown[] = [];
try {
  for (const width of [1440, 768, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    const errors: string[] = [], failures: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.url().includes('/longevity-pdf-assets/') && response.status() >= 400) failures.push(response.url()); });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('.island-label').last().waitFor();
    await page.getByRole('button', { name: '六大長壽簡報播放', exact: true }).click();
    for (const deck of longevityDecks) {
      await page.getByRole('tab', { name: `${deck.shortTitle} ${deck.slides.length} 頁`, exact: true }).click();
      for (const [index, slide] of deck.slides.entries()) {
        await page.locator('.keynote-thumbnails button').nth(index).click();
        assert.equal(await page.locator('.longevity-summary h3').innerText(), slide.title);
        await page.locator('.slide-visual-button img').evaluate(async (img: HTMLImageElement) => { if (!img.complete) await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = reject; }); });
        assert.equal(await page.locator('.slide-visual-button img').evaluate((img: HTMLImageElement) => img.naturalWidth), 1600);
        assert.equal(await page.locator('.longevity-workspace').evaluate(el => el.scrollWidth > el.clientWidth + 1), false);
        const content = await page.locator('.keynote-player').innerText();
        assert.doesNotMatch(content, /歐瀚文|歐忠儒|王偉全|洪佳琪|劉士銘|王凱瑜|放大原圖/);
        if (deck.number === 2) assert.match(content, /PDF 尚未提供/);
      }
    }
    await page.getByRole('tab', { name: '發炎消退 4 頁', exact: true }).click();
    await page.screenshot({ path: `test-results/longevity-${width}.png` });
    if (width === 1440) {
      const ratio = await page.locator('.longevity-workspace').evaluate(el => el.children[0].getBoundingClientRect().width / el.children[1].getBoundingClientRect().width);
      assert.ok(Math.abs(ratio - 55 / 45) < .02);
    }
    await page.locator('.slide-visual-button').click();
    await page.getByRole('button', { name: '放大圖解比例', exact: true }).click();
    assert.match(await page.locator('.diagram-zoom-controls').innerText(), /150%/);
    await page.locator('.diagram-pan').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('.slide-counter').innerText(), '1 / 4');
    await page.getByRole('button', { name: '適合畫面', exact: true }).click();
    assert.match(await page.locator('.diagram-zoom-controls').innerText(), /100%/);
    await page.screenshot({ path: `test-results/longevity-${width}-zoom.png` });
    const zoomAxe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag2aaa']).analyze();
    report.push({ width, state: 'zoom', violations: zoomAxe.violations });
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.diagram-lightbox').count(), 0);
    assert.equal(await page.locator('.keynote-player').count(), 1);
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag2aaa']).analyze();
    report.push({ width, state: 'player', violations: axe.violations });
    await page.getByRole('button', { name: '關閉簡報播放器', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: '六大長壽簡報播放', exact: true }).evaluate(el => el === document.activeElement), true);
    await page.getByRole('button', { name: '字體大小：100%，點選切換' }).click();
    await page.getByRole('button', { name: '字體大小：125%，點選切換' }).click();
    await page.getByRole('button', { name: '六大長壽簡報播放', exact: true }).click();
    await page.screenshot({ path: `test-results/longevity-${width}-large.png` });
    assert.equal(await page.locator('.keynote-player').evaluate(el => el.scrollWidth > el.clientWidth + 1), false);
    await page.getByRole('button', { name: '在群島比較本頁產品', exact: true }).click();
    assert.equal(await page.locator('.product-intro h2').innerText(), '995 生技營養品');
    assert.deepEqual(failures, []);
    assert.deepEqual(errors, []);
    console.log(`${width}px: six decks, all 22 diagrams, lightbox, attribution, 140% font and product navigation passed.`);
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
  const page = await context.newPage();
    page.setDefaultTimeout(20000);
  await page.route('**/longevity-pdf-assets/**', route => route.abort());
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '六大長壽簡報播放', exact: true }).click();
  await page.locator('.diagram-fallback').waitFor();
  assert.equal(await page.locator('.diagram-fallback p').count(), 4);
  assert.ok((await page.locator('.longevity-summary').innerText()).length > 200);
  await context.close();
  await writeFile('test-results/longevity-accessibility.json', JSON.stringify(report, null, 2));
  assert.deepEqual(report.flatMap((r: any) => r.violations.map((v: any) => ({ width: r.width, state: r.state, id: v.id, nodes: v.nodes.map((n: any) => n.target) }))), []);
} finally { await browser.close(); }
