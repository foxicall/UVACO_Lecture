export interface GutBrainNode {
  id: string;
  label: string;
  detail: string;
  cofactor?: string;
}

export interface GutBrainTrack {
  id: string;
  title: string;
  nodes: GutBrainNode[];
}

export interface GutDominoAxis {
  id: string;
  title: string;
  metaphor: string;
  detail: string;
  tracks: GutBrainTrack[];
  productIds: string[];
}

/** Prose remains product-free in the educational acts. Product badges open
 * ingredient information, not a tested treatment for the depicted pathway.
 * Independent tracks avoid drawing tissue-specific effects as one serial chain.
 */
export const gutBrainModes = {
  stress: {
    label: '🚨 當腸道防線承受壓力',
    summary: '看紅色訊號如何連到免疫、粒線體與遠端器官。這些路徑會互相影響，並不是每次腸道不舒服，都會依序發生四種病變。',
  },
  support: {
    label: '✨ 認識 5R 腸道照護',
    summary: '跟著綠色訊號認識菌相、食物纖維、營養與作息的分工。5R 把照護整理成五個步驟；動畫呈現生理支持方向，個案數據另外依原始紀錄閱讀。',
  },
};

export const gutBrainKpis: { id: string; value: string; label: string; context: string; source: string; url: string }[] = [
  {
    id: 'taiwan-healthspan', value: '7.8 年', label: '台灣壽命與健康壽命的差距',
    context: '2023 年平均壽命 80.23 歲、健康平均餘命 72.45 歲，相差約 7.8 年。這是預期不健康就診年數的統計，不能解讀為人人都會臥床 7.8 年。',
    source: '衛福部統計處・2023 年健康平均餘命',
    url: 'https://dep.mohw.gov.tw/DOS/lp-5082-113.html',
  },
  {
    id: 'global-healthspan', value: '9.6 年', label: '2019 年全球健康壽命差距',
    context: '2024 年發表的研究分析 WHO 183 個會員國資料，報告 2019 年全球整體差距 9.6 年。它不是 2024 年的新數值，也不是 183 國差距的簡單平均；與台灣 2023 年統計的年份及方法不同。',
    source: 'JAMA Network Open・2024 年研究，2019 年資料',
    url: 'https://pubmed.ncbi.nlm.nih.gov/39661386/',
  },
  {
    id: 'gut-surface', value: '約 32 m²', label: '消化道黏膜的估計面積',
    context: '2014 年形態測量研究重新估算消化道黏膜表面積約 32 平方公尺。這有助想像防線的規模；實際面積依個人、腸道結構與估算方法而變動。',
    source: '消化道表面積重新估算・2014 年研究',
    url: 'https://pubmed.ncbi.nlm.nih.gov/24694282/',
  },
];

export const gutBarrierLayers: { id: 'mucus' | 'junctions' | 'immune'; title: string; detail: string }[] = [
  {
    id: 'mucus', title: '第一層・黏液保護層',
    detail: '杯狀細胞製造黏液，讓腸道內容物與上皮保持適當距離。食物、菌相與局部發炎會影響這層保護，不是把所有微生物都清掉才健康。',
  },
  {
    id: 'junctions', title: '第二層・細胞間的拉鍊',
    detail: 'Occludin、Claudins 與 ZO-1 等蛋白共同調節緊密連接。部分研究描述 Zonulin 經 PAR2／EGFR、PKCα 影響連接；麩質的影響取決於疾病與個人情境，不能推論人人都應戒麩質。商業 Zonulin 檢驗也不能單獨證明腸道通透性。',
  },
  {
    id: 'immune', title: '第三層・黏膜免疫守門員',
    detail: '分泌型免疫球蛋白 sIgA、免疫細胞與調節性 T 細胞 Treg，一起辨識威脅並維持耐受。適當免疫是協調防禦與和平共處，不是把反應越推越高。',
  },
];

