'use client';
import {useState} from 'react';
import {visualFigures,type VisualPage} from '@/data/visual-assets-manifest';
import {sitePath} from '@/lib/site';
import VisualLightbox from './VisualLightbox';
const figureById=new Map(visualFigures.map(f=>[f.id,f]));
export default function EmbeddedFigures({page}:{page:VisualPage}){
 const [open,setOpen]=useState(false);const [selected,setSelected]=useState<VisualPage|null>(null);
 if(!page.figureIds.length)return null;
 return <details className="embedded-figures visual-source-note" onToggle={e=>setOpen(e.currentTarget.open)}><summary>本頁內嵌圖像 · {page.figureIds.length} 張</summary>
  {open&&<div>{page.figureIds.map((id,i)=>{const f=figureById.get(id)!;return <button key={id} onClick={()=>setSelected({...page,image:f.image,width:f.width,height:f.height,title:`${page.title} · 內嵌圖像 ${i+1}`})}><img src={sitePath(f.image)} alt={`原頁內嵌圖像 ${i+1}`} loading="lazy" width={f.width} height={f.height}/><span>{f.kind==='page-image'?'整頁原始圖片':`獨立圖像 ${i+1}`}</span></button>;})}</div>}
  {selected&&<VisualLightbox page={selected} onClose={()=>setSelected(null)}/>}
 </details>;
}
