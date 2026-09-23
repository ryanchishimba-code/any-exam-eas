import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { INVENTORY_FIELD_IDS } from "./active-questions";
import {
  activeInventoryStampCoversFields,
  activeInventoryStampKey,
  normalizeActiveInventoryStampRow,
} from "./active-inventory-stamp";

describe("active inventory stamp", () => {
  it("changes the cache key when the published count or the latest edit changes", () => {
    const before = activeInventoryStampKey(
      normalizeActiveInventoryStampRow({
        published: 6457,
        touchedAt: "2026-09-20T12:00:00.000Z",
      })
    );
    const afterRetire = activeInventoryStampKey(
      normalizeActiveInventoryStampRow({
        published: "6243",
        touchedAt: new Date("2026-09-23T17:00:00.000Z"),
      })
    );
    expect(before).toBe("6457:2026-09-20T12:00:00.000Z");
    expect(afterRetire).toBe("6243:2026-09-23T17:00:00.000Z");
    expect(afterRetire).not.toBe(before);
  });

  it("ignores an empty bank and a non-date touch value", () => {
    expect(normalizeActiveInventoryStampRow(null)).toEqual({
      published: 0,
      touchedAt: null,
    });
    expect(activeInventoryStampKey({ published: 0, touchedAt: null })).toBe("0:none");
    expect(
      normalizeActiveInventoryStampRow({ published: -3, touchedAt: { nope: true } })
    ).toEqual({ published: 0, touchedAt: null });
  });

  it("uses the same field filter as the active inventory query", () => {
    const source = readFileSync(path.join(process.cwd(), "src/lib/inventory/active-inventory-stamp.ts"), "utf8");
    const inventory = readFileSync(path.join(process.cwd(), "src/lib/inventory/active-questions.ts"), "utf8");
    expect(activeInventoryStampCoversFields(source)).toBe(true);
    for (const fieldId of INVENTORY_FIELD_IDS) {
      expect(inventory).toContain(`'${fieldId}'`);
    }
    expect(source).toContain(`"fieldId" = 'usmle-step-2' AND "stepLevel" = 'step3'`);
    expect(source).toContain("active = true");
    expect(source).toContain(`"qaPassed" = true`);
  });
});

describe("inventory surfaces do not keep an hour-old total", () => {
  const dynamicSurfaces = [
    "src/app/nclex/page.tsx",
    "src/app/(marketing)/[examSlug]/page.tsx",
    "src/app/(marketing)/about/page.tsx",
    "src/app/(marketing)/free-guides/page.tsx",
    "src/app/api/marketing/bank-counts/route.ts",
    "scripts/retire-near-duplicates.ts",
    "scripts/remediate-text-flags.ts",
  ];

  it("renders count pages dynamically and does not fail a retire when the cron purge is skipped", () => {
    for (const file of dynamicSurfaces) {
      const source = readFileSync(path.join(process.cwd(), file), "utf8");
      if (file.endsWith("page.tsx") || file.includes("/api/")) {
        expect(source, file).toContain('dynamic = "force-dynamic"');
        expect(source, file).not.toMatch(/export const revalidate = \d+/);
      }
      if (file.endsWith(".ts") && file.startsWith("scripts/")) {
        expect(source, file).toContain("describeInventoryRevalidateResult");
        expect(source, file).not.toContain("public inventory cache was not cleared");
      }
    }
  });
});
