import { describe, expect, it } from "vitest";
import {
  MARKETING_QUESTION_COUNTS,
  TOTAL_QUESTION_BANK_TARGET,
  TOP_500_DRUGS_COUNT,
  targetQuestionCountForField,
} from "./bank-stats";

describe("marketing bank stats", () => {
  it("derives counts from subject areas × minimum bank size", () => {
    expect(targetQuestionCountForField("nursing")).toBe(24_000);
    expect(targetQuestionCountForField("usmle-step-2")).toBe(18_000);
    expect(targetQuestionCountForField("pharmacy")).toBe(24_000);
    expect(targetQuestionCountForField("pance")).toBe(6000);
    expect(targetQuestionCountForField("aanp-fnp")).toBe(6000);
    expect(targetQuestionCountForField("npte-pt")).toBe(4000);
    expect(TOTAL_QUESTION_BANK_TARGET).toBeGreaterThan(80_000);
  });

  it("formats marketing labels conservatively from targets", () => {
    expect(MARKETING_QUESTION_COUNTS.total).toBe("82K+");
    expect(MARKETING_QUESTION_COUNTS.nursing).toBe("24K+");
    expect(MARKETING_QUESTION_COUNTS.usmle).toBe("18K+");
    expect(MARKETING_QUESTION_COUNTS.pance).toBe("6K+");
    expect(MARKETING_QUESTION_COUNTS.aanpFnp).toBe("6K+");
    expect(MARKETING_QUESTION_COUNTS.nptePt).toBe("4K+");
    expect(TOP_500_DRUGS_COUNT).toBeGreaterThanOrEqual(500);
  });
});
