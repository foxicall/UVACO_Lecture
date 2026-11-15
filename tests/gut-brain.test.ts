import test from 'node:test';
import assert from 'node:assert/strict';
import {gutBrainModes,gutBrainKpis,gutBarrierLayers,gutDominoAxes,gutDistalPathways,gutRepairSteps,gutCaseStudy,gutBrainSources} from '../src/data/gut-brain-interactive';
import {products,productById} from '../src/data/uvaco-products';
import {thematicDecks} from '../src/data/thematic-decks';
import {visualPageById,visualDeckById} from '../src/data/visual-assets-manifest';
import policy from '../scripts/source-redaction-policy.json';

test('gut-brain science keeps immune signals and tissue-specific routes distinct',()=>{
 assert.deepEqual(Object.keys(gutBrainModes).sort(),['stress','support']);
 assert.deepEqual(gutBarrierLayers.map(layer=>layer.id),['mucus','junctions','immune']);
 assert.equal(gutDominoAxes.length,4);assert.deepEqual(gutDistalPathways.map(pathway=>pathway.id),['brain','muscle']);
 const tracks=[...gutDominoAxes,...gutDistalPathways].flatMap(item=>item.tracks),nodes=tracks.flatMap(track=>track.nodes);
 assert.equal(new Set(tracks.map(track=>track.id)).size,tracks.length);assert.equal(new Set(nodes.map(node=>node.id)).size,nodes.length);
 for(const track of tracks){assert.ok(track.nodes.length>=2,track.id);for(const node of track.nodes)assert.ok(node.label&&node.detail.length>20,node.id);}
 const immune=gutDominoAxes.find(axis=>axis.id==='innate-immunity')!;
 assert.deepEqual(immune.tracks.map(track=>track.id),['immune-priming','immune-triggering']);
 const serotonin=gutDistalPathways.find(pathway=>pathway.id==='brain')!.tracks.find(track=>track.id==='brain-serotonin')!;
 assert.match(serotonin.nodes.find(node=>node.id==='brain-5htp')!.cofactor!,/TPH.*BH4/);
 assert.match(serotonin.nodes.find(node=>node.id==='brain-serotonin-node')!.cofactor!,/AADC.*B6/);
 const muscle=gutDistalPathways.find(pathway=>pathway.id==='muscle')!;
 assert.ok(muscle.tracks.some(track=>track.id==='muscle-synthesis'));assert.ok(muscle.tracks.some(track=>track.id==='muscle-digestion-assessment'));
 const recycling=gutDominoAxes.find(axis=>axis.id==='cellular-recycling')!;
 assert.ok(recycling.tracks.some(track=>track.id==='recycling-nad'));assert.ok(recycling.tracks.some(track=>track.id==='recycling-energy-sensing'));
});

test('five 5R steps connect all twelve real products without putting brands in scientific prose',()=>{
 assert.deepEqual(gutRepairSteps.map(step=>step.id),['remove','replace','reinoculate','repair','rebalance']);
 const groups=[...gutDominoAxes,...gutDistalPathways,...gutRepairSteps],linked=new Set<string>();
 for(const group of groups){assert.equal(new Set(group.productIds).size,group.productIds.length);for(const id of group.productIds){assert.ok(productById.has(id),`${group.id}: unknown product ${id}`);linked.add(id);}}
 assert.deepEqual([...linked].sort(),products.map(product=>product.id).sort());
 const prose=JSON.stringify([groups.map(({productIds,...item})=>item),gutBrainModes,gutBrainKpis,gutBarrierLayers,gutCaseStudy,gutBrainSources]);
 for(const product of products)assert.ok(!prose.includes(product.name),`Brand in early-act copy: ${product.name}`);
 for(const token of [...policy.names,...policy.phrases])assert.ok(!prose.toLowerCase().includes(token.toLowerCase()),`External attribution: ${token}`);
 for(const source of [...gutBrainKpis,...gutBrainSources])if(source.url)assert.equal(new URL(source.url).protocol,'https:');
});

test('case scorecard preserves source provenance, unfavorable findings and censored measurements',()=>{
 const deck=thematicDecks.find(item=>item.id==='longevity-6')!;assert.equal(deck.pages.length,23);
 for(const page of deck.pages)assert.ok(visualPageById.has(page.id));
 const original=visualDeckById.get('longevity-6')!;
 for(const number of gutCaseStudy.sourcePages)assert.ok(Number.isInteger(number)&&number>=1&&number<=original.originalPageCount,`Invalid archived source page ${number}`);
 for(const item of [...gutCaseStudy.measurements,...gutCaseStudy.ages]){const source=item.note.match(/原始第 (\d+) 頁/);assert.ok(source&&gutCaseStudy.sourcePages.includes(Number(source[1])),`Missing source provenance for ${item.id}`);}
 assert.match(gutCaseStudy.context,/一位個案/);assert.match(gutCaseStudy.context,/並非.*產品.*人體試驗/);assert.match(gutCaseStudy.context,/無法.*歸因/);
 const measurements=new Map(gutCaseStudy.measurements.map(item=>[item.id,item]));assert.equal(measurements.size,6);
 for(const item of measurements.values())assert.ok(Number.isFinite(item.before)&&Number.isFinite(item.after)&&item.unit&&item.note.length>20);
 for(const id of ['total-scfa','butyrate']){const item=measurements.get(id)!;assert.ok(item.after<item.before);assert.match(item.note,/下降/,'Do not omit the case’s declining SCFA values');}
 assert.equal(measurements.get('pancreatic-elastase')!.afterLabel,'<100');assert.match(measurements.get('pancreatic-elastase')!.note,/上限.*並非/);
 assert.equal(gutCaseStudy.ages.length,2);for(const age of gutCaseStudy.ages){assert.ok(Number.isFinite(age.change));assert.match(age.note,/模型估計/);}
 assert.match(gutCaseStudy.ages[0].note,/不能.*實際年齡/);
});
