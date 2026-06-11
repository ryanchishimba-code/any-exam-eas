import { describe, expect, it } from "vitest";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-01";
import {
  assessUsmlePhysicianEducatorBatch,
} from "./usmle-physician-educator-quality";
import { bankItemToUsmleExam } from "./usmle-bank-bridge";
import { examQuestionToStudy, isAnswerCorrect } from "@/lib/questions/prepare";
import { collectHighYieldSeedRows } from "./high-yield-index";
import { serializeBankOptions, parseBankOptions } from "@/lib/mpje/parse-bank-options";

describe("USMLE_PHYSICIAN_EDUCATOR_BATCH_01 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessUsmlePhysicianEducatorBatch(USMLE_PHYSICIAN_EDUCATOR_BATCH_01);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(12);
  });

  it("includes Step 1 and Step 2 CK coverage", () => {
    const steps = { step1: 0, step2: 0, step3: 0 };
    for (const q of USMLE_PHYSICIAN_EDUCATOR_BATCH_01) {
      const s = q.ngnPayload?.stepLevel as string;
      if (s in steps) steps[s as keyof typeof steps]++;
    }
    expect(steps.step1).toBeGreaterThanOrEqual(3);
    expect(steps.step2).toBeGreaterThanOrEqual(6);
    expect(steps.step3).toBe(0);
  });

  it("uses five-option MCQ format with unique distractors", () => {
    for (const item of USMLE_PHYSICIAN_EDUCATOR_BATCH_01) {
      expect(item.options).toHaveLength(5);
      expect(new Set(item.options).size).toBe(5);
      expect(item.options).toContain(item.correctAnswer);
    }
  });

  it("is wired into collectHighYieldSeedRows for bank sync", () => {
    const batchItems = new Set(USMLE_PHYSICIAN_EDUCATOR_BATCH_01);
    const rows = collectHighYieldSeedRows().filter((r) => batchItems.has(r.item));
    expect(rows.length).toBe(12);
    expect(rows.some((r) => r.fieldId === "usmle-step-1")).toBe(true);
    expect(rows.some((r) => r.fieldId === "usmle-step-2")).toBe(true);
  });

  it("round-trips hyperkalemia item through study pipeline", () => {
    const item = USMLE_PHYSICIAN_EDUCATOR_BATCH_01[0]!;
    expect(item.vignette).toContain("K⁺ 6.8");
    const exam = bankItemToUsmleExam(item, 0);
    const study = examQuestionToStudy({ ...exam, field: "usmle-step-2" }, 0);
    expect(study.vignette).toContain("dialysis");
    expect(isAnswerCorrect(study, [study.correctAnswers[0]!])).toBe(true);
  });

  it("serializes options for Neon QuestionBankItem import", () => {
    const item = USMLE_PHYSICIAN_EDUCATOR_BATCH_01[0]!;
    const raw = serializeBankOptions(item);
    const parsed = parseBankOptions(raw);
    expect(parsed.options).toHaveLength(5);
    expect(parsed.options).toContain(item.correctAnswer);
  });
});
