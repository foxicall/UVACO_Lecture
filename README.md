# 找回身體的自癒力

林煒醫師免費健康講座 × 葡眾互動生態島。Next.js 15、React 19、TypeScript、React Three Fiber、Three.js、Framer Motion 與 Tailwind CSS。

## 執行

使用 Node.js 22.19+（本次使用 24.22.1）。

```bash
npm ci
npm run dev
# 正式版
npm run build
npm run start
```

若雲端 npm 快取不可寫，使用 `npm ci --cache /workspace/.npm`。每個雲端任務已有獨立工作區，直接使用現有 checkout，不需建立 worktree。

`prebuild` 重新擷取本地文件、建立臨床來源索引與整合快取，再執行素材生成。首頁和文字版會預先產生，3D 模組延遲載入；AI API 需要 Node.js 伺服器。預設正式建置保留 API，可部署至 Vercel 或支援 Node 的主機。GitHub Pages 使用獨立的靜態建置模式。

## GitHub Pages 自動發布

`.github/workflows/deploy.yml` 在 `main`、`work` 推送或手動執行時，使用 Node 24、`npm ci`、`npm run build`，將 `out/` 經 `actions/upload-pages-artifact@v3` 與 `actions/deploy-pages@v4` 發布。先在儲存庫 **Settings → Pages → Build and deployment → Source** 選擇 **GitHub Actions**。環境發布與 GitHub Pages 網站發布是不同操作。

目前 `github-pages` 保護環境只允許 `main` 部署，因此 `work` 執行建置與上傳驗證，`main` 才發布公開網站。各分支使用獨立 concurrency group，避免同時同步兩個分支時互相取消。若要開放其他發布分支，需先調整 GitHub 環境的部署分支規則與工作流程條件。

```bash
DEPLOY_TARGET=pages npm run build
# 對應專案網址 /UVACO_Lecture/，可用 PAGES_BASE_PATH 覆寫
# 靜態檔案輸出至 out/，中間檔放在 .next/
```

Pages 不提供 Node.js 路由，這個模式會排除 `route.ts`，保留全部講座、島嶼、產品、語音與文件導覽。小幫手明確標示「這不是 AI 回答」，以本機文件選擇閱讀路線，不呼叫 Gemini、不送出文字，也不需要把金鑰放進 GitHub Actions 或瀏覽器。預設 `npm run build && npm run start -- -H 0.0.0.0 -p 3000` 仍提供完整 Gemini API。

本機驗證 Pages 時，讓靜態伺服器把 `out/` 掛載在 `/UVACO_Lecture/`，再執行 `npm run test:pages`。預設測試 8080 埠，也可以用 `PAGES_TEST_BASE_URL` 指定完整網址；測試子目錄資源、12 座島、文件導覽、不呼叫 API，以及文字版返回首頁。

## Gemini 與離線行為

伺服器／建置環境設定 `GEMINI_API_KEY`，不要使用 `NEXT_PUBLIC_` 前綴或提交金鑰。可複製 `.env.example` 成 `.env.local` 供 Next.js 使用；獨立素材腳本從 process environment 讀取金鑰。

- 官方 `@google/genai`；素材固定 `gemini-3.8-pro`，導覽固定 `gemini-3.8-flash`。不會改用其他模型。
- 2026-11-14 實際檢查：Flash 生成與串流可用，Pro 型號查詢回傳 404。提交的 SVG 是原創程式繪圖，manifest 標示 `Original code artwork`，不是 Gemini 產物。
- 產生十二個產品插畫、四個講座圖示及受限數值 shader 參數。缺少 Pro、離線或無金鑰時，保留通過驗證的本地素材；缺檔時重建確定性的原創 SVG，網站仍可建置。
- SSE 串流三句繁體中文，完成並驗證 JSON 後才執行產品選取與閱讀連線。API 失敗提供「改看本機文件導覽」，明示不是 AI 回答。

```bash
npm run assets:generate
npm run assets:generate -- --refresh
npm run assets:generate -- --require-ai
```

最後一個指令會在 Pro 不可用時回傳非零狀態。有效 Gemini 素材快取可以重用。雲端代理使用既有環境設定，不擷取代理持有的憑證；未設定代理時正常使用 HTTPS。服務目的地是 `generativelanguage.googleapis.com`。

