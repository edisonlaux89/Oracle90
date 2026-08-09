import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { App } from "./App";

export { allRoutes } from "./seo";
export type { RouteSeo } from "./seo";
export { buildLlmsTxt } from "./llms";

/** Render one route to static HTML for the prerender step. */
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}
