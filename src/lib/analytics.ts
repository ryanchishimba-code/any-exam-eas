"use client";

/**
 * Hybrid analytics: GA4 (marketing/acquisition) + Neon Postgres (internal admin dashboards).
 *
 * Why hybrid?
 * - GA4 excels at ad attribution, funnel exploration, and Google Ads linking — but its UI is
 *   awkward for product-specific admin views and hard to join with our users/subscriptions.
 * - Our DB gives staff instant, typed conversion tables/charts beside CRM data without GA4 API quotas.
 *
 * GA4 setup (mark the same event names as conversions):
 *   Admin → Configure → Events → find each event → toggle "Mark as conversion"
 *   Events: cta_clicked, pricing_viewed, plan_selected, trial_started, signup_completed
 *
 * Testing:
 * - GA4: install Google Analytics Debugger extension, open DebugView (Admin → DebugView),
 *   trigger events on staging/local with NEXT_PUBLIC_GA_MEASUREMENT_ID set.
 * - DB: trigger an event, then query Admin → Traffic & analytics → Conversions, or:
 *   SELECT * FROM "ConversionEvent" ORDER BY "createdAt" DESC LIMIT 20;
 */

import { getOrCreateAnalyticsSessionId } from "@/lib/analytics/client-session";
import {
  CONVERSION_EVENTS,
  type ConversionEventName,
  type ConversionProperties,
} from "@/lib/analytics/conversion-types";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export { CONVERSION_EVENTS };
export type { ConversionEventName, ConversionProperties };

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export type TrackConversionOptions = {
  /** When false, only sends to GA4 (use after server already persisted the event). Default true. */
  persist?: boolean;
};

function sendToGa4(eventName: ConversionEventName, properties: Record<string, unknown>): void {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;
  try {
    window.gtag?.("event", eventName, properties);
  } catch {
    /* non-blocking */
  }
}

async function persistConversion(
  eventName: ConversionEventName,
  properties: Record<string, unknown>
): Promise<void> {
  try {
    await fetch("/api/analytics/conversion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventName,
        properties,
        sessionId: getOrCreateAnalyticsSessionId() || undefined,
      }),
    });
  } catch {
    /* non-blocking */
  }
}

/** Fire a typed conversion to GA4 and our Postgres events table. */
export function trackConversion<E extends ConversionEventName>(
  eventName: E,
  properties: ConversionProperties[E],
  options?: TrackConversionOptions
): void {
  const payload = properties as Record<string, unknown>;
  sendToGa4(eventName, payload);
  if (options?.persist !== false) {
    void persistConversion(eventName, payload);
  }
}

/** Convenience wrappers for common funnel steps. */
export const analytics = {
  ctaClicked: (cta_name: string, location: string) =>
    trackConversion(CONVERSION_EVENTS.CTA_CLICKED, { cta_name, location }),

  pricingViewed: (path?: string) =>
    trackConversion(CONVERSION_EVENTS.PRICING_VIEWED, { path: path ?? window.location.pathname }),

  planSelected: (plan_type: string, extra?: { interval?: string; tier?: string }) =>
    trackConversion(CONVERSION_EVENTS.PLAN_SELECTED, { plan_type, ...extra }),

  trialStarted: (
    props?: ConversionProperties["trial_started"],
    options?: TrackConversionOptions
  ) => trackConversion(CONVERSION_EVENTS.TRIAL_STARTED, props ?? {}, options),

  signupCompleted: (
    props?: ConversionProperties["signup_completed"],
    options?: TrackConversionOptions
  ) => trackConversion(CONVERSION_EVENTS.SIGNUP_COMPLETED, props ?? {}, options),
};
