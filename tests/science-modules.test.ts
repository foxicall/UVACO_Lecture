import test from 'node:test';
import assert from 'node:assert/strict';
import {toxinDrainageDefinition} from '../src/data/toxin-drainage';
import {endocrineBrainBrakeDefinition} from '../src/data/endocrine-brain-brake';
import {resolutionMyelinDefinition} from '../src/data/resolution-myelin';
import {productById} from '../src/data/uvaco-products';
import {thematicDecks,thematicPageCount} from '../src/data/thematic-decks';
import {visualPageById,visualDeckById} from '../src/data/visual-assets-manifest';
import policy from '../scripts/source-redaction-policy.json';

const definitions=[toxinDrainageDefinition,endocrineBrainBrakeDefinition,resolutionMyelinDefinition];

test('three science modules have independent navigable pathways and valid product destinations',()=>{
 assert.deepEqual(definitions.map(module=>module.id),['toxin','endocrine','resolution']);
 const linked=new Set<string>();
 for(const module of definitions){
  assert.deepEqual(Object.keys(module.modes).sort(),['stress','support']);
  assert.ok(module.title&&module.introduction&&module.stages.length>=2,module.id);
  assert.equal(new Set(module.stages.map(stage=>stage.id)).size,module.stages.length);
  const tracks=module.stages.flatMap(stage=>stage.tracks),nodes=tracks.flatMap(track=>track.nodes);
  assert.equal(new Set(tracks.map(track=>track.id)).size,tracks.length,`${module.id}: duplicate track IDs`);
  assert.equal(new Set(nodes.map(node=>node.id)).size,nodes.length,`${module.id}: duplicate node IDs`);
  for(const stage of module.stages){
   assert.ok(stage.title&&stage.metaphor&&stage.explanation,stage.id);
   assert.ok(stage.tracks.length>0,stage.id);
   for(const track of stage.tracks){assert.ok(track.title&&track.nodes.length>=2,track.id);for(const node of track.nodes)assert.ok(node.label&&node.detail,node.id);}
   for(const id of Object.values(stage.preferredTracks??{}))assert.ok(stage.tracks.some(track=>track.id===id),`${stage.id}: invalid preferred branch ${id}`);
   assert.equal(new Set(stage.productIds).size,stage.productIds.length,stage.id);
   if(stage.productIds.length)assert.ok(stage.productContext,`${stage.id}: missing ingredient context`);
   for(const id of stage.productIds){assert.ok(productById.has(id),`${stage.id}: unknown product ${id}`);linked.add(id);}
  }
 }
 for(const id of ['lisheng','antrodia','kanger-n','ningkang','kangbei','kangyue','360','995','huoyi','dikang'])assert.ok(linked.has(id),`Requested ingredient destination missing: ${id}`);
 assert.equal(resolutionMyelinDefinition.stages.length,5,'Resolution module preserves the five-stage explanation');
});

test('research observations retain source context and anonymous attribution',()=>{
 for(const module of definitions){
  assert.ok(module.evidence.length>0&&module.sources.length>0,`${module.id}: source context absent`);
  assert.equal(new Set(module.evidence.map(item=>item.id)).size,module.evidence.length);
  for(const item of module.evidence)assert.ok(item.title&&item.text&&item.source,`${module.id}: incomplete evidence card`);
  for(const item of [...module.evidence,...module.sources])if(item.url)assert.equal(new URL(item.url).protocol,'https:');
  const copy=JSON.stringify(module).toLowerCase();
  for(const token of [...policy.names,...policy.phrases])assert.ok(!copy.includes(token.toLowerCase()),`${module.id}: excluded attribution ${token}`);
 }
});

test('estrogen positions and distinct lipid substrates stay separate in the teaching routes',()=>{
 const endocrineTracks=endocrineBrainBrakeDefinition.stages.flatMap(stage=>stage.tracks);
 const two=endocrineTracks.find(track=>track.id==='endocrine-estrogen-2oh')!;
 const four=endocrineTracks.find(track=>track.id==='endocrine-estrogen-4oh')!;
 assert.deepEqual(two.nodes.slice(-2).map(node=>node.label),['2-OHE1','2-MeOE1']);
 assert.deepEqual(four.nodes.slice(-2).map(node=>node.label),['4-OHE1','4-MeOE1']);
 for(const track of [two,four]){assert.match(track.nodes.at(-1)!.cofactor!,/COMT.*SAM.*Mg/);assert.doesNotMatch(track.nodes.at(-1)!.cofactor!,/B12|葉酸/);}
 const allo=endocrineTracks.find(track=>track.id==='endocrine-allo-synthesis')!;
 const intermediate=allo.nodes.findIndex(node=>node.label==='5α-二氫黃體酮'),final=allo.nodes.findIndex(node=>node.label==='別孕烷醇酮 ALLO');
 assert.ok(intermediate>=0&&final>intermediate,'ALLO synthesis retains its separate 5α-DHP intermediate');
 const lipids=resolutionMyelinDefinition.stages.find(stage=>stage.id==='lipid-families')!.tracks;
 assert.match(lipids.find(track=>track.id==='resolution-lipoxins')!.nodes[0].label,/AA/);
 assert.equal(lipids.find(track=>track.id==='resolution-epa')!.nodes[0].label,'EPA');
 for(const id of ['resolution-d-series','resolution-protectins','resolution-maresins'])assert.equal(lipids.find(track=>track.id===id)!.nodes[0].label,'DHA');
 const access=resolutionMyelinDefinition.stages.find(stage=>stage.id==='brain-access')!;
 assert.deepEqual(access.tracks.map(track=>track.id),['resolution-lpc-transport','resolution-erinacine-distribution']);
 assert.ok(access.tracks[0].nodes.some(node=>node.label==='LPC-DHA'));
 assert.match(access.tracks[0].nodes.find(node=>node.id==='res-mfsd2a')!.cofactor!,/鈉/);
});

test('six simulator galleries retain all 147 reviewed pages and published PDF page numbers',()=>{
 assert.equal(thematicDecks.length,6);assert.equal(thematicPageCount,147);
 assert.deepEqual(thematicDecks.slice(1,4).map(deck=>deck.pageCount),[4,28,32]);
 const seen=new Set<string>();
 for(const deck of thematicDecks){
  assert.equal(deck.pageCount,deck.pages.length);
  for(const page of deck.pages){
   assert.ok(visualPageById.has(page.id));assert.ok(!seen.has(page.id),`${page.id}: source page repeated across topics`);seen.add(page.id);
   const source=visualDeckById.get(page.deckId)!;
   assert.ok(source&&page.image&&page.thumbnail&&page.width>0&&page.height>0,page.id);
   assert.ok(Number.isInteger(page.pdfPageNumber)&&page.pdfPageNumber>=1&&page.pdfPageNumber<=source.pages.length,`${page.id}: wrong published PDF destination`);
  }
 }
 assert.equal(seen.size,147);
});
