import { describe, expect, it } from "vitest";
import { buildPrepPriceBarChartData } from "@/lib/marketing/prep-price-bar-chart";

describe("buildPrepPriceBarChartData", () => {
  it("uses real Pro and typical prep prices without vendor names", () => {
    const data = buildPrepPriceBarChartData("nclex");
    const serialized = JSON.stringify(data);
    expect(serialized).toMatch(/\$27\.99\/mo/);
    expect(serialized).toMatch(/\$139/);
    expect(serialized).not.toMatch(/uworld|archer|kaplan/i);
    expect(data.bars.some((bar) => bar.id === "ours")).toBe(true);
  });
});
