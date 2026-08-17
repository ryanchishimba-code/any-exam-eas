import { describe, expect, it } from "vitest";
import {
  defaultReportDateKey,
  deltaLabel,
  nightlyTrafficReportRecipients,
} from "./nightly-traffic-report";
import { formatNightlyTrafficReportEmail } from "@/lib/email/nightly-traffic-report-email";
import type { NightlyTrafficReport } from "./nightly-traffic-report";

describe("nightly traffic report helpers", () => {
  it("defaults report date to yesterday UTC", () => {
    const now = new Date("2026-08-17T15:00:00.000Z");
    expect(defaultReportDateKey(now)).toBe("2026-08-16");
  });

  it("formats percent deltas", () => {
    expect(deltaLabel(20, 10)).toBe("+100%");
    expect(deltaLabel(5, 10)).toBe("-50%");
    expect(deltaLabel(0, 0)).toBe("—");
    expect(deltaLabel(3, 0)).toBe("new");
  });

  it("parses recipient list from env with default", () => {
    const prev = process.env.NIGHTLY_TRAFFIC_REPORT_TO;
    delete process.env.NIGHTLY_TRAFFIC_REPORT_TO;
    expect(nightlyTrafficReportRecipients()).toEqual(["ryanchishimba@gmail.com"]);
    process.env.NIGHTLY_TRAFFIC_REPORT_TO = "a@x.com, B@Y.com ";
    expect(nightlyTrafficReportRecipients()).toEqual(["a@x.com", "b@y.com"]);
    if (prev === undefined) delete process.env.NIGHTLY_TRAFFIC_REPORT_TO;
    else process.env.NIGHTLY_TRAFFIC_REPORT_TO = prev;
  });
});

describe("formatNightlyTrafficReportEmail", () => {
  it("includes key metrics in subject and body", () => {
    const report: NightlyTrafficReport = {
      date: "2026-08-16",
      pageViews: 120,
      uniqueVisitors: 45,
      anonymousPageViews: 80,
      authenticatedPageViews: 40,
      bounceRate: 42.5,
      newSignups: 7,
      newTrials: 5,
      trialStartedEvents: 6,
      logins: 18,
      checkouts: 2,
      activeTrialsNow: 40,
      paidActiveNow: 12,
      topPages: [{ path: "/", views: 50, avgDurationSec: 12 }],
      topReferrers: [{ source: "Google", views: 30 }],
      priorDayUniqueVisitors: 30,
      priorDaySignups: 4,
      priorDayTrials: 3,
    };

    const email = formatNightlyTrafficReportEmail(report);
    expect(email.subject).toContain("2026-08-16");
    expect(email.text).toContain("Unique visitors: 45");
    expect(email.text).toContain("New trials: 5");
    expect(email.html).toContain("Google");
    expect(email.html).toContain("+50%");
  });
});
