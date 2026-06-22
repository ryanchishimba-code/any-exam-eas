import { describe, expect, it } from "vitest";
import { aggregatePageViewEvents, normalizeReferrer, visitorKey } from "./web-traffic";

describe("web-traffic", () => {
  it("normalizes referrers", () => {
    expect(normalizeReferrer("")).toBe("Direct / none");
    expect(normalizeReferrer("https://www.google.com/search?q=test")).toBe("Google");
  });

  it("aggregates page views by path and day", () => {
    const from = new Date("2026-06-01T00:00:00.000Z");
    const to = new Date("2026-06-02T23:59:59.999Z");
    const metrics = aggregatePageViewEvents(
      [
        {
          metadata: JSON.stringify({ path: "/", referrer: "", durationSec: 10 }),
          sessionId: "s1",
          userId: null,
          ipHash: "abc",
          createdAt: new Date("2026-06-01T12:00:00.000Z"),
        },
        {
          metadata: JSON.stringify({ path: "/pricing", referrer: "https://google.com", durationSec: 20 }),
          sessionId: "s1",
          userId: "u1",
          ipHash: "abc",
          createdAt: new Date("2026-06-01T12:05:00.000Z"),
        },
      ],
      from,
      to
    );
    expect(metrics.totalPageViews).toBe(2);
    expect(metrics.uniqueVisitors).toBe(1);
    expect(metrics.authenticatedPageViews).toBe(1);
    expect(metrics.anonymousPageViews).toBe(1);
    expect(metrics.topPages[0]?.path).toBe("/");
    expect(metrics.topReferrers.some((r) => r.source === "Google")).toBe(true);
  });

  it("builds stable visitor keys", () => {
    expect(visitorKey({ sessionId: "abc", userId: null, ipHash: null, metadata: null, createdAt: new Date() })).toBe(
      "s:abc"
    );
  });
});
