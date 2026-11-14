'use client';
import {useEffect,useRef,useState} from 'react';
import {sitePath} from '@/lib/site';

/** Image-independent fallback: render the exact source page with PDF.js at 2x. */
export default function PdfSlideCanvas({fileUrl,pageNumber,label}:{fileUrl:string;pageNumber:number;label?:string}) {
  const host=useRef<HTMLDivElement>(null);
  const canvas=useRef<HTMLCanvasElement>(null);
  const [width,setWidth]=useState(0);
  const [state,setState]=useState<'loading'|'ready'|'error'>('loading');
  useEffect(()=>{
    const observer=new ResizeObserver(entries=>setWidth(Math.round(entries[0].contentRect.width)));
    if(host.current)observer.observe(host.current);
    return()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    if(!width||!canvas.current)return;
    let cancelled=false;
    let dispose:undefined|(()=>void);
    setState('loading');
    async function render(){
      try{
        const pdfjs=await import('pdfjs-dist');
        if(cancelled)return;
        pdfjs.GlobalWorkerOptions.workerSrc=sitePath('/pdfjs/pdf.worker.min.mjs');
        const task=pdfjs.getDocument({url:sitePath(fileUrl),cMapUrl:sitePath('/pdfjs/cmaps/'),cMapPacked:true,standardFontDataUrl:sitePath('/pdfjs/standard_fonts/'),wasmUrl:sitePath('/pdfjs/wasm/')});
        dispose=()=>{void task.destroy().catch(()=>{});};
        const doc=await task.promise;
        if(cancelled)return;
        const page=await doc.getPage(pageNumber);
        if(cancelled)return;
        const base=page.getViewport({scale:1});
        const scale=Math.min(width*2/base.width,4096/Math.max(base.width,base.height));
        const viewport=page.getViewport({scale});
        const el=canvas.current!;
        el.width=Math.ceil(viewport.width);el.height=Math.ceil(viewport.height);
        const rendering=page.render({canvas:el,viewport});
        dispose=()=>{rendering.cancel();void task.destroy().catch(()=>{});};
        await rendering.promise;
        if(!cancelled)setState('ready');
      }catch{if(!cancelled)setState('error');}
    }
    void render();
    return()=>{cancelled=true;dispose?.();};
  },[fileUrl,pageNumber,width]);
  return <div ref={host} className="pdf-live-canvas" data-pdf-state={state}>
    {state==='loading'&&<p role="status">正在開啟高清原頁…</p>}
    {state==='error'?<p role="status">此裝置未能繪製本頁。<a href={sitePath(fileUrl)+`#page=${pageNumber}`} target="_blank" rel="noopener noreferrer">開啟圖解 PDF 第 {pageNumber} 頁 ↗</a></p>:<canvas ref={canvas} role="img" aria-label={label||`圖解 PDF 第 ${pageNumber} 頁`} style={{visibility:state==='ready'?'visible':'hidden'}}/>}
  </div>;
}
