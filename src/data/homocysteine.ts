export type HomocysteineNodeId =
  | 'methionine'
  | 'sam'
  | 'sah'
  | 'hcy'
  | 'folate'
  | 'betaine'
  | 'cystathionine'
  | 'cysteine'
  | 'gsh';

export interface HomocysteineNode {
  id: HomocysteineNodeId;
  label: string;
  abbreviation: string;
  summary: string;
  detail: string;
  cofactor?: string;
  productIds: string[];
}

/** Product IDs open ingredient information; the arrows describe human metabolism.
 * Keep all prose product-free so the same diagram can appear before product act 3.
 * The folate/MTR and betaine/BHMT nodes represent parallel reaction stations,
 * not metabolites that homocysteine becomes. B6 is a cofactor of CBS and CSE.
 */
export const homocysteineNodes: HomocysteineNode[] = [
  {
    id: 'methionine',
    label: '甲硫胺酸',
    abbreviation: 'Methionine',
    summary: '飲食中的原料，供應蛋白質與甲基循環。',
    detail: '甲硫胺酸是必需胺基酸。身體利用甲硫胺酸腺苷轉移酶 MAT 與 ATP，將它轉成 SAM；它也直接參與蛋白質合成。食物蛋白質與游離胺基酸都要經過吸收、運輸及代謝分配。',
    cofactor: 'MAT 使用 ATP，製造 SAM',
    productIds: ['995'],
  },
  {
    id: 'sam',
    label: '甲基供應站',
    abbreviation: 'SAM',
    summary: '像小包裹供應站，把甲基交給不同工作站。',
    detail: 'SAM 是 S-腺苷甲硫胺酸，參與 DNA、RNA、蛋白質與小分子的甲基化。DNA 甲基化調節基因表現，作用取決於位置與細胞狀態；它並不是把 DNA 修好的一個總開關。SAM 交出甲基後形成 SAH。',
    cofactor: '甲基轉移酶：SAM → SAH',
    productIds: [],
  },
  {
    id: 'sah',
    label: '甲基交付後的中繼站',
    abbreviation: 'SAH',
    summary: '送出甲基包裹後，留下需要處理的中繼產物。',
    detail: 'SAH 是 S-腺苷同半胱胺酸。SAH 水解酶催化可逆反應，連接 SAH 與同半胱胺酸、腺苷。下游及腺苷的持續代謝有助反應向前；SAH 累積會抑制多種甲基轉移酶，但不是一顆關閉所有修復的按鈕。',
    cofactor: 'SAH 水解酶：SAH ⇄ Hcy ＋ 腺苷',
    productIds: [],
  },
  {
    id: 'hcy',
    label: '同半胱胺酸',
    abbreviation: 'Hcy',
    summary: '代謝十字路口：回收，或分流成含硫原料。',
    detail: '同半胱胺酸是身體正常產生的中間物，主要經再甲基化回到甲硫胺酸，或經轉硫化提供半胱胺酸。血中數值受到 B 群營養、腎功能、遺傳、藥物及其他因素影響；持續升高需找出原因，不能只把它當成排不掉的廢氣。',
    cofactor: '左路回收甲硫胺酸；右路轉硫化',
    productIds: [],
  },
  {
    id: 'folate',
    label: '葉酸與 B12 回收站',
    abbreviation: 'MTR',
    summary: '葉酸供應甲基，B12 協助交付與回收。',
    detail: 'MTHFR 先將 5,10-亞甲基四氫葉酸轉成 5-MTHF；接著由需要 B12 的甲硫胺酸合酶 MTR，將甲基交給同半胱胺酸，重新形成甲硫胺酸。餐包的 B 群含量要看營養標示；一般啤酒酵母不是可靠的天然 B12 來源，須確認是否添加或強化。',
    cofactor: '5-MTHF 提供甲基；B12 協助 MTR',
    productIds: ['360'],
  },
  {
    id: 'betaine',
    label: '甜菜鹼平行回收站',
    abbreviation: 'BHMT',
    summary: '膽鹼形成甜菜鹼，在肝、腎走平行回收路。',
    detail: '膽鹼可經氧化形成甜菜鹼 TMG。肝、腎的 BHMT 使用甜菜鹼提供的甲基，把同半胱胺酸轉回甲硫胺酸，並產生二甲基甘胺酸。這條路與葉酸／B12 路徑平行；卵磷脂中的磷脂醯膽鹼是膽鹼來源之一。',
    cofactor: '甜菜鹼供甲基；BHMT 是含鋅酵素',
    productIds: ['995'],
  },
  {
    id: 'cystathionine',
    label: '胱硫醚',
    abbreviation: 'Cystathionine',
    summary: '接上絲胺酸，把同半胱胺酸分流到轉硫化。',
    detail: '胱硫醚 β 合成酶 CBS 使用活性 B6（PLP，也稱 P5P）作為輔因子，把同半胱胺酸與絲胺酸結合成胱硫醚。這是不可逆的分流，不會沿原路回到甲硫胺酸；B6 是協助酵素工作的工具，不是被轉成半胱胺酸的原料。',
    cofactor: 'CBS ＋ B6／PLP；另需絲胺酸',
    productIds: ['360'],
  },
  {
    id: 'cysteine',
    label: '半胱胺酸',
    abbreviation: 'Cysteine',
    summary: '帶著硫的建材，加入穀胱甘肽的組裝。',
    detail: '胱硫醚 γ 裂解酶 CSE（也稱 CGL）同樣需要 B6，將胱硫醚轉成半胱胺酸等產物。接著先由 GCL 把半胱胺酸與麩胺酸接合，再由 GSS 加入甘胺酸；兩個組裝步驟都需要 ATP。',
    cofactor: 'CSE ＋ B6／PLP；再交給 GCL、GSS',
    productIds: ['995', '360'],
  },
  {
    id: 'gsh',
    label: '穀胱甘肽',
    abbreviation: 'GSH',
    summary: '三種胺基酸組成的細胞抗氧化網絡隊員。',
    detail: '穀胱甘肽由麩胺酸、半胱胺酸、甘胺酸組成，參與過氧化物處理及部分物質的結合代謝，並靠 NADPH 支援回收。菇類植化素研究關注氧化還原訊號；食品的 SOD 樣活性數值，不等於吃下去就能直接補進細胞內的 SOD。',
    cofactor: 'GCL → GSS；麩胺酸 ＋ 甘胺酸 ＋ ATP',
    productIds: ['antrodia', '995'],
  },
];

