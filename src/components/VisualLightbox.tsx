'use client';
import {useState} from 'react';
import {TransformWrapper,TransformComponent} from 'react-zoom-pan-pinch';
import {ZoomIn,ZoomOut,RotateCcw} from 'lucide-react';
import Dialog from './Dialog';
import PdfVisual from './PdfVisual';
import {visualDeckById,type VisualPage} from '@/data/visual-assets-manifest';
import {sitePath} from '@/lib/site';
export default function VisualLightbox({page,onClose}:{page:VisualPage;onClose:()=>void}){
 const [live,setLive]=useState(false);
 const deck=visualDeckById.get(page.deckId)!;
 return <Dialog title="全螢幕原圖檢視" onClose={onClose} className="visual-lightbox">
  <div className="visual-lightbox-body" onKeyDown={e=>e.stopPropagation()}>
   <TransformWrapper minScale={1} maxScale={5} centerOnInit wheel={{step:.15}} doubleClick={{mode:'toggle'}}>
    {({zoomIn,zoomOut,resetTransform})=><>
     <div className="visual-zoom-tools"><button aria-label="縮小原圖" onClick={()=>zoomOut()}><ZoomOut/></button><button aria-label="放大原圖" onClick={()=>zoomIn()}><ZoomIn/></button><button onClick={()=>resetTransform()}><RotateCcw size={20}/>適合畫面</button><button aria-pressed={live} onClick={()=>{resetTransform();setLive(v=>!v);}}>{live?'切回高清圖':'以 PDF 繪製'}</button></div>
     <TransformComponent wrapperClass="visual-zoom-window" contentClass="visual-zoom-content"><PdfVisual key={`${page.id}-${live}`} page={page} live={live}/></TransformComponent>
    </>}
   </TransformWrapper>
   <p className="visual-provenance">{deck.title} · 原始第 {page.pageNumber} 頁 · 可雙指縮放或拖曳<a href={sitePath(deck.fileUrl)+`#page=${page.pageNumber}`} target="_blank" rel="noopener noreferrer">開啟原始 PDF ↗</a></p>
  </div>
 </Dialog>;
}
