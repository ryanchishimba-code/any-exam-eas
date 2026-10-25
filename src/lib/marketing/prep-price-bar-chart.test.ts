import { describe, expect, it } from "vitest";
import { buildPrepPriceBarChartData } from "@/lib/marketing/prep-price-bar-chart";

describe("buildPrepPriceBarChartData", () => {
  it("shows Pro monthly pricing only, without competitor comparisons", () => {
    const data = buildPrepPriceBarChartData("nclex");
    const serialized = JSON.stringify(data);
    expect(serialized).toMatch(/\$27\.99\/mo/);
    expect(serialized).not.toMatch(/\$139|\$349|Save \$|typical prep/i);
    expect(data.bars).toHaveLength(1);
    expect(data.bars[0]?.id).toBe("ours");
  });
});
