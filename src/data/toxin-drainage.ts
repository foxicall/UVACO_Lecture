import type { ScienceModuleDefinition } from './science-module-types';

export const toxinObservations = [
  {id:'brain',label:'腦霧與記憶',detail:'注意力與記憶改變有許多原因。OTA、Gliotoxin 的細胞與動物研究，提供血腦屏障及神經膠質受壓的機轉線索；它們不能從「腦霧」反推出個人的毒素暴露。'},
  {id:'fatigue',label:'疲勞與能量',detail:'2022 年研究納入南佛羅里達 236 位 ME/CFS 患者，均報告有水損建築暴露，其中 92.4% 尿液檢出至少一種所測黴菌毒素。這是特定門診族群的結果，不是一般疲勞者的比例，也沒有證明疲勞由檢出的毒素造成。'},
  {id:'pain',label:'疼痛與敏感',detail:'DON 的實驗研究涉及核糖體壓力、發炎與腸腦訊號。TRPV1、ASIC3 參與痛覺感測，但持續疼痛不能只歸因於一種毒素或一條受體路徑。'},
  {id:'sinus',label:'鼻腔與呼吸',detail:'潮濕環境與黴菌暴露可以影響呼吸道健康。檢體檢出、定殖與感染是不同概念；慢性鼻竇炎也涉及發炎、過敏及鼻竇結構等因素，不能單由檢出黴菌判斷病因。'},
  {id:'tremor',label:'震顫與動作',detail:'Penitrem A 等致震顫性黴菌毒素有神經毒性研究。手抖仍需區分藥物、甲狀腺、神經疾病等原因，不能用症狀自行判斷是哪一種暴露。'},
];

