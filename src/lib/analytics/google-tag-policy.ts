/**
 * Hosts the Google tag needs. Production CSP is built from this list.
 * There is no cookie banner in the app. Consent Mode defaults live in google-ads.ts.
 */
export const GOOGLE_TAG_SCRIPT_HOSTS = [
  "https://www.googletagmanager.com",
  "https://*.googletagmanager.com",
  "https://www.googleadservices.com",
  "https://www.google.com",
  "https://googleads.g.doubleclick.net",
] as const;

export const GOOGLE_TAG_CONNECT_HOSTS = [
  "https://www.google-analytics.com",
  "https://region1.google-analytics.com",
  "https://*.google-analytics.com",
  "https://analytics.google.com",
  "https://region1.analytics.google.com",
  "https://*.analytics.google.com",
  "https://www.googletagmanager.com",
  "https://*.googletagmanager.com",
  "https://www.google.com",
  "https://googleads.g.doubleclick.net",
  "https://www.googleadservices.com",
  "https://stats.g.doubleclick.net",
  "https://ad.doubleclick.net",
] as const;
