import test from 'node:test';
import assert from 'node:assert/strict';
import { GenerateContentResponse } from '@google/genai';
import { clinicalPlan, clinicalRequestSchema, clinicalResultSchema, localClinicalAnalysis } from '../src/lib/clinical-analysis';
import { parseClinicalResponse, CLINICAL_MODELS, clinicalSourceContext, clinicalSlideContext } from '../src/services/geminiClinicalEngine';
import { extractGrounding, safeCitationUrl } from '../src/lib/search-grounding';
import { POST } from '../src/app/api/clinical-analysis/route';
import { concernChoices } from '../src/data/health-triangle';
const gut=clinicalRequestSchema.parse({concernIds:['gut']});
test('symptom selection creates transparent reading counts, not diagnostic scores or duplicate supplements',()=>{
  const plan=clinicalPlan(gut);
  assert.deepEqual(plan.counts,{inflammation:1,repair:0,autonomic:1});
  assert.ok(!plan.productIds.includes('kanger-n'));
  assert.equal(plan.selectedCount,1);
  assert.ok(clinicalResultSchema.safeParse(localClinicalAnalysis(gut)).success);
  for(let mask=1;mask<64;mask++) {
    const input=clinicalRequestSchema.parse({concernIds:concernChoices.filter((_,i)=>mask&(1<<i)).map(c=>c.id)});
    assert.ok(clinicalResultSchema.safeParse(localClinicalAnalysis(input)).success,`Invalid offline combination: ${mask}`);
  }
  for(const input of [{concernIds:['circulation']},{concernIds:['recovery']},{concernIds:['gut'],professionalContext:true},{concernIds:['neural'],question:'突然右手無力'}]){
    const result=localClinicalAnalysis(clinicalRequestSchema.parse(input));
    assert.deepEqual(result.productIds,[]);
  }
});
function fixture(text:string){ const result=new GenerateContentResponse();result.candidates=[{content:{role:'model',parts:[{text}]},groundingMetadata:{webSearchQueries:['probiotics safety'],groundingChunks:[{web:{title:'NCCIH',uri:'https://www.nccih.nih.gov/health/probiotics-usefulness-and-safety'}},{web:{title:'unsafe',uri:'javascript:alert(1)'}}],groundingSupports:[]}}];return result; }
test('grounded responses retain real citations and reject unauthorized product actions',()=>{
  const {mode,model,review,label,grounding,...answer}=localClinicalAnalysis(gut);
  const response=fixture(JSON.stringify(answer));
  const parsed=parseClinicalResponse(response,gut,CLINICAL_MODELS.live);
  assert.equal(parsed.mode,'gemini');assert.equal(parsed.grounding.citations.length,1);assert.equal(parsed.grounding.searched,true);
  assert.ok(clinicalResultSchema.safeParse(parsed).success);
  assert.throws(()=>parseClinicalResponse(fixture(JSON.stringify({...answer,productIds:['antrodia']})),gut,CLINICAL_MODELS.live));
  assert.throws(()=>parseClinicalResponse(fixture(JSON.stringify({...answer,diagnosticScore:90})),gut,CLINICAL_MODELS.live));
  const ungrounded=new GenerateContentResponse();assert.equal(extractGrounding(ungrounded).searched,false);
  ungrounded.candidates=[{content:{role:'model',parts:[{text:JSON.stringify(answer)}]}}];
  const retained=parseClinicalResponse(ungrounded,gut,CLINICAL_MODELS.live,extractGrounding(response));
  assert.equal(retained.grounding.citations[0].title,'NCCIH');assert.equal(retained.grounding.searched,true);
  for(const url of ['javascript:alert(1)','http://example.com','https://user:secret@example.com','https://127.0.0.1/test'])assert.equal(safeCitationUrl(url),null);
});
test('clinical API validates requests and sends urgent or medication contexts to local medical review',async()=>{
  const request=(body:string,origin='http://localhost:3000')=>new Request('http://0.0.0.0:3000/api/clinical-analysis',{method:'POST',headers:{host:'localhost:3000',origin,'Content-Type':'application/json'},body});
  assert.equal((await POST(request('{}','https://other.example'))).status,403);
  assert.equal((await POST(request('{broken'))).status,400);
  assert.equal((await POST(request('x'.repeat(4097)))).status,413);
  assert.equal((await POST(request(JSON.stringify({concernIds:['unknown']})))).status,400);
  const urgent=await POST(request(JSON.stringify({concernIds:['pain'],question:'現在胸痛呼吸困難'})));
  assert.equal(urgent.status,200);const data=await urgent.json();assert.equal(data.review,'urgent');assert.ok(data.summary.includes('119'));assert.deepEqual(data.productIds,[]);
  const professional=await POST(request(JSON.stringify({concernIds:['sleep'],professionalContext:true})));
  const result=await professional.json();assert.equal(result.mode,'local');assert.deepEqual(result.productIds,[]);
});


test('AI context cites the new PDF pages and links only the six redrawn decks',()=>{
  const sources=clinicalSourceContext(gut);
  assert.ok(sources.some(source=>source.id==='Q6' && source.passages.length));
  assert.ok(sources.every(source=>!['P0','D2','D3','D4'].includes(source.id)));
  const slides=clinicalSlideContext(gut);
  assert.ok(slides.some(slide=>slide.slideId==='longevity-6-2' && slide.sourcePages.length));
  assert.ok(slides.every(slide=>slide.deckId.startsWith('longevity-') && slide.format.includes('重製')));
  assert.doesNotMatch(JSON.stringify({sources,slides}),/歐瀚文|歐忠儒|王偉全|洪佳琪|劉士銘|王凱瑜/);
});
