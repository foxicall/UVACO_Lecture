import test from 'node:test';
import assert from 'node:assert/strict';
import {biochemicalPathways,pathwayById,pillarPathwayIds,productPathwayIds} from '../src/data/biochemical-pathways';
import {thematicDecks,thematicPageCount} from '../src/data/thematic-decks';
import {products} from '../src/data/uvaco-products';
import {pillars} from '../src/data/lecture-poster';
import {visualPageById,visualPageCount,visualPages} from '../src/data/visual-assets-manifest';

test('all eight biochemical pathways expose complete branches and precise ingredient-to-node links',()=>{
 assert.deepEqual([...pathwayById.keys()].sort(),['methylation','tryptophan','neurosteroids','gut-barrier','resolution','mitochondria','vascular','detox'].sort());
 assert.equal(biochemicalPathways.length,8);
 const allProducts=new Set<string>();
 for(const pathway of biochemicalPathways){
  assert.ok(pathway.title.length>5&&pathway.metaphor.length>10&&pathway.summary.length>20,pathway.id);
  assert.ok(pathway.lanes.length>=2,`${pathway.id}: distinct metabolic branches are required`);
  const nodes=pathway.lanes.flatMap(lane=>lane.nodes);
  assert.equal(new Set(nodes.map(node=>node.id)).size,nodes.length,`${pathway.id}: ambiguous node ID`);
  for(const lane of pathway.lanes){
   assert.ok(lane.nodes.length>=2);
   for(const node of lane.nodes){assert.ok(node.label.length>1&&node.detail.length>10,`${pathway.id}/${node.id}`);}
  }
  assert.ok(pathway.sourcePageIds.length>0);
  for(const id of pathway.sourcePageIds)assert.ok(visualPageById.has(id),`${pathway.id}: missing scientific source ${id}`);
  assert.ok(pathway.references.length>0);
  for(const ref of pathway.references)if(ref.url)assert.ok(new URL(ref.url).protocol==='https:');
  for(const link of pathway.products){
   assert.ok(products.some(p=>p.id===link.productId));allProducts.add(link.productId);
   assert.ok(link.nodeIds.length>0&&link.nodeIds.every(id=>nodes.some(node=>node.id===id)),`${pathway.id}/${link.productId}: ingredient detached from a node`);
   assert.ok(link.ingredient.length>1&&link.connection.length>10);
   assert.ok(['營養生理','原料研究'].includes(link.evidence));
  }
 }
 assert.deepEqual([...allProducts].sort(),products.map(product=>product.id).sort());
});

test('four story pillars and twelve product drawers have usable pathway selections',()=>{
 assert.deepEqual(Object.keys(pillarPathwayIds).sort(),pillars.map(p=>p.id).sort());
 for(const [pillar,ids] of Object.entries(pillarPathwayIds)){
  assert.ok(ids.length>0);
  for(const id of ids)assert.ok(pathwayById.get(id)?.pillarIds.includes(pillar as typeof pillars[number]['id']));
 }
 assert.deepEqual(Object.keys(productPathwayIds).sort(),products.map(p=>p.id).sort());
 for(const [productId,ids] of Object.entries(productPathwayIds)){
  assert.ok(ids.length>0,productId);
  for(const id of ids)assert.ok(pathwayById.get(id)?.products.some(link=>link.productId===productId),`${productId}/${id}`);
 }
});

test('six clinical topics cover each scientific slide exactly once and all eight pathways',()=>{
 assert.equal(thematicDecks.length,6);
 assert.equal(thematicPageCount,visualPageCount);
 assert.deepEqual(thematicDecks.map(d=>d.id),Array.from({length:6},(_,i)=>`longevity-${i+1}`));
 const ids=thematicDecks.flatMap(d=>d.pages.map(p=>p.id));
 assert.equal(new Set(ids).size,ids.length,'Scientific slides should not be duplicated across topics');
 assert.deepEqual(ids.sort(),visualPages.map(p=>p.id).sort());
 assert.deepEqual([...new Set(thematicDecks.flatMap(d=>d.pathwayIds))].sort(),[...pathwayById.keys()].sort());
 for(const deck of thematicDecks){assert.ok(deck.pages.length>0);assert.equal(deck.pageCount,deck.pages.length);assert.match(deck.title,/^專題[一二三四五六]：《.+》$/);}
 const environment=thematicDecks.find(d=>d.id==='longevity-2')!;
 assert.equal(environment.pageCount,4);
 assert.match(environment.introduction,/文稿重製/);
});
