import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import {
  LEAGUES,
  kickoffDay,
  kickoffTime,
  matchSlug,
  pct,
  type LeagueData,
  type Match,
} from "../data";

function groupByDay(matches: Match[], locale: string): [string, Match[]][] {
  const groups = new Map<string, Match[]>();
  for (const m of matches) {
    const day = kickoffDay(m.kickoff, locale);
    const list = groups.get(day) ?? [];
    list.push(m);
    groups.set(day, list);
  }
  return [...groups.entries()];
}

function MatchRow({ league, match }: { league: LeagueData; match: Match }) {
  const { s } = useI18n();
  const { probs } = match;
  return (
    <Link
      to={`/match/${league.league}/${matchSlug(match)}`}
      className="group grid grid-cols-[3rem_1fr] items-center gap-x-4 gap-y-3 rounded-xl px-3 py-4 transition-colors hover:bg-surface sm:grid-cols-[3.5rem_1fr_15rem]"
    >
      <div className="font-mono text-sm text-muted">
        {kickoffTime(match.kickoff)}
      </div>
      <div className="min-w-0">
        <div className="truncate font-medium">{match.home}</div>
        <div className="truncate text-muted">{match.away}</div>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <div className="flex h-2 w-full overflow-hidden rounded-full">
          <div className="prob-seg bg-lime" style={{ width: pct(probs.home) }} />
          <div className="prob-seg bg-draw" style={{ width: pct(probs.draw) }} />
          <div className="prob-seg bg-away" style={{ width: pct(probs.away) }} />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-xs text-muted">
          <span>
            {s.home.h} {pct(probs.home)}
          </span>
          <span>
            {s.home.d} {pct(probs.draw)}
          </span>
          <span>
            {s.home.a} {pct(probs.away)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function Home() {
  const [active, setActive] = useState(0);
  const { s, locale } = useI18n();
  const league = LEAGUES[active];

  const updated = new Date(league.generated_at).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/London",
  });

  return (
    <div>
      <section className="pt-14 sm:pt-20">
        <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          {s.home.h1}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          {s.home.sub}
        </p>
        <p className="mt-5 font-mono text-xs text-muted">
          {s.home.model} {league.model_version} · {s.home.updated} {updated}
        </p>
        <ul className="mt-6 flex max-w-3xl flex-col gap-2 border-l-2 border-lime pl-4 text-sm text-muted sm:flex-row sm:gap-6 sm:border-l-0 sm:pl-0">
          {s.home.stats.map((line) => (
            <li
              key={line}
              className="sm:border-l-2 sm:border-lime sm:pl-3"
            >
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <div className="flex gap-2">
          {LEAGUES.map((l, i) => (
            <button
              key={l.league}
              onClick={() => setActive(i)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors active:scale-[0.98] ${
                i === active
                  ? "bg-lime text-bg"
                  : "bg-surface text-muted hover:text-text"
              }`}
            >
              {s.home.leagues[l.league as keyof typeof s.home.leagues] ??
                l.league_name}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {groupByDay(league.matches, locale).map(([day, matches]) => (
            <div key={day} className="mb-8">
              <h2 className="border-b border-line pb-2 font-display text-sm font-medium text-muted">
                {day}
              </h2>
              <div className="mt-1">
                {matches.map((m) => (
                  <MatchRow key={matchSlug(m)} league={league} match={m} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted">{s.home.barsNote}</p>
      </section>

      <section className="mt-12 max-w-2xl rounded-2xl bg-surface p-6">
        <h2 className="font-display text-sm font-medium text-text">
          {s.home.eduTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{s.home.edu}</p>
      </section>
    </div>
  );
}
