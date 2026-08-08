import { Link, useParams } from "react-router-dom";
import { findMatch, kickoffDay, kickoffTime, pct } from "../data";
import { ProbBar } from "../components/ProbBar";

export function MatchPage() {
  const { league = "", slug = "" } = useParams();
  const found = findMatch(league, slug);

  if (!found) {
    return (
      <div className="pt-20 text-center">
        <p className="text-muted">This match is not in the current round.</p>
        <Link
          to="/"
          className="mt-4 inline-block text-sm text-lime underline underline-offset-4"
        >
          Back to predictions
        </Link>
      </div>
    );
  }

  const { league: l, match } = found;
  const { ou25 } = match;

  return (
    <div className="pt-10 sm:pt-14">
      <Link
        to="/"
        className="text-sm text-muted transition-colors hover:text-text"
      >
        &larr; All predictions
      </Link>

      <div className="mt-6 max-w-2xl">
        <p className="text-sm text-muted">
          {l.league_name} · {kickoffDay(match.kickoff)},{" "}
          {kickoffTime(match.kickoff)}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {match.home}
          <span className="mx-3 text-muted">v</span>
          {match.away}
        </h1>
      </div>

      <div className="mt-8 max-w-2xl rounded-2xl bg-surface p-6 sm:p-8">
        <h2 className="font-display text-sm font-medium text-muted">
          Full-time result
        </h2>
        <div className="mt-4">
          <ProbBar probs={match.probs} labels />
        </div>
      </div>

      <div className="mt-4 max-w-2xl rounded-2xl bg-surface p-6 sm:p-8">
        <h2 className="font-display text-sm font-medium text-muted">
          Total goals
        </h2>
        <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full">
          <div className="prob-seg bg-lime" style={{ width: pct(ou25.over) }} />
          <div className="prob-seg bg-draw" style={{ width: pct(ou25.under) }} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs text-muted">Over 2.5 goals</div>
            <div className="mt-1 font-mono text-lg font-semibold">
              {pct(ou25.over)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted">Under 2.5 goals</div>
            <div className="mt-1 font-mono text-lg font-semibold">
              {pct(ou25.under)}
            </div>
          </div>
        </div>
      </div>

      {match.preview && (
        <div className="mt-4 max-w-2xl rounded-2xl bg-surface p-6 sm:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-sm font-medium text-muted">
              Match preview
            </h2>
            <span className="rounded-full bg-raised px-2.5 py-0.5 text-xs text-muted">
              AI-generated
            </span>
          </div>
          <p className="mt-4 leading-relaxed text-text/90">{match.preview}</p>
          <p className="mt-4 text-xs text-muted">
            Written by a language model from the numbers on this page and
            historical results only.
          </p>
        </div>
      )}

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
        Probabilities come from a market-anchored statistical ensemble. See the{" "}
        <Link
          to="/methodology"
          className="text-text underline decoration-line underline-offset-4 hover:decoration-lime"
        >
          methodology
        </Link>{" "}
        for how they are produced and verified.
      </p>
    </div>
  );
}