export const gutDominoAxes: GutDominoAxis[] = [
  {
    id: 'innate-immunity', title: '骨牌一・免疫警報的兩道訊號',
    metaphor: '先把警報設備準備好，再由另一個訊號按下啟動鈕。',
    detail: 'LPS 辨識與發炎體組裝是兩個階段。菌相與可發酵纖維可透過交互餵養影響丁酸供應；並非每一株乳酸菌都直接製造丁酸，也不能由菌數推定屏障已經修復。',
    tracks: [
      { id: 'immune-priming', title: '訊號一・準備發炎組件', nodes: [
        { id: 'immune-lps', label: 'LPS 內毒素', detail: 'LPS 是革蘭氏陰性菌外膜的成分。當它到達不適當的位置，可引發先天免疫辨識；血中檢測值也受採樣與方法影響。' },
        { id: 'immune-receptor', label: 'TLR4／MD-2', cofactor: 'LBP、CD14 協助辨識', detail: 'LPS 結合蛋白 LBP、CD14 與 TLR4／MD-2 共同參與辨識，接續啟動細胞內訊號。' },
        { id: 'immune-nfkb', label: 'NF-κB 入核', cofactor: 'MyD88 → IKK → IκB 降解', detail: 'MyD88 等接力可活化 IKK，使抑制蛋白 IκB 被降解，讓 NF-κB 進入細胞核。' },
        { id: 'immune-components', label: '預備 NLRP3 與前驅物', detail: '細胞增加 NLRP3、pro-IL-1β 及部分發炎相關基因表現，也可產生 TNF-α、IL-6 等訊號。準備組件不等於發炎體已組裝。' },
      ] },
      { id: 'immune-triggering', title: '訊號二・組裝與細胞焦亡', nodes: [
        { id: 'immune-trigger', label: 'K⁺ 外流等刺激', detail: '鉀離子外流、粒線體壓力等刺激，可在已準備的細胞中促進 NLRP3 發炎體組裝；不同模型涉及的觸發因素不完全相同。' },
        { id: 'immune-inflammasome', label: 'NLRP3 發炎體', cofactor: 'NLRP3 ＋ ASC ＋ procaspase-1', detail: '感測蛋白與接頭蛋白聚集，促使 procaspase-1 活化，形成下一步的蛋白切割能力。' },
        { id: 'immune-caspase', label: 'Caspase-1 切割', detail: 'Caspase-1 促進 IL-1β、IL-18 成熟，也切割 Gasdermin D（GSDMD），讓其片段形成細胞膜孔。' },
        { id: 'immune-pyroptosis', label: 'GSDMD 膜孔與焦亡', detail: '膜孔可導致發炎性細胞死亡，稱為細胞焦亡。SASP 則是衰老細胞的分泌表型；兩者可以互相影響，但不是同一件事。' },
      ] },
    ],
    productIds: ['kanger', 'kanger-n'],
  },
  {
    id: 'mitochondrial-stress', title: '骨牌二・發電廠與警報迴路',
    metaphor: '發電設備受壓時，不只電量會變，外洩的材料也可能被當成警報。',
    detail: '發炎與粒線體壓力能互相放大，程度依組織與情境而異。發酵胺基酸屬營養原料；食品 SOD 樣活性不等於細胞內酵素，4-AAQB 也不同於電子傳遞鏈的輔酶 Q10。',
    tracks: [
      { id: 'mito-energy', title: '能量與氧化壓力', nodes: [
        { id: 'mito-inflammatory-state', label: '發炎與代謝壓力', detail: 'TNF-α 等訊號在特定環境下可改變粒線體功能；並非每次免疫反應都會讓電子傳遞鏈停止。' },
        { id: 'mito-electrons', label: '電子傳遞與 mtROS', detail: '電子傳遞失衡可增加活性氧 mtROS。複合體 I、III 是重要研究來源；氧化壓力與膜結構也會互相影響。' },
        { id: 'mito-atp', label: '膜梯度與 ATP 供應', detail: '複合體 I、III、IV 建立質子梯度，ATP 合成酶 V 利用梯度工作。持續的 mPTP 開啟可破壞膜電位，影響 ATP 供應。' },
      ] },
      { id: 'mito-dna-alarm', title: '細胞質中的 DNA 警報', nodes: [
        { id: 'mito-membrane-damage', label: '粒線體膜受損', detail: '粒線體內容物外洩涉及不同膜結構與機制，包括特定情境下的 BAX／BAK 等通道；不能把 mPTP 簡化成所有 mtDNA 唯一的出口。' },
        { id: 'mito-cytosolic-dna', label: 'mtDNA 出現在細胞質', detail: '當粒線體 DNA 出現在不適當的位置，可能被細胞的 DNA 感測系統辨識為危險訊號。' },
        { id: 'mito-cgas', label: 'cGAS → cGAMP → STING', detail: 'cGAS 辨識細胞質 DNA 後產生 cGAMP，進而活化 STING，接續影響 TBK1／IRF3 等訊號及第一型干擾素反應。' },
      ] },
    ],
    productIds: ['995', 'antrodia-drops'],
  },
  {
    id: 'cellular-recycling', title: '骨牌三・合成與回收的節奏',
    metaphor: '工廠要生產，也要整理；不同細胞的開工與回收時機並不一樣。',
    detail: 'mTORC1、NAD⁺／SIRT1 與 AMPK 是相關但不同的調節系統。免疫細胞中持續活化的合成訊號，與肌肉對營養反應變弱可以同時存在，不能把全身畫成同一個開關。',
    tracks: [
      { id: 'recycling-mtor', title: '發炎情境下的 mTORC1', nodes: [
        { id: 'recycling-ikk', label: 'TNF-α／IKKβ 訊號', detail: '部分實驗模型中，發炎訊號經 IKKβ 影響 TSC 複合體與下游代謝調節。' },
        { id: 'recycling-tsc', label: 'TSC1／TSC2 調節', detail: 'TSC 複合體調控 Rheb；特定磷酸化改變可降低其對 mTORC1 的抑制。反應依刺激、細胞與時間而不同。' },
        { id: 'recycling-mtor-node', label: 'mTORC1 與 ULK1', detail: 'mTORC1 可抑制 ULK1 相關自噬啟動，同時參與蛋白質合成。生理上需要在營養、活動與回收之間協調。' },
        { id: 'recycling-autophagy', label: '自噬與組件清理', detail: '自噬把細胞組件送往溶酶體處理；持續失衡可能使受損物累積。自噬流量的判斷需要多個步驟，不能由單一蛋白推定全部停工。' },
      ] },
      { id: 'recycling-nad', title: 'NAD⁺ 與 SIRT1 支路', nodes: [
        { id: 'recycling-cd38', label: 'CD38 與 NAD⁺ 消耗', detail: '老化與發炎研究顯示，部分免疫細胞的 CD38 活性增加可促進 NAD⁺ 消耗；NAD⁺ 濃度也取決於合成與其他消耗途徑。' },
        { id: 'recycling-sirt1', label: 'NAD⁺ 供應與 SIRT1', detail: 'SIRT1 是依賴 NAD⁺ 的去乙醯化酶，參與代謝、壓力反應與轉錄調節。B3 可參與 NAD⁺ 的營養供應，但補充量不能直接換算成細胞效果。' },
        { id: 'recycling-pgc1', label: 'PGC-1α 與粒線體新生', detail: 'SIRT1 等訊號可調節 PGC-1α，協調核與粒線體相關基因的表現。粒線體新生和受損組件清除需要共同配合。' },
      ] },
      { id: 'recycling-energy-sensing', title: 'AMPK 的能量感測支路', nodes: [
        { id: 'recycling-energy-ratio', label: 'AMP／ADP 與 ATP 狀態', detail: 'AMPK 感受能量壓力，涉及 AMP／ADP 結合與上游激酶調節。它不是直接依賴 NAD⁺ 才能工作的酵素。' },
        { id: 'recycling-ampk', label: 'AMPK 活性調節', detail: '能量不足時，AMPK 常可被活化，以調節耗能與產能活動。不能直接把 NAD⁺ 下降畫成 AMPK 必然同步下降。' },
        { id: 'recycling-energy-coordination', label: '回收與代謝協調', detail: 'AMPK 可經 ULK1、mTORC1 與 PGC-1α 等不同下游協調自噬、合成與氧化代謝；這些是平行的調控作用。' },
      ] },
    ],
    productIds: ['360', 'antrodia'],
  },
  {
    id: 'distal-organs', title: '骨牌四・訊號到達遠端器官',
    metaphor: '腸道不是孤島，訊息會經由血液、神經與代謝物傳到其他地方。',
    detail: '腸腦軸與腸肌軸各有自己的反應。循環、活動與腎臟的體液調節也影響整體狀態；腸道症狀不能單獨證明大腦受損或肌少症。',
    tracks: [
      { id: 'distal-brain-link', title: '延伸到腸腦軸', nodes: [
        { id: 'distal-brain-messages', label: '免疫與神經訊息', detail: '周邊訊號可經迷走神經、血管內皮與代謝物等路徑和大腦溝通，不必全部直接穿過血腦屏障。' },
        { id: 'distal-brain-response', label: '腦部訊號與色胺酸分流', detail: '大腦免疫細胞與色胺酸代謝回應整體環境。往下可分別閱讀屏障反應、血清素合成與犬尿胺酸路徑。' },
      ] },
      { id: 'distal-muscle-link', title: '延伸到腸肌軸', nodes: [
        { id: 'distal-muscle-messages', label: '營養、發炎與活動', detail: '營養吸收、免疫環境、活動量與疾病狀態，共同影響肌肉的原料供應與反應。' },
        { id: 'distal-muscle-response', label: '肌肉合成與分解', detail: '肌力與肌肉量反映長期合成、分解及活動的平衡。往下可分別閱讀分解訊號、合成代謝阻抗與消化評估。' },
      ] },
    ],
    productIds: ['dikang', 'lisheng'],
  },
];

