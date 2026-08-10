// Pure odds maths for the price check widget. No UI, no side effects.

export type OddsFormat = "dec" | "hk";
export type Verdict = "above" | "near" | "below";

/** Implied-probability gap (in probability points) treated as "near fair". */
export const NEAR_THRESHOLD = 0.02;
/** Decimal odds must be strictly greater than this to be accepted. */
export const ODDS_FLOOR = 1.01;

export function toDecimal(value: number, format: OddsFormat): number {
  return format === "hk" ? value + 1 : value;
}

export function fromDecimal(dec: number, format: OddsFormat): number {
  return format === "hk" ? dec - 1 : dec;
}

/** Parse user input in the given format; returns decimal odds or null. */
export function parseOdds(raw: string, format: OddsFormat): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  if (!/^\d*\.?\d+$/.test(trimmed)) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return null;
  const dec = toDecimal(n, format);
  return dec > ODDS_FLOOR ? dec : null;
}

export function impliedProb(dec: number): number {
  return 1 / dec;
}

// Callers guarantee valid inputs (prob/decs strictly positive); no zero/empty guards by design.
export function fairOdds(prob: number): number {
  return 1 / prob;
}

/**
 * Positive edge = the price implies a lower probability than our estimate,
 * i.e. the price pays above our fair odds.
 */
export function edge(modelProb: number, dec: number): number {
  return modelProb - impliedProb(dec);
}

/**
 * Comparisons against the threshold are exclusive: an edge exactly at
 * ±threshold counts as "near", not "above" or "below".
 */
export function verdict(
  modelProb: number,
  dec: number,
  threshold: number = NEAR_THRESHOLD,
): Verdict {
  const e = edge(modelProb, dec);
  if (e > threshold) return "above";
  if (e < -threshold) return "below";
  return "near";
}

/** Book margin of a full outcome set, e.g. 1X2. 0.045 = 4.5% overround. */
// Callers guarantee valid inputs (each price strictly positive); no zero/empty guards by design.
export function overround(decs: number[]): number {
  return decs.reduce((sum, d) => sum + 1 / d, 0) - 1;
}
