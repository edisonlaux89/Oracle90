import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import { teamZh } from "../teams-zh";
import {
  featuredPicks,
  kickoffTime,
  matchSlug,
  pct,
  type FeaturedPick,
  type PickTier,
} from "../data";

const TIERS: PickTier[] = ["consensus", "tossup"];

function Card({ league, match, pick }: FeaturedPick) {
  const { lang, s } = useI18n();
  const f = s.home.featured;
  const name = (n: string) => (lang === "zh" ? teamZh(n) : n);
  const { probs, market_probs: market } = match;
  const side = pick.side;
  const ours = side ? probs[side] : null;
  const theirs = side && market ? market[side] : null;
  const sideLabel = side
    ? { home: s.match.home, draw: s.match.draw, away: s.match.away }[side]
    : null;
  // gap is shown as context on our own number, never as a signal to act on
  const gap = ours !== null && theirs !== null ? (ours - theirs) * 100 : null;

  return (
    <Link
      to={`/match/${league.league}/${matchSlug(match)}`}
      className="flex flex-col gap-3 rounded-2xl bg-surface p-5 transition-colors hover:bg-line/40"
    >
      <div className="flex items-baseline justify-between gap-3 font-mono text-xs text-muted">
        <span>
          {s.home.leagues[league.league as keyof typeof s.home.leagues] ??
            league.league_name}
        </span>
        <span>{kickoffTime(match.kickoff)}</span>
      </div>

      <div className="min-w-0">
        <div className="truncate font-medium">{name(match.home)}</div>
        <div className="truncate text-muted">{name(match.away)}</div>
      </div>

      <div className="flex h-2 w-full overflow-hidden rounded-full">
        <div className="prob-seg bg-lime" style={{ width: pct(probs.home) }} />
        <div className="prob-seg bg-draw" style={{ width: pct(probs.draw) }} />
        <div className="prob-seg bg-away" style={{ width: pct(probs.away) }} />
      </div>

      <div className="mt-auto border-t border-line pt-3 font-mono text-xs">
        {side && ours !== null ? (
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-muted">{f.pickLabel}</span>
            <span className="font-medium text-text">
              {sideLabel} {pct(ours)}
            </span>
            {theirs !== null && (
              <span className="text-muted">
                {f.marketSays} {pct(theirs)}
                {gap !== null && (
                  <span className="ml-1">
                    ({gap >= 0 ? "+" : ""}
                    {gap.toFixed(1)}pp)
                  </span>
                )}
              </span>
            )}
          </div>
        ) : (
          <span className="text-muted">
            {f.noPick} · {pct(probs.home)} / {pct(probs.draw)} /{" "}
            {pct(probs.away)}
          </span>
        )}
      </div>
    </Link>
  );
}

export function Featured() {
  const { s } = useI18n();
  const f = s.home.featured;
  const picks = featuredPicks();

  return (
    <section className="mt-12">
      <h2 className="font-display text-lg font-semibold tracking-tight">
        {f.title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        {f.sub}
      </p>

      {picks.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-surface p-5 text-sm text-muted">
          {f.empty}
        </p>
      ) : (
        TIERS.map((tier) => {
          const group = picks.filter((p) => p.pick.tier === tier);
          if (group.length === 0) return null;
          return (
            <div key={tier} className="mt-8">
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    tier === "consensus"
                      ? "bg-lime text-bg"
                      : "bg-line text-text"
                  }`}
                >
                  {f[tier]}
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                {tier === "consensus" ? f.consensusNote : f.tossupNote}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((p) => (
                  <Card key={`${p.league.league}-${matchSlug(p.match)}`} {...p} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}
