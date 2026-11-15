export type PillarId = 'repair' | 'neural' | 'inflammation' | 'autonomic';
export const lecture = {
  title: '找回身體的自癒力',
  subtitle: '醫療改善症狀，營養打造健康',
  badge: '精準營養與神經修復領航',
  role: '主講／總顧問',
  speaker: '林煒醫師',
  beliefs: ['營養是修復的原料', '健康不能只靠治療'],
  specialties: ['疼痛／頭痛治療', '再生醫學', '周邊神經阻斷術', '骨骼肌肉超音波', '動作障礙疾病評估及治療', '功能營養醫學', '頻率共振微電流治療', '中風相關治療與復健'],
  credentials: [
    '英爵診所主任醫師',
    '生生優動疼痛科板橋分院院長',
    '彰濱秀傳紀念醫院神經功能室主任',
    '台北榮民總醫院神經內科醫師',
    '林口長庚醫院神經內科醫師',
    '中華民國神經科專科醫師',
    '中華民國疼痛專科醫師',
    '中華民國輔助醫學專科醫師',
    'ECFMG Certificate（美國國外醫學畢業生教育委員會證書）',
    'CIPS（Certified Interventional Pain Sonologist）超音波介入疼痛治療國際認證',
  ],
  credentialNote: '醫師簡歷依提供資料整理。ECFMG 證書是國際醫學畢業生資格認證，不等同美國各州的獨立行醫執照。',
  source: '葡眾/lecture-poster-source.md',
} as const;

export const pillars: { id: PillarId; name: string; color: string; theme: string; introduction: string; products: string[]; motif: string }[] = [
  { id: 'repair', name: '人體修復能力', color: '#D7B66F', theme: '營養是修復的原料', introduction: '從吃得均衡、補足需要開始，認識身體維持正常功能所需的營養。', products: ['995', '360', 'lisheng'], motif: 'a seed opening into a branching botanical cellular fountain' },
  { id: 'neural', name: '神經修復', color: '#A6C7C2', theme: '關心神經，照顧生活品質', introduction: '像照顧森林裡的小路，從活動、睡眠與每天的飲食開始。', products: ['huoyi', 'antrodia-drops', 'dikang'], motif: 'an intricate neural forest with protective branching canopy' },
  { id: 'inflammation', name: '慢性發炎', color: '#99B784', theme: '從日常照顧身體的平衡', introduction: '像廚房收工後還要打掃，一起認識身體的防禦與清潔隊。', products: ['kanger', 'kanger-n', 'antrodia'], motif: 'a flourishing probiotic garden encircled by botanical leaves' },
  { id: 'autonomic', name: '自律神經', color: '#C7B599', theme: '為身心留一點休息的空間', introduction: '從規律作息、睡眠與壓力管理，認識身體白天與夜晚的節奏。', products: ['kangbei', 'kangyue', 'ningkang'], motif: 'a moonlit pavilion with balanced botanical branches' },
];
export const pillarById = new Map(pillars.map(p => [p.id, p]));
export const productPillar = new Map(pillars.flatMap(p => p.products.map(id => [id, p.id] as const)));
export const lectureOrder = pillars.flatMap(p => p.products);
export const lectureCoordinates: Record<string, [number, number]> = {
  '995': [-1, -2], '360': [-2, -1], lisheng: [-2, -2],
  huoyi: [2, -2], 'antrodia-drops': [3, -2], dikang: [2, -1],
  kanger: [1, 1], 'kanger-n': [2, 1], antrodia: [1, 2],
  kangbei: [-2, 1], kangyue: [-3, 2], ningkang: [-2, 2],
};
