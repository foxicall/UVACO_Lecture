'use client';

import {useEffect,useId,useRef,useState} from 'react';
import {ArrowUpRight,BookOpen,CalendarDays,Check,Clock3,MapPin,Pause,Play,Sprout} from 'lucide-react';
import {earlyNutritionStudy as study} from '@/data/early-nutrition-jama';
import type {JamaEndpoint,NutritionStrategy} from '@/data/early-nutrition-types';
import {productById} from '@/data/uvaco-products';
import VoiceGuide from './VoiceGuide';

const arms: NutritionStrategy[]=['early','routine'];
const percent=(events:number,n:number)=>events/n*100;
const oneDecimal=(value:number)=>value.toFixed(1);
const money=(value:number)=>value.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});

function PlanningScene({strategy,running}:{strategy:NutritionStrategy;running:boolean}){
 const uid=useId().replace(/:/g,'');const early=strategy==='early';
 const path='M36 82 L112 26 L188 82';
 return <figure className="jama-planning-scene" aria-label="像安排房屋保養，先把時間與需要看清楚；這是時機的比喻">
  <svg viewBox="0 0 224 176" role="img" aria-labelledby={`${uid}-title`}>
   <title id={`${uid}-title`}>{early?'提早把營養安排放進治療計畫':'依需要啟動營養支持的時機'}</title>
   <ellipse cx="112" cy="155" rx="82" ry="11" fill="#223c2720"/>
   <path d="M55 76 112 35 169 76 V149 H55Z" fill={early?'#e8edde':'#f0e5d9'} stroke={early?'#7a9271':'#b3937b'} strokeWidth="2"/>
   <path d="M36 82 112 26 188 82" fill="none" stroke={early?'#2d654d':'#a26a54'} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
   <path d="M36 82 112 26 188 82" fill="none" stroke="#fbf4da" strokeWidth="2" strokeDasharray={early?undefined:'7 8'}/>
   <rect x="93" y="104" width="38" height="45" rx="4" fill={early?'#9db08c':'#c0ac96'}/>
   <rect x="66" y="88" width="20" height="24" rx="3" fill="#fff9e8" stroke="#afab88" strokeWidth="1.5"/>
   <rect x="138" y="88" width="20" height="24" rx="3" fill="#fff9e8" stroke="#afab88" strokeWidth="1.5"/>
   <circle cx="174" cy="122" r="25" fill={early?'#1b4d3e':'#8b4a39'} stroke="#faf7f2" strokeWidth="4"/>
   {early?<path d="m163 122 7 7 14-16" fill="none" stroke="#fff9e7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>:<g fill="none" stroke="#fff9e7" strokeWidth="3" strokeLinecap="round"><circle cx="174" cy="122" r="13"/><path d="M174 113 V122 L181 126"/></g>}
   <path data-jama-timing-path={strategy} d={path} fill="none" stroke="transparent"/>
   {running&&<circle r="5" fill="#d3a353" stroke="#fff8e5" strokeWidth="1.5"><animateMotion path={path} dur="4s" repeatCount="indefinite"/></circle>}
  </svg>
  <figcaption>先安排，再持續觀察</figcaption>
 </figure>;
}

function EndpointComparison({endpoint,strategy,running}:{endpoint:JamaEndpoint;strategy:NutritionStrategy;running:boolean}){
 const early=percent(endpoint.events.early,study.strategies.early.n),routine=percent(endpoint.events.routine,study.strategies.routine.n);
 const reduction=routine-early;const nnt=reduction>0?Math.ceil(100/reduction):null;
 return <article className="jama-endpoint" data-jama-endpoint={endpoint.id}>
  <header><span className="jama-endpoint-index">{endpoint.id==='weight'?'01 / 身體儲備':'02 / 治療期黏膜'}</span><h4>{endpoint.title}</h4><p>{endpoint.description}</p></header>
  <div className="jama-result-bars" key={strategy}>
   {arms.map(arm=>{const risk=percent(endpoint.events[arm],study.strategies[arm].n);return <div className={`jama-arm-row${strategy===arm?' is-selected':''}`} key={arm} data-jama-group={arm}>
    <div className="jama-arm-label"><strong>{study.strategies[arm].title}</strong>{strategy===arm&&<span><Check size={15}/>目前閱讀</span>}</div>
    <div className="jama-arm-values"><strong data-jama-percent>{oneDecimal(risk)}<small>%</small></strong><span data-jama-count>{endpoint.events[arm]} / {study.strategies[arm].n} 人</span></div>
    <div className="jama-risk-track" data-jama-arm={arm} data-risk={risk} aria-hidden="true"><i style={{width:`${risk}%`}} data-jama-bar-animate={running}/></div>
   </div>;})}
  </div>
  <div className="jama-absolute-result"><span>兩組相差</span><strong>{oneDecimal(reduction)}<small> 個百分點</small></strong><p>{endpoint.interpretation}</p></div>
  {endpoint.id==='weight'&&nnt&&<p className="jama-nnt"><span>約 <strong>{nnt}</strong> 人</span>在這段治療期，每約 {nnt} 人採取早期策略，平均多避免 1 例這項體重下降事件。這是依組間差異計算的估計值。</p>}
  <details className="jama-endpoint-statistics"><summary>看相對風險與統計範圍</summary><dl><div><dt>相對風險 RR</dt><dd>{endpoint.relativeRisk.toFixed(2)}</dd></div><div><dt>相對減少（依人數計算）</dt><dd>約 {Math.round((1-early/routine)*100)}%</dd></div><div><dt>95% 信賴區間</dt><dd>{endpoint.confidenceInterval.map(value=>value.toFixed(2)).join('–')}</dd></div>{endpoint.pValue!==undefined&&<div><dt>P 值</dt><dd>{endpoint.pValue.toFixed(2)}</dd></div>}</dl><p>「相差幾個百分點」比較兩組發生比例；RR 比較兩組風險的比值，兩者回答不同的問題。</p></details>
 </article>;
}

export default function EarlyNutritionJamaInteractive({showProducts=true,onProducts}:{showProducts?:boolean;onProducts?:(ids:string[])=>void}){
 const root=useRef<HTMLElement>(null);
 const [strategy,setStrategy]=useState<NutritionStrategy>('early');
 const [paused,setPaused]=useState(false),[reduced,setReduced]=useState(true),[visible,setVisible]=useState(false),[pageVisible,setPageVisible]=useState(true);
 const motion=reduced?'reduced':paused?'paused':!visible||!pageVisible?'offscreen':'running';const running=motion==='running';
 const active=study.strategies[strategy];
 const primary=study.endpoints.find(endpoint=>endpoint.id==='weight')!;
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);
  const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.01});if(root.current)observer.observe(root.current);
  const visibility=()=>setPageVisible(!document.hidden);visibility();document.addEventListener('visibilitychange',visibility);
  return()=>{media.removeEventListener('change',update);observer.disconnect();document.removeEventListener('visibilitychange',visibility);};
 },[]);
 const narration=`${study.title}。${study.scope}。${active.title}。${active.protocol}。${study.endpoints.map(endpoint=>`${endpoint.title}，早期組百分之${oneDecimal(percent(endpoint.events.early,study.strategies.early.n))}，常規組百分之${oneDecimal(percent(endpoint.events.routine,study.strategies.routine.n))}。${endpoint.interpretation}`).join('。')}`;
 return <section ref={root} className="jama-early-master" data-jama-strategy={strategy} data-jama-motion={motion} aria-label="JAMA Oncology 早期營養支持互動比較">
  <header className="jama-heading"><div className="jama-journal-line"><span><BookOpen size={18}/>{study.eyebrow}</span><time dateTime={study.published}>{study.published.replaceAll('-','.')}</time></div><h3>{study.title}</h3><p className="jama-scope-summary">{study.population.find(item=>item.includes('鼻咽癌'))||study.scope}</p><p className="jama-headline-result" data-jama-headline-result><span>{primary.title}：</span><span data-jama-summary-arm="routine">常規 <strong>{oneDecimal(percent(primary.events.routine,study.strategies.routine.n))}%</strong></span><span data-jama-summary-arm="early">提早 <strong>{oneDecimal(percent(primary.events.early,study.strategies.early.n))}%</strong></span></p><a className="jama-citation" href={study.url} aria-label={study.citation} target="_blank" rel="noopener noreferrer">閱讀原始研究<ArrowUpRight size={18}/></a></header>
  <div className="jama-toolbar"><div className="jama-strategy-buttons" role="group" aria-label="比較兩種營養支持策略">{arms.map(arm=><button type="button" key={arm} data-jama-strategy-option={arm} aria-pressed={strategy===arm} onClick={()=>setStrategy(arm)}>{arm==='early'?<Sprout size={23}/>:<Clock3 size={23}/>}<span>{study.strategies[arm].label}</span></button>)}</div><div className="jama-motion-tools"><button type="button" data-jama-pause disabled={reduced} aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused?<Play size={19}/>:<Pause size={19}/>}<span>{reduced?'遵循減少動態':paused?'繼續動畫':'暫停動畫'}</span></button><VoiceGuide text={narration} label="聽研究導讀"/></div></div>
  <section className="jama-outcomes" aria-label="兩組實際觀察到的結果"><p className="jama-outcome-window">{study.treatmentWindow}</p><div className="jama-endpoint-grid">{study.endpoints.map(endpoint=><EndpointComparison key={endpoint.id} endpoint={endpoint} strategy={strategy} running={running}/>)}</div></section>
  <p className="jama-hook">{study.hook}</p>
  <section className="jama-protocol" data-jama-protocol={strategy} aria-label="所選策略的營養安排"><PlanningScene strategy={strategy} running={running}/><div className="jama-protocol-copy" aria-live="polite"><span className="jama-protocol-kicker"><CalendarDays size={19}/>安排的時機</span><h4>{active.title}</h4><p>{active.protocol}</p><ol className="jama-protocol-steps">{active.steps.map((step,index)=><li key={`${strategy}-${index}`}><span>{index+1}</span><p>{step}</p></li>)}</ol></div></section>
  <details className="jama-context-details"><summary>研究對象、配方與觀察範圍</summary><section className="jama-study-context" aria-label="這項研究的對象與範圍"><div className="jama-study-numbers"><div><strong>{study.analysis.randomized}</strong><span>位患者隨機分組</span></div><div><strong>{study.analysis.modifiedITT}</strong><span>位納入主要分析</span></div></div><div className="jama-population"><h4>先認識，這是一項怎樣的試驗</h4><ul>{study.population.map(item=><li key={item}>{item}</li>)}</ul><p>{study.scope}</p></div></section></details>
  <details className="jama-analysis"><summary>看主要分析與全體隨機分組分析</summary><div><p>{study.analysis.summary}</p><dl><div><dt>全體隨機分組</dt><dd>{study.analysis.randomized} 人</dd></div><div><dt>ITT 體重端點 RR</dt><dd>{study.analysis.ittRelativeRisk.toFixed(2)}</dd></div><div><dt>95% 信賴區間</dt><dd>{study.analysis.ittConfidenceInterval.map(value=>value.toFixed(2)).join('–')}</dd></div></dl></div></details>
  <details className="jama-economics"><summary>照護費用與生活品質，怎麼讀？</summary><div><span className="jama-economics-kicker">探索性經濟分析</span><p className="jama-economic-context">{study.economics.context}</p><div className="jama-economic-grid">{arms.map(arm=><article key={arm}><h5>{study.strategies[arm].title}</h5><strong>{money(arm==='early'?study.economics.earlyCost:study.economics.routineCost)} <small>美元</small></strong><p>QALYs：{(arm==='early'?study.economics.earlyQaly:study.economics.routineQaly).toFixed(4)}</p></article>)}</div><p className="jama-cost-difference">這個分析情境中的平均費用差：<strong>{money(study.economics.routineCost-study.economics.earlyCost)} 美元</strong>。</p></div></details>
  <section className="jama-insights" aria-label="讓營養計畫落實的兩個問題"><header className="jama-section-heading"><span>數字之外，也要看執行</span><h4>安排得早，也要持續吃得到</h4></header><div className="jama-insight-grid">{study.insights.map((insight,index)=><article key={insight.id} data-jama-insight={insight.id}><span className="jama-insight-number">0{index+1}</span><h5>{insight.title}</h5>{insight.value&&<strong className="jama-insight-value">{insight.value}</strong>}<p>{insight.body}</p><details><summary>再看這個細節的意思</summary><p>{insight.context}</p></details></article>)}</div></section>
  <section className="jama-daily-actions" aria-label="從研究閱讀走向日常照護"><header className="jama-section-heading"><span>把提早準備，放回日常</span><h4>今天，可以先留意四件事</h4>{showProducts&&<p className="jama-evidence-bridge">{study.bridge}</p>}</header><div className="jama-action-grid">{study.actions.map((action,index)=><article key={action.id} data-jama-action={action.id}>
   {showProducts&&onProducts?<button type="button" className="jama-action-heading" data-jama-action-select={action.id} onClick={()=>onProducts([...action.productIds])}><span>{String(index+1).padStart(2,'0')}</span><strong>{action.title}</strong><ArrowUpRight size={23}/></button>:<h5 className="jama-action-title"><span>{String(index+1).padStart(2,'0')}</span>{action.title}</h5>}
   <p className="jama-action-habit">{action.habit}</p>{showProducts&&<><p className="jama-action-connection">{action.connection}</p><div className="jama-action-products">{action.productIds.map(id=>{const product=productById.get(id);return product?<button type="button" key={id} data-jama-product={id} disabled={!onProducts} onClick={()=>onProducts?.([id])}><MapPin size={18}/>{product.name}</button>:null;})}</div></>}
  </article>)}</div></section>
  <details className="jama-sources"><summary>閱讀研究與試驗登錄來源</summary><p>{study.citation}</p><ul>{study.sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<ArrowUpRight size={17}/></a></li>)}</ul><p>DOI：{study.doi}</p></details>
 </section>;
}
