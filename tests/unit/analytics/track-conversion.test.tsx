/**
 * Conversion tracking — GA4 + internal DB logging.
 *
 * Project: component (jsdom). Run:
 *   npx vitest run --project component tests/unit/analytics/track-conversion.test.tsx
 *
 * Validates the funnel-tracking contract used by every CTA:
 *  - fires a GA4 `event` via window.gtag when a measurement ID is configured
 *  - persists the same event to /api/analytics/conversion (internal DB)
 *  - respects { persist: false } (GA4 only, used after a server already logged)
 *
 * The module reads NEXT_PUBLIC_GA_MEASUREMENT_ID at import time, so we stub the
 * env BEFORE a dynamic import in each test.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

async function importAnalyticsWithGa(measurementId = "G-TEST123") {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", measurementId);
  return import("@/lib/analytics");
}

describe("trackConversion", () => {
  beforeEach(() => {
    // Fresh gtag + fetch spies per test.
    window.gtag = vi.fn();
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(new Response("{}", { status: 200 }))));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    delete window.gtag;
  });

  it("fires a GA4 cta_clicked event with props", async () => {
    const { analytics } = await importAnalyticsWithGa();

    analytics.ctaClicked("start_free_trial", "landing_hero");

    expect(window.gtag).toHaveBeenCalledWith(
      "event",
      "cta_clicked",
      expect.objectContaining({ cta_name: "start_free_trial", location: "landing_hero" })
    );
  });

  it("persists the same event to the internal DB endpoint", async () => {
    const { analytics } = await importAnalyticsWithGa();

    analytics.ctaClicked("start_free_trial", "landing_hero");

    expect(fetch).toHaveBeenCalledWith(
      "/api/analytics/conversion",
      expect.objectContaining({ method: "POST" })
    );

    const [, init] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.eventName).toBe("cta_clicked");
    expect(body.properties).toMatchObject({ cta_name: "start_free_trial" });
  });

  it("skips DB persistence when persist:false (GA4 only)", async () => {
    const { analytics } = await importAnalyticsWithGa();

    analytics.trialStarted({ plan: "trial" }, { persist: false });

    expect(window.gtag).toHaveBeenCalledWith("event", "trial_started", expect.any(Object));
    expect(fetch).not.toHaveBeenCalled();
  });

  it("does not call gtag when no measurement ID is configured", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "");
    const { analytics } = await import("@/lib/analytics");

    analytics.ctaClicked("x", "y");

    expect(window.gtag).not.toHaveBeenCalled();
    // DB persistence still happens (it is independent of GA4 config).
    expect(fetch).toHaveBeenCalledWith("/api/analytics/conversion", expect.any(Object));
  });
});
