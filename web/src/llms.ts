// llms.txt generator. Built from the published prediction JSON at build time
// so the file can never drift from what the site shows.
import { LEAGUES, matchSlug } from "./data";
import { FAQ, SITE_URL, REPO_URL_PUBLIC, latestGeneratedAt } from "./seo";

function pctInt(p: number): string {
  return `${Math.round(p * 100)}%`;
}

function stamp(iso: string): string {
  return new Date(iso).toISOString().replace(".000", "");
}

function kickoffLabel(iso: string): string {
  const d = new Date(iso);
  const day = d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/London",
  });
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  });
  return `${day} ${time} UK`;
}

export function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push("# Oracle90");
  lines.push("");
  lines.push(
    "> Oracle90 publishes statistical football forecasts for the Premier League and the Championship. Every prediction is logged publicly on GitHub before kickoff, so the record can be checked independently.",
  );
  lines.push("");
  lines.push("This is data science research, not betting advice.");
  lines.push("");
  lines.push(`Site: ${SITE_URL}/`);
  lines.push(`Public prediction record: ${REPO_URL_PUBLIC}`);
  lines.push(`Last updated: ${stamp(latestGeneratedAt())}`);
  lines.push("");

  lines.push("## What the numbers mean");
  lines.push("");
  lines.push(
    "Each match carries the probability of a home win, a draw and an away win, plus the probability of over or under 2.5 total goals. The three result probabilities sum to 100%. A 58% figure means that in ten matches with similar conditions the outcome is expected about six times; the highest percentage is a best estimate, not a promise.",
  );
  lines.push("");

  for (const league of LEAGUES) {
    lines.push(`## ${league.league_name} ${league.season} forecasts`);
    lines.push("");
    lines.push(
      `Model ${league.model_version}, market anchor weight ${league.anchor_weight}, generated ${stamp(
        league.generated_at,
      )}. ${league.matches.length} matches.`,
    );
    lines.push("");
    for (const m of league.matches) {
      const url = `${SITE_URL}/match/${league.league}/${matchSlug(m)}`;
      lines.push(
        `- [${m.home} vs ${m.away}](${url}): ${kickoffLabel(m.kickoff)}. ` +
          `Home ${pctInt(m.probs.home)}, draw ${pctInt(m.probs.draw)}, away ${pctInt(
            m.probs.away,
          )}. ` +
          `Over 2.5 goals ${pctInt(m.ou25.over)}, under ${pctInt(m.ou25.under)}.`,
      );
    }
    lines.push("");
  }

  lines.push("## Methodology summary");
  lines.push("");
  for (const item of FAQ) {
    lines.push(`### ${item.q}`);
    lines.push("");
    lines.push(item.a);
    lines.push("");
  }

  lines.push("## Pages");
  lines.push("");
  lines.push(`- [Predictions](${SITE_URL}/): the current round for both leagues.`);
  lines.push(
    `- [Methodology](${SITE_URL}/methodology): how the forecasts are produced, disclosed limitations, and how to verify the record.`,
  );
  lines.push(
    `- [Track record](${SITE_URL}/track-record): published forecasts scored against final results, from 21 August 2026.`,
  );
  lines.push("");

  lines.push("## Terms of citation");
  lines.push("");
  lines.push(
    "Oracle90 forecasts may be quoted with attribution to Oracle90 and a link to the match page. Quote the probabilities as published; do not present them as betting advice, tips or staking guidance, because they are none of those things.",
  );
  lines.push("");

  return lines.join("\n");
}
