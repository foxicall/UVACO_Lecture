'use client';

import {useEffect,useId,useRef,useState,type ReactNode} from 'react';
import {ArrowDownRight,MapPin,Pause,Play,Sparkles} from 'lucide-react';
import type {ScienceMode,ScienceModuleDefinition,ScienceTrack} from '@/data/science-module-types';
import {productById} from '@/data/uvaco-products';
import VoiceGuide from './VoiceGuide';

type SceneState={mode:ScienceMode;running:boolean;stageId:string};
type Edge={id:string;from:string;to:string;path:string};

function PathwayTrack({track,running,mode}:{track:ScienceTrack;running:boolean;mode:ScienceMode}){
 const uid=useId().replace(/:/g,'');
 const board=useRef<HTMLDivElement>(null);
 const nodes=useRef(new Map<string,HTMLButtonElement>());
 const [selected,setSelected]=useState(track.nodes[0].id);
 const [geometry,setGeometry]=useState<{width:number;height:number;edges:Edge[]}>({width:1,height:1,edges:[]});
 const active=track.nodes.find(node=>node.id===selected)||track.nodes[0];
 useEffect(()=>{
  const element=board.current;if(!element)return;
  let frame=0;
  const measure=()=>{
   const parent=element.getBoundingClientRect();if(!parent.width)return;
   const edges:Edge[]=[];
   track.nodes.slice(1).forEach((node,index)=>{
    const previous=track.nodes[index],from=nodes.current.get(previous.id),to=nodes.current.get(node.id);
    if(!from||!to)return;
    const a=from.getBoundingClientRect(),b=to.getBoundingClientRect(),sameRow=Math.abs(a.top-b.top)<4;
    const sx=(sameRow?a.right:a.left+a.width/2)-parent.left,sy=(sameRow?a.top+a.height/2:a.bottom)-parent.top;
    const tx=(sameRow?b.left:b.left+b.width/2)-parent.left,ty=(sameRow?b.top+b.height/2:b.top)-parent.top;
    edges.push({id:`${previous.id}-${node.id}`,from:previous.id,to:node.id,path:sameRow?`M${sx},${sy} L${tx-5},${ty}`:`M${sx},${sy} V${(sy+ty)/2} H${tx} V${ty-5}`});
   });
   setGeometry({width:parent.width,height:parent.height,edges});
  };
  const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure);};
  const observer=new ResizeObserver(schedule);observer.observe(element);nodes.current.forEach(node=>observer.observe(node));schedule();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();};
 },[track]);
 const color=mode==='stress'?'#9b5144':'#376b57';
 return <section className="science-flow" data-science-flow-track={track.id} aria-label={track.title}>
  <h5>{track.title}</h5>
  <div className="science-flow-board" ref={board}>
   <svg className="science-flow-arrows" viewBox={`0 0 ${geometry.width} ${geometry.height}`} width="100%" height="100%" aria-hidden="true">
    <defs><marker id={`${uid}-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" fill={color}/></marker></defs>
    {geometry.edges.map(edge=><g key={edge.id}><path data-science-edge={edge.id} data-from={edge.from} data-to={edge.to} d={edge.path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" markerEnd={`url(#${uid}-arrow)`}/>{running&&<circle r="3.5" fill={mode==='stress'?'#b55d48':'#ad762d'}><animateMotion path={edge.path} dur="3.8s" repeatCount="indefinite"/></circle>}</g>)}
   </svg>
   {track.nodes.map((node,index)=><button key={node.id} ref={element=>{if(element)nodes.current.set(node.id,element);else nodes.current.delete(node.id);}} type="button" className="science-flow-node" data-science-node={node.id} aria-pressed={active.id===node.id} aria-controls={`${uid}-node-detail`} onClick={()=>setSelected(node.id)}><span>{String(index+1).padStart(2,'0')}</span><strong>{node.label}</strong>{node.cofactor&&<small>{node.cofactor}</small>}</button>)}
  </div>
  <div className="science-node-detail" id={`${uid}-node-detail`} aria-live="polite"><strong>{active.label}</strong><p>{active.detail}</p></div>
 </section>;
}

export default function ScienceModuleInteractive({definition,onProducts,showProducts=true,scene}:{definition:ScienceModuleDefinition;onProducts?:(ids:string[])=>void;showProducts?:boolean;scene:(state:SceneState)=>ReactNode}){
 const uid=useId().replace(/:/g,'');
 const root=useRef<HTMLElement>(null);
 const [mode,setMode]=useState<ScienceMode>('support');
 const [stageIndex,setStageIndex]=useState(0);
 const preferred=(index:number,state:ScienceMode)=>definition.stages[index].preferredTracks?.[state]||definition.stages[index].tracks[0].id;
 const [trackId,setTrackId]=useState(()=>preferred(0,'support'));
 const [paused,setPaused]=useState(false),[reduced,setReduced]=useState(true),[visible,setVisible]=useState(false),[pageVisible,setPageVisible]=useState(true);
 const stage=definition.stages[stageIndex];
 const track=stage.tracks.find(item=>item.id===trackId)||stage.tracks[0];
 const motion=reduced?'reduced':paused?'paused':!visible||!pageVisible?'offscreen':'running';
 const running=motion==='running';
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);
  const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.01});if(root.current)observer.observe(root.current);
  const visibility=()=>setPageVisible(!document.hidden);visibility();document.addEventListener('visibilitychange',visibility);
  return()=>{media.removeEventListener('change',update);observer.disconnect();document.removeEventListener('visibilitychange',visibility);};
 },[]);
 function changeMode(next:ScienceMode){setMode(next);setTrackId(preferred(stageIndex,next));}
 function changeStage(index:number){setStageIndex(index);setTrackId(preferred(index,mode));}
 const narration=`${definition.title}。${definition.modes[mode].summary}。${stage.title}。${stage.metaphor}。${stage.explanation}`;
 return <section ref={root} className="science-module-master" data-science-module={definition.id} data-science-mode={mode} data-science-motion={motion} aria-label={definition.title}>
  <header className="science-master-heading"><span className="science-eyebrow">{definition.eyebrow}</span><h3>{definition.title}</h3><p>{definition.introduction}</p></header>
  <div className="science-toolbar"><div className="science-mode-buttons" role="group" aria-label="切換生理示意模式">{(['stress','support'] as const).map(value=><button key={value} type="button" data-science-state={value} aria-pressed={mode===value} onClick={()=>changeMode(value)}>{value==='stress'?<ArrowDownRight size={22}/>:<Sparkles size={22}/>}<span>{definition.modes[value].label}</span></button>)}</div><div className="science-motion-tools"><button type="button" data-science-pause aria-pressed={paused} disabled={reduced} onClick={()=>setPaused(value=>!value)}>{paused?<Play size={19}/>:<Pause size={19}/>}<span>{reduced?'遵循減少動態':paused?'繼續動畫':'暫停動畫'}</span></button><VoiceGuide text={narration} label="聽本段導讀"/></div></div>
  <div className="science-hero-scene">{scene({mode,running,stageId:stage.id})}</div>
  <p className="science-mode-summary" aria-live="polite">{definition.modes[mode].summary}</p>
  <header className="science-section-heading"><span>沿著訊號，一站一站看</span><h4>從生活比喻，走進身體的工作站</h4></header>
  <div className="science-stage-buttons" role="group" aria-label="選擇生理觀察站">{definition.stages.map((item,index)=><button key={item.id} type="button" data-science-stage={item.id} aria-pressed={stageIndex===index} aria-controls={`${uid}-stage-panel`} onClick={()=>changeStage(index)}><span>{String(index+1).padStart(2,'0')}</span><strong>{item.title}</strong></button>)}</div>
  <section className="science-stage-panel" id={`${uid}-stage-panel`}><p className="science-stage-count">第 {stageIndex+1} 站 / 共 {definition.stages.length} 站</p><h4>{stage.title}</h4><p className="science-metaphor">{stage.metaphor}</p><p className="science-stage-explanation">{stage.explanation}</p>
   <div className="science-track-tabs" role="group" aria-label={`${stage.title}的機轉分支`}>{stage.tracks.map(item=><button key={item.id} type="button" data-science-track={item.id} aria-pressed={track.id===item.id} onClick={()=>setTrackId(item.id)}>{item.title}</button>)}</div>
   <PathwayTrack key={track.id} track={track} running={running} mode={mode}/>
   {showProducts&&stage.productIds.length>0&&<section className="science-products" aria-label="相關配方原料"><h5>把原料放回這個工作站</h5><p>{stage.productContext}</p><div>{stage.productIds.map(id=>{const product=productById.get(id);return product?<button type="button" key={id} data-science-product={id} disabled={!onProducts} onClick={()=>onProducts?.([id])}><MapPin size={19}/>{product.name}</button>:null;})}</div></section>}
  </section>
  {definition.evidence.length>0&&<details className="science-evidence"><summary>展開研究數字與實驗條件</summary><div>{definition.evidence.map(item=><article key={item.id} data-science-evidence={item.id}><h4>{item.title}</h4><p>{item.text}</p>{item.url?<a href={item.url} target="_blank" rel="noopener noreferrer">{item.source} ↗</a>:<p className="science-evidence-source">{item.source}</p>}</article>)}</div></details>}
  <details className="science-references"><summary>閱讀這張圖的科學來源</summary><ul>{definition.sources.map((source,index)=><li key={`${source.label}-${index}`}>{source.url?<a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>:source.label}</li>)}</ul></details>
 </section>;
}
