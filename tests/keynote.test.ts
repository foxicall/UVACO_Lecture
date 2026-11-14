import test from 'node:test';
import assert from 'node:assert/strict';
import { pptxDecks, slideNarration } from '../src/data/archived-pptx-decks';
import visuals from '../src/data/generated-visuals.json';

test('three archived lecture decks preserve every supplied slide and offer complete narration', () => {
  assert.deepEqual(pptxDecks.map(deck => deck.slides.length), [8, 7, 8]);
  const ids = new Set<string>();
  for (const deck of pptxDecks) for (const slide of deck.slides) {
    assert.ok(!ids.has(slide.id)); ids.add(slide.id);
    assert.ok(slide.sourceText.length > 30, `Missing source for ${slide.id}`);
    assert.ok(visuals.visuals.some(art => art.id === slide.illustration));
    const narration = slideNarration(slide);
    for (const block of slide.blocks) assert.ok(narration.includes(block.text));
    if (slide.note) assert.ok(narration.includes(slide.note));
  }
  assert.equal(ids.size, 23);
});
