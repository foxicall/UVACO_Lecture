'use client';

import {useId} from 'react';

type Layer='mucus'|'junctions'|'immune';
type Props={mode:'stress'|'support';running:boolean;selectedLayer:Layer;onSelectLayer:(id:Layer)=>void};
const layers:{id:Layer;name:string;chemistry:string}[]=[
 {id:'mucus',name:'黏液層',chemistry:'黏液與菌群'},
 {id:'junctions',name:'細胞拉鍊',chemistry:'ZO-1／Occludin'},
 {id:'immune',name:'黏膜免疫',chemistry:'sIgA／Treg'},
];
const cells=Array.from({length:9},(_,i)=>({x:45+i*96,index:i}));
const gapPositions=[231,519,711];
const lpsRoutes=gapPositions.map((x,i)=>({d:`M${x-28},${58+i*14} C${x+30},118 ${x-5},143 ${x},182 C${x+7},226 ${x-8},286 ${x},339 C${x+18},365 ${x-40},386 ${x-5},415`,x:x-28,y:58+i*14}));
const scfaRoutes=[{d:'M154,98 C160,140 150,170 179,211',x:154,y:98},{d:'M402,83 C410,138 437,158 461,214',x:402,y:83},{d:'M651,101 C635,144 650,175 660,222',x:651,y:101},{d:'M845,112 C834,156 838,179 851,216',x:845,y:112}];

