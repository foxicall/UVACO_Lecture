'use client';
import {useEffect,useRef,useState} from 'react';
import {Sparkles} from 'lucide-react';
import {staticSite,sitePath} from '@/lib/site';
import {slideResponseSchema,type SlideExplanationResult} from '@/lib/slide-explanation';
import type {VisualPage} from '@/data/visual-assets-manifest';
import SearchReferences from './SearchReferences';
import VoiceGuide from './VoiceGuide';
export default function SlideExplanation({page}:{page:VisualPage}){
 const [answer,setAnswer]=useState<SlideExplanationResult|null>(null);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 const request=useRef<AbortController|null>(null);
 useEffect(()=>()=>request.current?.abort(),[]);
 async function explain(){
  const controller=new AbortController();request.current=controller;setBusy(true);setError('');const timer=setTimeout(()=>controller.abort(),60000);
  try{const res=await fetch(sitePath('/api/slide-explanation'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pageId:page.id}),signal:controller.signal});const data=await res.json();if(!res.ok)throw new Error(typeof data.error==='string'?data.error:'這次未完成解說。');const parsed=slideResponseSchema.parse(data);if(parsed.pageId!==page.id)throw new Error('圖解頁碼不一致，請重試。');setAnswer(parsed);}catch(e){if(request.current===controller&&!controller.signal.aborted)setError(e instanceof Error?e.message:'這次未完成解說。');else if(controller.signal.aborted&&request.current===controller)setError('這次等候較久，請稍後重試。');}finally{clearTimeout(timer);if(request.current===controller)setBusy(false);}
 }
 return <section className="slide-ai" aria-label="AI 圖解導讀">
  <button disabled={staticSite||busy} onClick={explain}><Sparkles size={20}/>{busy?'正在讀圖與查找資料…':'請 Gemini 3.8 白話解說這張圖'}</button>
  {staticSite&&<p className="small-copy">此版本提供完整離線導讀，即時 AI 解說可於雲端版使用。</p>}
  {busy&&<p role="status" className="small-copy">正在核對本頁原圖；您可以先閱讀上方導讀。</p>}
  {error&&<p role="status" className="small-copy">{error}</p>}
  {answer&&<div className="slide-ai-answer" aria-live="polite"><p className="story-eyebrow">Gemini 3.8 圖解</p>{answer.sentences.map((s,i)=><p key={i}>{s}</p>)}<VoiceGuide text={answer.sentences.join('')} label="聽 AI 白話解說"/><SearchReferences grounding={answer.grounding}/>{!answer.grounding.searched&&<p className="small-copy">本次未取得可列出的即時搜尋來源。</p>}</div>}
 </section>;
}
