import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://localhost:3001';
await mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
const report: unknown[] = [];
try {
  for (const width of [1440, 768, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript({ content: `
      const state = { paused: false, calls: [] };
      Object.defineProperty(window, 'speechSynthesis', { value: {
        speak: u => { state.calls.push({ lang: u.lang, rate: u.rate }); },
        pause: () => { state.paused = true; }, resume: () => { state.paused = false; }, cancel: () => {}, getVoices: () => [],
      } });
      window.__voiceTest = state;
    ` });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('.island-label').last().waitFor();
    await page.waitForTimeout(500);
    assert.equal(await page.locator('.island-label').count(), 12);
    assert.equal(await page.locator('canvas').count(), 1);
    const clippedLabels = await page.locator('.canvas-shell').evaluate(shell => {
      const bounds = shell.getBoundingClientRect();
      return [...shell.querySelectorAll('.island-label')].filter(label => {
        const box = label.getBoundingClientRect();
        return box.left < bounds.left || box.right > bounds.right || box.top < bounds.top || box.bottom > bounds.bottom;
      }).map(label => label.textContent);
    });
    assert.deepEqual(clippedLabels, [], `Clipped overview labels at ${width}`);
    const overlappingLabels = await page.locator('.label-layer').evaluate(layer => {
      const labels = [...layer.querySelectorAll('button')];
      return labels.flatMap((label, i) => labels.slice(i + 1).filter(other => {
        const a = label.getBoundingClientRect(), b = other.getBoundingClientRect();
        return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      }).map(other => `${label.textContent} / ${other.textContent}`));
    });
    assert.deepEqual(overlappingLabels, [], `Overlapping overview labels at ${width}`);
    await page.screenshot({ path: `test-results/final-${width}-overview.png`, fullPage: true });
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag2aaa']).analyze();
    report.push({ width, state: 'overview', accessibility: accessibility.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) });
    await page.getByRole('button', { name: '下一站，講座重點巡禮', exact: true }).click();
    await page.locator('.product-deck').waitFor();
    await page.waitForTimeout(350);
    assert.equal(await page.locator('.product-intro h2').innerText(), '995 生技營養品');
    await page.locator('.product-deck').getByRole('button', { name: '聽語音導覽', exact: true }).click();
    await page.locator('.product-deck').getByRole('button', { name: '暫停語音導覽', exact: true }).click();
    await page.locator('.product-deck').getByRole('button', { name: '繼續語音導覽', exact: true }).click();
    const voiceCalls = await page.evaluate(() => (window as unknown as { __voiceTest: { calls: { lang: string; rate: number }[] } }).__voiceTest.calls);
    assert.equal(voiceCalls[0].lang, 'zh-TW');
    assert.ok(Math.abs(voiceCalls[0].rate - .92) < .00001);
    await page.getByRole('tab', { name: '科學與成分' }).click();
    await page.getByRole('tab', { name: '科學與成分' }).press('ArrowRight');
    assert.equal(await page.getByRole('tab', { name: '一起認識' }).getAttribute('aria-selected'), 'true');
    await page.getByRole('tab', { name: '給長輩的話' }).click();
    await page.screenshot({ path: `test-results/final-${width}-product.png`, fullPage: true });
    await page.getByRole('button', { name: '全島總覽', exact: true }).click();
    await page.locator('.symptom-search summary').click();
    await page.getByRole('button', { name: '排便不順肚子脹', exact: true }).click();
    assert.equal(await page.locator('.product-intro h2').innerText(), '康爾喜');
    await page.getByRole('button', { name: '下一站，講座重點巡禮', exact: true }).click();
    assert.equal(await page.locator('.product-intro h2').innerText(), '康爾喜 N');
    await page.getByRole('button', { name: '字體大小：100%，點選切換' }).click();
    await page.getByRole('button', { name: '字體大小：125%，點選切換' }).click();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Overflow at ${width}, 140% font`);
    await page.screenshot({ path: `test-results/final-${width}-large.png`, fullPage: true });
    await page.getByRole('button', { name: '字體大小：140%，點選切換' }).click();
    await page.getByRole('button', { name: '講師林煒醫師與11/15講座資訊' }).click();
    await page.locator('.speaker-credentials li').last().waitFor();
    assert.equal(await page.locator('.speaker-specialties li').count(), 8);
    assert.equal(await page.locator('.speaker-credentials li').count(), 10);
    await page.screenshot({ path: `test-results/final-${width}-lecture.png`, fullPage: true });
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: '神經修復', exact: true }).click();
    await page.locator('.product-intro h2').filter({ hasText: '活逸康' }).waitFor();
    await page.getByRole('button', { name: '健康知識館 ↗' }).click();
    await page.getByRole('button', { name: '反覆忘記，已影響生活' }).click();
    assert.ok((await page.locator('.learning-answer').innerText()).includes('陪伴就醫'));
    await page.getByRole('tab', { name: '營養與代謝' }).click();
    await page.getByRole('button', { name: '代謝循環', exact: true }).click();
    assert.ok((await page.locator('.learning-answer').innerText()).includes('B 群各有角色'));
    await page.getByRole('tab', { name: '認識葡眾' }).click();
    await page.screenshot({ path: `test-results/final-${width}-education.png`, fullPage: true });
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog[open]').count(), 0);
    await page.route('**/api/concierge', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: '服務暫時離線。' }) }));
    await page.getByRole('button', { name: '💬 問問健康小幫手' }).click();
    await page.getByRole('button', { name: '排便不順、肚子脹，想了解腸道產品。' }).click();
    await page.getByRole('button', { name: '改看本機文件導覽' }).click();
    assert.ok((await page.locator('.ai-answer').innerText()).includes('這不是 AI 回答'));
    await page.unroute('**/api/concierge');
    const answer = { sentences: ['我們一起慢慢認識大腦森林。', '您可以先看看相關產品的原料資訊。', '如有持續的記憶變化，請先向醫師諮詢。'], targetProductIds: ['huoyi', '995'], circadianPhase: 'night' };
    await page.route('**/api/concierge', route => route.fulfill({ status: 200, contentType: 'text/event-stream', body: answer.sentences.map(text => `event: sentence\ndata: ${JSON.stringify({ text })}\n\n`).join('') + `event: done\ndata: ${JSON.stringify(answer)}\n\n` }));
    await page.getByRole('button', { name: '長輩常忘東忘西、睡不好怎麼搭配？' }).click();
    await page.getByRole('button', { name: '活逸康 →', exact: true }).waitFor();
    await page.screenshot({ path: `test-results/final-${width}-concierge.png`, fullPage: true });
    const dialogAxe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag2aaa']).analyze();
    report.push({ width, state: 'concierge', accessibility: dialogAxe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) });
    await page.getByRole('button', { name: '活逸康 →', exact: true }).click();
    assert.equal(await page.locator('.product-intro h2').innerText(), '活逸康');
    assert.equal(await page.getByRole('button', { name: '夜晚', exact: true }).getAttribute('aria-pressed'), 'true');
    assert.deepEqual(errors, [], `Browser errors at ${width}`);
    console.log(`${width}px: navigation, tabs, TTS contract, 140% font, education, offline and streamed AI navigation passed.`);
    await context.close();
  }
  const animatedContext = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' });
  const animatedPage = await animatedContext.newPage();
  const animationErrors: string[] = [];
  animatedPage.on('pageerror', error => animationErrors.push(error.message));
  await animatedPage.goto(base, { waitUntil: 'networkidle' });
  await animatedPage.locator('.island-label').last().waitFor();
  await animatedPage.waitForTimeout(1800);
  await animatedPage.getByRole('button', { name: '下一站，講座重點巡禮', exact: true }).click();
  await animatedPage.waitForTimeout(1800);
  assert.equal(await animatedPage.locator('.product-intro h2').innerText(), '995 生技營養品');
  await animatedPage.getByRole('button', { name: '全島總覽', exact: true }).click();
  await animatedPage.waitForTimeout(1800);
  await animatedPage.locator('.hub-label').click();
  await animatedPage.locator('dialog[open]').waitFor();
  assert.deepEqual(animationErrors, [], 'Errors with animated camera and water');
  await animatedContext.close();
  console.log('Animated camera, water, overview return and central lecture hub passed.');
  await writeFile('test-results/browser-report.json', JSON.stringify(report, null, 2));
  const failures = report.flatMap(r => (r as { accessibility: unknown[] }).accessibility);
  assert.deepEqual(failures, [], 'Accessibility violations: see test-results/browser-report.json');
} finally { await browser.close(); }
