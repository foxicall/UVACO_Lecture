import test from 'node:test';
import assert from 'node:assert/strict';
import { pillars } from '../src/data/lecture-poster';
import { products } from '../src/data/uvaco-products';
import { pillarStories, productStoryBridge, storyNarration, narrativeAiInstruction } from '../src/data/four-pillars-story';
import { everydayAiInstruction } from '../src/data/everyday-language';
import { systemInstruction, localReadingRoute } from '../src/lib/concierge';

test('four three-act stories cover every product once and keep early narration free of product names',()=>{
 const ids:string[]=[];
 for(const pillar of pillars){
  const story=pillarStories[pillar.id];assert.equal(story.bridges.length,3);assert.equal(story.symptoms.length,5);
  assert.deepEqual([...story.bridges.map(b=>b.productId)].sort(),[...pillar.products].sort());
  assert.ok(story.chemicals.length>=3);
  for(const bridge of story.bridges){ids.push(bridge.productId);assert.ok(bridge.bodyNeed.length>50);assert.equal(productStoryBridge[bridge.productId].pillarId,pillar.id);}
  for(const product of products)assert.ok(!`${storyNarration(pillar.id,0)}${storyNarration(pillar.id,1)}`.includes(product.name));
  assert.doesNotMatch(JSON.stringify(story.chemicals),/GABA|SOD|GOT|GPT|4-AAQB|Tau|Zonulin/);
 }
 assert.equal(new Set(ids).size,12);assert.equal(ids.length,12);
});
test('statistics retain years and study populations, without changing selected samples into national disease rates',()=>{
 assert.match(pillarStories.repair.stat.context,/2023/);
 assert.doesNotMatch(pillarStories.repair.stat.context,/臥床/);
 assert.equal(pillarStories.neural.stat.value,'7.99%');assert.match(pillarStories.neural.stat.label,/社區 65 歲以上/);
 assert.match(pillarStories.autonomic.stat.label,/固定日班/);assert.match(pillarStories.autonomic.stat.context,/2019/);
 assert.match(pillarStories.inflammation.stat.label,/死亡原因/);
 for(const story of Object.values(pillarStories)){assert.equal(new URL(story.stat.url).protocol,'https:');assert.doesNotMatch(JSON.stringify({...story,science:[]}),/92\.4%|26\.3%|51%|一秒鑽|秒速吸收|直接修復神經|專門清除.*電磁波/);}
});
test('shared AI instructions require narrative order while emergencies still bypass product bridges',()=>{
 assert.ok(everydayAiInstruction.includes(narrativeAiInstruction));assert.ok(systemInstruction.includes(narrativeAiInstruction));
 assert.ok(systemInstruction.includes('Google Search'));
 const local=localReadingRoute('想認識腸道產品');assert.match(local.sentences[0],/本機文件/);assert.match(local.sentences[1],/解連蛋白|內毒素/);assert.match(local.sentences[2],/配方原料/);
 const emergency=localReadingRoute('現在胸痛又呼吸困難');assert.match(emergency.sentences.join(''),/119/);assert.deepEqual(emergency.targetProductIds,[]);
});
