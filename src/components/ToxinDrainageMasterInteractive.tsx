'use client';

import {useId,useState} from 'react';
import ScienceModuleInteractive from './ScienceModuleInteractive';
import {toxinDrainageDefinition,toxinObservations} from '@/data/toxin-drainage';
import type {ScienceMode} from '@/data/science-module-types';

function ToxinScene({mode,running,stageId}:{mode:ScienceMode;running:boolean;stageId:string}){
 const uid=useId().replace(/:/g,'');
 const [observation,setObservation]=useState(toxinObservations[0].id);
 const selected=toxinObservations.find(item=>item.id===observation)!;
 const stress=mode==='stress';const color=stress?'#a34c3e':'#2f6851';
 const routes=[
  {id:'bile',d:'M194 167 C196 212 200 224 211 252',color:stress?'#b47832':'#497757',active:true},
  {id:'portal',d:'M285 305 C388 312 398 128 294 126',color:stress?'#a34c3e':'#94a996',active:stress},
  {id:'renal-blood',d:'M331 158 C400 160 424 182 463 196',color:'#567d87',active:true},
  {id:'stool',d:'M210 381 L210 449',color:stress?'#9caaa0':'#2f6851',active:!stress},
  {id:'urine',d:'M531 366 L531 449',color:stress?'#9caaa0':'#2f6851',active:!stress},
 ];
 return <div className="toxin-scene" data-science-scene="toxin" data-toxin-state={mode} data-toxin-focus={stageId}>
  <div className="toxin-scene-key"><span><i style={{background:color}}/>{stress?'追蹤部分分子的回收路線':'分別追蹤糞便與尿液出口'}</span><span>器官與流向示意</span></div>
  <div className="toxin-route-layout">
   <figure className="toxin-organ-map">
    <svg viewBox="0 0 680 485" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
     <title id={`${uid}-title`}>肝臟、膽汁、腸道與腎臟的代謝路線</title>
     <desc id={`${uid}-desc`}>{stress?'紅色回線由腸道經門靜脈返回肝臟，呈現部分分子的腸肝再循環。':'綠色箭頭分別由腸道向糞便、腎臟向尿液排出，淡色回線保留正常腸肝循環。'}睡眠腦液交換在右側獨立圖中顯示。</desc>
     <defs>
      <linearGradient id={`${uid}-liver`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d7a08b"/><stop offset="1" stopColor="#b77664"/></linearGradient>
      <linearGradient id={`${uid}-gut`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#e7d6ab"/><stop offset="1" stopColor="#bfa575"/></linearGradient>
      <linearGradient id={`${uid}-kidney`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#bd8990"/><stop offset="1" stopColor="#8d5968"/></linearGradient>
      {['#a34c3e','#94a996','#567d87','#9caaa0','#2f6851','#b47832','#497757'].map((shade,index)=><marker key={shade} id={`${uid}-arrow-${index}`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" fill={shade}/></marker>)}
     </defs>
     <ellipse cx="210" cy="189" rx="128" ry="15" fill="#7c4c3820"/>
     <ellipse cx="214" cy="389" rx="104" ry="12" fill="#6e654421"/>
     <ellipse cx="532" cy="297" rx="92" ry="11" fill="#644c5b17"/>
     <g className="toxin-liver" data-toxin-organ="liver">
      <path d="M90 143 C69 110 88 70 129 66 C157 63 178 77 207 76 C250 60 298 64 333 94 C349 110 342 136 312 147 C279 160 256 152 234 169 C207 188 160 187 135 174 C116 164 103 158 90 143Z" fill={`url(#${uid}-liver)`} stroke="#8e5a49" strokeWidth="2.5"/>
      <path d="M204 78 C191 109 212 134 196 166 M212 110 C249 98 284 106 312 91" stroke="#f1d7c9" strokeWidth="3" fill="none" opacity=".75"/>
      <path d="M171 147 C157 144 151 157 159 171 C170 189 184 174 180 161Z" fill="#6f8a49" stroke="#506431" strokeWidth="2"/>
      <text x="212" y="121" textAnchor="middle" className="toxin-organ-label">肝臟</text>
      <text x="211" y="43" textAnchor="middle" className="toxin-map-label">轉化・結合・轉運</text>
     </g>
     <g data-toxin-organ="gut">
      <path d="M153 265 C138 250 117 259 116 278 L115 346 C115 364 129 377 146 377 H269 C289 377 302 363 302 344 V280 C302 260 282 251 269 265" fill="none" stroke="#8f7954" strokeWidth="22" strokeLinecap="round"/>
      <path d="M153 265 C138 250 117 259 116 278 L115 346 C115 364 129 377 146 377 H269 C289 377 302 363 302 344 V280 C302 260 282 251 269 265" fill="none" stroke={`url(#${uid}-gut)`} strokeWidth="16" strokeLinecap="round"/>
      <path d="M160 277 H253 Q274 277 274 293 Q274 309 254 309 H165 Q146 309 146 326 Q146 341 164 341 H254 Q272 341 272 354 H208 V381" fill="none" stroke="#b7996b" strokeWidth="17" strokeLinecap="round"/>
      <path d="M160 277 H253 Q274 277 274 293 Q274 309 254 309 H165 Q146 309 146 326 Q146 341 164 341 H254 Q272 341 272 354 H208 V381" fill="none" stroke="#f0ddb5" strokeWidth="10" strokeLinecap="round"/>
      <text x="104" y="242" textAnchor="end" className="toxin-map-label">腸道</text>
     </g>
     <g data-toxin-organ="kidneys">
      <path d="M490 175 C464 158 441 182 442 219 C441 260 460 281 482 271 C501 263 501 246 487 235 C475 225 474 218 487 206 C498 197 501 183 490 175Z" fill={`url(#${uid}-kidney)`} stroke="#82525e" strokeWidth="2.5"/>
      <path d="M574 175 C600 158 623 182 622 219 C623 260 604 281 582 271 C563 263 563 246 577 235 C589 225 590 218 577 206 C566 197 563 183 574 175Z" fill={`url(#${uid}-kidney)`} stroke="#82525e" strokeWidth="2.5"/>
      <path d="M484 224 C504 234 508 292 519 327 M580 224 C560 234 556 292 545 327" stroke="#ab9974" strokeWidth="7" strokeLinecap="round" fill="none"/>
      <path d="M509 330 C510 310 552 310 555 330 C560 350 549 367 532 367 C515 366 505 348 509 330Z" fill="#d6c6a6" stroke="#9c8a68" strokeWidth="2"/>
      <text x="532" y="137" textAnchor="middle" className="toxin-map-label">腎臟</text>
      <text x="533" y="304" textAnchor="middle" className="toxin-small-label">過濾・分泌・再吸收</text>
     </g>
     {routes.map(route=>{const index=['#a34c3e','#94a996','#567d87','#9caaa0','#2f6851','#b47832','#497757'].indexOf(route.color);return <g key={route.id}>
      <path data-science-flow={route.id} d={route.d} fill="none" stroke={route.color} strokeWidth={route.id==='portal'&&stress?6:4} strokeLinecap="round" strokeDasharray={!route.active?'7 7':undefined} markerEnd={`url(#${uid}-arrow-${index})`}/>
      {running&&route.active&&[0,1].map(index=><circle key={index} r={route.id==='portal'?5:4} fill={route.id==='portal'?'#e3a182':'#e6bd67'}><animateMotion path={route.d} dur={route.id==='portal'?'4s':'3.5s'} begin={`${-index*1.75}s`} repeatCount="indefinite"/></circle>)}
     </g>;})}
     <text x="174" y="213" textAnchor="end" className="toxin-small-label">膽汁</text>
     <text x="381" y="338" textAnchor="middle" className="toxin-small-label" fill={color}>門靜脈回肝</text>
     <text x="408" y="150" textAnchor="middle" className="toxin-small-label">血液分支</text>
     <text x="210" y="478" textAnchor="middle" className="toxin-map-label">糞便出口</text>
     <text x="531" y="478" textAnchor="middle" className="toxin-map-label">尿液出口</text>
    </svg>
    <figcaption>肝膽、腸道與腎臟各有分工。淡色回線保留正常再循環，動畫不表示所有分子都被清除。</figcaption>
   </figure>
   <aside className="toxin-sleep-inset" aria-label="睡眠腦液交換的獨立示意">
    <span className="toxin-inset-kicker">另一張獨立的網絡</span><h4>睡眠與腦液交換</h4>
    <svg viewBox="0 0 300 200" role="img" aria-label="腦脊髓液與腦間質液交換示意，沒有直接接到肝腸或尿液出口">
     <path d="M147 42 C127 20 101 28 89 47 C62 46 48 67 55 87 C31 102 39 133 61 140 C64 166 94 179 117 166 C128 182 149 179 153 157 C162 182 187 180 200 164 C225 178 251 158 247 136 C270 119 265 94 245 84 C249 60 227 43 206 48 C191 24 166 24 147 42Z" fill="#dbe6dc" stroke="#688c80" strokeWidth="3"/>
     <path d="M149 44 V154 M88 50 C101 65 82 80 69 78 M60 96 C84 94 93 112 80 126 M104 151 C102 125 126 115 141 123 M204 53 C191 71 210 85 229 76 M246 108 C218 94 204 111 219 128 M165 106 C193 98 193 139 179 155" fill="none" stroke="#9db8a7" strokeWidth="4" strokeLinecap="round"/>
     <path data-science-flow="glymphatic" d="M64 41 C7 64 15 160 72 178 C114 195 231 196 269 150 C292 116 274 63 240 38" fill="none" stroke={stress?'#91a4aa':'#467b85'} strokeWidth="3" strokeDasharray="5 5"/>
     {running&&[0,1,2].map(index=><circle key={index} r="4" fill={stress?'#91a4aa':'#c9a153'}><animateMotion path="M64 41 C7 64 15 160 72 178 C114 195 231 196 269 150 C292 116 274 63 240 38" dur={stress?'8s':'6s'} begin={`${-index*2}s`} repeatCount="indefinite"/></circle>)}
    </svg>
    <p>腦脊髓液、間質液與血管周圍空間參與交換；與腸肝循環分開閱讀。</p>
   </aside>
  </div>
  <div className="toxin-observations"><h4>五種感受，先看各自的線索</h4><div className="toxin-observation-tabs" role="group" aria-label="選擇環境暴露研究中的症狀線索">{toxinObservations.map(item=><button key={item.id} type="button" data-toxin-observation={item.id} aria-pressed={selected.id===item.id} aria-controls={`${uid}-observation`} onClick={()=>setObservation(item.id)}>{item.label}</button>)}</div><div id={`${uid}-observation`} className="toxin-observation-detail" aria-live="polite"><strong>{selected.label}</strong><p>{selected.detail}</p></div></div>
 </div>;
}

export default function ToxinDrainageMasterInteractive({onProducts,showProducts=true}:{onProducts?:(ids:string[])=>void;showProducts?:boolean}){
 return <ScienceModuleInteractive definition={toxinDrainageDefinition} onProducts={onProducts} showProducts={showProducts} scene={state=><ToxinScene {...state}/>}/>;
}
