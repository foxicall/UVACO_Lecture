'use client';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Pause, Play, Presentation, Square, Volume2, X, Info } from 'lucide-react';
import Dialog from './Dialog';
import { pptxDecks, slideNarration } from '@/data/pptx-decks';
import { sitePath } from '@/lib/site';
import { productById } from '@/data/uvaco-products';
import { ZoomIn, ZoomOut, RotateCcw, ArrowUpRight } from 'lucide-react';
import VoiceGuide from './VoiceGuide';
import type { SlideTarget } from '@/data/health-triangle';

export default function PptxKeynotePlayer({ onClose, initialSlide, onProducts }: { onClose: () => void; initialSlide?: SlideTarget; onProducts: (ids: string[]) => void }) {
  const [deckIndex, setDeckIndex] = useState(() => Math.max(0, pptxDecks.findIndex(deck => deck.id === initialSlide?.deckId)));
  const [index, setIndex] = useState(() => Math.max(0, pptxDecks.find(deck => deck.id === initialSlide?.deckId)?.slides.findIndex(slide => slide.id === initialSlide?.slideId) ?? 0));
  const [auto, setAuto] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [notice, setNotice] = useState('');
  const [lightbox,setLightbox]=useState(false);
  const [zoom,setZoom]=useState(100);
  const [failedImages,setFailedImages]=useState<string[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const slideCanvas = useRef<HTMLElement>(null);
  const workspace = useRef<HTMLDivElement>(null);
  const visual = useRef<HTMLElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const deck = pptxDecks[deckIndex];
  const slide = deck.slides[index];
  const failed=failedImages.includes(slide.id);
  const sourceLabel=slide.sourcePages.length?`對照 PDF 第 ${slide.sourcePages.join('、')} 頁與文稿`:'依既有文稿重製・此套 PDF 尚未提供';

  useEffect(() => {
    setSupported('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
    const changed = () => setFullscreen(document.fullscreenElement === root.current);
    const interrupted = (event: Event) => { if ((event as CustomEvent).detail?.owner !== 'keynote') { setAuto(false); setPaused(false); } };
    document.addEventListener('fullscreenchange', changed);
    window.addEventListener('uvaco-speech-reset', interrupted);
    return () => { document.removeEventListener('fullscreenchange', changed); window.removeEventListener('uvaco-speech-reset', interrupted); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, []);
  function resetReadingScroll() { for (const ref of [slideCanvas, workspace, visual]) ref.current?.scrollTo({ top: 0, behavior: 'instant' }); }
  useEffect(() => { resetReadingScroll(); }, [deckIndex, index]);
  useEffect(() => {
    if (!auto || !supported) return;
    const synth = window.speechSynthesis;
    synth.cancel(); setPaused(false); setNotice('');
    let current = true;
    const speech = new SpeechSynthesisUtterance(slideNarration(slide));
    speech.lang = 'zh-TW'; speech.rate = .92;
    const voice = synth.getVoices().find(v => v.lang === 'zh-TW'); if (voice) speech.voice = voice;
    speech.onend = () => {
      if (!current) return;
      if (index < deck.slides.length - 1) setIndex(i => i + 1);
      else { setAuto(false); setNotice('這套簡報已朗讀完畢。'); }
    };
    speech.onerror = event => { if (current && !['canceled', 'interrupted'].includes(event.error)) { setAuto(false); setNotice('這台裝置暫時無法播放語音，您仍可閱讀完整講稿。'); } };
    synth.speak(speech);
    return () => { current = false; synth.cancel(); };
  }, [auto, supported, slide, index, deck.slides.length]);
  function move(next: number) { resetReadingScroll(); setIndex(Math.max(0, Math.min(deck.slides.length - 1, next))); setNotice(''); }
  function switchDeck(next: number) { resetReadingScroll(); setAuto(false); setPaused(false); setDeckIndex(next); setIndex(0); setNotice(''); }
  function toggleNarration() {
    if (!supported) return;
    if (!auto) { window.dispatchEvent(new CustomEvent('uvaco-speech-reset', { detail: { owner: 'keynote' } })); setAuto(true); }
    else if (paused) { window.speechSynthesis.resume(); setPaused(false); }
    else { window.speechSynthesis.pause(); setPaused(true); }
  }
  async function toggleFullscreen() {
    if (fullscreen) { try { await document.exitFullscreen(); } catch { setNotice('請使用 Escape 離開全螢幕。'); } return; }
    if (expanded) { setExpanded(false); return; }
    try {
      if (!document.fullscreenEnabled || !root.current?.requestFullscreen) { setExpanded(true); return; }
      await root.current.requestFullscreen();
    } catch { setExpanded(true); setNotice('已開啟放大檢視；此瀏覽器不支援原生全螢幕。'); }
  }
  function keyboard(event: KeyboardEvent) {
    if (event.altKey || event.ctrlKey || event.metaKey || (event.target as HTMLElement).matches('input,textarea,select')) return;
    if ((event.target as HTMLElement).closest('.keynote-deck-tabs')) return;
    const next = event.key === 'ArrowRight' ? index + 1 : event.key === 'ArrowLeft' ? index - 1 : event.key === 'Home' ? 0 : event.key === 'End' ? deck.slides.length - 1 : null;
    if (next !== null) { event.preventDefault(); move(next); }
  }
  return <Dialog title="六大長壽簡報播放" onClose={onClose} hideHeading className={`keynote-dialog longevity-dialog ${expanded ? 'expanded' : ''}`}>
    <div className="keynote-player" ref={root} onKeyDown={keyboard}>
      <header className="keynote-toolbar"><div className="keynote-heading"><Presentation size={22}/><h2>長壽醫學圖解</h2></div><div className="keynote-toolbar-actions"><details className="keynote-info"><summary aria-label="簡報來源說明"><Info size={20}/></summary><div><strong>六套主題・22 頁重製圖解</strong><p>{deck.description}</p><p>{deck.sourceStatus}。{deck.originalPageCount>0&&`本套原始資料共 ${deck.originalPageCount} 頁。`}</p><p>五份 PDF 與六份文稿交叉整理，第 2 套 PDF 尚未提供。公開圖解沒有講者署名，不是原始投影片，也不將參考作者的原話改署為活動講師。</p></div></details><button onClick={toggleFullscreen} aria-label={fullscreen || expanded ? '離開全螢幕' : '全螢幕播放'}>{fullscreen || expanded ? <Minimize2 size={20}/> : <Maximize2 size={20}/>}</button><button onClick={onClose} aria-label="關閉簡報播放器"><X size={22}/></button></div></header>
      <p className="keynote-byline">林煒醫師健康講座・找回身體的自癒力</p>
      <div className="keynote-deck-tabs" role="tablist" aria-label="選擇簡報">{pptxDecks.map((item,i)=><button key={item.id} id={`deck-tab-${item.id}`} aria-controls="keynote-panel" role="tab" aria-selected={deckIndex===i} tabIndex={deckIndex===i?0:-1} onClick={()=>switchDeck(i)} onKeyDown={event=>{const next=event.key==='ArrowRight'?(i+1)%pptxDecks.length:event.key==='ArrowLeft'?(i+pptxDecks.length-1)%pptxDecks.length:-1;if(next>=0){event.preventDefault();switchDeck(next);(event.currentTarget.parentElement?.children[next] as HTMLButtonElement)?.focus();}}}><span>{item.shortTitle}</span><small>{item.slides.length} 頁</small></button>)}</div>
      <div ref={workspace} className="longevity-workspace" id="keynote-panel" role="tabpanel" aria-labelledby={`deck-tab-${deck.id}`}>
        <section ref={visual} className="longevity-visual" aria-label="本頁圖解與縮圖">
          <button className="slide-visual-button" onClick={()=>{setZoom(100);setLightbox(true);}} aria-label={`放大圖解：${slide.title}`}>
            {failed?<div className="diagram-fallback"><strong>{slide.title}</strong>{slide.diagram.nodes.map(node=><p key={node.label}>{node.label}：{node.detail}</p>)}</div>:<img src={sitePath(slide.image)} width={1600} height={1000} alt={slide.title+'，依資料重製的機轉圖解'} onError={()=>setFailedImages(ids=>[...ids,slide.id])}/>}
            <span><ZoomIn size={21}/>點擊放大圖解</span>
          </button>
          <p className="slide-provenance">{sourceLabel}<span>依資料重製，非原始投影片</span></p>
          <nav className="keynote-thumbnails" aria-label="投影片縮圖">{deck.slides.map((item,i)=><button key={item.id} onClick={()=>move(i)} aria-current={i===index?'page':undefined} aria-label={`第 ${i+1} 頁：${item.title}`}><span className="thumbnail-preview"><img alt="" src={sitePath(item.image)} width={160} height={100} loading="lazy"/></span><span className="thumbnail-caption">{i+1}<span>{item.title}</span></span></button>)}</nav>
        </section>
        <article ref={slideCanvas} className="longevity-summary" tabIndex={0} aria-label={`第 ${index+1} 頁，共 ${deck.slides.length} 頁：${slide.title}`} onTouchStart={event=>{touch.current={x:event.touches[0].clientX,y:event.touches[0].clientY};}} onTouchEnd={event=>{const start=touch.current;touch.current=null;if(!start)return;const x=event.changedTouches[0].clientX-start.x,y=event.changedTouches[0].clientY-start.y;if(Math.abs(x)>65&&Math.abs(y)<35)move(index+(x<0?1:-1));}}>
          <p className="slide-series">{deck.title}・{index+1} / {deck.slides.length}</p><h3>{slide.title}</h3><p className="slide-summary-lead">{slide.summary}</p>
          <VoiceGuide text={slideNarration(slide)} label="國語語音朗讀"/>
          <div className="longevity-copy">{slide.blocks.map(block=><section key={block.heading}><h4>{block.heading}</h4><p>{block.text}</p></section>)}</div>
          <section className="slide-evidence"><h4>研究要放回脈絡</h4><p>{slide.note}</p></section>
          <section className="slide-products"><h4>相關產品，先比較原料</h4><p>{slide.productNote}</p><div>{slide.productIds.map(id=><button key={id} onClick={()=>onProducts([id])}>{productById.get(id)?.name}<ArrowUpRight size={18}/></button>)}</div><button className="slide-route-button" onClick={()=>onProducts(slide.productIds)}>在群島比較本頁產品<ArrowUpRight size={20}/></button></section>
          <p className="source-labels">{sourceLabel}。產品連結為閱讀對照，不是個別營養處方。</p>
        </article>
      </div>
      <footer className="keynote-controls"><div className="slide-paging"><button onClick={()=>move(index-1)} disabled={index===0} aria-label="上一頁"><ChevronLeft size={22}/></button><span role="status" aria-live="polite" className="slide-counter">{index+1} / {deck.slides.length}</span><button onClick={()=>move(index+1)} disabled={index===deck.slides.length-1} aria-label="下一頁"><ChevronRight size={22}/></button></div><div className="narration-controls"><button onClick={toggleNarration} disabled={!supported} className={auto?'narrating':''}>{!auto?<Volume2 size={21}/>:paused?<Play size={21}/>:<Pause size={21}/>}<span>{!supported?'不支援語音':!auto?'自動朗讀':paused?'繼續朗讀':'暫停朗讀'}</span></button>{auto&&<button aria-label="停止朗讀" onClick={()=>{setAuto(false);setPaused(false);}}><Square size={18}/></button>}</div><p className="keynote-notice" role="status">{notice||(auto?'本頁讀完後，自動前往下一頁':'← → 切頁・可捲動閱讀全文')}</p></footer>
      {lightbox&&<Dialog title="放大圖解" onClose={()=>setLightbox(false)} className="diagram-lightbox"><div onKeyDown={event=>event.stopPropagation()}><div className="diagram-zoom-controls"><button onClick={()=>setZoom(z=>Math.max(100,z-50))} disabled={zoom===100} aria-label="縮小圖解"><ZoomOut size={23}/></button><span role="status">{zoom}%</span><button onClick={()=>setZoom(z=>Math.min(300,z+50))} disabled={zoom===300} aria-label="放大圖解比例"><ZoomIn size={23}/></button><button onClick={()=>setZoom(100)}><RotateCcw size={20}/>適合畫面</button></div><div className="diagram-pan" tabIndex={0} role="region" aria-label="放大圖解，可捲動查看">{failed?<div className="diagram-fallback"><h3>{slide.title}</h3>{slide.diagram.nodes.map(node=><p key={node.label}>{node.label}：{node.detail}</p>)}</div>:<img src={sitePath(slide.image)} alt={slide.title+'，重製圖解'} width={1600} height={1000} style={{width:`${zoom}%`,maxWidth:'none'}}/>}</div><p className="source-labels">{sourceLabel}・依資料重製，非原始投影片</p></div></Dialog>}
    </div>
  </Dialog>;
}
