'use client';
import {useState} from 'react';
import dynamic from 'next/dynamic';
import {sitePath} from '@/lib/site';
import {visualDeckById,type VisualPage} from '@/data/visual-assets-manifest';
const PdfSlideCanvas=dynamic(()=>import('./PdfSlideCanvas'),{ssr:false,loading:()=><p role="status">正在準備原始 PDF…</p>});
export default function PdfVisual({page,live=false}:{page:VisualPage;live?:boolean}){
 const [failed,setFailed]=useState(false);
 const deck=visualDeckById.get(page.deckId)!;
 return <div className="pdf-visual" style={{aspectRatio:`${page.width}/${page.height}`}}>
  {failed||live?<PdfSlideCanvas key={page.id} fileUrl={deck.fileUrl} pageNumber={page.pageNumber} label={`${deck.title}，第 ${page.pageNumber} 頁：${page.title}`}/>:<img src={sitePath(page.image)} alt={`${page.title}；${deck.title}原始第 ${page.pageNumber} 頁`} width={page.width} height={page.height} decoding="async" onError={()=>setFailed(true)}/>}
 </div>;
}
