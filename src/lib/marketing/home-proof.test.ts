import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  boardQuestionUnits,
  formatExactQuestionCount,
  siteQuestionCounts,
  type BoardQuestionUnits,
  type CountBoardSlug,
} from "@/lib/counts";
import { buildHomeProofFacts, siteCountsFromSnapshot } from "@/lib/marketing/home-proof";
import type { QuestionBankCountsSnapshot } from "@/lib/marketing/question-bank-counts";
import { buildHomePrepPriceBarChartData } from "@/lib/marketing/prep-price-bar-chart";

function units(slug: CountBoardSlug, bankItems: number, clinical?: BoardQuestionUnits): BoardQuestionUnits {
  if (clinical) return clinical;
  return boardQuestionUnits({
    slug,
    bankItems,
    formats: { mcq: bankItems, ngn: 0, case: 0 },
  });
}

const FIXTURE = {
  nclex: boardQuestionUnits({
    slug: "nclex",
    bankItems: 5413,
    formats: { mcq: 5413, ngn: 0, case: 0 },
    clinical: { standaloneNgn: 10, caseStudies: 10, caseItems: 60 },
  }),
  usmle: units("usmle", 17276),
  naplex: units("naplex", 7300),
  pance: units("pance", 2938),
  "aanp-fnp": units("aanp-fnp", 6101),
  "npte-pt": units("npte-pt", 4240),
} satisfies Record<CountBoardSlug, BoardQuestionUnits>;

function snapshot(
  boards: Record<CountBoardSlug, BoardQuestionUnits>,
  degraded = false
): QuestionBankCountsSnapshot {
  return {
    fields: {} as QuestionBankCountsSnapshot["fields"],
    boards,
    totals: { total: 0, active: 0, served: 0 },
    updatedAt: "2026-09-27T00:00:00.000Z",
    degraded,
  };
}

describe("homepage proof facts", () => {
  it("uses the scored-item total from counts.ts", () => {
    const site = siteQuestionCounts(FIXTURE);
    const facts = buildHomeProofFacts(site);
    const questions = facts.find((fact) => fact.id === "questions");
    expect(site.totalQuestions).toBe(43338);
    expect(questions?.text).toBe(
      `${formatExactQuestionCount(site.totalQuestions)} practice questions`
    );
    expect(questions?.text).toBe("43,338 practice questions");
  });

  it("names live questions and NGN, and keeps the price out of the strip", () => {
    const facts = buildHomeProofFacts(siteQuestionCounts(FIXTURE));
    expect(facts.map((fact) => fact.id)).toEqual(["questions", "ngn"]);
    expect(facts.map((fact) => fact.text)).toContain("NGN case studies included");
    const joined = facts.map((fact) => fact.text).join(" ");
    expect(joined).not.toMatch(/\$|\/mo|pass rate|% passed|stars|users|24\/7/i);
  });

  it("omits the NGN line when NCLEX has no case studies", () => {
    const boards = {
      ...FIXTURE,
      nclex: boardQuestionUnits({
        slug: "nclex",
        bankItems: 100,
        formats: { mcq: 100, ngn: 0, case: 0 },
      }),
    };
    const facts = buildHomeProofFacts(siteQuestionCounts(boards));
    expect(facts.some((fact) => fact.id === "ngn")).toBe(false);
    expect(facts.some((fact) => fact.id === "questions")).toBe(true);
  });

  it("omits bank facts when the snapshot is degraded", () => {
    expect(siteCountsFromSnapshot(snapshot(FIXTURE, true))).toBeNull();
    const facts = buildHomeProofFacts(null);
    expect(facts).toEqual([]);
  });

  it("does not hard-code the fixture total in the homepage components", () => {
    const files = [
      "src/components/marketing/elevation/PublicHome.tsx",
      "src/components/marketing/elevation/HomeProofStrip.tsx",
      "src/components/marketing/elevation/HomePassVideo.tsx",
      "src/components/marketing/elevation/HomeQuickBites.tsx",
      "src/components/marketing/elevation/HomeCompare.tsx",
      "src/lib/marketing/home-compare.ts",
      "src/app/(marketing)/(with-flagship)/page.tsx",
      "src/app/(marketing)/(with-flagship)/how-to-pass/page.tsx",
    ];
    for (const file of files) {
      const text = readFileSync(path.resolve(process.cwd(), file), "utf8");
      expect(text).not.toMatch(/43,348|43348|43,344|43344|43,342|43342|43,338|43338/);
    }
  });
});

describe("homepage pricing band", () => {
  it("states Pro monthly pricing without third-party price comparisons", () => {
    const data = buildHomePrepPriceBarChartData();
    const serialized = JSON.stringify(data);
    expect(serialized).toMatch(/\$27\.99\/mo/);
    expect(serialized).not.toMatch(/\$139|\$349|Save \$|typical prep/i);
    expect(data.bars).toHaveLength(1);
  });
});
