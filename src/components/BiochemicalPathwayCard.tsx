'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,MapPin,Maximize2} from 'lucide-react';
import {pathwayById,type PathwayId,type BiochemicalPathway} from '@/data/biochemical-pathways';
import {productById} from '@/data/uvaco-products';
import {visualPageById,type VisualPage} from '@/data/visual-assets-manifest';
import VisualLightbox from './VisualLightbox';
import VoiceGuide from './VoiceGuide';

type Props={pathwayIds:PathwayId[];showProducts?:boolean;onProducts?:(ids:string[])=>void;productId?:string};
export default function BiochemicalPathwayCard({pathwayIds,showProducts=false,onProducts,productId}:Props){
 const valid=pathwayIds.filter(id=>pathwayById.has(id));
 const [selected,setSelected]=useState<PathwayId|undefined>(valid[0]);
 const pathway=pathwayById.get(selected&&valid.includes(selected)?selected:valid[0]);
 if(!pathway)return null;
 return <section className="biochemical-pathway-card" aria-label="生化合成與代謝路徑" data-pathway={pathway.id}>
  {valid.length>1&&<label className="pathway-picker">選一條路徑，慢慢看<select value={pathway.id} onChange={e=>setSelected(e.target.value as PathwayId)}>{valid.map(id=><option key={id} value={id}>{pathwayById.get(id)!.title}</option>)}</select></label>}
  <PathwayContent key={`${pathway.id}-${productId||''}`} pathway={pathway} showProducts={showProducts} onProducts={onProducts} productId={productId}/>
 </section>;
}
function PathwayContent({pathway,showProducts,onProducts,productId}:{pathway:BiochemicalPathway;showProducts:boolean;onProducts?:Props['onProducts'];productId?:string}){
 const uid=useId().replace(/:/g,'');
 const [laneIndex,setLaneIndex]=useState(()=>Math.max(0,pathway.lanes.findIndex(lane=>lane.nodes.some(node=>pathway.products.some(link=>link.productId===productId&&link.nodeIds.includes(node.id))))));
 const lane=pathway.lanes[laneIndex]||pathway.lanes[0];
 const [nodeId,setNodeId]=useState(()=>lane.nodes.find(node=>pathway.products.some(link=>link.productId===productId&&link.nodeIds.includes(node.id)))?.id||lane.nodes[0].id);
 const active=lane.nodes.find(node=>node.id===nodeId)||lane.nodes[0];
 const index=lane.nodes.findIndex(node=>node.id===active.id);
 const [columns,setColumns]=useState(2);
 const frame=useRef<HTMLDivElement>(null);
 const [expanded,setExpanded]=useState<VisualPage|null>(null);
 const sourcePages=pathway.sourcePageIds.map(id=>visualPageById.get(id)).filter((p):p is VisualPage=>!!p&&(showProducts||(p.deckId.startsWith('longevity-')&&p.id!=='longevity-2-004'&&p.productIds.length===0)));
 const [sourceIndex,setSourceIndex]=useState(0);
 const activeLinks=showProducts?pathway.products.filter(link=>link.nodeIds.includes(active.id)):[];
 const relatedIds=[...new Set(pathway.products.map(link=>link.productId))];
 const width=columns*260,height=Math.ceil(lane.nodes.length/columns)*190+20;
 const point=(i:number)=>{const row=Math.floor(i/columns),col=row%2?columns-1-i%columns:i%columns;return {x:col*260+15,y:row*190+16};};
 useEffect(()=>{const element=frame.current;if(!element)return;const observer=new ResizeObserver(([entry])=>setColumns(entry.contentRect.width>=760?3:entry.contentRect.width>=470?2:1));observer.observe(element);return()=>observer.disconnect();},[]);
 function chooseNode(id:string,focus=false){setNodeId(id);requestAnimationFrame(()=>{const button=frame.current?.querySelector<HTMLButtonElement>(`[data-node="${id}"]`);button?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});if(focus)button?.focus({preventScroll:true});});}
 const narration=`${pathway.title}。${pathway.metaphor}。${pathway.summary}。${lane.title}。${lane.nodes.map(node=>`${node.label}。${node.via||''}。${node.detail}`).join('。')}${showProducts?'。原料對照。'+activeLinks.map(link=>`${productById.get(link.productId)?.name}。${link.ingredient}。${link.connection}`).join('。'):''}`;
 return <>
  <header className="pathway-heading"><h4>{pathway.title}</h4></header>
  <div className="pathway-lanes" role="group" aria-label="選擇代謝分流">{pathway.lanes.map((item,i)=><button key={item.id} aria-pressed={laneIndex===i} onClick={()=>{setLaneIndex(i);setNodeId(item.nodes[0].id);frame.current?.scrollTo({top:0});}}>{item.title}</button>)}</div>
  <div ref={frame} className="pathway-diagram-frame" onKeyDown={e=>{if(!['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?lane.nodes.length-1:Math.max(0,Math.min(lane.nodes.length-1,index+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)));chooseNode(lane.nodes[next].id,true);}}>
   <svg className="pathway-flow-svg" viewBox={`0 0 ${width} ${height}`} aria-label={`${lane.title}：${lane.nodes.map(n=>n.label).join('，接著是')}`}>
    <defs><marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="#A66D22"/></marker></defs>
    {lane.nodes.slice(1).map((node,i)=>{const a=point(i),b=point(i+1);const same=a.y===b.y;const d=same?(b.x>a.x?`M${a.x+230} ${a.y+70} H${b.x-4}`:`M${a.x} ${a.y+70} H${b.x+234}`):`M${a.x+115} ${a.y+150} V${b.y-6}`;return <path key={node.id} d={d} stroke="#A66D22" strokeWidth="2.5" fill="none" markerEnd={`url(#${uid}-arrow)`}/>;})}
    {lane.nodes.map((node,i)=>{const p=point(i),links=showProducts?pathway.products.filter(link=>link.nodeIds.includes(node.id)):[];return <foreignObject key={node.id} x={p.x} y={p.y} width="230" height="150"><button className="pathway-node" data-node={node.id} aria-pressed={active.id===node.id} onClick={()=>setNodeId(node.id)} aria-label={`步驟 ${i+1}：${node.label}`}><span className="pathway-node-number">{i+1}</span><strong>{node.label}</strong>{node.via&&<span className="pathway-node-via">{node.via}</span>}{links.length>0&&<span className="pathway-node-products">{links.map(link=>productById.get(link.productId)?.name).join(' · ')}</span>}</button></foreignObject>;})}
   </svg>
  </div>
  <nav className="pathway-step-controls" aria-label="路徑步驟"><button aria-label="上一個路徑步驟" disabled={index===0} onClick={()=>chooseNode(lane.nodes[index-1].id)}><ArrowLeft size={20}/></button><span>點選節點看分工 · {index+1} / {lane.nodes.length}</span><button aria-label="下一個路徑步驟" disabled={index===lane.nodes.length-1} onClick={()=>chooseNode(lane.nodes[index+1].id)}><ArrowRight size={20}/></button></nav>
  <p className="pathway-metaphor">{pathway.metaphor}</p>
  <div className="pathway-node-explanation" aria-live="polite" aria-atomic="true"><h5>{active.label}</h5>{active.via&&<p className="pathway-reaction">反應／調節：{active.via}</p>}<p>{active.detail}</p>{activeLinks.length>0&&<div className="pathway-product-links">{activeLinks.map(link=><div key={link.productId} data-product-link={link.productId}><button onClick={()=>onProducts?.([link.productId])} disabled={!onProducts}><MapPin size={18}/>{productById.get(link.productId)?.name}</button><p><strong>{link.ingredient}</strong> · {link.connection}</p><small>{link.evidence}</small></div>)}</div>}</div>
  <details className="pathway-reading"><summary>把整條路徑接起來</summary><p>{pathway.summary}</p><ol>{lane.nodes.map(node=><li key={node.id}><strong>{node.label}</strong>：{node.detail}</li>)}</ol>{pathway.references.length>0&&<ul className="pathway-references">{pathway.references.map((ref,i)=><li key={i}>{ref.url?<a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.label} ↗</a>:ref.label}</li>)}</ul>}</details>
  {sourcePages.length>1&&<label className="pathway-source-picker">對照科學圖解<select value={sourceIndex} onChange={e=>setSourceIndex(Number(e.target.value))}>{sourcePages.map((page,i)=><option key={page.id} value={i}>{page.title}</option>)}</select></label>}
  <div className="pathway-actions">{showProducts&&onProducts&&<button onClick={()=>onProducts(relatedIds)}><MapPin size={20}/>點亮相關島嶼</button>}{sourcePages.length>0&&<button onClick={()=>setExpanded(sourcePages[sourceIndex]||sourcePages[0])}><Maximize2 size={20}/>放大看圖解</button>}<VoiceGuide text={narration} label="國語語音導讀"/></div>
  {expanded&&<VisualLightbox page={expanded} onClose={()=>setExpanded(null)}/>}
 </>;
}