## 內容與操作

`葡眾/lecture-poster-source.md` 保存海報文字：11/15（日）10:00、延吉街235巷1號。未自行增加年份、報名連結或電話。講師資料含 8 項專長與原清單全部 10 項學經歷。

`pro-partner-health-mechanisms.md` 與 `pdf-extracted-sources.md` 保存使用者提供的來源文字；較早的詳細資料保留在 `supplementary-source-details.md`。`npm run materials:ingest` 擷取十二個完整段落至 `src/data/source-materials.json`，不足十二個會失敗。`src/data/uvaco-products.ts` 提供產品、原料、注意事項、來源機轉與閱讀路線；`lecture-poster.ts` 管理四主題、座標及巡禮順序。

四個主題是人體修復能力、神經修復、慢性發炎、自律神經，每組三座產品島，中央健康金三角開啟三大機轉專區，講座資訊由頂欄與活動卡進入。固定 48px 浮動頂欄包含講座資訊、四主題、健康金三角、簡報與字級入口；底部五顆按鈕提供上一站、下一站、全島總覽、語音導讀與播放 PPT。保留可展開的症狀入口、100%／125%／140% 字體、鍵盤分頁、對話框焦點限制與 Escape 關閉。無 JavaScript 時可閱讀 `/products`。

國語語音使用 `speechSynthesis`，`zh-TW`、速度 0.92，支援暫停與繼續。語音輸入需瀏覽器支援及麥克風許可；辨識後先確認文字再送出。群島採固定正交視角與暖日光，沒有晝夜切換、自由旋轉、縮放或浮動動畫。選取產品僅顯示光圈、閱讀連線與玻璃閱讀面板；視窗尺寸改變才重新適配地圖邊界。按需繪製避免閒置時持續消耗 GPU。

來源機轉原文可在產品科學頁展開閱讀。介面區分研究機制與成品療效，專利、企業獎項與醫師資歷不作為保健品治病的證明。ECFMG 證書不等同美國各州行醫執照。

## 三套講座簡報

`src/components/PptxKeynotePlayer.tsx` 提供 16:9 投影片、縮圖、全螢幕與大字講稿：記憶健康 8 頁、疼痛與修復 7 頁、產品全覽 8 頁。左右鍵、Home／End、觸控滑動與前後按鈕切頁；自動朗讀支援暫停、繼續、停止，讀完本頁才切到下一頁，最後一頁結束播放。系統沒有國語語音時仍可閱讀全文。

目前收到逐頁文稿，沒有原始 PPTX 檔。本版本是原生網頁重製，並非原始 PowerPoint 版面還原。`葡眾/keynote-source.md` 保存原稿，`src/data/keynote-originals.json` 提供逐頁來源對照，`src/data/pptx-decks.ts` 提供完整閱讀與朗讀內容。播放器可展開來源原文，展示文字區分原料研究、治療研究與成品療效，避免將醫學研究數字直接套用於保健品。

## 驗證

```bash
npm run typecheck
npm test
npm run build
npm run start -- --port 3001
# 另一個終端機
npm run test:browser
```

瀏覽器測試使用 `/usr/bin/chromium` 與 3001 埠，可透過 `CHROMIUM_PATH`、`TEST_BASE_URL` 調整。涵蓋 1440、768、390 像素、48px 頂欄、固定地圖標籤、23 頁簡報、朗讀自動切頁、全螢幕與焦點返回，產生 `test-results/` 截圖及 axe 報告。AI 前端測試使用合成 SSE；真實 Flash 連線另行驗證。TTS 測試驗證語言、速率與控制契約，不代表每台裝置均已實際播音。

60fps 取決於實體裝置 GPU 與瀏覽器；headless Chromium 不是 iPad／手機效能認證。首句延遲受網路與模型影響，不能保證低於一秒。

## 部署邊界

API 限制請求 2048 bytes、問題 300 字、45 秒逾時、同源存取、每實例每分鐘 20 次及同時 4 次。多實例公開部署需在平台入口設定共享 rate limit／用量配額。應用程式不記錄問題內容；問題會傳送 Google，介面有送出前說明。

