import { Link, useParams } from "react-router-dom";
import { findMatch, kickoffDay, kickoffTime, pct } from "../data";
import { ProbBar } from "../components/ProbBar";
import { REPO_URL } from "../components/Layout";
import { useI18n } from "../i18n";
import { teamZh, zhClubNames } from "../teams-zh";

export function MatchPage() {
  const { league = "", slug = "" } = useParams();
  const { lang, s, locale } = useI18n();
  const found = findMatch(league, slug);

  if (!found) {
    return (
      <div className="pt-20 text-center">
        <p className="text-muted">{s.match.notFound}</p>
        <Link
          to="/"
          className="mt-4 inline-block text-sm text-lime underline underline-offset-4"
        >
          {s.match.backToPredictions}
        </Link>
      </div>
    );
  }

  const { league: l, match } = found;
  const { ou25 } = match;
  const leagueName =
    s.home.leagues[l.league as keyof typeof s.home.leagues] ?? l.league_name;
  const name = (n: string) => (lang === "zh" ? teamZh(n) : n);
  const rawPreview =
    lang === "zh" ? (match.preview_zh ?? match.preview) : match.preview;
  const previewText =
    lang === "zh" && rawPreview ? zhClubNames(rawPreview) : rawPreview;

  return (
    <div className="pt-10 sm:pt-14">
      <Link
        to="/"
        className="text-sm text-muted transition-colors hover:text-text"
      >
        &larr; {s.match.back}
      </Link>

      <div className="mt-6 max-w-2xl">
        <p className="text-sm text-muted">
          {leagueName} · {kickoffDay(match.kickoff, locale)},{" "}
          {kickoffTime(match.kickoff)}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {name(match.home)}
          <span className="mx-3 text-muted">v</span>
          {name(match.away)}
        </h1>
        <p className="mt-3 font-mono text-xs text-muted">
          {s.match.publishedProof} {l.model_version} ·{" "}
          <a
            href={`${REPO_URL}/commits/main/web/data/${l.league}.json`}
            target="_blank"
            rel="noreferrer"
            className="text-text underline decoration-line underline-offset-4 hover:decoration-lime"
          >
            {s.match.githubRecord} ↗
          </a>
        </p>
      </div>

      <div className="mt-8 max-w-2xl rounded-2xl bg-surface p-6 sm:p-8">
        <h2 className="font-display text-sm font-medium text-muted">
          {s.match.fullTime}
        </h2>
        <div className="mt-4">
          <ProbBar probs={match.probs} labels />
        </div>
      </div>

      <div className="mt-4 max-w-2xl rounded-2xl bg-surface p-6 sm:p-8">
        <h2 className="font-display text-sm font-medium text-muted">
          {s.match.totalGoals}
        </h2>
        <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full">
          <div className="prob-seg bg-lime" style={{ width: pct(ou25.over) }} />
          <div className="prob-seg bg-draw" style={{ width: pct(ou25.under) }} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs text-muted">{s.match.over}</div>
            <div className="mt-1 font-mono text-lg font-semibold">
              {pct(ou25.over)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted">{s.match.under}</div>
            <div className="mt-1 font-mono text-lg font-semibold">
              {pct(ou25.under)}
            </div>
          </div>
        </div>
      </div>

      {previewText && (
        <div className="mt-4 max-w-2xl rounded-2xl bg-surface p-6 sm:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-sm font-medium text-muted">
              {s.match.preview}
            </h2>
            <span className="rounded-full bg-raised px-2.5 py-0.5 text-xs text-muted">
              {s.match.aiGenerated}
            </span>
          </div>
          <p className="mt-4 leading-relaxed text-text/90">{previewText}</p>
          <p className="mt-4 text-xs text-muted">{s.match.provenance}</p>
        </div>
      )}

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
        {s.match.methodNote1}
        <Link
          to="/methodology"
          className="text-text underline decoration-line underline-offset-4 hover:decoration-lime"
        >
          {s.match.methodNote2}
        </Link>
        {s.match.methodNote3}
      </p>
    </div>
  );
}
