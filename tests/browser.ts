import { followStory } from './helpers/story';
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
    page.setDefaultTimeout(20000);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript({ content: `
      const state = { paused: false, calls: [], current: null, cancels: 0 };
      Object.defineProperty(window, 'speechSynthesis', { value: {
        speak: u => { state.calls.push({ lang: u.lang, rate: u.rate, text: u.text }); state.current = u; },
        pause: () => { state.paused = true; }, resume: () => { state.paused = false; }, cancel: () => { state.cancels++; state.current = null; }, getVoices: () => [],
      } });
      window.__voiceTest = state;
    ` });
    await page.goto(base, { waitUntil: 'networkidle' });
    if (width === 1440) {
      const liveApi = await page.evaluate(async () => {
        const result = await fetch('/api/concierge', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ question: '現在胸痛又呼吸困難' }) });
        return { status: result.status, body: await result.text() };
      });
      assert.equal(liveApi.status, 200, 'Real browser same-origin request must reach the Node API');
      assert.ok(liveApi.body.includes('119'));
    }
    await page.locator('.island-label').last().waitFor({state:'attached'});
    await page.waitForTimeout(500);
    assert.equal(await page.locator('.island-label').count(), 12);
    assert.equal(await page.locator('canvas').count(), 1);
    assert.equal(await page.locator('.ios-header').evaluate(el => el.getBoundingClientRect().height), 48);
    const positions = () => page.locator('.island-label').evaluateAll(labels => labels.map(el => ({x: el.getBoundingClientRect().x, y: el.getBoundingClientRect().y})));
    const overviewPositions = await positions();
    const clippedTabs = await page.locator('.pillar-segments').evaluate(nav => [...nav.children].some(tab => tab.getBoundingClientRect().right > nav.getBoundingClientRect().right + 1));
    assert.equal(clippedTabs, false, `All four header topics visible at ${width}`);
    const clippedLabels = await page.locator('.canvas-shell').evaluate(shell => {
      const bounds = shell.getBoundingClientRect();
      return [...shell.querySelectorAll('[data-label-visible=true] .landmark-badge')].filter(label => {
        const box = label.getBoundingClientRect();
        return box.left < bounds.left || box.right > bounds.right || box.top < bounds.top || box.bottom > bounds.bottom;
      }).map(label => label.textContent);
    });
    assert.deepEqual(clippedLabels, [], `Clipped overview labels at ${width}`);
    const overlappingLabels = await page.locator('.roof-badges').evaluate(layer => {
      const labels = [...layer.querySelectorAll('[data-label-visible=true] .landmark-badge')];
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
    await followStory(page,'995 生技營養品');
    await page.locator('.product-deck').waitFor();
    await page.waitForTimeout(350);
    assert.equal(await page.locator('.product-intro h2').innerText(), '995 生技營養品');
    assert.deepEqual(await positions(), overviewPositions, 'Selection must not move the map or labels');
    await page.locator('.product-deck').getByRole('button', { name: '聽語音導覽', exact: true }).click();
    await page.locator('.product-deck').getByRole('button', { name: '暫停語音導覽', exact: true }).click();
    await page.locator('.product-deck').getByRole('button', { name: '繼續語音導覽', exact: true }).click();
    const voiceCalls = await page.evaluate(() => (window as unknown as { __voiceTest: { calls: { lang: string; rate: number }[] } }).__voiceTest.calls);
    assert.equal(voiceCalls[0].lang, 'zh-TW');
    assert.ok(Math.abs(voiceCalls[0].rate - .92) < .00001);
    await page.getByRole('tab', { name: '原料小故事' }).click();
    await page.getByRole('tab', { name: '原料小故事' }).press('ArrowRight');
    assert.equal(await page.getByRole('tab', { name: '一起認識' }).getAttribute('aria-selected'), 'true');
    await page.getByRole('tab', { name: '身體的需要' }).click();
    await page.screenshot({ path: `test-results/final-${width}-product.png`, fullPage: true });
    await page.getByRole('button', { name: '全島總覽', exact: true }).click();
    await page.locator('.symptom-search summary').click();
    await page.getByRole('button', { name: '排便不順肚子脹', exact: true }).click();
    assert.equal(await page.locator('.product-intro h2').innerText(), '康爾喜');
    await page.getByRole('button', { name: '下一站，講座重點巡禮', exact: true }).click();
    await followStory(page,'康貝寧');
    assert.equal(await page.locator('.product-intro h2').innerText(), '康貝寧');
    await page.getByRole('button', { name: '字體大小：100%，點選切換' }).click();
    await page.getByRole('button', { name: '字體大小：125%，點選切換' }).click();
    assert.equal(await page.locator('.ios-header').evaluate(el => el.getBoundingClientRect().height), 48);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Overflow at ${width}, 140% font`);
    await page.screenshot({ path: `test-results/final-${width}-large.png`, fullPage: true });
    await page.getByRole('button', { name: '字體大小：140%，點選切換' }).click();
    await page.getByRole('button', { name: '講師林煒醫師與11/15講座資訊' }).click();
    await page.getByText('完整學經歷與專業認證', {exact:true}).click();
    await page.locator('.speaker-credentials li').last().waitFor();
    assert.equal(await page.locator('.speaker-specialties li').count(), 8);
    assert.equal(await page.locator('.speaker-credentials li').count(), 10);
    await page.screenshot({ path: `test-results/final-${width}-lecture.png`, fullPage: true });
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: '神經修復', exact: true }).click();
    await followStory(page,'活逸康');
    await page.locator('.product-intro h2').filter({ hasText: '活逸康' }).waitFor();
    await page.getByRole('button', { name: '健康知識館' }).click();
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
    const reference={citations:[{title:'衛福部・社區失智症調查',url:'https://www.mohw.gov.tw/cp-16-78102-1.html'}],queries:['台灣 社區 失智 盛行率'],supportCount:1,searchEntryHtml:'',searched:true};
    const answer = { sentences: ['我們一起慢慢認識大腦森林。', '您可以先看看相關產品的原料資訊。', '如有持續的記憶變化，請先向醫師諮詢。'], targetProductIds: ['huoyi', '995'] };
    await page.route('**/api/concierge', route => route.fulfill({ status: 200, contentType: 'text/event-stream', body: answer.sentences.map(text => `event: sentence\ndata: ${JSON.stringify({ text })}\n\n`).join('') + `event: references\ndata: ${JSON.stringify(reference)}\n\nevent: done\ndata: ${JSON.stringify(answer)}\n\n` }));
    await page.getByRole('button', { name: '長輩常忘東忘西、睡不好怎麼搭配？' }).click();
    await page.getByRole('button', { name: '活逸康 →', exact: true }).waitFor();
    await page.getByRole('link',{name:'衛福部・社區失智症調查 ↗',exact:true}).waitFor();
    await page.screenshot({ path: `test-results/final-${width}-concierge.png`, fullPage: true });
    const dialogAxe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag2aaa']).analyze();
    report.push({ width, state: 'concierge', accessibility: dialogAxe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) });
    await page.getByRole('button', { name: '活逸康 →', exact: true }).click();
    assert.equal(await page.locator('.product-intro h2').innerText(), '活逸康');
    assert.equal(await page.locator('.circadian-header').count(), 0);
    await page.getByRole('button', { name: '六大長壽簡報播放', exact: true }).click();
    await page.locator('.keynote-player').waitFor();
    for (const [name, count] of [['體力與營養', 4], ['居家與環境', 4], ['壓力與睡眠', 4], ['身體清潔隊', 4], ['血管與道路', 4], ['腸道與生活', 4]] as const) {
      await page.getByRole('tab', { name: `${name} ${count} 頁`, exact: true }).click();
      assert.equal(await page.locator('.keynote-thumbnails button').count(), count);
      assert.equal(await page.getByRole('button', { name: '上一頁', exact: true }).isDisabled(), true);
      for (let i = 0; i < count; i++) {
        await page.locator('.keynote-thumbnails button').nth(i).click();
        assert.equal(await page.locator('.slide-counter').innerText(), `${i + 1} / ${count}`);
        assert.ok((await page.locator('.longevity-summary h3').innerText()).length > 2);
        assert.equal(await page.locator('.longevity-summary').evaluate(el => el.scrollWidth > el.clientWidth + 1), false);
      }
      assert.equal(await page.getByRole('button', { name: '下一頁', exact: true }).isDisabled(), true);
    }
    await page.locator('.longevity-summary').focus();
    await page.keyboard.press('Home');
    assert.equal(await page.locator('.slide-counter').innerText(), '1 / 4');
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('.slide-counter').innerText(), '2 / 4');
    await page.keyboard.press('ArrowLeft');
    await page.getByRole('button', { name: '自動朗讀', exact: true }).click();
    await page.getByRole('button', { name: '暫停朗讀', exact: true }).click();
    await page.getByRole('button', { name: '繼續朗讀', exact: true }).click();
    await page.evaluate(() => (window as any).__voiceTest.current.onend());
    await page.locator('.slide-counter').filter({ hasText: '2 / 4' }).waitFor();
    const latestVoice = await page.evaluate(() => (window as any).__voiceTest.calls.at(-1));
    assert.equal(latestVoice.lang, 'zh-TW');
    assert.ok(Math.abs(latestVoice.rate - .92) < .00001);
    assert.ok(latestVoice.text.includes(await page.locator('.longevity-summary h3').innerText()));
    await page.getByRole('button', { name: '停止朗讀', exact: true }).click();
    await page.getByRole('button', { name: '全螢幕播放' }).click();
    await page.getByRole('button', { name: '離開全螢幕' }).waitFor();
    await page.getByRole('button', { name: '離開全螢幕' }).click();
    await page.locator('.longevity-summary').focus();
    await page.keyboard.press('End');
    await page.getByRole('button', { name: '自動朗讀', exact: true }).click();
    await page.evaluate(() => (window as any).__voiceTest.current.onend());
    await page.getByRole('button', { name: '自動朗讀', exact: true }).waitFor();
    assert.equal(await page.locator('.slide-counter').innerText(), '4 / 4');
    await page.getByRole('tab', { name: '體力與營養 4 頁', exact: true }).click();
    await page.screenshot({ path: `test-results/final-${width}-keynote.png`, fullPage: false });
    const keynoteAxe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag2aaa']).analyze();
    report.push({ width, state: 'keynote', accessibility: keynoteAxe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) });
    await page.getByRole('button', { name: '關閉簡報播放器' }).click();
    assert.equal(await page.getByRole('button', { name: '六大長壽簡報播放', exact: true }).evaluate(el => el === document.activeElement), true);
    await page.getByRole('button', { name: '播放PPT', exact: true }).click();
    await page.locator('.keynote-player').waitFor();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog[open]').count(), 0);
    assert.deepEqual(errors, [], `Browser errors at ${width}`);
    console.log(`${width}px: navigation, tabs, TTS contract, 140% font, education, offline and streamed AI navigation passed.`);
    await context.close();
  }
  const animatedContext = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' });
  const animatedPage = await animatedContext.newPage();
  const animationErrors: string[] = [];
  animatedPage.on('pageerror', error => animationErrors.push(error.message));
  await animatedPage.goto(base, { waitUntil: 'networkidle' });
  await animatedPage.locator('.island-label').last().waitFor({state:'attached'});
  await animatedPage.waitForTimeout(1800);
  await animatedPage.getByRole('button', { name: '下一站，講座重點巡禮', exact: true }).click();
  await followStory(animatedPage,'995 生技營養品');
  await animatedPage.waitForTimeout(1800);
  assert.equal(await animatedPage.locator('.product-intro h2').innerText(), '995 生技營養品');
  await animatedPage.getByRole('button', { name: '全島總覽', exact: true }).click();
  await animatedPage.waitForTimeout(1800);
  await animatedPage.locator('.hub-label').click();
  await animatedPage.locator('dialog[open]').waitFor();
  assert.deepEqual(animationErrors, [], 'Errors in standard motion preference');
  await animatedContext.close();
  console.log('Turntable overview, selection and central lecture hub passed.');
  await writeFile('test-results/browser-report.json', JSON.stringify(report, null, 2));
  const failures = report.flatMap(r => (r as { accessibility: unknown[] }).accessibility);
  assert.deepEqual(failures, [], 'Accessibility violations: see test-results/browser-report.json');
} finally { await browser.close(); }
