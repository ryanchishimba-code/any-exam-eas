"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import {
  ADS_PURCHASE_COOKIE,
  ADS_SIGNUP_COOKIE,
  googleTagScriptSrc,
} from "@/lib/analytics/google-ads";
import { adsClickFromSearch, hasAdsClick } from "@/lib/marketing/ads-click";

/**
 * A normal page loads gtag.js on the first interaction or the first idle
 * window, and always within this long if the visitor never touches the page.
 * Conversion pages, ad click ids, and one-shot conversion cookies load it
 * immediately so sign-up and purchase hits are not dropped.
 */
const IDLE_FALLBACK_MS = 12_000;

function needsGoogleTagNow(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  if (path === "/checkout" || path.startsWith("/checkout/")) return true;
  if (path === "/signup" || path.startsWith("/signup/")) return true;
  if (hasAdsClick(adsClickFromSearch(window.location.search))) return true;
  const cookie = document.cookie;
  return (
    cookie.includes(`${ADS_SIGNUP_COOKIE}=`) || cookie.includes(`${ADS_PURCHASE_COOKIE}=`)
  );
}

/**
 * The bootstrap stub stays in the document head. This loads the ~150 KB
 * gtag.js library after interaction or idle, except when a conversion or
 * an ad click id has to be recorded on this page.
 */
export function GoogleAnalytics() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      if (cancelled) return;
      cancelled = true;
      setSrc(googleTagScriptSrc());
    };
    if (needsGoogleTagNow()) {
      load();
      return;
    }

    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    for (const event of events) {
      window.addEventListener(event, load, { once: true, passive: true });
    }
    const timeout = window.setTimeout(load, IDLE_FALLBACK_MS);
    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(load, { timeout: IDLE_FALLBACK_MS })
        : undefined;

    return () => {
      cancelled = true;
      for (const event of events) window.removeEventListener(event, load);
      window.clearTimeout(timeout);
      if (idle !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idle);
      }
    };
  }, []);

  if (!src) return null;
  return <Script src={src} strategy="afterInteractive" />;
}
