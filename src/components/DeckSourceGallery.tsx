'use client';

import {useState} from 'react';
import {ChevronLeft,ChevronRight,Maximize2} from 'lucide-react';
import type {ThematicDeck} from '@/data/thematic-decks';
import {visualDeckById} from '@/data/visual-assets-manifest';
import {sitePath} from '@/lib/site';
import PdfVisual from './PdfVisual';
import VisualLightbox from './VisualLightbox';
import VoiceGuide from './VoiceGuide';

export default function DeckSourceGallery({deck}:{deck:ThematicDeck}){
 const [open,setOpen]=useState(false),[index,setIndex]=useState(0),[lightbox,setLightbox]=useState(false);
 const page=deck.pages[index];const source=visualDeckById.get(page.deckId);
 return <>
  <details className="deck-source-gallery" data-deck-gallery={deck.id} onToggle={event=>setOpen(event.currentTarget.open)}><summary><span>圖解資料室 · {deck.pageCount} 頁</span><strong>展開原始圖解投影片</strong></summary>
   {open&&<div className="deck-gallery-body"><nav className="deck-gallery-filmstrip" aria-label={`${deck.shortTitle}全部圖解`}>{deck.pages.map((item,i)=><button key={item.id} type="button" data-gallery-page={item.id} aria-pressed={index===i} aria-label={`第 ${i+1} 張：${item.title}`} onClick={()=>setIndex(i)}><img src={sitePath(item.thumbnail)} alt="" width={160} height={90} loading="lazy"/><span>{i+1} / {deck.pageCount}</span></button>)}</nav><div className="deck-gallery-stage"><PdfVisual key={page.id} page={page}/></div><div className="deck-gallery-controls"><button type="button" aria-label="上一張來源圖解" disabled={index===0} onClick={()=>setIndex(i=>Math.max(0,i-1))}><ChevronLeft/></button><div aria-live="polite"><strong>{page.title}</strong><span>{index+1} / {deck.pageCount} · {source?.title} · {page.deckId==='longevity-2'?'文稿重製':'來源'}第 {page.pageNumber} 頁</span></div><button type="button" aria-label="下一張來源圖解" disabled={index===deck.pageCount-1} onClick={()=>setIndex(i=>Math.min(deck.pageCount-1,i+1))}><ChevronRight/></button></div><div className="deck-gallery-tools"><button type="button" onClick={()=>setLightbox(true)}><Maximize2 size={20}/>點擊全螢幕放大</button><VoiceGuide key={`gallery-${page.id}`} text={`${page.title}。${page.caption}`} label="國語語音導讀"/></div><p className="deck-gallery-caption">{page.caption}</p></div>}
  </details>
  {lightbox&&<VisualLightbox page={page} onClose={()=>setLightbox(false)}/>}
 </>;
}
