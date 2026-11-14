'use client';
import {useId,useState} from 'react';
import {pillarById,type PillarId} from '@/data/lecture-poster';
import {pillarStories} from '@/data/four-pillars-story';
import {pillarPathwayIds} from '@/data/biochemical-pathways';
import BiochemicalPathwayCard from './BiochemicalPathwayCard';
import VoiceGuide from './VoiceGuide';

type Props={pillarId:PillarId;stage:0|1|2;onProducts?:(ids:string[])=>void};
type BodyRegion={label:string;text:string};
const regions:Record<PillarId,BodyRegion[]>={
 repair:[{label:'細胞發電廠',text:'粒線體把食物中的能量轉成 ATP。內膜的電子傳遞鏈與 ATP 合成酶分工合作，細胞才有能量進行日常更新。'},{label:'組織更新',text:'胺基酸是肌肉與膠原蛋白的材料。足夠的能量、阻力活動與恢復時間，共同影響身體如何使用這些材料。'},{label:'營養回收',text:'甲硫胺酸循環、葉酸循環與轉硫化路徑彼此接力。維生素與酵素各有位置，並非多補一種原料就能代替整個系統。'}],
 neural:[{label:'神經聯繫',text:'神經細胞沿著軸突傳遞訊號，再由突觸把訊息交給下一個細胞。類澱粉蛋白、濤蛋白與發炎訊號，是理解部分神經退化的研究線索。'},{label:'髓鞘保護',text:'寡突膠質細胞形成中樞神經的髓鞘，像包住電線的保護層。神經營養訊號與髓鞘蛋白的調節，是不同但相關的研究環節。'},{label:'血液補給',text:'腦部血管持續送來氧氣與營養。內皮細胞製造的一氧化氮參與血管舒張，血壓、血糖與脂質狀態也影響這條補給線。'}],
 inflammation:[{label:'腸道屏障',text:'腸上皮細胞之間的緊密連接像可調節的拉鍊，配合黏液層與菌群，管理哪些物質能通過。ZO-1 與 Occludin 是其中不同位置的成員。'},{label:'免疫警報',text:'LPS 接觸特定免疫受體後，可能啟動 TLR4 與 NF-κB 訊號。NLRP3 發炎小體還需要另一組活化條件，並不是收到一次警報就自動完成全部反應。'},{label:'發炎收工',text:'免疫反應也需要收工。促消退脂質訊號參與限制持續招募，巨噬細胞則清理凋亡細胞，讓組織重新回到平衡。'}],
 autonomic:[{label:'大腦節奏',text:'興奮與抑制訊號幫大腦安排工作和休息。GABA 與神經類固醇參與抑制性訊號，睡眠則同時受到光線、作息與壓力調節。'},{label:'腸腦雙向',text:'腸道與大腦透過神經、免疫及代謝訊號雙向聯繫。腸道與腦內的血清素分屬不同環境，兩者不是一條直接灌入的管線。'},{label:'日夜交班',text:'白天的光線、規律活動和夜間逐漸減少的刺激，幫生理時鐘準時交班。色胺酸的代謝分流與褪黑激素的節律，一起放回這個脈絡理解。'}],
};

