import premierLeague from "../data/premier-league.json";
import championship from "../data/championship.json";

export interface MatchProbs {
  home: number;
  draw: number;
  away: number;
}

export interface Match {
  kickoff: string;
  home: string;
  away: string;
  probs: MatchProbs;
  market_anchored: boolean;
  model_backed: boolean;
  ou25: { over: number; under: number };
}

export interface LeagueData {
  league: string;
  league_name: string;
  season: string;
  generated_at: string;
  model_version: string;
  anchor_weight: number;
  matches: Match[];
}

export const LEAGUES: LeagueData[] = [
  premierLeague as LeagueData,
  championship as LeagueData,
];

export function leagueBySlug(slug: string): LeagueData | undefined {
  return LEAGUES.find((l) => l.league === slug);
}

export function matchSlug(m: Match): string {
  const s = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `${s(m.home)}-v-${s(m.away)}`;
}

export function findMatch(
  league: string,
  slug: string,
): { league: LeagueData; match: Match } | undefined {
  const l = leagueBySlug(league);
  if (!l) return undefined;
  const match = l.matches.find((m) => matchSlug(m) === slug);
  return match ? { league: l, match } : undefined;
}

export function kickoffDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/London",
  });
}

export function kickoffTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  });
}

export function pct(p: number): string {
  return `${Math.round(p * 100)}%`;
}
