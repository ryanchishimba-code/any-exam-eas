import { describe, expect, it, vi } from "vitest";

vi.mock("@vercel/analytics", () => ({
  track: vi.fn(),
}));

import { track } from "@vercel/analytics";
import {
  VERCEL_FUNNEL_EVENTS,
  funnelPropsFromAttribution,
  isVercelFunnelEvent,
  trackVercelFunnel,
} from "@/lib/analytics/vercel-funnel";

describe("Vercel funnel events", () => {
  it("uses the signup and checkout names", () => {
    expect(Object.values(VERCEL_FUNNEL_EVENTS)).toEqual([
      "signup_view",
      "signup_submit",
      "signup_success",
      "trial_start",
      "checkout_start",
      "paid",
    ]);
    expect(isVercelFunnelEvent("signup_view")).toBe(true);
    expect(isVercelFunnelEvent("cta_clicked")).toBe(false);
  });

  it("sends attribution props with the event", () => {
    trackVercelFunnel("signup_view", funnelPropsFromAttribution({
      utmSource: "daily",
      utmMedium: "qotd",
      utmCampaign: "free_trial",
      referrer: "https://news.example/story",
    }));
    expect(track).toHaveBeenCalledWith("signup_view", {
      utm_source: "daily",
      utm_medium: "qotd",
      utm_campaign: "free_trial",
      referrer: "https://news.example/story",
    });
  });
});