export const toxinDrainageDefinition:ScienceModuleDefinition = {
  id:'toxin',eyebrow:'專題二 / 環境、轉化與排泄',title:'先找源頭，再看身體怎麼處理',
  introduction:'像整理家中的水路，先分清楚外來負荷、加工、回收與出口。',
  modes:{
    stress:{label:'🚨 觀察負荷與再循環',summary:'紅色路線聚焦部分分子的腸肝再循環。實際去向取決於分子、酵素與器官功能；腸肝循環本身也參與正常生理。'},
    support:{label:'✨ 認識 4D 與代謝分工',summary:'綠色路線分開呈現糞便與尿液排泄，並保留睡眠腦液交換的獨立視窗。先減少持續暴露，再理解不同照護工作的分工。'},
  },
  stages:[
    {id:'toxin-exposure',title:'先辨認外來負荷',metaphor:'先看是哪一種客人進了門，再決定往哪個工作站追蹤。',
      explanation:'OTA、DON、Gliotoxin、Enniatin B 與 ZEA 是不同分子，來源、劑量與代謝各有差異。下面把屏障、能量、腸道與受體的研究分開閱讀。',
      tracks:[
        {id:'toxin-neuroglia',title:'OTA／Gliotoxin：屏障與神經膠質',nodes:[
          {id:'toxin-ota-gtx',label:'OTA／Gliotoxin',detail:'赭麴毒素 A（OTA）與膠黴毒素（Gliotoxin）在實驗中可涉及氧化還原、免疫與細胞損傷；兩者的吸收與靶器官不相同。'},
          {id:'toxin-bbb',label:'血腦屏障受壓',cofactor:'細胞與動物模型',detail:'部分模型觀察到屏障完整性與神經膠質功能變化。從實驗濃度到一般生活暴露，需要另外考量人體吸收、分布與劑量。'},
          {id:'toxin-glia',label:'神經膠質與訊號',detail:'星形膠質細胞、寡突膠質細胞與微膠細胞各有支持、髓鞘及免疫工作；模型中的受損現象不等同已證實的失智症病因。'},
        ]},
        {id:'toxin-enniatin',title:'Enniatin B：離子與粒線體',nodes:[
          {id:'toxin-enb',label:'Enniatin B',detail:'Enniatin B 是具有離子載體特性的環狀胜肽，可在實驗條件下促進陽離子跨膜運送。它不是單純在膜上鑽出一個固定的洞。'},
          {id:'toxin-ion-gradient',label:'離子梯度改變',cofactor:'K⁺ 等陽離子',detail:'離子流向由跨膜電化學梯度決定，不能一律畫成 K⁺ 內流。梯度失衡可影響膜電位及細胞內環境。'},
          {id:'toxin-atp',label:'粒線體能量受壓',detail:'粒線體膜電位與呼吸功能受影響時，ATP 供應可能下降。疲勞仍需要綜合睡眠、貧血、內分泌及其他因素來理解。'},
        ]},
        {id:'toxin-don-barrier',title:'DON：核糖體與腸道屏障',nodes:[
          {id:'toxin-don-ribosome',label:'DON → 60S 核糖體',detail:'嘔吐毒素 DON 屬單端孢黴烯類，會干擾核糖體功能與蛋白質合成，觸發核糖毒性壓力。'},
          {id:'toxin-ribotoxic',label:'核糖毒性壓力',cofactor:'MAPK 等壓力訊號',detail:'細胞壓力訊號可改變發炎介質及屏障相關蛋白的表現，反應依細胞種類、濃度與暴露時間而變。'},
          {id:'toxin-claudin',label:'Claudin 與緊密連接',detail:'細胞及動物研究觀察到緊密連接改變、通透性及細菌移位增加；來源文稿的倍數是特定實驗結果，不能套在每個人的腸道。'},
        ]},
        {id:'toxin-don-vagus',title:'DON：噁心與腸腦訊號',nodes:[
          {id:'toxin-enterochromaffin',label:'腸嗜鉻細胞',detail:'部分 DON 實驗涉及腸道嗜鉻細胞的血清素釋放，連到噁心與嘔吐反應的研究。'},
          {id:'toxin-5ht3',label:'5-HT → 5-HT3',detail:'血清素可活化腸道及迷走傳入神經的 5-HT3 受體，將訊息送向腦幹。這與所有血清素都讓人快樂的說法不同。'},
          {id:'toxin-nts',label:'腦幹整合訊號',cofactor:'NTS／最後區等網絡',detail:'腦幹整合內臟及循環訊息，協調噁心與嘔吐。TRPV1、ASIC3 則屬另一些感覺訊號系統，不是這條路徑的必經下一站。'},
        ]},
        {id:'toxin-zea',title:'ZEA：受體與內分泌',nodes:[
          {id:'toxin-zea-molecule',label:'ZEA 玉米赤黴烯酮',detail:'ZEA 及其部分代謝物具有雌激素樣活性，是食品污染與內分泌毒理研究的一類分子。'},
          {id:'toxin-estrogen-receptor',label:'雌激素受體 ER',detail:'受體結合與活性取決於分子、濃度、組織及暴露時期，不能把所有環境荷爾蒙畫成同一種物質。'},
          {id:'toxin-endocrine-context',label:'組織與劑量脈絡',detail:'生殖與內分泌影響需依研究物種、劑量與持續時間判讀；一般生活症狀不能取代暴露與疾病評估。'},
        ]},
      ],productIds:[],productContext:'',
    },
    {id:'toxin-recirculation',title:'看懂腸肝再循環',metaphor:'包裹到了出口，部分又被拆開，沿回收車道送回工廠。',
      explanation:'某些分子經膽汁進入腸道後，可以再被吸收。菌相酵素、腸道運輸與分子特性共同影響流向，不是所有毒素都走同一個迴圈。',
      tracks:[{id:'toxin-enterohepatic',title:'膽汁 → 去結合 → 門靜脈',nodes:[
        {id:'toxin-biliary-conjugate',label:'膽汁中的結合型分子',detail:'肝臟可把部分物質與葡萄糖醛酸結合，再經轉運蛋白送入膽汁。膽汁也有正常的脂肪消化功能。'},
        {id:'toxin-beta-glucuronidase',label:'β-葡萄糖醛酸苷酶',cofactor:'β-glucuronidase',detail:'部分腸道微生物具有此酵素，可移除特定分子的葡萄糖醛酸基團；是否發生取決於菌種與底物。'},
        {id:'toxin-reabsorption',label:'腸道再吸收',detail:'去結合後的部分分子更容易被吸收，另一些會隨糞便排出。腸蠕動與分子溶解度也參與決定。'},
        {id:'toxin-portal-return',label:'門靜脈 → 回到肝臟',detail:'腸道吸收的部分物質經門靜脈回肝，再被處理。腸肝循環也會影響某些正常內源性物質與藥物的停留時間。'},
      ]}],productIds:['kanger-n'],productContext:'複合乳酸菌及鳳梨、木瓜酵素可作為菌相與消化原料的閱讀對照；特定 β-glucuronidase 活性的變化需要菌株與人體研究，不能只從配方菌數推定。',
    },
    {id:'toxin-drain',title:'1. Drain｜辨認出口',metaphor:'糞便、尿液與腦液交換各有自己的水路，不接成一條萬用排毒管。',
      explanation:'先維持規律排便、適合個人狀態的水分與睡眠，並處理漏水與持續暴露。腎臟過濾、腸道排出與睡眠腦液交換分開看。',
      tracks:[
        {id:'toxin-renal-exit',title:'腎臟：過濾、分泌、再吸收',nodes:[
          {id:'toxin-circulating-metabolites',label:'血液中的代謝物',detail:'尿素、尿酸及外來物代謝物隨血液到達腎臟。蛋白結合程度、分子大小與腎功能影響清除。'},
          {id:'toxin-nephron',label:'腎小球與腎小管',detail:'腎小球過濾後，腎小管再進行分泌與再吸收，同時協調水分、電解質及酸鹼平衡。'},
          {id:'toxin-urine',label:'尿液排泄',detail:'尿量與某物質的清除率是不同指標。補水要配合心腎狀態，不能用增加尿量推算毒素已排完。'},
        ]},
        {id:'toxin-fecal-exit',title:'腸道：運輸與糞便排出',nodes:[
          {id:'toxin-lumen',label:'腸道內容物',detail:'腸道內容物包括食物殘渣、微生物與部分膽汁代謝物；不同成分有不同吸收與運輸特性。'},
          {id:'toxin-motility',label:'蠕動、水分與纖維',detail:'規律活動、適量食物纖維及合適水分有助正常排便。水果蛋白酶與腸道 β-glucuronidase 是不同酵素。'},
          {id:'toxin-stool',label:'糞便排出',detail:'未被吸收的內容物由糞便離開。改善排便不等同已中斷所有腸肝循環或治療毒素中毒。'},
        ]},
        {id:'toxin-glymphatic',title:'睡眠：腦液交換的獨立網絡',nodes:[
          {id:'toxin-sleep',label:'睡眠與生理節律',detail:'睡眠狀態與腦內液體交換、血管脈動及神經活動相關；不同研究方法對交換與清除的測量仍在發展。'},
          {id:'toxin-csf-exchange',label:'腦脊髓液／間質液交換',cofactor:'血管周圍通路與 AQP4 等',detail:'腦內液體交換涉及血管周圍空間、星形膠質細胞與 AQP4 等因素，不是一根直接通往腸道或腎臟的管子。'},
          {id:'toxin-brain-clearance',label:'腦部代謝物運輸',detail:'這些研究幫助理解睡眠與腦部代謝，但不能由口服 GABA 或一次深睡，就推論某種黴菌毒素已從腦中清除。'},
        ]},
      ],productIds:['lisheng','kanger-n','kangbei'],productContext:'以靈芝、蘆筍等草本認識體液生理；以乳酸菌與水果酵素認識消化；以色胺酸、發酵 GABA 原料延伸睡眠研究。三組原料各自閱讀，不把飲品或補充品畫成打開器官出口的閥門。',
    },
    {id:'toxin-detox',title:'2. Detox｜轉化與結合',metaphor:'加工、包裝和出貨是三道工作；有些包裹可以直接進入包裝站。',
      explanation:'Phase I、II 與 III 描述代謝與轉運分工。不是所有分子都按同一順序通過三站，結合後也不一定完全失去生物活性。',
      tracks:[
        {id:'toxin-phase-sequence',title:'轉化 → 結合 → 轉運',nodes:[
          {id:'toxin-phase-one',label:'Phase I 轉化',cofactor:'CYP450 等酵素',detail:'氧化、還原及水解改變分子結構。產物可能較易處理，也可能暫時更具反應性，不能把酵素越活躍一律當成越好。'},
          {id:'toxin-phase-two',label:'Phase II 結合',cofactor:'UGT／SULT／GST 等',detail:'葡萄糖醛酸化、硫酸化及穀胱甘肽結合各有底物與酵素。特定分子可不經 Phase I，直接參與結合反應。'},
          {id:'toxin-phase-three',label:'Phase III 轉運',cofactor:'MRP 等轉運蛋白',detail:'轉運蛋白把相關物質送入膽汁或血液，接續由糞便或尿液排出；結合反應與真正離開身體是兩件事。'},
        ]},
        {id:'toxin-don-ugt',title:'DON 的葡萄糖醛酸化支路',nodes:[
          {id:'toxin-don-parent',label:'DON',detail:'DON 可直接參與葡萄糖醛酸化，是理解「不一定先經 Phase I」的一個例子。'},
          {id:'toxin-ugt',label:'UGT ＋ UDP-葡萄糖醛酸',detail:'UGT 家族酵素使用 UDP-葡萄糖醛酸作為供體，把葡萄糖醛酸基團接到分子上。'},
          {id:'toxin-don-glucuronides',label:'DON 葡萄糖醛酸結合物',cofactor:'例如 DON-3-GlcA／DON-15-GlcA',detail:'人體研究可在尿液測到 DON 及其結合型代謝物；比例與濃度受飲食、採樣時間與代謝影響。'},
          {id:'toxin-don-excretion',label:'腎臟與尿液排出',detail:'尿液檢出顯示採樣時排出的物質，不直接等於全身蓄積量；也不能單靠一個檢測值確定症狀原因。'},
        ]},
      ],productIds:['antrodia','995'],productContext:'菌菇原料連到肝臟與細胞研究；胺基酸、卵磷脂連到營養供應。肝臟專利、原料活性與成品人體效果分別判讀；GOT／GPT／γ-GT 也不是特定黴菌毒素的專一檢驗。',
    },
    {id:'toxin-desensitize',title:'3. Desensitize｜理解敏感反應',metaphor:'把警報的感測器與真正的火源分開檢查。',
      explanation:'黏膜屏障、sIgA、肥大細胞與 T 細胞分工不同。接觸黴菌、真菌感染、毒素暴露及過敏反應需要分辨，不畫成必然依序發生的同一種疾病。',
      tracks:[{id:'toxin-mucosal-immunity',title:'屏障 → 黏膜辨識 → 免疫協調',nodes:[
        {id:'toxin-mucosa',label:'上皮與黏液屏障',detail:'上皮連接、黏液與微生物共同影響黏膜界面。持續刺激可能改變局部免疫訊號。'},
        {id:'toxin-siga',label:'分泌型 IgA',detail:'sIgA 幫助黏膜辨識與限制微生物接觸。單一高低值不能指定是哪一種毒素，也不等同免疫力強弱。'},
        {id:'toxin-mast-cells',label:'肥大細胞與 T 細胞',detail:'肥大細胞介質與 Th1、Th2、Th17 等免疫訊號可受多種因素影響；MCAS 有其臨床條件，不能由一般不適或毒素檢出直接推定。'},
      ]}],productIds:['ningkang'],productContext:'初乳粉、桑黃與蛹蟲草原料可延伸認識黏膜與免疫研究；初乳中的免疫球蛋白與身體自身分泌的 sIgA 需分開理解。',
    },
    {id:'toxin-drive',title:'4. Drive｜重整生活節律',metaphor:'讓警報有人掌舵，回到可持續的呼吸、活動與睡眠節奏。',
      explanation:'先降低持續環境負荷，再整理壓力、睡眠與身體活動。自主神經是會調節的網絡，而不是一按就能重置的開關。',
      tracks:[{id:'toxin-autonomic-rhythm',title:'生活訊號與腦幹整合',nodes:[
        {id:'toxin-daily-rhythm',label:'呼吸、活動與作息',detail:'規律活動、固定睡眠時間與舒適的慢呼吸，提供可以長期維持的生活調整方向。'},
        {id:'toxin-visceral-afferents',label:'內臟感覺與迷走傳入',detail:'迷走神經把部分內臟訊號帶到腦幹，並與脊髓感覺、荷爾蒙及免疫訊號共同參與身體回饋。'},
        {id:'toxin-autonomic-integration',label:'腦幹與自主神經協調',detail:'腦幹、邊緣系統與其他腦區協調自律神經反應。菌相、營養及心理社會因素都是研究網絡的一部分。'},
      ]}],productIds:['kangyue','kangbei'],productContext:'精神益生菌、甜橙萃取、色胺酸與發酵 GABA 是不同原料方向。菌株研究需保留菌株、劑量與試驗族群，口服成分也不等於直接到達腦內受體。',
    },
  ],
  evidence:[
    {id:'toxin-humidity',title:'潮濕：先處理漏水與室內水氣',text:'EPA 建議室內相對濕度維持在 60% 以下，理想約 30–50%，同時修復漏水並乾燥潮濕材料。來源文稿的戶外年平均 74% 不能代替室內量測；65% 也不是所有黴菌的固定生長門檻，表面水分、溫度、材料與時間都會影響。',source:'EPA 室內黴菌與水分控制；環境文稿的濕度脈絡',url:'https://www.epa.gov/mold/brief-guide-mold-moisture-and-your-home'},
    {id:'toxin-selected-cohorts',title:'92.4%：236 位已有暴露史的患者',text:'2022 年研究收錄 2019–2021 年南佛羅里達門診的 236 位 ME/CFS 患者，皆報告有水損建築暴露；92.4% 尿液至少檢出一種 OTA、黃麴毒素或 Gliotoxin。這是經選擇的族群，沒有同時收案的未暴露對照，不能推算所有 ME/CFS 或一般疲勞者的比例，也不證明因果。',source:'Toxins・2022 年，ME/CFS 患者尿液黴菌毒素研究',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC8872248/'},
    {id:'toxin-sinus-samples',title:'67%：鼻竇檢體與疾病原因分開',text:'來源文稿列出特定慢性鼻竇炎檢體的黴菌檢出率 67%，文稿沒有附上這個數字的研究樣本與檢測方法。此數字保留在來源閱讀層，不當成一般鼻竇炎的盛行率；檢出、定殖、感染與因果仍是不同問題。',source:'環境促老毒素文稿・鼻竇檢體段落'},
    {id:'toxin-laboratory-folds',title:'12–1544 倍與 10–15 倍：腸細胞模型',text:'2008 年研究使用分化的 Caco-2 腸上皮細胞。DON 引發 IL-8 分泌增加 10–15 倍；DON、OTA、Patulin 在不同實驗條件下，使共生大腸桿菌跨上皮移動增加 12–1544 倍，摘要未把最高值單獨歸給 DON。這是細胞模型中的變化，不是人體血液 IL-8 或個人腸漏程度的倍數。',source:'Toxicology and Applied Pharmacology・2008 年，腸上皮細胞模型',url:'https://pubmed.ncbi.nlm.nih.gov/18308354/'},
    {id:'toxin-testing',title:'檢出、暴露與疾病：三件事分開讀',text:'尿液濃度受飲食、採樣時間與排泄影響；健康者也可能檢出部分黴菌毒素。CDC 指出，非經臨床驗證的尿液黴菌毒素檢測不能用來診斷水損建築相關疾病；排查室內問題仍以可見潮濕、漏水與環境檢查為起點。',source:'CDC MMWR・尿液黴菌毒素檢測的臨床判讀',url:'https://www.cdc.gov/mmwr/preview/mmwrhtml/mm6406a7.htm'},
  ],
  sources:[
    {label:'專題二依環境促老毒素文稿重製，共 4 頁；原始文字與公開圖解分開保存。'},
    {label:'WHO：黴菌毒素、食品暴露與健康影響',url:'https://www.who.int/news-room/fact-sheets/detail/mycotoxins'},
    {label:'NIDDK：腎臟的構造與工作',url:'https://www.niddk.nih.gov/health-information/kidney-disease/kidneys-how-they-work'},
    {label:'EPA：居家黴菌與水分控制',url:'https://www.epa.gov/mold/brief-guide-mold-moisture-and-your-home'},
    {label:'CDC：未經臨床驗證的尿液黴菌毒素檢測',url:'https://www.cdc.gov/mmwr/preview/mmwrhtml/mm6406a7.htm'},
    {label:'2022 年研究：236 位有水損建築暴露史的 ME/CFS 患者',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC8872248/'},
    {label:'2008 年研究：黴菌毒素與 Caco-2 腸上皮細胞',url:'https://pubmed.ncbi.nlm.nih.gov/18308354/'},
  ],
};
