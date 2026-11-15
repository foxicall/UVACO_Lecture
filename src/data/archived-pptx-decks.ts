import originals from './keynote-originals.json';

export interface KeynoteSlide {
  id: string;
  title: string;
  subtitle?: string;
  blocks: { heading: string; text: string }[];
  note?: string;
  illustration: string;
  sourceText: string;
}
export interface PptxDeck {
  id: string;
  shortTitle: string;
  title: string;
  files: string[];
  description: string;
  slides: KeynoteSlide[];
}
type DraftDeck = Omit<PptxDeck, 'slides'> & { slides: Omit<KeynoteSlide, 'sourceText'>[] };

const definitions: DraftDeck[] = [
  {
    id: 'memory', shortTitle: '記憶健康', title: '腦力常青・美滿生活',
    files: ['alzheimers_uvaco_presentation.pptx'],
    description: '守護記憶的黃金健康指南｜2026 智慧營養專題',
    slides: [
      { id: 'memory-1', title: '腦力常青，美滿生活', subtitle: '守護記憶的黃金健康指南', illustration: 'huoyi', blocks: [{ heading: '把今天，留給明天的自己', text: '從醫學新知、科學運動、優質睡眠到日常營養，一起認識大腦需要的照顧。' }], note: '2026 智慧營養專題・依提供文稿重製' },
      { id: 'memory-2', title: '家有一老，如有一寶', illustration: 'kangyue', blocks: [{ heading: '歲月留下智慧', text: '珍惜長輩的故事，也留意記憶與生活能力的變化。身體變老，不代表一定會失智。' }, { heading: '照顧從今天開始', text: '規律活動、陪伴交流、均衡飲食與充足睡眠，是送給自己與家人的日常禮物。' }] },
      { id: 'memory-3', title: '認識醫學的五十年', illustration: 'huoyi', blocks: [{ heading: '1976：建立共識', text: 'Katzman 的論述促進社會對阿茲海默症的重視。' }, { heading: '1980–90 年代：看清病理', text: '類澱粉蛋白 Aβ 斑塊與 Tau 蛋白纏結成為重要研究方向。' }, { heading: '2023–24：新藥進展', text: '部分抗類澱粉蛋白藥物獲批，適用條件與風險須由專科評估。' }, { heading: '2026 專題：血液標記', text: 'p-tau217 在特定研究中呈現超過 90% 的辨識表現；實際結果受檢驗方法與族群影響。' }], note: '血液標記須結合臨床評估，不能靠一滴血自行確診。' },
      { id: 'memory-4', title: '健忘，還是需要評估？', illustration: 'huoyi', blocks: [{ heading: '偶爾健忘', text: '忘記鑰匙放哪，經提醒能想起來，仍能獨立安排日常生活。' }, { heading: '留意持續的改變', text: '反覆忘記剛發生的事、重複提問、迷失方向或性格改變，可能影響生活能力。' }], note: '這些例子不是診斷量表；出現變化時，請陪伴長輩至記憶門診評估。' },
      { id: 'memory-5', title: '看見冰山下的變化', subtitle: '更早認識風險，更早安排照護', illustration: 'huoyi', blocks: [{ heading: '10–20 年的研究視角', text: '部分阿茲海默症相關病理變化，可能早於明顯症狀多年出現。' }, { heading: '如何理解「51%」', text: '原稿引用 CTAD 的延緩惡化數字；這類數字須對照特定治療、受試族群與評估終點。' }], note: '不能把研究中的相對差異，解讀為人人適用的效果，或葡眾產品的預防及治療成效。' },
      { id: 'memory-6', title: '火柴與木柴的比喻', illustration: 'huoyi', blocks: [{ heading: 'Aβ：點火的火柴', text: '原稿將神經細胞外的類澱粉蛋白堆積，比作需要清理的「水泥垃圾」。' }, { heading: 'Tau：纏結的木柴', text: '神經細胞內異常 Tau 的變化，好比打結毛線，會影響細胞運作。' }, { heading: '比喻幫助理解', text: '實際疾病機轉更複雜。運動、睡眠與營養支持健康，不能保證切斷病理連鎖。' }] },
      { id: 'memory-7', title: '記憶變化，有不同路徑', subtitle: '從 BioFINDER-2 相關研究談起', illustration: 'dikang', blocks: [{ heading: '阿茲海默症相關', text: '近期記憶可能先受影響；仍需完整診斷。' }, { heading: '路易氏體相關', text: '可能伴隨認知波動、動作變慢或視覺幻覺。' }, { heading: '血管性變化', text: '血管風險、白質高訊號 WMH、步態與反應變化值得評估。' }, { heading: '混合型變化', text: '原稿引用 26.3% 的特定樣本數據；不能推算每間門診，也不能據此指定保健品搭配。' }], note: '原稿標題寫「五大」，實際提供四類；本頁完整保留已提供的四類，不補造第五類。' },
      { id: 'memory-8', title: '照顧大腦的日常夥伴', illustration: 'huoyi', blocks: [{ heading: '活逸康：認識猴頭菇', text: '來源列猴頭素 A 膠囊 1.32–1.98 mg／粒；顆粒 A/C/S 合計 2 mg 以上／包。NGF、髓鞘相關內容屬研究機轉。' }, { heading: '康爾喜 N：認識腸道原料', text: '來源列出廠 1,000 億活菌，以及鳳梨、木瓜酵素；實際規格以包裝標示為準。' }, { heading: '康貝寧：認識作息原料', text: '來源列 GABA、色胺酸與蜜環菌；大腦淋巴系統研究不等於成品能清除病理蛋白。' }], note: '營養補充品不能取代失智症評估、治療或規律生活照護。' },
    ],
  },
  {
    id: 'pain', shortTitle: '疼痛與修復', title: '疼痛與結構：我們還可以做些什麼？',
    files: ['20230409_WL_疼痛.pptx'],
    description: '林煒醫師專題｜DNA 甲基化與神經修復藍圖',
    slides: [
      { id: 'pain-1', title: '疼痛與結構', subtitle: '我們還可以做些什麼？', illustration: '995', blocks: [{ heading: '主講・林煒醫師', text: '英爵診所主任醫師、生生優動疼痛科板橋分院院長；北榮、長庚神經內科經歷，CIPS 國際超音波介入治療認證。' }], note: '依提供講師資料與逐頁文稿重製；完整學經歷可由醫師介紹開啟。' },
      { id: 'pain-2', title: '為什麼，總是痛不好？', illustration: 'kangyue', blocks: [{ heading: '先理解疼痛的來源', text: '慢性腰痛、偏頭痛、關節炎與纖維肌痛，可能涉及不同的組織、神經與全身因素。' }, { heading: '壓力也是拼圖之一', text: '原稿以「自律神經超載症候群 AOS」描述壓力與疼痛的關係；不能把所有慢性疼痛都歸因於單一機轉。' }], note: '持續或加劇的疼痛，需要由醫療團隊排除其他病因。' },
      { id: 'pain-3', title: '健康金三角', subtitle: '結構、化學與情緒，一起看', illustration: '360', blocks: [{ heading: '結構 Structure', text: '足部旋前、足弓、膝與骨盆位置可能影響動作負荷；張力整合 Biotensegrity 提供整體觀察角度。' }, { heading: '化學 Chemical', text: '發炎、氧化壓力、營養攝取與代謝狀況，可能參與疼痛與恢復。' }, { heading: '情緒 Emotion', text: '長期壓力與睡眠問題可能放大痛覺；照護也包含情緒支持與生活安排。' }], note: '足弓改變不必然造成肩頸、顳顎或暈眩症狀，仍須逐項評估。' },
      { id: 'pain-4', title: '鬆開修復的煞車', illustration: 'dikang', blocks: [{ heading: '留意身體的緊繃', text: '自律神經、微循環、肌肉活動與疼痛互相影響；不能把慢性痛簡化成乳酸排不出去。' }, { heading: '理解皮質醇的角色', text: '原稿以油門與煞車比喻復健和壓力的交互作用。長期壓力可能影響恢復，但不代表組織必然「永遠好不了」。' }], note: '規律復健、睡眠、營養與壓力照護，可以和醫療計畫一起安排。' },
      { id: 'pain-5', title: 'DNA 甲基化的研究線索', illustration: '995', blocks: [{ heading: '基因表現的調節', text: 'DNA 甲基化是調節基因表現的機制之一，不能理解為可以自行打開的單一修復總開關。' }, { heading: '關聯，不等於因果', text: '原稿提及 Front Med 2022、Cells 2022，以及低甲基化、IL-6、CRP 與神經痛的研究關聯。' }, { heading: '營養需要整體評估', text: '疲勞、過敏與敏感化有多種原因，不能僅憑症狀判定缺乏甲基供體。' }], note: '這些研究線索不能直接證明某款保健品能修復 DNA 或治療疼痛。' },
      { id: 'pain-6', title: '醫療與營養，互相支持', illustration: '360', blocks: [{ heading: '專業醫療照護', text: '超音波導引介入、PRP、羊膜相關製劑、神經阻斷、FSM 微電流與復健，各有適應症、證據與風險，須個別評估。' }, { heading: '日常營養照護', text: '足夠能量、蛋白質與多樣化飲食提供身體所需；是否補充營養品，需考量疾病、用藥與吞嚥能力。' }], note: '醫療也能處理病因；營養補充不保證長出新軟骨或再生神經。' },
      { id: 'pain-7', title: '四個營養閱讀模組', subtitle: '對照原稿，認識產品的原料', illustration: '995', blocks: [{ heading: '結構與蛋白質', text: '995 的游離胺基酸、卵磷脂；原味餐包的植物蛋白與亞麻仁籽 Omega-3。' }, { heading: '神經與日常營養', text: '活逸康的猴頭菇原料、餐包 B 群與迪康草本；不視為麻木或帶狀疱疹神經痛的處方。' }, { heading: '壓力與作息', text: '餐包中的刺五加屬適應原研究話題；不保證降低個人的皮質醇或解除疼痛。' }, { heading: '全身照護', text: '360 計劃、康爾喜與康貝寧，可供閱讀原料與注意事項；不代表必須合併食用。' }], note: '四模組來自提供文稿，不是林醫師對網站使用者的個別診療或服用建議。' },
    ],
  },
  {
    id: 'products', shortTitle: '產品全覽', title: '葡眾 12 大產品優越性全覽',
    files: ['-產品優越性 春訓 (定版).pptx', 'Uvaco_失智症.pptx'],
    description: '第六代生物科技保健食品｜從品牌到原料',
    slides: [
      { id: 'products-1', title: '美滿生活，就此展開', subtitle: 'UVACO 葡眾產品優越性', illustration: '360', blocks: [{ heading: 'Life at Its Fullest', text: '從發酵技術、原料到日常營養，認識十二種產品。原稿以「第六代生物科技保健食品」描述品牌理念。' }], note: '「第六代」為來源中的品牌用語，並非醫療療效分級。' },
      { id: 'products-2', title: '認識研發與品質後盾', illustration: 'antrodia', blocks: [{ heading: '1969 年創立', text: '葡萄王生技的企業歷史；來源列 PIC/S GMP、ISO/IEC 17025 檢驗中心與液態發酵產能。' }, { heading: '國際獎項', text: '不同時點資料列出跨 20 國、257–356+ 項國際發明獎，包含 153 金牌、64 特別獎。' }, { heading: '葡眾營運', text: '來源記載連續三年營收突破百億新台幣；應依資料年度解讀。' }], note: '企業品質制度、獎項與營收不等於每款產品具有疾病治療效果。' },
      { id: 'products-3', title: '從生物科技，認識原料', illustration: '995', blocks: [{ heading: '發酵與配方', text: '原稿以發酵、濃縮及「君臣佐使」比喻配方設計。是否適合個人，仍須看實際成分與攝取量。' }, { heading: '品質看具體檢驗', text: '重金屬、農藥、塑化劑與防腐劑等項目，應依批次檢驗與產品標示判讀，不能泛稱全部零殘留。' }, { heading: '營養補充的定位', text: '食品不是根本療法；也不能把藥物簡化為掩蓋症狀，或聲稱所有營養都免經消化吸收。' }] },
      { id: 'products-4', title: '995 與 360 計劃', illustration: '995', blocks: [{ heading: '995 生技營養品', text: '來源名永生福朗／聰明豆，列 SOD 樣活性、20 種游離胺基酸與大豆卵磷脂。病後補養先確認能量、蛋白質與醫療需求。' }, { heading: '360 單日盒', text: '原味餐包 2 包、康爾喜 3 條、迪康 1 包、全身調理膠囊 2 包。原稿以君 995、臣靈芝、佐冬蟲夏草、使紅麴說明搭配。' }], note: '盒裝組成以現行包裝為準；服用藥物、懷孕或肝腎疾病者先詢問專業人員。' },
      { id: 'products-5', title: '認識順暢保衛系列', illustration: 'kanger', blocks: [{ heading: '康爾喜', text: '來源列 13 株複合乳酸菌、每條出廠 700 億活菌及微膠囊包埋技術。菌數、保存與使用方式依包裝標示。' }, { heading: '康爾喜 N', text: '來源列每條出廠 1,000 億活菌，添加木瓜與鳳梨酵素。' }], note: '不能把菌株或酵素機轉直接當成封堵腸漏、消除水腫或預防術後沾黏的臨床效果。' },
      { id: 'products-6', title: '認識三種發酵配方', illustration: 'antrodia', blocks: [{ heading: '樟芝益', text: '牛樟芝、舞茸、巴西蘑菇、桑黃、雲芝；來源列 90 天毒性、致畸胎試驗與保肝專利。' }, { heading: '樟芝菌絲體滴粒', text: '濃縮菌絲體萃取物、4-AAQB 與紅藜麥；實際食用方法依包裝。' }, { heading: '寧康福', text: '桑黃、蛹蟲草、初乳粉、大豆卵磷脂、綠茶與墨角藻。' }], note: '不能宣稱成品治療 COPD、肝病，或防護手機電磁波與環境輻射。' },
      { id: 'products-7', title: '認識大腦與作息原料', illustration: 'huoyi', blocks: [{ heading: '活逸康', text: '猴頭菇菌絲體與猴頭素 A；NGF、神經與髓鞘相關內容屬研究議題。' }, { heading: '康悅兒', text: '來源列 GKJOY、GKF3 菌株與甜橙萃取；不能保證提升個人的腦內血清素或多巴胺。' }, { heading: '康貝寧', text: '來源列蜜環菌、L-色胺酸、GABA 與茯苓；本次原稿另提酸棗仁，完整成分以現行標示為準。' }], note: '原稿引用台灣 390 萬人失眠的數字，屬特定時點說法；補充品不能保證解決失眠。' },
      { id: 'products-8', title: '迪康與力盛的草本原料', illustration: 'lisheng', blocks: [{ heading: '迪康沖泡飲', text: '山楂、陳皮、藏紅花、丹參、人蔘等草本；來源註記懷孕期間不建議食用。用藥者需注意交互作用。' }, { heading: '力盛沖泡飲', text: '靈芝、香菇、蘆筍、桑椹、黃耆、草決明等原料；不能視為利尿或腎臟疾病治療。' }], note: '持續水腫、胸悶、呼吸不適或尿量變化，應先就醫評估。' },
    ],
  },
];

export const pptxDecks: PptxDeck[] = definitions.map((deck, d) => ({
  ...deck,
  slides: deck.slides.map((slide, s) => {
    const sourceText = originals[d]?.[s];
    if (!sourceText) throw new Error(`Missing original slide: ${slide.id}`);
    return { ...slide, sourceText };
  }),
}));
export function slideNarration(slide: KeynoteSlide) {
  return [slide.title, slide.subtitle, ...slide.blocks.map(block => `${block.heading}。${block.text}`), slide.note].filter(Boolean).join('。');
}
