import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

export function TrackRecord() {
  const { s } = useI18n();
  return (
    <div className="pt-14 sm:pt-20">
      <h1 className="font-display text-4xl font-bold tracking-tight">
        {s.track.title}
      </h1>
      <p className="mt-4 max-w-xl leading-relaxed text-muted">
        {s.track.intro}
      </p>

      <div className="mt-10 max-w-2xl rounded-2xl bg-surface p-8 sm:p-10">
        <img src="/brand/mark-tight.png" alt="" className="h-10 w-auto" />
        <h2 className="mt-6 font-display text-xl font-bold">
          {s.track.startsTitle}
        </h2>
        <p className="mt-3 leading-relaxed text-muted">{s.track.p1}</p>
        <p className="mt-3 leading-relaxed text-muted">
          {s.track.p2a}
          <Link
            to="/methodology"
            className="text-text underline decoration-line underline-offset-4 hover:decoration-lime"
          >
            {s.track.p2b}
          </Link>
          {s.track.p2c}
        </p>
      </div>
    </div>
  );
}
