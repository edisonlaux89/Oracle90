import { REPO_URL } from "../components/Layout";
import { useI18n } from "../i18n";

const VERIFICATION_INDEX = 4;

export function Methodology() {
  const { s } = useI18n();
  return (
    <div className="mx-auto max-w-2xl pt-14 sm:pt-20">
      <h1 className="font-display text-4xl font-bold tracking-tight">
        {s.method.title}
      </h1>
      <p className="mt-4 leading-relaxed text-muted">{s.method.intro}</p>

      {s.method.sections.map((sec, i) => (
        <section key={sec.title} className="mt-12">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            {sec.title}
          </h2>
          <div className="mt-4 space-y-4 leading-relaxed text-muted">
            {sec.paras.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
            {i === VERIFICATION_INDEX && (
              <p>
                →{" "}
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-text underline decoration-line underline-offset-4 hover:decoration-lime"
                >
                  {s.method.repoLinkText}
                </a>
              </p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
