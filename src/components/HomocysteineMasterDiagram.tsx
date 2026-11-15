'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {Pause,Play,MapPin,Brain,BatteryCharging,Leaf,Lightbulb,Heart} from 'lucide-react';
import {homocysteineNodes,homocysteineModes,vascularStages,homocysteineBenefits,homocysteineTests,homocysteineCofactors,homocysteineSources,type HomocysteineNodeId} from '@/data/homocysteine';
import {productById} from '@/data/uvaco-products';
import VoiceGuide from './VoiceGuide';

type Mode=keyof typeof homocysteineModes;
type Box={x:number;y:number;width:number;height:number};
type Edge={id:string;from:string;to:string;d:string;kind:'main'|'reaction-route'|'transsulfuration'|'backpressure'|'vascular';color:string;moving:boolean};
const nodes=new Map(homocysteineNodes.map(node=>[node.id,node]));
const MAIN:HomocysteineNodeId[]=['methionine','sam','sah','hcy'];
const TRANS:HomocysteineNodeId[]=['cystathionine','cysteine','gsh'];
const shortNames:Record<string,string>={'995':'995','360':'360 計劃',antrodia:'樟芝益','antrodia-drops':'樟芝滴粒',kangyue:'康悅兒',kangbei:'康貝寧',huoyi:'活逸康',dikang:'迪康',lisheng:'力盛'};

