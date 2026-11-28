import Script from "next/script";
import { googleTagScriptSrc } from "@/lib/analytics/google-ads";

/**
 * Loads the Google tag library. Consent defaults and destination config
 * (Ads AW-18297494724 and the GA4 measurement id, when set) are in
 * GoogleTagBootstrap so they run before this file executes.
 */
export function GoogleAnalytics() {
  return <Script src={googleTagScriptSrc()} strategy="afterInteractive" />;
}
