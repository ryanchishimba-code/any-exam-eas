import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { boardStudyCountsFromSources } from "./board-study-counts";

describe("board study counts", () => {
  it("uses the analytics attempt total and the roadmap rolling window", () => {
    const counts = boardStudyCountsFromSources({
      roadmap: {
        openIncorrectCount: 41,
        recentAccuracyWindow: { pct: 40, windowAttempts: 100 },
      },
      headline: { totalAttempts: 137, overallAccuracy: 45 },
    });
    expect(counts).toEqual({
      totalAttempts: 137,
      overallAccuracyPct: 45,
      recentAccuracyPct: 40,
      openIncorrect: 41,
    });
  });

  it("falls back to the analytics headline when the roadmap did not load", () => {
    expect(
      boardStudyCountsFromSources({
        roadmap: null,
        headline: { totalAttempts: 137, overallAccuracy: 45 },
      })
    ).toEqual({
      totalAttempts: 137,
      overallAccuracyPct: 45,
      recentAccuracyPct: 45,
      openIncorrect: null,
    });
  });

  it("feeds Dashboard and Analytics from the same helper", () => {
    const dashboard = readFileSync(
      new URL("../../app/(app)/dashboard/page.tsx", import.meta.url),
      "utf8"
    );
    const analytics = readFileSync(
      new URL("../../app/(app)/analytics/page.tsx", import.meta.url),
      "utf8"
    );
    const header = readFileSync(
      new URL("../../components/app/DashboardPageContent.tsx", import.meta.url),
      "utf8"
    );
    expect(dashboard).toContain("boardStudyCountsFromSources");
    expect(analytics).toContain("boardStudyCountsFromSources");
    expect(dashboard).not.toContain("stats.accuracyPct");
    expect(header).toContain("boardAttempts");
    expect(header).not.toContain("questionsAnswered");
  });
});
