# 2026-08-09 · 任務塊 A：Oracle90 prerender 靜態站＋SEO/AEO/GEO 基建

## 一句結果

Oracle90 由純 SPA 升級為 prerender 靜態站，25 條路由各有獨立 HTML（含逐頁
title／description／canonical／OG／JSON-LD），並在 build 時自動生成
`llms.txt`、`sitemap.xml`，`robots.txt` 對四大 AI 爬蟲全開；全部交付項已本地
commit，未 push。

## 做了什麼

### 1. Prerender（自寫 postbuild，零新依賴）

揀了「Vite SSR build ＋ 自寫 postbuild 腳本」而不是 vite-ssg 或
vite-plugin-prerender：`react-dom/server` 與 `StaticRouter` 本來就在
dependency tree 裡，不用引入新套件，日後換 Vite 版本或改 router 都不會被鎖死。

- `web/src/App.tsx`：抽出與 router 無關的 app tree，瀏覽器端與 prerender 端共用。
- `web/src/entry-server.tsx`：`renderToString` ＋ `StaticRouter`，只供 Node 用。
- `web/src/main.tsx`：`#root` 有內容就 `hydrateRoot`，否則 `createRoot`（未
  prerender 的路徑仍可正常運作）。
- `web/scripts/prerender.mjs`：讀 `dist/index.html` 做 template，逐條路由注入
  head 與 markup，寫出 `dist/<route>.html`。
- `web/index.html`：head 加入 `<!-- seo:start … seo:end -->` 區塊與
  `<!--app-html-->` 標記；區塊內的預設值只在 dev server 生效。
- build 拆三步：`build:client` → `build:server` → `prerender`。

單場頁 title 用 Opta 公式：`{Home} vs {Away} Prediction: {League}, {日期}`。
description 帶三個機率數字，例如
`Fulham 31%, draw 26%, Chelsea 43%. Oracle90's statistical forecast for this
Premier League match, published before kickoff.`

### 2. JSON-LD（全部烘入 prerendered head，非 client 注入）

- 每場：`SportsEvent`，含 `homeTeam`／`awayTeam`（`SportsTeam`）、`startDate`、
  `eventStatus`、`sport`、`superEvent`（聯賽 ＋ 球季）。
- `/methodology`：`FAQPage` 五條 Q&A，答案逐條由現有方法論文案改寫，口徑守住
  模型 v2 的 market-informed rating track、市場共識權重 0.80／統計模型 0.20、
  以及「data science research project，不提供投注建議」。
- 全站：`WebSite` ＋ `Organization`（Oracle90，https://oracle90.com）以
  `@graph` 形式放在每一頁。

### 3. llms.txt generator

`web/src/llms.ts` ＋ `web/scripts/gen-seo-assets.mjs`，從兩個 JSON 生成，內容含：
一句定位（statistical football forecasts, logged publicly on GitHub before
kickoff）、明確一句 `This is data science research, not betting advice.`、
22 場全部場次的機率與 O/U 2.5、方法論摘要（同 FAQ 同源）、頁面索引、引用條款、
`Last updated` 時間戳。

### 4. sitemap.xml generator

同一支腳本、同一份 route table 生成，25 條 URL，`lastmod` 取 JSON 的
`generated_at`。

### 5. robots.txt

`web/public/robots.txt`，全開，明列 GPTBot、ClaudeBot、PerplexityBot、
Google-Extended，另加 OAI-SearchBot、Applebot-Extended、CCBot，附 Sitemap 行。

### 6. Vercel routing

`web/vercel.json` 開 `cleanUrls: true`（`dist/methodology.html` 由
`/methodology` 供應），catch-all rewrite 目的地由 `/index.html` 改為 `/`，
這是 Vercel 官方文件對 cleanUrls 專案的寫法。靜態檔優先於 rewrite，所以
fallback 只會在沒有 prerendered 檔的路徑觸發。

## 事故與風險

- **無事故**，沒有卡三次的問題，沒有動 `web/data/*.json`。
- **prerendered HTML 一律英文**。語言切換是 client 端的，`I18nProvider` 現在
  永遠由 `en` 起手、hydration 後才套用 localStorage 的偏好，否則首次 render
  會對不上 prerendered markup。副作用：zh 使用者會有一瞬間的英文閃現。要讓
  中文版也被索引，需要另開 `/zh/...` 路由，屬另一件事。
- **SportsEvent 沒有 `location`**。資料裡沒有球場，寧可缺欄位也不虛構；代價是
  Google 的 Event rich result 通常要求 location，可能只當一般結構化資料。
- Vercel 的 `cleanUrls` 行為已對 Vercel 官方文件核實，但**未在真實 Vercel
  部署上實測**（未 push）。這是唯一需要上線後覆核的一項。

