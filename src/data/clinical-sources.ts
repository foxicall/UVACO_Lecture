/** Public source labels describe subjects. Original attribution remains in the archived files. */
export const clinicalSources = [
  { id: 'Q1', title: 'PDF：健康長壽與粒線體代謝', summary: '本次提供的原始 PDF；公開圖解依來源頁與既有文稿校對重製。', limit: '原始研究、個案與成品療效須區分；文字層及 OCR 可能漏字，原始圖像為校對依據。', productIds: [], topics: ['原頁校對', '證據層級'] },
  { id: 'Q3', title: 'PDF：荷爾蒙與神經調節', summary: '本次提供的原始 PDF；公開圖解依來源頁與既有文稿校對重製。', limit: '原始研究、個案與成品療效須區分；文字層及 OCR 可能漏字，原始圖像為校對依據。', productIds: [], topics: ['原頁校對', '證據層級'] },
  { id: 'Q4', title: 'PDF：發炎消退與腦部脂質', summary: '本次提供的原始 PDF；公開圖解依來源頁與既有文稿校對重製。', limit: '原始研究、個案與成品療效須區分；文字層及 OCR 可能漏字，原始圖像為校對依據。', productIds: [], topics: ['原頁校對', '證據層級'] },
  { id: 'Q5', title: 'PDF：代謝老化與血管健康', summary: '本次提供的原始 PDF；公開圖解依來源頁與既有文稿校對重製。', limit: '原始研究、個案與成品療效須區分；文字層及 OCR 可能漏字，原始圖像為校對依據。', productIds: [], topics: ['原頁校對', '證據層級'] },
  { id: 'Q6', title: 'PDF：腦腸軸與免疫老化', summary: '本次提供的原始 PDF；公開圖解依來源頁與既有文稿校對重製。', limit: '原始研究、個案與成品療效須區分；文字層及 OCR 可能漏字，原始圖像為校對依據。', productIds: [], topics: ['原頁校對', '證據層級'] },
  { id: 'S1', title: '六套長壽講座圖解校對', summary: '五份 PDF 共 233 頁、六份文稿，整理為六套 24 頁生活圖解；第 2 套 PDF 尚未提供。', limit: '重製圖解並非原始投影片；不將其他作者原話署名為活動講師，也不將機轉轉為產品處方。', productIds: [], topics: ['來源頁碼', '產品原料對照', '研究限制'] },

  { id: 'L1', title: '健康長壽與粒線體代謝', summary: '從健康壽命、粒線體能量與氧化還原韌性，理解生物年齡與老化速率的差別。', limit: '原文 MitoCORE 配方與小型研究的結果，不能轉移成 995 或 360 的療效；時鐘變化也不是疾病改善的直接證明。', productIds: ['995', '360'], topics: ['ETC／TCA 能量代謝', 'SOD／GSH 氧化還原', 'DunedinPACE 與追蹤'] },
  { id: 'L2', title: '環境暴露與黴菌毒素', summary: '先辨識漏水、潮濕與暴露，區分黴菌感染和毒素研究；環境改善是照護的重要一環。', limit: '尿液毒素數值不能單獨確診。精油鼻噴、神經阻斷、結合劑及低硫飲食並非居家自療指引，也沒有葡眾產品可直接替代這些處置。', productIds: [], topics: ['環境控制', 'DON／Gliotoxin／OTA', '4D 框架與臨床評估'] },
  { id: 'L3', title: '荷爾蒙、壓力與神經調節', summary: '疲倦、睡眠和情緒可能涉及不同的內分泌路徑；相同症狀不代表相同原因。', limit: '荷爾蒙補充、甲狀腺用藥與檢驗判讀須個別評估；補充品不能替代。原稿中的「皮質醇竊質」是簡化假說。', productIds: ['kangyue', 'kangbei'], topics: ['HPA／HPO／HPT', 'COMT 與雌激素代謝', 'ALLO／GABA／NMDA'] },
  { id: 'L4', title: '發炎消退與腦部脂質研究', summary: '發炎後的清除與修復是主動過程；SPM、胞葬與 LPC-DHA 提供理解研究的新角度。', limit: 'LPC-DHA、SPM 和特定原料試驗，不等同一般卵磷脂或亞麻仁籽，也不能套用為活逸康的成品證據。', productIds: ['huoyi'], topics: ['SPM／PRM 與胞葬', 'MFSD2A／LPC-DHA', '微膠質與髓鞘研究'] },
  { id: 'L5', title: '代謝老化與血管健康', summary: '血管健康需要整體看待血壓、血糖、脂蛋白、生活習慣與用藥，而非只追逐單一「理想數字」。', limit: '研究型指標和參考區間依方法與族群而異；原稿的血管年齡變化不能當成產品承諾。卵磷脂補充也須同時考量膽鹼與 TMAO 的研究脈絡。', productIds: ['995', '360', 'dikang', 'lisheng'], topics: ['ApoB／sdLDL／HDL 功能', 'ADMA／eNOS／NO', '同半胱胺酸／TMAO'] },
  { id: 'L6', title: '腦腸軸與免疫老化', summary: '腸道屏障、菌相、免疫和肌肉代謝互相影響，照護應以飲食、活動、病史與適切檢查共同評估。', limit: '5R 是整理照護的框架，不能依本頁自行停用藥物、排毒、補胃酸或套用研究劑量；菌株效果不能跨配方推論。', productIds: ['kanger', 'kanger-n', 'kangyue', '995'], topics: ['LPS／TLR4／NLRP3', '腦腸軸／腸肌軸', '5R／SCFA／自噬'] },
  { id: 'P1', title: '葡眾十二產品與三軸機轉文件', summary: '本次上傳的產品成分、三軸主張與十二列對照矩陣。', limit: '來源的機轉或行銷說法需與成品人體證據分開，實際規格依包裝標示。', productIds: ['995','antrodia','antrodia-drops','kanger','kanger-n','kangyue','huoyi','ningkang','360','dikang','lisheng','kangbei'], topics: ['產品原料', '三軸對照', '閱讀組合'] },
  { id: 'P0', archived: true, title: '先前產品資料', summary: '原有十二產品文件的保留版本。', limit: '供版本比對，不合併不同版本的規格數字。', productIds: [], topics: ['版本比對'] },
  { id: 'D1', title: '林煒醫師講座海報', summary: '找回身體的自癒力：醫療改善症狀，營養打造健康。', limit: '海報中的講座資訊，不代表對本站訪客的個別診療。', productIds: [], topics: ['四大講座重點'] },
  { id: 'D2', archived: true, title: '三套簡報逐頁文稿', summary: '記憶健康、疼痛與修復、產品全覽，共二十三頁。', limit: '依提供文稿重製，保留來源並區分研究與產品效果。', productIds: [], topics: ['記憶', '疼痛', '產品'] },
  { id: 'D3', archived: true, title: '大腦與企業簡報擷取', summary: '大腦森林、企業沿革與簡報數字。', limit: '企業獎項與特定治療研究不能當成保健品效果。', productIds: [], topics: ['腦健康', '企業資訊'] },
  { id: 'D4', archived: true, title: '既有產品補充資料', summary: '前期整理的詳細原料與機轉補充。', limit: '歷史資料保留供比對，實際規格依現行標示。', productIds: [], topics: ['原料補充'] },
];
export const activeClinicalSources = clinicalSources.filter(source => !('archived' in source && source.archived));
export const clinicalSourceById = new Map(clinicalSources.map(source => [source.id, source]));