export const homocysteineModes = {
  blocked: {
    label: '🚨 當回收路徑塞車',
    summary: '用紅色粒子觀察代謝壓力：當同半胱胺酸與腺苷的後續代謝受影響，SAH 可能累積並抑制甲基轉移。血中 Hcy 偏高與血管風險相關，數值和原因要一起判讀。',
  },
  recycling: {
    label: '✨ 看懂雙路徑回收',
    summary: '跟著粒子認識正常代謝：左路透過葉酸／B12 或平行的甜菜鹼支路回收甲硫胺酸；右路在 B6 協助下形成半胱胺酸，再合成穀胱甘肽。',
  },
};

/** Four interacting research themes, not a compulsory four-step disease course. */
export const vascularStages: { id: string; title: string; text: string; productIds: string[] }[] = [
  {
    id: 'endothelium',
    title: '1. 血管舒張訊號受影響',
    text: '研究連結 Hcy 升高、氧化壓力與一氧化氮 NO 可用性下降。血管內皮調節舒張的能力可能受到影響；手腳冰冷本身無法判斷 Hcy 高低。',
    productIds: ['dikang'],
  },
  {
    id: 'oxidative-stress',
    title: '2. 氧化與抗氧化失衡',
    text: '當活性氧超出細胞的處理能力，脂質、蛋白質與內皮功能可能受影響。這是反覆互相影響的網絡，不是數值一高就直接刮傷血管。',
    productIds: ['antrodia'],
  },
  {
    id: 'inflammation',
    title: '3. 免疫發炎訊號活化',
    text: 'IL-6、TNF-α 是傳遞發炎訊息的細胞激素。CRP 則主要是肝臟製造的急性期蛋白，可作為發炎指標；三者的角色不同。',
    productIds: ['huoyi'],
  },
  {
    id: 'atherothrombosis',
    title: '4. 一起評估斑塊與凝血風險',
    text: 'Hcy 偏高與心血管事件有關，但斑塊及血栓還受到 ApoB 脂蛋白、血壓、血糖、吸菸等因素影響。降低 Hcy 的 B 群試驗未顯示心肌梗塞或總死亡率下降；中風結果則依研究情境而異。',
    productIds: [],
  },
];

