import { describe, expect, it } from "vitest";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_02 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-02";
import { assessUsmlePhysicianEducatorBatch } from "./usmle-physician-educator-quality";
import { bankItemToUsmleExam } from "./usmle-bank-bridge";
import { examQuestionToStudy, isAnswerCorrect } from "@/lib/questions/prepare";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("USMLE_PHYSICIAN_EDUCATOR_BATCH_02 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessUsmlePhysicianEducatorBatch(USMLE_PHYSICIAN_EDUCATOR_BATCH_02);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(12);
  });

  it("covers Step 1 and Step 2 with varied systems", () => {
    const steps = { step1: 0, step2: 0 };
    const subjects = new Set<string>();
    for (const q of USMLE_PHYSICIAN_EDUCATOR_BATCH_02) {
      const s = q.ngnPayload?.stepLevel as string;
      if (s === "step1") steps.step1++;
      if (s === "step2") steps.step2++;
      if (q.subjectId) subjects.add(q.subjectId);
    }
    expect(steps.step1).toBeGreaterThanOrEqual(3);
    expect(steps.step2).toBeGreaterThanOrEqual(6);
    expect(subjects.size).toBeGreaterThanOrEqual(8);
  });

  it("is wired into collectHighYieldSeedRows", () => {
    const rows = collectHighYieldSeedRows().filter((r) =>
      r.item.tags?.includes("physician-educator-batch-02")
    );
    expect(rows.length).toBe(12);
  });

  it("computes NNT item correctly", () => {
    const nnt = USMLE_PHYSICIAN_EDUCATOR_BATCH_02.find((q) => q.tags?.includes("NNT"));
    expect(nnt?.correctAnswer).toBe("50");
  });

  it("round-trips PE item through study pipeline", () => {
    const item = USMLE_PHYSICIAN_EDUCATOR_BATCH_02[0]!;
    const study = examQuestionToStudy(
      { ...bankItemToUsmleExam(item, 0), field: "usmle-step-2" },
      0
    );
    expect(study.vignette).toContain("breast cancer");
    expect(isAnswerCorrect(study, [study.correctAnswers[0]!])).toBe(true);
  });
});
