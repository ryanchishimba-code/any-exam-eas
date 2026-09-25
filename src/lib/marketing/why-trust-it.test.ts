import { describe, expect, it } from "vitest";
import { NGN_DEMO_QUESTIONS } from "@/lib/demo/ngn-samples";
import { ACTIVE_COUNT_UNAVAILABLE, ACTIVE_QUESTION_DEFINITION } from "@/lib/inventory/active-questions";
import type { BoardInventoryPresentation } from "@/lib/inventory/active-questions";
import type { LandingSuccessStory } from "@/lib/landing/content";
import {
  TRUST_PASS_PATH,
  TRUST_READINESS_LINE,
  citedSampleForBoard,
  pricingHeadlineFromContext,
  testimonialsForBoard,
  trustInventoryForPresentation,
  trustInventoryLine,
} from "@/lib/marketing/why-trust-it";

const LIVE: BoardInventoryPresentation = {
  formatLine: "5,598 MCQ · 492 NGN · 153 cases",
  definition: ACTIVE_QUESTION_DEFINITION,
  categories: [{ id: "management-of-care", label: "Management of Care", count: 100 }],
  categoryLabel: "Client Needs",
  scopeNote: null,
  countSource: "active-inventory",
  activeCount: 6243,
};

function story(overrides: Partial<LandingSuccessStory> = {}): LandingSuccessStory {
  return {
    quote: "The bow-tie items matched what I practiced.",
    name: "A. Rivera",
    exam: "NCLEX-RN",
    initials: "AR",
    outcome: "",
    avatarGradient: "linear-gradient(#000,#111)",
    ...overrides,
  };
}

describe("why trust it facts", () => {
  it("prefixes the page format line and does not invent a split", () => {
    expect(trustInventoryLine("NCLEX", LIVE.formatLine)).toBe(
      "NCLEX 5,598 MCQ · 492 NGN · 153 cases"
    );
    expect(trustInventoryLine("NCLEX", null)).toBeNull();
    expect(trustInventoryLine("NCLEX", "   ")).toBeNull();
  });

  it("uses the live format line only when the inventory says it is live", () => {
    expect(trustInventoryForPresentation("nclex", LIVE).line).toBe(
      "NCLEX 5,598 MCQ · 492 NGN · 153 cases"
    );
    expect(trustInventoryForPresentation("nclex", LIVE).definition).toBe(
      ACTIVE_QUESTION_DEFINITION
    );
    const floor: BoardInventoryPresentation = {
      ...LIVE,
      formatLine: null,
      countSource: "published-floor",
      definition: ACTIVE_COUNT_UNAVAILABLE,
      activeCount: null,
      categories: [],
    };
    const shown = trustInventoryForPresentation("naplex", floor);
    expect(shown.line).toBeNull();
    expect(shown.live).toBe(false);
    expect(shown.definition).toBe(ACTIVE_COUNT_UNAVAILABLE);
  });

  it("quotes the NCLEX demo rationale and its stored citation", () => {
    const sample = citedSampleForBoard("nclex");
    const source = NGN_DEMO_QUESTIONS[0]!;
    expect(sample).toEqual({
      boardLabel: "NCLEX",
      rationale: source.explanation,
      citation: source.references?.[0],
    });
    expect(sample?.citation).toMatch(/Open RN/);
    expect(sample?.rationale).not.toMatch(/pass rate|% of students|testimonial/i);
  });

  it("does not borrow the NCLEX citation for boards whose samples have none", () => {
    expect(citedSampleForBoard("naplex")).toBeNull();
    expect(citedSampleForBoard("usmle")).toBeNull();
    expect(citedSampleForBoard("pance")).toBeNull();
    expect(citedSampleForBoard("aanp-fnp")).toBeNull();
    expect(citedSampleForBoard("npte-pt")).toBeNull();
  });

  it("states the pass path and refuses a licensure prediction", () => {
    expect(TRUST_PASS_PATH).toEqual([
      "Study guide",
      "Qbank",
      "Review incorrect",
      "Readiness Proof",
      "Full exam",
    ]);
    expect(TRUST_READINESS_LINE).toBe("Practice readiness, not a licensure prediction.");
    expect(TRUST_READINESS_LINE).not.toMatch(/pass rate|guarantee/i);
  });

  it("renders testimonials only from real approved rows for that board", () => {
    expect(testimonialsForBoard([], "nclex")).toEqual([]);
    expect(testimonialsForBoard(undefined, "nclex")).toEqual([]);
    expect(
      testimonialsForBoard([story({ quote: "  ", name: "A. Rivera" })], "nclex")
    ).toEqual([]);
    const kept = testimonialsForBoard(
      [story(), story({ exam: "NAPLEX", name: "B. Chen", quote: "Calc sets helped." })],
      "nclex"
    );
    expect(kept).toHaveLength(1);
    expect(kept[0]?.name).toBe("A. Rivera");
    expect(testimonialsForBoard([story()], "naplex")).toEqual([]);
  });
});

describe("pricing board headline", () => {
  it("stays Pro without a board, and names the board from field or referrer", () => {
    expect(pricingHeadlineFromContext({})).toBe("Pro");
    expect(pricingHeadlineFromContext({ field: "nursing" })).toBe("NCLEX-RN prep");
    expect(pricingHeadlineFromContext({ field: "pharmacy" })).toBe("NAPLEX prep");
    expect(pricingHeadlineFromContext({ field: "usmle-step-2" })).toBe("USMLE prep");
    expect(pricingHeadlineFromContext({ exam: "aanp-fnp" })).toBe("AANP FNP prep");
    expect(
      pricingHeadlineFromContext({
        referrerPath: "/nclex",
        referrerField: null,
      })
    ).toBe("NCLEX-RN prep");
    expect(
      pricingHeadlineFromContext({
        field: "pharmacy",
        referrerPath: "/nclex",
      })
    ).toBe("NAPLEX prep");
    expect(pricingHeadlineFromContext({ field: "not-a-board" })).toBe("Pro");
  });
});
