import { describe, expect, it } from "vitest";
import {
  buildNclexNgnTypeChartAltText,
  buildNclexNgnTypeChartRows,
} from "@/lib/marketing/board-landing/nclex-ngn-type-chart";

describe("buildNclexNgnTypeChartRows", () => {
  it("lists published case items and standalone types without bank SATA", () => {
    const rows = buildNclexNgnTypeChartRows({
      caseItems: 222,
      standaloneNgn: 57,
      publishedStandaloneTypes: { bowtie: 27, trend: 30 },
    });
    expect(rows.map((row) => [row.id, row.count])).toEqual([
      ["case-items", 222],
      ["bowtie", 27],
      ["trend", 30],
    ]);
    const alt = buildNclexNgnTypeChartAltText(rows, { caseItems: 222, standaloneNgn: 57 });
    expect(alt).toMatch(/279 published NGN items/);
    expect(alt).toMatch(/Case study items 222/);
    expect(alt).toMatch(/Bow-tie 27/);
    expect(alt).toMatch(/Trend 30/);
    expect(alt).toMatch(/Select-all-that-apply/i);
  });
});
