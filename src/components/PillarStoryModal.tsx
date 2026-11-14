'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowRight,ArrowLeft,Check,X,MapPin} from 'lucide-react';
import Dialog from './Dialog';
import ScienceDetails from './ScienceDetails';
import VisualCarousel from './VisualCarousel';
import {pillarById,pillars,type PillarId} from '@/data/lecture-poster';
import {pillarStories,storyStages} from '@/data/four-pillars-story';
import {productById} from '@/data/uvaco-products';
import {pillarVisuals,productVisuals,getVisualPage} from '@/data/visual-assets-manifest';
import {sitePath} from '@/lib/site';

export default function PillarStoryModal({pillarId,onClose,onProduct,onNextStory}:{pillarId:PillarId;onClose:()=>void;onProduct:(id:string)=>void;onNextStory:(id:PillarId)=>void}){
 const [stage,setStage]=useState(0);const [visited,setVisited]=useState(0);const [selected,setSelected]=useState<string[]>([]);
 const heading=useRef<HTMLHeadingElement>(null);const story=pillarStories[pillarId];const pillar=pillarById.get(pillarId)!;
 useEffect(()=>{heading.current?.focus({preventScroll:true});heading.current?.scrollIntoView({block:'nearest'});},[stage]);
 const go=(next:number)=>{setStage(next);setVisited(v=>Math.max(v,next));};
 return <Dialog title={`${pillar.name}・身體的三幕故事`} className="pillar-story-dialog visual-story-dialog" onClose={onClose} hideHeading>
  <header className="story-header"><div><p>林煒醫師健康講座</p><h2>{story.icon} {pillar.name}</h2></div><button className="icon-button" aria-label="關閉身體故事" onClick={onClose}><X/></button></header>
  <ol className="story-steps" aria-label="三幕閱讀進度">{storyStages.map((name,i)=><li key={name}><button aria-current={stage===i?'step':undefined} disabled={i>visited} onClick={()=>go(i)}><span aria-hidden="true">{i<stage?<Check size={18}/>:i+1}</span>{name}</button></li>)}</ol>
  <section className="story-stage" data-stage={stage+1} aria-labelledby="story-stage-title">
   <p className="story-eyebrow">第{['一','二','三'][stage]}幕 · 看圖，認識身體</p>
   <h3 id="story-stage-title" tabIndex={-1} ref={heading}>{['身體的感受，從哪裡開始？','跟著圖，看看身體怎麼了','懂了身體，再認識原料'][stage]}</h3>
   <div className="visual-story-grid">
    <VisualCarousel key={`${pillarId}-${stage}`} items={pillarVisuals[pillarId][stage]} label={`${pillar.name}第 ${stage+1} 幕原圖畫廊`}/>
    <div className="visual-story-companion">
     {stage===0&&<>
      <fieldset className="story-symptoms"><legend>您也有這些感受嗎？</legend>{story.symptoms.map(symptom=><label key={symptom}><input type="checkbox" checked={selected.includes(symptom)} onChange={e=>setSelected(v=>e.target.checked?[...v,symptom]:v.filter(s=>s!==symptom))}/><span>{symptom}</span></label>)}</fieldset>
      <details className="visual-source-note"><summary>一起看數字的來源</summary><strong>{story.stat.value} · {story.stat.label}</strong><p>{story.stat.context}</p><a href={story.stat.url} target="_blank" rel="noopener noreferrer">{story.stat.source} ↗</a></details>
     </>}
     {stage===1&&<><h4>看圖的小訣竅</h4><p>先找身體裡的主角，再順著箭頭看它們怎麼合作。</p><p>左右翻圖，慢慢認識不同的訊息。</p><ScienceDetails><h4>把比喻對回研究</h4>{story.science.map(text=><p key={text}>{text}</p>)}</ScienceDetails></>}
     {stage===2&&<><h4>今天先做一件小事</h4><p>{story.firstAction}</p><div className="visual-product-bridges">{story.bridges.map(bridge=>{const page=getVisualPage(productVisuals[bridge.productId][0].pageId);return <button key={bridge.productId} onClick={()=>onProduct(bridge.productId)}><img src={sitePath(page.thumbnail)} alt="相關原頁圖解" loading="lazy" width={160} height={90}/><span><strong>{productById.get(bridge.productId)!.name}</strong><small>{bridge.connection}</small><span><MapPin size={16}/>到島上看配方</span></span><ArrowRight size={20}/></button>;})}</div></>}
    </div>
   </div>
  </section>
  <nav className="story-controls" aria-label="故事翻頁"><button disabled={stage===0} onClick={()=>go(stage-1)}><ArrowLeft size={20}/>上一幕</button>{stage<2?<button className="primary" onClick={()=>go(stage+1)}>{stage===0?'接著，看身體怎麼了':'再來，認識照顧與原料'}<ArrowRight size={20}/></button>:<button className="primary" onClick={()=>onNextStory(pillars[(pillars.findIndex(p=>p.id===pillarId)+1)%pillars.length].id)}>下一個身體故事<ArrowRight size={20}/></button>}</nav>
 </Dialog>;
}
