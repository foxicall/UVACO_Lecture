'use client';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Pause, Play, Presentation, Square, Volume2, X, Info } from 'lucide-react';
import Dialog from './Dialog';
import { pptxDecks, slideNarration } from '@/data/pptx-decks';
import visuals from '@/data/generated-visuals.json';
import type { SlideTarget } from '@/data/health-triangle';

export default function PptxKeynotePlayer({ onClose, initialSlide }: { onClose: () => void; initialSlide?: SlideTarget }) {
  const [deckIndex, setDeckIndex] = useState(() => Math.max(0, pptxDecks.findIndex(deck => deck.id === initialSlide?.deckId)));
  const [index, setIndex] = useState(() => Math.max(0, pptxDecks.find(deck => deck.id === initialSlide?.deckId)?.slides.findIndex(slide => slide.id === initialSlide?.slideId) ?? 0));
  const [auto, setAuto] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [notice, setNotice] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const slideCanvas = useRef<HTMLElement>(null);
  const thumb = useRef<HTMLButtonElement | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const deck = pptxDecks[deckIndex];
  const slide = deck.slides[index];
  const art = visuals.visuals.find(v => v.id === slide.illustration)!;

  useEffect(() => {
    setSupported('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
    const changed = () => setFullscreen(document.fullscreenElement === root.current);
    const interrupted = (event: Event) => { if ((event as CustomEvent).detail?.owner !== 'keynote') { setAuto(false); setPaused(false); } };
    document.addEventListener('fullscreenchange', changed);
    window.addEventListener('uvaco-speech-reset', interrupted);
    return () => { document.removeEventListener('fullscreenchange', changed); window.removeEventListener('uvaco-speech-reset', interrupted); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, []);
  useEffect(() => { thumb.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' }); slideCanvas.current?.scrollTo({ top: 0, behavior: 'instant' }); }, [deckIndex, index]);
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
  function move(next: number) { setIndex(Math.max(0, Math.min(deck.slides.length - 1, next))); setNotice(''); }
  function switchDeck(next: number) { setAuto(false); setPaused(false); setDeckIndex(next); setIndex(0); setNotice(''); }
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
  return <Dialog title="講座簡報播放" onClose={onClose} hideHeading className={`keynote-dialog ${expanded ? 'expanded' : ''}`}>
    <div className="keynote-player" ref={root} onKeyDown={keyboard}>
      <header className="keynote-toolbar"><div className="keynote-heading"><Presentation size={22} /><h2>講座簡報</h2></div><div className="keynote-toolbar-actions"><details className="keynote-info"><summary aria-label="簡報來源說明"><Info size={20} /></summary><div><strong>依提供文稿重製</strong><p>{deck.title}</p><p>{deck.description}</p><p>原始檔名：</p>{deck.files.map(file => <p key={file} className="source-filename">{file}</p>)}<p>本播放器依逐頁文字重製，並非原始 PowerPoint 頁面的逐像素還原。</p></div></details><button onClick={toggleFullscreen} aria-label={fullscreen || expanded ? '離開全螢幕' : '全螢幕播放'}>{fullscreen || expanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}</button><button onClick={onClose} aria-label="關閉簡報播放器"><X size={22} /></button></div></header>
      <div className="keynote-deck-tabs" role="tablist" aria-label="選擇簡報">{pptxDecks.map((item, i) => <button key={item.id} id={`deck-tab-${item.id}`} aria-controls="keynote-panel" role="tab" aria-selected={deckIndex === i} tabIndex={deckIndex === i ? 0 : -1} onClick={() => switchDeck(i)} onKeyDown={event => { const next = event.key === 'ArrowRight' ? (i + 1) % pptxDecks.length : event.key === 'ArrowLeft' ? (i + pptxDecks.length - 1) % pptxDecks.length : -1; if (next >= 0) { event.preventDefault(); switchDeck(next); (event.currentTarget.parentElement?.children[next] as HTMLButtonElement)?.focus(); } }}><span>{item.shortTitle}</span><small>{item.slides.length} 頁</small></button>)}</div>
      <div className="keynote-workspace">
        <nav className="keynote-thumbnails" aria-label="投影片縮圖">{deck.slides.map((item, i) => {
          const illustration = visuals.visuals.find(v => v.id === item.illustration)!;
          return <button key={item.id} ref={i === index ? thumb : undefined} onClick={() => move(i)} aria-current={i === index ? 'page' : undefined} aria-label={`第 ${i + 1} 頁：${item.title}`}><span className="thumbnail-preview"><img alt="" width={48} height={48} src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(illustration.svg)}`} /><span>{item.title}</span></span><span className="thumbnail-caption">{i + 1}<span>{item.title}</span></span></button>;
        })}</nav>
        <section id="keynote-panel" className="keynote-view" role="tabpanel" aria-labelledby={`deck-tab-${deck.id}`} >
          <article ref={slideCanvas} className={`slide-canvas ${index === 0 ? 'cover-slide' : ''}`} tabIndex={0} aria-label={`第 ${index + 1} 頁，共 ${deck.slides.length} 頁：${slide.title}`} onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={event => { const start = touch.current; touch.current = null; if (!start) return; const x = event.changedTouches[0].clientX - start.x, y = event.changedTouches[0].clientY - start.y; if (Math.abs(x) > 65 && Math.abs(y) < 35) move(index + (x < 0 ? 1 : -1)); }}>
            <div className="slide-content"><div className="slide-heading"><div><p className="slide-series">{deck.shortTitle}・葡眾健康講座</p><h3>{slide.title}</h3>{slide.subtitle && <p className="slide-subtitle">{slide.subtitle}</p>}</div><img className="slide-art" alt="" width={180} height={180} src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(art.svg)}`} /></div><div className={`slide-blocks ${slide.blocks.length > 2 ? 'multi-blocks' : ''}`}>{slide.blocks.map(block => <section key={block.heading}><h4>{block.heading}</h4><p>{block.text}</p></section>)}</div>{slide.note && <p className="slide-note">{slide.note}</p>}<div className="slide-foot"><span>找回身體的自癒力</span><span>{index + 1} / {deck.slides.length}</span></div></div>
          </article>
          <details className="keynote-notes"><summary>閱讀大字講稿與來源</summary><div className="narration-copy"><h3>{slide.title}</h3>{slide.blocks.map(block => <section key={block.heading}><h4>{block.heading}</h4><p>{block.text}</p></section>)}{slide.note && <p>{slide.note}</p>}<details><summary>對照提供的原稿</summary><p className="small-copy">以下保留來源說法；研究數字、原料機轉與品牌用語，不等於成品治療或預防疾病的證據。</p><div className="source-text">{slide.sourceText.replace(/\*\*/g, '')}</div></details></div></details>
        </section>
      </div>
      <footer className="keynote-controls"><div className="slide-paging"><button onClick={() => move(index - 1)} disabled={index === 0} aria-label="上一頁"><ChevronLeft size={22} /></button><span role="status" aria-live="polite" className="slide-counter">{index + 1} / {deck.slides.length}</span><button onClick={() => move(index + 1)} disabled={index === deck.slides.length - 1} aria-label="下一頁"><ChevronRight size={22} /></button></div><div className="narration-controls"><button onClick={toggleNarration} disabled={!supported} className={auto ? 'narrating' : ''}>{!auto ? <Volume2 size={21} /> : paused ? <Play size={21} /> : <Pause size={21} />}<span>{!supported ? '不支援語音' : !auto ? '自動朗讀' : paused ? '繼續朗讀' : '暫停朗讀'}</span></button>{auto && <button aria-label="停止朗讀" onClick={() => { setAuto(false); setPaused(false); }}><Square size={18} /></button>}</div><p className="keynote-notice" role="status">{notice || (auto ? '本頁讀完後，自動前往下一頁' : '← → 切頁・可上下捲動閱讀全文')}</p></footer>
    </div>
  </Dialog>;
}
