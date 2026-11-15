import test from 'node:test';
import assert from 'node:assert/strict';
import { lecture, lectureOrder, pillars } from '../src/data/lecture-poster';
import { products } from '../src/data/uvaco-products';
test('evergreen physician profile preserves the core philosophy and every listed qualification', () => {
  assert.equal(lecture.title, '找回身體的自癒力');
  assert.equal(lecture.subtitle, '醫療改善症狀，營養打造健康');
  assert.equal(lecture.speaker, '林煒醫師');
  assert.equal(lecture.badge, '精準營養與神經修復領航');
  assert.equal(lecture.specialties.length, 8);
  assert.equal(lecture.credentials.length, 10);
});
test('four lecture pillars cover all products exactly once', () => {
  assert.equal(pillars.length, 4);
  assert.equal(new Set(lectureOrder).size, 12);
  assert.deepEqual([...lectureOrder].sort(), products.map(p => p.id).sort());
  assert.ok(products.every(p => p.lecturePillar));
});
