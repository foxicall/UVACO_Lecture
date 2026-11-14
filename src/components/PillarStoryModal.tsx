'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowLeft, Check, X, MapPin } from 'lucide-react';
import Dialog from './Dialog';
import VoiceGuide from './VoiceGuide';
import ScienceDetails from './ScienceDetails';
import { pillarById, pillars, type PillarId } from '@/data/lecture-poster';
import { pillarStories, storyStages, storyNarration } from '@/data/four-pillars-story';
import { productById } from '@/data/uvaco-products';

export default function PillarStoryModal({pillarId,onClose,onProduct,onNextStory}:{pillarId:PillarId;onClose:()=>void;onProduct:(id:string)=>void;onNextStory:(id:PillarId)=>void}) {
  const [stage,setStage]=useState(0);
  const [visited,setVisited]=useState(0);
  const [selected,setSelected]=useState<string[]>([]);
  const [chemical,setChemical]=useState(0);
  const heading=useRef<HTMLHeadingElement>(null);
  const story=pillarStories[pillarId];
  const pillar=pillarById.get(pillarId)!;
  const current=story.chemicals[chemical];
  useEffect(()=>{heading.current?.focus({preventScroll:true});heading.current?.scrollIntoView({block:'nearest'});},[stage]);
  const go=(next:number)=>{setStage(next);setVisited(value=>Math.max(value,next));};
  return <Dialog title={`${pillar.name}・身體的三幕故事`} className="pillar-story-dialog" onClose={onClose} hideHeading>
    <header className="story-header"><div><p>林煒醫師健康講座</p><h2>{story.icon} {pillar.name}</h2></div><button className="icon-button" aria-label="關閉身體故事" onClick={onClose}><X/></button></header>
    <ol className="story-steps" aria-label="三幕閱讀進度">{storyStages.map((name,index)=><li key={name}><button aria-current={stage===index?'step':undefined} disabled={index>visited} onClick={()=>go(index)}><span aria-hidden="true">{index<stage?<Check size={18}/>:index+1}</span>{name}</button></li>)}</ol>
    <section className="story-stage" data-stage={stage+1} aria-labelledby="story-stage-title">
      <p className="story-eyebrow">第{['一','二','三'][stage]}幕 · {stage+1} / 3</p>
      <h3 id="story-stage-title" tabIndex={-1} ref={heading}>{['身邊多少人，有這個困擾？','身體裡，發生了什麼事？','怎麼照顧，再認識原料？'][stage]}</h3>
      {stage===0&&<>
        <div className="story-stat"><strong>{story.stat.value}</strong><div><h4>{story.stat.label}</h4><p>{story.stat.context}</p><a href={story.stat.url} target="_blank" rel="noopener noreferrer">{story.stat.source} ↗</a></div></div>
        <p className="story-lead">{story.opening}</p>
        <fieldset className="story-symptoms"><legend>哪些感受，您也曾遇過？</legend><p>可以選幾項，帶著自己的生活經驗往下看。</p>{story.symptoms.map(symptom=><label key={symptom}><input type="checkbox" checked={selected.includes(symptom)} onChange={event=>setSelected(value=>event.target.checked?[...value,symptom]:value.filter(item=>item!==symptom))}/><span>{symptom}</span></label>)}</fieldset>
      </>}
      {stage===1&&<>
        <p className="story-lead">{story.causeIntro}</p>
        <div className="chemical-choices" role="group" aria-label="選一個身體裡的訊息">{story.chemicals.map((item,index)=><button key={item.name} aria-pressed={chemical===index} onClick={()=>setChemical(index)}><span>{index+1}</span>{item.name}</button>)}</div>
        <article className="chemical-story" aria-live="polite"><p className="story-eyebrow">{current.name}</p><h4>{current.metaphor}</h4><p>{current.description}</p><ol className="chemical-flow" aria-label={`${current.name}的生活比喻`}>{current.flow.map((node,index)=><li key={node}><span>{node}</span>{index<current.flow.length-1&&<ArrowRight aria-hidden="true" size={22}/>}</li>)}</ol><p>{current.care}</p></article>
        <ScienceDetails><h4>把生活比喻對回研究</h4>{story.science.map(text=><p key={text}>{text}</p>)}<p>資料主題：{story.sourceTopics.join('、')}</p></ScienceDetails>
      </>}
      {stage===2&&<>
        <p className="story-lead">{story.bridgeIntro}</p>
        <div className="story-care"><h4>今天先做一件小事</h4><p>{story.firstAction}</p></div>
        <div className="product-bridges">{story.bridges.map(bridge=><button key={bridge.productId} onClick={()=>onProduct(bridge.productId)}><span className="bridge-concept">{bridge.connection}</span><strong>{productById.get(bridge.productId)!.name}</strong><span>{bridge.description}</span><span className="bridge-action"><MapPin size={19}/>到島上看配方 <ArrowRight size={20}/></span></button>)}</div>
      </>}
      <VoiceGuide key={`${pillarId}-${stage}-${chemical}`} text={storyNarration(pillarId,stage,chemical)}/>
    </section>
    <nav className="story-controls" aria-label="故事翻頁"><button disabled={stage===0} onClick={()=>go(stage-1)}><ArrowLeft size={20}/>上一幕</button>{stage<2?<button className="primary" onClick={()=>go(stage+1)}>{stage===0?'接著，看身體怎麼了':'再來，認識照顧與原料'}<ArrowRight size={20}/></button>:<button className="primary" onClick={()=>onNextStory(pillars[(pillars.findIndex(item=>item.id===pillarId)+1)%pillars.length].id)}>下一個身體故事<ArrowRight size={20}/></button>}</nav>
  </Dialog>;
}
