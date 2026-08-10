// Per-route SEO metadata and JSON-LD, generated from the published prediction
// JSON. Consumed at build time by scripts/prerender.mjs (via the SSR bundle)
// and by scripts/gen-seo-assets.mjs. Nothing here runs in the browser.
import { LEAGUES, matchSlug, type LeagueData, type Match } from "./data";
import { PRICE_CHECK_ENABLED } from "./config";

export const SITE_URL = "https://oracle90.com";
export const SITE_NAME = "Oracle90";
export const REPO_URL_PUBLIC = "https://github.com/edisonlaux89/Oracle90";
export const OG_IMAGE = `${SITE_URL}/og.png`;

const SITE_TAGLINE =
  "Statistical football forecasts for the Premier League and Championship, published before kickoff and logged publicly on GitHub.";

export interface RouteSeo {
  /** Route path as the router sees it, e.g. "/match/premier-league/arsenal-v-coventry-city". */
  path: string;
  /** Output file relative to dist, e.g. "match/premier-league/arsenal-v-coventry-city.html". */
  file: string;
  title: string;
  description: string;
  canonical: string;
  /** ISO date used for sitemap lastmod. */
  lastmod: string;
  /** JSON-LD blocks injected into <head> of the prerendered page. */
  jsonLd: unknown[];
}

function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  });
}

function pctInt(p: number): string {
  return `${Math.round(p * 100)}%`;
}

function siteGraph(): unknown {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: SITE_TAGLINE,
        inLanguage: "en-GB",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: SITE_TAGLINE,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/icon-512.png`,
          width: 512,
          height: 512,
        },
        sameAs: [REPO_URL_PUBLIC],
      },
    ],
  };
}

function sportsEvent(league: LeagueData, match: Match, canonical: string): unknown {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "@id": `${canonical}#event`,
    name: `${match.home} vs ${match.away}`,
    url: canonical,
    startDate: match.kickoff,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    sport: "Association football",
    homeTeam: { "@type": "SportsTeam", name: match.home },
    awayTeam: { "@type": "SportsTeam", name: match.away },
    competitor: [
      { "@type": "SportsTeam", name: match.home },
      { "@type": "SportsTeam", name: match.away },
    ],
    superEvent: {
      "@type": "SportsEvent",
      name: `${league.league_name} ${league.season}`,
      startDate: league.matches[0]?.kickoff ?? match.kickoff,
    },
    description: `Oracle90 statistical forecast: ${match.home} ${pctInt(
      match.probs.home,
    )}, draw ${pctInt(match.probs.draw)}, ${match.away} ${pctInt(
      match.probs.away,
    )}. Published before kickoff.`,
  };
}

/**
 * Methodology Q&A. Every answer is a faithful restatement of the disclosure
 * already published on /methodology (see src/i18n.tsx, method.sections).
 * Do not add claims here that the page itself does not make.
 */
export const FAQ: { q: string; a: string }[] = [
  {
    q: "What does Oracle90 publish?",
    a: "For every Premier League and Championship match, Oracle90 publishes the probability of a home win, a draw and an away win, plus the probability of the match producing over or under 2.5 total goals. The three result probabilities always sum to 100%.",
  },
  {
    q: "How does the Oracle90 model work?",
    a: "The forecasts come from an ensemble of two parts. The first is a statistical model built on team scoring rates, shots on target and strength ratings, in the family of Dixon and Coles style Poisson models combined with Elo ratings, trained on more than a decade of historical results. Since model v2, one of its rating tracks also follows market-implied team strength derived from the closing odds of past matches, so part of the market's judgement enters the model itself. The second part is the market consensus, which the published probabilities are anchored to.",
  },
  {
    q: "How much weight does the market consensus carry?",
    a: "The blend is disclosed openly. The current published forecasts weight the market consensus at 0.80 and the pure statistical model at 0.20. When the weighting changes, the model version number changes with it.",
  },
  {
    q: "How can the published forecasts be verified?",
    a: "Every forecast is committed to a public GitHub repository before kickoff. Git commit timestamps are public and independently checkable, and published predictions are never amended or rewritten, so a quiet correction after full time would show up in the commit history.",
  },
  {
    q: "Does Oracle90 offer betting advice?",
    a: "No. Oracle90 is a data science research project. It does not offer betting advice, tips or staking suggestions, and it never will. The probabilities describe how likely outcomes are; what anyone does with that information is entirely their own business. AI-generated match previews on the site are labelled as AI-generated.",
  },
];

function faqPage(canonical: string): unknown {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${canonical}#faq`,
    url: canonical,
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Newest generated_at across the published leagues, used as a site-wide lastmod. */
export function latestGeneratedAt(): string {
  return LEAGUES.map((l) => l.generated_at).sort().slice(-1)[0]!;
}

export function matchPath(league: LeagueData, match: Match): string {
  return `/match/${league.league}/${matchSlug(match)}`;
}

export function matchTitle(league: LeagueData, match: Match): string {
  return `${match.home} vs ${match.away} Prediction: ${
    league.league_name
  }, ${longDate(match.kickoff)}`;
}

export function matchDescription(league: LeagueData, match: Match): string {
  return `${match.home} ${pctInt(match.probs.home)}, draw ${pctInt(
    match.probs.draw,
  )}, ${match.away} ${pctInt(match.probs.away)}. Oracle90's statistical forecast for this ${
    league.league_name
  } match, published before kickoff.`;
}

/** Every route the build prerenders, in sitemap order. */
export function allRoutes(): RouteSeo[] {
  const updated = latestGeneratedAt();
  const routes: RouteSeo[] = [
    {
      path: "/",
      file: "index.html",
      title: "Oracle90 · Football match probabilities, published before kickoff",
      description: SITE_TAGLINE,
      canonical: `${SITE_URL}/`,
      lastmod: updated,
      jsonLd: [siteGraph()],
    },
    {
      path: "/methodology",
      file: "methodology.html",
      title: "Methodology · How Oracle90 produces its football forecasts",
      description:
        "How Oracle90's match probabilities are produced, how the market consensus anchor works at weight 0.80, the model's known limitations, and how anyone can verify the record on GitHub.",
      canonical: `${SITE_URL}/methodology`,
      lastmod: updated,
      jsonLd: [siteGraph(), faqPage(`${SITE_URL}/methodology`)],
    },
    {
      path: "/track-record",
      file: "track-record.html",
      title: "Track record · Every Oracle90 forecast scored against the result",
      description:
        "Every published Oracle90 probability is scored against the final result, with accuracy, Brier score, log loss and calibration reported round by round from 21 August 2026.",
      canonical: `${SITE_URL}/track-record`,
      lastmod: updated,
      jsonLd: [siteGraph()],
    },
  ];

  if (PRICE_CHECK_ENABLED) {
    routes.push({
      path: "/price-check",
      file: "price-check.html",
      title: "Price check · Compare any odds with Oracle90's probabilities",
      description:
        "Enter the odds you can see for a Premier League or Championship match and compare them with Oracle90's published probabilities.",
      canonical: `${SITE_URL}/price-check`,
      lastmod: updated,
      jsonLd: [siteGraph()],
    });
  }

  for (const league of LEAGUES) {
    for (const match of league.matches) {
      const path = matchPath(league, match);
      const canonical = `${SITE_URL}${path}`;
      routes.push({
        path,
        file: `${path.slice(1)}.html`,
        title: matchTitle(league, match),
        description: matchDescription(league, match),
        canonical,
        lastmod: league.generated_at,
        jsonLd: [siteGraph(), sportsEvent(league, match, canonical)],
      });
    }
  }

  return routes;
}
