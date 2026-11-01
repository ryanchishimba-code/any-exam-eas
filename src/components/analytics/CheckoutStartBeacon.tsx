"use client";

import { useEffect } from "react";
import { VERCEL_FUNNEL_EVENTS, funnelPropsFromAttribution, trackVercelFunnel } from "@/lib/analytics/vercel-funnel";
import { readClientFirstTouch } from "@/lib/marketing/first-touch-client";

const STORAGE_KEY = "aee_checkout_start";

/** Fires once per tab when the paid checkout screen opens. */
export function CheckoutStartBeacon() {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY)) return;
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* still send the event */
    }
    trackVercelFunnel(VERCEL_FUNNEL_EVENTS.CHECKOUT_START, {
      plan: "subscribe",
      ...funnelPropsFromAttribution(readClientFirstTouch()),
    });
  }, []);
  return null;
}
