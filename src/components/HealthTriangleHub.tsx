'use client';
import { useState } from 'react';
import { ArrowUpRight, BookOpen, ChevronRight, Dna, Sparkles } from 'lucide-react';
import Dialog from './Dialog';
import VoiceGuide from './VoiceGuide';
import ClinicalAnalyzer from './ClinicalAnalyzer';
import { triangleAxes, mechanismCards, productMechanisms, productComparisonNotes, type AxisId, type SlideTarget } from '@/data/health-triangle';
import { activeClinicalSources, clinicalSourceById } from '@/data/clinical-sources';
import { longevityDecks, type LongevityDeckId } from '@/data/longevity-decks-manifest';
import { products, productById } from '@/data/uvaco-products';
import synthesis from '@/data/gemini-3.8-insights.json';

function SourceLabels({ids}:{ids:string[]}) { return <p className="source-labels">來源主題：{ids.map(id=>clinicalSourceById.get(id)?.title).join('、')}</p>; }
function TriangleDiagram({axis,onChange}:{axis:AxisId;onChange:(axis:AxisId)=>void}) {
  return <div className="triangle-diagram" role="group" aria-label="健康金三角互動圖，選擇一個機轉">
    <svg viewBox="0 0 400 300" aria-hidden="true"><defs><marker id="triangle-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 6 3 0 6" fill="#AC7B30"/></marker></defs><path d="M168 62 Q90 108 90 190 M140 232 Q202 258 264 232 M310 190 Q312 112 232 62" fill="none" stroke="#AC7B30" strokeWidth="2.5" markerEnd="url(#triangle-arrow)"/><circle cx="200" cy="160" r="44" fill="#EDF0E9"/><text x="200" y="157" textAnchor="middle" fill="#34443B" fontSize="16">相互影響</text><text x="200" y="180" textAnchor="middle" fill="#34443B" fontSize="13">一起照顧</text></svg>
    {triangleAxes.map((item,i)=><button key={item.id} className={`triangle-node node-${i}`} aria-pressed={axis===item.id} onClick={()=>onChange(item.id)}>{item.title}</button>)}
  </div>;
}
export default function HealthTriangleHub({onClose,onProducts,onSlide,initialProduct}:{onClose:()=>void;onProducts:(ids:string[])=>void;onSlide:(target:SlideTarget)=>void;initialProduct?:string}) {
  const [view,setView]=useState(initialProduct?2:0);
  const [axis,setAxis]=useState<AxisId>('inflammation');
  const [matrixProduct,setMatrixProduct]=useState(initialProduct&&productById.has(initialProduct)?initialProduct:'995');
  const titles=['三大機轉','我的關注','產品對照','來源筆記'];
  const active=triangleAxes.find(item=>item.id===axis)!;
  const product=productById.get(matrixProduct)!;
  function switchView(index:number){setView(index);}
  return <Dialog title="健康金三角" onClose={onClose} className="triangle-dialog">
    <p className="triangle-byline">林煒醫師健康講座・找回身體的自癒力</p>
    <div className="triangle-nav" role="tablist" aria-label="健康金三角內容">{titles.map((title,i)=><button key={title} role="tab" id={`triangle-tab-${i}`} aria-controls="triangle-panel" aria-selected={view===i} tabIndex={view===i?0:-1} onClick={()=>switchView(i)} onKeyDown={event=>{const next=event.key==='ArrowRight'?(i+1)%titles.length:event.key==='ArrowLeft'?(i+titles.length-1)%titles.length:-1;if(next>=0){event.preventDefault();switchView(next);(event.currentTarget.parentElement?.children[next] as HTMLButtonElement)?.focus();}}}>{title}</button>)}</div>
    <div id="triangle-panel" role="tabpanel" aria-labelledby={`triangle-tab-${view}`} tabIndex={0}>
      {view===0&&<>
        <section className="triangle-intro"><div><h3>理解身體，<br/>從三個角度開始。</h3><p>發炎訊號、修復條件與神經調節互相影響。點選圖中的主題，從白話比喻慢慢讀懂。</p><p className="small-copy">依六份參考講座、產品文件與既有簡報整理；不是林醫師的個別診療或產品處方。</p></div><TriangleDiagram axis={axis} onChange={setAxis}/></section>
        <section className="axis-intro" aria-live="polite"><div><Dna size={24}/><h3>{active.title}</h3></div><h4>{active.metaphor}</h4><p>{active.intro}</p><ul>{active.everyday.map(item=><li key={item}>{item}</li>)}</ul></section>
        <div className="mechanism-list">{mechanismCards.filter(card=>card.axis===axis).map(card=><details key={card.id} className="mechanism-card"><summary><span><strong>{card.title}</strong><span>{card.simple}</span></span><ChevronRight size={20}/></summary><div className="mechanism-body"><h4>再多了解一點</h4><p>{card.science}</p><p className="mechanism-boundary">{card.boundary}</p><SourceLabels ids={card.sourceIds}/><div className="mechanism-actions">{card.productIds.length>0&&<button onClick={()=>onProducts(card.productIds)}>比較相關產品 <ArrowUpRight size={20}/></button>}<button onClick={()=>onSlide(card.slide)}>開啟對應簡報 <BookOpen size={19}/></button></div><VoiceGuide text={`${card.title}。${card.simple}。${card.science}。${card.boundary}`}/></div></details>)}</div>
        <button className="primary triangle-analysis-link" onClick={()=>setView(1)}><Sparkles size={22}/>從我的關注開始</button>
        <details className="synthesis-note"><summary>查看整合摘要與生成狀態</summary><p>{synthesis.insights.overview}</p><p className="small-copy">{synthesis.engine.detail}</p></details>
      </>}
      {view===1&&<ClinicalAnalyzer onProducts={onProducts} onSlide={onSlide}/>}
      {view===2&&<section className="triangle-matrix"><h3>十二款產品，逐一比較</h3><p>先看原料、研究層級與重複配方，再討論是否適合自己。</p><label htmlFor="matrix-product">選擇產品</label><select id="matrix-product" value={matrixProduct} onChange={event=>setMatrixProduct(event.target.value)}>{products.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select><div className="matrix-heading"><h4>{product.name}</h4><button onClick={()=>onProducts([product.id])}>前往產品島 <ArrowUpRight size={20}/></button></div><p>{productComparisonNotes[product.id]}</p><details><summary>產品文件列出的成分</summary>{product.ingredients.map((ingredient,i)=><p key={i}>{ingredient.replace(/\*\*/g,'')}</p>)}</details><div className="matrix-axes">{Object.entries(product.mechanisms).map(([key,text],i)=><article key={key}><h4>{triangleAxes[i].title}</h4><p>{text}</p></article>)}</div><div className="care-note"><h4>食用前，先確認</h4><p>{product.caution}</p></div><h4>延伸閱讀的機轉</h4><div className="matrix-mechanisms">{productMechanisms[product.id].map(id=>{const card=mechanismCards.find(c=>c.id===id)!;return <button key={id} onClick={()=>{setAxis(card.axis);setView(0);}}>{card.title}<ChevronRight size={18}/></button>;})}</div><SourceLabels ids={['P1',...new Set(productMechanisms[product.id].flatMap(id=>mechanismCards.find(c=>c.id===id)!.sourceIds))]}/><VoiceGuide text={`${product.name}。${productComparisonNotes[product.id]}。${Object.values(product.mechanisms).join('。')}。${product.caution}`}/></section>}
      {view===3&&<section className="triangle-sources"><h3>把來源與證據一起讀</h3><p>五份 PDF 共 233 頁與六份文稿交叉整理，保留機轉、研究限制與產品差異。第 2 套環境暴露資料目前僅有文稿。原料研究、動物實驗、其他配方試驗與成品人體試驗，是不同層級的證據。</p><nav className="source-deck-links" aria-label="六大長壽圖解">{longevityDecks.map(deck=><button key={deck.id} onClick={()=>onSlide({deckId:deck.id as LongevityDeckId,slideId:deck.slides[0].id})}><span>{deck.shortTitle}<small>{deck.slides.length} 頁圖解</small></span><BookOpen size={20}/></button>)}</nav><div className="source-notebooks">{activeClinicalSources.map(source=><details key={source.id}><summary>{source.title}</summary><p>{source.summary}</p><ul>{source.topics.map(topic=><li key={topic}>{topic}</li>)}</ul><p className="mechanism-boundary">{source.limit}</p>{source.productIds.length>0&&<button onClick={()=>{setMatrixProduct(source.productIds[0]);setView(2);}}>對照產品原料 <ArrowUpRight size={20}/></button>}</details>)}</div><p className="small-copy">以來源主題呈現，不將參考講者原話改署為林煒醫師；原始文件與版本完整保留。</p></section>}
    </div>
  </Dialog>;
}
