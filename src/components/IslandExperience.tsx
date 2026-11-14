'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Sun, Sunrise, Sunset, Moon, ArrowUpRight, Leaf, Type, ChevronLeft, ChevronRight, Map, ListFilter } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { clusters, phases, productById, products, symptomChoices } from '@/data/uvaco-products';
import type { Phase } from '@/types/product';
import type { ConciergeAnswer } from '@/lib/concierge';
import Concierge from './Concierge';
import ProductSlideDeck from './ProductSlideDeck';
import { pillars, pillarById } from '@/data/lecture-poster';

const ArchipelagoCanvas = dynamic(() => import('./ArchipelagoCanvas'), { ssr: false, loading: () => <div className="map-loading" role="status">正在展開健康群島…</div> });
export default function IslandExperience() {
  const [active, setActive] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('day');
  const [route, setRoute] = useState<string[]>([]);
  const [concierge, setConcierge] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [scale, setScale] = useState(100);
  const [symptom, setSymptom] = useState('');
  useEffect(() => { try { const stored = Number(localStorage.getItem('uvaco-font-scale')); if ([100, 125, 140].includes(stored)) setScale(stored); } catch { /* Storage can be disabled. */ } }, []);
  useEffect(() => { document.documentElement.style.fontSize = `${scale}%`; document.documentElement.dataset.fontScale = String(scale); try { localStorage.setItem('uvaco-font-scale', String(scale)); } catch { /* Font scaling still works without storage. */ } return () => { document.documentElement.style.fontSize = ''; delete document.documentElement.dataset.fontScale; }; }, [scale]);
  useEffect(() => { const media = matchMedia('(prefers-reduced-motion: reduce)'); const update = () => setReduced(media.matches); update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update); }, []);
  const product = active ? productById.get(active) : null;
  const stops = route.length ? route : products.map(p => p.id);
  function navigate(answer: ConciergeAnswer) { setRoute(answer.targetProductIds); setSymptom(''); setPhase(answer.circadianPhase); if (answer.targetProductIds[0]) setActive(answer.targetProductIds[0]); }
  function overview() { setActive(null); setRoute([]); setSymptom(''); }
  function move(step: number) { const current = active ? stops.indexOf(active) : -1; const index = current < 0 ? (step > 0 ? 0 : stops.length - 1) : (current + step + stops.length) % stops.length; setActive(stops[index]); }
  function chooseSymptom(s: string) { if (symptom === s) { overview(); return; } const ids = products.filter(p => p.symptomsMatched.includes(s)).map(p => p.id); setSymptom(s); setRoute(ids); setActive(ids[0] ?? null); }
  return <div className="experience">
    <a href="#product-select" className="skip-link">跳到產品選單</a>
    <header className="site-header"><a href="/" className="brand" aria-label="葡眾健康群島首頁"><span className="brand-mark"><Leaf size={29} strokeWidth={1.5} /></span><span><b>葡眾</b><small>健康群島</small></span></a><p className="header-note">給每一天，多一點好好照顧</p><div className="header-actions"><button className="font-button" onClick={() => setScale(scale === 100 ? 125 : scale === 125 ? 140 : 100)} aria-label={`字體大小：${scale}%，點選切換`}><Type size={22} /><span>{scale === 100 ? '標準字體' : scale === 125 ? '長輩大字' : '超大字體'}<small>{scale}%</small></span></button><label className="product-select-label" htmlFor="product-select"><span className="sr-only">選擇產品</span><select id="product-select" value={active ?? ''} onChange={e => { setActive(e.target.value || null); setRoute([]); setSymptom(''); }}><option value="">所有產品</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label></div></header>
    <section className="symptom-bar" aria-label="聽懂身體的聲音"><div className="symptom-heading"><ListFilter size={21} /><span>聽懂身體的聲音</span></div><div className="symptom-chips">{symptomChoices.map(s => <button key={s} aria-pressed={symptom === s} onClick={() => chooseSymptom(s)}>{s}</button>)}</div></section>
    <div className="circadian-bar"><span className="circadian-title">跟著一天的節奏</span><div className="phase-options" role="group" aria-label="切換島嶼照明">{phases.map((p, i) => { const Icon = [Sunrise, Sun, Sunset, Moon][i]; return <button key={p.id} aria-pressed={phase === p.id} onClick={() => setPhase(p.id)}><Icon size={21} /><span>{p.name}</span></button>; })}</div><span className="phase-note">情境照明 · 非服用時刻</span></div>
    <main className={`island-main ${product ? 'with-deck' : ''}`}><section className="map-region" aria-label="健康群島互動導覽">
      <ArchipelagoCanvas active={active} route={route} phase={phase} onSelect={setActive} reduced={reduced} />
      {!active ? <div className="map-welcome"><h1>找回身體的<br />自癒力</h1><p>醫療改善症狀，<br />營養打造健康。</p><button onClick={() => setActive('995')}>開始講座重點巡禮 <ArrowUpRight size={22} /></button></div> : <div className="map-selection"><h1>{product?.name}</h1><p>{route.length ? `您的閱讀路線 · ${route.length} 座島嶼` : pillarById.get(product!.lecturePillar!)!.name}</p></div>}
      <div className="map-key">{pillars.map(c => <span key={c.id}><i style={{ background: c.color }} />{c.name}</span>)}</div>
      {!active && <div className="map-caption">點選島嶼，開始認識</div>}
    </section><AnimatePresence initial={false}>{product && <motion.div key={product.id} className="deck-wrapper" initial={{ opacity: 0, x: reduced ? 0 : 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduced ? 0 : .3 }}><ProductSlideDeck product={product} onSelect={setActive} onClose={overview} /></motion.div>}</AnimatePresence></main>
    <footer className="senior-dock"><p className="tour-status" aria-live="polite">{active ? `${Math.max(stops.indexOf(active), 0) + 1} / ${stops.length} 站` : '慢慢走，每一站都為您停留'}</p><nav aria-label="主要產品導覽"><button onClick={() => move(-1)}><ChevronLeft size={24} /><span>上一站</span></button><button className="primary" onClick={() => move(1)}><span>下一站導覽</span><ChevronRight size={24} /></button><button onClick={overview}><Map size={23} /><span>全島總覽</span></button></nav><a className="text-view-link" href="/products">產品文字版 ↗</a></footer>
    <button className="concierge-launch" onClick={() => setConcierge(true)}>💬 問問健康小幫手</button>
    {concierge && <Concierge onClose={() => setConcierge(false)} onNavigate={navigate} />}
  </div>;
}
