"use client";

import { track } from "@vercel/analytics";
import type { FirstTouchAttribution } from "@/lib/marketing/first-touch";

/** Vercel Web Analytics custom events for the signup and checkout funnel. */
export const VERCEL_FUNNEL_EVENTS = {
  SIGNUP_VIEW: "signup_view",
  SIGNUP_SUBMIT: "signup_submit",
  SIGNUP_SUCCESS: "signup_success",
  TRIAL_START: "trial_start",
  CHECKOUT_START: "checkout_start",
  PAID: "paid",
} as const;

export type VercelFunnelEvent = (typeof VERCEL_FUNNEL_EVENTS)[keyof typeof VERCEL_FUNNEL_EVENTS];

const EVENT_NAMES = new Set<string>(Object.values(VERCEL_FUNNEL_EVENTS));

export function isVercelFunnelEvent(value: string): value is VercelFunnelEvent {
  return EVENT_NAMES.has(value);
}

export function funnelPropsFromAttribution(
  attr: FirstTouchAttribution
): Record<string, string> {
  const props: Record<string, string> = {};
  if (attr.utmSource) props.utm_source = attr.utmSource;
  if (attr.utmMedium) props.utm_medium = attr.utmMedium;
  if (attr.utmCampaign) props.utm_campaign = attr.utmCampaign;
  if (attr.referrer) props.referrer = attr.referrer;
  return props;
}

export function trackVercelFunnel(
  event: VercelFunnelEvent,
  properties?: Record<string, string | number | boolean | null>
): void {
  try {
    track(event, properties);
  } catch {
    /* Analytics must not block signup or checkout. */
  }
}
