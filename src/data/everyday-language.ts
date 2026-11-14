import { narrativeAiInstruction } from './four-pillars-story';
import copy from './everyday-copy.json';
export const everydayProducts: Record<string, {hook:string;introduction:string;ingredients:string[];axes:string[];comparison:string}> = copy.products;
export const everydayCards: Record<string, {title:string;simple:string;explanation:string}> = copy.cards;
export const scienceLabel = '🔬 看科學實證（醫師專業版）';
export const homepageNote = '本站內容為健康講座衛教與精準營養分享，保健食品旨在提供細胞修復原料，實際調理感受依個人體質而異。';
// Reject boilerplate in ordinary answers; specific emergency and medication actions remain allowed.
export const hasGenericDisclaimer = (text:string) => /僅供(?:衛教)?參考|僅供衛教|不具醫療效能|(?:並)?非藥品|不保證(?:療效|效果)|效果因人而異|實際效果視個人體質|(?:無法|不能)取代(?:正規)?醫療|不要當成(?:能)?治病的藥|保健(?:品|食品)(?:並)?不是藥/.test(text);
export const everydayAiInstruction = `${narrativeAiInstruction}\n面向55至85歲臺灣讀者，用溫暖、直接的繁體中文短句。先談生活感受，再用一個生活比喻解釋；標題與一般回答不用英文縮寫、化學路徑清單或括號教科書；需要說明的化學物質用中文名稱，接一個生活比喻。
可用的比喻：細胞是小發電廠；營養是蓋房子的原料；身體會整理回收站；腸道像有選擇性拉鍊的花園；發炎後需要收工清潔隊；神經外層像電線保護皮；身體節奏像油門與煞車；睡眠像夜間整理；老化速率像汽車時速表。比喻只解釋研究，不能轉為已證實的成品效果或個人診斷。
不要重複「本建議僅供參考」「保健食品不具醫療效能」「不保證療效」等通用免責套話，也不要每次以「請諮詢醫師」制式收尾。一般問題直接說明生活照顧與可比較的產品原料；研究條件放入 evidenceLimit（若有此欄位），說清楚試驗對象與配方。保留具體且與問題相關的急症處理、過敏與用藥資訊；急症須優先給出119等行動，不導向產品。
不得把原稿中的「九成症狀源自黴菌」「吃產品修好神經、排毒、抗輻射、清除失智垃圾」「免消化直接餵養肌肉」當成事實。不要編造林煒醫師引述。未找到某項研究只能說本次資料未提供，不可斷言從未有研究。`;
