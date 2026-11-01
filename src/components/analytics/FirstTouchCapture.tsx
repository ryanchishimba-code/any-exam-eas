"use client";

import { useEffect } from "react";
import {
  captureFirstTouch,
  consumeFunnelEventCookie,
} from "@/lib/marketing/first-touch-client";
import { isVercelFunnelEvent, trackVercelFunnel } from "@/lib/analytics/vercel-funnel";

/** Records the first visit, then flushes signup events set during OAuth. */
export function FirstTouchCapture() {
  useEffect(() => {
    captureFirstTouch(window.location.href, document.referrer);
    for (const name of consumeFunnelEventCookie()) {
      if (isVercelFunnelEvent(name)) trackVercelFunnel(name);
    }
  }, []);
  return null;
}