SVG 僅允許白名單節點／屬性，拒絕腳本、事件及外部資源，以圖片方式載入。模型只提供受限數值，不執行其回傳的 GLSL 或 HTML。資料更新請同步維護來源文件。


## 健康金三角與新上傳講座

`葡眾/lectures/` 保留六份新上傳講座原始 Markdown，產品機轉文件採用本次上傳版本，前版保存在 `葡眾/archive/`。原始姓名與檔名保留在來源層；網站以「林煒醫師健康講座」作為活動識別，參考文件用主題名稱呈現，不將其他講者引述改署為林醫師，也不宣稱林醫師為個別使用者開立處方。

`npm run clinical:synthesize` 掃描儲存庫所有 Markdown，區分工程文件與臨床來源。12 份新舊臨床來源的完整內容、SHA-256、分段行號、12 列原始應用矩陣與產品資料保存在 `clinical-corpus.json`；此完整 corpus 僅供腳本與伺服器使用。`clinical-coverage.json` 記錄來源與 17 張機轉卡的對照，`gemini-3.8-insights.json` 提供有來源版本的建置摘要。新增未登記的臨床 Markdown 會使建置失敗，避免靜默遺漏。可用 `--refresh` 重試 Pro，或 `--require-ai` 要求真實模型生成；Pro 不可用時不改用其他模型。

專區提供慢性發炎、細胞自癒力、自律神經三軸互動圖、17 張機轉卡、12 款產品原料對照、12 份來源筆記與直達既有投影片的連結。原稿完整保留，公眾閱讀卡則區分生物機轉、原料研究、不同配方及成品人體證據，涵蓋發炎消退、環境暴露、荷爾蒙、代謝內皮、甲基化、腸腦軸等主題。未將 MitoCORE、SPM、LPC-DHA、荷爾蒙或侵入性療程等同葡眾成品作用。

「我的關注」提供六項複選。圖表計算每個主題涉及幾項選擇，**不是身體失衡百分比或檢測值**；產品為原料閱讀選項，早／日／晚內容為生活照護，不提供補充品劑量、個別服用時間、用藥調整或協同療效保證。急症、用藥與恢復期情境先顯示醫療評估方向，不自動導向產品。

Node API `/api/clinical-analysis` 使用官方 SDK、固定 `gemini-3.8-flash` 與 `googleSearch`。先搜尋證據，再以相同模型產生受 schema 約束的答案；只顯示真實 `groundingMetadata` 引用與搜尋建議，無引用時如實標示。2026-11-14 的實測約 36 秒，取得 NIH、葡萄王等來源；前端立即顯示本地文件整理，再更新 AI 結果。建置端 Pro 仍回傳 404，建置快取明確標示文件整理，並非 Gemini 生成。

新 API 限制 4096 bytes、六項有效選項、300 字補充問題、每實例每分鐘 12 次、同時 2 次、55 秒伺服器逾時；前端 65 秒可取消，錯誤仍可閱讀本機文件。產品動作須通過預先限定範圍驗證。搜尋建議 HTML 僅在禁止腳本、不同來源的 sandbox iframe 中呈現。API 不記錄健康問題；送出前會告知 Google 資料傳送。靜態 Pages 不呼叫新 API、不傳送使用者輸入，不需要使用者金鑰。

```bash
npm run clinical:synthesize
npm run test:triangle # TEST_BASE_URL 預設 http://localhost:3002
```

新測試涵蓋三種尺寸、17 張卡、12 款產品、來源主題、三軸關聯數、搜尋引用、醫療分流、API 失敗續讀、簡報指定頁及國語語音契約；引用介面使用合成回應，真實 Flash 搜尋另行驗證。


最終驗證：19 項資料／API 測試、Node 正式建置與 GitHub Pages 建置通過。1440／768／390 像素的原有流程與健康金三角共 24 個 axe 檢查畫面零違規（不含隔離的 Google 搜尋建議內頁）。靜態版驗證簡報指定頁、產品導覽及零 API 請求。初版正式 API 曾在 55 秒逾時並正常提供本地文件；縮減重複搜尋與無關內容後，真實 Node HTTP 請求約 32.6 秒回傳 Gemini 3.8 Flash 分析、12 筆外部引用與有效產品閱讀動作。這是單次測試結果，不是延遲保證。
