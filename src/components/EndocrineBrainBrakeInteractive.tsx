'use client';

import {useId} from 'react';
import ScienceModuleInteractive from './ScienceModuleInteractive';
import {endocrineBrainBrakeDefinition} from '@/data/endocrine-brain-brake';
import type {ScienceMode} from '@/data/science-module-types';

function EndocrineScene({mode,running,stageId}:{mode:ScienceMode;running:boolean;stageId:string}){
 const uid=useId().replace(/:/g,'');const stress=mode==='stress';
 const signal=stress?'#A74C3A':'#2F7258';const brake=stress?'#A4ADA4':'#33755C';
 const moving=(path:string,color:string,duration:string,delay='0s')=>running?<circle r="4.5" fill={color}><animateMotion path={path} dur={duration} begin={delay} repeatCount="indefinite"/></circle>:null;
 const axisPaths=['M180 102 Q123 118 90 144','M180 102 Q237 118 270 144','M180 104 L180 230'];
 const nmdaPath='M265 102 L265 219',gabaPath='M95 102 L95 219';
 return <figure className="endocrine-scene" data-science-scene="endocrine" data-endocrine-mode={mode} data-endocrine-stage={stageId}>
  <div className="endocrine-scene-grid">
   <div className="endocrine-organ-panel">
    <div className="endocrine-scene-caption"><span>01</span><strong>三條訊號，一起協調</strong></div>
    <svg viewBox="0 0 360 310" role="img" aria-labelledby={`${uid}-axes-title ${uid}-axes-description`}>
     <title id={`${uid}-axes-title`}>下視丘與腦下垂體調節三條荷爾蒙軸</title><desc id={`${uid}-axes-description`}>壓力、生殖與甲狀腺軸互相影響。箭頭代表訊號聯繫，不是孕烯醇酮在腺體間被搶走。</desc>
     <defs><marker id={`${uid}-signal-arrow`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7Z" fill={signal}/></marker></defs>
     <path className="endocrine-orbit" d="M180 60 C340 60 344 248 180 266 C16 248 20 60 180 60Z" fill="none" stroke="#C9D5CA" strokeDasharray="3 8"/>
     <path d="M75 213 Q78 259 108 264 M252 264 Q282 259 285 213" fill="none" stroke="#AABEB0" strokeWidth="2" strokeDasharray="5 6"/>
     {axisPaths.map((path,index)=><g key={path}><path data-science-flow={`axis-${index}`} d={path} fill="none" stroke={signal} strokeWidth="2.5" markerEnd={`url(#${uid}-signal-arrow)`}/>{moving(path,signal,stress?'2.7s':'4.8s',`${index*.5}s`)}</g>)}
     <g className="endocrine-axis-node"><rect x="105" y="17" width="150" height="88" rx="24" fill="#F8F3E4" stroke="#BCA879"/><text x="180" y="43">調度中心</text><text x="180" y="69" className="endocrine-small-label">下視丘</text><text x="180" y="93" className="endocrine-small-label">腦下垂體</text></g>
     <g className="endocrine-axis-node"><rect x="21" y="145" width="138" height="65" rx="23" fill={stress?'#F7E6DD':'#E9EFE1'} stroke={signal}/><text x="90" y="172">壓力 HPA</text><text x="90" y="196" className="endocrine-small-label">腎上腺</text></g>
     <g className="endocrine-axis-node"><rect x="201" y="145" width="138" height="65" rx="23" fill="#E8EEF0" stroke="#6D929B"/><text x="270" y="172">代謝 HPT</text><text x="270" y="196" className="endocrine-small-label">甲狀腺</text></g>
     <g className="endocrine-axis-node"><rect x="110" y="232" width="140" height="65" rx="23" fill="#EFE8ED" stroke="#A88E9C"/><text x="180" y="258">生殖 HPG</text><text x="180" y="283" className="endocrine-small-label">卵巢／睪丸</text></g>
    </svg>
    <p>各自傳訊，也會回饋調整。</p>
   </div>
   <div className="endocrine-synapse-panel">
    <div className="endocrine-scene-caption"><span>02</span><strong>兩種通道，控制節拍</strong></div>
    <svg viewBox="0 0 360 310" role="img" aria-labelledby={`${uid}-synapse-title ${uid}-synapse-description`}>
     <title id={`${uid}-synapse-title`}>GABA_A 氯離子與 NMDA 鈣離子通道</title><desc id={`${uid}-synapse-description`}>成熟神經元的示意。GABA 與 ALLO 調節抑制訊號；NMDA 參與興奮訊號與學習。模式改變箭頭流速與通道開口，用來比較兩種機轉狀態。</desc>
     <rect x="14" y="170" width="332" height="127" rx="28" fill="#E8EEE7"/>
     <path d="M20 160 H340 M20 180 H340" stroke="#B6C8BC" strokeWidth="8" strokeLinecap="round"/>
     {[30,48,66,124,142,160,180,198,216,234,294,312,330].map(x=><g key={x}><circle cx={x} cy="158" r="5" fill="#608972"/><circle cx={x} cy="182" r="5" fill="#608972"/></g>)}
     <text x="95" y="42" className="endocrine-channel-label">GABA<tspan baselineShift="sub" fontSize="12">A</tspan></text><text x="265" y="42" className="endocrine-channel-label">NMDA</text>
     <text x="95" y="68" className="endocrine-small-label">煞車</text><text x="265" y="68" className="endocrine-small-label">油門</text>
     <g data-endocrine-channel="gaba" data-channel-state={stress?'lower':'coordinated'}><rect x={stress?81:73} y="137" width="14" height="70" rx="7" fill={brake}/><rect x={stress?99:103} y="137" width="14" height="70" rx="7" fill={brake}/><path data-science-flow="chloride" d={gabaPath} fill="none" stroke={brake} strokeDasharray="5 7" strokeWidth="2"/>{moving(gabaPath,stress?'#87948A':'#24674E',stress?'6s':'2.8s')}</g>
     <g data-endocrine-channel="nmda" data-channel-state={stress?'increased':'coordinated'}><rect x={stress?237:245} y="137" width="16" height="70" rx="8" fill="#AD704B"/><rect x={stress?277:269} y="137" width="16" height="70" rx="8" fill="#AD704B"/><path data-science-flow="calcium" d={nmdaPath} fill="none" stroke="#A76843" strokeDasharray="5 7" strokeWidth="2"/>{moving(nmdaPath,'#BE693F',stress?'1.6s':'4.2s')}{stress&&moving(nmdaPath,'#BE693F','1.6s','.8s')}</g>
     <g><circle cx="95" cy="97" r="19" fill="#E0EBDD" stroke="#658673"/><text x="95" y="103" className="endocrine-ion">Cl⁻</text><circle cx="265" cy="97" r="23" fill="#F6E8D6" stroke="#B98C5C"/><text x="265" y="103" className="endocrine-ion">Ca²⁺</text></g>
     <path d="M41 122 Q51 139 72 145" fill="none" stroke="#648575" strokeWidth="2"/><circle cx="41" cy="118" r="12" fill="#E7D5A7" stroke="#AC8A44"/><text x="43" y="237" className="endocrine-small-label" style={{textAnchor:'start'}}>ALLO 調節</text>
     <text x="180" y="278" className="endocrine-small-label">神經元內部</text>
    </svg>
    <p>{stress?'比較興奮增加與抑制不足的情境。':'保留學習的油門，也有適當的煞車。'}</p>
   </div>
  </div>
  <figcaption>先選狀態，再點下方工作站。離子方向採成熟神經元的常見情境。</figcaption>
 </figure>;
}

export default function EndocrineBrainBrakeInteractive({onProducts,showProducts=true}:{onProducts?:(ids:string[])=>void;showProducts?:boolean}){
 return <ScienceModuleInteractive definition={endocrineBrainBrakeDefinition} onProducts={onProducts} showProducts={showProducts} scene={state=><EndocrineScene {...state}/>}/>;
}
