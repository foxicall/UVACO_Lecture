import test from 'node:test';
import assert from 'node:assert/strict';
import { products } from '../src/data/uvaco-products';
import sources from '../src/data/source-materials.json';
test('all twelve products have complete source sections and valid island routes', () => {
  assert.equal(products.length, 12);
  assert.equal(new Set(products.map(p => p.id)).size, 12);
  assert.equal(new Set(products.map(p => p.hexCoordinates.join(','))).size, 12);
  for (const p of products) {
    assert.ok(p.ingredients.length);
    assert.equal(Object.keys(p.sourceMechanisms ?? {}).length, 3);
    assert.ok(sources.products.find(s => s.id === p.id)?.text);
    for (const link of p.synergyLinks) assert.ok(products.some(other => other.id === link.targetProductId));
  }
});
