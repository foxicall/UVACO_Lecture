import { z } from 'zod';
import { axisIds, concernChoices, mechanismCards, triangleAxes, type AxisId } from '@/data/health-triangle';
import { clinicalSources } from '@/data/clinical-sources';
import { products } from '@/data/uvaco-products';
import { isUrgent } from './concierge';
import { safeCitationUrl } from './search-grounding';

export const clinicalRequestSchema=z.object({
  concernIds:z.array(z.enum(concernChoices.map(c=>c.id) as [string,...string[]])).min(1).max(6).refine(ids=>new Set(ids).size===ids.length),
  question:z.string().trim().max(300).default(''),
  professionalContext:z.boolean().default(false),
}).strict();
export type ClinicalRequest=z.infer<typeof clinicalRequestSchema>;
const sourceIds=z.array(z.enum(clinicalSources.map(s=>s.id) as [string,...string[]])).min(1).max(clinicalSources.length);
export const modelClinicalSchema=z.object({
  summary:z.string().min(12).max(900),
  axisInsights:z.array(z.object({axis:z.enum(axisIds),explanation:z.string().min(8).max(700),sourceIds}).strict()).length(3),
  productIds:z.array(z.enum(products.map(p=>p.id) as [string,...string[]])).max(3),
  productReason:z.string().min(8).max(700),
  evidenceLimit:z.string().min(8).max(700),
  sourceIds,
}).strict();
export const groundingSchema=z.object({
  citations:z.array(z.object({title:z.string().max(180),url:z.string().refine(value=>!!safeCitationUrl(value))}).strict()).max(12),
  queries:z.array(z.string().max(2000)).max(6), supportCount:z.number().int().nonnegative(),
  searchEntryHtml:z.string().max(100000),searched:z.boolean(),
}).strict();
export const clinicalResultSchema=modelClinicalSchema.extend({
  mode:z.enum(['local','gemini']),model:z.enum(['gemini-3.8-pro','gemini-3.8-flash']).nullable(),
  review:z.enum(['general','professional','urgent']), label:z.string().max(400), grounding:groundingSchema,
});
export type ClinicalResult=z.infer<typeof clinicalResultSchema>;
export function clinicalPlan(input:ClinicalRequest) {
  const selected=concernChoices.filter(c=>input.concernIds.includes(c.id));
  const urgent=isUrgent(input.question);
  const professional=input.professionalContext || selected.some(c=>c.medicalReview) || /用藥|吃.{0,12}藥|懷孕|孕期|腎病|肝病|化療|免疫低下|移植|手術|病後|抗凝|安眠|鎮靜|降血|華法林|warfarin|aspirin/i.test(input.question);
  const review=urgent ? 'urgent' : professional ? 'professional' : 'general';
  const mechanismIds=[...new Set(selected.flatMap(c=>c.mechanisms))];
  const cards=mechanismCards.filter(c=>mechanismIds.includes(c.id));
  const eligible=[...new Set(selected.flatMap(c=>c.products))];
  // A reading suggestion should not stack near-identical probiotics or duplicate a daily box.
  const candidates=eligible.filter(id=>!(id==='kanger-n'&&eligible.includes('kanger'))&&!(id==='360'&&eligible.includes('995')));
  const productIds=review==='general' ? candidates.slice(0,3) : [];
  const counts=Object.fromEntries(axisIds.map(axis=>[axis,selected.filter(c=>c.axes.includes(axis)).length])) as Record<AxisId,number>;
  return { review:review as ClinicalResult['review'], cards, productIds, counts, selectedCount:selected.length };
}
export function localClinicalAnalysis(input:ClinicalRequest,label='文件整理・未進行即時網路搜尋'):ClinicalResult {
  const plan=clinicalPlan(input);
  const summary=plan.review==='urgent' ? '您提到的情況可能需要立即就醫。若症狀正在發生，請撥打 119 或請身邊的人陪同急診，先不要以保健品處理。' : plan.review==='professional' ? '您選到的情況需要先確認病因、用藥或恢復期需求。這次先提供相關機轉與就醫討論方向，不自動推薦產品；胸悶若突然出現、持續或伴隨呼吸困難，請立即就醫。' : '先從您關心的生活困擾，認識相關機轉與原料。以下產品是可比較的閱讀選項，不表示需要合併食用；持續或加重的症狀仍需醫療評估。';
  return {
    mode:'local',model:null,review:plan.review,label,summary,
    axisInsights:triangleAxes.map(axis=>({axis:axis.id,explanation:plan.counts[axis.id] ? plan.cards.filter(c=>c.axis===axis.id).map(c=>c.simple).join(' ') || axis.intro : '這次沒有直接選到這個主題的困擾，仍可由機轉卡了解它與其他主題的關聯。',sourceIds:[...new Set(plan.cards.filter(c=>c.axis===axis.id).flatMap(c=>c.sourceIds))].length ? [...new Set(plan.cards.filter(c=>c.axis===axis.id).flatMap(c=>c.sourceIds))] : ['P1']})),
    productIds:plan.productIds,productReason:plan.review==='general'?'依所選主題對照產品標示與研究方向；先比較原料、重複配方及個人適用性。':'先和醫師或藥師確認原因及適用性，再討論是否需要補充。',
    evidenceLimit:'原料或其他配方研究不能直接當成這些產品的治療效果；沒有成品人體試驗支持時，不宣稱協同療效、逆齡或疾病修復。',
    sourceIds:[...new Set(plan.cards.flatMap(c=>c.sourceIds))],
    grounding:{citations:[],queries:[],supportCount:0,searchEntryHtml:'',searched:false},
  };
}
