import { Link } from "react-router-dom";

export function TrackRecord() {
  return (
    <div className="pt-14 sm:pt-20">
      <h1 className="font-display text-4xl font-bold tracking-tight">
        Track record
      </h1>
      <p className="mt-4 max-w-xl leading-relaxed text-muted">
        Every published probability is scored against the final result. Nothing
        is edited after the fact.
      </p>

      <div className="mt-10 max-w-2xl rounded-2xl bg-surface p-8 sm:p-10">
        <img src="/brand/mark-tight.png" alt="" className="h-10 w-auto" />
        <h2 className="mt-6 font-display text-xl font-bold">
          The record starts on 21 August 2026.
        </h2>
        <p className="mt-3 leading-relaxed text-muted">
          Once the season kicks off, this page will track accuracy, Brier
          score, log loss and calibration for every forecast, round by round,
          from the first matchweek onwards.
        </p>
        <p className="mt-3 leading-relaxed text-muted">
          Each prediction is committed to the public GitHub repository before
          kickoff, so the record can be verified independently. How that works
          is covered in the{" "}
          <Link
            to="/methodology"
            className="text-text underline decoration-line underline-offset-4 hover:decoration-lime"
          >
            methodology
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
