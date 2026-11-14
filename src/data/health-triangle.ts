import type { LongevityDeckId } from './longevity-decks-manifest';
export const axisIds = ['inflammation', 'repair', 'autonomic'] as const;
export type AxisId = typeof axisIds[number];
export const triangleAxes: { id: AxisId; title: string; short: string; metaphor: string; intro: string; everyday: string[] }[] = [
  { id: 'inflammation', title: '慢性發炎', short: '發炎', metaphor: '讓警報有機會安靜下來', intro: '發炎是身體的防禦反應；持續低度發炎與清除失衡，才是需要理解的研究主題。關節痛或疲倦有很多原因，不能只憑感覺判定發炎。', everyday: ['以蔬菜、全穀與足量蛋白質取代部分超加工食品。', '留意居家潮濕、菸害及持續不適，必要時接受醫療評估。'] },
  { id: 'repair', title: '細胞自癒力', short: '修復', metaphor: '補足原料，也照顧修復條件', intro: '修復需要營養、循環、睡眠與適當活動共同支持。甲基化和粒線體像不同的工作站，並沒有一顆保健品能打開所有修復開關。', everyday: ['先確認每天吃得下、吃得夠，再討論是否需要補充。', '依身體能力安排肌力活動，病後或疼痛時配合復健計畫。'] },
  { id: 'autonomic', title: '自律神經', short: '神經', metaphor: '讓忙碌與休息重新取得平衡', intro: '交感與副交感神經共同調整身體；壓力、疼痛、腸道與睡眠會互相影響。心悸或失眠也可能有其他病因。', everyday: ['保持固定起床時間，白天活動，晚上減少刺激。', '慢慢呼吸與安排休息；持續心悸、失眠或情緒困擾請尋求協助。'] },
];
export type SlideTarget = { deckId: LongevityDeckId; slideId: string };
export interface MechanismCard {
  id: string; axis: AxisId; title: string; simple: string; science: string; boundary: string;
  terms: string[]; sourceIds: string[]; productIds: string[]; slide: SlideTarget;
}
export const mechanismCards: MechanismCard[] = [
  { id: 'gut-barrier', axis: 'inflammation', title: '腸道屏障與免疫訊號', simple: '腸道像有選擇性的門，不是把所有東西都擋在外面。', science: '緊密連接（Tight Junctions）、GALT 與菌相參與屏障及黏膜免疫。文件以 Zonulin→PAR2／EGFR→ZO-1 重新分布，說明通透性調節的研究模型。LPS 經 LBP／CD14／TLR4 訊號可活化 NF-κB，影響 TNF-α、IL-6 等發炎訊號。', boundary: '腹脹不能直接診斷「腸漏」；糞便 Zonulin 等檢查有方法限制。益生菌是否有幫助須看菌株、配方、族群與終點。', terms: ['GALT','Tight Junctions','Zonulin','PAR2','EGFR','ZO-1','LPS','TLR4','NF-κB','TNF-α','IL-6'], sourceIds: ['L6','P1','Q6'], productIds: ['kanger','kanger-n'], slide: { deckId: 'longevity-6', slideId: 'longevity-6-2' } },
  { id: 'inflammasome', axis: 'inflammation', title: '發炎訊號如何被放大', simple: '警報響了之後，身體也需要一套「收工」機制。', science: 'DAMPs、粒線體 ROS 與離子變化參與 NLRP3 發炎小體的預備及啟動。Caspase-1、GSDMD、IL-1β／IL-18 與焦亡（Pyroptosis），以及衰老細胞的 SASP，是相關研究路徑。', boundary: '這些是細胞層級的機制，不能由勾選症狀推估活性，也不能直接推論菌菇或益生菌成品可阻斷整條路徑。', terms: ['DAMPs','NLRP3','Caspase-1','GSDMD','IL-1β','IL-18','SASP'], sourceIds: ['L4','L6','Q4','Q6'], productIds: [], slide: { deckId: 'longevity-6', slideId: 'longevity-6-3' } },
  { id: 'resolution', axis: 'inflammation', title: '消退，是主動整理的過程', simple: '除了停止警報，還要把受損的現場整理好。', science: '巨噬細胞的胞葬（Efferocytosis）清除凋亡細胞。SPM 包含 Lipoxins、Resolvins、Protectins、Maresins；Lipoxins 主要衍生自花生四烯酸 AA，其他家族則與 EPA／DHA 的轉化相關，不能一概說成來自魚油。18-HEPE、17-HDHA、14-HDHA 等 PRM 與發炎消退研究相關。', boundary: '文件中的海洋脂質配方與特定試驗，不是十二款葡眾產品的試驗；一般魚油、SPM、亞麻仁籽不可視為相同原料。', terms: ['Efferocytosis','SPM','PRM','Lipoxins','Resolvins','Protectins','Maresins','18-HEPE','17-HDHA','14-HDHA'], sourceIds: ['L4','Q4'], productIds: [], slide: { deckId: 'longevity-4', slideId: 'longevity-4-1' } },
  { id: 'redox', axis: 'inflammation', title: '抗氧化，要的是平衡', simple: '把身體想成有調節能力的系統，不必把所有氧化訊號清光。', science: '適量 ROS 參與訊號與免疫；超過緩衝能力時可能造成脂質、蛋白質與 DNA 損傷。SOD、GSH／GSSG、GPX、TrxR 與 Nrf2 參與氧化還原防禦。8-OHdG、MDA 等為不同的研究或檢驗指標。', boundary: '試管中的 SOD 樣活性，不等於口服成品可提升人體酵素或治療慢性發炎；「越抗氧化越好」也不成立。', terms: ['ROS','SOD','GSH','GSSG','GPX','TrxR','Nrf2','8-OHdG','MDA'], sourceIds: ['L1','L4','P1','Q1','Q4'], productIds: ['995','antrodia','ningkang'], slide: { deckId: 'longevity-1', slideId: 'longevity-1-3' } },
  { id: 'exposure', axis: 'inflammation', title: '先改善環境，再談補充', simple: '若屋頂還在漏水，先找出漏水處，比急著買補充品更重要。', science: '文件討論 DON、Gliotoxin、OTA、ZEA 等黴菌毒素、腸肝循環與 UGT 結合代謝，以及 EDCs 對內分泌的研究。4D 以環境、引流、代謝與神經調節整理照護議題。', boundary: '不能把疲倦都歸因於黴菌，也不宜靠尿液毒素單獨診斷。原文鼻噴、阻斷、精油、結合劑與排毒劑量不作為居家操作建議；葡眾產品也不是抗黴或抗輻射用品。', terms: ['DON','Gliotoxin','OTA','ZEA','EDCs','UGT','4D','腸肝循環'], sourceIds: ['L2','L3','P1','Q3'], productIds: [], slide: { deckId: 'longevity-2', slideId: 'longevity-2-2' } },
  { id: 'vascular', axis: 'inflammation', title: '血管健康，看整體風險', simple: '照顧血管，需要一起看生活習慣、檢查與治療。', science: 'ApoB、sdLDL、oxLDL、RLP、MPO／PON-1 與 HDL 功能呈現不同面向。殘餘脂蛋白 RLP 不必先氧化也可能參與斑塊形成；HDL 濃度與抗氧化功能並非同一件事。ADMA 可影響 eNOS／NO；腸道菌與肝臟 FMO3 參與膽鹼、肉鹼及 TMAO 代謝。', boundary: '指標不是本站診斷分數；降低某個數值不必然改善臨床結果。草本飲品不能「清血濁」、利尿或取代心血管治療；膽鹼也不適合無限加量。', terms: ['ApoB','sdLDL','oxLDL','RLP','MPO','PON-1','ADMA','eNOS','NO','TMAO','FMO3'], sourceIds: ['L5','P1','Q5'], productIds: ['dikang','lisheng'], slide: { deckId: 'longevity-5', slideId: 'longevity-5-3' } },
  { id: 'mitochondria', axis: 'repair', title: '粒線體的能量工作站', simple: '吃進的食物，要經過多個步驟才能變成身體可用的能量。', science: 'PDH 連接糖解與 TCA；電子傳遞鏈 ETC 參與 ATP 生成。B 群、CoQ10、肉鹼與脂肪酸 β-氧化有不同角色。尿液有機酸與醯基肉鹼只能放在整體臨床情境判讀。', boundary: '原文 MitoCORE 研究不能轉成 995／360 的效益，也不能把單一有機酸偏高等同某種營養缺乏。', terms: ['PDH','TCA','ETC','ATP','CoQ10','β-氧化','醯基肉鹼'], sourceIds: ['L1','L6','Q1','Q6'], productIds: ['995','360'], slide: { deckId: 'longevity-1', slideId: 'longevity-1-4' } },
  { id: 'methylation', axis: 'repair', title: '甲基化與營養循環', simple: '原料、回收與轉換，各有不同工作，不能只補一種就全部到位。', science: 'Methionine 參與 SAMe 代謝；卵磷脂（Lecithin）提供膽鹼來源。葉酸／B12 參與同半胱胺酸再甲基化，B6 參與轉硫，甜菜鹼可走 BHMT；COMT 亦使用甲基供體。', boundary: '不把同半胱胺酸叫成可直接清除的「毒素廢氣」，也不把卵磷脂說成必然保住甲硫胺酸。DNA 甲基化並非單一修復總開關。', terms: ['DNA 甲基化','Methionine','Lecithin','膽鹼','SAMe','Homocysteine','B6','B12','葉酸','BHMT','COMT'], sourceIds: ['L1','L3','L5','P1','Q1','Q3','Q5'], productIds: ['995','360'], slide: { deckId: 'longevity-3', slideId: 'longevity-3-3' } },
  { id: 'cellular-clearance', axis: 'repair', title: '細胞也需要汰舊換新', simple: '能量管理與整理受損零件，是相互配合的工作。', science: 'AMPK、SIRT1、NAD+／CD38、mTORC1 與 PGC-1α 參與能量感測、自噬及粒線體新生。受損 mtDNA 可啟動 cGAS–STING；尿石素 A 與 Mitophagy 為不同原料的研究話題。mTOR 作用具有組織差異：腸道幹細胞修補與肌肉合成仍需要適當活性，不能以全面抑制為目標。', boundary: '這些路徑不能用本站問卷量測，也不證明葡眾產品有尿石素 A、NMN 或可逆轉生物年齡。', terms: ['AMPK','SIRT1','NAD+','CD38','mTORC1','PGC-1α','mtDNA','cGAS','STING','Mitophagy','尿石素 A'], sourceIds: ['L1','L6','Q1','Q6'], productIds: [], slide: { deckId: 'longevity-6', slideId: 'longevity-6-3' } },
  { id: 'neural', axis: 'repair', title: '神經研究與日常照護', simple: '大腦像森林，照護需要多個條件，也需要時間與專業評估。', science: '猴頭素 A（Erinacine A）、NGF／BDNF、寡突膠質細胞與髓鞘鹼性蛋白 MBP，涉及神經營養和髓鞘研究；微膠質細胞也參與免疫與突觸調節。', boundary: '細胞、動物或特定原料研究不能直接證明活逸康可修復中風、腦外傷或人的髓鞘；突然麻木、無力或口齒改變需立即就醫。', terms: ['Erinacine A','NGF','BDNF','MBP','寡突膠質細胞','Microglia'], sourceIds: ['L4','P1','Q4'], productIds: ['huoyi'], slide: { deckId: 'longevity-4', slideId: 'longevity-4-3' } },
  { id: 'collagen-muscle', axis: 'repair', title: '肌肉與組織的修復條件', simple: '原料要夠，也要有合適的活動、休息與醫療照護。', science: '蛋白質、胺基酸、活動負荷與睡眠共同影響肌肉和膠原蛋白代謝。長期壓力及皮質醇與恢復相關；TNF-α／IL-6、MuRF1／atrogin-1、合成代謝阻抗與腸肌軸亦被研究。', boundary: '「皮質醇踩煞車」是比喻，並非所有慢性痛的原因；游離胺基酸仍須經吸收及代謝，不能宣稱免消化直接長出軟骨。', terms: ['Cortisol','膠原蛋白','MuRF1','atrogin-1','合成代謝阻抗','腸肌軸'], sourceIds: ['L6','P1','Q6'], productIds: ['995','360'], slide: { deckId: 'longevity-6', slideId: 'longevity-6-3' } },
  { id: 'aging-clocks', axis: 'repair', title: '看懂老化指標的限制', simple: '一張儀表板，可以提供線索，卻不能替代整台車的檢查。', science: 'HorvathAge、PhenoAge、GrimAge、DunedinPACE、OMICmAge、SYMPHONYAge 的訓練目標不同。追蹤需留意相同檢體、平台、前處理與演算法。', boundary: '時鐘或有機酸改善，不等於壽命延長、疾病逆轉或產品有效；原稿個案與小型樣本不能推論所有人。', terms: ['HorvathAge','PhenoAge','GrimAge','DunedinPACE','OMICmAge','SYMPHONYAge'], sourceIds: ['L1','L6','Q1','Q6'], productIds: [], slide: { deckId: 'longevity-1', slideId: 'longevity-1-2' } },
  { id: 'hpa', axis: 'autonomic', title: '壓力與 HPA 軸', simple: '身體需要動員，也需要休息；長期壓力可能讓調節變得費力。', science: '下視丘 CRH、腦下垂體 ACTH 與腎上腺皮質醇形成 HPA 回饋。交感與副交感的活動會隨情境改變；「Rest & Digest」有助理解休息與消化。', boundary: '長期壓力不一定代表皮質醇持續偏高。「腎上腺疲勞」或 AOS 不能憑症狀在此確診，適應原研究亦非成品降皮質醇保證。', terms: ['HPA','CRH','ACTH','Cortisol','Rest & Digest','刺五加'], sourceIds: ['L3','P1','Q3'], productIds: ['kangyue','360'], slide: { deckId: 'longevity-3', slideId: 'longevity-3-2' } },
  { id: 'gut-brain', axis: 'autonomic', title: '腸與腦，是雙向聯繫', simple: '腸道和情緒會互相影響，照顧時可一起記錄作息與飲食。', science: '迷走神經、SCFA／丁酸、免疫訊號與色胺酸代謝參與腸腦溝通。IDO、Kynurenine、QUIN／KYNA 為研究路徑；5R 包含 Remove、Replace、Reinoculate、Repair、Rebalance。', boundary: '不能由菌數推斷心情效果，也不能將其他菌株研究直接套在 GKJOY／GKF3 或複方產品；5R 不構成自行停藥、補胃酸或排毒的處方。', terms: ['Gut-Brain Axis','迷走神經','SCFA','丁酸','IDO','Kynurenine','QUIN','KYNA','5R','GKJOY','GKF3'], sourceIds: ['L3','L6','P1','Q3','Q6'], productIds: ['kangyue','kanger','kanger-n'], slide: { deckId: 'longevity-6', slideId: 'longevity-6-3' } },
  { id: 'sleep', axis: 'autonomic', title: '讓睡眠成為照護的一環', simple: '固定作息能幫助身體安排休息，不必追求神奇的排毒時刻。', science: 'Glymphatic 大腦膠淋巴系統、睡眠與 Aβ 清除有研究關聯。GABA 是抑制性傳遞物質，L-Tryptophan 為血清素與褪黑激素代謝的原料之一。', boundary: '口服 GABA 不等於直接進入腦中踩煞車；康貝寧不能宣稱清除病理蛋白。原稿「80% 修復」並非人人適用的量化規則。', terms: ['Glymphatic','Aβ','GABA','L-Tryptophan','Serotonin','Melatonin','SCN'], sourceIds: ['L1','L3','P1','Q1','Q3'], productIds: ['kangbei'], slide: { deckId: 'longevity-3', slideId: 'longevity-3-4' } },
  { id: 'hormones', axis: 'autonomic', title: '相同症狀，可能不同原因', simple: '疲倦或睡不好，不一定只和壓力有關。', science: 'HPO／HPG、HPA、HPT 共用中樞調節；原稿的 OAT／TAT 分別用卵巢或睪丸、腎上腺、甲狀腺，整理互相關聯的評估方向。ALLO、P5S、DHEA(S) 與 GABA-A／NMDA 受體有神經類固醇研究；COMT、雌激素代謝與 Estrobolome 亦參與調節。', boundary: '不能依本頁自行補充荷爾蒙、甲狀腺素或停藥；檢驗數值需結合年齡、週期、病史與適應症，不套用單一理想區間。', terms: ['OAT','TAT','HPO','HPG','HPT','ALLO','P5S','DHEA','GABA-A','NMDA','COMT','Estrobolome'], sourceIds: ['L3','Q3'], productIds: [], slide: { deckId: 'longevity-3', slideId: 'longevity-3-1' } },
  { id: 'brain-lipids', axis: 'repair', title: '看清不同脂質的差別', simple: '名稱都帶「脂」，不代表做的是同一份工作。', science: 'LPC-DHA／LPC-EPA 與血腦屏障 MFSD2A 轉運有關；TG-DHA、磷脂、卵磷脂及亞麻仁籽 ALA 的結構和代謝不同。原 PDF 第 27 頁為小鼠注射研究，第 28 頁提及人體試驗待發布；這些資料不能直接推論口服成品的效果。', boundary: '十二款產品未提供 LPC-DHA 或 SPM 的確切標示，不能當作同等替代，也不能將動物腦部含量變化宣稱為人體記憶改善。', terms: ['LPC-DHA','LPC-EPA','MFSD2A','TG-DHA','ALA','血腦屏障'], sourceIds: ['L4','L3','Q4','Q3'], productIds: [], slide: { deckId: 'longevity-4', slideId: 'longevity-4-3' } },
];
export const mechanismById = new Map(mechanismCards.map(card => [card.id, card]));
export const concernChoices: { id: string; label: string; axes: AxisId[]; mechanisms: string[]; products: string[]; medicalReview?: boolean }[] = [
  { id: 'pain', label: '關節筋骨痠痛、慢性疼痛', axes: ['inflammation','repair'], mechanisms: ['collagen-muscle','resolution','hpa'], products: ['995','360'] },
  { id: 'neural', label: '手腳麻刺、記性改變', axes: ['repair','autonomic'], mechanisms: ['neural','brain-lipids','methylation'], products: ['huoyi','995'] },
  { id: 'sleep', label: '翻來覆去、多夢易醒', axes: ['autonomic','repair'], mechanisms: ['sleep','hpa','hormones'], products: ['kangbei','kangyue'] },
  { id: 'gut', label: '肚子脹氣、排便不順', axes: ['inflammation','autonomic'], mechanisms: ['gut-barrier','gut-brain','inflammasome'], products: ['kanger','kanger-n','kangyue'] },
  { id: 'circulation', label: '胸悶心悸、手腳冰冷或浮腫', axes: ['inflammation','autonomic'], mechanisms: ['vascular','hpa'], products: [], medicalReview: true },
  { id: 'recovery', label: '用眼疲勞、病後體力照護', axes: ['repair','autonomic'], mechanisms: ['mitochondria','collagen-muscle','exposure'], products: [], medicalReview: true },
];
export const productMechanisms: Record<string, string[]> = {
  '995': ['methylation','redox','collagen-muscle'], 'antrodia': ['redox','exposure'], 'antrodia-drops': ['redox','neural'],
  'kanger': ['gut-barrier','gut-brain'], 'kanger-n': ['gut-barrier','gut-brain'], 'kangyue': ['gut-brain','hpa'],
  'huoyi': ['neural','brain-lipids'], 'ningkang': ['redox','exposure'], '360': ['methylation','mitochondria','hpa'],
  'dikang': ['vascular'], 'lisheng': ['vascular'], 'kangbei': ['sleep','hpa'],
};
export const productComparisonNotes: Record<string, string> = {
  '995': '可對照胺基酸與膽鹼主題；不是 MitoCORE、NAC 或甲基化治療的同等替代。',
  'antrodia': '比較菌菇原料與抗氧化研究；保肝專利不等於治療肝病、COPD 或排黴。',
  'antrodia-drops': '與樟芝益比較濃縮形式與重複原料；不作急救或舌下用法建議。',
  'kanger': '與康爾喜 N 比較配方後再討論選擇，菌數相加不代表效果相加。',
  'kanger-n': '比一般款增加酵素原料；不當作腸漏、消腫或術後防沾黏處方。',
  'kangyue': 'GKJOY／GKF3 的效果須看特定人體試驗；不保證提高個人的腦內傳遞物質。',
  'huoyi': '猴頭菇研究可閱讀；不等於 LPC-DHA、SPM，亦不是中風或失智治療。',
  'ningkang': '菌菇、初乳及綠茶原料可比較；不能作為手機電磁波或游離輻射防護。',
  '360': '組合已含康爾喜與迪康，且有調理膠囊；加入其他產品前要避免重複。',
  'dikang': '草本原料可能與抗凝血藥交互作用，懷孕不建議食用；胸悶先評估。',
  'lisheng': '有水腫、腎病、心臟病或限水需求時，先評估原因，不自行利尿。',
  'kangbei': '含色胺酸與 GABA；使用鎮靜、安眠或影響血清素的藥物者先諮詢。',
};
export const dailyCare = [
  { period: '早晨', text: '固定起床，安排適合自己的早餐與日光活動；需要限制飲水或蛋白質者依醫囑。' },
  { period: '白天', text: '多樣化飲食、適量纖維與合適活動，記錄身體反應；不自行高強度運動或長時間禁食。' },
  { period: '夜晚', text: '保留放鬆與固定睡眠時間，減少睡前刺激；補充品的用法以標示及專業建議為準。' },
];
