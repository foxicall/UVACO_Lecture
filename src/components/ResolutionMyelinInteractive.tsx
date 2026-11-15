'use client';

import {useId} from 'react';
import type {ScienceMode} from '@/data/science-module-types';
import {resolutionMyelinDefinition} from '@/data/resolution-myelin';
import ScienceModuleInteractive from './ScienceModuleInteractive';

function ResolutionScene({mode,running,stageId}:{mode:ScienceMode;running:boolean;stageId:string}){
 const uid=useId().replace(/:/g,'');
 const support=mode==='support';const color=support?'#316952':'#A64D3C';
 const cleanupPath=support?'M55 76 C80 49 102 79 150 110':'M55 76 C93 37 158 34 242 68';
 const transportPath='M34 95 C76 95 105 95 150 95 C189 95 223 95 264 95';
 const nervePath=support?'M20 109 H280':'M20 109 H112 L131 87 L144 129 L158 109 H280';
 return <figure className="resolution-scene" data-science-scene="resolution" data-resolution-mode={mode} aria-label="胞葬清除、血腦屏障與髓鞘的三組生理示意">
  <div className={`resolution-scene-card${['clearance','lipid-families','phytochemicals'].includes(stageId)?' is-active':''}`}>
   <div className="resolution-scene-label"><span>01</span><strong>清理現場</strong></div>
   <svg viewBox="0 0 300 220" role="img" aria-labelledby={`${uid}-clearance-title`}>
    <title id={`${uid}-clearance-title`}>{support?'巨噬細胞清除凋亡細胞':'未清除細胞延續損傷訊號'}</title>
    <ellipse cx="150" cy="119" rx="110" ry="70" fill={support?'#E1EDDE':'#F0E2D8'}/>
    <path d="M177 50 C228 52 254 91 243 137 C233 179 181 189 142 166 C122 155 111 128 120 111 C126 104 136 112 150 109 C169 103 167 87 157 78 C142 64 158 50 177 50Z" fill={support?'#81AD88':'#C8B49E'} stroke={support?'#426B4D':'#8F7966'} strokeWidth="3"/>
    <ellipse cx="205" cy="120" rx="17" ry="23" fill="#687A60" opacity=".75"/>
    <circle cx="55" cy="76" r="21" fill="#C88667" stroke="#955C45" strokeWidth="2"/>
    <path d="M42 76 Q49 60 54 74 T68 75" stroke="#824838" strokeWidth="4" fill="none"/>
    <path data-science-flow="resolution-clearance" d={cleanupPath} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="5 6"/>
    {running&&<circle r="7" fill={color}><animateMotion path={cleanupPath} dur="4s" repeatCount="indefinite"/></circle>}
    {support?<g><circle cx="154" cy="111" r="12" fill="#B8CDA5" stroke="#527C54" strokeWidth="2"/><path d="m149 111 4 4 7-9" stroke="#375D3E" strokeWidth="2.5" fill="none"/></g>:<g fill="#B8523F"><path d="m244 46 5 10 11 2-8 8 1 11-10-5-10 5 2-11-8-8 11-2Z"/><circle cx="90" cy="153" r="6"/><circle cx="75" cy="132" r="4"/></g>}
    <text x="150" y="207" textAnchor="middle" fill="#324D3C" fontSize="19" fontWeight="600">{support?'胞葬作用・回收材料':'DAMPs・延續警報'}</text>
   </svg>
   <p>{support?'凋亡細胞被吞入，再由細胞內系統處理。':'清除跟不上，損傷訊號可能持續出現。'}</p>
  </div>
  <div className={`resolution-scene-card${stageId==='brain-access'?' is-active':''}`}>
   <div className="resolution-scene-label"><span>02</span><strong>辨認通行方式</strong></div>
   <svg viewBox="0 0 300 220" role="img" aria-labelledby={`${uid}-barrier-title`}>
    <title id={`${uid}-barrier-title`}>LPC-DHA 透過 MFSD2A；猴頭素研究另行閱讀</title>
    <rect x="15" y="40" width="112" height="130" rx="18" fill="#E5EAF0"/><rect x="174" y="40" width="112" height="130" rx="18" fill="#E3ECDE"/>
    <rect x="133" y="26" width="34" height="151" rx="12" fill="#9AB2B1"/>
    {[44,64,124,145,165].map(y=><g key={y} fill="#698E88"><circle cx="138" cy={y} r="4"/><circle cx="162" cy={y} r="4"/></g>)}
    <rect x="126" y="79" width="48" height="32" rx="10" fill="#D3AD62" stroke="#8B682D" strokeWidth="2"/>
    <path data-science-flow="resolution-mfsd2a" d={transportPath} fill="none" stroke="#477266" strokeWidth="2.5"/>
    {running&&<g><circle r="6" fill="#C39743"><animateMotion path={transportPath} dur="5s" repeatCount="indefinite"/></circle><circle r="3" fill="#426B57"><animateMotion path={transportPath} dur="5s" begin="1.5s" repeatCount="indefinite"/></circle></g>}
    <text x="66" y="65" textAnchor="middle" fontSize="19" fill="#3B5460">血液側</text><text x="231" y="65" textAnchor="middle" fontSize="19" fill="#385B42">腦組織側</text>
    <text x="66" y="145" textAnchor="middle" fontSize="17" fill="#3B5460">LPC-DHA</text><text x="231" y="145" textAnchor="middle" fontSize="17" fill="#385B42">脂質重塑</text>
    <text x="150" y="207" textAnchor="middle" fill="#324D3C" fontSize="19" fontWeight="600">MFSD2A・選擇性轉運</text>
   </svg>
   <p>LPC-DHA 是特定分子，與一般卵磷脂不同。</p>
  </div>
  <div className={`resolution-scene-card${stageId==='myelin'?' is-active':''}`}>
   <div className="resolution-scene-label"><span>03</span><strong>維持保護層</strong></div>
   <svg viewBox="0 0 300 220" role="img" aria-labelledby={`${uid}-myelin-title`} data-resolution-myelin={support?'maintained':'damaged'}>
    <title id={`${uid}-myelin-title`}>{support?'髓鞘與軸突訊號維持示意':'髓鞘受損與傳導變化示意'}</title>
    <ellipse cx="150" cy="109" rx="135" ry="70" fill={support?'#EDE9D8':'#F0E2D8'}/>
    <path d="M18 109 H282" stroke="#B1844E" strokeWidth="16" strokeLinecap="round"/>
    {[37,93,149,205].map((x,index)=><g key={x}>
     <rect x={x} y={support||index%2===0?74:80} width={support||index%2===0?43:22} height={support||index%2===0?70:58} rx="18" fill={support?'#C2B880':'#C7BDA2'} stroke={support?'#8B8651':'#AD8F74'} strokeWidth="2.5"/>
     <path d={`M${x+10} 84 V134 M${x+17} 81 V137`} stroke={support?'#F0E5B4':'#DFD0B5'} strokeWidth="3" fill="none"/>
    </g>)}
    <path data-science-flow="resolution-axon" d={nervePath} stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
    {running&&<circle r="5" fill={support?'#FFF1BC':'#B84A39'} stroke={color} strokeWidth="1.5"><animateMotion path={nervePath} dur={support?'3.5s':'6s'} repeatCount="indefinite"/></circle>}
    {!support&&<g stroke="#B9563F" strokeWidth="3" fill="none"><path d="m126 60-6 12 11-2-6 12"/><path d="m238 149-7 12 11-2-6 12"/></g>}
    <text x="150" y="207" textAnchor="middle" fill="#324D3C" fontSize="19" fontWeight="600">{support?'髓鞘・協助訊號傳遞':'保護層受損・傳導改變'}</text>
   </svg>
   <p>{support?'中樞寡突膠質細胞參與髓鞘建造與保養。':'傳導變化要結合病因、細胞與功能一起看。'}</p>
  </div>
 </figure>;
}

export default function ResolutionMyelinInteractive({onProducts,showProducts=true}:{onProducts?:(ids:string[])=>void;showProducts?:boolean}){
 return <ScienceModuleInteractive definition={resolutionMyelinDefinition} onProducts={onProducts} showProducts={showProducts} scene={state=><ResolutionScene {...state}/>}/>;
}
