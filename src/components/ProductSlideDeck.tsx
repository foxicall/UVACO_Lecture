'use client';
import { useState } from 'react';
import { X, ArrowUpRight, Leaf, BookOpen, Network } from 'lucide-react';
import type { Product } from '@/types/product';
import { productById } from '@/data/uvaco-products';
import sources from '@/data/source-materials.json';
import visuals from '@/data/generated-visuals.json';
import VoiceGuide from './VoiceGuide';
import { pillarById } from '@/data/lecture-poster';

export default function ProductSlideDeck({ product: p, onSelect, onClose }: { product: Product; onSelect: (id: string) => void; onClose: () => void }) {
  const [tab, setTab] = useState(0);
  const source = sources.products.find(s => s.id === p.id)!;
  const art = visuals.visuals.find(v => v.id === p.id);
  const sections = ['給長輩的話', '科學與成分', '一起認識'];
  const ingredients = Object.entries(source.fields).filter(([k]) => /成分|組成|規格/.test(k));
  return <aside className="product-deck" aria-label={`${p.name}產品說明`}>
    <div className="deck-top"><span>{pillarById.get(p.lecturePillar!)!.name}</span><button className="icon-button" aria-label="關閉產品說明" onClick={onClose}><X /></button></div>
    <div className="product-intro"><div><h2>{p.name}</h2><p>{p.elderlyHook}</p></div>{art && <img alt={`${p.name}的植物與細胞意象插畫`} src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(art.svg)}`} width={180} height={180} />}</div>
    <div className="deck-tabs" role="tablist" aria-label="產品資訊分類">{sections.map((name, i) => {
      const Icon = [Leaf, BookOpen, Network][i];
      return <button key={name} role="tab" id={`tab-${i}`} aria-controls={`panel-${i}`} aria-selected={tab === i} tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)} onKeyDown={e => { const next = e.key === 'ArrowRight' ? (i + 1) % 3 : e.key === 'ArrowLeft' ? (i + 2) % 3 : e.key === 'Home' ? 0 : e.key === 'End' ? 2 : -1; if (next >= 0) { e.preventDefault(); setTab(next); document.getElementById(`tab-${next}`)?.focus(); } }}><Icon size={18} />{name}</button>;
    })}</div>
    <div className="tab-panel" role="tabpanel" tabIndex={0} id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
      {tab === 0 && <><p className="elder-copy">{p.introduction}</p><VoiceGuide text={`${p.name}。${p.elderlyHook}。${p.introduction}。${p.caution}`} /><div className="care-note"><h3>照顧自己，也多問一句</h3><p>{p.caution}</p></div></>}
      {tab === 1 && <><h3>從原料開始了解</h3>{ingredients.map(([key, value]) => <div key={key} className="source-ingredients"><h4>{key}</h4><p>{value.replace(/\*\*/g, '')}</p></div>)}<h3>健康金三角</h3>{Object.entries(p.mechanisms).map(([key, value], i) => <details key={key}><summary>{['發炎與抗氧化', '營養與細胞代謝', '神經與日常作息'][i]}</summary><p>{value}</p></details>)}<details className="source-detail"><summary>閱讀來源文件的完整機轉</summary><p className="small-copy">以下保留來源文件說法；成分或動物研究不能直接作為成品對人體的療效保證。</p><div className="source-text">{source.text.replace(/\*\*/g, '')}</div></details><p className="small-copy">來源：葡眾產品機轉文件；專利或 NDI 通知不等於主管機關核准疾病治療效果。</p><VoiceGuide text={`${p.name}。${p.mechanisms.antiInflammation}。${p.mechanisms.selfHealing}。${p.mechanisms.autonomicNerve}`} /></>}
      {tab === 2 && <><h3>讓知識連成一條路</h3><p>島嶼連線帶您比較相關產品；不表示需要一起吃，也不是聯合療效的保證。</p><div className="synergy-list">{p.synergyLinks.map(link => <button key={link.targetProductId} onClick={() => onSelect(link.targetProductId)}><span><strong>{productById.get(link.targetProductId)?.name}</strong><small>{link.reason}</small></span><ArrowUpRight size={24} /></button>)}</div><VoiceGuide text={p.synergyLinks.map(l => `${productById.get(l.targetProductId)?.name}。${l.reason}`).join('。')} /></>}
    </div>
  </aside>;
}
