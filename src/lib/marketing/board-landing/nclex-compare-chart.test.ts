import { describe, expect, it } from "vitest";
import { boardQuestionUnits } from "@/lib/counts";
import { buildNclexCompareChartData } from "@/lib/marketing/board-landing/nclex-compare-chart";

describe("buildNclexCompareChartData", () => {
  it("omits bars when units are missing", () => {
    const data = buildNclexCompareChartData(null);
    expect(data.bars).toEqual([]);
    expect(JSON.stringify(data)).not.toMatch(/uworld|archer|kaplan/i);
  });

  it("adds live bank bars when units are present", () => {
    const units = boardQuestionUnits({
      slug: "nclex",
      bankItems: 50,
      formats: { mcq: 40, ngn: 10, case: 0 },
      clinical: { standaloneNgn: 2, caseStudies: 1, caseItems: 6 },
    });
    const data = buildNclexCompareChartData(units);
    expect(data.bars.some((bar) => bar.id === "live-questions")).toBe(true);
    expect(data.inventoryNote).toMatch(/live questions/i);
  });
});
