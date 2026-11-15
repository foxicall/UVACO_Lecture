'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import Dialog from './Dialog';
import VoiceGuide from './VoiceGuide';
import { lecture } from '@/data/lecture-poster';

export default function SpeakerProfileModal({ onClose }: { onClose: () => void }) {
  const [comparison, setComparison] = useState<'medical' | 'nutrition'>('medical');
  const narration = [
    `${lecture.role}，${lecture.speaker}。${lecture.badge}。`,
    `${lecture.title}。${lecture.subtitle}。${lecture.beliefs.join('。')}。`,
    `八大專長：${lecture.specialties.join('；')}。`,
    `學經歷與專業認證：${lecture.credentials.join('；')}。`,
  ].join('');

  return (
    <Dialog title="林煒醫師介紹" onClose={onClose} className="speaker-profile-dialog">
      <section className="physician-identity" aria-labelledby="physician-theme">
        <h3 id="physician-theme">{lecture.title}</h3>
        <p className="physician-philosophy">{lecture.subtitle}</p>
        <div className="physician-name">
          <strong>{lecture.speaker}</strong>
          <span>{lecture.role}</span>
        </div>
        <p className="physician-focus">{lecture.badge}</p>
        <ul className="physician-beliefs">
          {lecture.beliefs.map(belief => <li key={belief}><Check size={22} aria-hidden="true" />{belief}</li>)}
        </ul>
        <VoiceGuide text={narration} label="聽醫師介紹" />
      </section>

      <section className="physician-section" aria-labelledby="physician-specialties">
        <h3 id="physician-specialties">八大專長</h3>
        <ul className="physician-group physician-specialties">
          {lecture.specialties.map(specialty => <li key={specialty}>{specialty}</li>)}
        </ul>
      </section>

      <section className="physician-section" aria-labelledby="physician-credentials">
        <h3 id="physician-credentials">學經歷與專業認證</h3>
        <ul className="physician-group physician-credentials">
          {lecture.credentials.map(credential => <li key={credential}>{credential}</li>)}
        </ul>
      </section>

      <section className="physician-section physician-comparison" aria-labelledby="physician-care">
        <h3 id="physician-care">醫療與營養，一起照顧您</h3>
        <div className="physician-care-switch" role="group" aria-label="認識醫療與營養">
          <button aria-pressed={comparison === 'medical'} onClick={() => setComparison('medical')}>對症醫療</button>
          <button aria-pressed={comparison === 'nutrition'} onClick={() => setComparison('nutrition')}>日常營養</button>
        </div>
        <div className="physician-care-answer" aria-live="polite" aria-atomic="true">
          <h4>{comparison === 'medical' ? '像消防車，及時處理狀況' : '像修復原料，支持正常生理功能'}</h4>
          <p>{comparison === 'medical'
            ? '像消防隊處理眼前的火，也找出起火原因、安排後續照護。醫療照顧與日常保養，一起陪您走下一段路。'
            : '蓋房子需要磚頭與水泥，身體每天保養也需要食物原料。把三餐、活動和休息排好，讓每個夥伴有自己的工作。'}</p>
        </div>
      </section>
    </Dialog>
  );
}
