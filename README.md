# ORACLE90

AI match probability forecasts for the Premier League and the Championship.

Every round, the model publishes win/draw/loss probabilities for every match
**before kickoff** — the commit history of this repository is the public,
tamper-evident record of that. After the matches, results are reconciled
automatically and the running calibration record is updated.

ORACLE90 publishes probabilities, not betting advice. No tips, no odds
recommendations, ever.

- [`METHODOLOGY.md`](METHODOLOGY.md) — how the numbers are produced,
  tested and published, in one readable page
- `web/` — the site and the published prediction record
- The model behind the numbers: a Dixon-Coles + Elo ensemble anchored to
  market consensus, fitted on 14 seasons of historical data. The engine runs
  privately; its method is documented on the site's methodology page, and
  every prediction it makes is logged publicly here before kickoff.

Launching for the 2026/27 season. Built by Davy.
