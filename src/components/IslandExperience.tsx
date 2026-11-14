'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Leaf, ChevronLeft, ChevronRight, Map, ListFilter, Presentation, BookOpen, MessageCircle, Dna } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { productById, products, symptomChoices } from '@/data/uvaco-products';
import type { ConciergeAnswer } from '@/lib/concierge';
import Concierge from './Concierge';
import ProductSlideDeck from './ProductSlideDeck';
import PillarStoryModal from './PillarStoryModal';
import { pillars, pillarById, lecture, lectureOrder, type PillarId } from '@/data/lecture-poster';
import LectureModal from './LectureModal';
import EducationDeck from './EducationDeck';
import VoiceGuide from './VoiceGuide';
import { homepageNote } from '@/data/everyday-language';
import type { SlideTarget } from '@/data/health-triangle';

const ArchipelagoCanvas = dynamic(() => import('./ArchipelagoCanvas'), { ssr: false, loading: () => <div className="map-loading" role="status">正在展開健康群島…</div> });
const PptxKeynotePlayer = dynamic(() => import('./PptxKeynotePlayer'), { ssr: false });
const HealthTriangleHub = dynamic(() => import('./HealthTriangleHub'), { ssr: false });
const pillarLabels = ['人體修復能力', '神經修復', '慢性發炎', '自律神經'];
export default function IslandExperience() {
  const [active, setActive] = useState<string | null>(null);
  const [route, setRoute] = useState<string[]>([]);
  const [storyPillar, setStoryPillar] = useState<PillarId|null>(null);
  const [concierge, setConcierge] = useState(false);
  const reduced = useReducedMotion();
  const [scale, setScale] = useState(100);
  const [symptom, setSymptom] = useState('');
  const [pillar, setPillar] = useState<PillarId | null>(null);
  const [lectureOpen, setLectureOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);
  const [keynoteOpen, setKeynoteOpen] = useState(false);
  const [keynoteTarget, setKeynoteTarget] = useState<SlideTarget>();
  const [triangleOpen, setTriangleOpen] = useState(false);
  const [triangleProduct, setTriangleProduct] = useState<string>();
  function openTriangle(productId?: string) { setTriangleProduct(productId); setTriangleOpen(true); }
  useEffect(() => { try { const stored = Number(localStorage.getItem('uvaco-font-scale')); if ([100, 125, 140].includes(stored)) setScale(stored); } catch { /* Storage can be disabled. */ } }, []);
  useEffect(() => { document.documentElement.style.fontSize = `${scale}%`; document.documentElement.dataset.fontScale = String(scale); try { localStorage.setItem('uvaco-font-scale', String(scale)); } catch { /* Reading size still changes. */ } return () => { document.documentElement.style.fontSize = ''; delete document.documentElement.dataset.fontScale; }; }, [scale]);
  const product = active ? productById.get(active) : null;
  const stops = route.length ? route : lectureOrder;
  function navigate(answer: ConciergeAnswer) { setRoute(answer.targetProductIds); setSymptom(''); setPillar(null); if (answer.targetProductIds[0]) setActive(answer.targetProductIds[0]); }
  function overview() { const deckFocus = document.activeElement?.closest('.product-deck'); setActive(null); setRoute([]); setSymptom(''); setPillar(null); if (deckFocus) requestAnimationFrame(() => document.getElementById('product-select')?.focus()); }
  function selectProduct(id: string) { setActive(id); if (!route.includes(id)) { setRoute([]); setPillar(null); setSymptom(''); } }
  function openStory(id:PillarId) { setStoryPillar(id); setPillar(id); setActive(null); setRoute([]); setSymptom(''); }
  function move(step:number) { const current=pillar ?? (active?productById.get(active)?.lecturePillar:null); const index=pillars.findIndex(item=>item.id===current); openStory(pillars[index<0?(step>0?0:pillars.length-1):(index+step+pillars.length)%pillars.length].id); }
  function chooseSymptom(s: string) { if (symptom === s) { overview(); return; } const ids = products.filter(p => p.symptomsMatched.includes(s)).map(p => p.id); setSymptom(s); setPillar(null); setRoute(ids); setActive(ids[0] ?? null); }
  function choosePillar(id:PillarId) { openStory(id); }
  return <div className="experience">
    <a href="#product-select" className="skip-link">跳到產品選單</a>
    <h1 className="sr-only">找回身體的自癒力・葡眾健康群島</h1>
    <header className="ios-header glass">
      <button className="lecture-badge" onClick={() => setLectureOpen(true)} aria-label="講師林煒醫師與11/15講座資訊"><Leaf size={20} /><span className="badge-full">找回身體的自癒力<span className="badge-date">｜林煒醫師 11/15(日) 10:00</span></span><span className="badge-short">講座資訊</span></button>
      <nav className="pillar-segments" aria-label="四大講座主題">{pillars.map((p, i) => <button key={p.id} aria-pressed={pillar === p.id} onClick={e => { choosePillar(p.id); e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }}>{pillarLabels[i]}</button>)}</nav>
      <div className="header-tools"><button className="header-triangle" onClick={() => openTriangle()} aria-label="三個健康故事專區"><Dna size={20}/><span>三個健康故事</span></button><button className="header-ppt" onClick={() => setKeynoteOpen(true)} aria-label="完整原圖簡報播放"><Presentation size={20} /><span>講座簡報播放 <small>9 份原圖</small></span></button><button className="font-button" onClick={() => setScale(scale === 100 ? 125 : scale === 125 ? 140 : 100)} aria-label={`字體大小：${scale}%，點選切換`}><strong>A+</strong><span>字級</span><small>{scale}%</small></button></div>
    </header>
    <main className="island-main">
      <section className="map-region" aria-label="健康群島互動導覽"><ArchipelagoCanvas active={active} route={route} onSelect={selectProduct} onHub={() => openTriangle()} reading={concierge || lectureOpen || educationOpen || keynoteOpen || triangleOpen || storyPillar!==null} /><div className="map-caption"><span>葡眾健康群島</span></div><p className="tour-status" aria-live="polite">{active ? `${Math.max(stops.indexOf(active), 0) + 1} / ${stops.length} 站` : '先聽故事，再慢慢認識原料'}</p></section>
      <div className="reading-panel glass">
        {product ? <motion.div className="deck-wrapper" key={product.id} initial={{ opacity: 0, x: reduced ? 0 : 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduced ? 0 : .22 }}><ProductSlideDeck product={product} onSelect={selectProduct} onClose={overview} /></motion.div> : <section className="welcome-panel"><div className="welcome-mark"><Leaf size={25} /><span>免費健康講座</span></div><h2>找回身體的<br />自癒力</h2><p className="welcome-subtitle">醫療改善症狀，<br />營養打造健康。</p><button className="event-summary" onClick={() => setLectureOpen(true)}><span><strong>11/15（日）10:00</strong><small>林煒醫師・延吉街235巷1號</small></span><ArrowUpRight size={21} /></button><button className="primary start-tour" onClick={() => openStory('repair')}>先聽身體的故事 <ArrowUpRight size={21} /></button><button className="welcome-keynote" onClick={() => setKeynoteOpen(true)}><Presentation size={24} /><span><strong>把講座，慢慢聽懂</strong><small>9 份原始簡報・297 頁圖像故事</small></span><ChevronRight size={20} /></button></section>}
        <div className="reading-tools"><button className="triangle-entry" onClick={() => openTriangle(active ?? undefined)}><Dna size={23}/><span><strong>健康金三角</strong><small>聽懂身體・認識配方</small></span><ChevronRight size={20}/></button><label htmlFor="product-select">直接選擇產品</label><select id="product-select" value={active ?? ''} onChange={e => { if (e.target.value) selectProduct(e.target.value); else overview(); }}><option value="">所有產品</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select><details className="symptom-search"><summary><ListFilter size={18} />聽懂身體的聲音</summary><div className="symptom-chips">{symptomChoices.map(s => <button key={s} aria-pressed={symptom === s} onClick={() => chooseSymptom(s)}>{s}</button>)}</div></details><button className="knowledge-button" onClick={() => setEducationOpen(true)}><BookOpen size={19} />健康知識館 <ArrowUpRight size={18} /></button></div>
      </div>
    </main>
    <nav className="senior-dock glass" aria-label="主要產品導覽"><button onClick={() => move(-1)} aria-label="上一站"><ChevronLeft size={22} /><span>上一站</span></button><button className="primary" onClick={() => move(1)} aria-label="下一站，講座重點巡禮"><ChevronRight size={22} /><span>下一站</span></button><button onClick={overview} aria-label="全島總覽"><Map size={22} /><span>全島總覽</span></button><VoiceGuide label="語音導讀" text={product ? `${product.name}。${product.elderlyHook}。${product.introduction}` : `${lecture.title}。${lecture.subtitle}。${lecture.date}，上午十點，主講人${lecture.speaker}。歡迎使用下一站，認識四大講座主題。`} /><button onClick={() => setKeynoteOpen(true)} aria-label="播放PPT"><Presentation size={22} /><span>原圖簡報</span></button></nav>
    <footer className="homepage-note">{homepageNote}</footer>
    <button className="concierge-launch" onClick={() => setConcierge(true)} aria-label="💬 問問健康小幫手"><MessageCircle size={24} /><span>問問健康小幫手</span></button>
    {storyPillar && <PillarStoryModal key={storyPillar} pillarId={storyPillar} onClose={()=>setStoryPillar(null)} onNextStory={openStory} onProduct={id=>{setActive(id);setRoute([id,...pillarById.get(storyPillar)!.products.filter(productId=>productId!==id)]);setStoryPillar(null);}}/>}
    {concierge && <Concierge onClose={() => setConcierge(false)} onNavigate={navigate} />}
    {lectureOpen && <LectureModal onClose={() => setLectureOpen(false)} />}
    {educationOpen && <EducationDeck onClose={() => setEducationOpen(false)} onNavigate={id => { selectProduct(id); setRoute([]); setPillar(null); setSymptom(''); }} />}
    {triangleOpen && <HealthTriangleHub initialProduct={triangleProduct} onClose={() => setTriangleOpen(false)} onProducts={ids => { setRoute(ids); setActive(ids[0] ?? null); setPillar(null); setSymptom(''); setTriangleOpen(false); }} onSlide={target => { setTriangleOpen(false); setKeynoteTarget(target); setKeynoteOpen(true); }} />}
    {keynoteOpen && <PptxKeynotePlayer onProducts={ids => { setKeynoteOpen(false); setKeynoteTarget(undefined); setRoute(ids); setActive(ids[0] ?? null); setPillar(null); setSymptom(''); }} initialSlide={keynoteTarget} onClose={() => { setKeynoteOpen(false); setKeynoteTarget(undefined); }} />}
  </div>;
}
