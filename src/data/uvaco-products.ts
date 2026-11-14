import type { Cluster, Phase, Product } from '@/types/product';
import sourceMaterials from './source-materials.json';
import { productPillar, lectureCoordinates } from './lecture-poster';

export const clusters: Record<Cluster, { name: string; color: string; short: string }> = {
  cellular_energy: { name: '細胞營養島', short: '日常營養', color: '#DBB66D' },
  liver_defense: { name: '日間守護島', short: '日間守護', color: '#C6937D' },
  gut_microbiome: { name: '腸道花園島', short: '腸道花園', color: '#8DBB95' },
  brain_forest: { name: '大腦森林島', short: '大腦森林', color: '#A7C6C9' },
  circulation_detox: { name: '循環水道島', short: '循環水道', color: '#7CAAA6' },
};
export const phases: { id: Phase; name: string; label: string; sky: string; light: string }[] = [
  { id: 'morning', name: '清晨', label: '清晨甦醒', sky: '#B8D2CD', light: '#FFF0CD' },
  { id: 'day', name: '白天', label: '日間防禦', sky: '#B7D3D6', light: '#FFFFFF' },
  { id: 'evening', name: '黃昏', label: '黃昏舒壓', sky: '#BDAB9D', light: '#FFCA94' },
  { id: 'night', name: '夜晚', label: '夜間修復', sky: '#23434E', light: '#C4DDEA' },
];

