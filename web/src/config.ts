/**
 * Build-time feature flags. Flip and rebuild to enable.
 * While a flag is false its routes are not registered, its UI is not
 * rendered, and the prerender/sitemap pipeline skips its pages.
 */
export const PRICE_CHECK_ENABLED = false;