## 驗證證據

`npm run typecheck` ＋ 清空 dist 後 `npm run build`：

```
> oracle90-web@0.1.0 typecheck
> tsc --noEmit

> oracle90-web@0.1.0 prerender
> node scripts/prerender.mjs && node scripts/gen-seo-assets.mjs

prerender: wrote 25 HTML files to dist/
seo assets: sitemap.xml (25 urls) + llms.txt written to dist/
=== VERIFY ===
html count: 25
missing og:title: []
missing canonical: []
missing ld+json: []
sitemap locs: 25
llms match links: 22
robots bots: 4
betting-tip scan: [dist/llms.txt:65:### Does Oracle90 offer betting advice?]
```

（最後一行是 FAQ 的免責問句本身，不是投注文案。）

隨機抽兩個單場頁核 SportsEvent 與隊名：

```
--- match/championship/watford-v-southampton.html
"@type":"SportsEvent","@id":"https://oracle90.com/match/championship/watford-v-southampton#event"
"homeTeam":{"@type":"SportsTeam","name":"Watford"}
"awayTeam":{"@type":"SportsTeam","name":"Southampton"}
<title>Watford vs Southampton Prediction: Championship, 16 August 2026</title>
--- match/premier-league/newcastle-united-v-liverpool.html
"@type":"SportsEvent","@id":"https://oracle90.com/match/premier-league/newcastle-united-v-liverpool#event"
"homeTeam":{"@type":"SportsTeam","name":"Newcastle United"}
"awayTeam":{"@type":"SportsTeam","name":"Liverpool"}
<title>Newcastle United vs Liverpool Prediction: Premier League, 23 August 2026</title>
```

methodology 的 FAQPage：

```
=== FAQPage ===
1
"@type":"Question","name":"What does Oracle90 publish?"
"@type":"Question","name":"How does the Oracle90 model work?"
"@type":"Question","name":"How much weight does the market consensus carry?"
"@type":"Question","name":"How can the published forecasts be verified?"
"@type":"Question","name":"Does Oracle90 offer betting advice?"
```

本地起 `npx serve@14 dist`（有 cleanUrls，模擬 Vercel），Playwright 走一輪
hydration ＋ client 導航，console 零訊息：

```
H1 after hydrate: FulhamvChelsea
URL: http://localhost:5056/match/premier-league/fulham-v-chelsea
nav -> home URL: http://localhost:5056/
home H1: Match probabilities, published before kickoff.
nav -> match URL: http://localhost:5056/match/premier-league/arsenal-v-coventry-city
match H1: ArsenalvCoventry City
nav -> methodology URL: http://localhost:5056/methodology
after zh toggle H1: 方法論
home direct H1: 開賽前發佈的比賽機率。
track direct H1: 往績對帳

--- console/pageerror log ---

TOTAL messages: 0, errors/hydration-related: 0
```

（`home direct H1` 出中文，證明 hydration 後 localStorage 偏好有正常套用，而
且沒有觸發 hydration mismatch 警告。）

`git status` 乾淨，`dist/` 與新增的 `dist-ssr/` 都在 `.gitignore`。

## 未完與阻塞

- 未 push（按護欄，push 由指揮線親驗後做）。
- Vercel 實際部署後要覆核三件事：`/methodology` 直入是否 200、單場頁直入是否
  200、`https://oracle90.com/llms.txt` 與 `/sitemap.xml` 是否可取。
- sitemap 未提交去 Google Search Console／Bing。

## 要指揮線拍板的事

1. **`web/src/i18n.tsx` 有一個舊文案錯誤**：單場頁 `publishedProof` 寫
   「Published before kickoff · model v0」／「模型 v0」，但 `data/*.json` 的
   `model_version` 是 `v2`。現在這句已經烘入 22 個 prerendered HTML。這是文案
   ，不在本任務塊授權範圍，所以我沒有改。建議改成直接讀 `l.model_version`，
   一行 code。要不要我做？
2. **要不要出中文可索引版本**（`/zh/...` 路由 ＋ hreflang）？現時 zh 內容
   對搜尋引擎與 AI 爬蟲完全不可見。這是新一塊工作，不是本塊的漏做。
3. **SportsEvent 的 `location`**：要拿到球場資料才可補；要補的話得由
   engine 側在 JSON 加欄位（本 repo 不可改 JSON 數值）。

## Commit 清單

| commit | 訊息 |
|---|---|
| `65847e4` | `feat(build): prerender every route to static HTML with SEO metadata` |
| `a2daf2a` | `feat(seo): open robots.txt to AI crawlers and serve prerendered files first` |
| `9155311` | `docs(web): document the prerender and SEO asset build pipeline` |

全部在 `main`，本地，未 push。
