import test from 'node:test';
import assert from 'node:assert/strict';
import {earlyNutritionStudy as study} from '../src/data/early-nutrition-jama';
import {products,productById} from '../src/data/uvaco-products';
import policy from '../scripts/source-redaction-policy.json';

test('JAMA endpoint comparisons preserve the randomized and modified analysis populations',()=>{
 assert.equal(study.analysis.randomized,236);
 assert.equal(study.analysis.modifiedITT,216);
 assert.deepEqual(Object.keys(study.strategies).sort(),['early','routine']);
 assert.equal(study.strategies.early.n,107);
 assert.equal(study.strategies.routine.n,109);
 assert.equal(study.strategies.early.n+study.strategies.routine.n,study.analysis.modifiedITT);
 assert.equal(study.analysis.ittRelativeRisk,.78);
 assert.deepEqual(study.analysis.ittConfidenceInterval,[.65,.93]);
 assert.deepEqual(study.endpoints.map(endpoint=>endpoint.id).sort(),['mucositis','weight']);
 const expected={
  weight:{events:{early:70,routine:88},rates:[65.4,80.7],arr:15.3,relativeRisk:.81,interval:[.68,.96],nnt:7},
  mucositis:{events:{early:15,routine:29},rates:[14,26.6],arr:12.6,relativeRisk:.53,interval:[.30,.93],nnt:8},
 };
 for(const endpoint of study.endpoints){
  const reference=expected[endpoint.id];
  assert.deepEqual(endpoint.events,reference.events);
  const earlyRisk:number=endpoint.events.early/study.strategies.early.n;
  const routineRisk:number=endpoint.events.routine/study.strategies.routine.n;
  assert.deepEqual([earlyRisk,routineRisk].map(risk=>Number((risk*100).toFixed(1))),reference.rates);
  assert.equal(Number(((routineRisk-earlyRisk)*100).toFixed(1)),reference.arr);
  assert.equal(Number((earlyRisk/routineRisk).toFixed(2)),reference.relativeRisk);
  assert.equal(endpoint.relativeRisk,reference.relativeRisk);
  assert.deepEqual(endpoint.confidenceInterval,reference.interval);
  assert.equal(Math.ceil(1/(routineRisk-earlyRisk)),reference.nnt);
  assert.ok(endpoint.description&&endpoint.interpretation);
 }
 assert.equal(study.endpoints.find(endpoint=>endpoint.id==='weight')!.pValue,.01);
});

test('trial interpretation keeps treatment context and best-case economic estimates visible',()=>{
 const context=[...study.population,study.scope,study.treatmentWindow,study.analysis.summary].join(' ');
 assert.match(context,/鼻咽癌/);
 assert.match(context,/同步.*放.*化療|CCRT|同步化放療/);
 assert.ok(study.treatmentWindow.length>10,'Endpoints need an observation window');
 assert.equal(study.economics.earlyCost,9560.56);
 assert.equal(study.economics.routineCost,9685.23);
 assert.equal(Number((study.economics.routineCost-study.economics.earlyCost).toFixed(2)),124.67);
 assert.equal(study.economics.earlyQaly,.1144);
 assert.equal(study.economics.routineQaly,.1132);
 assert.match(study.economics.context,/best.case|最佳|最有利/i);
 assert.match(study.economics.context,/探索/);
 assert.match(study.economics.context,/短期|療程|治療期/);
 assert.match(study.bridge,/ONS|口服營養/);
 assert.match(study.bridge,/配方|原料/);
 for(const strategy of Object.values(study.strategies))assert.ok(strategy.protocol&&strategy.steps.length>=2);
 assert.equal(study.insights.length,2);
 for(const insight of study.insights)assert.ok(insight.title&&insight.body&&insight.context);
});

test('four daily action cards reach all twelve products without presenting product names as trial arms',()=>{
 assert.equal(study.actions.length,4);
 assert.equal(new Set(study.actions.map(action=>action.id)).size,4);
 const linked=new Set<string>();
 for(const action of study.actions){
  assert.ok(action.title&&action.habit&&action.connection&&action.productIds.length>0);
  assert.equal(new Set(action.productIds).size,action.productIds.length);
  for(const id of action.productIds){assert.ok(productById.has(id),`Unknown product destination: ${id}`);linked.add(id);}
 }
 assert.deepEqual([...linked].sort(),products.map(product=>product.id).sort());
 const trialText=JSON.stringify([study.title,study.hook,study.strategies,study.endpoints,study.population,study.insights]);
 for(const product of products)assert.ok(!trialText.includes(product.name),`Product represented as trial evidence: ${product.name}`);
});

test('JAMA module uses the verified citation and excludes external commentator attribution',()=>{
 assert.equal(study.doi,'10.1001/jamaoncol.2026.4535');
 assert.equal(study.published,'2026-11-12');
 assert.match(study.citation,/Su L/);
 assert.match(study.citation,/JAMA Oncology/);
 assert.ok(study.sources.length>=2);
 for(const url of [study.url,...study.sources.map(source=>source.url)])assert.equal(new URL(url).protocol,'https:');
 const copy=JSON.stringify(study).toLowerCase();
 for(const token of [...policy.names,...policy.phrases,'吳教授'])assert.ok(!copy.includes(token.toLowerCase()),`Excluded attribution: ${token}`);
});
