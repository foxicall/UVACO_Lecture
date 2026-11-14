import test from 'node:test';
import assert from 'node:assert/strict';
import { longevityDecks } from '../src/data/longevity-decks-manifest';
import { everydayProducts, everydayCards, everydayAiInstruction, homepageNote } from '../src/data/everyday-language';
import { slideNarration } from '../src/data/pptx-decks';
import { systemInstruction, localReadingRoute, answerSchema, completedSentences } from '../src/lib/concierge';
import { clinicalRequestSchema, localClinicalAnalysis, modelClinicalSchema } from '../src/lib/clinical-analysis';
const jargon=/ETC|Zonulin|LPS|TLR4|NF-κB|Efferocytosis|MFSD2A|ADMA|eNOS|MPO|PON-1|DunedinPACE|Homocysteine|NLRP3|COMT|GABA|SOD|LPC-DHA|SAMe|NGF|BDNF/;

test('everyday reading and narration are separated from complete scientific evidence',()=>{
 assert.equal(Object.keys(everydayProducts).length,12);
 assert.equal(Object.keys(everydayCards).length,17);
 assert.doesNotMatch(JSON.stringify({products:everydayProducts,cards:everydayCards}),jargon);
 for(const deck of longevityDecks){
  assert.equal(deck.slides.length,4);
  for(const slide of deck.slides){
   assert.doesNotMatch(slideNarration(slide),jargon);
   assert.doesNotMatch(JSON.stringify(slide.diagram),jargon);
   assert.ok(slide.science.blocks.length>=2);
   assert.ok(slide.science.note.length>20);
  }
 }
 assert.match(JSON.stringify(longevityDecks.map(d=>d.slides.map(s=>s.science))),/MFSD2A/);
});
test('AI copy avoids boilerplate while urgent and medication paths still give concrete actions',()=>{
 assert.ok(systemInstruction.includes(everydayAiInstruction));
 assert.equal(homepageNote,'本站內容為健康講座衛教與精準營養分享，保健食品旨在提供細胞修復原料，實際調理感受依個人體質而異。');
 const urgent=localReadingRoute('現在胸痛又呼吸困難');
 assert.deepEqual(urgent.targetProductIds,[]);assert.match(urgent.sentences.join(''),/119/);
 const medication=localReadingRoute('正在吃慢性病的藥，可以吃保健品嗎？');
 assert.deepEqual(medication.targetProductIds,[]);assert.match(medication.sentences.join(''),/藥單|藥師/);
 const normal=localClinicalAnalysis(clinicalRequestSchema.parse({concernIds:['gut']}));
 assert.doesNotMatch(normal.summary+normal.productReason,/不保證療效|僅供參考|非藥品|請諮詢醫師/);
});

test('model responses with generic disclaimer filler cannot enter the ordinary reading layer',()=>{
 assert.equal(answerSchema.safeParse({sentences:['本建議僅供參考。','從餐食清單開始。','再看看生活節奏。'],targetProductIds:[]}).success,false);
 assert.deepEqual(completedSentences('{"sentences":["本建議僅供參考。"]}'),[]);
 const {mode,model,review,label,grounding,...answer}=localClinicalAnalysis(clinicalRequestSchema.parse({concernIds:['gut']}));
 assert.equal(modelClinicalSchema.safeParse({...answer,productReason:'兩者都是食品原料，不要當成能治病的藥。'}).success,false);
});
