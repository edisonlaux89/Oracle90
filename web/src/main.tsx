import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/600.css";
import "./index.css";
import { I18nProvider } from "./i18n";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { MatchPage } from "./pages/MatchPage";
import { TrackRecord } from "./pages/TrackRecord";
import { Methodology } from "./pages/Methodology";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <I18nProvider>
      <BrowserRouter>
        <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/match/:league/:slug" element={<MatchPage />} />
          <Route path="/track-record" element={<TrackRecord />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="*" element={<Home />} />
        </Route>
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  </StrictMode>,
);
