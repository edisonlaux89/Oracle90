import { Routes, Route } from "react-router-dom";
import { I18nProvider } from "./i18n";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { MatchPage } from "./pages/MatchPage";
import { TrackRecord } from "./pages/TrackRecord";
import { Methodology } from "./pages/Methodology";
import { PRICE_CHECK_ENABLED } from "./config";
import { PriceCheckPage } from "./pages/PriceCheckPage";

/**
 * Router-agnostic app tree. The browser entry (main.tsx) wraps it in
 * BrowserRouter; the prerender entry (entry-server.tsx) wraps it in
 * StaticRouter. Keep CSS and font imports out of this file so the SSR bundle
 * stays style-free.
 */
export function App() {
  return (
    <I18nProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/match/:league/:slug" element={<MatchPage />} />
          <Route path="/track-record" element={<TrackRecord />} />
          <Route path="/methodology" element={<Methodology />} />
          {PRICE_CHECK_ENABLED && (
            <Route path="/price-check" element={<PriceCheckPage />} />
          )}
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </I18nProvider>
  );
}