export const gutDistalPathways: { id: 'brain' | 'muscle'; title: string; intro: string; tracks: GutBrainTrack[]; productIds: string[] }[] = [
  {
    id: 'brain', title: '路徑一・腸道與大腦的雙向對話',
    intro: '保全需要辨識真正的警報，原料也有不同去路。腸腦軸涉及免疫、神經及代謝物，不是腸道拉鍊鬆了，大腦就一定跟著破洞。',
    tracks: [
      { id: 'brain-barrier', title: '血腦屏障與小膠質細胞', nodes: [
        { id: 'brain-peripheral-signals', label: '周邊免疫訊號', detail: 'LPS 可在周邊引發細胞激素反應，經血管內皮及神經等途徑影響大腦。並非所有訊號都要以完整分子直接穿越血腦屏障。' },
        { id: 'brain-bbb', label: '血腦屏障的調節', detail: '特定發炎模型可出現屏障功能變化；實際人體情況還受到血管、疾病與其他因素影響。這與商業腸道 Zonulin 檢驗不是同一種測量。' },
        { id: 'brain-microglia', label: '小膠質細胞反應', detail: '小膠質細胞參與防禦、清除與突觸調節；TREM2 相關訊號也涉及其存活與代謝。反應有多種狀態，不只簡單分成好與壞。' },
        { id: 'brain-synapses', label: '突觸與病理網絡', detail: '在部分病理模型中，持續發炎可影響突觸維持，並與 Aβ、Tau 病理交互作用。這些機制不能單獨用來診斷記憶或情緒症狀。' },
      ] },
      { id: 'brain-serotonin', title: '血清素與褪黑激素合成', nodes: [
        { id: 'brain-tryptophan', label: '色胺酸', detail: '色胺酸是必需胺基酸，參與蛋白質合成及不同代謝支路。腸道與大腦各有自己的血清素合成環境。' },
        { id: 'brain-5htp', label: '5-HTP', cofactor: 'TPH ＋ BH4、鐵、氧', detail: '色胺酸羥化酶 TPH 使用四氫生物蝶呤 BH4、鐵與氧，把色胺酸轉成 5-HTP；B6 的工作站在下一步。' },
        { id: 'brain-serotonin-node', label: '血清素 5-HT', cofactor: 'AADC ＋ B6／PLP', detail: '芳香族胺基酸脫羧酶 AADC 使用活性 B6 形成血清素。周邊血清素不能直接穿過血腦屏障補給大腦。' },
        { id: 'brain-melatonin', label: '褪黑激素', cofactor: 'AANAT → ASMT；使用 SAM', detail: '松果體在晝夜節律調控下，依序利用乙醯輔酶 A 與 SAM 參與轉換。原料、光線、作息及酵素共同影響夜間訊號。' },
      ] },
      { id: 'brain-kynurenine', title: '犬尿胺酸的正常代謝與分流', nodes: [
        { id: 'brain-kyn-trp', label: '色胺酸分配', detail: '犬尿胺酸原本就是色胺酸的主要代謝去路；不是健康時完全不走、發炎時才突然搶走快樂原料。' },
        { id: 'brain-kyn', label: '犬尿胺酸 KYN', cofactor: 'IDO1／TDO2 等步驟', detail: '色胺酸先形成 N-甲醯犬尿胺酸，再形成犬尿胺酸。發炎可上調 IDO1；肝臟 TDO2 也受到其他代謝與荷爾蒙訊號影響。' },
        { id: 'brain-quin', label: '喹啉酸 QUIN', cofactor: 'KMO 等下游分流', detail: '特定細胞與酵素可形成喹啉酸，參與 NAD⁺ 合成；另一支路可形成犬尿喹啉酸 KYNA，作用不同。不能把整條犬尿胺酸路徑都視為毒性。' },
        { id: 'brain-nmda', label: 'NMDA 與興奮性', detail: '喹啉酸濃度過高可過度刺激 NMDA 受體，增加興奮毒性。正常 NMDA 訊號則參與學習與可塑性，效果依濃度與環境而異。' },
      ] },
    ],
    productIds: ['kangyue', 'kangbei', 'huoyi'],
  },
  {
    id: 'muscle', title: '路徑二・肌肉的原料與開工訊號',
    intro: '肌肉工地需要原料，也需要活動與合適的生理環境。合成代謝阻抗是肌肉對刺激反應變弱，與蛋白質消化不良是兩種不同問題。',
    tracks: [
      { id: 'muscle-breakdown', title: '慢性發炎與蛋白質分解', nodes: [
        { id: 'muscle-inflammatory-signals', label: '長期發炎與不活動', detail: '疾病、長期發炎與不活動可改變肌肉蛋白質周轉；不能把運動時短暫的 IL-6 訊號都等同慢性有害發炎。' },
        { id: 'muscle-nfkb-foxo', label: 'NF-κB／FoxO 等訊號', detail: '不同上游路徑可調節肌肉分解相關基因。MuRF1 與 Atrogin-1 並非都由同一個訊號以完全相同方式控制。' },
        { id: 'muscle-e3', label: 'MuRF1／Atrogin-1', detail: '這些 E3 泛素連接酶參與替蛋白質加上處理標記，與其他酵素一起影響肌肉蛋白質周轉。' },
        { id: 'muscle-proteasome', label: '蛋白酶體分解', detail: '被標記的蛋白質可交由蛋白酶體處理。正常分解也是更新的一部分，長期分解超過合成才會造成淨流失。' },
      ] },
      { id: 'muscle-synthesis', title: '吸收與合成反應分開看', nodes: [
        { id: 'muscle-food-protein', label: '蛋白質與胺基酸原料', detail: '完整蛋白質需要消化；短鏈胜肽與游離胺基酸的處理方式不同，但仍需經吸收、運輸與代謝分配。' },
        { id: 'muscle-absorption', label: '腸道吸收與運輸', detail: '游離胺基酸不需要先切開蛋白質鏈，仍靠腸道轉運系統吸收，不能直接穿透腸壁、跳過所有調節。' },
        { id: 'muscle-stimulus', label: '胺基酸與阻力活動', detail: '足夠必需胺基酸、白胺酸與阻力活動，和整體能量、荷爾蒙及健康狀態共同提供肌肉合成刺激。' },
        { id: 'muscle-mtor', label: 'mTORC1 與合成反應', detail: '老化或疾病可使肌肉對營養和活動的反應減弱，稱為合成代謝阻抗。吃進游離胺基酸不代表必然繞過這種阻抗。' },
      ] },
      { id: 'muscle-digestion-assessment', title: '另外評估消化酵素不足', nodes: [
        { id: 'muscle-digestive-symptoms', label: '症狀與營養狀態', detail: '脂肪便、體重下降或特定胰臟疾病，才是評估外分泌功能的重要背景。不能只因為年長或腿無力，就認定胰臟酵素不足。' },
        { id: 'muscle-elastase', label: '糞便胰彈性蛋白酶', detail: '固體或半固體糞便的 elastase-1 小於 100 μg/g，較支持胰臟外分泌不足；100–200 μg/g 屬不確定區間。水樣便稀釋可能使結果偏低。' },
        { id: 'muscle-enzyme-care', label: '依原因處理消化', detail: '確認胰臟外分泌不足後，照護包含適當的胰臟酵素替代治療與營養評估。鳳梨酵素、木瓜酵素是不同來源的蛋白酶，不能替代胰臟酵素製劑。' },
      ] },
    ],
    productIds: ['995', 'kanger-n', '360'],
  },
];

