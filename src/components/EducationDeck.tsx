'use client';
import { useState } from 'react';
import { BookOpen, Brain, Sprout, Building2, ArrowRight } from 'lucide-react';
import Dialog from './Dialog';
import VoiceGuide from './VoiceGuide';
import sources from '@/data/source-materials.json';
import { sourceNote } from '@/data/uvaco-products';

const metabolism = [
  { name: '營養原料', title: '從均衡飲食開始', text: '甲硫胺酸、膽鹼等營養素參與正常代謝。食物提供原料，但多吃某一種補充品，不代表修復速度就會更快。', product: '995' },
  { name: '代謝循環', title: 'B 群各有角色', text: '葉酸與 B12 參與同半胱胺酸再甲基化，B6 參與轉硫途徑。這是生理路徑，不等於組合產品能直接回收「廢氣」、製造快樂荷爾蒙或治療神經退化。', product: '360' },
  { name: '神經研究', title: '研究與療效要分清', text: '猴頭菇成分與神經營養因子的研究值得認識。動物或細胞研究的觀察，不能直接證明活逸康能修復人的髓鞘或預防失智。', product: 'huoyi' },
];
export default function EducationDeck({ onClose, onNavigate }: { onClose: () => void; onNavigate: (id: string) => void }) {
  const [tab, setTab] = useState(0);
  const [memory, setMemory] = useState(0);
  const [step, setStep] = useState(0);
  const titles = ['大腦森林', '營養與代謝', '認識葡眾'];
  const active = metabolism[step];
  return <Dialog title="健康知識館" onClose={onClose} className="education-dialog">
    <div className="education-nav" role="tablist" aria-label="健康知識主題">{titles.map((t, i) => { const Icon = [Brain, Sprout, Building2][i]; return <button key={t} role="tab" aria-selected={tab === i} tabIndex={tab === i ? 0 : -1} id={`edu-tab-${i}`} aria-controls={`edu-panel-${i}`} onClick={() => setTab(i)} onKeyDown={e => { const next = e.key === 'ArrowRight' ? (i + 1) % 3 : e.key === 'ArrowLeft' ? (i + 2) % 3 : -1; if (next >= 0) { e.preventDefault(); setTab(next); document.getElementById(`edu-tab-${next}`)?.focus(); } }}><Icon size={22} />{t}</button>; })}</div>
    <div role="tabpanel" tabIndex={0} id={`edu-panel-${tab}`} aria-labelledby={`edu-tab-${tab}`}>
    {tab === 0 && <section className="education-content"><h3>記憶的變化，值得被好好理解</h3><p>把大腦想成森林，健康照護像每天照顧土壤、光線與水分。規律活動、睡眠、社交與控制三高，是日常可以開始的事。</p><div className="memory-choice" role="group" aria-label="了解記憶變化"><button aria-pressed={memory === 0} onClick={() => setMemory(0)}>偶爾忘記，提醒後想起</button><button aria-pressed={memory === 1} onClick={() => setMemory(1)}>反覆忘記，已影響生活</button></div><div className="learning-answer" aria-live="polite"><h4>{memory === 0 ? '先觀察，不急著貼標籤' : '陪伴就醫，一起找原因'}</h4><p>{memory === 0 ? '偶爾忘記可能與分心、睡不好或壓力有關；提醒後能想起，是可提供醫師參考的線索，不能單靠這點排除失智。' : '若反覆問同樣問題、在熟悉地方迷路，或處理日常事情變困難，請安排醫療評估；突然改變則需要及時就醫。'}</p></div><h3>火柴與木柴，是理解的比喻</h3><p>來源簡報把 Aβ 比喻成火柴、Tau 比喻成木柴，幫助認識神經退化研究；實際病程比單一燃燒比喻複雜，也不代表補充品能熄滅這把火。</p><details><summary>如何理解 51%、血液檢測與混合型數據？</summary><p>簡報提到症狀前 10–20 年的病理變化、CTAD 2025 的「延緩 51%」、p-tau217「超過 90%」及混合型「26.3%」。這些數字必須連同研究族群、治療方式、比較組與檢測條件閱讀，不能套用成葡眾產品的效果。</p><p>p-tau217 是醫療評估工具之一，並非任何人抽一滴血就能自行確診；需由醫師結合病史及其他評估解讀。</p></details><VoiceGuide text="記憶改變值得被好好理解。若反覆忘記已影響生活，請安排醫療評估。研究數據需連同族群、治療方式與比較組閱讀，不可當成保健品的效果。" /></section>}
    {tab === 1 && <section className="education-content"><h3>認識身體的代謝循環</h3><p>點選三個環節，看營養、代謝與神經研究如何相互關聯。</p><div className="metabolism-route">{metabolism.map((s, i) => <button key={s.name} aria-pressed={step === i} onClick={() => setStep(i)}><Sprout size={26} />{s.name}{i < 2 && <ArrowRight className="route-arrow" size={22} />}</button>)}</div><div className="learning-answer" aria-live="polite"><h4>{active.title}</h4><p>{active.text}</p><button className="primary" onClick={() => { onNavigate(active.product); onClose(); }}>前往相關產品島 <ArrowRight size={20} /></button></div><h3>健康金三角</h3><p>發炎反應、營養代謝與自律神經會互相影響；這是理解身體的框架，不能用單一因果圖替每個人的症狀做診斷。</p><VoiceGuide text={`${active.title}。${active.text}`} /></section>}
    {tab === 2 && <section className="education-content"><h3>葡萄王生技 × 葡眾</h3><p>從發酵技術到日常營養。以下企業沿革與數據，依提供的公司簡報整理。</p><div className="corporate-years"><div><strong>1969</strong><span>葡萄王生技創立</span></div><div><strong>1993</strong><span>葡眾創立</span></div></div><dl className="company-facts"><div><dt>研發與發酵</dt><dd>簡報列有 30 年以上研發經驗、234+ 項專利及 356+ 面國際發明獎牌。</dd></div><div><dt>品質系統</dt><dd>簡報列有 PIC/S GMP 與 ISO/IEC 17025 檢驗中心；各項認證適用範圍依所屬廠區、實驗室及證書。</dd></div><div><dt>葡眾里程</dt><dd>1998 年轉型直銷；簡報列 DSN 全球百大第 33 名、連續三年營收逾百億，以及 22 萬名直銷商。排名與人數對應簡報統計期間。</dd></div></dl><p className="small-copy">企業認證、獎項與營收反映不同面向，不能用來證明個別產品的疾病治療效果。</p><VoiceGuide text="葡萄王生技於一九六九年創立，葡眾於一九九三年創立。企業簡報介紹發酵研發、品質系統與經營里程。認證與獎項不能取代個別產品的臨床證據。" /></section>}
    </div><details className="education-source"><summary><BookOpen size={20} />來源與完整擷取文字</summary><p className="small-copy">{sourceNote}</p><p className="small-copy">文件：Nurturing Your Brain Forest、公司亮點及榮譽、產品優越性春訓等簡報，由使用者提供文字擷取。</p><div className="source-text">{sources.education}</div></details>
  </Dialog>;
}
