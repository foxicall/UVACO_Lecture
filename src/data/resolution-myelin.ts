import type {ScienceModuleDefinition} from './science-module-types';

export const resolutionMyelinDefinition:ScienceModuleDefinition={
 id:'resolution',
 eyebrow:'專題四・讓發炎收尾，理解神經保養',
 title:'清理現場，再看神經的保護層',
 introduction:'從清潔隊收尾，到大腦原料運輸，再走進髓鞘研究；五個步驟各有自己的工作。',
 modes:{
  stress:{label:'🚨 當清除失衡、髓鞘受損',summary:'觀察未清除細胞如何延續警報，以及髓鞘受損時的訊號變化。這是不同生理環節的對照，並非人人都會依序發生的病程。'},
  support:{label:'✨ 認識主動消退與髓鞘維持',summary:'看巨噬細胞清理、脂質訊號協調與神經保養如何分工。切換的是生理示意，研究數據仍保留各自的對象與條件。'},
 },
 stages:[
  {id:'clearance',title:'第一步・清潔隊收尾',metaphor:'警報停了，現場仍需要清潔隊。',explanation:'胞葬作用讓巨噬細胞收走凋亡細胞。若清除跟不上，次級壞死可能延續發炎訊號；慢性發炎也有其他原因，沒有固定的「悶燒二十年」時程。',
   preferredTracks:{stress:'resolution-clearance-failure',support:'resolution-efferocytosis'},
   tracks:[
    {id:'resolution-clearance-failure',title:'清除跟不上時',nodes:[
     {id:'res-apoptotic-neutrophil',label:'凋亡嗜中性球',detail:'防禦任務結束後，部分嗜中性球進入凋亡。細胞表面的辨識訊號，幫助清理細胞找到它們。'},
     {id:'res-secondary-necrosis',label:'次級壞死與 DAMPs',detail:'凋亡細胞若長時間未被清除，細胞膜可能失去完整性，釋出損傷相關分子 DAMPs。'},
     {id:'res-nlrp3',label:'NLRP3／IL-1β',cofactor:'準備訊號與活化刺激共同參與',detail:'部分損傷訊號可參與 NLRP3 發炎體的活化，接續促進 IL-1β 成熟。並非每一種 DAMP 都直接啟動相同路徑。'},
    ]},
    {id:'resolution-efferocytosis',title:'清潔隊完成收尾',nodes:[
     {id:'res-eat-me',label:'辨識「請清除我」訊號',cofactor:'磷脂醯絲胺酸等表面訊號',detail:'凋亡細胞暴露磷脂醯絲胺酸等訊號，經橋接分子與吞噬受體協作，讓巨噬細胞辨識清除目標。'},
     {id:'res-engulf',label:'巨噬細胞胞葬',detail:'巨噬細胞包覆、吞入凋亡細胞，再由細胞內消化系統處理材料；這個過程稱為胞葬作用 Efferocytosis。'},
     {id:'res-homeostasis',label:'協調退場與組織穩態',detail:'清除過程可伴隨免疫訊號改變、組織修復及材料回收。消退是一組主動程序，並不是完全關閉必要的免疫防禦。'},
    ]},
   ],productIds:['kanger-n'],productContext:'康爾喜 N 的乳酸菌、鳳梨酵素與木瓜酵素，可從腸道與食物蛋白分解角度認識；這與巨噬細胞吞噬凋亡細胞是不同工作，口服酵素不能直接畫成血液裡的清潔隊。'},
  {id:'lipid-families',title:'第二步・辨認收工訊號',metaphor:'四個家族像不同頻道，各有原料和接收器。',explanation:'SPM 是多種促消退脂質介質的總稱。EPA、DHA 與花生四烯酸 AA 各自形成不同支路；前驅物還要經過多步驟轉化，才能形成特定介質。',
   tracks:[
    {id:'resolution-epa',title:'EPA → E 系列消退素',nodes:[
     {id:'res-epa',label:'EPA',detail:'EPA 是 E 系列消退素的上游脂肪酸。攝取原料後的分布與轉換，受到酵素、細胞及生理狀態影響。'},
     {id:'res-18-hepe',label:'18-HEPE',cofactor:'氧化與後續酵素接力',detail:'18-HEPE 是這條路徑的重要前驅物與代謝標誌，後續還需細胞間與酵素合作才能形成個別消退素。'},
     {id:'res-rve1',label:'RvE1 與受體調節',cofactor:'ERV1／ChemR23、BLT1',detail:'RvE1 可透過 ERV1／ChemR23 及調節 BLT1 訊號參與免疫反應，限制過度嗜中性球募集等作用；不同受體並非相同的開關。'},
    ]},
    {id:'resolution-d-series',title:'DHA → D 系列消退素',nodes:[
     {id:'res-dha-d',label:'DHA',detail:'DHA 可參與膜脂組成，也能成為部分促消退介質的上游原料；這裡追蹤 D 系列消退素支路。'},
     {id:'res-17-hdha-d',label:'17-HDHA 相關路徑',cofactor:'含過氧化物的中間步驟',detail:'DHA 經脂氧合酶等多步驟反應形成 17 位氧化相關中間物，再接續生成 D 系列消退素；17-HDHA 不等同所有成熟介質。'},
     {id:'res-rvd',label:'RvD1／RvD2',cofactor:'RvD1：ALX／FPR2、GPR32；RvD2：GPR18',detail:'這些介質透過不同受體參與細胞清除、免疫調節與發炎性疼痛研究。不能把所有 D 系列消退素配到同一種受體。'},
    ]},
    {id:'resolution-protectins',title:'DHA → 保護素',nodes:[
     {id:'res-dha-p',label:'DHA',detail:'保護素與 D 系列消退素共用 DHA 這種上游脂肪酸，但後續合成分支不同。'},
     {id:'res-protectin-intermediate',label:'17 位氧化與環氧中間物',detail:'這條分支經氧化及環氧中間物等反應，產生具有特定立體結構的保護素。'},
     {id:'res-pd1',label:'PD1／NPD1',cofactor:'包括 GPR37 相關研究',detail:'保護素參與神經與視網膜等組織的保護研究；受體、細胞及組織情境會影響結果。'},
    ]},
    {id:'resolution-maresins',title:'DHA → 巨噬素',nodes:[
     {id:'res-dha-m',label:'DHA',detail:'DHA 也是巨噬素家族的上游原料；此分支與 17 位氧化支路分開閱讀。'},
     {id:'res-14-hdha',label:'14-HDHA 相關路徑',cofactor:'12-LOX 等酵素與環氧中間物',detail:'DHA 經 14 位氧化相關反應與後續環氧中間物，可接續形成巨噬素。14-HDHA 本身不是 MaR1。'},
     {id:'res-mar1',label:'MaR1 與胞葬調節',cofactor:'LGR6 等受體研究',detail:'巨噬素 MaR1 參與清除凋亡細胞及組織修復的研究，作用依細胞及疾病模型而不同。'},
    ]},
    {id:'resolution-lipoxins',title:'AA → 脂氧素',nodes:[
     {id:'res-aa',label:'花生四烯酸 AA',detail:'AA 可形成多種脂質訊號，既有發炎相關分子，也有參與消退的脂氧素。它不是 Omega-3 脂肪酸。'},
     {id:'res-lox-cooperation',label:'LOX 與細胞間接力',detail:'不同細胞的脂氧合酶可接力處理中間物，形成脂氧素支路；此處強調細胞間的代謝合作。'},
     {id:'res-lxa4',label:'LXA₄／LXB₄',cofactor:'LXA₄ 可作用於 ALX／FPR2',detail:'脂氧素參與限制發炎及促進清除等訊號。其來源是 AA，不能畫成 EPA 或 DHA 的共同下游產物。'},
    ]},
   ],productIds:['360','995'],productContext:'360 計畫餐包的亞麻仁籽提供 ALA；995 的大豆卵磷脂是磷脂與膽鹼原料。ALA 轉換 EPA／DHA 的效率有限，而卵磷脂也不是 SPM，閱讀配方時要把分子名稱逐一對上。'},
  {id:'phytochemicals',title:'第三步・看懂植物訊號',metaphor:'警報音量可以調節，但每一組控制鈕都有條件。',explanation:'薑黃素、綠茶多酚及丹參成分被用於研究氧化還原與發炎訊號。細胞實驗濃度、動物劑量及人體配方各有差異，不能把成分名稱直接換算為血中指標改善幅度。',
   tracks:[
    {id:'resolution-curcumin',title:'薑黃素與 NF-κB 研究',nodes:[
     {id:'res-curcuminoids',label:'薑黃素類',detail:'薑黃素類是薑黃中的一組植化素。研究結果會受劑型、生體可用率、劑量與受試族群影響。'},
     {id:'res-ikk',label:'IKK／NF-κB 調節',detail:'多種實驗模型觀察薑黃素類對 IKK、NF-κB 及氧化還原訊號的影響；這些作用不是單一專一性酵素阻斷。'},
     {id:'res-curcumin-outcomes',label:'觀察發炎與氧化指標',cofactor:'hs-CRP、MDA、SOD 等研究指標',detail:'部分人體研究追蹤發炎與氧化壓力指標；變化幅度需回到該研究的配方與對照條件，不能套用到所有含薑黃產品。'},
    ]},
    {id:'resolution-egcg',title:'綠茶多酚與細胞訊號',nodes:[
     {id:'res-egcg',label:'EGCG 等綠茶多酚',detail:'EGCG 是綠茶多酚的一員，參與細胞訊號與氧化還原研究。濃縮萃取物與一般飲茶的暴露量不同。'},
     {id:'res-mapk',label:'NF-κB／MAPK',detail:'實驗模型探討多酚對 NF-κB、MAPK 等訊號的調節。細胞與組織條件會影響觀察結果。'},
     {id:'res-cytokines',label:'IL-6／TNF-α 等輸出',detail:'研究人員追蹤細胞激素、氧化狀態及細胞存活，了解訊號變化與組織反應的關係。'},
    ]},
   ],productIds:['huoyi','dikang'],productContext:'活逸康的薑黃、綠茶與丹參萃取，可對照植化素研究；迪康也含丹參，適合比較草本配方的差異。兩種產品的複方、劑量與使用情境不同，丹參名稱相同不代表作用相同。'},
  {id:'brain-access',title:'第四步・分清大腦通行方式',metaphor:'同樣叫原料，包裝不同，走的入口也不同。',explanation:'血腦屏障對分子有選擇性。LPC-DHA 的轉運與猴頭素 A 的分布研究是兩條不同路，不應畫成同一個運輸通道。',
   tracks:[
    {id:'resolution-lpc-transport',title:'LPC-DHA 與 MFSD2A',nodes:[
     {id:'res-lpc-dha',label:'LPC-DHA',detail:'LPC-DHA 是溶血磷脂醯膽鹼攜帶 DHA 的特定型態。一般大豆卵磷脂、PC-DHA 與 LPC-DHA 的結構不同。'},
     {id:'res-mfsd2a',label:'MFSD2A 轉運蛋白',cofactor:'血腦屏障內皮・鈉離子依賴性轉運',detail:'MFSD2A 可運輸帶有特定長鏈脂肪酸的 LPC 型態，包括 LPC-DHA。它不是讓所有游離脂肪酸或所有卵磷脂直接通過的大門。'},
     {id:'res-brain-dha',label:'腦部脂質供應與重塑',detail:'運輸後的脂質仍需代謝、分配及重塑，才能參與膜脂組成。動物運輸與髓鞘研究，需和人體食用結果分開閱讀。'},
    ]},
    {id:'resolution-erinacine-distribution',title:'猴頭素 A 的分布研究',nodes:[
     {id:'res-erinacine-a',label:'猴頭素 A',detail:'猴頭素 A 是猴頭菇菌絲體相關的小分子成分，研究涉及神經營養訊號、分布及神經保護。'},
     {id:'res-erinacine-model',label:'動物分布與實驗模型',detail:'動物研究探討口服後的吸收及腦部分布；所使用的原料、劑量與物種，決定研究可回答的問題。它不是 MFSD2A 的 LPC 脂質運輸支路。'},
     {id:'res-erinacine-signalling',label:'神經營養訊號研究',detail:'細胞與動物模型觀察猴頭素相關原料及神經營養訊號。進入組織與產生人體臨床效益，是不同的研究問題。'},
    ]},
   ],productIds:['995','huoyi'],productContext:'995 的大豆卵磷脂對照一般膜脂原料，不能標成 LPC-DHA；活逸康的猴頭菇菌絲體對照猴頭素研究。這兩種配方原料各有自己的成分與證據，沒有共用一把「直接進腦」鑰匙。'},
  {id:'myelin',title:'第五步・認識髓鞘工程',metaphor:'神經電線的絕緣層，由專門細胞建造與保養。',explanation:'中樞神經的寡突膠質細胞製造髓鞘；周邊神經則由許旺細胞負責。神經營養因子、免疫細胞與材料供應互相影響，並不是一條食用後立即啟動的修復線。',
   preferredTracks:{stress:'resolution-microglia',support:'resolution-remyelination'},
   tracks:[
    {id:'resolution-microglia',title:'警報與神經環境',nodes:[
     {id:'res-abeta',label:'Aβ 與損傷訊號',detail:'異常聚集的 Aβ 及其他損傷訊號，可能改變小膠質細胞的辨識與反應；阿茲海默症病理涉及多條交互作用。'},
     {id:'res-microglia',label:'小膠質細胞反應',detail:'小膠質細胞既參與防禦，也負責清除。持續失衡的反應可能影響突觸與神經環境，但不能把它一律當作破壞髓鞘的細胞。'},
     {id:'res-neural-environment',label:'軸突、突觸與髓鞘環境',cofactor:'發炎、Tau 病理及代謝互相影響',detail:'神經傳導受軸突、突觸、髓鞘與周圍細胞共同影響。手腳麻木、疼痛或健忘並不能單靠這張圖判斷是否髓鞘受損。'},
    ]},
    {id:'resolution-remyelination',title:'細胞分化與髓鞘形成',nodes:[
     {id:'res-trophic-factors',label:'神經營養與局部環境',cofactor:'NGF／BDNF 等訊號網絡',detail:'NGF 與 BDNF 透過不同受體影響神經與膠質細胞；效果隨細胞種類及發育階段而變，不是同一個造髓鞘開關。'},
     {id:'res-opc',label:'OPCs 前驅細胞',detail:'寡突膠質前驅細胞 OPCs 可增殖、遷移並進入分化。研究會分別觀察細胞數量、成熟程度及周圍環境。'},
     {id:'res-oligodendrocyte',label:'成熟寡突膠質細胞',detail:'成熟寡突膠質細胞伸出突起包覆中樞神經軸突，參與建立與維持髓鞘。周邊神經則使用另一類許旺細胞。'},
     {id:'res-mbp',label:'MBP 與髓鞘結構',detail:'髓鞘鹼性蛋白 MBP 是髓鞘的重要結構蛋白。研究中的 MBP 增加，要配合組織結構與功能評估，才能解讀髓鞘狀態。'},
    ]},
   ],productIds:['huoyi','360','995'],productContext:'活逸康可連到猴頭菇與植化素的研究；360 計畫與 995 可對照蛋白質、胺基酸及磷脂原料。餐包亞麻仁籽 ALA 不等於 LPC-DHA，天然酵母也不能一律視為可靠的 B12 來源，需依實際標示確認。'},
 ],
 evidence:[
  {id:'resolution-lipid-observation',title:'90 天前後觀察：三項脂質指標',text:'原始第 22 頁記錄 62 人完成前後配對分析，每日補充 2 或 4 顆 SPMs 魚油、持續 90 天。PGE₂ −73.1%、5-HETE −46.3%、TXB₂ −30.6%，三項配對比較 p＜0.001。這是內部人體前後觀察的血中脂質變化，不是巨噬細胞清除率，也不是葡眾成品的試驗。',source:'專題四原始 PDF 第 22–23 頁・內部人體試驗統計分析'},
  {id:'resolution-lpc-model',title:'LPC-DHA 與髓鞘：先看研究對象',text:'原始第 27 頁引用 12 月齡小鼠的脫髓鞘損傷模型，使用腹腔注射 LPC-DHA，觀察炎症、脂質與再髓鞘化。物種、給藥途徑及原料都與一般食用補充品不同。',source:'Penkert 等，Cell Reports 2021；37：109898',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC8567315/'},
  {id:'resolution-maze-model',title:'水迷宮測試不是人體記憶試驗',text:'原始第 28 頁的水迷宮結果來自成年小鼠口服介入 30 天；來源當時的人體認知試驗尚未公布結果。圖中的神經保養流程與猴頭菇原料研究，應依各自模型與終點閱讀。',source:'專題四原始 PDF 第 28 頁・動物行為與人體試驗進度'},
 ],
 sources:[
  {label:'專題四來源圖解：消退、SPM 家族、植化素、LPC-DHA 與髓鞘研究'},
  {label:'NIH ODS：Omega-3 脂肪酸與 ALA 轉換',url:'https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/'},
  {label:'大腦森林來源圖解：神經營養與膠質細胞的角色'},
 ],
};
