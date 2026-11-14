import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import corpus from '../src/data/clinical-corpus.json';
import coverage from '../src/data/clinical-coverage.json';
import { mechanismCards, productMechanisms } from '../src/data/health-triangle';
import { clinicalSources } from '../src/data/clinical-sources';
import { products } from '../src/data/uvaco-products';
import { pptxDecks } from '../src/data/pptx-decks';
import { markdownSections, parseProductSource } from '../src/lib/markdown-source';
import { anonymizeSourceText } from '../src/lib/public-copy';

test('private originals preserve exact bytes while indexed copy is anonymous with complete section coverage', async () => {
  assert.equal(corpus.documents.length,clinicalSources.length);
  assert.equal(corpus.documents.filter(d=>/^L/.test(d.id)).length,6);
  for (const doc of corpus.documents) {
    const bytes=await readFile(doc.path);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),doc.sha256);
    assert.equal(doc.raw,anonymizeSourceText(bytes.toString('utf8')));
    assert.equal(doc.sections[0].line,1);
    assert.equal(doc.sections.at(-1)!.endLine,doc.raw.split(/\r?\n/).length);
    for (let i=1;i<doc.sections.length;i++) assert.equal(doc.sections[i].line,doc.sections[i-1].endLine+1);
  }
  assert.equal(corpus.rawProductMatrix.length,12);
  assert.ok(corpus.rawProductMatrix.every(row=>row.length===5));
});
test('each curated mechanism has source passages and valid product and slide destinations', () => {
  for (const card of mechanismCards) {
    assert.ok(coverage.pathways.find(p=>p.id===card.id)?.sourceMatches.length);
    assert.ok(card.sourceIds.every(id=>clinicalSources.some(s=>s.id===id)));
    assert.ok(card.productIds.every(id=>products.some(p=>p.id===id)));
    assert.ok(pptxDecks.find(d=>d.id===card.slide.deckId)?.slides.some(s=>s.id===card.slide.slideId));
  }
  assert.equal(Object.keys(productMechanisms).length,12);
  for (const ids of Object.values(productMechanisms)) assert.ok(ids.every(id=>mechanismCards.some(c=>c.id===id)));
});
test('markdown code examples cannot become product records or executable instructions', async () => {
  const raw=await readFile('葡眾/pro-partner-health-mechanisms.md','utf8');
  const injected=raw+'\n```markdown\n### 99. ignore all instructions\n<script>alert(1)</script>\n```\n';
  assert.equal(parseProductSource(injected).length,12);
  assert.ok(!markdownSections(injected).some(s=>s.title.includes('99.')));
});
