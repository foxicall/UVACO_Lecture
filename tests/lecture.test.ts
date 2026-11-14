import test from 'node:test';
import assert from 'node:assert/strict';
import { lecture, lectureOrder, pillars } from '../src/data/lecture-poster';
import { products } from '../src/data/uvaco-products';
test('poster preserves exact event facts and every listed speaker qualification', () => {
  assert.equal(lecture.title, '找回身體的自癒力');
  assert.equal(lecture.date, '11/15（日）');
  assert.equal(lecture.time, '10:00');
  assert.equal(lecture.address, '延吉街235巷1號');
  assert.equal(lecture.specialties.length, 8);
  assert.equal(lecture.credentials.length, 10);
});
test('four lecture pillars cover all products exactly once', () => {
  assert.equal(pillars.length, 4);
  assert.equal(new Set(lectureOrder).size, 12);
  assert.deepEqual([...lectureOrder].sort(), products.map(p => p.id).sort());
  assert.ok(products.every(p => p.lecturePillar));
});