export default function MedicalDiagramGallery({pillarId,stage,onProducts}:Props){
 const [view,setView]=useState(stage===0?'stats':'pathways');
 const [region,setRegion]=useState(0);
 const story=pillarStories[pillarId];
 return <section className="medical-diagram-gallery" aria-label={`${pillarById.get(pillarId)!.name}互動醫療圖表`} data-medical-pillar={pillarId}>
  <div className="medical-view-switch" role="group" aria-label="圖解閱讀方式"><button aria-pressed={view===(stage===0?'stats':'pathways')} onClick={()=>setView(stage===0?'stats':'pathways')}>{stage===0?'先看生活與數據':'看合成與代謝路徑'}</button><button aria-pressed={view==='anatomy'} onClick={()=>setView('anatomy')}>看生理位置</button></div>
  {view==='stats'?<>
   <div className="medical-stat-hero"><StatisticsIllustration pillarId={pillarId}/></div>
   <div className="medical-stat-caption"><h4>{story.stat.label}</h4><p>{story.stat.context}</p><a href={story.stat.url} target="_blank" rel="noopener noreferrer">{story.stat.source} ↗</a></div>
   <p className="medical-opening">{story.opening}</p>
   <VoiceGuide text={`${story.stat.value}，${story.stat.label}。${story.stat.context}。${story.opening}`} label="聽生活與數據導讀"/>
  </>:view==='anatomy'?<>
   <div className="medical-anatomy-hero"><AnatomyIllustration pillarId={pillarId} active={region}/></div>
   <div className="medical-region-controls" role="group" aria-label="選擇生理位置">{regions[pillarId].map((item,i)=><button key={item.label} aria-pressed={region===i} onClick={()=>setRegion(i)}>{item.label}</button>)}</div>
   <div className="medical-anatomy-caption" aria-live="polite"><h4>{regions[pillarId][region].label}</h4><p>{regions[pillarId][region].text}</p></div>
   <VoiceGuide text={`${regions[pillarId][region].label}。${regions[pillarId][region].text}`} label="聽生理位置導讀"/>
  </>:<BiochemicalPathwayCard pathwayIds={pillarPathwayIds[pillarId]} showProducts={stage===2} onProducts={stage===2?onProducts:undefined}/>}
 </section>;
}

function StatisticsIllustration({pillarId}:{pillarId:PillarId}){
 const uid=useId().replace(/:/g,'');const stat=pillarStories[pillarId].stat;
 return <svg viewBox="0 0 900 480" role="img" aria-labelledby={`${uid}-title ${uid}-desc`} className="medical-stat-svg">
  <title id={`${uid}-title`}>{stat.value}，{stat.label}</title><desc id={`${uid}-desc`}>{stat.context}</desc>
  <rect width="900" height="480" rx="22" fill="#F1F2E9"/>
  <text x="52" y="65" className="medical-svg-kicker">{pillarId==='repair'?'台灣 · 2023 年':pillarId==='neural'?'全國社區調查 · 2020–2023 年':pillarId==='inflammation'?'台灣死因資料 · 2022 年':'台灣工作者睡眠調查 · 2019 年'}</text>
  <text x="52" y="165" className="medical-svg-number">{stat.value}</text>
  {pillarId==='repair'?<>
   <text x="52" y="215" className="medical-svg-label">壽命與健康壽命的平均差距</text>
   <text x="52" y="280" className="medical-svg-label">健康平均餘命</text><rect x="52" y="300" width="656" height="46" rx="10" fill="#1B4D3E"/><rect x="712" y="300" width="70" height="46" rx="10" fill="#C38A39"/>
   <text x="68" y="332" fill="white" fontSize="25">72.45 歲</text><text x="805" y="332" fontSize="23" fill="#6D491E">7.8</text>
   <path d="M52 370 H782 M52 364 V377 M782 364 V377" stroke="#5F7064" strokeWidth="2"/><text x="415" y="405" textAnchor="middle" className="medical-svg-label">平均壽命 80.23 歲</text>
   <text x="52" y="452" fontSize="20" fill="#41584D">這是健康餘命差距，並非每個人的臥床年數。</text>
  </>:pillarId==='neural'?<>
   <text x="52" y="215" className="medical-svg-label">社區 65 歲以上長者</text>
   {Array.from({length:100},(_,i)=><g key={i} transform={`translate(${420+(i%10)*40} ${130+Math.floor(i/10)*29})`} fill={i<8?'#1B4D3E':'#D4DDD1'}><circle cx="0" cy="0" r="6"/><path d="M-8 8 Q0 2 8 8 V18 H-8Z"/></g>)}
   <text x="52" y="295" className="medical-svg-label">約每 13 位長者</text><text x="52" y="335" className="medical-svg-label">有 1 位失智症患者</text><text x="52" y="450" fontSize="20" fill="#41584D">100 人圖示約標示 8 人；正式調查數值為 7.99%。</text>
  </>:pillarId==='inflammation'?<>
   <text x="52" y="215" className="medical-svg-label">死亡原因與慢性疾病相關</text>
   {Array.from({length:10},(_,i)=><rect key={i} x={52+i*78} y="277" width="66" height="96" rx="12" fill={i<6?'#1B4D3E':'#D4DDD1'}/>)}
   <text x="52" y="420" className="medical-svg-label">把慢性病照護放進每天的生活</text><text x="52" y="455" fontSize="20" fill="#41584D">此圖為死因占比，不是「慢性發炎」的盛行率。</text>
  </>:<>
   <text x="52" y="215" className="medical-svg-label">固定日班工作者的慢性失眠比例</text>
   <text x="52" y="290" className="medical-svg-label">固定日班</text><rect x="220" y="257" width="257" height="48" rx="10" fill="#1B4D3E"/><text x="495" y="290" fontSize="26" fill="#182220">10.7%</text>
   <text x="52" y="365" className="medical-svg-label">輪班工作</text><rect x="220" y="332" width="559" height="48" rx="10" fill="#607E71"/><text x="795" y="365" fontSize="26" fill="#182220">23.3%</text>
   <text x="52" y="445" fontSize="20" fill="#41584D">兩組同次調查；作息與工作情境要一起閱讀。</text>
  </>}
 </svg>;
}