const baseProducts: Product[] = [
  {
    id: '995', name: '995 生技營養品', fullName: '995 生技營養品（永生福朗）', islandCluster: 'cellular_energy', hexCoordinates: [0, 0],
    elderlyHook: '好好吃飯，為每一天添一點元氣',
    introduction: '把營養想成照顧花園的日常補給。這一站認識發酵營養與胺基酸，也提醒您：病後補養要先確認吃得下、吃得夠，再與醫療團隊討論補充品。',
    symptomsMatched: ['體力差想補元氣'], ingredients: ['大豆與小麥胚芽發酵液', '游離胺基酸（含甲硫胺酸）', '短鏈胜肽', '大豆卵磷脂', '酸莖菌、龍根菌（依提供資料）', '香菇多醣'], patentsAndHonors: [],
    mechanisms: { antiInflammation: '提供資料提及 SOD 樣活性與抗氧化研究；試管中的抗氧化活性，不等於人體抗發炎療效。', selfHealing: '胺基酸是合成蛋白質的原料；甲硫胺酸參與正常甲基化代謝，但不能據此推論本品可啟動 DNA 修復或免經消化直接餵養細胞。', autonomicNerve: '部分胺基酸參與神經傳遞物質合成；目前提供資料不足以證實本品可修復自律神經。' },
    synergyLinks: [{ targetProductId: 'huoyi', reason: '一起認識日常營養與神經研究；不是已證實的聯合治療。' }, { targetProductId: '360', reason: '比較餐食與營養補充，避免重複攝取。' }], recommendedTimeOfDay: 'evening',
    caution: '含大豆、小麥相關原料；過敏、腎臟病或需限制蛋白質者，請先詢問醫師或營養師。', motif: 'golden cellular fountain, amino acid droplets, soybean leaves', source: 'user-brief',
  },
  {
    id: 'antrodia', name: '樟芝益', fullName: '樟芝益液態發酵菌絲體生技營養品', islandCluster: 'liver_defense', hexCoordinates: [-1, -1],
    elderlyHook: '像照顧老樹一樣，照顧日常作息', introduction: '從一棵樟樹，認識菌絲體的世界。這一站帶您看五種菇類的原料資訊；肝功能異常時，先查明原因，比自行加吃保健品更重要。', symptomsMatched: ['應酬外食怕油膩'],
    ingredients: ['牛樟芝菌絲體', '舞茸', '巴西蘑菇', '桑黃', '雲芝'], patentsAndHonors: ['提供資料列有保肝相關專利、18 項發明專利與 SCI 論文；各項認證的範圍以原文件與證書為準。', '提供資料列有 FDA NDI；NDI 通知不等於 FDA 核准療效。'],
    mechanisms: { antiInflammation: '牛樟芝三萜與多醣有抗氧化、發炎相關研究；本品降低 GOT/GPT 或改善 COPD 的臨床效果尚不能由本資料確認。', selfHealing: '菌類成分與免疫細胞反應是研究主題，不能直接解讀為強化人體解毒或修復肝細胞。', autonomicNerve: '疲勞可能來自睡眠、藥物或疾病；不能用「毒素堆積」替代診斷。' },
    synergyLinks: [{ targetProductId: 'antrodia-drops', reason: '比較兩種樟芝產品的形式與重複原料。' }, { targetProductId: 'ningkang', reason: '認識菌菇原料的異同，不代表抗輻射搭配。' }], recommendedTimeOfDay: 'day', caution: '肝功能異常、肝病治療或長期用藥者，食用前請讓醫師確認產品標示。', motif: 'ancient camphor tree with delicate antrodia mycelium and five mushrooms', source: 'user-brief',
  },
  {
    id: 'antrodia-drops', name: '樟芝滴粒', fullName: '樟芝菌絲體滴粒', islandCluster: 'liver_defense', hexCoordinates: [-2, 0], elderlyHook: '小小一顆，先看清楚怎麼吃',
    introduction: '濃縮滴粒像一顆隨身帶著的紅寶石。形式小巧不代表能急救；怎麼食用與食用多少，都應以實際包裝標示為準。', symptomsMatched: ['應酬外食怕油膩'], ingredients: ['濃縮樟芝菌絲體萃取物', '4-AAQB（依提供資料）', '多醣體', '紅藜麥'], patentsAndHonors: [],
    mechanisms: { antiInflammation: '4-AAQB 有發炎訊息相關的前臨床研究；不能以成分研究證實本品對人體疾病有效。', selfHealing: '免疫細胞與抗原呈現屬研究機制，並非本品已被證實的精準細胞修復功能。', autonomicNerve: '沒有足夠資料支持即時緩解缺氧或急性高壓；胸悶、呼吸不順需就醫。' },
    synergyLinks: [{ targetProductId: 'antrodia', reason: '同類菌絲體來源可能重複，先比較再討論是否需要。' }, { targetProductId: 'ningkang', reason: '查看菌菇原料，不當作急救或疾病防護。' }], recommendedTimeOfDay: 'night', caution: '不可當作急救用品；是否可舌下使用須依產品標示，勿自行改變用法。', motif: 'ruby botanical seed capsule with red quinoa sprigs and mycelium', source: 'user-brief',
  },
  {
    id: 'kanger', name: '康爾喜', fullName: '康爾喜乳酸菌顆粒', islandCluster: 'gut_microbiome', hexCoordinates: [1, -2], elderlyHook: '把腸道當花園，慢慢照顧好土壤', introduction: '腸道花園需要規律飲食、足夠水分與適量纖維。認識乳酸菌之前，先記錄自己的排便習慣，讓日常照顧更有方向。', symptomsMatched: ['排便不順肚子脹'],
    ingredients: ['13 株複合乳酸菌（提供資料列出廠 700 億菌）', '微膠囊包埋', '異麥芽寡糖', 'β-胡蘿蔔素'], patentsAndHonors: ['提供資料提及菌株及包埋專利；專利適用範圍依原文件。'],
    mechanisms: { antiInflammation: '腸道屏障與免疫互動是重要研究領域；不能宣稱補充本品即可治好「腸漏」或阻斷全身發炎。', selfHealing: '部分腸道菌可產生短鏈脂肪酸；作用取決於菌株、飲食與個人狀況。', autonomicNerve: '腸腦軸描述腸道與神經的雙向溝通，不代表每一種益生菌都能改善情緒或自律神經。' },
    synergyLinks: [{ targetProductId: 'kangyue', reason: '延伸了解不同菌株的研究方向。' }, { targetProductId: 'kangbei', reason: '一起檢視排便與睡眠習慣，不代表須同時補充。' }], recommendedTimeOfDay: 'morning', caution: '嚴重免疫低下、重症或有中央靜脈導管者，補充益生菌前請先詢問醫療團隊。', motif: 'probiotic greenhouse, microscopic capsules shielding a flourishing botanical garden', source: 'user-brief',
  },
  {
    id: 'kanger-n', name: '康爾喜 N', fullName: '康爾喜（N）乳酸菌顆粒', islandCluster: 'gut_microbiome', hexCoordinates: [2, -2], elderlyHook: '吃得舒服，從每天的小習慣開始', introduction: '在腸道花園裡，多認識鳳梨與木瓜酵素。排便不順先留意水分、纖維與活動；持續腹痛或排便帶血時，請先就醫。', symptomsMatched: ['排便不順肚子脹'],
    ingredients: ['13 株複合乳酸菌（提供資料列出廠 1,000 億菌）', '鳳梨酵素', '木瓜酵素', '異麥芽寡糖'], patentsAndHonors: [],
    mechanisms: { antiInflammation: '蛋白酶有特定研究用途；不能推論口服本品可預防手術沾黏或治療水腫。', selfHealing: '酵素參與蛋白質分解，但本品能否改善過敏或加速黏膜更新，仍需產品層級的臨床證據。', autonomicNerve: '便祕和腹脹成因很多，不能直接歸因於交感神經亢進。' },
    synergyLinks: [{ targetProductId: 'kangyue', reason: '了解不同益生菌配方，不需要把菌數相加當成療效。' }, { targetProductId: 'kangbei', reason: '建立腸道與作息紀錄，與專業人員討論。' }], recommendedTimeOfDay: 'morning', caution: '對鳳梨、木瓜過敏，或正在使用抗凝血、抗血小板藥物者，請先諮詢。', motif: 'pineapple and papaya enzyme orchard with probiotic seeds', source: 'user-brief',
  },
  {
    id: 'kangyue', name: '康悅兒', fullName: '康悅兒乳酸菌顆粒', islandCluster: 'gut_microbiome', hexCoordinates: [2, -1], elderlyHook: '給心情一點空間，也照顧腸道', introduction: '就像午後走進橙樹花園，給自己放鬆的時間。這一站認識精神益生菌研究；持續焦慮或情緒低落時，也值得尋求專業支持。', symptomsMatched: ['心情緊繃難放鬆'],
    ingredients: ['GKJOY、GKF3 益生菌（依提供資料）', '甜橙萃取物', '異麥芽寡糖'], patentsAndHonors: ['提供資料提及獨家專利菌株，菌株與專利適用範圍依原文件。'],
    mechanisms: { antiInflammation: '壓力、HPA 軸與免疫之間有關聯；不能宣稱本品切斷神經發炎。', selfHealing: '休息與消化需要適當的生活節律；沒有足夠證據支持本品直接啟動深層組織修復。', autonomicNerve: '精神益生菌研究需區分動物與人體結果；不能把腦內血清素或多巴胺變化直接套用到使用者。' },
    synergyLinks: [{ targetProductId: 'kanger', reason: '比較菌株研究與日常腸道照顧。' }, { targetProductId: 'kangbei', reason: '由白天放鬆延伸到晚間作息教育。' }, { targetProductId: 'huoyi', reason: '認識腸腦溝通與神經研究的差別。' }], recommendedTimeOfDay: 'evening', caution: '不取代心理治療或精神科藥物；正在治療者請先和醫師討論。', motif: 'orange blossom garden and gentle interconnected probiotic cells', source: 'user-brief',
  },
  {
    id: 'huoyi', name: '活逸康', fullName: '活逸康猴頭菇菌絲體膠囊／顆粒', islandCluster: 'brain_forest', hexCoordinates: [1, 1], elderlyHook: '照顧大腦森林，從日常開始', introduction: '把大腦想成一座森林，睡眠、活動與均衡飲食都是日常照護。猴頭菇研究像探索森林的小徑；它不是已證實能修補神經或治療失智的答案。', symptomsMatched: ['常常忘東忘西', '翻來覆去睡不著'],
    ingredients: ['猴頭菇菌絲體（猴頭素 A）', '丹參', '薑黃', '綠茶萃取物'], patentsAndHonors: ['提供資料提及液態深層發酵專利；膠囊與顆粒含量應以當期包裝檢驗資料為準。'],
    mechanisms: { antiInflammation: '微膠質細胞、Aβ 與 Tau 參與神經退化研究；成分的前臨床研究不等於本品可阻斷失智病程。', selfHealing: '猴頭素與 NGF、BDNF 有研究關聯；穿越血腦屏障、髓鞘修復等結果需分清研究對象，不能保證對人體有效。', autonomicNerve: '記憶變化、手腳麻木或動作改變應先評估原因，不能假定補充本品即可重建神經路徑。' },
    synergyLinks: [{ targetProductId: '995', reason: '把均衡營養與腦健康教育一起看，非髓鞘修復處方。' }, { targetProductId: '360', reason: '認識 B 群與正常代謝，不代表聯用可延緩神經退化。' }, { targetProductId: 'kangbei', reason: '規律睡眠是腦健康照護的一部分。' }], recommendedTimeOfDay: 'night', caution: '記憶變化影響生活，請就醫評估；服用抗凝血藥或有菇類過敏者先諮詢。', motif: 'hericium erinaceus neural forest dome, branching mycelium and delicate neuron canopy', source: 'user-brief',
  },
  {
    id: 'ningkang', name: '寧康福', fullName: '寧康福膠囊', islandCluster: 'liver_defense', hexCoordinates: [-1, 0], elderlyHook: '日常守護，從吃好與休息開始', introduction: '防護罩是認識菌菇原料的視覺比喻，不是電磁波屏障。日常使用手機與看電視，更實際的照顧是適度休息、護眼與保持活動。', symptomsMatched: ['應酬外食怕油膩'],
    ingredients: ['桑黃菌絲體發酵粉', '蛹蟲草菌絲體發酵液粉', '初乳粉', '大豆卵磷脂', '綠茶萃取物', '墨角藻'], patentsAndHonors: [],
    mechanisms: { antiInflammation: '抗氧化成分研究不等於可保護人體免受手機或電視電磁波影響，現有資料不足以支持這類防護宣稱。', selfHealing: '初乳中的免疫球蛋白與生長因子不能直接推論為口服後能修補全身細胞。', autonomicNerve: '尚無充分資料支持本品可穩定所謂「電磁干擾」的膜電位或改善自律神經。' },
    synergyLinks: [{ targetProductId: 'antrodia', reason: '比較菌菇原料；不代表抗輻射配方。' }, { targetProductId: 'antrodia-drops', reason: '留意成分重複與個人用藥。' }], recommendedTimeOfDay: 'day', caution: '含乳、大豆相關原料；過敏、甲狀腺疾病或特殊用藥者，請先確認適用性。', motif: 'phellinus mushroom conservatory under a botanical dome', source: 'user-brief',
  },
  {
    id: '360', name: '360 計畫', fullName: '葡眾 360 計劃單日盒', islandCluster: 'cellular_energy', hexCoordinates: [0, -1], elderlyHook: '把一天的營養，整理得清清楚楚', introduction: '像出門前整理好隨身行李，把一天吃的東西看清楚。組合產品也可能與平常的補充品重複，先攤開標示比較，再討論是否適合自己。', symptomsMatched: ['體力差想補元氣'],
    ingredients: ['原味餐包：大豆蛋白、刺五加、靈芝、亞麻仁籽、啤酒酵母 B 群', '康爾喜', '迪康', '全身調理膠囊：995、靈芝、冬蟲夏草、紅麴（依提供資料）'], patentsAndHonors: [],
    mechanisms: { antiInflammation: '組合多種原料不等於多路阻斷發炎，整體療效需有該組合的人體研究。', selfHealing: '葉酸、B6、B12 參與同半胱胺酸代謝；補充不等於能修復髓鞘或預防失智，應先確認營養需要。', autonomicNerve: '刺五加的適應原研究不代表本組合可以治療自律神經失調或調控個人的皮質醇。' },
    synergyLinks: [{ targetProductId: '995', reason: '確認組合內外是否有重複營養。' }, { targetProductId: 'huoyi', reason: '了解日常營養與神經研究，不當作聯合治療。' }, { targetProductId: 'dikang', reason: '組合已列有迪康，額外補充前先查標示。' }, { targetProductId: 'lisheng', reason: '比較飲品原料，留意用藥與飲水限制。' }], recommendedTimeOfDay: 'morning', caution: '含多種配方；紅麴可能與降血脂藥物重複作用。孕期、肝腎疾病或多重用藥者先諮詢。', motif: 'circular nutrition garden with soybean grain, flax and botanical compass', source: 'user-brief',
  },
  {
    id: 'dikang', name: '迪康', fullName: '迪康沖泡飲', islandCluster: 'circulation_detox', hexCoordinates: [-1, 2], elderlyHook: '一杯溫暖，也記得起身走一走', introduction: '用溫暖的飲品認識草本原料，也把活動與均衡飲食放回生活裡。手腳冰冷原因很多，胸悶與心悸更不適合靠飲品處理。', symptomsMatched: ['應酬外食怕油膩'],
    ingredients: ['山楂', '陳皮', '藏紅花', '丹參', '熟地', '人蔘', '麥門冬', '炒麥芽', '枸杞'], patentsAndHonors: [],
    mechanisms: { antiInflammation: '丹參與藏紅花有血管相關研究；不能據此宣稱本品能預防腦部白質病變。', selfHealing: '「血管清道夫」是比喻，並非本品能清除血管脂肪、疏通微血管或改變紅血球排列的臨床證據。', autonomicNerve: '胸悶、心悸或末梢冰冷需判斷原因；本品不取代心血管疾病評估。' },
    synergyLinks: [{ targetProductId: 'lisheng', reason: '一起認識草本飲品與用藥注意事項。' }, { targetProductId: '360', reason: '360 計畫已含迪康，注意不要重複添加。' }], recommendedTimeOfDay: 'day', caution: '依提供資料，懷孕期間不建議食用；使用抗凝血或抗血小板藥物者先詢問醫師。', motif: 'hawthorn and saffron water garden, branching botanical canals', source: 'user-brief',
  },
  {
    id: 'lisheng', name: '力盛', fullName: '力盛沖泡飲', islandCluster: 'circulation_detox', hexCoordinates: [0, 2], elderlyHook: '好好喝水，也留心身體的變化', introduction: '把生活想成一條流動的水道，飲水、飲食與活動都需要平衡。新出現的水腫不是單純「排毒」問題，先找出原因才能安心。', symptomsMatched: ['體力差想補元氣'],
    ingredients: ['靈芝子實體', '香菇', '蘆筍', '桑椹', '枸杞', '草決明', '黃耆', '羅漢果'], patentsAndHonors: [],
    mechanisms: { antiInflammation: '草本抗氧化研究不能推論本品可改善腎小球發炎或治療水腫。', selfHealing: '肝腎負責代謝與排泄；沒有足夠證據支持本品能排出過量鈉鹽或含氮廢物。', autonomicNerve: '體液與血壓問題需個別評估，飲品不能替代心臟、腎臟或電解質異常的治療。' },
    synergyLinks: [{ targetProductId: 'dikang', reason: '比較草本原料，先確認個人適用性。' }, { targetProductId: '360', reason: '檢視一天所有補充品，避免重複成分。' }], recommendedTimeOfDay: 'day', caution: '水腫、心臟病、腎病或需限水者，勿自行用本品利尿或增加飲水量。', motif: 'asparagus and mulberry terraced water channels with reishi mushrooms', source: 'user-brief',
  },
  {
    id: 'kangbei', name: '康貝寧', fullName: '康貝寧膠囊', islandCluster: 'brain_forest', hexCoordinates: [2, 0], elderlyHook: '讓夜晚慢下來，為休息留點時間', introduction: '月光亭提醒我們，入睡前可以把燈調暗、把節奏放慢。先建立規律的作息；長期睡不好或白天嗜睡，請讓專業人員一起找原因。', symptomsMatched: ['翻來覆去睡不著', '心情緊繃難放鬆'],
    ingredients: ['蜜環菌菌絲體', 'L-色胺酸', '麩胺酸發酵物（GABA）', '茯苓', '五味子', '當歸', '熟地', '人參'], patentsAndHonors: [],
    mechanisms: { antiInflammation: '睡眠與腦內代謝清除有研究關聯；不能宣稱本品能清除類澱粉蛋白或預防失智。', selfHealing: '睡眠有助正常生理恢復；「80% 生長激素」不是適用所有人的固定比例，也不是本品療效。', autonomicNerve: '色胺酸參與血清素與褪黑激素合成；口服 GABA 的腦內作用仍有不確定性，不等於直接替交感神經踩煞車。' },
    synergyLinks: [{ targetProductId: 'kangyue', reason: '從白天壓力管理延伸到夜間規律作息。' }, { targetProductId: 'huoyi', reason: '了解睡眠與腦健康的關係，非失智治療。' }], recommendedTimeOfDay: 'night', caution: '服用安眠藥、鎮靜藥或影響血清素的藥物者，先請醫師或藥師確認交互作用。', motif: 'moonlit pavilion with armillaria mushrooms and gently curved neural branches', source: 'user-brief',
  },
];

export const products: Product[] = baseProducts.map(p => {
  const source = sourceMaterials.products.find(s => s.id === p.id)!;
  const entries = Object.entries(source.fields);
  return { ...p, hexCoordinates: lectureCoordinates[p.id], lecturePillar: productPillar.get(p.id), source: 'drive-extracted-text',
    ingredients: entries.filter(([key]) => /成分|組成|規格/.test(key)).map(([, value]) => value),
    sourceMechanisms: Object.fromEntries(entries.filter(([key]) => /發炎|自癒|神經/.test(key))),
    patentsAndHonors: entries.filter(([key]) => /專利|認證/.test(key)).map(([, value]) => value),
  };
});
export const productById = new Map(products.map(p => [p.id, p]));
export const symptomChoices = ['常常忘東忘西', '翻來覆去睡不著', '排便不順肚子脹', '體力差想補元氣', '應酬外食怕油膩', '心情緊繃難放鬆'];
export const sourceNote = '資料來源：葡眾產品機轉文件與簡報文字擷取。研究機制不等同成品療效；實際成分與用法依產品標示。';
export const timingNote = '晨、日、夕、夜是導覽情境，不是服用時刻；實際用法請依包裝標示與專業建議。';
