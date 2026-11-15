import type {ScienceModuleDefinition} from './science-module-types';

/** Parallel branches stay independent: a signaling network is not a shared
 * pipe, and ingredient badges do not represent hormone treatment. */
export const endocrineBrainBrakeDefinition:ScienceModuleDefinition={
 id:'endocrine',
 eyebrow:'專題三 · 身體的節律與大腦的節拍',
 title:'照顧節律，也理解大腦的油門與煞車',
 introduction:'先看三條荷爾蒙訊號線，再走進肝臟代謝與神經突觸。點一個工作站，看看分子各自做什麼。',
 modes:{
  stress:{label:'🚨 當壓力與節律失去協調',summary:'紅色訊號呈現壓力網絡與興奮／抑制失衡的研究情境。長期壓力的反應有個人與時間差異，不是所有人的皮質醇都會升高。'},
  support:{label:'✨ 認識三軸協調與大腦煞車',summary:'綠色訊號呈現負回饋與抑制性傳遞的正常分工。規律作息、充足營養與適度活動，是照顧這套節律的日常起點。'},
 },
 stages:[
  {id:'endocrine-axes',title:'三軸訊號',metaphor:'三個工作班表，共用同一座調度中心。',explanation:'下視丘與腦下垂體分別透過 HPA、HPT、HPG 軸調節壓力、代謝及生殖。OAT／TAT 是把腺體放在一起觀察的整理方式；真正的調節涉及各自的酵素、受體與回饋。',preferredTracks:{stress:'endocrine-hpa',support:'endocrine-hpt'},tracks:[
   {id:'endocrine-hpa',title:'壓力軸 HPA 與負回饋',nodes:[
    {id:'endocrine-crh',label:'下視丘 CRH',detail:'下視丘依壓力、睡眠及晝夜節律釋放 CRH，將訊息交給腦下垂體。這是正常適應的一部分。'},
    {id:'endocrine-acth',label:'腦下垂體 ACTH',detail:'ACTH 經血液傳到腎上腺皮質，促進類固醇生成；訊號會隨一天的節律與情境改變。'},
    {id:'endocrine-cortisol',label:'腎上腺皮質醇',detail:'皮質醇參與能量調度、血壓及免疫調節。長期壓力可改變其節律，但不能由疲勞或失眠直接推定濃度。'},
    {id:'endocrine-feedback',label:'回饋調整上游',cofactor:'糖皮質素受體 GR',detail:'皮質醇經受體作用回饋至下視丘、腦下垂體及相關腦區，調整 CRH 與 ACTH。這是調節迴路，不是把皮質醇變回 CRH。'},
   ]},
   {id:'endocrine-hpt',title:'甲狀腺軸 HPT 與轉換',nodes:[
    {id:'endocrine-trh',label:'TRH → TSH',detail:'下視丘釋放 TRH，腦下垂體釋放 TSH，接續調節甲狀腺。腺體功能與周邊轉換是不同環節。'},
    {id:'endocrine-t4',label:'甲狀腺 T4／T3',detail:'甲狀腺以分泌 T4 為主，周邊組織再依酵素與需要轉換。T3 透過核內受體調節多種代謝基因。'},
    {id:'endocrine-deiodinase',label:'T4 的不同去碘化',cofactor:'D1／D2 → T3；D3 → rT3',detail:'D1、D2 參與活性 T3 的生成，D3 可將 T4 轉為活性很低的 rT3。疾病、飢餓及用藥等情境都可能改變這些比例。'},
    {id:'endocrine-thyroid-context',label:'回到檢驗與生活背景',detail:'甲狀腺功能通常先綜合 TSH 與游離 T4 等資料。rT3 或 FT3／rT3 比值不能單獨診斷所謂代謝阻塞，也不能直接換算成疲勞原因。'},
   ]},
   {id:'endocrine-hpg',title:'生殖軸 HPG 的獨立節律',nodes:[
    {id:'endocrine-gnrh',label:'下視丘 GnRH 脈衝',detail:'GnRH 以脈衝方式調節生殖軸，會受到能量可用性、睡眠、疾病與壓力訊號影響。'},
    {id:'endocrine-lhfsh',label:'腦下垂體 LH／FSH',detail:'LH 與 FSH 分工調節卵巢或睪丸的細胞功能。女性週期、年齡及男性生殖功能各有不同的判讀背景。'},
    {id:'endocrine-gonads',label:'卵巢／睪丸與回饋',detail:'生殖腺產生雌激素、黃體酮或雄性素，並參與上游回饋。不能把每個人的荷爾蒙變化都歸因於皮質醇搶走同一池孕烯醇酮。'},
   ]},
  ],productIds:['360','kangyue'],productContext:'餐包中的刺五加與靈芝可連到壓力適應的原料研究；益生菌配方則連到腸腦訊號的研究方向。這裡的三軸箭頭呈現人體調節，不代表這些配方會把荷爾蒙數值調回指定範圍。'},
  {id:'endocrine-estrogen',title:'肝臟的分流與打包',metaphor:'先辨認包裹，再選對加工與寄送路線。',explanation:'內源性雌激素有不同氧化與結合途徑。下圖以雌酮 E1 為例；環境內分泌干擾物可以影響受體或代謝，但並不是全部都會被轉成 E1 的代謝物。',preferredTracks:{stress:'endocrine-estrogen-4oh',support:'endocrine-estrogen-2oh'},tracks:[
   {id:'endocrine-estrogen-2oh',title:'2-OH 支路：保留位置的甲基化',nodes:[
    {id:'endocrine-e1-two',label:'雌酮 E1',detail:'雌酮與雌二醇可經不同酵素進行羥化。這一支只追蹤 E1 的 2-羥化，避免和另一個位置混在一起。'},
    {id:'endocrine-2ohe1',label:'2-OHE1',cofactor:'CYP 羥化',detail:'2-羥基雌酮是兒茶酚雌激素。它有自己的生物活性與後續代謝，不能只用「好荷爾蒙」概括所有情境。'},
    {id:'endocrine-2meoe1',label:'2-MeOE1',cofactor:'COMT ＋ SAM ＋ Mg²⁺',detail:'COMT 將 SAM 的甲基轉到 2-OHE1 的羥基，生成相應的甲氧基代謝物。葉酸與 B12 參與上游甲基循環，並非 COMT 這一步的直接輔酶。'},
   ]},
   {id:'endocrine-estrogen-4oh',title:'4-OH 支路：反應性與甲基化',nodes:[
    {id:'endocrine-e1-four',label:'雌酮 E1',detail:'這一支追蹤 4-羥化位置。不同 CYP 酵素與組織會影響各支路的比例，不能把單一尿液代謝物當成完整疾病診斷。'},
    {id:'endocrine-4ohe1',label:'4-OHE1',cofactor:'CYP1B1 等酵素',detail:'4-羥基雌酮可再被氧化為反應性醌類，在特定條件下與 DNA 作用；這是機轉上的風險環節，不等於檢出就一定會生病。'},
    {id:'endocrine-4meoe1',label:'4-MeOE1',cofactor:'COMT ＋ SAM ＋ Mg²⁺',detail:'4-OHE1 的甲基化形成 4-MeOE1，不是 2-MeOE1。甲基化可改變反應性；後續分布、結合與排泄仍由其他途徑接手。'},
   ]},
   {id:'endocrine-estrogen-16oh',title:'16α-OH 支路：另一種受體活性',nodes:[
    {id:'endocrine-e1-sixteen',label:'雌酮 E1',detail:'雌酮也可以進入 16α-羥化途徑。這與前兩條兒茶酚雌激素路徑並列，不是 4-OH 之後的下一站。'},
    {id:'endocrine-16ohe1',label:'16α-OHE1',detail:'16α-羥基雌酮保留雌激素受體相關活性。它的生理及研究意義取決於濃度、組織與其他因素，不能直接用來確診肌瘤或癌症。'},
    {id:'endocrine-estriol',label:'接續代謝與結合',detail:'相關代謝可進一步形成雌三醇等分子並進入結合途徑。2-OH／16α-OH 比值是一項研究指標，不是人人都適用的治療目標。'},
   ]},
   {id:'endocrine-conjugation',title:'結合、排泄與可能的再吸收',nodes:[
    {id:'endocrine-conjugate',label:'葡萄糖醛酸／硫酸結合',cofactor:'UGT 或 SULT',detail:'UGT 使用 UDP-葡萄糖醛酸，SULT 使用 PAPS 進行結合；這些途徑影響溶解度與排泄。甲基化並不自動等同已完成水溶性打包。'},
    {id:'endocrine-excretion',label:'尿液或膽汁排泄',detail:'不同分子與結合物透過轉運及腎臟、肝膽系統處理。這些路徑可能平行進行，不是每個分子都要先甲基化再依同一順序排出。'},
    {id:'endocrine-gut-return',label:'腸道去結合與再吸收',cofactor:'β-glucuronidase',detail:'部分腸道細菌的 β-葡萄糖醛酸酶可以水解葡萄糖醛酸結合物，讓部分游離分子被再吸收。菌相、腸道通行時間與分子性質共同影響結果。'},
   ]},
  ],productIds:['995','360'],productContext:'發酵胺基酸與大豆卵磷脂可對照甲硫胺酸、膽鹼在上游甲基代謝的角色；餐包中的營養原料則需依實際標示確認。天然啤酒酵母不一定提供可靠的 B12，配方原料也不能直接換算成 COMT 活性或雌激素排出量。'},
  {id:'endocrine-neurosteroids',title:'製造神經調節原料',metaphor:'共同原料，交給不同工班逐站加工。',explanation:'ALLO 是神經活性類固醇，GABA 是神經傳遞物質；兩者的合成線各自獨立，最後在突觸協作。腦內與周邊組織都會參與神經活性類固醇的供應。',tracks:[
   {id:'endocrine-allo-synthesis',title:'膽固醇到 ALLO 的完整接力',nodes:[
    {id:'endocrine-cholesterol',label:'膽固醇',cofactor:'StAR 協助轉運',detail:'StAR 協助膽固醇抵達粒線體內膜的相關位置，讓後續酵素進行反應。StAR 是轉運相關蛋白，不是側鏈切割酵素。'},
    {id:'endocrine-pregnenolone',label:'孕烯醇酮 P5',cofactor:'CYP11A1／P450scc',detail:'CYP11A1 切割膽固醇側鏈，形成孕烯醇酮。它是多種組織中類固醇合成的上游分子。'},
    {id:'endocrine-progesterone',label:'黃體酮 P4',cofactor:'3β-HSD',detail:'3β-羥類固醇脫氫酶參與由 P5 形成 P4。P4 可進入不同代謝支路，這張圖選擇走向 ALLO 的路。'},
    {id:'endocrine-dhp',label:'5α-二氫黃體酮',cofactor:'5α-還原酶',detail:'5α-還原酶先將 P4 轉為 5α-二氫黃體酮；保留這一站，才能看清兩個不同酵素的工作。'},
    {id:'endocrine-allo',label:'別孕烷醇酮 ALLO',cofactor:'3α-HSD',detail:'3α-HSD 接續形成 ALLO。它可增強 GABA_A 受體反應，實際作用也受受體組成、濃度及組織狀態影響。'},
   ]},
   {id:'endocrine-gaba-synthesis',title:'神經元自己的 GABA 合成線',nodes:[
    {id:'endocrine-glutamate',label:'麩胺酸',detail:'麩胺酸既是重要的興奮性傳遞物質，也能在具有適當酵素的神經元中成為 GABA 的上游原料。'},
    {id:'endocrine-gad',label:'GAD 去羧反應',cofactor:'B6／PLP',detail:'麩胺酸脫羧酶 GAD 使用活性維生素 B6 作為輔因子，移除羧基並形成 GABA。'},
    {id:'endocrine-gaba',label:'GABA 儲存與釋放',detail:'神經元將 GABA 裝入囊泡並在適當訊號下釋放。這套腦內合成流程與吃進含 GABA 的食物，是不同的供應情境。'},
   ]},
  ],productIds:['kangbei','995'],productContext:'麩胺酸發酵物與發酵胺基酸可用來認識原料的名稱和不同供應路徑。口服 GABA 的吸收與進入大腦程度，需和腦內合成分開看；它也不是 ALLO 或其他荷爾蒙的替代物。'},
  {id:'endocrine-synapse',title:'油門與煞車的協調',metaphor:'車要能走，也要能慢下來；關鍵是兩邊協調。',explanation:'GABA_A 與 NMDA 是兩種不同受體通道。神經網絡需要適當的興奮與抑制，不能把「開越多煞車越好」或「關掉油門就會睡好」當成目標。',preferredTracks:{stress:'endocrine-nmda',support:'endocrine-gabaa'},tracks:[
   {id:'endocrine-gabaa',title:'GABA_A：氯離子與抑制訊號',nodes:[
    {id:'endocrine-gabaa-ligand',label:'GABA 結合',detail:'GABA 結合 GABA_A 受體的傳遞物質位點，促進受體通道開啟。ALLO 在不同位點進行正向變構調節。'},
    {id:'endocrine-allo-pam',label:'ALLO 調節反應',cofactor:'正向變構調節 PAM',detail:'ALLO 能改變通道對 GABA 的反應。這是受體藥理與生理機轉，並不是吃進某個配方後就能保證發生的鎮靜效果。'},
    {id:'endocrine-chloride',label:'Cl⁻ 電流',cofactor:'依離子梯度決定方向',detail:'成熟神經元中，氯離子電流通常帶來抑制或分流抑制；發育、病理及細胞離子梯度改變時，效果可能不同。圖示選擇常見的成熟神經元情境。'},
    {id:'endocrine-inhibition',label:'調節神經興奮性',detail:'抑制訊號協助網絡控制節拍。睡眠、焦慮與認知涉及許多腦區和傳遞物質，不能由單一通道開關推論全部症狀。'},
   ]},
   {id:'endocrine-nmda',title:'NMDA：學習訊號與過度興奮',nodes:[
    {id:'endocrine-nmda-input',label:'麩胺酸與共致效劑',cofactor:'甘胺酸或 D-絲胺酸',detail:'NMDA 受體需要麩胺酸與共致效劑結合；膜電位去極化有助解除 Mg²⁺ 阻擋，才能形成電流。'},
    {id:'endocrine-nmda-steroids',label:'P5S／DHEA(S) 調節',detail:'孕烯醇酮硫酸鹽及 DHEA 相關分子可調節多種受體；對 NMDA 的效應依分子、濃度與受體亞型而變，不是所有情境都單純踩油門。'},
    {id:'endocrine-calcium',label:'Ca²⁺／Na⁺ 內流',detail:'通道活化參與突觸可塑性與學習。過度或持續活化時，鈣離子負荷可成為興奮毒性的研究機轉。'},
    {id:'endocrine-plasticity',label:'回到網絡平衡',detail:'健康神經活動需要興奮與抑制協調，而非完全關閉 NMDA。失眠或腦霧有多種可能來源，不能從感受判定這條路徑的活動量。'},
   ]},
   {id:'endocrine-serotonin',title:'夜間節律：色胺酸的另一條路',nodes:[
    {id:'endocrine-tryptophan',label:'L-色胺酸',detail:'色胺酸是必需胺基酸，除了參與蛋白質與犬尿胺酸代謝，也可進入血清素的合成支路。'},
    {id:'endocrine-5htp',label:'5-HTP',cofactor:'TPH ＋ BH4、Fe²⁺、O₂',detail:'色胺酸羥化酶 TPH 需要四氫生物蝶呤、鐵與氧，形成 5-羥色胺酸。B6 參與的是下一站。'},
    {id:'endocrine-serotonin-node',label:'血清素',cofactor:'AADC ＋ B6／PLP',detail:'芳香族 L-胺基酸脫羧酶 AADC 使用 B6，將 5-HTP 轉成血清素。腸道產生的血清素不能直接穿過血腦屏障，與腦內的供應需分開理解。'},
    {id:'endocrine-melatonin',label:'褪黑激素',cofactor:'AANAT → ASMT',detail:'在適當組織中，血清素經 N-乙醯化與甲基化形成褪黑激素。光照與晝夜時鐘控制分泌節律，補原料不是唯一的調節方式。'},
   ]},
  ],productIds:['kangbei','kangyue'],productContext:'色胺酸、發酵物所含 GABA，以及 GKJOY／GKF3 益生菌與甜橙萃取可分別對照原料研究。菌株的動物實驗與人體睡眠觀察要分開閱讀，不能直接推算服用者的腦內血清素、多巴胺或通道電流。'},
 ],
 evidence:[
  {id:'endocrine-steal-context',title:'「皮質醇竊質」是比喻，不是已證實的共用水管',text:'各組織的類固醇合成受到不同酵素、訊號和回饋控制。目前不能把長期壓力簡化為皮質醇直接搶走卵巢或腦部的一池孕烯醇酮，圖中因此保留三條獨立訊號軸。',source:'專題三原始講義：OAT／TAT 與神經類固醇；搭配既有壓力軸生理整理。'},
  {id:'endocrine-thyroid-tests',title:'疲勞與怕冷，不能只靠 rT3 解釋',text:'常規甲狀腺評估會把 TSH、游離 T4、症狀與用藥一起考量。rT3 濃度會受疾病等情境影響，不能單獨用來診斷一般人的甲狀腺功能低下。',source:'美國甲狀腺協會：甲狀腺功能檢查',url:'https://www.thyroid.org/thyroid-function-tests/'},
  {id:'endocrine-oral-gaba',title:'受體機轉與吃進原料，是兩個研究問題',text:'GABA 在神經元間的抑制機轉很清楚；口服 GABA 能有多少到達大腦，以及不同配方對睡眠的效果，則是另外的吸收與人體研究問題。圖中的離子動畫呈現受體原理。',source:'Neurotransmitters as food supplements: the effects of GABA on brain and behavior（2015）',url:'https://pubmed.ncbi.nlm.nih.gov/26500584/'},
 ],
 sources:[
  {label:'專題三：內分泌與神經類固醇來源講義；原始圖解與白話導讀見下方圖庫。'},
  {label:'精準疼痛圖解：神經傳遞、壓力與身體調節；見本專題選編圖庫。'},
  {label:'美國甲狀腺協會：甲狀腺功能檢查',url:'https://www.thyroid.org/thyroid-function-tests/'},
  {label:'GABA 口服補充與腦部作用研究回顧（2015）',url:'https://pubmed.ncbi.nlm.nih.gov/26500584/'},
  {label:'NIH ODS：維生素 B12 與食物來源',url:'https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/'},
 ],
};
