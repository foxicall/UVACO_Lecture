'use client';
import { useState } from 'react';
import { MapPin, CalendarDays, ArrowUpRight, Copy, Check } from 'lucide-react';
import Dialog from './Dialog';
import VoiceGuide from './VoiceGuide';
import { lecture } from '@/data/lecture-poster';
import visuals from '@/data/generated-visuals.json';

export default function LectureModal({ onClose }: { onClose: () => void }) {
  const [comparison, setComparison] = useState<'medical' | 'nutrition'>('medical');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  async function copyAddress() {
    try { await navigator.clipboard.writeText(lecture.address); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  }
  const narration = `${lecture.badge}。${lecture.title}。${lecture.subtitle}。十一月十五日，星期日，上午十點。地點：${lecture.address}。主講人：${lecture.speaker}。${lecture.invitation}`;
  return <Dialog title="11/15 講座資訊" onClose={onClose} className="lecture-dialog">
    <div className="lecture-poster"><div><span className="event-badge">{lecture.badge}</span><h3>{lecture.title}</h3><p>{lecture.subtitle}</p></div><img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(visuals.pillarVisuals[0].svg)}`} alt="象徵營養與日常照護的植物意象" width={150} height={150} /></div>
    <div className="event-facts"><p><CalendarDays size={25} /><strong>{lecture.date} {lecture.time}</strong></p><p><MapPin size={25} /><span>{lecture.address}</span></p></div>
    <p className="lecture-invitation">{lecture.invitation}</p>
    <div className="event-actions"><a className="button-link primary" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lecture.address)}`} target="_blank" rel="noopener noreferrer">開啟地圖 <ArrowUpRight size={21} /></a><button onClick={copyAddress}>{copied ? <Check size={21} /> : <Copy size={21} />}{copied ? '地址已複製' : '複製地址'}</button></div>
    {copyError && <p role="status">這個瀏覽器無法複製，請長按上方地址選取文字。</p>}
    <VoiceGuide text={narration} />
    <section className="speaker-profile"><h3>主講人・{lecture.speaker}</h3><p>從神經、疼痛與功能營養醫學出發，一起認識醫療照護與日常營養的關係。</p><h4>八大專長</h4><ul className="speaker-specialties">{lecture.specialties.map(s => <li key={s}>{s}</li>)}</ul><details open><summary>完整學經歷與專業認證</summary><ul className="speaker-credentials">{lecture.credentials.map(s => <li key={s}>{s}</li>)}</ul><p className="small-copy">{lecture.credentialNote}</p></details></section>
    <section className="lecture-comparison"><h3>醫療與營養，一起照顧您</h3><div role="group" aria-label="認識醫療與營養"><button aria-pressed={comparison === 'medical'} onClick={() => setComparison('medical')}>對症醫療</button><button aria-pressed={comparison === 'nutrition'} onClick={() => setComparison('nutrition')}>日常營養</button></div><div className="learning-answer" aria-live="polite"><h4>{comparison === 'medical' ? '像消防車，及時處理狀況' : '像修復原料，支持正常生理功能'}</h4><p>{comparison === 'medical' ? '講座以消防車救火比喻症狀處理。實際醫療也可以治療病因與預防疾病；神經阻斷、微電流等方式，應由醫師個別評估。' : '營養是身體維持與修復組織需要的原料。均衡飲食是基礎；保健品不能取代疾病治療，也不代表吃了就能修復受損神經。'}</p></div><ul className="lecture-beliefs">{lecture.beliefs.map(b => <li key={b}><Check size={22} />{b}</li>)}</ul></section>
  </Dialog>;
}
