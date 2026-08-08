import type { MatchProbs } from "../data";
import { pct } from "../data";
import { useI18n } from "../i18n";

interface ProbBarProps {
  probs: MatchProbs;
  labels?: boolean;
}

export function ProbBar({ probs, labels = false }: ProbBarProps) {
  const { s } = useI18n();
  const segs = [
    { key: "home", value: probs.home, color: "bg-lime", label: s.match.home },
    { key: "draw", value: probs.draw, color: "bg-draw", label: s.match.draw },
    { key: "away", value: probs.away, color: "bg-away", label: s.match.away },
  ];
  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full">
        {segs.map((seg) => (
          <div
            key={seg.key}
            className={`prob-seg ${seg.color}`}
            style={{ width: `${seg.value * 100}%` }}
          />
        ))}
      </div>
      {labels && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {segs.map((seg) => (
            <div key={seg.key}>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${seg.color}`}
                  aria-hidden
                />
                {seg.label}
              </div>
              <div className="mt-1 font-mono text-lg font-semibold">
                {pct(seg.value)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
