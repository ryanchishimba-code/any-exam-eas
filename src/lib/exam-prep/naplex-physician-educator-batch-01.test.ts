import { describe, expect, it } from "vitest";
import { NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/naplex-physician-educator-batch-01";
import { assessNaplexPhysicianEducatorBatch } from "./naplex-physician-educator-quality";
import { bankItemToNaplexExam } from "./naplex-bank-bridge";
import { examQuestionToStudy, isAnswerCorrect } from "@/lib/questions/prepare";
import { collectHighYieldSeedRows } from "./high-yield-index";
import { serializeBankOptions, parseBankOptions } from "@/lib/mpje/parse-bank-options";

describe("NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01 QA", () => {
  it("passes physician-educator quality gate", () => {
    const report = assessNaplexPhysicianEducatorBatch(NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01);
    expect(report.ok).toBe(true);
    expect(report.itemCount).toBe(12);
  });

  it("includes case, SATA, calc, and MCQ formats", () => {
    const types = new Set(NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01.map((q) => q.itemType));
    expect(types.has("case_based")).toBe(true);
    expect(types.has("select_all")).toBe(true);
    expect(types.has("constructed_response")).toBe(true);
    expect(types.has("vignette")).toBe(true);
  });

  it("verifies calculation answers for IV rate and amoxicillin volume", () => {
    const calcs = NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01.filter(
      (q) => q.itemType === "constructed_response"
    );
    expect(calcs).toHaveLength(2);
    const answers = calcs.map((q) => q.correctAnswer).sort();
    expect(answers).toEqual(["180", "250"]);
  });

  it("is wired into collectHighYieldSeedRows for pharmacy bank sync", () => {
    const rows = collectHighYieldSeedRows().filter((r) =>
      r.item.tags?.includes("physician-educator-batch-01")
    );
    expect(rows.length).toBe(12);
    expect(rows.every((r) => r.fieldId === "pharmacy")).toBe(true);
  });

  it("round-trips KCl rate calc through study pipeline", () => {
    const item = NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01[2]!;
    expect(item.correctAnswer).toBe("250");
    const exam = bankItemToNaplexExam(item, 0);
    const study = examQuestionToStudy({ ...exam, field: "pharmacy" }, 0);
    expect(study.type).toBe("short_answer");
    expect(isAnswerCorrect(study, ["250"])).toBe(true);
  });

  it("serializes SATA options for Neon QuestionBankItem import", () => {
    const item = NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01[1]!;
    const raw = serializeBankOptions(item);
    const parsed = parseBankOptions(raw);
    expect(parsed.options.length).toBeGreaterThanOrEqual(4);
    for (const part of item.correctAnswer.split(",")) {
      expect(parsed.options).toContain(part.trim());
    }
  });
});
