'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Search, Square } from 'lucide-react';
import { clinicalPlan, clinicalRequestSchema, clinicalResultSchema, localClinicalAnalysis, type ClinicalResult } from '@/lib/clinical-analysis';
import { concernChoices, dailyCare, triangleAxes, type SlideTarget } from '@/data/health-triangle';
import { clinicalSourceById } from '@/data/clinical-sources';
import { productById } from '@/data/uvaco-products';
import { staticSite, sitePath } from '@/lib/site';
import VoiceGuide from './VoiceGuide';
import ScienceDetails from './ScienceDetails';
import { everydayProducts } from '@/data/everyday-language';
import SearchReferences from './SearchReferences';

export default function ClinicalAnalyzer({onProducts,onSlide}:{onProducts:(ids:string[])=>void;onSlide:(target:SlideTarget)=>void}) {
  const [selected,setSelected]=useState<string[]>([]),[question,setQuestion]=useState('');
  const [professional,setProfessional]=useState(false),[loading,setLoading]=useState(false);
  const [result,setResult]=useState<ClinicalResult|null>(null),[message,setMessage]=useState('');
  const controller=useRef<AbortController|null>(null),busy=useRef(false);
  const resultRef=useRef<HTMLElement>(null);
  const [submitted,setSubmitted]=useState<ReturnType<typeof clinicalRequestSchema.parse>|null>(null);
  useEffect(()=>()=>controller.current?.abort(),[]);
  const plan=submitted ? clinicalPlan(submitted) : null;
  function resetResult(){setResult(null);setSubmitted(null);setMessage('');}
  async function analyze() {
    if(busy.current||!selected.length)return;
    const input=clinicalRequestSchema.parse({concernIds:selected,question,professionalContext:professional});
    const local=localClinicalAnalysis(input,staticSite?'靜態版文件整理・這不是AI回答':'文件整理・等待搜尋結果');
    setSubmitted(input);setResult(local);setMessage('');
    requestAnimationFrame(()=>resultRef.current?.focus({preventScroll:true}));
    if(staticSite||local.review!=='general'){if(local.review!=='general')setResult(localClinicalAnalysis(input,'文件整理・先確認醫療需求'));return;}
    busy.current=true;setLoading(true);
    const request=new AbortController();controller.current=request;
    const timer=setTimeout(()=>request.abort(),65000);
    try {
      const response=await fetch(sitePath('/api/clinical-analysis'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input),signal:request.signal});
      if(!response.ok)throw new Error('Search unavailable');
      const answer=clinicalResultSchema.parse(await response.json());
      if(answer.productIds.some(id=>!clinicalPlan(input).productIds.includes(id)))throw new Error('Unexpected product action');
      setResult(answer);
    }catch{
      setResult(localClinicalAnalysis(input,'文件整理・這不是AI回答'));
      setMessage(request.signal.aborted?'已停止搜尋，您仍可閱讀下方文件整理。':'目前未能完成AI搜尋，您仍可閱讀下方文件整理。');
    }finally{clearTimeout(timer);busy.current=false;setLoading(false);}
  }
  return <div className="clinical-analyzer">
    <h3>先從您關心的事開始</h3><p>選一項或多項，從生活故事開始，慢慢看懂配方。</p>
    <form onSubmit={event=>{event.preventDefault();analyze();}}>
      <fieldset disabled={loading}><legend className="sr-only">選擇目前關注的困擾，可複選</legend>
        <div className="concern-options">{concernChoices.map(choice=><label key={choice.id} className={selected.includes(choice.id)?'selected':''}><input type="checkbox" name="concern" value={choice.id} checked={selected.includes(choice.id)} onChange={()=>{setSelected(ids=>ids.includes(choice.id)?ids.filter(id=>id!==choice.id):[...ids,choice.id]);resetResult();}}/><span>{choice.label}</span></label>)}</div>
        <label className="professional-context"><input type="checkbox" checked={professional} onChange={event=>{setProfessional(event.target.checked);resetResult();}}/><span>目前用藥、懷孕、肝腎病或免疫低下，需先確認適用性</span></label>
        <label htmlFor="clinical-question">想補充的問題（選填）</label><textarea id="clinical-question" rows={2} maxLength={300} value={question} onChange={event=>{setQuestion(event.target.value);resetResult();}} aria-describedby="clinical-privacy" placeholder="例如：想比較不同益生菌的原料" />
      </fieldset>
      <div className="clinical-actions"><button className="primary" type="submit" disabled={!selected.length||loading}><Search size={21}/>{staticSite?'依文件整理我的關注':'請 Gemini 3.8 搜尋分析'}</button>{loading&&<button type="button" onClick={()=>controller.current?.abort()}><Square size={18}/>停止搜尋</button>}</div>
      <p id="clinical-privacy" className="small-copy">{staticSite?'此公開版本在裝置內整理文件，不會送出問題，也不需要輸入金鑰。':'送出後，所選主題與文字會傳至 Google Gemini，並搜尋相關資料。請勿輸入姓名、電話或病歷。'}</p>
    </form>
    {result&&plan&&<section className="clinical-result" ref={resultRef} tabIndex={-1} aria-label="關注主題分析結果">
      <p className="result-mode" role="status">{loading?'先提供文件整理，正在搜尋外部資料…':result.label}</p>
      {message&&<p role="status">{message}</p>}
      <h3>{result.review==='urgent'?'請先尋求即時醫療協助':result.review==='professional'?'先確認醫療需求':'這次值得一起了解的事'}</h3>
      <p className="result-summary">{result.summary}</p>
      {result.review!=='urgent'&&<>
        <div className="topic-distribution"><h4>這次關注的主題</h4><p className="small-copy">依您勾選的 {plan.selectedCount} 項困擾整理，可同時涉及多個主題；每一格表示這次選到的主題。</p><dl>{triangleAxes.map(axis=><div key={axis.id}><dt>{axis.title}</dt><dd><span className="topic-meter" aria-hidden="true"><span style={{width:`${plan.counts[axis.id]/plan.selectedCount*100}%`}}/></span><span>{plan.counts[axis.id]} 項關聯</span></dd></div>)}</dl></div>
        <div className="clinical-findings">{result.axisInsights.map(insight=><article key={insight.axis}><h4>{triangleAxes.find(axis=>axis.id===insight.axis)?.title}</h4><p>{insight.explanation}</p></article>)}</div>
        <section className="product-reading-result"><h4>{result.productIds.length?'可比較的產品原料':'先把問題帶給醫療人員'}</h4><p>{result.productReason}</p>{result.productIds.length>0&&<><div className="result-products">{result.productIds.map(id=><div key={id}><strong>{productById.get(id)?.name}</strong><p>{everydayProducts[id].comparison}</p></div>)}</div><button className="primary" onClick={()=>onProducts(result.productIds)}>在群島查看這組產品 <ArrowUpRight size={20}/></button></>}<ScienceDetails><h4>這次查到的研究條件</h4><p>{result.evidenceLimit}</p><p>資料主題：{result.sourceIds.map(id=>clinicalSourceById.get(id)?.title).join('、')}</p>{result.productIds.map(id=><section key={id}><h4>{productById.get(id)?.name}・食用前看清楚</h4><p>{productById.get(id)?.caution}</p></section>)}</ScienceDetails></section>
        <section className="daily-care"><h4>把照護放回一天的生活</h4>{dailyCare.map(care=><div key={care.period}><strong>{care.period}</strong><p>{care.text}</p></div>)}</section>
        <div className="related-slides"><h4>接著聽一頁簡報</h4>{plan.cards.slice(0,2).map(card=><button key={card.id} onClick={()=>onSlide(card.slide)}>{card.title}<ArrowUpRight size={19}/></button>)}</div>
        <SearchReferences grounding={result.grounding}/>
      </>}
      <VoiceGuide text={result.review==='urgent'?result.summary:[result.summary,...result.axisInsights.map(axis=>axis.explanation),result.productReason].join('。')} label="朗讀這次整理"/>
    </section>}
  </div>;
}
