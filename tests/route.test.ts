import test from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../src/app/api/concierge/route';
const req = (body: string, origin = 'http://localhost:3000') => new Request('http://localhost:3000/api/concierge', { method: 'POST', headers: { 'Content-Type': 'application/json', origin }, body });
test('API rejects cross-origin, malformed and oversized requests before invoking Gemini', async () => {
  assert.equal((await POST(req('{"question":"您好"}', 'https://other.example'))).status, 403);
  assert.equal((await POST(req('{broken'))).status, 400);
  assert.equal((await POST(req('x'.repeat(2049)))).status, 413);
});
test('urgent requests stream medical escalation without product actions', async () => {
  const response = await POST(req('{"question":"現在胸痛又呼吸困難"}'));
  assert.equal(response.status, 200);
  const body = await response.text();
  assert.ok(body.includes('119'));
  assert.ok(body.includes('"targetProductIds":[]'));
  assert.equal((body.match(/event: sentence/g) ?? []).length, 3);
});
