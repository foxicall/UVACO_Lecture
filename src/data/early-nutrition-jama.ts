import type {EarlyNutritionStudy} from './early-nutrition-types';

/** Counts and effect estimates follow the published abstract (PMID 43018988).
 * Intervention details are identified as registry information, not inferred
 * from the user's secondary commentary. Percentages are calculated from counts.
 * Product links are ingredient reading destinations, not tested interventions.
 */
export const earlyNutritionStudy:EarlyNutritionStudy={
 title:'營養支持，早一步安排',
 eyebrow:'2026《JAMA Oncology》· 隨機臨床試驗',
 hook:'修屋頂，最好在風雨變大之前。這項研究比較：從治療開始就安排口服營養補充，或等營養狀況下降後再啟動，療程結束時會有什麼不同？',
 citation:'Su L, et al. JAMA Oncology. 2026. Early vs Routine Oral Nutritional Supplementation During Concurrent Chemoradiotherapy for Nasopharyngeal Carcinoma: A Randomized Clinical Trial.',
 doi:'10.1001/jamaoncol.2026.4535',
 url:'https://jamanetwork.com/journals/jamaoncology/article-abstract/2856379',
 published:'2026-11-12',
 population:['中國 6 家三級醫院','第 II–IVA 期鼻咽癌，同步放化療','236 人隨機分組；主要分析 216 人','主要分析族群平均年齡 46.62 歲'],
 scope:'這是鼻咽癌同步放化療期間的營養支持研究。試驗以臨床口服營養補充（ONS）搭配原有飲食，兩組均有飲食指導與個別營養諮詢。',
 treatmentWindow:'從同步放化療開始至療程結束；登錄追蹤最長約 7 週',
 strategies:{
  early:{
   label:'✨ 從治療開始就補充',title:'提早安排口服營養支持',n:107,
   protocol:'從同步放化療開始安排 ONS。公開試驗登錄列出 Abbott Ensure，每次 55.8 g、每日 3 次，自放療開始至結束；這是研究方案，不是每個人的日常食用量。',
   steps:['治療開始','提早安排口服營養支持','持續追蹤攝取與體重','療程結束比較結果'],
  },
  routine:{
   label:'⏳ 營養狀況下降後啟動',title:'依預設營養下降條件啟動',n:109,
   protocol:'常規組持續接受飲食指導與個別營養諮詢，在符合研究預設的營養下降條件後啟動 ONS。這是兩種臨床照護策略的比較。',
   steps:['治療開始與營養諮詢','持續監測營養狀況','符合預設條件後補充','療程結束比較結果'],
  },
 },
 endpoints:[
  {id:'weight',title:'體重減少超過 5%',description:'主要終點 · 從治療開始至療程結束',events:{early:70,routine:88},relativeRisk:.81,confidenceInterval:[.68,.96],pValue:.01,
   interpretation:'提早組的比例較低，但仍有約 65% 發生這個結果。這是特定療程中兩組的平均觀察，仍需持續追蹤營養狀況。'},
  {id:'mucositis',title:'第 3 級以上口腔黏膜炎',description:'次要終點 · 放射性口腔黏膜炎',events:{early:15,routine:29},relativeRisk:.53,confidenceInterval:[.30,.93],
   interpretation:'作者將這項次要結果描述為潛在益處，可與主要體重結果及研究方法一起閱讀。'},
 ],
 analysis:{
  randomized:236,modifiedITT:216,ittRelativeRisk:.78,ittConfidenceInterval:[.65,.93],
  summary:'這是開放標籤、多中心隨機試驗。主圖依事先設定的修正意向治療分析（mITT），分母為 107 與 109 人；全體 236 名隨機分組者的 ITT 分析，主要終點 RR 為 0.78（95% 信賴區間 0.65–0.93），方向相近。圖中 NNT 由主圖兩組的絕對風險差推算。摘要的「攝取不足 60% 達 3 天」是入組排除條件，並非完整的常規組啟動規則。',
 },
 economics:{
  earlyCost:9560.56,routineCost:9685.23,earlyQaly:.1144,routineQaly:.1132,
  context:'摘要報告的是最佳情境（best-case）的短期探索性成本效用分析，兩組成本相差 US$124.67。QALY 將這段時間的健康品質與存活時間結合，並不是多活了這麼多年；結果也不能外推為一般保養一定能省下醫療費。',
 },
 insights:[
  {id:'intake',title:'喝得進，計畫才做得到',body:'提早規劃不只看開始日期，也要追蹤實際吃喝的份量、體重與吞嚥情況。遇到噁心、口腔疼痛或胃口差，可以由照護團隊調整質地、每次份量與頻率。',
   context:'公開摘要未提供依從性的完整定義、比例與原因；不能把未喝足目標量直接解讀為大分子吸收差，也不能據此比較其他產品的吸收率。'},
  {id:'analysis-set',title:'看結果，也要看分母',value:'236 → 216 人',body:'236 人隨機分組，主要圖表分析 216 人。把全部隨機分組者納入的 ITT 分析仍顯示相近方向，讓我們可以對照不同分析方式。',
   context:'如果實際使用與分組安排不同，可能影響兩組差異。公開摘要未提供對照組提前使用的比例與原因，因此這裡不推測誰「偷跑」或為何開始補充。'},
 ],
 bridge:'本試驗研究的是特定臨床 ONS，並未測試葡眾產品。下面從「提早留意身體需要」出發，分開閱讀日常習慣與配方原料。',
 actions:[
  {id:'mucosa',title:'先留意吃得下與黏膜狀況',habit:'提早記錄口腔疼痛、吞嚥變化與實際攝取量，讓營養計畫跟得上身體狀況。',
   connection:'發酵胺基酸、初乳與乳酸菌是不同類型的原料。可以分別查看成分、菌株及每份份量，再對照自己的整體飲食安排。',productIds:['995','ningkang','kanger','kanger-n']},
  {id:'nutrition',title:'先整理體重與全天營養',habit:'定期記錄體重，從整天的餐食、熱量與蛋白質看起，也把規律活動放進日常。治療期的營養量依個人狀況安排。',
   connection:'餐包可比較蛋白質、熱量與每份份量；發酵胺基酸可認識不同的蛋白質原料形式。兩者都要放回全天飲食與實際攝取量一起看。',productIds:['360','995']},
  {id:'rhythm',title:'先照顧睡眠與認知習慣',habit:'保留固定睡眠、活動與人際互動；記憶或日常功能持續改變時，及早安排評估。',
   connection:'猴頭菇、色胺酸與精神益生菌各有不同的配方與研究資料。這一站延伸閱讀睡眠與腸腦主題，研究對象及結果與上方的腫瘤營養試驗分開看。',productIds:['huoyi','kangbei','kangyue']},
  {id:'daily-care',title:'先整理飲食、飲水與配方',habit:'從均衡飲食、適合個人狀況的水分與規律活動開始；心腎疾病者的飲水與營養目標依照護計畫安排。',
   connection:'菌菇、草本飲品與滴粒屬不同配方形式，可比較成分、份量與食用方式。若體重下降或吞嚥困難，先確認整體熱量、蛋白質與合適質地，再安排其他原料。',productIds:['antrodia','antrodia-drops','dikang','lisheng']},
 ],
 sources:[
  {label:'JAMA Oncology 官方文章頁 · Su L, et al. · 2026-11-12',url:'https://jamanetwork.com/journals/jamaoncology/article-abstract/2856379'},
  {label:'論文 DOI · 10.1001/jamaoncol.2026.4535',url:'https://doi.org/10.1001/jamaoncol.2026.4535'},
  {label:'PubMed · PMID 43018988 · 原文摘要與主要結果',url:'https://pubmed.ncbi.nlm.nih.gov/43018988/'},
  {label:'ClinicalTrials.gov · NCT04823468 · 介入配方與追蹤期',url:'https://clinicaltrials.gov/study/NCT04823468'},
 ],
};
