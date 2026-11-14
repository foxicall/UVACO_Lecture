'use client';
import {useEffect,useRef,useState,type KeyboardEvent} from 'react';
import {ChevronLeft,ChevronRight,Maximize2,Presentation,X,Info,Volume2,Square,Pause,Play} from 'lucide-react';
import Dialog from './Dialog';
import PdfVisual from './PdfVisual';
import VisualLightbox from './VisualLightbox';
import VoiceGuide from './VoiceGuide';
import SlideExplanation from './SlideExplanation';
import EmbeddedFigures from './EmbeddedFigures';
import {visualDecks,visualPageCount} from '@/data/visual-assets-manifest';
import {pptxDecks} from '@/data/pptx-decks';
import {sitePath} from '@/lib/site';
import {productById} from '@/data/uvaco-products';
import type {SlideTarget} from '@/data/health-triangle';

function initialPosition(target?:SlideTarget){
 if(target?.deckId==='longevity-2')return {deck:visualDecks.findIndex(d=>d.id==='longevity-6'),index:39};
 const source=pptxDecks.find(d=>d.id===target?.deckId)?.slides.find(s=>s.id===target?.slideId);
 const deck=Math.max(0,visualDecks.findIndex(d=>d.id===target?.deckId));
 return {deck,index:Math.max(0,Math.min(visualDecks[deck].pageCount-1,(source?.sourcePages[0]||1)-1))};
}
export default function PptxKeynotePlayer({onClose,initialSlide,onProducts}:{onClose:()=>void;initialSlide?:SlideTarget;onProducts:(ids:string[])=>void}){
 const initial=initialPosition(initialSlide);
 const [deckIndex,setDeckIndex]=useState(initial.deck);const [index,setIndex]=useState(initial.index);
 const [lightbox,setLightbox]=useState(false);const [auto,setAuto]=useState(false);const [supported,setSupported]=useState(false);
 const [paused,setPaused]=useState(false);
 const [notice,setNotice]=useState('');const panel=useRef<HTMLDivElement>(null);const strip=useRef<HTMLElement>(null);
 const touch=useRef<{x:number;y:number}|null>(null);
 const deck=visualDecks[deckIndex];const page=deck.pages[index];
 useEffect(()=>{setSupported('speechSynthesis' in window);const reset=(e:Event)=>{if((e as CustomEvent).detail?.owner!=='keynote')setAuto(false);};window.addEventListener('uvaco-speech-reset',reset);return()=>{window.removeEventListener('uvaco-speech-reset',reset);window.speechSynthesis?.cancel();};},[]);
 useEffect(()=>{panel.current?.scrollTo({top:0});const selected=strip.current?.querySelector<HTMLElement>('[aria-current="page"]');if(selected&&strip.current)strip.current.scrollTo({left:selected.offsetLeft-strip.current.offsetLeft-strip.current.clientWidth/2+selected.clientWidth/2,behavior:'instant'});setNotice('');},[deckIndex,index]);
 useEffect(()=>{if(!auto||!supported)return;let active=true;const synth=window.speechSynthesis;synth.cancel();setPaused(false);const speech=new SpeechSynthesisUtterance(`${page.title}。${page.caption}`);speech.lang='zh-TW';speech.rate=.92;speech.onend=()=>{if(!active)return;if(index<deck.pageCount-1)setIndex(v=>v+1);else{setAuto(false);setNotice('這份原始簡報已朗讀完畢。');}};speech.onerror=e=>{if(active&&!['canceled','interrupted'].includes(e.error)){setAuto(false);setNotice('此裝置目前無法播放語音。');}};synth.speak(speech);return()=>{active=false;synth.cancel();};},[auto,supported,page,index,deck.pageCount]);
 function move(next:number){setIndex(Math.max(0,Math.min(deck.pageCount-1,next)));}
 function switchDeck(next:number){setAuto(false);setDeckIndex(next);setIndex(0);}
 function keyboard(e:KeyboardEvent){if(e.altKey||e.ctrlKey||e.metaKey||(e.target as HTMLElement).closest('.keynote-deck-tabs,.visual-lightbox,input,textarea,select'))return;const next=e.key==='ArrowRight'?index+1:e.key==='ArrowLeft'?index-1:e.key==='Home'?0:e.key==='End'?deck.pageCount-1:null;if(next!==null){e.preventDefault();move(next);}}
 return <Dialog title="原始 PDF 圖解簡報" onClose={onClose} hideHeading className="keynote-dialog pdf-keynote-dialog">
  <div className="keynote-player" onKeyDown={keyboard}>
   <header className="keynote-toolbar"><div className="keynote-heading"><Presentation size={22}/><h2>身體的圖像故事</h2></div><div className="keynote-toolbar-actions"><details className="keynote-info"><summary aria-label="簡報來源說明"><Info size={20}/></summary><div><strong>{visualDecks.length} 份原始 PDF · {visualPageCount} 頁</strong><p>每頁保留原始內容與來源署名，旁邊另附白話導讀。活動主講人為林煒醫師；參考簡報保留各自作者的著作歸屬。</p><a href={sitePath(deck.fileUrl)} target="_blank" rel="noopener noreferrer">開啟本份完整 PDF ↗</a></div></details><button onClick={()=>setLightbox(true)} aria-label="全螢幕播放"><Maximize2 size={20}/></button><button onClick={onClose} aria-label="關閉簡報播放器"><X size={22}/></button></div></header>
   <p className="keynote-byline">林煒醫師健康講座 · 看原圖，聽白話</p>
   <div className="keynote-deck-tabs" role="tablist" aria-label="選擇簡報">{visualDecks.map((item,i)=><button key={item.id} id={`deck-tab-${item.id}`} aria-controls="keynote-panel" role="tab" aria-selected={deckIndex===i} tabIndex={deckIndex===i?0:-1} onClick={()=>switchDeck(i)} onKeyDown={e=>{const next=e.key==='ArrowRight'?(i+1)%visualDecks.length:e.key==='ArrowLeft'?(i+visualDecks.length-1)%visualDecks.length:e.key==='Home'?0:e.key==='End'?visualDecks.length-1:-1;if(next>=0){e.preventDefault();switchDeck(next);(e.currentTarget.parentElement?.children[next] as HTMLElement)?.focus();}}}><span>{item.title}</span><small>{item.pageCount} 頁</small></button>)}</div>
   <div ref={panel} className="pdf-keynote-workspace" id="keynote-panel" role="tabpanel" aria-labelledby={`deck-tab-${deck.id}`}>
    <section className="pdf-keynote-stage" aria-label="原始投影片" onTouchStart={e=>{touch.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={e=>{const p=touch.current;touch.current=null;if(!p)return;const x=e.changedTouches[0].clientX-p.x,y=e.changedTouches[0].clientY-p.y;if(Math.abs(x)>65&&Math.abs(y)<40)move(index+(x<0?1:-1));}}>
     <div className="pdf-keynote-image"><PdfVisual key={page.id} page={page}/><button className="visual-expand" onClick={()=>setLightbox(true)}><Maximize2 size={20}/>全螢幕原圖檢視</button></div>
     <p className="visual-provenance">{deck.title} · 原始 PDF 第 {page.pageNumber} 頁 / {deck.pageCount} 頁</p>
    </section>
    <article className="pdf-keynote-companion" aria-label={`第 ${index+1} 頁白話導讀`}>
     <p className="story-eyebrow">這張圖，想說什麼？</p><h3>{page.title}</h3><p className="visual-caption">{page.caption}</p>
     <VoiceGuide key={page.id} text={`${page.title}。${page.caption}`} label="國語語音朗讀"/>
     <SlideExplanation key={page.id} page={page}/>
     <EmbeddedFigures key={`figures-${page.id}`} page={page}/>
     {page.productIds.length>0&&<details className="visual-source-note"><summary>延伸認識相關原料</summary><div className="pdf-product-links">{page.productIds.map(id=><button key={id} onClick={()=>onProducts([id])}>{productById.get(id)?.name} ↗</button>)}</div></details>}
    </article>
   </div>
   <nav ref={strip} className="keynote-thumbnails pdf-filmstrip" aria-label="投影片縮圖">{deck.pages.map((item,i)=><button key={item.id} onClick={()=>move(i)} aria-current={i===index?'page':undefined} aria-label={`第 ${i+1} 頁：${item.title}`}><span className="thumbnail-preview"><img src={sitePath(item.thumbnail)} alt="" width={160} height={90} loading="lazy"/></span><span className="thumbnail-caption">{i+1}<span>{item.title}</span></span></button>)}</nav>
   <footer className="keynote-controls"><div className="slide-paging"><button onClick={()=>move(index-1)} disabled={index===0} aria-label="上一頁"><ChevronLeft size={22}/></button><span role="status" className="slide-counter">{index+1} / {deck.pageCount}</span><button onClick={()=>move(index+1)} disabled={index===deck.pageCount-1} aria-label="下一頁"><ChevronRight size={22}/></button></div><div className="narration-controls"><button className="pdf-auto-narration" disabled={!supported} onClick={()=>{if(!auto){window.dispatchEvent(new CustomEvent('uvaco-speech-reset',{detail:{owner:'keynote'}}));setAuto(true);}else if(paused){window.speechSynthesis.resume();setPaused(false);}else{window.speechSynthesis.pause();setPaused(true);}}}>{!auto?<Volume2 size={20}/>:paused?<Play size={20}/>:<Pause size={20}/>}<span>{!auto?'自動朗讀':paused?'繼續朗讀':'暫停朗讀'}</span></button>{auto&&<button aria-label="停止朗讀" onClick={()=>{setAuto(false);setPaused(false);}}><Square size={20}/></button>}</div><p role="status" className="keynote-notice">{notice||(auto?'讀完本頁，自動接著下一頁':'← → 翻頁 · 下方縮圖可直接選頁')}</p></footer>
   {lightbox&&<VisualLightbox page={page} onClose={()=>setLightbox(false)}/>}
  </div>
 </Dialog>;
}
