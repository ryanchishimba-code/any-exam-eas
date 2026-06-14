import { describe, expect, it } from "vitest";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_03 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-03";
import { assessUsmlePhysicianEducatorBatch } from "./usmle-physician-educator-quality";
import { bankItemToUsmleExam } from "./usmle-bank-bridge";
import { examQuestionToStudy, isAnswerCorrect } from "@/lib/questions/prepare";
import { collectHighYieldSeedRows } from "./high-yield-index";

describe("USMLE_PHYSICIAN_EDUCATOR_BATCH_03 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessUsmlePhysicianEducatorBatch(USMLE_PHYSICIAN_EDUCATOR_BATCH_03);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(12);
  });

  it("covers Step 1 and Step 2 with varied systems", () => {
    const steps = { step1: 0, step2: 0 };
    const subjects = new Set<string>();
    for (const q of USMLE_PHYSICIAN_EDUCATOR_BATCH_03) {
      const s = q.ngnPayload?.stepLevel as string;
      if (s === "step1") steps.step1++;
      if (s === "step2") steps.step2++;
      if (q.subjectId) subjects.add(q.subjectId);
    }
    expect(steps.step1).toBeGreaterThanOrEqual(2);
    expect(steps.step2).toBeGreaterThanOrEqual(8);
    expect(subjects.size).toBeGreaterThanOrEqual(9);
  });

  it("is wired into collectHighYieldSeedRows", () => {
    const batchItems = new Set(USMLE_PHYSICIAN_EDUCATOR_BATCH_03);
    const rows = collectHighYieldSeedRows().filter((r) => batchItems.has(r.item));
    expect(rows.length).toBe(12);
  });

  it("uses clean diagnosis labels without management language", () => {
    const meningitis = USMLE_PHYSICIAN_EDUCATOR_BATCH_03.find((q) =>
      q.tags?.includes("meningitis")
    );
    expect(meningitis?.correctAnswer).toBe("Acute bacterial meningitis");
    expect(meningitis?.correctAnswer).not.toMatch(/empiric|pending culture/i);
    for (const item of USMLE_PHYSICIAN_EDUCATOR_BATCH_03) {
      expect(item.correctAnswer).not.toMatch(/empiric therapy required|pending culture/i);
    }
  });

  it("round-trips meningitis item through study pipeline", () => {
    const item = USMLE_PHYSICIAN_EDUCATOR_BATCH_03[0]!;
    const study = examQuestionToStudy(
      { ...bankItemToUsmleExam(item, 0), field: "usmle-step-2" },
      0
    );
    expect(study.vignette).toContain("neck stiffness");
    expect(isAnswerCorrect(study, [study.correctAnswers[0]!])).toBe(true);
  });
});
