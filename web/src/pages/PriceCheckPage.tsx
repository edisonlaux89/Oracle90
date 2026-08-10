import { useState } from "react";
import { LEAGUES, kickoffDay, kickoffTime, matchSlug } from "../data";
import { PriceCheck } from "../components/PriceCheck";
import { useI18n } from "../i18n";
import { teamZh } from "../teams-zh";

export function PriceCheckPage() {
  const { lang, s, locale } = useI18n();
  const t = s.priceCheck;
  const [leagueSlug, setLeagueSlug] = useState(LEAGUES[0].league);
  const league = LEAGUES.find((l) => l.league === leagueSlug) ?? LEAGUES[0];
  const [slug, setSlug] = useState(
    league.matches[0] ? matchSlug(league.matches[0]) : "",
  );
  const match =
    league.matches.find((m) => matchSlug(m) === slug) ?? league.matches[0];
  const name = (n: string) => (lang === "zh" ? teamZh(n) : n);

  const selectClass =
    "min-h-11 w-full rounded-xl border border-line bg-raised px-3 text-base text-text outline-none focus:border-lime";

  return (
    <div className="pt-10 sm:pt-14">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {t.pageTitle}
        </h1>
        <p className="mt-3 leading-relaxed text-muted">{t.pageIntro}</p>
      </div>

      {match && (
        <div className="mt-8 max-w-2xl rounded-2xl bg-surface p-6 sm:p-8">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs text-muted">{t.selectLeague}</span>
              <select
                value={leagueSlug}
                onChange={(e) => {
                  const next =
                    LEAGUES.find((l) => l.league === e.target.value) ??
                    LEAGUES[0];
                  setLeagueSlug(next.league);
                  setSlug(next.matches[0] ? matchSlug(next.matches[0]) : "");
                }}
                className={`mt-1 ${selectClass}`}
              >
                {LEAGUES.map((l) => (
                  <option key={l.league} value={l.league}>
                    {s.home.leagues[l.league as keyof typeof s.home.leagues] ??
                      l.league_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-muted">{t.selectMatch}</span>
              <select
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={`mt-1 ${selectClass}`}
              >
                {league.matches.map((m) => (
                  <option key={matchSlug(m)} value={matchSlug(m)}>
                    {name(m.home)} v {name(m.away)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="mt-3 text-sm text-muted">
            {kickoffDay(match.kickoff, locale)}, {kickoffTime(match.kickoff)}
          </p>
          <PriceCheck match={match} />
        </div>
      )}
    </div>
  );
}
