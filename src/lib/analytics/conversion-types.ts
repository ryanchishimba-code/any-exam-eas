/**
 * Canonical conversion event names — keep in sync with GA4 custom event names.
 *
 * GA4 Admin → Configure → Events → Mark as conversion:
 *   cta_clicked, pricing_viewed, plan_selected, trial_started, signup_completed
 */
export const CONVERSION_EVENTS = {
  CTA_CLICKED: "cta_clicked",
  PRICING_VIEWED: "pricing_viewed",
  PLAN_SELECTED: "plan_selected",
  TRIAL_STARTED: "trial_started",
  SIGNUP_COMPLETED: "signup_completed",
} as const;

export type ConversionEventName =
  (typeof CONVERSION_EVENTS)[keyof typeof CONVERSION_EVENTS];

export type ConversionProperties = {
  cta_clicked: { cta_name: string; location: string };
  pricing_viewed: { path?: string };
  plan_selected: { plan_type: string; interval?: string; tier?: string };
  trial_started: { plan_type?: string; tier?: string; interval?: string };
  signup_completed: { plan?: string; tier?: string; interval?: string; exam_slug?: string };
};

export type ConversionSource = "web" | "server";

export type ConversionEventRow = {
  id: string;
  userId: string | null;
  eventName: ConversionEventName;
  properties: Record<string, unknown>;
  sessionId: string | null;
  source: ConversionSource;
  createdAt: string;
  userEmail?: string | null;
};

export type ConversionsDashboardData = {
  range: { from: string; to: string };
  totals: Record<ConversionEventName, number>;
  eventsByDay: { date: string; count: number; eventName: string }[];
  dailyTotals: { date: string; total: number }[];
  ctaBreakdown: { cta_name: string; location: string; count: number }[];
  planBreakdown: { plan_type: string; count: number }[];
  recent: ConversionEventRow[];
};
