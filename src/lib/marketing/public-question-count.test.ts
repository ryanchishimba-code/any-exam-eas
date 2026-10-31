import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatExactQuestionCount, formatRoundedDownQuestionCount } from "@/lib/counts";
import { buildHomeProofFacts, siteCountsFromSnapshot } from "@/lib/marketing/home-proof";
import { buildLandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";
import { bundleFromServedCounts, staticQuestionCountLabel } from "@/lib/marketing/public-question-count";
import { inventoryFromLiveFieldCounts } from "@/lib/marketing/served-question-counts";

describe("staticQuestionCountLabel", () => {
  it("floors the live total and never claims more than that total", () => {
    expect(staticQuestionCountLabel(43475)).toBe("43,400+");
    expect(staticQuestionCountLabel(43475)).toBe(formatRoundedDownQuestionCount(43475));
    expect(staticQuestionCountLabel(43338)).toBe("43,300+");
    expect(staticQuestionCountLabel(99)).toBe("99");
    expect(staticQuestionCountLabel(0)).toBe("");
    expect(staticQuestionCountLabel(Number.NaN)).toBe("");

    for (const total of [43475, 43338, 43210, 100]) {
      const label = staticQuestionCountLabel(total);
      const floor = Number(label.replace(/[^0-9]/g, ""));
      expect(floor).toBeLessThanOrEqual(total);
      expect(label.endsWith("+")).toBe(true);
      expect(label).not.toBe(formatExactQuestionCount(total));
    }
  });
});

const MARKETING_COPY_ROOTS = [
  "src/app/(marketing)",
  "src/app/nclex",
  "src/components/marketing",
  "src/components/landing",
  "src/components/home",
  "src/components/pricing",
  "src/components/seo",
  "src/components/compare",
  "src/components/checkout",
  "src/lib/seo",
];

/** A thousands-formatted total written into copy, not a color channel. */
const HARDCODED_TOTAL = /(?<![\d.(])\d{2},\d{3}\+?(?!\d)/;
const STAMP_CALL = /publishedSiteQuestionCounts|PUBLISHED_BOARD_UNITS/;

function walk(dir: string, out: string[] = []): string[] {
  let names: string[];
  try {
    names = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of names) {
    if (name === "node_modules" || name === ".next") continue;
    const full = path.join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (/\.(tsx|ts|jsx|js)$/.test(name) && !/\.test\./.test(name)) out.push(full);
  }
  return out;
}

const ISR_PAGE_FILES = [
  "src/app/(marketing)/(with-flagship)/page.tsx",
  "src/app/(marketing)/pricing/page.tsx",
  "src/app/(marketing)/(with-flagship)/about/page.tsx",
  "src/app/(marketing)/(with-flagship)/compare/page.tsx",
  "src/app/(marketing)/(with-flagship)/free-guides/page.tsx",
  "src/app/(marketing)/(with-flagship)/how-questions-are-reviewed/page.tsx",
  "src/app/(marketing)/(with-flagship)/[examSlug]/page.tsx",
  "src/app/nclex/page.tsx",
];

describe("homepage counts use the served gate", () => {
  it("floors the bank total and leaves catalog NGN out of the hero", () => {
    const bundle = bundleFromServedCounts({
      inventory: inventoryFromLiveFieldCounts({
        byField: {
          nursing: 3947,
          pharmacy: 4411,
          "usmle-step-1": 3170,
          "usmle-step-2": 5165,
          "usmle-step-3": 8407,
          pance: 2559,
          "aanp-fnp": 5136,
          "npte-pt": 1748,
        },
        itemTypesByField: {},
      }),
      live: null,
      clinical: {
        nclex: { standaloneNgn: 66, caseStudies: 39, caseItems: 234 },
      },
    });
    expect(bundle).not.toBeNull();
    const display = buildLandingBankCountsDisplay(bundle!.snapshot);
    const proof = buildHomeProofFacts(siteCountsFromSnapshot(bundle!.snapshot));

    expect(display.totalServed).toBe(34_543);
    expect(display.totalLabel).toBe("34,543");
    expect(staticQuestionCountLabel(display.totalServed)).toBe("34,500+");
    expect(display.roundedDown).toBe("34,500+");
    expect(proof[0]?.text).toBe("34,543 practice questions");
    expect(display.exams.find((exam) => exam.slug === "nclex")?.served).toBe(3947);
    expect(display.exams.find((exam) => exam.slug === "nclex")?.countLabel).toBe("3,947");
    expect(bundle!.snapshot.boards?.nclex?.caseItems).toBe(234);
    expect(display.totalServed).not.toBe(34_543 + 300);
  });
});

describe("marketing pages keep the question count on the ISR path", () => {
  it("does not call the Upstash bank-counts cache from a page module", () => {
    const loader = readFileSync(
      path.resolve(process.cwd(), "src/lib/marketing/public-question-count.ts"),
      "utf8"
    );
    expect(loader).toContain("unstable_cache");
    expect(loader).toContain("loadServedQuestionCounts");
    expect(loader).toContain("public-served-bank-stats-v1");
    expect(loader).not.toContain("getCachedBankStatsBundle");
    expect(loader).not.toContain("fetchActiveInventoryFromDb");
    expect(loader).not.toMatch(/cacheGetOrSetDeduped|getPublicBankStatsBundle|upstash|redisCache/);

    for (const file of ISR_PAGE_FILES) {
      const text = readFileSync(path.resolve(process.cwd(), file), "utf8");
      expect(text, file).toContain("loadPublicQuestionCounts({ dynamic: false })");
      expect(text, file).toContain("export const revalidate = 300");
      expect(text, file).not.toMatch(/getPublicBankStatsBundle|cacheGetOrSetDeduped|upstash/);
    }
  });
});

describe("marketing copy does not hard-code a question total", () => {
  it("fails when a page or component renders a frozen bank total", () => {
    const hits: string[] = [];
    for (const root of MARKETING_COPY_ROOTS) {
      for (const file of walk(path.resolve(process.cwd(), root))) {
        const text = readFileSync(file, "utf8");
        if (HARDCODED_TOTAL.test(text) || STAMP_CALL.test(text)) {
          hits.push(path.relative(process.cwd(), file));
        }
      }
    }
    expect(hits).toEqual([]);
  });
});