export const gutRepairSteps: { id: string; title: string; intro: string; detail: string; productIds: string[] }[] = [
  {
    id: 'remove', title: '1. Remove・減少已辨識的負荷',
    intro: '先找出真正的來源，再決定需要移除什麼。',
    detail: '處理可確認的感染、過敏或環境暴露，並檢視飲食與用藥。潮濕漏水要從居家來源處理；尿中黴菌代謝物的數字，不能單獨診斷中毒，也不能據此認定飲品能排出特定毒素。',
    productIds: ['lisheng', 'antrodia'],
  },
  {
    id: 'replace', title: '2. Replace・補足確實缺少的功能',
    intro: '消化出了問題，要先分清楚是哪一道工序。',
    detail: '依症狀與檢驗評估消化及營養不足。鳳梨與木瓜酵素可用來認識蛋白酶原料；胰臟外分泌不足需要針對胰臟酵素缺口處理，兩者不畫成等效替代。',
    productIds: ['kanger-n'],
  },
  {
    id: 'reinoculate', title: '3. Reinoculate・照顧菌相生態',
    intro: '好菌也需要食物與合適的環境，不只看菌數。',
    detail: '菌株、益生元與可發酵纖維共同影響菌群。部分乳酸菌的代謝物可供其他產丁酸菌使用，稱為交互餵養；出廠菌數、保存存活率與特定人體結果是不同資訊。',
    productIds: ['kanger', 'kanger-n', 'kangyue'],
  },
  {
    id: 'repair', title: '4. Repair・供應屏障維持原料',
    intro: '細胞持續更新，需要足夠營養與合適的局部環境。',
    detail: '蛋白質、胺基酸與整體營養參與上皮更新。初乳成分可延伸到黏膜研究，但口服免疫球蛋白的作用要依研究族群與終點理解，不能直接當成黏膜補丁。',
    productIds: ['995', 'ningkang'],
  },
  {
    id: 'rebalance', title: '5. Rebalance・重整作息與活動',
    intro: '把睡眠、壓力調節、飲食與肌力活動放回日常。',
    detail: '規律睡眠、活動與心理支持，參與自律神經及代謝節奏。色胺酸是合成原料；口服 GABA 與神經元自行製造的 GABA，吸收及作用情境不同。',
    productIds: ['kangbei', '360'],
  },
];

