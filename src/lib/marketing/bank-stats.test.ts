import { describe, expect, it } from "vitest";
import {
  MARKETING_QUESTION_COUNTS,
  PUBLISHED_QUESTION_BANK_TOTAL,
  TOTAL_QUESTION_BANK_TARGET,
  TOP_500_DRUGS_COUNT,
  targetQuestionCountForField,
} from "./bank-stats";

describe("marketing bank stats", () => {
  it("derives counts from subject areas × minimum bank size", () => {
    expect(targetQuestionCountForField("nursing")).toBe(7000);
    expect(targetQuestionCountForField("usmle-step-2")).toBe(48_000);
    expect(targetQuestionCountForField("pharmacy")).toBe(6500);
    expect(targetQuestionCountForField("pance")).toBe(6700);
    expect(targetQuestionCountForField("aanp-fnp")).toBe(6000);
    expect(targetQuestionCountForField("npte-pt")).toBe(6000);
    expect(TOTAL_QUESTION_BANK_TARGET).toBeGreaterThan(80_000);
  });

  it("keeps the marketing total at or below the live served bank", () => {
    // Must never advertise the aspirational target — only the published served floor.
    expect(MARKETING_QUESTION_COUNTS.total).toBe("54K+");
    expect(PUBLISHED_QUESTION_BANK_TOTAL).toBeLessThan(TOTAL_QUESTION_BANK_TARGET);
  });

  it("formats marketing labels conservatively from targets", () => {
    expect(MARKETING_QUESTION_COUNTS.nursing).toBe("7K+");
    expect(MARKETING_QUESTION_COUNTS.usmle).toBe("24K+");
    expect(MARKETING_QUESTION_COUNTS.pance).toBe("6K+");
    expect(MARKETING_QUESTION_COUNTS.aanpFnp).toBe("6K+");
    expect(MARKETING_QUESTION_COUNTS.nptePt).toBe("6K+");
    expect(TOP_500_DRUGS_COUNT).toBeGreaterThanOrEqual(500);
  });
});