function AnatomyIllustration({pillarId,active}:{pillarId:PillarId;active:number}){
 const uid=useId().replace(/:/g,'');
 const accent=(i:number)=>active===i?'#B97D26':'#4D7462';
 const weight=(i:number)=>active===i?5:3;
 return <svg viewBox="0 0 900 500" role="img" aria-labelledby={`${uid}-title ${uid}-desc`} className="medical-anatomy-svg">
  <title id={`${uid}-title`}>{pillarById.get(pillarId)!.name}生理位置圖</title><desc id={`${uid}-desc`}>{regions[pillarId].map(item=>`${item.label}：${item.text}`).join('。')}</desc>
  <defs><marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="#A66D22"/></marker></defs>
  <rect width="900" height="500" rx="22" fill="#EFF2E9"/>
  {pillarId==='repair'?<>
   <ellipse cx="258" cy="240" rx="190" ry="150" fill="#E1E9DB" stroke={accent(0)} strokeWidth={weight(0)}/><ellipse cx="258" cy="240" rx="177" ry="138" fill="#F9F7EF" stroke="#9CB39D" strokeWidth="2"/>
   <path d="M118 238 C120 173 173 156 225 175 C273 192 310 166 353 204 C388 235 375 285 322 301 C277 314 245 282 204 305 C160 330 112 292 118 238Z" fill="#C6D8BC" stroke="#53754C" strokeWidth="4"/>
   <path d="M140 240 C150 195 166 200 176 242 C186 283 200 277 208 232 C216 187 234 190 243 240 C250 281 267 283 277 232 C287 197 306 200 311 247 C318 284 335 275 352 235" fill="none" stroke="#53754C" strokeWidth="7" strokeLinecap="round"/>
   <g fill="#B67D32">{[150,194,238,282,326].map((x,i)=><circle key={x} cx={x} cy={195+(i%2)*100} r="6"/>)}</g>
   <path d="M430 230 H520" stroke="#A66D22" strokeWidth="3" markerEnd={`url(#${uid}-arrow)`}/><circle cx="565" cy="230" r="42" fill="#1B4D3E"/><text x="565" y="239" fontSize="27" fill="white" textAnchor="middle">ATP</text>
   <g stroke={accent(1)} strokeWidth={weight(1)} fill="none">{[0,1,2,3].map(i=><path key={i} d={`M640 ${150+i*27} C690 ${110+i*27} 740 ${190+i*27} 817 ${145+i*27}`}/>)}</g>
   <path d="M600 270 C625 310 662 320 714 322" stroke="#A66D22" strokeWidth="3" fill="none" markerEnd={`url(#${uid}-arrow)`}/>
   <g fill="#E3EBDF" stroke={accent(2)} strokeWidth={weight(2)}><circle cx="525" cy="382" r="26"/><circle cx="605" cy="420" r="26"/><circle cx="685" cy="382" r="26"/></g><path d="M551 389 L579 408 M631 409 L659 389 M662 362 Q605 329 548 362" stroke="#6C8A74" strokeWidth="2" fill="none" markerEnd={`url(#${uid}-arrow)`}/>
   <text x="80" y="65" className="medical-svg-label">一個細胞，三種分工</text><text x="160" y="420" className="medical-svg-label">粒線體 · 能量轉換</text><text x="625" y="110" className="medical-svg-label">肌肉與膠原更新</text><text x="520" y="480" className="medical-svg-label">營養原料循環</text>
  </>:pillarId==='neural'?<>
   <path d="M77 204 L135 238 L177 213 L204 247 L178 280 L144 269 L92 307 M145 239 L139 180 L107 142 M177 214 L210 161 L248 134 M144 269 L135 322 L171 353" fill="none" stroke={accent(0)} strokeWidth={weight(0)+2} strokeLinecap="round"/>
   <ellipse cx="211" cy="250" rx="52" ry="56" fill="#C8DABF" stroke={accent(0)} strokeWidth={weight(0)}/><circle cx="211" cy="250" r="19" fill="#6B9777"/>
   <path d="M264 250 H735 L781 217 M735 250 L787 274 M735 250 L787 244" stroke="#4E785F" strokeWidth="9" fill="none" strokeLinecap="round"/>
   {[310,412,514,616].map((x,i)=><g key={x}><rect x={x} y="217" width="83" height="66" rx="30" fill={active===1?'#E7CE9E':'#CADBC0'} stroke={accent(1)} strokeWidth={weight(1)}/><path d={`M${x+14} 226 Q${x+3} 250 ${x+14} 274 M${x+27} 224 Q${x+16} 250 ${x+27} 276 M${x+40} 224 Q${x+29} 250 ${x+40} 276 M${x+53} 224 Q${x+42} 250 ${x+53} 276`} stroke="#91AE84" strokeWidth="2" fill="none"/></g>)}
   <path d="M300 179 H686" stroke="#A66D22" strokeWidth="3" markerEnd={`url(#${uid}-arrow)`}/><text x="370" y="155" className="medical-svg-label">沿軸突傳遞訊號</text>
   <path d="M80 395 C240 340 370 415 530 380 C640 355 717 390 818 349" stroke={accent(2)} strokeWidth="27" fill="none"/><path d="M80 395 C240 340 370 415 530 380 C640 355 717 390 818 349" stroke="#E8B49D" strokeWidth="17" fill="none"/>
   {[160,290,430,575,730].map((x,i)=><ellipse key={x} cx={x} cy={i%2?384:378} rx="14" ry="6" fill="#A45E48" transform={`rotate(${i%2?15:-15} ${x} 380)`}/>)}
   <text x="60" y="72" className="medical-svg-label">神經聯繫 · 髓鞘 · 血液補給</text><text x="105" y="111" fontSize="20" fill="#41584D">樹突接收訊息</text><text x="364" y="320" className="medical-svg-label">髓鞘像電線的保護層</text><text x="300" y="459" className="medical-svg-label">微血管持續送來氧氣與營養</text>
  </>:pillarId==='inflammation'?<>
   <text x="55" y="65" className="medical-svg-label">腸腔</text><path d="M48 132 Q120 95 200 128 T360 128 T520 128 T680 128 T845 128" fill="none" stroke="#B6CCAA" strokeWidth="15"/>
   {[85,190,295,400,505,610,715].map((x,i)=><g key={x}><rect x={x} y="183" width="92" height="137" rx="18" fill="#D2E2C7" stroke={accent(0)} strokeWidth={weight(0)}/><ellipse cx={x+46} cy="272" rx="17" ry="25" fill="#8FAC83"/>{Array.from({length:7},(_,j)=><path key={j} d={`M${x+10+j*12} 183 V165`} stroke="#6E9065" strokeWidth="5" strokeLinecap="round"/>)}{i<6&&<path d={`M${x+92} 208 H${x+105} M${x+92} 218 H${x+105} M${x+92} 228 H${x+105}`} stroke="#A66D22" strokeWidth="4"/>}</g>)}
   <g fill="#8EAB83">{[130,270,440,600,760].map((x,i)=><g key={x} transform={`translate(${x} ${85+i%2*12}) rotate(${i*27})`}><rect x="-14" y="-5" width="28" height="10" rx="5"/><path d="M-14 0 H-21 M14 0 H21" stroke="#59794E" strokeWidth="2"/></g>)}</g>
   <path d="M48 335 H845" stroke="#809878" strokeWidth="3"/><text x="55" y="374" className="medical-svg-label">組織側</text>
   <g transform="translate(440 411)"><path d="M-44 0 -57-19 -29-26 -17-50 5-35 29-48 34-21 57-7 39 12 44 36 17 34 0 53-16 30-41 34-34 11Z" fill="#E4C691" stroke={accent(1)} strokeWidth={weight(1)}/><circle r="14" fill="#AB8140"/></g>
   <g transform="translate(690 411)"><path d="M-56 8 C-62-40-22-53 14-45 C52-52 75-13 46 20 C21 43-14 53-43 36Z" fill="#C8DBBD" stroke={accent(2)} strokeWidth={weight(2)}/><ellipse cx="-12" cy="2" rx="19" ry="26" fill="#82A475"/><circle cx="37" cy="-17" r="9" fill="#AC8A52"/><circle cx="54" cy="-35" r="6" fill="#C5A973"/></g>
   <path d="M500 411 H612" stroke="#A66D22" strokeWidth="3" markerEnd={`url(#${uid}-arrow)`}/><text x="182" y="373" fontSize="20" fill="#41584D">緊密連接管理通道</text><text x="353" y="489" fontSize="20" fill="#41584D">免疫訊號</text><text x="610" y="489" fontSize="20" fill="#41584D">巨噬細胞清理殘骸</text>
  </>:<>
   <path d="M221 91 C170 59 122 79 126 121 C86 128 94 178 124 191 C119 237 173 258 207 233 C245 249 276 216 270 183 C309 156 282 111 253 113 C257 92 238 84 221 91Z" fill="#D1DEC7" stroke={accent(0)} strokeWidth={weight(0)}/>
   <path d="M183 93 C169 120 199 125 178 148 C157 171 183 189 168 220 M218 103 C199 125 238 137 214 159 C193 179 225 196 211 225 M129 136 Q159 132 150 158 M242 146 Q270 155 245 181" fill="none" stroke="#7C9C72" strokeWidth="4" strokeLinecap="round"/>
   <path d="M179 248 C132 302 148 367 208 382 M216 251 C267 312 260 352 223 381" fill="none" stroke={accent(1)} strokeWidth={weight(1)} markerEnd={`url(#${uid}-arrow)`}/>
   <path d="M330 334 Q330 299 366 299 H475 Q507 299 507 332 V407 Q507 439 475 439 H365 Q330 439 330 406Z" fill="#E1CDA7" stroke={accent(1)} strokeWidth={weight(1)}/><path d="M355 328 H476 V351 H365 V375 H475 V402 H361" stroke="#A48250" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
   <path d="M251 381 H310 M300 414 H242" stroke="#A66D22" strokeWidth="3" markerEnd={`url(#${uid}-arrow)`}/><text x="128" y="467" className="medical-svg-label">神經、免疫與代謝雙向聯繫</text>
   <circle cx="690" cy="220" r="112" fill="#F7F6E9" stroke={accent(2)} strokeWidth={weight(2)}/><path d="M690 108 A112 112 0 0 1 690 332Z" fill="#294D43"/>
   {Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return <line key={i} x1={690+Math.sin(a)*95} y1={220-Math.cos(a)*95} x2={690+Math.sin(a)*103} y2={220-Math.cos(a)*103} stroke={i<6?'#E5E7CE':'#7E9478'} strokeWidth="3"/>;})}
   <circle cx="642" cy="216" r="23" fill="#D3A04F"/><path d="M739 192 A26 26 0 1 0 759 231 A23 23 0 0 1 739 192Z" fill="#E6E6C8"/>
   <path d="M690 220 L690 158 M690 220 L727 246" stroke="#B9822B" strokeWidth="5" strokeLinecap="round"/><circle cx="690" cy="220" r="8" fill="#B9822B"/>
   <text x="110" y="65" className="medical-svg-label">大腦的油門與煞車</text><text x="610" y="389" className="medical-svg-label">光線與作息</text><text x="594" y="426" fontSize="20" fill="#41584D">幫生理時鐘準時交班</text>
  </>}
 </svg>;
}
