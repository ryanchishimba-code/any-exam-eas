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
import { CLINICAL_REVIEWERS } from "@/lib/marketing/company";
import { buildHomeProofFacts, siteCountsFromSnapshot } from "@/lib/marketing/home-proof";
import type { QuestionBankCountsSnapshot } from "@/lib/marketing/question-bank-counts";
import { formatNclexPrepPriceComparison } from "@/lib/marketing/price-comparison";
import { formatMonthlyPrice } from "@/lib/site";

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
    bankItems: 5417,
    formats: { mcq: 5417, ngn: 0, case: 0 },
    clinical: { standaloneNgn: 10, caseStudies: 10, caseItems: 60 },
  }),
  usmle: units("usmle", 17276),
  naplex: units("naplex", 7300),
  pance: units("pance", 2938),
  "aanp-fnp": units("aanp-fnp", 6103),
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
    expect(site.totalQuestions).toBe(43344);
    expect(questions?.text).toBe(
      `${formatExactQuestionCount(site.totalQuestions)} practice questions`
    );
    expect(questions?.text).toBe("43,344 practice questions");
  });

  it("names the nursing reviewer and the six-board price, with no pass rate", () => {
    const facts = buildHomeProofFacts(siteQuestionCounts(FIXTURE));
    const reviewer = CLINICAL_REVIEWERS.find((person) => person.id === "nursing");
    expect(facts.map((fact) => fact.text)).toContain(
      `NCLEX content review led by ${reviewer?.displayName}`
    );
    expect(facts.map((fact) => fact.text)).toContain("NGN case studies included");
    expect(facts.map((fact) => fact.text)).toContain(
      `${formatMonthlyPrice("pro")}/mo covers all six boards`
    );
    const joined = facts.map((fact) => fact.text).join(" ");
    expect(joined).not.toMatch(/pass rate|% passed|stars|users/i);
    expect(reviewer?.displayName).toMatch(/Ileen Chishimba, RN/);
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
    expect(facts.map((fact) => fact.id)).toEqual(["reviewer", "price"]);
  });

  it("does not hard-code the fixture total in the homepage components", () => {
    const files = [
      "src/components/marketing/elevation/PublicHome.tsx",
      "src/components/marketing/elevation/HomeProofStrip.tsx",
      "src/app/(marketing)/(with-flagship)/page.tsx",
    ];
    for (const file of files) {
      const text = readFileSync(path.resolve(process.cwd(), file), "utf8");
      expect(text).not.toMatch(/43,348|43348|43,344|43344/);
    }
  });
});

describe("homepage price comparison", () => {
  it("states the public range and the monthly price, with no competitor names", () => {
    const line = formatNclexPrepPriceComparison();
    expect(line).toBe(
      "Other NCLEX prep we checked lists at $79 to $399 (public prices, Sep 27, 2026). AnyExamEasy is $27.99 a month, cancel anytime."
    );
    expect(line).not.toMatch(/Kaplan|Archer|UWorld|AMBOSS/i);
    const source = readFileSync(
      path.resolve(process.cwd(), "src/lib/marketing/price-comparison.ts"),
      "utf8"
    );
    expect(source).toMatch(/Kaplan \$99–\$399 course list, Archer \$79–\$399/);
    expect(source).toMatch(/2026-09-27/);
  });
});
