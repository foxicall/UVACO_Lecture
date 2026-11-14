import type { PillarId } from './lecture-poster';

export type PathwayId = 'methylation' | 'tryptophan' | 'neurosteroids' | 'gut-barrier' | 'resolution' | 'mitochondria' | 'vascular' | 'detox';
export interface BiochemicalPathway {
  id: PathwayId;
  title: string;
  metaphor: string;
  summary: string;
  pillarIds: PillarId[];
  deckIds: string[];
  sourcePageIds: string[];
  lanes: { id: string; title: string; nodes: { id: string; label: string; via?: string; detail: string }[] }[];
  products: { productId: string; nodeIds: string[]; ingredient: string; connection: string; evidence: '營養生理' | '原料研究' }[];
  references: { label: string; url?: string }[];
}

/** The arrows describe human physiology; product pins identify ingredients at
 * the relevant learning step, rather than claiming a finished product changes it. */
export const biochemicalPathways: BiochemicalPathway[] = [
  {
    id: 'methylation',
    title: '一碳甲基化與轉硫化',
    metaphor: '身體像一座回收工廠，把用過的原料重新整理，再分送到不同工作站。',
    summary: '甲硫胺酸供應甲基循環；葉酸、B12 與膽鹼參與回收，B6 協助另一支路製造半胱胺酸，接續合成穀胱甘肽。',
    pillarIds: ['repair', 'neural'],
    deckIds: ['longevity-1', 'longevity-5'],
    sourcePageIds: ['longevity-5-035', 'cellular-repair-009'],
    lanes: [
      { id: 'methyl-cycle', title: '甲基供應循環', nodes: [
        { id: 'met', label: '甲硫胺酸', detail: '甲硫胺酸是必需胺基酸，來自食物蛋白質。它既參與蛋白質合成，也是 SAM 的上游原料。' },
        { id: 'sam', label: 'SAM／SAMe', via: 'MAT ＋ ATP', detail: '甲硫胺酸腺苷轉移酶 MAT 使用 ATP 製造 SAM。SAM 提供甲基，供多種生物合成與代謝反應使用。' },
        { id: 'methyl-use', label: '甲基轉移', via: 'DNMT、COMT 等', detail: 'DNMT 參與 DNA 甲基化與基因表現調節；COMT 參與兒茶酚類分子的代謝。甲基化的效果取決於位置與細胞狀態，不是單一的修復總開關。' },
        { id: 'sah', label: 'SAH', via: '釋出甲基後', detail: 'SAM 交出甲基後形成 S-腺苷同半胱胺酸 SAH，再由 SAH 水解酶參與後續轉換。' },
        { id: 'hcy', label: '同半胱胺酸', via: 'SAH 水解酶', detail: '同半胱胺酸 Hcy 是正常代謝中間物，接下來可以回收或進入轉硫化支路。濃度持續升高時，要一起考量營養、腎功能與其他影響因素。' },
      ] },
      { id: 'remethylation', title: '葉酸／B12 回收支路', nodes: [
        { id: 'hcy-recycle', label: '同半胱胺酸', detail: '再甲基化把同半胱胺酸轉回甲硫胺酸，維持這座回收工廠的流量。' },
        { id: 'folate-b12', label: 'MTR 再甲基化', via: '5-MTHF ＋ B12', detail: 'MTHFR 先產生 5-MTHF；真正把甲基轉給同半胱胺酸的是需要 B12 的甲硫胺酸合酶 MTR。這是兩個不同工作站。' },
        { id: 'met-recycled', label: '回到甲硫胺酸', via: 'MTR 接手甲基轉移', detail: 'MTR 把來自 5-MTHF 的甲基轉給同半胱胺酸，形成甲硫胺酸，重新供應蛋白質與甲基代謝。' },
      ] },
      { id: 'betaine-recycling', title: '膽鹼／甜菜鹼回收支路', nodes: [
        { id: 'choline', label: '膽鹼', detail: '膽鹼可參與磷脂與乙醯膽鹼合成，也可經氧化提供甜菜鹼，這裡追蹤的是甜菜鹼支路。' },
        { id: 'betaine', label: '甜菜鹼', via: '膽鹼氧化', detail: '甜菜鹼在肝、腎的 BHMT 路徑提供甲基。這是與葉酸／B12 回收平行的另一條支路。' },
        { id: 'bhmt-methionine', label: 'Hcy → 甲硫胺酸', via: 'BHMT 使用甜菜鹼的甲基', detail: 'BHMT 將甜菜鹼的甲基交給同半胱胺酸，形成甲硫胺酸，同時產生二甲基甘胺酸。' },
      ] },
      { id: 'transsulfuration', title: '轉硫化與抗氧化原料', nodes: [
        { id: 'hcy-sulfur', label: 'Hcy ＋ 絲胺酸', detail: '當同半胱胺酸走向轉硫化，它的硫原子會成為合成半胱胺酸的來源。' },
        { id: 'cystathionine', label: '胱硫醚', via: 'CBS ＋ B6／PLP', detail: '胱硫醚 β 合成酶 CBS 需要活性維生素 B6，將同半胱胺酸與絲胺酸結合。' },
        { id: 'cysteine', label: '半胱胺酸', via: 'CSE ＋ B6／PLP', detail: '胱硫醚 γ 裂解酶 CSE 接續產生半胱胺酸。B6 也另外參與胺基酸與神經傳遞物質代謝。' },
        { id: 'gsh', label: '穀胱甘肽 GSH', via: '加上麩胺酸、甘胺酸與 ATP', detail: 'GCL 與 GSS 依序組合麩胺酸、半胱胺酸、甘胺酸，形成穀胱甘肽。GSH 是細胞氧化還原網絡的一員，需要持續合成與回收。' },
      ] },
    ],
    products: [
      { productId: '995', nodeIds: ['met', 'betaine', 'gsh'], ingredient: '發酵胺基酸與大豆卵磷脂', connection: '從配方中的胺基酸與卵磷脂，認識甲硫胺酸、甘胺酸及膽鹼的原料角色；實際供應量由成分標示決定。', evidence: '營養生理' },
      { productId: '360', nodeIds: ['folate-b12', 'cystathionine'], ingredient: '餐包中的酵母與 B 群原料', connection: '對照葉酸、B12、B6 在回收與轉硫化的工作站，理解均衡營養如何供應輔因子。', evidence: '營養生理' },
    ],
    references: [
      { label: '來源圖解：甲基化循環與同半胱胺酸代謝' },
      { label: 'NIH ODS：葉酸', url: 'https://ods.od.nih.gov/factsheets/Folate-HealthProfessional/' },
      { label: 'NIH ODS：膽鹼', url: 'https://ods.od.nih.gov/factsheets/Choline-HealthProfessional/' },
    ],
  },
  {
    id: 'tryptophan',
    title: '色胺酸的兩條代謝路',
    metaphor: '同一份原料會送往不同車間，身體的發炎訊號會改變分配方式。',
    summary: '色胺酸可參與血清素與褪黑激素合成，也可進入犬尿胺酸代謝；腸道、免疫與壓力訊號共同影響這些分流。',
    pillarIds: ['autonomic', 'neural', 'inflammation'],
    deckIds: ['longevity-3', 'longevity-6'],
    sourcePageIds: ['longevity-6-020', 'longevity-6-028', 'precision-pain-012'],
    lanes: [
      { id: 'serotonin', title: '血清素與夜間節律', nodes: [
        { id: 'trp', label: 'L-色胺酸', detail: '色胺酸是必需胺基酸，也是多種代謝路徑的共同原料。腸道與大腦各自合成血清素，周邊血清素不能直接穿過血腦屏障。' },
        { id: 'htp', label: '5-HTP', via: 'TPH ＋ BH4、鐵與氧', detail: '色胺酸羥化酶 TPH 把色胺酸轉成 5-HTP，這一步使用四氫生物蝶呤 BH4、鐵與氧。' },
        { id: 'serotonin-node', label: '血清素 5-HT', via: 'AADC ＋ B6／PLP', detail: '接著由芳香族胺基酸脫羧酶 AADC 使用 B6，將 5-HTP 轉成血清素。B6 的工作站在這一步，不是前一步 TPH。' },
        { id: 'melatonin', label: '褪黑激素', via: 'AANAT → ASMT', detail: '松果體在晝夜節律調控下，先以乙醯輔酶 A、再以 SAM 參與轉換，製造褪黑激素。光線、作息與神經訊號共同決定夜間節律。' },
      ] },
      { id: 'kynurenine', title: '犬尿胺酸分流', nodes: [
        { id: 'immune-trp', label: '色胺酸與免疫訊號', detail: '犬尿胺酸原本就是色胺酸的主要代謝去路。發炎可上調 IDO1，壓力與荷爾蒙也可影響肝臟 TDO2；不是平常不走、發炎才突然搶走 95%。' },
        { id: 'kyn', label: '犬尿胺酸 KYN', via: 'IDO1／TDO2 等步驟', detail: '色胺酸先形成 N-甲醯犬尿胺酸，再成為犬尿胺酸。後續走向取決於組織、細胞與酵素環境。' },
        { id: 'quin', label: '喹啉酸 QUIN', via: 'KMO 等下游酵素', detail: '小膠質細胞等可形成喹啉酸。喹啉酸參與 NAD⁺ 合成，濃度過高時也可能過度刺激 NMDA 受體、增加鈣離子負荷。' },
        { id: 'nmda', label: 'NMDA 興奮訊號', via: '濃度與受體環境決定反應', detail: '適度的 NMDA 訊號參與學習與可塑性；過度刺激會造成興奮毒性。犬尿胺酸另可經 KAT 形成犬尿喹啉酸 KYNA，具有不同受體作用。' },
      ] },
      { id: 'gut-brain', title: '腸道如何傳遞訊息', nodes: [
        { id: 'gut-community', label: '菌相與食物', detail: '食物纖維、菌相代謝與腸道屏障，會共同影響局部免疫與色胺酸代謝環境。' },
        { id: 'gut-signals', label: '代謝物與迷走神經', via: '免疫、神經、代謝物三條路', detail: '腸道可透過迷走神經、免疫訊號及微生物代謝物與大腦溝通。不同菌株的作用要依其研究結果分別理解。' },
        { id: 'brain-context', label: '情緒與睡眠調控', via: '與大腦迴路互相影響', detail: '腸腦軸是雙向網絡，與作息、活動和心理壓力共同參與調節，並非只靠提高某一種傳遞物質。' },
      ] },
    ],
    products: [
      { productId: 'kangbei', nodeIds: ['trp'], ingredient: 'L-色胺酸', connection: '把配方中的色胺酸對回血清素與褪黑激素的上游原料，並認識酵素、光線與作息的共同角色。', evidence: '營養生理' },
      { productId: 'kangyue', nodeIds: ['gut-signals'], ingredient: 'GKJOY、GKF3 與甜橙萃取', connection: '從特定菌株的腸腦軸研究，理解微生物、免疫訊號與情緒之間的連結。', evidence: '原料研究' },
      { productId: 'kanger', nodeIds: ['gut-community'], ingredient: '複合乳酸菌與異麥芽寡糖', connection: '連到腸道生態與發酵原料的工作站，觀察菌株及食物纖維的不同分工。', evidence: '原料研究' },
      { productId: 'kanger-n', nodeIds: ['gut-community'], ingredient: '複合乳酸菌、鳳梨與木瓜酵素', connection: '在腸道生態之外，加入消化酵素原料的比較；菌株、飲食與免疫環境共同影響色胺酸代謝。', evidence: '原料研究' },
    ],
    references: [
      { label: '來源圖解：腸腦軸與犬尿胺酸代謝' },
      { label: 'NIH ODS：維生素 B6', url: 'https://ods.od.nih.gov/factsheets/VitaminB6-HealthProfessional/' },
      { label: 'NCCIH：褪黑激素與生理節律', url: 'https://www.nccih.nih.gov/health/melatonin-what-you-need-to-know' },
    ],
  },
  {
    id: 'neurosteroids',
    title: '神經類固醇與大腦煞車',
    metaphor: '大腦需要油門，也需要煞車；壓力管理是在照顧整套控制系統。',
    summary: '膽固醇是類固醇的共同上游；ALLO 調節 GABA_A 受體，壓力軸則透過另一套訊號調整皮質醇與身體代謝。',
    pillarIds: ['autonomic', 'repair'],
    deckIds: ['longevity-3', 'longevity-1'],
    sourcePageIds: ['longevity-3-001', 'longevity-3-008', 'precision-health-009'],
    lanes: [
      { id: 'allo-synthesis', title: 'ALLO 合成', nodes: [
        { id: 'cholesterol', label: '膽固醇', detail: '膽固醇是類固醇的共同原料。StAR 協助膽固醇進入粒線體內膜附近，再由酵素接手轉換。' },
        { id: 'p5', label: '孕烯醇酮 P5', via: 'StAR 轉運 ＋ CYP11A1', detail: 'CYP11A1 又稱 P450scc，負責側鏈切割產生孕烯醇酮。StAR 是轉運相關蛋白，不是執行切割的酵素。' },
        { id: 'p4', label: '黃體酮 P4', via: '3β-HSD', detail: '3β-羥類固醇脫氫酶參與由孕烯醇酮形成黃體酮，後續可進入不同類固醇合成支路。' },
        { id: 'allo', label: '別孕烷醇酮 ALLO', via: '5α-還原酶 → 3α-HSD', detail: '黃體酮先成為 5α-二氫黃體酮，再形成 ALLO。腦內及周邊組織都參與神經活性類固醇的供應與代謝。' },
      ] },
      { id: 'synapse', title: '興奮與抑制訊號', nodes: [
        { id: 'gaba-synthesis', label: '麩胺酸 → GABA', via: 'GAD ＋ B6／PLP', detail: '神經元可利用麩胺酸脫羧酶 GAD 和 B6，將麩胺酸轉成抑制性傳遞物質 GABA。' },
        { id: 'gaba-a', label: 'GABA_A 受體', via: 'GABA 結合；ALLO 調節', detail: 'GABA 啟動受體，ALLO 在另一個位點增強受體反應，稱為正向變構調節。兩者不是同一個分子，也不是相同的結合位置。' },
        { id: 'chloride', label: '氯離子通道', via: '改變神經元興奮性', detail: '成熟神經元的氯離子梯度通常使 GABA_A 活化產生抑制或分流抑制。實際方向也取決於細胞的離子梯度。' },
        { id: 'ei-balance', label: '興奮／抑制平衡', via: '與 NMDA 等訊號協調', detail: 'P5S、DHEA 等神經類固醇可調節多種受體；NMDA 參與記憶與可塑性。睡眠與情緒來自整個網絡的協調。' },
      ] },
      { id: 'stress-axis', title: '壓力與身體修復', nodes: [
        { id: 'stress', label: '長期壓力訊號', detail: '壓力會影響下視丘—腦下垂體—腎上腺軸。調節涉及神經訊號、酵素與回饋，並非單純把孕烯醇酮從一條管路搶到另一條。' },
        { id: 'hpa', label: 'CRH → ACTH', via: '下視丘與腦下垂體', detail: '下視丘的 CRH 促進腦下垂體分泌 ACTH，進而刺激腎上腺皮質產生皮質醇。皮質醇也會回饋調節上游。' },
        { id: 'cortisol', label: '皮質醇', via: '腎上腺與負回饋', detail: '皮質醇是正常壓力適應的一部分；長期偏高或外源性類固醇暴露可影響蛋白質代謝、纖維母細胞及膠原蛋白合成。' },
        { id: 'thyroid-repair', label: '組織與代謝調節', via: '受體、酵素及營養共同作用', detail: '重症、飢餓及部分荷爾蒙環境可改變 T4 的去碘化與 rT3 生成。疲勞或怕冷不能單憑感受推算皮質醇或甲狀腺數值。' },
      ] },
    ],
    products: [
      { productId: '360', nodeIds: ['stress', 'hpa'], ingredient: '餐包中的刺五加與靈芝', connection: '對照草本原料的壓力適應研究，同時把規律作息、活動與充足營養放回壓力軸的日常照顧。', evidence: '原料研究' },
      { productId: 'kangbei', nodeIds: ['gaba-synthesis', 'gaba-a'], ingredient: '麩胺酸發酵物所含 GABA', connection: '配方提供的 GABA 與神經元自行合成的 GABA 是兩種供應情境；口服後的吸收與進腦程度，須和受體機轉分開理解。', evidence: '原料研究' },
    ],
    references: [
      { label: '來源圖解：類固醇、神經類固醇與突觸訊號' },
      { label: '來源圖解：壓力軸與身體修復' },
    ],
  },
  {
    id: 'gut-barrier',
    title: '腸道屏障、發炎體與肌肉',
    metaphor: '腸道像有拉鍊的圍牆，警報傳出去後，也可能影響遠處的肌肉工地。',
    summary: '屏障通透性、LPS 警報與 NLRP3 發炎體是不同層次；菌相代謝、營養與阻力活動則參與屏障與肌肉的日常維持。',
    pillarIds: ['inflammation', 'repair'],
    deckIds: ['longevity-2', 'longevity-6'],
    sourcePageIds: ['longevity-6-012', 'longevity-6-014', 'longevity-6-015'],
    lanes: [
      { id: 'barrier', title: '緊密連接的開合', nodes: [
        { id: 'luminal', label: '腸腔與菌相環境', detail: '微生物、食物成分與局部發炎都可能改變腸道屏障。不同刺激的作用需要分別理解，並非所有不適都來自腸漏。' },
        { id: 'zonulin', label: 'Zonulin 訊號', via: '部分刺激可誘發釋放', detail: 'Zonulin 是調節屏障的研究路徑之一，可透過 PAR2 與 EGFR 相關訊號影響細胞間連接。' },
        { id: 'tight-junction', label: 'ZO-1／Occludin', via: 'PAR2／EGFR → PLC／PKCα', detail: '下游訊號影響肌動蛋白骨架與緊密連接蛋白的位置，使細胞旁通透性改變。這裡描述的是細胞訊號流程。' },
      ] },
      { id: 'fiber-fermentation', title: '菌群發酵與屏障支持', nodes: [
        { id: 'fiber', label: '可發酵纖維', detail: '膳食纖維與部分寡糖進入腸道後，成為特定微生物可以利用的原料。' },
        { id: 'cross-feeding', label: '菌群交互餵養', via: '微生物發酵與代謝合作', detail: '有些菌的代謝產物會成為另一些菌的原料，發酵結果由整個菌群與食物組成共同決定。' },
        { id: 'scfa', label: '丁酸等 SCFAs', via: '特定菌群產生', detail: '部分菌種將纖維或其他菌的代謝物轉為丁酸。不是每一株乳酸菌都直接製造丁酸。' },
        { id: 'colon-energy', label: '結腸細胞與 Treg', via: '能量供應與受體訊號', detail: '丁酸可作為結腸細胞的能量來源，也透過受體及表觀遺傳相關作用參與免疫與屏障調節。' },
      ] },
      { id: 'inflammasome', title: '兩段式發炎警報', nodes: [
        { id: 'lps', label: '內毒素 LPS', detail: 'LPS 是革蘭氏陰性菌外膜的成分；進入不適當的位置時，可被先天免疫系統辨識。' },
        { id: 'tlr4', label: 'TLR4／MD-2', via: 'LBP、CD14 協助辨識', detail: '受體辨識後，可透過 MyD88 等路徑促進 IκB 降解，使 NF-κB 進入細胞核。' },
        { id: 'nfkb', label: 'NF-κB 預備訊號', via: '訊號一：priming', detail: 'NF-κB 上調 NLRP3、pro-IL-1β 及其他發炎相關基因，先準備組件。這一步與發炎體真正組裝是兩件事。' },
        { id: 'nlrp3', label: 'NLRP3 發炎體', via: '訊號二：K⁺ 外流等刺激', detail: '鉀離子外流、粒線體壓力等刺激，可促成 NLRP3、ASC 與 procaspase-1 組裝，進而活化 caspase-1。' },
        { id: 'pyroptosis', label: 'GSDMD 與細胞焦亡', via: 'Caspase-1 切割', detail: 'Caspase-1 促進 IL-1β／IL-18 成熟，並切割 GSDMD 形成膜孔。細胞焦亡與凝血形成纖維蛋白是相關但不同的過程。' },
      ] },
      { id: 'gut-muscle', title: '腸肌軸與蛋白質利用', nodes: [
        { id: 'systemic-inflammation', label: '長期發炎訊號', detail: '慢性發炎、活動不足與老化可一起影響肌肉的蛋白質周轉；營養攝取只是其中一個環節。' },
        { id: 'muscle-breakdown', label: 'MuRF1／Atrogin-1', via: '蛋白質分解相關訊號', detail: '這些泛素連接酶參與標記肌肉蛋白，交由蛋白酶體處理。發炎與不活動可能使分解與合成失去平衡。' },
        { id: 'amino-acids', label: '胺基酸與活動刺激', via: '蛋白質消化、吸收與運動', detail: '胺基酸與阻力活動共同提供肌肉合成刺激。游離胺基酸和胜肽仍須吸收、運輸，不能等同直接繞過所有代謝調節。' },
        { id: 'mtor-muscle', label: 'mTORC1 與肌蛋白合成', via: '營養與機械負荷訊號', detail: '合成代謝阻抗是肌肉對營養或活動的合成反應變弱，不是吃肉喝奶都無法吸收。蛋白質總量、分配、活動及疾病狀態都會影響反應。' },
      ] },
    ],
    products: [
      { productId: 'kanger', nodeIds: ['luminal', 'scfa'], ingredient: '複合乳酸菌與異麥芽寡糖', connection: '把菌株與益生元放在菌相生態、發酵及交互餵養的節點，認識它們與腸道屏障的研究連結。', evidence: '原料研究' },
      { productId: 'kanger-n', nodeIds: ['luminal', 'amino-acids'], ingredient: '乳酸菌、鳳梨酵素與木瓜酵素', connection: '對照菌相與蛋白質分解兩種原料角色；食物蛋白的消化與組織內纖維蛋白清除是不同位置、不同過程。', evidence: '原料研究' },
      { productId: '995', nodeIds: ['amino-acids'], ingredient: '發酵胺基酸與短鏈胜肽', connection: '連到蛋白質合成所需的原料供應，並把吸收、肌肉反應與阻力活動分開看清楚。', evidence: '營養生理' },
    ],
    references: [
      { label: '來源圖解：Zonulin、TLR4 與雙訊號發炎體' },
      { label: 'NCCIH：益生菌與菌株差異', url: 'https://www.nccih.nih.gov/health/probiotics-usefulness-and-safety' },
    ],
  },
  {
    id: 'resolution',
    title: '發炎消退與神經髓鞘',
    metaphor: '火場不只需要停止火勢，也需要清理隊；神經則需要自己的保養與絕緣系統。',
    summary: 'EPA、DHA 與 AA 可形成不同促消退脂質訊號；神經營養因子與寡突膠質細胞，則參與另一組神經支持及髓鞘研究。',
    pillarIds: ['inflammation', 'neural'],
    deckIds: ['longevity-4'],
    sourcePageIds: ['longevity-4-011', 'longevity-4-014', 'longevity-4-026', 'brain-forest-009'],
    lanes: [
      { id: 'spm', title: '促消退脂質的合成', nodes: [
        { id: 'fatty-acids', label: 'EPA／DHA', detail: 'EPA 與 DHA 是部分促消退介質的上游脂肪酸。ALA 需要先經轉換，不能直接當成 EPA、DHA 或 SPM；AA 的脂氧素支路另外呈現。' },
        { id: 'precursors', label: '18-HEPE、17/14-HDHA', via: 'LOX 等酵素參與', detail: 'EPA 對應 18-HEPE；DHA 可形成 17-HDHA、14-HDHA 等前驅物。後續轉換依細胞與酵素合作而不同。' },
        { id: 'mediators', label: '消退素／保護素／巨噬素', via: '多步驟脂質代謝', detail: 'EPA 形成 E 系列消退素 Resolvins；DHA 可形成 D 系列消退素、保護素 Protectins 與巨噬素 Maresins。AA 的脂氧素支路另行參與消退調節。' },
        { id: 'efferocytosis', label: '胞葬與組織穩態', via: 'ChemR23、ALX/FPR2 等受體', detail: '不同介質有不同受體配對，參與限制嗜中性球持續進入、促進巨噬細胞清除凋亡細胞，讓發炎反應有機會完成收尾。' },
      ] },
      { id: 'lipoxins', title: 'AA 與脂氧素支路', nodes: [
        { id: 'aa', label: '花生四烯酸 AA', detail: 'AA 可參與多種脂質訊號合成，不能只用「促發炎脂肪酸」概括；這裡追蹤的是脂氧素支路。' },
        { id: 'lipoxin', label: '脂氧素 LXA₄／LXB₄', via: 'LOX 與細胞間代謝合作', detail: '透過不同細胞的脂氧合酶合作，AA 可形成脂氧素，參與發炎消退。這條來源與 EPA／DHA 家族不同。' },
        { id: 'lipoxin-receptor', label: '消退調節訊號', via: 'LXA₄ 可作用於 ALX/FPR2', detail: '不同脂氧素與受體訊號參與限制發炎及促進清除，不能把所有 SPM 都配到同一種受體。' },
      ] },
      { id: 'brain-lipids', title: '腦部脂質與屏障', nodes: [
        { id: 'membrane-lipids', label: '細胞膜磷脂', detail: '磷脂是細胞膜的重要材料。一般大豆卵磷脂、磷脂醯膽鹼 PC 與攜帶 DHA 的 LPC-DHA，分子型態並不相同。' },
        { id: 'lpc-dha', label: 'LPC-DHA', via: '特定脂質攜帶型態', detail: 'LPC-DHA 是溶血磷脂醯膽鹼攜帶 DHA 的型態，屬於血腦屏障轉運研究的特定分子。' },
        { id: 'mfsd2a', label: 'MFSD2A 轉運', via: '血腦屏障內皮', detail: 'MFSD2A 可運輸特定長鏈脂肪酸的 LPC 型態，包括 LPC-DHA；不能把所有卵磷脂都畫成相同的進腦通道。' },
      ] },
      { id: 'myelin', title: '神經營養與髓鞘研究', nodes: [
        { id: 'erinacine', label: '猴頭素 A 研究', detail: '猴頭菇菌絲體中的猴頭素 A，被用於探討神經營養訊號、發炎與神經保護。研究中的分子作用，與人體食用成品的結果屬於不同證據層次。' },
        { id: 'ngf-bdnf', label: 'NGF／BDNF 訊號', via: '神經元與膠質細胞網絡', detail: '神經營養因子參與神經存活、可塑性及膠質細胞調節。不同因子、受體與細胞階段有不同作用。' },
        { id: 'opc-mbp', label: 'OPCs → 寡突膠質細胞／MBP', via: '分化、髓鞘生成與維持', detail: '寡突膠質前驅細胞 OPCs 成熟後，參與中樞髓鞘形成；MBP 是髓鞘的重要蛋白。這是神經修復研究所追蹤的生理流程。' },
      ] },
      { id: 'amyloid-tau', title: 'Aβ、發炎與 Tau 病理', nodes: [
        { id: 'amyloid', label: 'Aβ 異常聚集', detail: 'Aβ 的產生與清除失衡可形成不同聚集型態，與阿茲海默症病理相關。' },
        { id: 'microglia', label: '小膠質細胞反應', via: '免疫辨識與發炎訊號', detail: '小膠質細胞參與清除與防禦；反應的強度、時間與細胞狀態也會影響周圍神經環境。' },
        { id: 'tau', label: 'Tau 病理與軸突功能', via: '互相影響的病理網絡', detail: 'Tau 異常磷酸化與聚集可影響神經元功能。火柴與木柴是便於理解的比喻，實際病理網絡包含多條交互作用。' },
      ] },
    ],
    products: [
      { productId: 'huoyi', nodeIds: ['erinacine', 'ngf-bdnf'], ingredient: '猴頭菇菌絲體與猴頭素相關原料', connection: '對照猴頭菇原料的神經營養研究，並在配方比較中辨識丹參、薑黃及綠茶萃取的角色。', evidence: '原料研究' },
      { productId: '360', nodeIds: ['fatty-acids'], ingredient: '餐包中的亞麻仁籽 ALA', connection: '把 ALA 放在必需脂肪酸原料端；從 ALA 到 EPA／DHA 的轉換效率有限，不能直接等同補充 SPM。', evidence: '營養生理' },
      { productId: '995', nodeIds: ['membrane-lipids'], ingredient: '大豆卵磷脂', connection: '連到細胞膜磷脂與膽鹼原料，不把一般卵磷脂標成 LPC-DHA。', evidence: '營養生理' },
      { productId: 'ningkang', nodeIds: ['membrane-lipids'], ingredient: '大豆卵磷脂與綠茶萃取', connection: '比較膜脂原料與植化素研究，理解脂質結構與氧化還原調節的不同分工。', evidence: '原料研究' },
    ],
    references: [
      { label: '來源圖解：SPM 家族、胞葬作用及 LPC-DHA' },
      { label: 'NIH ODS：Omega-3 脂肪酸', url: 'https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/' },
    ],
  },
  {
    id: 'mitochondria',
    title: '粒線體能量與氧化還原',
    metaphor: '發電廠要有燃料、傳電設備，也要有維修與回收制度。',
    summary: '食物代謝產生的電子進入電子傳遞鏈，建立質子梯度再製造 ATP；SOD、GSH 與自噬網絡共同維持細胞品質。',
    pillarIds: ['repair', 'neural', 'autonomic'],
    deckIds: ['longevity-1'],
    sourcePageIds: ['longevity-1-050', 'longevity-1-055', 'longevity-1-057', 'longevity-1-064'],
    lanes: [
      { id: 'atp-production', title: '從燃料到 ATP', nodes: [
        { id: 'fuel', label: '葡萄糖與脂肪酸', detail: '葡萄糖經糖解形成丙酮酸；脂肪酸可經 β-氧化形成乙醯輔酶 A。長鏈脂肪酸進入粒線體涉及肉鹼穿梭系統。' },
        { id: 'acetyl-coa', label: '乙醯輔酶 A', via: 'PDH 或脂肪酸 β-氧化', detail: 'PDH 將丙酮酸轉成乙醯輔酶 A，使用 B1、B2、B3、泛酸與硫辛酸相關輔因子。' },
        { id: 'tca', label: '檸檬酸循環 TCA', via: '產生 NADH／FADH₂', detail: '循環依序包含檸檬酸、異檸檬酸、α-酮戊二酸、琥珀醯輔酶 A、琥珀酸、延胡索酸、蘋果酸，最後回到草醯乙酸。它把燃料能量轉交給電子載體。' },
        { id: 'etc', label: '電子傳遞鏈 I–IV', via: 'CoQ、細胞色素 c 傳遞電子', detail: '電子由 NADH、FADH₂ 進入傳遞鏈，最終交給氧。複合體 I、III、IV 協助建立膜兩側的質子梯度；複合體 II 不負責泵出質子。' },
        { id: 'atp', label: 'ATP 合成酶 V', via: '利用質子梯度', detail: 'ATP 合成酶利用質子回流，把 ADP 與無機磷酸組合成 ATP。能量生成不只是電子傳遞鏈，還需要完整膜結構與供氧。' },
      ] },
      { id: 'redox', title: '氧化還原接力', nodes: [
        { id: 'superoxide', label: '超氧陰離子 O₂•−', detail: '粒線體等來源可產生活性氧；適量參與正常訊號，超出細胞緩衝能力時才形成氧化壓力。' },
        { id: 'sod', label: 'SOD → H₂O₂', via: '超氧化物歧化酶', detail: '細胞內 SOD 將超氧陰離子轉成過氧化氫，後續還要由其他酵素完成處理。食品的試管 SOD 樣活性，與細胞內酵素活性不同。' },
        { id: 'gpx-gsh', label: 'GPX ＋ GSH → 水', via: '另有 Catalase 等系統', detail: '穀胱甘肽過氧化酶 GPX 使用 GSH 還原過氧化物；GSH 轉為 GSSG 後，可由穀胱甘肽還原酶與 NADPH 回收。' },
        { id: 'redox-damage', label: 'DNA 與發炎訊號', via: '超出緩衝能力時', detail: '氧化壓力可損傷脂質、蛋白質與 DNA；8-OHdG 是其中一類指標。粒線體 DNA 出現在細胞質時，也可涉及 cGAS–STING 訊號。' },
      ] },
      { id: 'quality-control', title: '能量感測與回收', nodes: [
        { id: 'energy-sensors', label: 'AMPK／SIRT1', detail: 'AMPK 感測能量狀態；SIRT1 依賴 NAD⁺，參與代謝與壓力反應調節。它們與營養、活動及生理節律互相影響。' },
        { id: 'pgc1', label: 'PGC-1α', via: '代謝訊號協調', detail: 'PGC-1α 是轉錄共同活化因子，參與粒線體新生與氧化代謝的調節，不是單一成分就能開啟的固定按鈕。' },
        { id: 'mitochondrial-biogenesis', label: '粒線體新生', via: '轉錄與蛋白質合成合作', detail: '細胞協調核基因與粒線體基因表現，補充粒線體相關蛋白質與結構。新生與受損組件清除是相互配合的兩種工作。' },
      ] },
      { id: 'autophagy-control', title: '自噬回收調節', nodes: [
        { id: 'nutrient-state', label: '營養與能量狀態', detail: '細胞依能量、胺基酸與生長因子訊號，協調合成工作與回收工作。' },
        { id: 'mtor-ulk1', label: 'AMPK／mTORC1／ULK1', via: '多組訊號共同調節', detail: 'AMPK 與 mTORC1 可經不同磷酸化作用調節 ULK1 等自噬啟動組件；不是單向把 mTOR 永遠關掉。' },
        { id: 'autophagy', label: '自噬／粒線體自噬', via: '包裹並送往溶酶體處理', detail: '自噬清理細胞組件，粒線體自噬則選擇性處理粒線體。肌肉合成與細胞回收需要在不同情境下協調。' },
      ] },
    ],
    products: [
      { productId: '995', nodeIds: ['fuel', 'sod', 'gpx-gsh'], ingredient: '發酵胺基酸與來源所述 SOD 樣活性', connection: '把胺基酸放在原料供應端，並用 SOD 節點說明試管活性與人體內抗氧化接力的差別。', evidence: '原料研究' },
      { productId: '360', nodeIds: ['acetyl-coa', 'tca'], ingredient: '餐包蛋白質與 B 群原料', connection: '對照能量代謝所需的燃料與輔因子；原料供應和細胞能量調控各有角色。', evidence: '營養生理' },
      { productId: 'antrodia-drops', nodeIds: ['redox-damage'], ingredient: '樟芝菌絲體與 4-AAQB 相關研究', connection: '連到樟芝成分的細胞訊號與氧化壓力研究。4-AAQB 與 CoQ10 是不同分子，因此不放在電子傳遞鏈的 CoQ 位置。', evidence: '原料研究' },
      { productId: 'ningkang', nodeIds: ['redox-damage'], ingredient: '桑黃、蛹蟲草與綠茶萃取', connection: '從菌菇與多酚的研究認識氧化還原訊號；此節點談細胞生理，不把 3C 使用直接畫成輻射傷害。', evidence: '原料研究' },
    ],
    references: [
      { label: '來源圖解：TCA 循環、電子傳遞鏈與 GSH 回收' },
      { label: 'NIH ODS：硫胺素（維生素 B1）', url: 'https://ods.od.nih.gov/factsheets/Thiamin-HealthProfessional/' },
    ],
  },
  {
    id: 'vascular',
    title: '血管內皮與脂蛋白品質',
    metaphor: '血管像運輸道路，除了車流量，也要照顧路面、號誌與貨物狀態。',
    summary: '一氧化氮參與血管舒張；脂蛋白顆粒、氧化反應與 HDL 功能共同影響血管環境，腸道代謝也是其中一條支線。',
    pillarIds: ['neural', 'repair'],
    deckIds: ['longevity-5'],
    sourcePageIds: ['longevity-5-007', 'longevity-5-022', 'longevity-5-028'],
    lanes: [
      { id: 'nitric-oxide', title: 'NO 舒張訊號', nodes: [
        { id: 'arginine', label: 'L-精胺酸', detail: '精胺酸是一氧化氮合成的原料，與氧、NADPH 及 BH4 等輔因子一起參與反應。' },
        { id: 'enos', label: 'eNOS', via: '內皮一氧化氮合酶', detail: 'eNOS 生成一氧化氮與瓜胺酸。ADMA 可抑制 NOS；同半胱胺酸升高則可能透過氧化壓力與酵素失偶聯等方式影響 NO 可用量。' },
        { id: 'no-cgmp', label: 'NO → sGC → cGMP', via: '訊號傳到平滑肌', detail: 'NO 活化平滑肌中的可溶性鳥苷酸環化酶 sGC，提高 cGMP，參與血管舒張。這不是把紅血球逐粒拆開的機制。' },
        { id: 'vascular-tone', label: '血流與血管張力', via: '與血壓、神經訊號協調', detail: '局部代謝、自律神經、內皮功能與血壓共同影響微循環，不能只由某一種原料判定血管是否暢通。' },
      ] },
      { id: 'lipoprotein', title: '脂蛋白與氧化', nodes: [
        { id: 'apo-b', label: 'ApoB 顆粒／RLP', detail: 'LDL、殘粒等含 ApoB 的顆粒可在動脈壁滯留。顆粒數、暴露時間、代謝環境與內皮狀態一起影響風險。' },
        { id: 'oxidation', label: 'sdLDL／oxLDL', via: '氧化壓力與發炎環境', detail: '小而緻密 LDL 與代謝風險相關；氧化修飾的 LDL 可參與免疫反應與泡沫細胞形成。RLP 的作用不必先經相同的 LDL 氧化流程。' },
        { id: 'foam-cell', label: '巨噬細胞與泡沫細胞', via: '脂質攝取與免疫反應', detail: '動脈壁內的巨噬細胞攝入脂質後可形成泡沫細胞；斑塊的形成與變化還牽涉平滑肌、結締組織和多種免疫訊號。' },
      ] },
      { id: 'hdl-quality', title: 'HDL 的功能與保護', nodes: [
        { id: 'mpo-pon1', label: 'MPO／PON1', detail: 'MPO 參與氧化反應；與 HDL 相關的 PON1 參與部分脂質保護功能。它們是網絡的一部分，不是單一比值就能完整評估所有血管狀態。' },
        { id: 'hdl-function', label: 'HDL 的蛋白與脂質環境', via: '氧化修飾與成分改變', detail: 'HDL 的組成與修飾可改變其功能。HDL-C 濃度和 HDL 功能是不同面向，數值越高不一定代表越好。' },
        { id: 'cholesterol-efflux', label: '膽固醇外排等功能', via: '轉運蛋白與脂蛋白合作', detail: 'HDL 參與細胞膽固醇外排及多種免疫調節。這些功能由脂蛋白、受體和酵素共同完成。' },
      ] },
      { id: 'tmao', title: '腸道到肝臟的 TMAO', nodes: [
        { id: 'diet-choline', label: '膽鹼／肉鹼等原料', detail: '膽鹼是身體需要的營養素。部分食物成分也可成為特定腸道微生物製造 TMA 的原料，影響取決於菌相與整體飲食。' },
        { id: 'tma', label: '三甲胺 TMA', via: '特定微生物酵素', detail: '具有相關代謝能力的菌群可生成 TMA；並非所有腸道菌或所有含膽鹼食物都產生相同影響。' },
        { id: 'tmao-node', label: '氧化三甲胺 TMAO', via: '肝臟 FMO3', detail: '肝臟 FMO3 將 TMA 氧化成 TMAO。其血中濃度還受腎臟排泄與食物來源影響；與心血管風險的關聯需要放在整體情境判讀。' },
      ] },
    ],
    products: [
      { productId: 'dikang', nodeIds: ['enos', 'oxidation', 'mpo-pon1'], ingredient: '丹參、藏紅花、山楂等草本', connection: '連到草本成分與內皮、氧化反應的研究主題，辨識丹參酮、藏紅花素等分子的不同角色。', evidence: '原料研究' },
      { productId: '360', nodeIds: ['enos', 'apo-b'], ingredient: '餐包 B 群與全身調理配方', connection: 'B 群可回到同半胱胺酸代謝閱讀；含紅麴配方則另看脂質相關成分與現行標示，不從這張圖推算用量。', evidence: '原料研究' },
      { productId: 'kanger', nodeIds: ['tma'], ingredient: '複合乳酸菌與益生元', connection: '連到菌相代謝的比較，觀察特定菌株與飲食如何改變腸道環境。', evidence: '原料研究' },
      { productId: 'kanger-n', nodeIds: ['tma'], ingredient: '複合乳酸菌與水果酵素', connection: '在菌相與消化原料之間作比較；TMA 生成由菌種能力、飲食與宿主狀態共同決定。', evidence: '原料研究' },
    ],
    references: [
      { label: '來源圖解：內皮、脂蛋白顆粒與 HDL 功能' },
      { label: 'NIH ODS：膽鹼的營養與代謝', url: 'https://ods.od.nih.gov/factsheets/Choline-HealthProfessional/' },
    ],
  },
  {
    id: 'detox',
    title: '肝膽轉化與腸腎排泄',
    metaphor: '身體像有加工、包裝與出貨的工廠，先減少外來負荷，再看每一道運作。',
    summary: '肝臟先轉化部分外來物，再進行結合反應；轉運蛋白、膽汁與腎臟參與排出，腸道菌的酵素也可能影響再循環。',
    pillarIds: ['inflammation', 'repair'],
    deckIds: ['longevity-2'],
    sourcePageIds: ['longevity-2-001', 'longevity-2-002', 'longevity-2-003', 'longevity-2-004'],
    lanes: [
      { id: 'biotransformation', title: '轉化與結合反應', nodes: [
        { id: 'exposure', label: '環境與飲食暴露', detail: '不同黴菌、毒素、藥物與內源性代謝物有不同處理方式。先辨識暴露來源、改善潮濕與漏水，與體內代謝是不同但相關的工作。' },
        { id: 'phase-one', label: 'Phase I 轉化', via: 'CYP450 等酵素', detail: '氧化、還原、水解等反應改變分子結構，產物可能較容易排出，也可能暫時更具反應性。並非所有物質都必須先走 Phase I。' },
        { id: 'phase-two', label: 'Phase II 結合', via: 'UGT／SULT／GST／COMT 等', detail: '結合反應包括葡萄糖醛酸化、硫酸化、穀胱甘肽結合、甲基化、乙醯化與胺基酸結合。它們依物質與酵素分工，不能一概等同完全無害化。' },
        { id: 'phase-three', label: 'Phase III 轉運', via: 'MRP 等轉運蛋白', detail: '細胞利用轉運蛋白將相關分子送往膽汁或血液；後續可能由糞便或尿液排出。肝臟轉化與實際排泄需要分開理解。' },
      ] },
      { id: 'enterohepatic', title: '膽汁與腸肝再循環', nodes: [
        { id: 'bile', label: '膽汁進入腸道', detail: '部分代謝物以結合型態進入膽汁，再到達腸道。膽汁同時也承擔正常脂肪消化的重要任務。' },
        { id: 'beta-glucuronidase', label: 'β-葡萄糖醛酸苷酶', via: '腸道微生物酵素', detail: '部分微生物酵素可移除葡萄糖醛酸基團，使某些分子重新獲得被吸收的機會；不同菌種與分子的作用並不相同。' },
        { id: 'reabsorption', label: '排出或再吸收', via: '腸道運輸與分子特性', detail: '腸蠕動、菌相與分子特性共同決定後續去向。腸肝再循環也是某些正常生理物質及藥物的代謝特性。' },
      ] },
      { id: 'renal', title: '腎臟與日常照顧', nodes: [
        { id: 'renal-blood', label: '血液中的代謝物', detail: '尿素、尿酸及其他代謝物經循環到達腎臟；各自的生成與清除方式不同。' },
        { id: 'filtration', label: '腎小球與腎小管', via: '過濾、分泌、再吸收', detail: '腎臟不是只把水濾出去：腎小管還會分泌、再吸收溶質，協調電解質與酸鹼平衡。' },
        { id: 'excretion', label: '尿液排泄', via: '依腎功能與身體需要調節', detail: '尿量增加不等於毒素清除變快，也不能由喝某種沖泡飲推論尿酸或腎功能改善。日常補水量仍須配合個人心腎狀態。' },
      ] },
    ],
    products: [
      { productId: 'antrodia', nodeIds: ['phase-one', 'phase-two'], ingredient: '牛樟芝與複合菌菇原料', connection: '連到菌菇成分的肝臟與細胞研究主題；專利、原料研究及成品人體結果分別記錄，不把專利直接當作肝指數變化。', evidence: '原料研究' },
      { productId: 'lisheng', nodeIds: ['renal-blood', 'filtration'], ingredient: '靈芝、蘆筍、香菇與黃耆等', connection: '從沖泡飲的植物原料延伸認識體液與腎臟生理，重點是看懂過濾、再吸收及排泄的分工。', evidence: '原料研究' },
      { productId: 'kanger-n', nodeIds: ['beta-glucuronidase', 'reabsorption'], ingredient: '複合乳酸菌與水果酵素', connection: '把配方放在菌相與消化的閱讀節點；腸道酵素活性需要依特定菌株與實際研究判讀。', evidence: '原料研究' },
      { productId: '995', nodeIds: ['phase-two'], ingredient: '胺基酸與卵磷脂原料', connection: '回到甲基循環與胺基酸供應，理解結合反應所需原料與肝臟酵素各自的工作。', evidence: '營養生理' },
    ],
    references: [
      { label: '環境文稿重製圖解：4D 以 Drain、Detox、Desensitize、Drive 整理引流、代謝、敏感反應與壓力調節，不是四個連續的酵素反應。' },
      { label: 'NIDDK：腎臟的構造與工作', url: 'https://www.niddk.nih.gov/health-information/kidney-disease/kidneys-how-they-work' },
    ],
  },
];

export const pathwayById = new Map(biochemicalPathways.map(pathway => [pathway.id, pathway]));
export const pillarPathwayIds: Record<PillarId, PathwayId[]> = {
  repair: ['methylation', 'mitochondria', 'neurosteroids', 'gut-barrier', 'detox'],
  neural: ['resolution', 'vascular', 'mitochondria', 'methylation', 'tryptophan'],
  inflammation: ['gut-barrier', 'resolution', 'detox', 'tryptophan'],
  autonomic: ['tryptophan', 'neurosteroids', 'mitochondria'],
};
export const productPathwayIds: Record<string, PathwayId[]> = Object.fromEntries(
  ['995', '360', 'antrodia', 'antrodia-drops', 'kanger', 'kanger-n', 'kangyue', 'huoyi', 'ningkang', 'dikang', 'lisheng', 'kangbei']
    .map(productId => [productId, biochemicalPathways.filter(pathway => pathway.products.some(product => product.productId === productId)).map(pathway => pathway.id)]),
);
