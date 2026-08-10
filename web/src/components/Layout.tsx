import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useI18n } from "../i18n";
import { PRICE_CHECK_ENABLED } from "../config";

export const REPO_URL = "https://github.com/edisonlaux89/Oracle90";

function navClass({ isActive }: { isActive: boolean }): string {
  return isActive
    ? "text-text"
    : "text-muted transition-colors hover:text-text";
}

export function Layout() {
  const { pathname } = useLocation();
  const { lang, s, setLang } = useI18n();

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
          <nav className="flex items-center gap-2 text-sm font-medium sm:gap-6">
            <NavLink to="/" end className={navClass}>
              {s.nav.predictions}
            </NavLink>
            <NavLink
              to="/track-record"
              className={(st) => `whitespace-nowrap ${navClass(st)}`}
            >
              {s.nav.trackRecord}
            </NavLink>
            <NavLink to="/methodology" className={navClass}>
              {s.nav.methodology}
            </NavLink>
            {PRICE_CHECK_ENABLED && (
              <NavLink
                to="/price-check"
                className={(st) => `hidden whitespace-nowrap sm:inline ${navClass(st)}`}
              >
                {s.nav.priceCheck}
              </NavLink>
            )}
            <button
              onClick={() => setLang(lang === "en" ? "zh" : "en")}
              className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted transition-colors hover:text-text active:scale-[0.98]"
            >
              {s.nav.toggle}
            </button>
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
              {s.footer.logged1}
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="text-text underline decoration-line underline-offset-4 hover:decoration-lime"
              >
                {s.footer.logged2}
              </a>
              {s.footer.logged3}
            </p>
          </div>
          <div className="max-w-sm text-sm leading-relaxed text-muted">
            <p>{s.footer.disclaimer}</p>
            <p className="mt-3">{s.footer.builtBy}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