export interface GutCaseMeasurement {
  id: string;
  label: string;
  before: number;
  after: number;
  /** A censored result uses a reporting bound for the bar, never an exact result. */
  afterLabel?: string;
  unit: string;
  note: string;
}

export const gutCaseStudy: {
  title: string;
  duration: string;
  context: string;
  measurements: GutCaseMeasurement[];
  ages: { id: string; label: string; change: number; unit: string; note: string }[];
  /** Original lecture document page numbers, not exported public PDF indexes. */
  sourcePages: number[];
} = {
  title: '一位個案・多面向方案的追蹤紀錄',
  duration: '整體約 8 個月',
  context: '匿名原始講義記錄一位個案，初始檢查在 2025 年 6–8 月，追蹤在 2026 年 1–2 月；其中糞便檢查相隔約 6 個月。方案同時包含多項其他配方、飲食、活動、睡眠與環境來源處理，並非本頁產品的人體試驗。部分數值下降，但短鏈脂肪酸、丁酸與胰彈性蛋白酶也下降，仍有需要追蹤的問題；無法把變化歸因於單一產品。',
  measurements: [
    {
      id: 'zonulin', label: '屏障相關指標 Zonulin', before: 112, after: 81, unit: 'ng/mL',
      note: '2025/8 → 2026/2，原始第 46 頁。低於該實驗室列示的 107 門檻，仍不能單靠商業 Zonulin 檢驗證明緊密連接已關閉或通透性已恢復。',
    },
    {
      id: 'calprotectin', label: '糞便鈣衛蛋白', before: 57.7, after: 28.1, unit: 'mg/kg',
      note: '2025/8 → 2026/2，原始第 46 頁。兩次皆低於該報告列示的 100 門檻；數值下降不能直接換算成「腸道發炎減半」。',
    },
    {
      id: 'mycophenolic-acid', label: '尿中黴酚酸濃度', before: 11989, after: 37.8, unit: 'ng/g 肌酸酐',
      note: '2025/6 → 2026/2，原始第 44 頁。這是經肌酸酐校正的尿液濃度變化，不是全身毒素清除率；單一尿液檢驗也不能證明黴菌暴露就是症狀原因。',
    },
    {
      id: 'total-scfa', label: '糞便短鏈脂肪酸總量', before: 93.5, after: 21.2, unit: 'μmol/g',
      note: '原始第 51 頁同時列出這項下降，屬仍待追蹤的面向。糞便濃度受產生、吸收及通行時間影響，不能只由數值推算全腸生成量。',
    },
    {
      id: 'butyrate', label: '糞便正丁酸', before: 16.2, after: 2.7, unit: 'μmol/g',
      note: '原始第 51 頁。此個案的丁酸數值下降，因此綠色生理模式不代表這位個案的丁酸已恢復，也不能作為益生菌提升丁酸的證明。',
    },
    {
      id: 'pancreatic-elastase', label: '糞便胰彈性蛋白酶', before: 144, after: 100, afterLabel: '<100', unit: 'μg/g',
      note: '原始第 51 頁。檢驗報告僅列低於 100；長條顯示報告上限，並非測得恰好 100。需結合糞便性狀、症狀與其他資料評估胰臟外分泌功能。',
    },
  ],
  ages: [
    {
      id: 'omicmage', label: '多體學年齡 OMICmAge', change: -4.9, unit: '歲',
      note: '原始第 49 頁：模型估計由 72.4 → 67.5 歲。這是演算法指標變化，不能直接等同實際年齡倒退、疾病逆轉或壽命延長。',
    },
    {
      id: 'symphonyage', label: '器官綜合年齡 SYMPHONYAge', change: -3, unit: '歲',
      note: '原始第 49 頁：模型估計由 64.3 → 61.3 歲。不同時鐘的訓練目標與量測誤差不同，應與功能、症狀及常規檢查一起追蹤。',
    },
  ],
  sourcePages: [7, 37, 41, 42, 44, 46, 49, 51, 53],
};

