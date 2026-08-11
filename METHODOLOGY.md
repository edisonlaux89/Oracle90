# How Oracle90 works

Oracle90 publishes statistical match probabilities for the Premier League
and the Championship at [oracle90.com](https://www.oracle90.com). This
repository is the public record: the site source lives in `web/`, and every
published forecast is committed to `web/data/` before kickoff, so the git
history is the tamper-evident proof of what was predicted and when. The
model engine itself runs privately; this document explains, at method
level, how the numbers are produced, tested and published.

Oracle90 is a data science project. It does not offer betting advice, and
nothing on the site or in this repository is a recommendation to do
anything. The probabilities describe how likely outcomes are; what anyone
does with that information is entirely their own business.

## 1. Where the probabilities come from

Two ingredients are blended for every match.

**The market consensus.** A collector records 1X2 and total-goals odds
from many bookmakers on a schedule that tightens as kickoff approaches,
ending with a final pre-kickoff snapshot. Quoted odds overstate every
outcome because they include the bookmaker's margin (the overround: the
implied probabilities of all outcomes sum to more than 100%). Removing
that margin and combining the books recovers the market's consensus
probability for each outcome. Decades of research say this consensus is
the strongest known public predictor of football results.

**A statistical model.** A Poisson scoring model in the Dixon and Coles
family, combined with Elo-style strength ratings built from over a decade
of results and shots on target. Since model v2 one of its rating tracks
also follows market-implied team strength derived from the closing odds
of past matches, so part of the market's judgement enters the model
itself.

The published probability anchors the statistical model to the market
consensus at a disclosed weight (currently 0.80 market, 0.20 model). When
the blend changes, the model version number changes with it.

## 2. How changes to the model are tested

Every proposed improvement sits an exam before it ships: a walk-forward
evaluation over 14 seasons of English league history, scoring 4,061
out-of-sample matches from 2015 onwards. The model is refitted week by
week exactly as it would have been at the time, with no future
information available at any step, and is scored on proper scoring rules
(log loss) against the market benchmark. A change is kept only if it
genuinely improves out-of-sample performance; changes that fail the exam
are discarded and documented.

## 3. How forecasts are published and verified

- Forecasts are recomputed **daily at 03:00 UK time** from the latest
  recorded odds, and the site rebuilds automatically. Each match page
  shows when its estimate was last updated.
- The daily run also rewrites each match's short analysis note from that
  day's figures. Notes are AI-written from the published numbers and
  recorded facts only, are labelled as AI-generated, and pass an
  automated gate that rejects any note quoting a percentage that does
  not equal a published value.
- A forecast may keep updating up to kickoff as the market moves. Once a
  match kicks off, its final pre-kickoff forecast is frozen. That
  version, and only that version, is scored on the track record page.
- Every update is a git commit in this repository. The timestamps are
  public and independently checkable, and nothing is amended or
  rewritten after kickoff; a quiet correction after full time would be
  visible in the history.

## 4. The price check tool

The site includes a small calculator. You enter the odds you can see for
a match; it converts them into the probability they imply, and puts that
next to Oracle90's published estimate for the same outcome, including
the fair odds of that estimate and, when you enter a full set of 1X2
prices, the bookmaker's margin. The badge describes the relationship
between the two numbers and nothing more: your price sits above, near or
below the fair odds of our estimate. The tool involves no extra model,
stores nothing you type, and makes no recommendation.

## Reading this repository

- `web/data/*.json` — the published forecasts for the current round,
  one file per league, updated by the daily run.
- `web/data/archive/` — frozen per-round snapshots.
- `web/src/` — the site, including the methodology page and the price
  check tool.
- Site methodology page: <https://www.oracle90.com/methodology>.
