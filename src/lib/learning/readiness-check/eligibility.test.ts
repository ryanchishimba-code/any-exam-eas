import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReadinessEligibilityRow } from "@/lib/learning/readiness-check/eligibility";

const gate = vi.hoisted(() => ({ pass: true }));

vi.mock("@/lib/exam-prep/bank-ingest-gate", () => ({
  bankItemPassesIngestGate: () => gate.pass,
}));

import {
  isSelectAllStemWithOneKey,
  isStandardSingleAnswerMcq,
  readinessEligibilityWhere,
  readinessItemHasOpenQaFlag,
  readinessItemIsEligible,
  selectReadinessItems,
} from "@/lib/learning/readiness-check/eligibility";

function mcq(overrides: Partial<ReadinessEligibilityRow> = {}): ReadinessEligibilityRow {
  return {
    id: "clean",
    fieldId: "nursing",
    active: true,
    qaPassed: true,
    itemType: "mcq",
    question: "Which finding should the nurse report before giving the dose?",
    options: ["Potassium 3.0 mEq/L", "Clear lung sounds", "Walked the hall", "Heart rate 78"],
    correctAnswer: "Potassium 3.0 mEq/L",
    explanation: "A low potassium is reported before a loop diuretic.",
    reviewFlag: false,
    reviewStatus: null,
    qualityScore: 6,
    ...overrides,
  };
}

describe("readiness item eligibility", () => {
  beforeEach(() => {
    gate.pass = true;
  });

  it("keeps a standard single-answer MCQ and rejects SATA, NGN, and a one-key select-all stem", () => {
    expect(readinessItemIsEligible(mcq())).toBe(true);
    expect(isStandardSingleAnswerMcq(mcq({ itemType: "sata" }))).toBe(false);
    expect(readinessItemIsEligible(mcq({ itemType: "select_all" }))).toBe(false);
    expect(readinessItemIsEligible(mcq({ itemType: "bow_tie" }))).toBe(false);
    expect(readinessItemIsEligible(mcq({ itemType: "matrix" }))).toBe(false);
    expect(readinessItemIsEligible(mcq({ itemType: "ordered_response" }))).toBe(false);
    expect(readinessItemIsEligible(mcq({ itemType: "k_type" }))).toBe(false);
    expect(readinessItemIsEligible(mcq({ ngnPayload: { kind: "highlight" } }))).toBe(false);

    const oneKey = mcq({
      question: "Select all that apply. Which findings require a call to the provider?",
    });
    expect(isSelectAllStemWithOneKey(oneKey)).toBe(true);
    expect(readinessItemIsEligible(oneKey)).toBe(false);
  });

  it("rejects the QA gate, pending review, item-QA codes, and retired rows that are still active", () => {
    expect(readinessItemHasOpenQaFlag(mcq({ reviewFlag: true }))).toBe(true);
    expect(readinessItemIsEligible(mcq({ reviewStatus: "pending" }))).toBe(false);
    expect(readinessItemIsEligible(mcq({ reviewStatus: "flagged" }))).toBe(false);
    expect(readinessItemIsEligible(mcq({ qaPassed: false }))).toBe(false);
    expect(
      readinessItemIsEligible(
        mcq({
          curationMeta: {
            itemQa: {
              pipeline: "item-qa-v1",
              checkedAt: "2026-09-01T00:00:00.000Z",
              codes: ["fails_schema"],
              summary: "Needs a person.",
            },
          },
        })
      )
    ).toBe(false);
    expect(
      readinessItemIsEligible(
        mcq({
          active: true,
          curationMeta: {
            itemQa: {
              pipeline: "item-qa-v1",
              checkedAt: "2026-09-01T00:00:00.000Z",
              codes: [],
              summary: "Retired.",
              retiredAt: "2026-09-01T00:00:00.000Z",
              retiredReason: "empty_stem",
            },
          },
        })
      )
    ).toBe(false);
    gate.pass = false;
    expect(readinessItemIsEligible(mcq())).toBe(false);
  });

  it("rejects a row the student-eligibility rule suppresses", () => {
    const retired = mcq({
      curationMeta: {
        itemQa: {
          retiredAt: "2026-09-01T00:00:00.000Z",
          retiredReason: "empty_stem",
        },
      },
    });
    expect(readinessItemHasOpenQaFlag(retired)).toBe(false);
    expect(isStandardSingleAnswerMcq(retired)).toBe(true);
    expect(readinessItemIsEligible(retired)).toBe(false);
    expect(selectReadinessItems([retired, mcq({ id: "clean-mcq" })], 2, undefined, () => 0).map((row) => row.id)).toEqual([
      "clean-mcq",
    ]);
  });

  it("keeps a null review flag, and the query does not drop those rows", () => {
    expect(readinessItemHasOpenQaFlag(mcq({ reviewFlag: null }))).toBe(false);
    expect(readinessItemIsEligible(mcq({ reviewFlag: null, reviewStatus: null }))).toBe(true);
    const where = readinessEligibilityWhere();
    expect(JSON.stringify(where)).not.toContain('{"NOT":{"reviewFlag":true}}');
    expect(where).toMatchObject({
      AND: expect.arrayContaining([
        { OR: [{ reviewFlag: null }, { reviewFlag: false }] },
        {
          OR: [
            { reviewStatus: null },
            {
              AND: expect.arrayContaining([
                { NOT: { reviewStatus: { in: ["flagged", "rejected", "pending"] } } },
              ]),
            },
          ],
        },
      ]),
    });
  });

  it("can require an approved review without a second call-site rule", () => {
    const policy = { requireApprovedReview: true };
    expect(readinessItemIsEligible(mcq(), policy)).toBe(false);
    expect(readinessItemIsEligible(mcq({ reviewStatus: "approved" }), policy)).toBe(true);
    expect(readinessItemIsEligible(mcq({ reviewFlag: true, reviewStatus: "approved" }), policy)).toBe(false);
    const where = readinessEligibilityWhere(policy);
    expect(where).toMatchObject({
      AND: expect.arrayContaining([{ reviewStatus: "approved" }, { qaPassed: true }, { active: true }]),
    });
  });

  it("prefers a higher quality score and does not pad with flagged or SATA items", () => {
    const picked = selectReadinessItems(
      [
        mcq({ id: "flagged", reviewFlag: true, qualityScore: 10 }),
        mcq({ id: "sata", itemType: "sata", qualityScore: 9.5 }),
        mcq({ id: "low", qualityScore: 4 }),
        mcq({ id: "high", qualityScore: 9.2, keepRecommendation: true }),
        mcq({ id: "mid", qualityScore: 7 }),
      ],
      2,
      undefined,
      () => 0.999
    );
    expect(picked.map((row) => row.id)).toEqual(["high", "mid"]);
  });

  it("returns a short list when the clean pool is smaller than the ask", () => {
    const picked = selectReadinessItems(
      [mcq({ id: "only", qualityScore: 5 }), mcq({ id: "needs-human", reviewFlag: true, qualityScore: 9 })],
      3,
      undefined,
      () => 0
    );
    expect(picked.map((row) => row.id)).toEqual(["only"]);
  });
});
