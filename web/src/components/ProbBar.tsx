import type { MatchProbs } from "../data";
import { pct } from "../data";

interface ProbBarProps {
  probs: MatchProbs;
  labels?: boolean;
}

export function ProbBar({ probs, labels = false }: ProbBarProps) {
  const segs = [
    { key: "home", value: probs.home, color: "bg-lime", label: "Home" },
    { key: "draw", value: probs.draw, color: "bg-draw", label: "Draw" },
    { key: "away", value: probs.away, color: "bg-away", label: "Away" },
  ];
  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full">
        {segs.map((s) => (
          <div
            key={s.key}
            className={`prob-seg ${s.color}`}
            style={{ width: `${s.value * 100}%` }}
          />
        ))}
      </div>
      {labels && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {segs.map((s) => (
            <div key={s.key}>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${s.color}`}
                  aria-hidden
                />
                {s.label}
              </div>
              <div className="mt-1 font-mono text-lg font-semibold">
                {pct(s.value)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
