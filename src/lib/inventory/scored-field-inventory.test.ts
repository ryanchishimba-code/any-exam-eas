import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("scored field inventory cache", () => {
  it("caches the small scored snapshot and keeps the NGN catalog off the page paths", () => {
    const scored = source("src/lib/inventory/scored-field-inventory.ts");
    expect(scored).toContain("unstable_cache");
    expect(scored).toContain("scored-field-inventory-v1");
    expect(scored).toContain("ACTIVE_INVENTORY_CACHE_TAG");
    expect(scored).toContain("getPublishedInventoryStampKey");
    expect(scored).toContain("DEGRADED_INVENTORY");

    for (const file of [
      "src/lib/learning/load-coverage-heatmap.ts",
      "src/lib/study/load-subject-counts.ts",
      "src/app/api/questions/subject-counts/route.ts",
    ]) {
      const text = source(file);
      expect(text).toContain("getScoredFieldInventory");
      expect(text).not.toContain("loadPublishedClinicalBank");
    }
  });
});
