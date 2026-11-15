'use client';

import {useEffect,useId,useRef,useState} from 'react';
import {ArrowDownRight,Brain,ChevronLeft,ChevronRight,MapPin,Maximize2,Pause,Play,ShieldCheck,Sprout} from 'lucide-react';
import {gutBrainModes,gutBrainKpis,gutBarrierLayers,gutDominoAxes,gutDistalPathways,gutRepairSteps,gutCaseStudy,gutBrainSources} from '@/data/gut-brain-interactive';
import {productById} from '@/data/uvaco-products';
import {visualDeckById} from '@/data/visual-assets-manifest';
import {sitePath} from '@/lib/site';
import GutBarrierScene from './GutBarrierScene';
import VoiceGuide from './VoiceGuide';
import PdfVisual from './PdfVisual';
import VisualLightbox from './VisualLightbox';

type Mode='stress'|'support';
type Layer='mucus'|'junctions'|'immune';
type Track={id:string;title:string;nodes:readonly {id:string;label:string;detail:string;cofactor?:string}[]};
type Connector={id:string;from:string;to:string;path:string};
const sourceDeck=visualDeckById.get('longevity-6')!;

/** Nodes remain real, resizable text. The SVG follows their measured positions. */
function FlowTrack({track,running,mode}:{track:Track;running:boolean;mode:Mode}){
 const edgeColor=mode==='stress'?'#A45243':'#426D62';const particleColor=mode==='stress'?'#BD624E':'#B37228';
 const uid=useId().replace(/:/g,'');
 const board=useRef<HTMLDivElement>(null);
 const nodes=useRef(new Map<string,HTMLButtonElement>());
 const [selected,setSelected]=useState(track.nodes[0]?.id);
 const [geometry,setGeometry]=useState<{width:number;height:number;edges:Connector[]}>({width:1,height:1,edges:[]});
 const active=track.nodes.find(node=>node.id===selected)||track.nodes[0];
 useEffect(()=>{
  const element=board.current;if(!element)return;
  let frame=0;
  const measure=()=>{
   const parent=element.getBoundingClientRect();if(!parent.width)return;
   const edges:Connector[]=[];
   track.nodes.slice(1).forEach((node,index)=>{
    const previous=track.nodes[index];const from=nodes.current.get(previous.id);const to=nodes.current.get(node.id);if(!from||!to)return;
    const a=from.getBoundingClientRect(),b=to.getBoundingClientRect();
    const sameRow=Math.abs(a.top-b.top)<4;
    const sx=(sameRow?a.right:a.left+a.width/2)-parent.left;
    const sy=(sameRow?a.top+a.height/2:a.bottom)-parent.top;
    const tx=(sameRow?b.left:b.left+b.width/2)-parent.left;
    const ty=(sameRow?b.top+b.height/2:b.top)-parent.top;
    const middle=(sy+ty)/2;
    edges.push({id:`${previous.id}-${node.id}`,from:previous.id,to:node.id,path:sameRow?`M${sx},${sy} L${tx-5},${ty}`:`M${sx},${sy} V${middle} H${tx} V${ty-5}`});
   });
   setGeometry({width:parent.width,height:parent.height,edges});
  };
  const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure);};
  const observer=new ResizeObserver(schedule);observer.observe(element);nodes.current.forEach(node=>observer.observe(node));schedule();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();};
 },[track]);
 if(!active)return null;
 return <div className="gut-flow-track" data-gut-track={track.id}>
  <h5>{track.title}</h5>
  <div className="gut-flow-board" ref={board}>
   <svg className="gut-flow-arrows" viewBox={`0 0 ${geometry.width} ${geometry.height}`} width="100%" height="100%" aria-hidden="true">
    <defs><marker id={`${uid}-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" fill={edgeColor}/></marker></defs>
    {geometry.edges.map(edge=><g key={edge.id}><path data-gut-edge={edge.id} data-from={edge.from} data-to={edge.to} d={edge.path} fill="none" stroke={edgeColor} strokeWidth="2.5" strokeLinejoin="round" markerEnd={`url(#${uid}-arrow)`}/>{running&&<circle r="3.5" fill={particleColor}><animateMotion path={edge.path} dur="3.8s" repeatCount="indefinite"/></circle>}</g>)}
   </svg>
   {track.nodes.map((node,index)=><button ref={element=>{if(element)nodes.current.set(node.id,element);else nodes.current.delete(node.id);}} type="button" className="gut-flow-node" key={node.id} data-gut-node={node.id} aria-pressed={active.id===node.id} aria-controls={`${uid}-detail`} onClick={()=>setSelected(node.id)}><span className="gut-node-number">{String(index+1).padStart(2,'0')}</span><strong>{node.label}</strong>{node.cofactor&&<span className="gut-node-cofactor">{node.cofactor}</span>}</button>)}
  </div>
  <div id={`${uid}-detail`} className="gut-node-detail" aria-live="polite"><strong>{active.label}</strong><p>{active.detail}</p></div>
 </div>;
}

export default function GutBrainImmunityMasterInteractive({showProducts=true,onProducts,showGallery=true}:{showProducts?:boolean;onProducts?:(ids:string[])=>void;showGallery?:boolean}){
 const uid=useId().replace(/:/g,'');
 const root=useRef<HTMLElement>(null);const distalRef=useRef<HTMLElement>(null);
 const [mode,setMode]=useState<Mode>('support');const [layer,setLayer]=useState<Layer>('junctions');
 const [paused,setPaused]=useState(false);const [reduced,setReduced]=useState(true);const [visible,setVisible]=useState(false);const [pageVisible,setPageVisible]=useState(true);
 const [axisIndex,setAxisIndex]=useState(0);const [axisTrack,setAxisTrack]=useState(0);const [distalIndex,setDistalIndex]=useState(0);const [distalTrack,setDistalTrack]=useState(1);const [stepIndex,setStepIndex]=useState(0);
 const [caseOpen,setCaseOpen]=useState(false);const [galleryOpen,setGalleryOpen]=useState(false);const [pageIndex,setPageIndex]=useState(0);const [lightbox,setLightbox]=useState(false);
 const axis=gutDominoAxes[axisIndex];const distal=gutDistalPathways[distalIndex];const step=gutRepairSteps[stepIndex];
 const layerData=gutBarrierLayers.find(item=>item.id===layer)!;
 const page=sourceDeck.pages[pageIndex];
 const motion=reduced?'reduced':paused?'paused':!visible||!pageVisible?'offscreen':'running';const running=motion==='running';
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);
  const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.01});if(root.current)observer.observe(root.current);
  const onVisibility=()=>setPageVisible(!document.hidden);document.addEventListener('visibilitychange',onVisibility);onVisibility();
  return()=>{media.removeEventListener('change',update);observer.disconnect();document.removeEventListener('visibilitychange',onVisibility);};
 },[]);
 function preferredDistalTrack(index:number,nextMode:Mode){
  const id=gutDistalPathways[index].id==='brain'?(nextMode==='stress'?'brain-kynurenine':'brain-serotonin'):(nextMode==='stress'?'muscle-breakdown':'muscle-synthesis');
  return Math.max(0,gutDistalPathways[index].tracks.findIndex(track=>track.id===id));
 }
 function changeMode(nextMode:Mode){setMode(nextMode);setDistalTrack(preferredDistalTrack(distalIndex,nextMode));}
 function products(ids:readonly string[],scope:string){
  if(!showProducts||!ids.length)return null;
  return <div className="gut-products" aria-label="相關營養原料與產品"><span>認識相關原料</span><div>{ids.map(id=>{const product=productById.get(id);return product?<button key={`${scope}-${id}`} type="button" data-gut-product={id} onClick={()=>onProducts?.([id])} disabled={!onProducts}><MapPin size={19}/>{product.name}</button>:null;})}</div></div>;
 }
 const narration=`腸道，是身體與外界接觸的一道屏障。${gutBrainModes[mode].summary}。${layerData.title}。${layerData.detail}`;
 return <section ref={root} className="gut-brain-master" aria-label="腦腸軸與免疫老化互動圖" data-gut-mode={mode} data-gut-motion={motion}>
  <header className="gut-master-heading"><div className="gut-eyebrow"><ShieldCheck size={20}/>從腸道，看見全身</div><h3>一層屏障，牽動大腦與免疫</h3><p>先看腸壁，再沿訊號走向細胞、大腦與肌肉。</p></header>
  <div className="gut-toolbar"><div className="gut-mode-buttons" role="group" aria-label="切換腸道示意狀態">{(['stress','support'] as const).map(value=><button key={value} type="button" data-gut-state={value} aria-pressed={mode===value} onClick={()=>changeMode(value)}>{value==='stress'?<ArrowDownRight size={22}/>:<Sprout size={22}/>}<span>{gutBrainModes[value].label}</span></button>)}</div><div className="gut-motion-tools"><button type="button" data-gut-pause aria-pressed={paused} disabled={reduced} onClick={()=>setPaused(value=>!value)}>{paused?<Play size={19}/>:<Pause size={19}/>}<span>{reduced?'遵循減少動態':paused?'繼續動畫':'暫停動畫'}</span></button><VoiceGuide text={narration} label="聽腦腸軸導讀"/></div></div>
  <div className="gut-kpis" aria-label="健康壽命與腸道面積的研究數字">{gutBrainKpis.map(kpi=><article className="gut-kpi" key={kpi.id} data-gut-kpi={kpi.id}><strong>{kpi.value}</strong><h4>{kpi.label}</h4><details><summary>統計背景與來源</summary><p className="gut-kpi-context">{kpi.context}</p>{kpi.url?<a href={kpi.url} target="_blank" rel="noopener noreferrer">{kpi.source} ↗</a>:<p>{kpi.source}</p>}</details></article>)}</div>
  <section className="gut-barrier-panel" aria-label="腸道三層屏障"><GutBarrierScene mode={mode} running={running} selectedLayer={layer} onSelectLayer={setLayer}/><p className="gut-mode-summary" aria-live="polite">{gutBrainModes[mode].summary}</p><div className="gut-layer-detail" id={`${uid}-layer-detail`} aria-live="polite"><strong>{layerData.title}</strong><p>{layerData.detail}</p></div></section>
  <section className="gut-domino-section" aria-labelledby={`${uid}-domino-heading`}><header className="gut-section-heading"><span>01 / 細胞裡的連鎖反應</span><h4 id={`${uid}-domino-heading`}>點一張，走進一條機轉</h4></header><div className="gut-axis-buttons" role="group" aria-label="四組發炎與老化機轉">{gutDominoAxes.map((item,index)=><button key={item.id} type="button" data-gut-axis={item.id} style={{animationDelay:`${index*.75}s`}} aria-pressed={axisIndex===index} aria-controls={`${uid}-axis-detail`} onClick={()=>{setAxisIndex(index);setAxisTrack(0);}}><span className="gut-choice-number">0{index+1}</span><strong>{item.title}</strong><span>{item.metaphor}</span></button>)}</div><div className="gut-axis-panel" id={`${uid}-axis-detail`}><h4>{axis.title}</h4><p>{axis.detail}</p>{axis.tracks.length>1&&<div className="gut-track-tabs" role="group" aria-label={`${axis.title}的獨立分支`}>{axis.tracks.map((track,index)=><button key={track.id} type="button" data-gut-axis-track={track.id} aria-pressed={axisTrack===index} onClick={()=>setAxisTrack(index)}>{track.title}</button>)}</div>}{axis.tracks[axisTrack]&&<FlowTrack key={axis.tracks[axisTrack].id} track={axis.tracks[axisTrack]} running={running} mode={mode}/>}<div className="gut-axis-end">{products(axis.productIds,axis.id)}{axisIndex===3&&<button type="button" className="gut-go-distal" onClick={()=>distalRef.current?.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'})}><Brain size={22}/>接著看大腦與肌肉 <ArrowDownRight size={20}/></button>}</div></div></section>
  <section ref={distalRef} className="gut-distal-section" aria-labelledby={`${uid}-distal-heading`}><header className="gut-section-heading"><span>02 / 遠端器官</span><h4 id={`${uid}-distal-heading`}>同一張網，兩個觀察方向</h4></header><div className="gut-distal-tabs" role="group" aria-label="選擇遠端器官">{gutDistalPathways.map((item,index)=><button key={item.id} type="button" data-gut-distal={item.id} aria-pressed={distalIndex===index} onClick={()=>{setDistalIndex(index);setDistalTrack(preferredDistalTrack(index,mode));}}>{item.id==='brain'?<Brain size={24}/>:<Sprout size={24}/>}<span>{item.title}</span></button>)}</div><div className="gut-distal-panel"><h4>{distal.title}</h4><p>{distal.intro}</p><div className="gut-track-tabs" role="group" aria-label={`${distal.title}的平行路徑`}>{distal.tracks.map((track,index)=><button key={track.id} type="button" data-gut-distal-track={track.id} aria-pressed={distalTrack===index} onClick={()=>setDistalTrack(index)}>{track.title}</button>)}</div>{distal.tracks[distalTrack]&&<FlowTrack key={distal.tracks[distalTrack].id} track={distal.tracks[distalTrack]} running={running} mode={mode}/>}<p className="gut-branch-caption">模式切換會帶您比較不同機轉分支，也能自行點選。箭頭呈現所選路徑的訊號或反應關係。</p>{products(distal.productIds,distal.id)}</div></section>
  <section className="gut-repair-section" aria-labelledby={`${uid}-repair-heading`}><header className="gut-section-heading"><span>03 / 把照護帶回生活</span><h4 id={`${uid}-repair-heading`}>5R，一次看懂一步</h4></header><div className="gut-repair-steps" role="group" aria-label="腸道照護五步驟">{gutRepairSteps.map((item,index)=><button key={item.id} type="button" data-gut-step={item.id} aria-pressed={stepIndex===index} aria-controls={`${uid}-repair-detail`} onClick={()=>setStepIndex(index)}><span>0{index+1}</span><strong>{item.title}</strong></button>)}</div><div className="gut-repair-detail" id={`${uid}-repair-detail`}><span className="gut-step-overline">第 {stepIndex+1} 步 / 共 5 步</span><h4>{step.title}</h4><p className="gut-repair-intro">{step.intro}</p><p>{step.detail}</p>{products(step.productIds,step.id)}</div></section>
  <details className="gut-case-panel" onToggle={event=>setCaseOpen(event.currentTarget.open)}><summary><span>04 / 個案觀察</span><strong>{gutCaseStudy.title}</strong></summary>{caseOpen&&<div className="gut-case-body" data-gut-case><p className="gut-case-duration">追蹤期間：{gutCaseStudy.duration}</p><p className="gut-case-context">{gutCaseStudy.context}</p><div className="gut-case-measurements">{gutCaseStudy.measurements.map(item=>{const maximum=Math.max(item.before,item.after,1);return <article key={item.id} data-gut-measurement={item.id}><h5>{item.label}</h5><div className="gut-case-bar-row"><span>起始</span><div className="gut-case-bar-track"><i style={{width:`${item.before/maximum*100}%`}} data-gut-animate={running}/></div><strong>{item.before.toLocaleString('zh-TW')} <small>{item.unit}</small></strong></div><div className="gut-case-bar-row is-followup"><span>追蹤</span><div className="gut-case-bar-track"><i style={{width:`${item.after/maximum*100}%`}} data-gut-animate={running}/></div><strong>{item.afterLabel??item.after.toLocaleString('zh-TW')} <small>{item.unit}</small></strong></div><p>{item.note}</p></article>;})}</div><h4 className="gut-case-age-heading">演算法估計年齡的變化</h4><div className="gut-case-ages">{gutCaseStudy.ages.map(item=><article key={item.id}><h5>{item.label}</h5><strong>{item.change>0?'+':''}{item.change} <small>{item.unit}</small></strong><p>{item.note}</p></article>)}</div><p className="gut-case-source">個案紀錄出處：原始講義第 {gutCaseStudy.sourcePages.join('、')} 頁。</p></div>}</details>
  {showGallery&&<details className="gut-source-gallery" onToggle={event=>setGalleryOpen(event.currentTarget.open)}><summary><span>05 / 圖解資料室</span><strong>展開全部 {sourceDeck.pages.length} 張來源圖解</strong></summary>{galleryOpen&&<div className="gut-gallery-body"><div className="gut-gallery-filmstrip" aria-label="全部腦腸軸來源圖解">{sourceDeck.pages.map((item,index)=><button key={item.id} type="button" data-gut-page={item.id} aria-pressed={pageIndex===index} onClick={()=>setPageIndex(index)} aria-label={`來源第 ${item.pageNumber} 頁：${item.title}`}><img src={sitePath(item.image)} width={item.width} height={item.height} alt="" loading="lazy"/><span>來源第 {item.pageNumber} 頁</span></button>)}</div><div className="gut-gallery-stage"><PdfVisual key={page.id} page={page}/></div><div className="gut-gallery-controls"><button type="button" disabled={pageIndex===0} aria-label="上一張腦腸軸圖解" onClick={()=>setPageIndex(value=>Math.max(0,value-1))}><ChevronLeft/></button><div aria-live="polite"><strong>{page.title}</strong><span>{pageIndex+1} / {sourceDeck.pages.length} · 來源第 {page.pageNumber} 頁</span></div><button type="button" disabled={pageIndex===sourceDeck.pages.length-1} aria-label="下一張腦腸軸圖解" onClick={()=>setPageIndex(value=>Math.min(sourceDeck.pages.length-1,value+1))}><ChevronRight/></button></div><div className="gut-gallery-tools"><button type="button" onClick={()=>setLightbox(true)}><Maximize2 size={20}/>放大腦腸軸原圖</button><VoiceGuide key={`voice-${page.id}`} text={`${page.title}。${page.caption}`} label="聽這張圖解"/></div><p className="gut-gallery-caption">{page.caption}</p></div>}</details>}
  <details className="gut-science-sources"><summary>閱讀機轉與數字的科學來源</summary><ul>{gutBrainSources.map((source,index)=><li key={`${source.label}-${index}`}>{source.url?<a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>:source.label}</li>)}</ul></details>
  {lightbox&&<VisualLightbox page={page} onClose={()=>setLightbox(false)}/>}
 </section>;
}
