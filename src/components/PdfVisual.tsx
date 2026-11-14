'use client';
import {useState} from 'react';
import dynamic from 'next/dynamic';
import {sitePath} from '@/lib/site';
import {visualDeckById,type VisualPage} from '@/data/visual-assets-manifest';
const PdfSlideCanvas=dynamic(()=>import('./PdfSlideCanvas'),{ssr:false,loading:()=><p role="status">正在準備科學圖解 PDF…</p>});
export default function PdfVisual({page,live=false}:{page:VisualPage;live?:boolean}){
 const [failed,setFailed]=useState(false);
 const deck=visualDeckById.get(page.deckId)!;
 const pdfPageNumber=page.pdfPageNumber;
 return <div className="pdf-visual" style={{aspectRatio:`${page.width}/${page.height}`}}>
  {failed||live?<PdfSlideCanvas key={page.id} fileUrl={deck.fileUrl} pageNumber={pdfPageNumber} label={`${deck.title}，來源第 ${page.pageNumber} 頁：${page.title}`}/>:<img src={sitePath(page.image)} alt={`${page.title}；${deck.title}來源第 ${page.pageNumber} 頁`} width={page.width} height={page.height} decoding="async" onError={()=>setFailed(true)}/>}
 </div>;
}