export default function HomocysteineMasterDiagram({showProducts=true,onProducts}:{showProducts?:boolean;onProducts?:(ids:string[])=>void}){
 const uid=useId().replace(/:/g,'');
 const [mode,setMode]=useState<Mode>('recycling');const [selected,setSelected]=useState<HomocysteineNodeId>('hcy');
 const [paused,setPaused]=useState(false);const [reduced,setReduced]=useState(true);const [visible,setVisible]=useState(false);const [pageVisible,setPageVisible]=useState(true);
 const [benefit,setBenefit]=useState(0);const [edges,setEdges]=useState<Edge[]>([]);const [size,setSize]=useState({width:1,height:1});
 const root=useRef<HTMLElement>(null);const board=useRef<HTMLDivElement>(null);const locations=useRef(new Map<string,HTMLElement>());
 const active=nodes.get(selected)!;
 const motion=reduced?'reduced':paused?'paused':!visible||!pageVisible?'offscreen':'running';
 const running=motion==='running';
 const register=(id:string)=>(el:HTMLElement|null)=>{if(el)locations.current.set(id,el);else locations.current.delete(id);};
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.01});if(root.current)observer.observe(root.current);const change=()=>setPageVisible(!document.hidden);document.addEventListener('visibilitychange',change);change();return()=>{media.removeEventListener('change',update);observer.disconnect();document.removeEventListener('visibilitychange',change);};},[]);
 useEffect(()=>{
  const element=board.current;if(!element)return;
  let raf=0;
  function measure(){
   const rect=element!.getBoundingClientRect();if(!rect.width||!rect.height)return;
   const boxes=new Map<string,Box>();locations.current.forEach((el,id)=>{const b=el.getBoundingClientRect();boxes.set(id,{x:b.x-rect.x,y:b.y-rect.y,width:b.width,height:b.height});});
   const get=(id:string)=>boxes.get(id)!;
   if([...MAIN,...TRANS,'folate','betaine','vascular-0'].some(id=>!boxes.has(id)))return;
   const center=(b:Box)=>({x:b.x+b.width/2,y:b.y+b.height/2});
   const result:Edge[]=[];const normal=mode==='recycling';
   const add=(id:string,from:string,to:string,d:string,kind:Edge['kind'],color:string,moving:boolean)=>result.push({id,from,to,d,kind,color,moving});
   const direct=(from:string,to:string,shift=0)=>{const a=get(from),b=get(to),ac=center(a),bc=center(b);if(Math.abs(ac.y-bc.y)<Math.min(a.height,b.height)*.3){const right=bc.x>ac.x;const sx=right?a.x+a.width:a.x,tx=right?b.x:b.x+b.width;return `M${sx},${ac.y+shift} L${tx},${bc.y+shift}`;}const down=bc.y>ac.y;const sy=down?a.y+a.height:a.y,ty=down?b.y:b.y+b.height;const middle=(sy+ty)/2;return `M${ac.x+shift},${sy} C${ac.x+shift},${middle} ${bc.x+shift},${middle} ${bc.x+shift},${ty}`;};
   add('methionine-sam','methionine','sam',direct('methionine','sam'),'main',normal?'#1B7255':'#718373',normal);
   add('sam-sah','sam','sah',direct('sam','sah'),'main',normal?'#A66D22':'#718373',normal);
   add('sah-hcy','sah','hcy',direct('sah','hcy',-8),'main',normal?'#1B7255':'#9E4E43',normal);
   add('hcy-sah','hcy','sah',direct('hcy','sah',8),'backpressure',normal?'#9D91AB':'#75518E',!normal);
   const h=get('hcy'),hc=center(h),met=get('methionine'),mc=center(met);
   const mainBottom=Math.max(...MAIN.map(id=>{const b=get(id);return b.y+b.height;}));
   const gutter=Math.max(8,Math.min(...MAIN.map(id=>get(id).x))-28);
   for(const [i,id] of ['folate','betaine'].entries()){
    const b=get(id),bc=center(b),channel=gutter+18+i*9;
    const input=`M${hc.x},${h.y+h.height} V${mainBottom+18+i*10} H${channel} V${bc.y-15} H${b.x}`;
    add(`hcy-${id}`,'hcy',id,input,'reaction-route',normal?'#286D78':'#A2AEA0',normal);
    const back=gutter+i*9;
    const output=`M${b.x},${bc.y+15} H${back} V${mc.y+(i?16:-16)} H${met.x}`;
    add(`${id}-methionine`,id,'methionine',output,'reaction-route',normal?'#286D78':'#A2AEA0',normal);
   }
   const c=get('cystathionine'),cc=center(c);const right=Math.max(...[...MAIN,...TRANS].map(id=>{const b=get(id);return b.x+b.width;}))+20;
   add('hcy-cystathionine','hcy','cystathionine',`M${hc.x},${h.y+h.height} V${mainBottom+18} H${right} V${cc.y} H${c.x+c.width}`,'transsulfuration',normal?'#B27624':'#A2AEA0',normal);
   add('cystathionine-cysteine','cystathionine','cysteine',direct('cystathionine','cysteine'),'transsulfuration',normal?'#B27624':'#A2AEA0',normal);
   add('cysteine-gsh','cysteine','gsh',direct('cysteine','gsh'),'transsulfuration',normal?'#1B7255':'#A2AEA0',normal);
   const v=get('vascular-0'),vc=center(v);
   const vascularPath=v.x>h.x+h.width?`M${h.x+h.width},${hc.y} H${v.x-18} V${vc.y} H${v.x}`:`M${hc.x},${h.y+h.height} V${mainBottom+18} H${rect.width-8} V${vc.y} H${v.x+v.width}`;
   add('hcy-vascular','hcy','vascular-0',vascularPath,'vascular',normal?'#C5A59B':'#B44A3C',!normal);
   vascularStages.slice(1).forEach((_,i)=>add(`vascular-${i}-${i+1}`,`vascular-${i}`,`vascular-${i+1}`,direct(`vascular-${i}`,`vascular-${i+1}`),'vascular',normal?'#C5A59B':'#B44A3C',!normal));
   setSize({width:rect.width,height:rect.height});setEdges(result);
  }
  const schedule=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(measure);};
  const observer=new ResizeObserver(schedule);observer.observe(element);locations.current.forEach(el=>observer.observe(el));schedule();
  return()=>{cancelAnimationFrame(raf);observer.disconnect();};
 },[mode,showProducts]);
 function productBadges(ids:string[],scope:string){
  if(!showProducts||!ids.length)return null;
  return <div className="hcy-product-badges" aria-label="認識相關原料">{ids.map(id=><button key={`${scope}-${id}`} type="button" data-hcy-product={id} onClick={()=>onProducts?.([id])} disabled={!onProducts} aria-label={`認識${productById.get(id)?.name||shortNames[id]}原料`}><MapPin size={17}/>{shortNames[id]||productById.get(id)?.name}</button>)}</div>;
 }
 function node(id:HomocysteineNodeId){const n=nodes.get(id)!;return <article key={id} ref={register(id)} data-hcy-node={id} data-node-kind={id==='folate'||id==='betaine'?'reaction-station':'metabolite'} className={`hcy-node hcy-node-${id}${selected===id?' is-selected':''}`}>
   <button type="button" className="hcy-node-select" aria-pressed={selected===id} aria-controls={`${uid}-detail`} onClick={()=>setSelected(id)}><span className="hcy-node-abbreviation">{n.abbreviation}</span><strong>{n.label}</strong><span>{n.summary}</span></button>
   {n.cofactor&&<p className="hcy-cofactor">{n.cofactor}</p>}
   {id==='hcy'&&<div className="hcy-congestion" aria-hidden="true"><i/><i/><i/><i/><i/></div>}
   {productBadges(n.productIds,id)}
  </article>;}
 const narration=`同半胱胺酸，連起甲基循環與心血管。${homocysteineModes[mode].summary}。現在看${active.label}。${active.detail}`;
 return <section ref={root} className="homocysteine-master" aria-label="同半胱胺酸雙路徑回收圖" data-hcy-mode={mode} data-hcy-motion={motion}>
  <header className="hcy-title"><h3>同半胱胺酸，走哪條路？</h3><p className="hcy-lead">回收甲硫胺酸，或轉成抗氧化原料。{showProducts&&<span className="hcy-products-context">綠色按鈕：原料對照</span>}</p></header>
  <div className="hcy-toolbar"><div className="hcy-mode-control" role="group" aria-label="選擇代謝示意狀態">{(['blocked','recycling'] as Mode[]).map(value=><button key={value} type="button" data-hcy-state={value} aria-pressed={mode===value} onClick={()=>setMode(value)}>{homocysteineModes[value].label}</button>)}</div>
  <div className="hcy-tools"><button type="button" data-hcy-pause aria-pressed={paused} disabled={reduced} onClick={()=>setPaused(v=>!v)}>{paused?<Play size={20}/>:<Pause size={20}/>}<span>{reduced?'遵循減少動態':paused?'繼續動畫':'暫停動畫'}</span></button><VoiceGuide text={narration} label="聽雙路徑導讀"/></div></div>
  <div ref={board} className="hcy-board">
   <svg className="hcy-connectors" width="100%" height="100%" viewBox={`0 0 ${size.width} ${size.height}`} aria-hidden="true"><defs>{edges.map(edge=><marker key={edge.id} id={`${uid}-${edge.id}`} markerWidth="7" markerHeight="7" refX="7" refY="3.5" orient="auto" viewBox="0 0 8 7"><path d="M0 0 8 3.5 0 7Z" fill={edge.color}/></marker>)}</defs>
    {edges.map(edge=><g key={edge.id}><path data-hcy-edge={edge.id} data-from={edge.from} data-to={edge.to} data-edge-kind={edge.kind} d={edge.d} stroke={edge.color} strokeWidth={edge.moving?3:2} strokeLinejoin="round" fill="none" markerEnd={`url(#${uid}-${edge.id})`}/>{running&&edge.moving&&[0,1,2].map(i=><circle key={`${mode}-${i}`} r={edge.kind==='backpressure'?4.5:3.5} fill={edge.kind==='backpressure'?'#C65341':edge.color} className="hcy-flow-particle" style={{color:edge.color}}><animateMotion path={edge.d} dur={`${edge.kind==='backpressure'?2.8:4.8}s`} begin={`${-i*1.6}s`} repeatCount="indefinite"/></circle>)}</g>)}
   </svg>
   <div className="hcy-physiology">
    <div className="hcy-mainline" aria-label="甲硫胺酸與甲基化主幹">{MAIN.map(node)}</div>
    <aside className="hcy-sah-signal"><strong>SAH 累積，會影響甲基交付</strong><p>SAH 與同半胱胺酸的可逆反應也受腺苷影響。SAH 累積時，可抑制多種甲基轉移酵素。</p></aside>
    <div className="hcy-branches">
     <section className="hcy-recycling-branch" aria-label="再甲基化兩條平行回收站"><header><span>路徑 1</span><h4>再甲基化</h4><p>兩條平行支路，回到甲硫胺酸。</p></header>{node('folate')}{node('betaine')}<p className="hcy-return-label">回收甲硫胺酸 → 再製造 SAM</p></section>
     <section className="hcy-trans-branch" aria-label="轉硫化與穀胱甘肽合成"><header><span>路徑 2</span><h4>轉硫化</h4><p>在 B6 協助下，接力合成抗氧化原料。</p></header>{TRANS.map(node)}</section>
    </div>
   </div>
   <aside className="hcy-vascular" aria-label="血管相關研究的四個環節"><header><span>血管風險研究</span><h4>四個互相影響的環節</h4><p>從舒張訊號，看到氧化、發炎與凝血。</p></header><ol>{vascularStages.map((stage,i)=><li key={stage.id} ref={register(`vascular-${i}`)} data-hcy-vascular={stage.id}><h5>{stage.title}</h5><p>{stage.text}</p>{productBadges(stage.productIds,stage.id)}</li>)}</ol><p className="hcy-vascular-foot">臨床一起評估心血管、腦血管與周邊血管健康。</p></aside>
  </div>
  <p className="hcy-mode-summary" aria-live="polite">{homocysteineModes[mode].summary}</p>
  <div id={`${uid}-detail`} className="hcy-node-detail" aria-live="polite" aria-atomic="true"><p>點選節點，讀懂這一步</p><h4>{active.abbreviation} · {active.label}</h4><p>{active.detail}</p></div>
  <section className="hcy-benefits" aria-label="大腦與全身的五種生理分工"><h4>這些路徑如何支援大腦與全身？</h4><div className="hcy-benefit-grid">{homocysteineBenefits.map((item,i)=>{const Icon=[Brain,BatteryCharging,Leaf,Lightbulb,Heart][i];return <div key={item.id}><button type="button" data-hcy-benefit={item.id} aria-pressed={benefit===i} onClick={()=>setBenefit(i)}><Icon size={25}/><strong>{item.title.replace(/^[^\u4e00-\u9fffA-Za-z0-9]+/u,'')}</strong></button>{productBadges(item.productIds,item.id)}</div>;})}</div><p className="hcy-benefit-detail" aria-live="polite">{homocysteineBenefits[benefit].text}</p></section>
  <details className="hcy-clinical"><summary>臨床評估指標與關鍵輔因子</summary><div className="hcy-clinical-columns"><section><h4>檢測結果，要一起閱讀</h4><dl>{homocysteineTests.map(test=><div key={test.name}><dt>{test.name}</dt><dd>{test.detail}</dd></div>)}</dl></section><section><h4>五組營養與輔因子</h4><dl>{homocysteineCofactors.map(item=><div key={item.name}><dt>{item.name}</dt><dd>{item.detail}</dd></div>)}</dl></section></div><ul className="hcy-sources">{homocysteineSources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a></li>)}</ul></details>
 </section>;
}
