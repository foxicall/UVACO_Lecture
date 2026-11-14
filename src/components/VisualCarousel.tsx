'use client';
import {useRef,useState} from 'react';
import {ChevronLeft,ChevronRight,Maximize2} from 'lucide-react';
import {getVisualPage,visualDeckById,type VisualSelection} from '@/data/visual-assets-manifest';
import PdfVisual from './PdfVisual';
import VisualLightbox from './VisualLightbox';
import VoiceGuide from './VoiceGuide';
export default function VisualCarousel({items,label,caption=true,narration=true,onIndexChange}:{items:VisualSelection[];label:string;caption?:boolean;narration?:boolean;onIndexChange?:(index:number)=>void}){
 const [index,setIndex]=useState(0);const [expanded,setExpanded]=useState(false);
 const start=useRef<{x:number;y:number}|null>(null);
 const selection=items[index]||items[0];const page=getVisualPage(selection.pageId);const deck=visualDeckById.get(page.deckId)!;
 const move=(value:number)=>{const next=Math.max(0,Math.min(items.length-1,value));setIndex(next);onIndexChange?.(next);};
 return <section className="visual-carousel" aria-label={label} aria-roledescription="圖片輪播" onKeyDown={e=>{if(e.target instanceof HTMLElement&&e.target.closest('.visual-lightbox'))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();e.stopPropagation();move(index+(e.key==='ArrowRight'?1:-1));}}}>
  <div className="visual-carousel-image" onTouchStart={e=>{start.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={e=>{const p=start.current;start.current=null;if(!p)return;const x=e.changedTouches[0].clientX-p.x,y=e.changedTouches[0].clientY-p.y;if(Math.abs(x)>60&&Math.abs(y)<45)move(index+(x<0?1:-1));}}>
   <PdfVisual key={page.id} page={page}/>
   <button className="visual-expand" onClick={()=>setExpanded(true)} aria-label={`全螢幕原圖檢視：${page.title}`}><Maximize2 size={19}/><span>放大原圖</span></button>
  </div>
  <div className="visual-carousel-navigation"><button onClick={()=>move(index-1)} disabled={index===0} aria-label="上一張圖解"><ChevronLeft/></button><div aria-live="polite"><strong>{selection.label||page.title}</strong><span>{index+1} / {items.length} · {deck.title} 第 {page.pageNumber} 頁</span></div><button onClick={()=>move(index+1)} disabled={index===items.length-1} aria-label="下一張圖解"><ChevronRight/></button></div>
  {caption&&<p className="visual-caption">{selection.caption||page.caption}</p>}
  {narration&&<VoiceGuide key={page.id} text={`${selection.label||page.title}。${selection.caption||page.caption}`} label="聽白話圖解導讀"/>}
  {expanded&&<VisualLightbox page={page} onClose={()=>setExpanded(false)}/>}
 </section>;
}
