import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

const REPO_URL = "https://github.com/edisonlaux89/Oracle90";

function navClass({ isActive }: { isActive: boolean }): string {
  return isActive
    ? "text-text"
    : "text-muted transition-colors hover:text-text";
}

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-[100dvh] bg-bg text-text">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <img
              src="/brand/mark-tight.png"
              alt="Oracle90 mark"
              className="h-6 w-auto"
            />
            <span className="hidden font-display text-lg font-bold tracking-wide md:inline">
              ORACLE<span className="text-lime">90</span>
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium sm:gap-7">
            <NavLink to="/" end className={navClass}>
              Predictions
            </NavLink>
            <NavLink
              to="/track-record"
              className={(s) => `whitespace-nowrap ${navClass(s)}`}
            >
              Track record
            </NavLink>
            <NavLink to="/methodology" className={navClass}>
              Methodology
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <img src="/brand/mark-tight.png" alt="" className="h-4 w-auto" />
              <span className="font-display text-sm font-bold tracking-wide">
                ORACLE<span className="text-lime">90</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Predictions are logged publicly on{" "}
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="text-text underline decoration-line underline-offset-4 hover:decoration-lime"
              >
                GitHub
              </a>{" "}
              before kickoff. The commit history is the proof.
            </p>
          </div>
          <div className="max-w-sm text-sm leading-relaxed text-muted">
            <p>
              Oracle90 publishes statistical forecasts for informational and
              educational purposes. It does not offer betting advice.
            </p>
            <p className="mt-3">Built by Davy.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
