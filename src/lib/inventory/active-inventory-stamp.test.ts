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
  const isrHubs = [
    "src/app/nclex/page.tsx",
    "src/app/(marketing)/(with-flagship)/[examSlug]/page.tsx",
    "src/app/(marketing)/(with-flagship)/page.tsx",
    "src/app/(marketing)/(with-flagship)/about/page.tsx",
    "src/app/(marketing)/(with-flagship)/free-guides/page.tsx",
    "src/app/(marketing)/(with-flagship)/how-questions-are-reviewed/page.tsx",
    "src/app/(marketing)/(with-flagship)/compare/page.tsx",
  ];
  const dynamicSurfaces = ["src/app/api/marketing/bank-counts/route.ts"];
  const scripts = ["scripts/retire-near-duplicates.ts", "scripts/remediate-text-flags.ts"];

  it("serves public count pages from a 5-minute ISR and keeps the counts API dynamic", () => {
    for (const file of isrHubs) {
      const source = readFileSync(path.join(process.cwd(), file), "utf8");
      expect(source, file).toContain("export const revalidate = 300");
      expect(source, file).toContain("ACTIVE_INVENTORY_STAMP_TTL_SECONDS");
      expect(source, file).toContain("dynamic: false");
      expect(source, file).not.toContain('dynamic = "force-dynamic"');
    }
    for (const file of dynamicSurfaces) {
      const source = readFileSync(path.join(process.cwd(), file), "utf8");
      expect(source, file).toContain('dynamic = "force-dynamic"');
      expect(source, file).not.toMatch(/export const revalidate = \d+/);
    }
    for (const file of scripts) {
      const source = readFileSync(path.join(process.cwd(), file), "utf8");
      expect(source, file).toContain("describeInventoryRevalidateResult");
      expect(source, file).not.toContain("public inventory cache was not cleared");
    }
  });
});
