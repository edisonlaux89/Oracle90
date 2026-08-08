const REPO_URL = "https://github.com/edisonlaux89/Oracle90";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-bold tracking-tight">
        {title}
      </h2>
      <div className="mt-4 space-y-4 leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}

export function Methodology() {
  return (
    <div className="mx-auto max-w-2xl pt-14 sm:pt-20">
      <h1 className="font-display text-4xl font-bold tracking-tight">
        Methodology
      </h1>
      <p className="mt-4 leading-relaxed text-muted">
        What Oracle90 publishes, how the numbers are produced, and how you can
        verify that nothing is rewritten after the results come in.
      </p>

      <Section title="What we publish">
        <p>
          For every Premier League and Championship match we publish the
          probability of a home win, draw and away win, plus the probability
          of the match producing over or under 2.5 goals. Probabilities always
          sum to 100%.
        </p>
      </Section>

      <Section title="How the model works">
        <p>
          The forecasts come from an ensemble of two parts. The first is a
          statistical model built on team scoring rates and strength ratings,
          in the family of Dixon and Coles style Poisson models combined with
          Elo ratings, trained on more than a decade of historical results.
        </p>
        <p>
          The second is the market consensus. Betting markets aggregate the
          judgement of thousands of participants and are the strongest known
          public predictor of football results. Our published probabilities
          anchor the statistical model to that consensus. This is standard
          practice in the industry: Opta, for example, has said publicly that
          its match predictions use market odds as an input.
        </p>
        <p>
          We disclose the blend openly. The current published forecasts weight
          the market consensus at 0.8 and the pure statistical model at 0.2.
          When the weighting changes, the version number changes with it.
        </p>
      </Section>

      <Section title="Why anchor to the market">
        <p>
          Because it is honest. Decades of academic research show that no
          public model consistently beats the closing market consensus at
          predicting match outcomes. A site claiming otherwise is either
          lucky or lying. Anchoring gives you the most accurate probabilities
          we can offer, and our track record page shows exactly how they
          perform.
        </p>
      </Section>

      <Section title="Verification">
        <p>
          Every forecast is committed to a{" "}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="text-text underline decoration-line underline-offset-4 hover:decoration-lime"
          >
            public GitHub repository
          </a>{" "}
          before kickoff. Git commit timestamps are public and independently
          checkable, and published predictions are never amended or rewritten.
          If we were tempted to quietly fix a bad call after full time, the
          commit history would expose it.
        </p>
      </Section>

      <Section title="What this is not">
        <p>
          Oracle90 is a data science project. It does not offer betting
          advice, tips or staking suggestions, and it never will. The
          probabilities describe how likely outcomes are; what you do with
          that information is entirely your own business.
        </p>
        <p>
          Where AI-generated match previews appear on this site, they are
          labelled as AI-generated.
        </p>
      </Section>
    </div>
  );
}
