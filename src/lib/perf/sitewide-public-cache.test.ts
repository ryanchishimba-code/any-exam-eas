import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

const PUBLIC_ISR = [
  "src/app/(marketing)/(with-flagship)/page.tsx",
  "src/app/nclex/page.tsx",
  "src/app/(marketing)/(with-flagship)/[examSlug]/page.tsx",
  "src/app/(marketing)/pricing/page.tsx",
  "src/app/(marketing)/(with-flagship)/about/page.tsx",
  "src/app/(marketing)/(with-flagship)/compare/page.tsx",
  "src/app/(marketing)/(with-flagship)/free-guides/page.tsx",
  "src/app/(marketing)/(with-flagship)/how-questions-are-reviewed/page.tsx",
  "src/app/(marketing)/(with-flagship)/blog/page.tsx",
  "src/app/(marketing)/(with-flagship)/daily/page.tsx",
  "src/app/(marketing)/(with-flagship)/daily/[exam]/page.tsx",
] as const;

describe("public pages for every board stay cacheable", () => {
  it("keeps marketing and question-of-the-day pages off force-dynamic", () => {
    for (const file of PUBLIC_ISR) {
      const text = source(file);
      expect(text, file).not.toContain('dynamic = "force-dynamic"');
      expect(text, file).toMatch(/export const revalidate = \d+/);
    }
  });

  it("prerenders all six board hubs", () => {
    const hubs = source("src/app/(marketing)/(with-flagship)/[examSlug]/page.tsx");
    const seo = source("src/lib/seo/exam-config.ts");
    for (const slug of ["nclex", "usmle", "naplex", "pance", "aanp-fnp", "npte-pt"]) {
      expect(seo).toContain(`"${slug}"`);
    }
    expect(hubs).toContain("examSlug !== \"nclex\"");
    expect(source("src/app/nclex/page.tsx")).toContain("export const revalidate = 300");
    const daily = source("src/app/(marketing)/(with-flagship)/daily/[exam]/page.tsx");
    expect(daily).toContain("EXAM_SLUGS.map");
    expect(daily).toContain("export const revalidate = 60");
  });

  it("caches a dated question for a day and does not bake it as force-dynamic", () => {
    const dated = source("src/app/(marketing)/(with-flagship)/daily/[exam]/[date]/page.tsx");
    expect(dated).toContain("export const revalidate = 86400");
    expect(dated).not.toContain('dynamic = "force-dynamic"');
  });

  it("keeps signed-in surfaces dynamic", () => {
    for (const file of [
      "src/app/(app)/question-bank/page.tsx",
      "src/app/(app)/nclex/study-guide/page.tsx",
      "src/app/(app)/naplex/study-guide/page.tsx",
      "src/app/(app)/aanp-fnp/study-guide/page.tsx",
      "src/app/signup/page.tsx",
    ]) {
      expect(source(file), file).toContain('dynamic = "force-dynamic"');
    }
  });
});
