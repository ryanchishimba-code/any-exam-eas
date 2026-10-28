import { describe, expect, it } from "vitest";
import {
  dailyTrialHref,
  dailyTrialQuote,
  isDailySignupArrival,
} from "@/lib/marketing/daily-trial";

describe("dailyTrialHref", () => {
  it("prefills signup with the board and daily UTM tags", () => {
    const href = dailyTrialHref("nclex");
    expect(href.startsWith("/signup?")).toBe(true);
    expect(href).toContain("plan=trial");
    expect(href).toContain("exam=nclex");
    expect(href).toContain("board=nclex");
    expect(href).toContain("utm_source=daily");
    expect(href).toContain("utm_medium=qotd");
    expect(href).toContain("utm_campaign=free_trial");
  });
});

describe("dailyTrialQuote", () => {
  it("uses one consented quote for the boards that have one", () => {
    expect(dailyTrialQuote("nclex")?.name).toBe("Nathan C.");
    expect(dailyTrialQuote("naplex")?.name).toBe("Frank C.");
    expect(dailyTrialQuote("pance")?.name).toBe("Nick B.");
    expect(dailyTrialQuote("aanp-fnp")?.name).toBe("Mag B.");
  });

  it("omits a quote when that board has no consented line", () => {
    expect(dailyTrialQuote("usmle")).toBeNull();
    expect(dailyTrialQuote("npte-pt")).toBeNull();
  });

  it("does not promise a pass", () => {
    for (const slug of ["nclex", "naplex", "pance", "aanp-fnp"]) {
      const quote = dailyTrialQuote(slug);
      expect(quote?.quote.toLowerCase()).not.toMatch(/you will pass|guaranteed/);
    }
  });
});

describe("isDailySignupArrival", () => {
  it("matches the daily UTM source only", () => {
    expect(isDailySignupArrival("daily")).toBe(true);
    expect(isDailySignupArrival("resources")).toBe(false);
    expect(isDailySignupArrival(null)).toBe(false);
  });
});
