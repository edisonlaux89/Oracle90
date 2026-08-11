import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { PRICE_CHECK_ENABLED } from "./config";

export type Lang = "en" | "zh";

const EN = {
    nav: {
      predictions: "Predictions",
      trackRecord: "Track record",
      methodology: "Methodology",
      priceCheck: "Price check",
      toggle: "中文",
    },
    home: {
      h1: "Match probabilities, published before kickoff.",
      sub: "Statistical forecasts for the Premier League and Championship, logged to a public GitHub record before every match starts.",
      model: "Model",
      updated: "updated",
      stats: [
        "22 forecasts published for round 1",
        "Backtest log loss 0.97 vs market 0.95 (4,061 matches, out-of-sample)",
        "Live scoring starts 21 Aug 2026",
      ],
      leagues: { "premier-league": "Premier League", championship: "Championship" },
      barsNote:
        "Bars show home, draw and away probability. Open a match for the full breakdown.",
      eduTitle: "What the percentages mean",
      edu: "58% means that in ten matches with similar conditions, we expect that result about six times. The highest percentage is our best estimate, not a promise. Oracle90 is a data science project; it does not offer betting advice.",
      h: "H",
      d: "D",
      a: "A",
    },
    match: {
      back: "All predictions",
      notFound: "This match is not in the current round.",
      backToPredictions: "Back to predictions",
      fullTime: "Full-time result",
      home: "Home",
      draw: "Draw",
      away: "Away",
      totalGoals: "Total goals",
      over: "Over 2.5 goals",
      under: "Under 2.5 goals",
      preview: "Match preview",
      aiGenerated: "AI-generated",
      provenance:
        "Written by a language model from the numbers on this page and historical results only.",
      publishedProof: "Published before kickoff · model",
      githubRecord: "View the GitHub record",
      methodNote1: "Probabilities come from a market-anchored statistical ensemble. See the ",
      methodNote2: "methodology",
      methodNote3: " for how they are produced and verified.",
    },
    priceCheck: {
      cardTitle: "Check your price",
      pageTitle: "Price check",
      pageIntro:
        "Odds are how the market expresses probability. This tool translates any price into the probability it implies and puts it next to Oracle90's published estimate for the same outcome. What you do with the difference is entirely your own business.",
      outcomes: {
        home: "Home",
        draw: "Draw",
        away: "Away",
        over: "Over 2.5",
        under: "Under 2.5",
      },
      formatDec: "Decimal",
      formatHk: "HK",
      inputPlaceholder: "Your odds",
      expand: "Compare the full match",
      collapse: "Back to single price",
      above: "ABOVE FAIR PRICE",
      near: "NEAR FAIR PRICE",
      below: "BELOW FAIR PRICE",
      fairOdds: "Fair odds",
      ourEstimate: "Oracle90 estimate",
      yourImplied: "Your price implies",
      overroundLabel: "Bookmaker margin: ",
      updatedAt: "Estimate updated",
      notFilled: "—",
      kickedOff: "This match has kicked off.",
      selectLeague: "League",
      selectMatch: "Match",
      disclaimer:
        "Oracle90 is a data science project and does not offer betting advice.",
      privacy: "Nothing you type here is stored or sent anywhere.",
    },
    track: {
      title: "Track record",
      intro:
        "Every published probability is scored against the final result. Nothing is edited after the fact.",
      startsTitle: "The record starts on 21 August 2026.",
      p1: "Once the season kicks off, this page will track accuracy, Brier score, log loss and calibration for every forecast, round by round, from the first matchweek onwards.",
      p2a: "Each prediction is committed to the public GitHub repository before kickoff, so the record can be verified independently. How that works is covered in the ",
      p2b: "methodology",
      p2c: ".",
    },
    method: {
      title: "Methodology",
      intro:
        "What Oracle90 publishes, how the numbers are produced, and how you can verify that nothing is rewritten after the results come in.",
      sections: [
        {
          title: "What we publish",
          paras: [
            "For every Premier League and Championship match we publish the probability of a home win, draw and away win, plus the probability of the match producing over or under 2.5 goals. Probabilities always sum to 100%.",
          ],
        },
        {
          title: "How the model works",
          paras: [
            "The forecasts come from an ensemble of two parts. The first is a statistical model built on team scoring rates, shots on target and strength ratings, in the family of Dixon and Coles style Poisson models combined with Elo ratings, trained on more than a decade of historical results. Since model v2, one of its rating tracks also follows market-implied team strength derived from the closing odds of past matches, so part of the market's judgement enters the model itself; we say so here because you would not be able to tell from the outputs.",
            "The second is the market consensus. Betting markets aggregate the judgement of thousands of participants and are the strongest known public predictor of football results. Our published probabilities anchor the statistical model to that consensus. This is standard practice in the industry: Opta, for example, has said publicly that its match predictions use market odds as an input.",
            "We disclose the blend openly. The current published forecasts weight the market consensus at 0.8 and the pure statistical model at 0.2. When the weighting changes, the version number changes with it.",
          ],
        },
        {
          title: "Why anchor to the market",
          paras: [
            "Because it is honest. Decades of academic research show that no public model consistently beats the closing market consensus at predicting match outcomes. A site claiming otherwise is either lucky or lying. Anchoring gives you the most accurate probabilities we can offer, and our track record page shows exactly how they perform.",
          ],
        },
        {
          title: "Known limitations",
          paras: [
            "The model is least reliable in the first weeks of a season, when current-season data is thinnest. Newly promoted clubs carry extra uncertainty because they have little recent history in the top two divisions.",
            "The statistical model knows nothing about injuries, transfers, squad rotation or managerial changes. That information reaches the forecasts only indirectly, through the market consensus anchor and the market-informed rating track.",
            "Probabilities describe long-run frequencies. Any single match can go any way; an upset does not mean the model is broken. Judge us on the calibration shown on the track record page, not on one result.",
          ],
        },
        {
          title: "Verification",
          paras: [
            "Every forecast is committed to a public GitHub repository before kickoff. Git commit timestamps are public and independently checkable, and published predictions are never amended or rewritten. If we were tempted to quietly fix a bad call after full time, the commit history would expose it.",
          ],
        },
        {
          title: "What this is not",
          paras: [
            "Oracle90 is a data science project. It does not offer betting advice, tips or staking suggestions, and it never will. The probabilities describe how likely outcomes are; what you do with that information is entirely your own business.",
            "Where AI-generated match previews appear on this site, they are labelled as AI-generated.",
          ],
        },
        ...(PRICE_CHECK_ENABLED
          ? [
              {
                title: "About the price check tool",
                paras: [
                  "The price check tool converts odds you enter into the probability they imply, then shows our published estimate for the same outcome beside it. The badge describes the relationship between those two numbers and nothing else: your price sits above, near or below the fair odds of our estimate.",
                  "The estimate is the same market-anchored forecast shown on every match page. There is no extra model behind the tool, nothing you type is stored, and no recommendation is made. Whether a gap matters, and what to do about it, is entirely your own business.",
                ],
              },
            ]
          : []),
      ],
      repoLinkText: "public GitHub repository",
    },
    footer: {
      logged1: "Predictions are logged publicly on ",
      logged2: "GitHub",
      logged3: " before kickoff. The commit history is the proof.",
      disclaimer:
        "Oracle90 publishes statistical forecasts for informational and educational purposes. It does not offer betting advice.",
      builtBy: "Built by Davy.",
    },
};

