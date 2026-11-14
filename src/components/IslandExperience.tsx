'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Sun, Sunrise, Sunset, Moon, ArrowUpRight, Leaf } from 'lucide-react';
import { clusters, phases, productById, products } from '@/data/uvaco-products';
import type { Phase } from '@/types/product';
import type { ConciergeAnswer } from '@/lib/concierge';
import Concierge from './Concierge';

const ArchipelagoCanvas = dynamic(() => import('./ArchipelagoCanvas'), { ssr: false, loading: () => <div className="map-loading" role="status">正在展開健康群島…</div> });
export default function IslandExperience() {
  const [active, setActive] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('day');
  const [route, setRoute] = useState<string[]>([]);
  const [concierge, setConcierge] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => { const media = matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(media.matches); update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update); }, []);
  const product = active ? productById.get(active) : null;
  function navigate(answer: ConciergeAnswer) { setRoute(answer.targetProductIds); setPhase(answer.circadianPhase); if (answer.targetProductIds[0]) setActive(answer.targetProductIds[0]); }
  return <div className="experience">
    <a href="#product-select" className="skip-link">跳到產品選單</a>
    <header className="site-header"><a href="/" className="brand" aria-label="葡眾健康群島首頁"><span className="brand-mark"><Leaf size={29} strokeWidth={1.5} /></span><span><b>葡眾</b><small>健康群島</small></span></a><p className="header-note">給每一天，多一點好好照顧</p><label className="product-select-label" htmlFor="product-select">選擇產品<select id="product-select" value={active ?? ''} onChange={e => { setActive(e.target.value || null); setRoute([]); }}><option value="">全島總覽</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label></header>
    <div className="circadian-bar"><span className="circadian-title">跟著一天的節奏</span><div className="phase-options" role="group" aria-label="切換島嶼照明">{phases.map((p, i) => { const Icon = [Sunrise, Sun, Sunset, Moon][i]; return <button key={p.id} aria-pressed={phase === p.id} onClick={() => setPhase(p.id)}><Icon size={21} /><span>{p.name}</span></button>; })}</div><span className="phase-note">情境照明 · 非服用時刻</span></div>
    <main className="island-main"><section className="map-region" aria-label="健康群島互動導覽">
      <ArchipelagoCanvas active={active} route={route} phase={phase} onSelect={setActive} reduced={reduced} />
      {!active ? <div className="map-welcome"><h1>把健康，<br />慢慢看懂。</h1><p>十二座小島，陪您認識<br />日常營養與身體的故事。</p><button onClick={() => setActive('995')}>開始我的島嶼之旅 <ArrowUpRight size={22} /></button></div> : <div className="map-selection"><h1>{product?.name}</h1><p>{product?.elderlyHook}</p><button onClick={() => { setActive(null); setRoute([]); }}>回到全島總覽</button></div>}
      <div className="map-key">{Object.values(clusters).map(c => <span key={c.name}><i style={{ background: c.color }} />{c.short}</span>)}</div>
      <div className="map-caption">點選島嶼，開始認識</div>
    </section></main>
    <button className="concierge-launch" onClick={() => setConcierge(true)}>💬 問問健康小幫手</button>
    {concierge && <Concierge onClose={() => setConcierge(false)} onNavigate={navigate} />}
  </div>;
}
