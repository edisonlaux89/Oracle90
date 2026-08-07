# Oracle90

AI match probability forecasts for the Premier League and Championship.
Public repo: `web/` (site + published prediction JSON, deployed by Vercel from
this directory). The model + data pipeline live in the separate **private**
repo `oracle90-engine` (split 2026-08-07); prediction JSON is generated there
and committed here before kickoff.

## 🔒 SECURITY IRON RULE — THIS REPO IS PUBLIC / 開源安全鐵律

**This repository is open source. Absolutely NO secrets may ever enter it,
including commit history.** Mandated by Edison on 2026-08-07. Non-negotiable.

Forbidden in any file, comment, doc, or commit message:

- API keys, tokens, passwords, credentials of any kind
- `config.json`, `.env`, or any file holding runtime secrets (gitignored; keys
  live only on the data box, outside the repo)
- Infrastructure/ops details: internal hostnames, LAN or tailnet IP addresses,
  data-box file paths, SSH details, remote-access setup

Enforcement (all three, always):

1. This rule, read at every session start.
2. `.gitignore` blocks secret-shaped files — never weaken those patterns.
3. Pre-commit secret scan: run `git config core.hooksPath .githooks` once per
   clone (verify with `git config core.hooksPath`). Never commit with
   `--no-verify`.

If you spot a suspected leak (staged, committed, or already pushed): **stop
immediately and report to Edison** — do not attempt history rewrites on your
own.

## Conventions

- Predictions are published to `web/` BEFORE kickoff; the public commit
  history is the tamper-evidence mechanism. Never amend or rewrite published
  prediction commits.
- Editorial line: data science only. Never output betting advice, tips, odds
  recommendations, or staking language anywhere in this repo or its site copy.
- AI-generated match previews must be labelled as AI-generated on the site.
- Internal model-track/CLV data stays on the data box; it is not committed.
- Engine code never returns to this repo — model changes go to the private
  `oracle90-engine` repo. The methodology page discloses the method honestly;
  the code itself stays private.
- Code and technical content in English. Verification before commit: run the
  checks defined in `web/README.md` as they land.

## Context

- Strategy source of truth: rivermap-hub
  `docs/superpowers/specs/2026-08-05-football-model-design.md` §10 (not in
  this repo — it is private).
- Command line: HQ `/footy` session in rivermap-hub. This repo executes.