/** Benefits refer to the physiological systems; product badges explore ingredients. */
export const homocysteineBenefits: { id: string; title: string; text: string; productIds: string[] }[] = [
  {
    id: 'mood',
    title: '🧠 認識心情與睡眠的原料',
    text: 'B6 參與部分神經傳遞物質的合成，SAM 參與褪黑激素的甲基化步驟。色胺酸原料、菌株的腸腦軸研究與規律作息，提供不同的理解角度。',
    productIds: ['kangyue', 'kangbei'],
  },
  {
    id: 'energy',
    title: '🔋 照顧能量與營養供應',
    text: '營養攝取與粒線體功能共同支援 ATP 供應，甲基循環本身也要使用 ATP。發酵胺基酸可對照原料供應；樟芝萃取的 4-AAQB 屬研究成分，與電子傳遞鏈的輔酶 Q10 不同。',
    productIds: ['995', 'antrodia-drops'],
  },
  {
    id: 'redox',
    title: '🌿 理解抗氧化的分工',
    text: 'B6 協助轉硫化，半胱胺酸與另外兩種胺基酸組成穀胱甘肽。充足蛋白質、B 群與細胞回收機制，共同維持氧化還原平衡。',
    productIds: ['995', '360'],
  },
  {
    id: 'brain',
    title: '💡 照顧認知與神經功能',
    text: 'B12、葉酸與甲基代謝參與神經系統的正常運作。猴頭素的神經營養因子與髓鞘研究，多來自細胞或動物模型，不能直接推成食用後能修復人體神經。',
    productIds: ['huoyi'],
  },
  {
    id: 'circulation',
    title: '❤️ 把血管與體液照護放在一起',
    text: '血管彈性、血壓、腎功能與體液平衡互相影響。認識丹參、山楂、靈芝等草本的研究時，也把規律活動、少鹽飲食與個人的用藥一起考量。',
    productIds: ['dikang', 'lisheng'],
  },
];

