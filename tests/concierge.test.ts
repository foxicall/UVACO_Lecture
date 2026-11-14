import test from 'node:test';
import assert from 'node:assert/strict';
import { answerSchema, completedSentences, localReadingRoute, MODELS, requestSchema } from '../src/lib/concierge';
import { validateSvg } from '../src/lib/visuals';
import { readEvents } from '../src/lib/sse';
test('strict model routing never selects a legacy model', () => {
  assert.deepEqual(MODELS, { visuals: 'gemini-3.8-pro', concierge: 'gemini-3.8-flash' });
});
test('rejects unknown product actions and malformed requests', () => {
  assert.equal(requestSchema.safeParse({ question: 'x'.repeat(301) }).success, false);
  assert.equal(answerSchema.safeParse({ sentences: ['第一個句子。', '第二個句子。', '第三個句子。'], targetProductIds: ['invented'], circadianPhase: 'day' }).success, false);
  assert.equal(answerSchema.safeParse({ sentences: ['第一個句子。'], targetProductIds: [], circadianPhase: 'day' }).success, false);
});
test('only complete JSON sentences stream to the client', () => {
  assert.deepEqual(completedSentences('{"sentences":["請放心慢慢說。","這句還沒'), ['請放心慢慢說。']);
  assert.deepEqual(completedSentences('{"sentences":["請說\\"您好\\"。","一起看資料。"]}'), ['請說"您好"。', '一起看資料。']);
});
test('local reading does not route emergencies or medication questions to products', () => {
  assert.deepEqual(localReadingRoute('我胸痛又呼吸困難').targetProductIds, []);
  assert.deepEqual(localReadingRoute('正在吃慢性病的藥').targetProductIds, []);
  assert.deepEqual(localReadingRoute('排便不順').targetProductIds, ['kanger', 'kanger-n']);
});
test('SVG validation rejects script, event handlers and external references', () => {
  const svg = (body: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">${body}</svg>`;
  assert.throws(() => validateSvg(svg('<script>alert(1)</script>')));
  assert.throws(() => validateSvg(svg('<path onload="alert(1)"/>')));
  assert.throws(() => validateSvg(svg('<path fill="url(https://bad.test/x)"/>')));
  assert.throws(() => validateSvg('<!DOCTYPE svg>' + svg('')));
  assert.ok(validateSvg(svg('<circle cx="20" cy="20" r="10" fill="#1B4D3E"/>')));
});
test('SSE decoder preserves split UTF-8 and incomplete network chunks', async () => {
  const bytes = new TextEncoder().encode('event: sentence\ndata: {"text":"慢慢說。"}\n\nevent: done\ndata: {}\n\n');
  const stream = new ReadableStream<Uint8Array>({ start(c) { for (const byte of bytes) c.enqueue(new Uint8Array([byte])); c.close(); } });
  const events: unknown[] = [];
  await readEvents(stream, (type, data) => events.push({ type, data }));
  assert.deepEqual(events, [{ type: 'sentence', data: { text: '慢慢說。' } }, { type: 'done', data: {} }]);
});
