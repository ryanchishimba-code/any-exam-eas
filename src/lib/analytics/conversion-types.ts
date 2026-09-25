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
  /** Product tour. Not an ad conversion — excluded from the marketing funnel charts. */
  TOUR_SHOWN: "tour_shown",
  TOUR_STEP_VIEWED: "tour_step_viewed",
  TOUR_STEP_SKIPPED: "tour_step_skipped",
  TOUR_COMPLETED: "tour_completed",
  TOUR_DISMISSED: "tour_dismissed",
  TOUR_REPLAYED: "tour_replayed",
  /** Daily study set. Not an ad conversion — excluded from the marketing funnel charts. */
  TODAY_SET_STARTED: "today_set_started",
  TODAY_SET_COMPLETED: "today_set_completed",
} as const;

/** Marketing funnel cards. Product-tour events stay in the events table only. */
export const FUNNEL_CONVERSION_EVENTS = [
  CONVERSION_EVENTS.CTA_CLICKED,
  CONVERSION_EVENTS.PRICING_VIEWED,
  CONVERSION_EVENTS.PLAN_SELECTED,
  CONVERSION_EVENTS.TRIAL_STARTED,
  CONVERSION_EVENTS.SIGNUP_COMPLETED,
] as const;

export type ConversionEventName =
  (typeof CONVERSION_EVENTS)[keyof typeof CONVERSION_EVENTS];

export type ConversionProperties = {
  cta_clicked: { cta_name: string; location: string };
  pricing_viewed: { path?: string };
  plan_selected: { plan_type: string; interval?: string; tier?: string };
  trial_started: { plan_type?: string; tier?: string; interval?: string };
  signup_completed: { plan?: string; tier?: string; interval?: string; exam_slug?: string };
  tour_shown: { tour: string; board: string; device: "mobile" | "desktop"; trial: boolean };
  tour_step_viewed: { step_id: string; step_index: number; total_steps: number };
  tour_step_skipped: { step_id: string };
  tour_completed: { via: "cta" | "next" | "target_click"; duration_ms: number };
  tour_dismissed: { at_step: number; via: "skip" | "close" | "esc"; step_id?: string };
  tour_replayed: { from: "settings" };
  today_set_started: {
    exam_slug: string;
    field_id: string;
    size: number;
    review_count: number;
    spaced_count: number;
    new_count: number;
  };
  today_set_completed: {
    exam_slug: string;
    size: number;
    accuracy: number;
    correct: number;
    total: number;
    weakest_topic?: string;
  };
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
