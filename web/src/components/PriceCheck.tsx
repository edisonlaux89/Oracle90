import { useState } from "react";
import type { Match } from "../data";
import { useI18n } from "../i18n";
import {
  convertOddsInput,
  edge,
  fairOdds,
  fromDecimal,
  impliedProb,
  overround,
  parseOdds,
  verdict,
  type OddsFormat,
  type Verdict,
} from "../lib/odds";

type Outcome = "home" | "draw" | "away" | "over" | "under";
const OUTCOMES: Outcome[] = ["home", "draw", "away", "over", "under"];
const X12: Outcome[] = ["home", "draw", "away"];

function outcomeProb(match: Match, o: Outcome): number {
  if (o === "over") return match.ou25.over;
  if (o === "under") return match.ou25.under;
  return match.probs[o];
}

function badgeClass(v: Verdict): string {
  if (v === "above") return "bg-lime text-bg";
  if (v === "below") return "bg-danger text-danger-fg";
  return "bg-raised text-muted";
}

function fmtOdds(dec: number, format: OddsFormat): string {
  return fromDecimal(dec, format).toFixed(2);
}

function fmtPts(e: number): string {
  const pts = e * 100;
  return `${pts >= 0 ? "+" : ""}${pts.toFixed(1)}%`;
}

export function PriceCheck({ match }: { match: Match }) {
  const { s } = useI18n();
  const t = s.priceCheck;
  const [format, setFormat] = useState<OddsFormat>("dec");
  const [expanded, setExpanded] = useState(false);
  const [focusOutcome, setFocusOutcome] = useState<Outcome>("home");
  const [inputs, setInputs] = useState<Record<Outcome, string>>({
    home: "",
    draw: "",
    away: "",
    over: "",
    under: "",
  });

  const kickedOff = new Date(match.kickoff).getTime() <= Date.now();

  function setInput(o: Outcome, raw: string) {
    setInputs((prev) => ({ ...prev, [o]: raw }));
  }

  function switchFormat(next: OddsFormat) {
    if (next === format) return;
    // Re-express already-entered prices in the new format.
    setInputs((prev) => {
      const converted = { ...prev };
      for (const o of OUTCOMES) {
        converted[o] = convertOddsInput(prev[o], format, next);
      }
      return converted;
    });
    setFormat(next);
  }

  function verdictBadge(o: Outcome) {
    const dec = parseOdds(inputs[o], format);
    if (dec === null) return null;
    const p = outcomeProb(match, o);
    const v = verdict(p, dec);
    const arrow = v === "above" ? "↑" : v === "below" ? "↓" : "≈";
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold ${badgeClass(v)}`}
      >
        {arrow} {t[v]} {fmtPts(edge(p, dec))}
      </span>
    );
  }

  function detailRows(o: Outcome) {
    const dec = parseOdds(inputs[o], format);
    if (dec === null) return null;
    const p = outcomeProb(match, o);
    return (
      <dl className="mt-3 space-y-1 font-mono text-xs text-muted">
        <div className="flex justify-between">
          <dt>{t.fairOdds}</dt>
          <dd className="text-text">{fmtOdds(fairOdds(p), format)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>{t.ourEstimate}</dt>
          <dd className="text-text">{(p * 100).toFixed(1)}%</dd>
        </div>
        <div className="flex justify-between">
          <dt>{t.yourImplied}</dt>
          <dd className="text-text">{(impliedProb(dec) * 100).toFixed(1)}%</dd>
        </div>
      </dl>
    );
  }

  const x12Decs = X12.map((o) => parseOdds(inputs[o], format));
  const margin = x12Decs.every((d): d is number => d !== null)
    ? overround(x12Decs)
    : null;

  const formatToggle = (
    <div className="flex shrink-0 overflow-hidden rounded-full bg-raised text-xs">
      {(["dec", "hk"] as OddsFormat[]).map((f) => (
        <button
          key={f}
          onClick={() => switchFormat(f)}
          aria-pressed={format === f}
          className={`min-h-11 px-3 font-medium transition-colors ${
            format === f ? "bg-lime text-bg" : "text-muted hover:text-text"
          }`}
        >
          {f === "dec" ? t.formatDec : t.formatHk}
        </button>
      ))}
    </div>
  );

  if (kickedOff) {
    return <p className="mt-4 text-sm text-muted">{t.kickedOff}</p>;
  }

  return (
    <div className="mt-4">
      {!expanded ? (
        <>
          <div className="flex flex-wrap gap-2">
            {OUTCOMES.map((o) => (
              <button
                key={o}
                onClick={() => setFocusOutcome(o)}
                aria-pressed={focusOutcome === o}
                className={`min-h-11 rounded-full px-3.5 text-xs font-medium transition-colors ${
                  focusOutcome === o
                    ? "bg-lime text-bg"
                    : "bg-raised text-muted hover:text-text"
                }`}
              >
                {t.outcomes[o]}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              inputMode="decimal"
              placeholder={t.inputPlaceholder}
              aria-label={t.inputPlaceholder}
              value={inputs[focusOutcome]}
              onChange={(e) => setInput(focusOutcome, e.target.value)}
              className="min-h-11 w-full rounded-xl border border-line bg-raised px-4 font-mono text-lg font-semibold text-text outline-none focus:border-lime"
            />
            {formatToggle}
          </div>
          <div className="mt-3 min-h-6" aria-live="polite">
            {verdictBadge(focusOutcome)}
          </div>
          {detailRows(focusOutcome)}
        </>
      ) : (
        <>
          <div className="mb-3 flex justify-end">{formatToggle}</div>
          <div className="space-y-2">
            {OUTCOMES.map((o) => (
              <div key={o} className="flex flex-wrap items-center gap-2">
                <span className="w-16 shrink-0 text-xs text-muted">
                  {t.outcomes[o]}
                </span>
                <input
                  inputMode="decimal"
                  placeholder={t.notFilled}
                  aria-label={t.outcomes[o]}
                  value={inputs[o]}
                  onChange={(e) => setInput(o, e.target.value)}
                  className="min-h-11 w-24 rounded-xl border border-line bg-raised px-3 font-mono text-base font-semibold text-text outline-none focus:border-lime"
                />
                {verdictBadge(o)}
              </div>
            ))}
          </div>
          {margin !== null && (
            <p className="mt-3 font-mono text-xs text-muted">
              {t.overroundLabel}{(margin * 100).toFixed(1)}%
            </p>
          )}
        </>
      )}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-4 min-h-11 text-xs text-muted underline decoration-line underline-offset-4 transition-colors hover:text-text"
      >
        {expanded ? t.collapse : t.expand}
      </button>
      <p className="mt-3 text-xs text-muted">
        {t.disclaimer} {t.privacy}
      </p>
    </div>
  );
}