export type Strings = typeof EN;

const ZH: Strings = {
    nav: {
      predictions: "預測",
      trackRecord: "往績對帳",
      methodology: "方法論",
      priceCheck: "賠率對照",
      toggle: "EN",
    },
    home: {
      h1: "開賽前發佈的比賽機率。",
      sub: "英超與英冠的統計預測，每一筆都在開賽前記錄到公開的 GitHub 檔案庫。",
      model: "模型",
      updated: "更新於",
      stats: [
        "第一輪已發佈 22 場預測",
        "回測 log loss 0.97，市場共識 0.95（4,061 場，樣本外）",
        "實戰計分自 2026 年 8 月 21 日開始",
      ],
      leagues: { "premier-league": "英超", championship: "英冠" },
      barsNote: "機率條由左至右代表主勝、和局、客勝。點進任一場查看完整拆解。",
      eduTitle: "這些百分比是什麼意思",
      edu: "58% 的意思是：在十場條件相近的比賽裡，這個結果預期出現大約六次。最高的百分比是我們的最佳估計，不是承諾。Oracle90 是數據科學專案，不提供投注建議。",
      h: "主",
      d: "和",
      a: "客",
    },
    match: {
      back: "所有預測",
      notFound: "這場比賽不在本輪名單中。",
      backToPredictions: "返回預測",
      fullTime: "全場賽果",
      home: "主勝",
      draw: "和局",
      away: "客勝",
      totalGoals: "總入球",
      over: "超過 2.5 球",
      under: "低於 2.5 球",
      preview: "賽前分析",
      aiGenerated: "AI 生成",
      provenance: "由語言模型根據本頁數字與歷史賽果撰寫。",
      publishedProof: "於開賽前發佈．模型",
      githubRecord: "查看 GitHub 紀錄",
      methodNote1: "機率來自市場錨定的統計合奏模型。產生與驗證方式見",
      methodNote2: "方法論",
      methodNote3: "。",
    },
    priceCheck: {
      cardTitle: "對照你手上的賠率",
      pageTitle: "賠率對照",
      pageIntro: "賠率是市場表達機率的語言。這個工具把你看到的價換算成隱含機率，再和 Oracle90 已發佈的估計並排對照。差距怎麼解讀，之後怎麼做，都是你自己的事。",
      outcomes: {
        home: "主勝",
        draw: "和局",
        away: "客勝",
        over: "大 2.5",
        under: "細 2.5",
      },
      formatDec: "十進",
      formatHk: "香港盤",
      inputPlaceholder: "你的賠率",
      expand: "對照整場五個價",
      collapse: "返回單一價",
      above: "高過公道價",
      near: "貼近公道價",
      below: "低過公道價",
      fairOdds: "公道價",
      ourEstimate: "Oracle90 估計",
      yourImplied: "你的價隱含",
      overroundLabel: "莊家水位：",
      updatedAt: "估計更新於",
      notFilled: "—",
      kickedOff: "此場已開賽。",
      selectLeague: "聯賽",
      selectMatch: "場次",
      disclaimer: "Oracle90 是數據科學項目，不提供投注建議。",
      privacy: "你在此輸入的內容不會被儲存或傳送。",
    },
    track: {
      title: "往績對帳",
      intro: "每一筆已發佈的機率都會對照最終賽果計分。事後絕不修改。",
      startsTitle: "對帳從 2026 年 8 月 21 日開始。",
      p1: "球季開打後，本頁會逐輪追蹤每一筆預測的命中情形、Brier 分數、log loss 與校準度，從第一個比賽週起算。",
      p2a: "每筆預測都在開賽前提交到公開的 GitHub 儲存庫，因此任何人都能獨立驗證這份紀錄。運作方式見",
      p2b: "方法論",
      p2c: "。",
    },
    method: {
      title: "方法論",
      intro: "Oracle90 發佈什麼、數字如何產生，以及你如何驗證我們不會在賽果揭曉後改寫任何內容。",
      sections: [
        {
          title: "我們發佈什麼",
          paras: [
            "每一場英超與英冠比賽，我們都發佈主勝、和局、客勝的機率，以及全場總入球超過或低於 2.5 球的機率。所有機率加總必為 100%。",
          ],
        },
        {
          title: "模型如何運作",
          paras: [
            "預測來自兩個部分組成的合奏模型。第一部分是統計模型，以球隊得分率、射正次數與實力評分為基礎，屬於 Dixon 與 Coles 一系的 Poisson 模型，結合 Elo 評分，以超過十年的歷史賽果訓練而成。自模型 v2 起，其中一條實力評分軌也會追蹤由過往比賽收盤賠率推算的市場評價，等於市場的部分判斷會進入模型本身；這一點從輸出看不出來，所以我們在此明講。",
            "第二部分是市場共識。博彩市場匯集了成千上萬參與者的判斷，是目前已知最強的公開足球賽果預測指標。我們發佈的機率把統計模型錨定在這個共識之上。這是業界的標準做法：例如 Opta 就公開表示過，其比賽預測以市場賠率作為輸入之一。",
            "我們公開披露混合比例。目前發佈的預測中，市場共識權重為 0.8，純統計模型為 0.2。權重改變時，版本編號會一併更新。",
          ],
        },
        {
          title: "為什麼錨定市場",
          paras: [
            "因為這樣才誠實。數十年的學術研究顯示，沒有任何公開模型能持續勝過收盤市場共識對比賽結果的預測。聲稱能做到的網站，不是僥倖就是說謊。錨定市場讓我們提供所能給出的最準確機率，而往績頁會如實展示這些機率的表現。",
          ],
        },
        {
          title: "已知限制",
          paras: [
            "球季開始的前幾週資料最少，模型在這段期間最不可靠。剛升班的球隊因為缺乏近年頂兩級聯賽的數據，不確定性也較高。",
            "統計模型不知道傷停、轉會、陣容輪換與教練變動；這些資訊只能透過市場共識錨定與市場評價軌，間接反映到預測中。",
            "機率描述的是長期頻率。單場比賽任何結果都可能發生，冷門出現不代表模型失效。請以往績頁的整體校準來評斷我們，而不是單一賽果。",
          ],
        },
        {
          title: "驗證機制",
          paras: [
            "每一筆預測都會在開賽前提交到公開的 GitHub 儲存庫。Git 提交的時間戳公開可查，任何人都能獨立驗證，而已發佈的預測永不修改或重寫。如果我們想在完場後偷偷修正一筆失準的預測，提交歷史會立刻拆穿。",
          ],
        },
        {
          title: "這不是什麼",
          paras: [
            "Oracle90 是一個數據科學專案。它不提供投注建議或任何下注相關的指引，永遠不會。機率描述的是各種結果的可能性；如何使用這些資訊完全是你自己的事。",
            "本站出現的 AI 生成賽前分析，一律標明為 AI 生成。",
          ],
        },
        ...(PRICE_CHECK_ENABLED
          ? [
              {
                title: "關於賠率對照工具",
                paras: [
                  "賠率對照工具把你輸入的價換算成隱含機率，並列出我們對同一結果已發佈的估計。徽章只描述兩個數字的關係：你的價高過、貼近或低過我們估計的公道價，僅此而已。",
                  "估計就是每個賽事頁上那個市場錨定預測。工具背後沒有另一個模型，你輸入的內容不會被儲存，也沒有任何推薦。差距重不重要、之後怎麼做，都是你自己的事。",
                ],
              },
            ]
          : []),
      ],
      repoLinkText: "公開的 GitHub 儲存庫",
    },
    footer: {
      logged1: "所有預測在開賽前公開記錄於 ",
      logged2: "GitHub",
      logged3: "，提交歷史就是證據。",
      disclaimer: "Oracle90 發佈統計預測，僅供資訊與教育用途，不提供投注建議。",
      builtBy: "由 Davy 打造。",
    },
};

const STRINGS: Record<Lang, Strings> = { en: EN, zh: ZH };

interface I18n {
  lang: Lang;
  s: Strings;
  setLang: (l: Lang) => void;
  locale: string;
}

const I18nContext = createContext<I18n | null>(null);

const STORAGE_KEY = "oracle90-lang";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Always start in English: pages are prerendered in English, so reading the
  // saved language during the first render would break hydration. The stored
  // preference is applied in the effect below, after hydration.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "zh") setLangState("zh");
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hant-TW" : "en";
  }, [lang]);

  return (
    <I18nContext.Provider
      value={{
        lang,
        s: STRINGS[lang],
        setLang,
        locale: lang === "zh" ? "zh-TW" : "en-GB",
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n outside I18nProvider");
  return ctx;
}