export const homocysteineTests: { name: string; detail: string }[] = [
  {
    name: '同半胱胺酸 Hcy',
    detail: '常以血漿總同半胱胺酸、單位 μmol/L 報告。依檢驗室參考區間、年齡、腎功能、營養及藥物一起解讀，沒有適用所有人的單一「理想區間」。',
  },
  {
    name: 'SAM／SAH 與兩者比值',
    detail: '可用於特定研究或專業評估；採樣、保存及測量方法會影響結果。血液比值不能直接代表每個組織的甲基化，也不能當成全身修復能力分數。',
  },
  {
    name: '甲硫胺酸',
    detail: '通常納入胺基酸檢查，在特定代謝問題的評估中使用。單一數值要配合同半胱胺酸、飲食及臨床情況理解。',
  },
  {
    name: '維生素 B12 與甲基丙二酸 MMA',
    detail: 'B12 偏低或處於臨界值時，MMA 可幫助判讀功能性缺乏。腎功能下降也可能使 MMA 升高，不能只看一個檢驗結果。',
  },
  {
    name: '葉酸',
    detail: '血清葉酸較受近期攝取影響，紅血球葉酸反映較長期狀態。需要與 B12 一起考量，避免只補葉酸而忽略 B12 缺乏造成的神經問題。',
  },
  {
    name: '維生素 B6／PLP',
    detail: '血漿 PLP 是常用的 B6 營養狀態指標，也會受發炎等因素影響。長期過量補充 B6 可能造成周邊神經病變，並非越多越能推動回收。',
  },
  {
    name: '鋅',
    detail: '有缺乏風險時，可結合飲食與血中鋅評估；發炎和採血條件也影響數值。補鋅不能替代對 B12、葉酸或腎功能的評估。',
  },
  {
    name: '全血組織胺',
    detail: '組織胺受到免疫細胞與多種代謝因素影響，目前不是經驗證可單獨診斷「高甲基化」或「低甲基化」的常規檢驗。',
  },
  {
    name: '腎功能與整體血管風險',
    detail: '搭配肌酸酐／eGFR、血壓、血糖與血脂，才能理解 Hcy 偏高的背景；hs-CRP 可提供發炎資訊，但無法指定發炎的原因或位置。',
  },
];

export const homocysteineCofactors: { name: string; detail: string }[] = [
  {
    name: '維生素 B12',
    detail: '協助 MTR 將 5-MTHF 的甲基交給同半胱胺酸。飲食來源、吸收狀況及強化食品標示，都會影響實際供應。',
  },
  {
    name: '葉酸／5-MTHF',
    detail: '葉酸參與一碳代謝；5-MTHF 是 MTR 回收路徑的甲基來源。MTHFR 負責準備 5-MTHF，MTR 才執行這一步再甲基化。',
  },
  {
    name: '維生素 B6／PLP（P5P）',
    detail: '作為 CBS、CSE 的輔因子，協助轉硫化。它也參與其他胺基酸反應，但同半胱胺酸並不會直接變成 GABA、血清素或多巴胺。',
  },
  {
    name: '鋅 Zn',
    detail: '鋅是多種酵素與蛋白質的組件，BHMT 就是含鋅酵素。它的角色不同於葉酸提供甲基，也不是 SAH 水解反應的通用加速劑。',
  },
  {
    name: '抗氧化網絡：GSH、SOD、維生素 C／E、硒',
    detail: '這些成員分工處理不同的氧化壓力；硒參與部分穀胱甘肽過氧化酶，細胞內 SOD 處理超氧陰離子。它們不是全部直接參與同半胱胺酸回收的輔因子。',
  },
];

export const homocysteineSources: { label: string; url: string }[] = [
  { label: 'MedlinePlus：同半胱胺酸檢驗與判讀', url: 'https://medlineplus.gov/lab-tests/homocysteine-test/' },
  { label: 'NIH ODS：葉酸與一碳代謝', url: 'https://ods.od.nih.gov/factsheets/Folate-HealthProfessional/' },
  { label: 'NIH ODS：維生素 B12、MMA 與神經功能', url: 'https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/' },
  { label: 'NIH ODS：維生素 B6 的作用與攝取安全', url: 'https://ods.od.nih.gov/factsheets/VitaminB6-HealthProfessional/' },
  { label: 'NIH ODS：膽鹼與甜菜鹼代謝', url: 'https://ods.od.nih.gov/factsheets/Choline-HealthProfessional/' },
  { label: 'NIH ODS：鋅與營養狀態評估', url: 'https://ods.od.nih.gov/factsheets/Zinc-HealthProfessional/' },
  { label: 'Cochrane：降低同半胱胺酸與心血管事件的試驗回顧', url: 'https://pubmed.ncbi.nlm.nih.gov/28816346/' },
];
