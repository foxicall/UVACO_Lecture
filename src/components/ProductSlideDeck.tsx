'use client';
import { useState } from 'react';
import { X, ArrowUpRight, Leaf, BookOpen, Network } from 'lucide-react';
import type { Product } from '@/types/product';
import { productById } from '@/data/uvaco-products';
import sources from '@/data/source-materials.json';
import VisualCarousel from './VisualCarousel';
import {productVisuals} from '@/data/visual-assets-manifest';
import VoiceGuide from './VoiceGuide';
import ScienceDetails from './ScienceDetails';
import { productStoryBridge } from '@/data/four-pillars-story';
import { everydayProducts } from '@/data/everyday-language';
import { pillarById } from '@/data/lecture-poster';

export default function ProductSlideDeck({ product: p, onSelect, onClose }: { product: Product; onSelect: (id: string) => void; onClose: () => void }) {
  const [tab, setTab] = useState(0);
  const source = sources.products.find(s => s.id === p.id)!;
  const sections = ['身體的需要', '原料小故事', '一起認識'];
  const story = everydayProducts[p.id];
  const bridge = productStoryBridge[p.id];
  const ingredients = Object.entries(source.fields).filter(([k]) => /成分|組成|規格/.test(k));
  const science = <ScienceDetails><h3>原料標示與研究資料</h3>{ingredients.map(([key,value])=><section key={key}><h4>{key}</h4><p>{value.replace(/\*\*/g,'')}</p></section>)}<h3>從三個角度閱讀</h3>{Object.values(p.mechanisms).map((text,i)=><p key={i}>{text}</p>)}<h3>食用前看清楚</h3><p>{p.caution}</p><details className="source-detail"><summary>展開來源全文</summary><div className="source-text">{source.text.replace(/\*\*/g, '')}</div></details></ScienceDetails>;
  return <aside className="product-deck" aria-label={`${p.name}產品說明`}>
    <div className="deck-top"><span>{pillarById.get(p.lecturePillar!)!.name}</span><button className="icon-button" aria-label="關閉產品說明" onClick={onClose}><X /></button></div>
    <div className="product-intro visual-product-intro"><div><h2>{p.name}</h2><p>{bridge.connection}</p></div></div>
    <VisualCarousel key={p.id} items={productVisuals[p.id]} label={`${p.name}原頁圖解`} caption={false} narration={false}/>
    <div className="deck-tabs" role="tablist" aria-label="產品資訊分類">{sections.map((name, i) => {
      const Icon = [Leaf, BookOpen, Network][i];
      return <button key={name} role="tab" id={`tab-${i}`} aria-controls={`panel-${i}`} aria-selected={tab === i} tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)} onKeyDown={e => { const next = e.key === 'ArrowRight' ? (i + 1) % 3 : e.key === 'ArrowLeft' ? (i + 2) % 3 : e.key === 'Home' ? 0 : e.key === 'End' ? 2 : -1; if (next >= 0) { e.preventDefault(); setTab(next); document.getElementById(`tab-${next}`)?.focus(); } }}><Icon size={18} />{name}</button>;
    })}</div>
    <div className="tab-panel" role="tabpanel" tabIndex={0} id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
      {tab === 0 && <><h3>為什麼身體需要它？</h3><ul className="product-brief"><li>{bridge.bodyNeed}</li><li>{bridge.description}</li></ul><VoiceGuide text={`為什麼身體需要它？${bridge.bodyNeed}${bridge.connection}。${bridge.description}`} />{science}</>}
      {tab === 1 && <><h3>這份配方，放了什麼？</h3><ul>{story.ingredients.slice(0,3).map(item=><li key={item}>{item}</li>)}</ul><VoiceGuide text={`${p.name}。${story.ingredients.join('、')}。${story.axes.join('。')}`} />{science}</>}
      {tab === 2 && <><h3>讓知識連成一條路</h3><p>沿著島嶼連線，一站一站看配方，找出自己想了解的內容。</p><div className="synergy-list">{p.synergyLinks.slice(0,3).map(link => <button key={link.targetProductId} onClick={() => onSelect(link.targetProductId)}><span><strong>{productById.get(link.targetProductId)?.name}</strong><small>{everydayProducts[link.targetProductId].comparison}</small></span><ArrowUpRight size={24} /></button>)}</div><VoiceGuide text={p.synergyLinks.map(l => `${productById.get(l.targetProductId)?.name}。${everydayProducts[l.targetProductId].comparison}`).join('。')} /></>}
    </div>
  </aside>;
}
