"use client";

import { useEffect } from "react";
import {
  captureFirstTouch,
  consumeFunnelEventCookie,
} from "@/lib/marketing/first-touch-client";
import { captureAdsClick } from "@/lib/marketing/ads-click-client";
import { isVercelFunnelEvent, trackVercelFunnel } from "@/lib/analytics/vercel-funnel";

/** Records the first visit, then flushes signup events set during OAuth. */
export function FirstTouchCapture() {
  useEffect(() => {
    captureFirstTouch(window.location.href, document.referrer);
    try {
      captureAdsClick(window.location.href);
    } catch {
      /* cookie capture must never break signup or other pages */
    }
    for (const name of consumeFunnelEventCookie()) {
      if (isVercelFunnelEvent(name)) trackVercelFunnel(name);
    }
  }, []);
  return null;
}
