"use client";

import {
  ADS_CLICK_COOKIE,
  ADS_CLICK_MAX_AGE_SEC,
  adsClickFromSearch,
  encodeAdsClick,
  hasAdsClick,
  type AdsClickIds,
} from "@/lib/marketing/ads-click";

/**
 * Store the latest ad click id. A visit without a click id leaves the stored one alone.
 * Never throws: a bad URL or a blocked cookie must not break signup or any other page.
 */
export function captureAdsClick(pageUrl: string): AdsClickIds {
  try {
    const ids = adsClickFromSearch(new URL(pageUrl).search);
    if (!hasAdsClick(ids)) return {};
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${ADS_CLICK_COOKIE}=${encodeAdsClick(ids)}; Path=/; Max-Age=${ADS_CLICK_MAX_AGE_SEC}; SameSite=Lax${secure}`;
    return ids;
  } catch {
    return {};
  }
}