/** A cross-section illustration: motion shows a physiological mechanism, not a measured treatment response. */
export default function GutBarrierScene({mode,running,selectedLayer,onSelectLayer}:Props){
 const uid=useId().replace(/:/g,'');
 const stressed=mode==='stress';
 const lipidColor=stressed?'#A84435':'#1B6B52';
 const particle=(key:string,d:string,x:number,y:number,kind:'lps'|'scfa',delay=0)=><g key={key} className={`gut-barrier-particle gut-barrier-particle-${kind}`} filter={running?`url(#${uid}-particle-glow)`:undefined} transform={running?undefined:`translate(${x} ${y})`}>
   {kind==='lps'?<use href={`#${uid}-lps`} x="-14" y="-14" width="28" height="28"/>:<><circle r="8" fill="#2F8765"/><circle cx="-2" cy="-2" r="2" fill="#DCEEDD"/></>}
   {running&&<animateMotion path={d} dur={kind==='lps'?'5.8s':'4.8s'} begin={`${-delay}s`} repeatCount="indefinite"/>}
  </g>;
 return <figure className="gut-barrier-scene" data-barrier-mode={mode} data-barrier-running={running?'true':'false'}>
  <svg className="gut-barrier-anatomy" viewBox="0 0 960 520" role="img" aria-labelledby={`${uid}-title ${uid}-description`}>
   <title id={`${uid}-title`}>{stressed?'屏障受壓時，LPS 通過細胞間隙的機制示意':'黏液、緊密連接與黏膜免疫共同維持屏障的機制示意'}</title>
   <desc id={`${uid}-description`}>上方是腸腔與黏液，中間是有刷狀緣的腸上皮細胞，下方是黏膜免疫。{stressed?'紅色 LPS 粒子經接點間隙向下移動，帶出免疫辨識訊號。':'綠色短鏈脂肪酸向上皮移動；細胞間的緊密連接形成連續屏障。'}在圖下選擇一層，閱讀它的分工。</desc>
   <defs>
    <pattern id={`${uid}-stroma`} width="74" height="44" patternUnits="userSpaceOnUse"><path d="M-10 16Q18 1 42 21T89 16M-4 38Q22 22 47 38T90 34" fill="none" stroke="#DBD8BF" strokeWidth="1.4"/></pattern>
    <symbol id={`${uid}-lps`} viewBox="-14 -14 28 28" overflow="visible"><circle r="6" fill="#B75040"/><path d="M0-6V-12M4-4 9-9M6 0H12M4 4 9 9M0 6V12M-4 4-9 9M-6 0H-12M-4-4-9-9" stroke="#B75040" strokeWidth="2.5" strokeLinecap="round"/><circle cx="-1.5" cy="-1.5" r="1.7" fill="#FDE6D5"/></symbol>
    <marker id={`${uid}-signal-arrow`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7Z" fill="#A95B48"/></marker>
    <filter id={`${uid}-particle-glow`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
   </defs>

   <path d="M0 0H960V183Q807 167 636 178T311 174T0 183Z" fill="#EEF1E4"/>
   <path d="M0 343Q105 332 205 345T414 342T620 346T827 341T960 346V520H0Z" fill={stressed?'#F6E5D8':'#E7EBD8'}/>
   <path d="M0 344H960V520H0Z" fill={`url(#${uid}-stroma)`}/>
   <text x="35" y="36" className="gut-anatomy-region-label">腸腔</text>
   <text x="35" y="497" className="gut-anatomy-region-label">黏膜下方</text>

   <g className={`gut-mucus-band${selectedLayer==='mucus'?' is-selected':''}`}>
    <path d="M18 92C84 55 142 116 219 79S347 108 420 82S547 108 625 80S759 107 828 82S916 84 944 91V157C865 173 799 149 730 165S583 150 515 166S374 151 300 168S154 147 84 165S32 161 18 160Z" fill={stressed?'#DDDCC4':'#CEE2CF'} stroke={selectedLayer==='mucus'?'#306C53':'#BBCBB1'} strokeWidth={selectedLayer==='mucus'?3:1.5}/>
    {[72,148,224,300,376,452,528,604,680,756,832,908].map((x,i)=><g key={x} opacity=".65"><path d={`M${x} ${128+i%3*5}q-8-19 0-31m0 21q-14-7-18-16m18 10q13-5 19-16`} fill="none" stroke="#749E7A" strokeWidth="2" strokeLinecap="round"/><circle cx={x} cy={101+i%3*5} r="3" fill="#9ABB91"/></g>)}
   </g>
   <g className="gut-microbes" aria-hidden="true">
    {[{x:111,y:68,r:-25},{x:335,y:53,r:18},{x:577,y:61,r:-8},{x:784,y:56,r:28}].map(({x,y,r},i)=><g key={x} transform={`translate(${x} ${y}) rotate(${r})`}>
     {!stressed&&<ellipse rx="39" ry="25" fill="none" stroke="#D1A04F" strokeWidth="2" strokeDasharray="4 5"/>}
     <rect x="-22" y="-10" width="44" height="20" rx="10" fill={stressed?'#B99570':'#C6A052'} stroke="#85662D" strokeWidth="1.5"/>
     <path d="M-12-2q10 6 22 0M-12 3q10 6 22 0" stroke="#7C642B" strokeWidth="1.3" fill="none"/>
     <path d="M-23 0q-11-7-14 1m60-1q10 7 14-2" fill="none" stroke="#A58B4F" strokeWidth="1.5"/>
     {running&&<animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;0 -4;0 0" dur={`${4+i*.4}s`} repeatCount="indefinite"/>}
    </g>)}
   </g>
   <g className="gut-iga" stroke="#306F6D" strokeWidth="4" strokeLinecap="round" fill="none">
    {[{x:263,y:119},{x:492,y:126},{x:731,y:120}].map(({x,y})=><path key={x} d={`M${x} ${y+17}V${y+4}m0 3-12-13m12 13 12-13m-24 0-5 2m29-2 5 2`}/>)}
   </g>
   <text x="762" y="145" className="gut-anatomy-chemical">sIgA</text>

   <g data-barrier-boundary="epithelium" data-junction-state={stressed?'open':'closed'}>
    <rect x="45" y="181" width="858" height="161" fill="transparent"/>
    {cells.map(({x,index})=>{const w=stressed?82:88;const left=x+(88-w)/2;const goblet=index===4;return <g key={index} className={goblet?'gut-epithelial-cell gut-goblet-cell':'gut-epithelial-cell'}>
     <path d={`M${left} 198Q${left+1} 180 ${left+18} 182Q${left+w/2} 188 ${left+w-17} 182Q${left+w-1} 180 ${left+w} 199L${left+w-4} 318Q${left+w-6} 338 ${left+w/2} 342Q${left+8} 338 ${left+4} 319Z`} fill={goblet?'#BBD4C5':stressed?'#ECD4B4':'#D7DDB8'} stroke={selectedLayer==='junctions'?lipidColor:'#7F946F'} strokeWidth={selectedLayer==='junctions'?2.3:1.6}/>
     <path d={`M${left+8} 202Q${left+w/2} 210 ${left+w-9} 202M${left+9} 209Q${left+w/2} 217 ${left+w-9} 209`} stroke="#F9F9DE" strokeWidth="3" fill="none"/>
     {Array.from({length:13},(_,j)=><path key={j} d={`M${left+8+j*5.4} 190v-${10+j%3*2}`} stroke="#71865D" strokeWidth="2" strokeLinecap="round"/>)}
     <ellipse cx={left+w/2} cy="294" rx="20" ry="27" fill="#668E7B" stroke="#3F6C57" strokeWidth="1.5"/>
     <ellipse cx={left+w/2-4} cy="291" rx="9" ry="14" fill="#B4C7A1"/>
     <path d={`M${left+w/2-5} 278q13 11 0 25m8-25q-14 12 0 22`} fill="none" stroke="#D4DFBB" strokeWidth="1.4"/>
     {goblet?<g>{[0,1,2,3,4,5].map(j=><ellipse key={j} cx={left+24+j%3*18} cy={226+Math.floor(j/3)*17} rx="10" ry="9" fill="#EAF0D5" stroke="#9ABA9A"/>)}</g>:<><path d={`M${left+17} 239q11-12 20-1q-8 11-20 1Zm${w-40} 21q10-11 18 0q-9 9-18 0Z`} fill="#B5AB76" stroke="#8D8D55" strokeWidth="1.3"/><path d={`M${left+19} 238h14M${left+w-23} 259h10`} stroke="#7E8454" strokeWidth="1.2"/></>}
    </g>;})}
   </g>
   <g className="gut-tight-junctions">
    {Array.from({length:8},(_,i)=>{const x=133+i*96;const open=stressed&&[1,4,6].includes(i);return <g key={i} data-barrier-junction={open?'open':'closed'}>
     {open?<><path d={`M${x-1} 205q-8 5 0 10m11-10q8 5 0 10`} fill="none" stroke="#AC4B3A" strokeWidth="4" strokeLinecap="round"/><rect className="gut-junction-gap" x={x-2} y="197" width="17" height="47" rx="8" fill="#C7765B" opacity=".2"/>
      {running&&<circle cx={x+6} cy="222" r="12" fill="#BB5A45" opacity=".15"><animate attributeName="r" values="8;15;8" dur="2.4s" repeatCount="indefinite"/><animate attributeName="opacity" values=".1;.3;.1" dur="2.4s" repeatCount="indefinite"/></circle>}</>:<>{[204,214,224].map(y=><g key={y}><path d={`M${x-4} ${y}h19`} stroke="#2D775B" strokeWidth="4" strokeLinecap="round"/><circle cx={x+2} cy={y} r="3" fill="#D4B15C"/><circle cx={x+9} cy={y} r="3" fill="#D4B15C"/></g>)}</>}
    </g>;})}
   </g>
   <path d="M34 347Q156 337 254 348T472 346T688 349T918 346" fill="none" stroke="#789C7D" strokeWidth="5" strokeLinecap="round"/>
   <path d="M34 356Q156 346 254 357T472 355T688 358T918 355" fill="none" stroke="#BCD0A9" strokeWidth="3"/>

   <g className={`gut-immune-layer${selectedLayer==='immune'?' is-selected':''}`}>
    <g transform="translate(244 421)"><path d="M-31-5-57-29-26-21-22-48-9-23 8-40 14-18 45-30 27-8 52 8 27 15 37 39 10 29-1 49-14 24-39 35-29 12-55 5Z" fill={stressed?'#D59A78':'#B4C6A2'} stroke={stressed?'#A55F48':'#688768'} strokeWidth={selectedLayer==='immune'?3:1.5}/><ellipse rx="17" ry="21" fill={stressed?'#9E604D':'#6F8C6E'}/><path d="M-6-11q15 7-2 20" fill="none" stroke="#E7D7B5" strokeWidth="3"/></g>
    <g transform="translate(521 424)"><circle r="34" fill="#BACFA9" stroke="#6A9068" strokeWidth={selectedLayer==='immune'?3:1.5}/><path d="M-14-13q-13 10-4 23t23 2q13-4 10-17t-15-13Z" fill="#5D886D"/><circle cx="15" cy="-17" r="4" fill="#E4E9C9"/><circle cx="21" cy="6" r="4" fill="#E4E9C9"/></g>
    <g transform="translate(773 417)"><circle r="35" fill="#AFCAB5" stroke="#4D7D65" strokeWidth={selectedLayer==='immune'?3:1.5}/><circle cx="-3" cy="-2" r="22" fill="#618C74"/><path d="M-14-4q11-13 21 4m-18 8q12-10 22 0" stroke="#BFD4AF" strokeWidth="2" fill="none"/><circle cx="27" cy="-9" r="4" fill="#DEC38B"/></g>
    <text x="731" y="476" className="gut-anatomy-chemical">Treg</text>
   </g>
   {stressed&&<g><path data-barrier-flow="immune" d="M282 409C355 372 407 370 476 405" stroke="#A95B48" strokeWidth="2" strokeDasharray="5 6" fill="none" markerEnd={`url(#${uid}-signal-arrow)`}/><text x="353" y="368" className="gut-anatomy-chemical gut-signal-label">免疫辨識訊號</text></g>}
   <g className="gut-barrier-flow-lines" fill="none" strokeWidth="1.5" strokeDasharray="3 6" opacity=".36">
    {(stressed?lpsRoutes:scfaRoutes).map((route,i)=><path key={i} data-barrier-flow={stressed?'lps':'scfa'} d={route.d} stroke={stressed?'#A84435':'#1B6B52'}/>)}
   </g>
   <g className="gut-moving-particles">
    {(stressed?lpsRoutes:scfaRoutes).flatMap((route,i)=>[particle(`first-${i}`,route.d,route.x,route.y,stressed?'lps':'scfa',i*.6),...(running?[particle(`second-${i}`,route.d,route.x,route.y,stressed?'lps':'scfa',i*.6+2.9)]:[])])}
   </g>
   <g className="gut-diagram-labels"><text x="36" y="169" className="gut-anatomy-chemical">黏液</text><text x="38" y="378" className="gut-anatomy-chemical">基底膜</text></g>
  </svg>
  <div className="gut-barrier-layer-controls" role="group" aria-label="選擇腸道防線層次">{layers.map(layer=><button key={layer.id} type="button" data-barrier-layer={layer.id} data-gut-layer={layer.id} aria-pressed={selectedLayer===layer.id} onClick={()=>onSelectLayer(layer.id)}><strong>{layer.name}</strong><span>{layer.chemistry}</span></button>)}</div>
  <figcaption className="gut-barrier-legend"><span className={stressed?'gut-key gut-key-lps':'gut-key gut-key-scfa'}>{stressed?'LPS 內毒素穿越間隙':'SCFA 短鏈脂肪酸滋養上皮'}</span><span className="gut-key gut-key-junction">ZO-1／Occludin 細胞間接點</span></figcaption>
 </figure>;
}