export const gutBrainSources: { label: string; url?: string }[] = [
  { label: '匿名來源講義・專題六：腸道屏障、雙訊號發炎體、腸腦軸與腸肌軸圖解' },
  { label: '匿名來源個案：原始第 37、41–42、44、46、49、51 頁；完整方案與各項檢驗需一起閱讀' },
  { label: '衛福部統計處：健康平均餘命', url: 'https://dep.mohw.gov.tw/DOS/lp-5082-113.html' },
  { label: 'JAMA Network Open：全球壽命與健康壽命差距（2024 年發表）', url: 'https://pubmed.ncbi.nlm.nih.gov/39661386/' },
  { label: '消化道黏膜表面積重新估算（2014 年）', url: 'https://pubmed.ncbi.nlm.nih.gov/24694282/' },
  { label: 'NIH NCCIH：益生菌、菌株差異與證據', url: 'https://www.nccih.nih.gov/health/probiotics-usefulness-and-safety' },
  { label: 'NIH ODS：維生素 B6 與胺基酸代謝', url: 'https://ods.od.nih.gov/factsheets/VitaminB6-HealthProfessional/' },
  { label: 'NIDDK：胰臟外分泌不足', url: 'https://www.niddk.nih.gov/health-information/digestive-diseases/exocrine-pancreatic-insufficiency' },
];
