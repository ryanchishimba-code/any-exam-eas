import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { resolveExamComposeConfig } from "@/lib/exam-prep/compose/exam-compose-config";
import { composeValidatedExamFromPool } from "@/lib/exam-prep/exam-qa-engine";
import {
  PRESET_EXAM_MAX,
  PRESET_EXAM_QUESTION_COUNT,
  clampPresetExamNumber,
  resolvePresetComposeSlug,
} from "@/lib/exam-prep/preset-exam-config";

function uniqueItem(id: string, subjectId: string, n: number): BankItem {
  const diseases = [
    "celiac sprue",
    "sarcoidosis",
    "hypertrophic cardiomyopathy",
    "Guillain-Barré syndrome",
    "polycythemia vera",
    "Addison disease",
    "myasthenia gravis",
    "Wilson disease",
    "pheochromocytoma",
    "systemic sclerosis",
  ];
  const disease = diseases[n % diseases.length]!;
  const vignette = `A ${22 + n}-year-old presents with ${disease}-specific findings including unique vitals, labs, and exam features for case ${id}.`;
  return {
    id,
    subjectId,
    blueprintDomain: subjectId,
    question: `${vignette}\nWhich diagnosis is most likely?`,
    options: [`${disease} flare`, `Alternative A ${n}`, `Alternative B ${n}`, `Alternative C ${n}`],
    correctAnswer: `${disease} flare`,
    explanation: "Board-style rationale explaining the correct clinical decision in detail.",
    difficulty: 3,
  };
}

describe("preset-exam-config", () => {
  it("caps preset exam numbers at 100", () => {
    expect(clampPresetExamNumber(1)).toBe(1);
    expect(clampPresetExamNumber(100)).toBe(100);
    expect(clampPresetExamNumber(999)).toBe(100);
  });

  it("maps public exam slugs to compose slugs", () => {
    expect(resolvePresetComposeSlug("usmle")).toBe("usmle-step-2");
    expect(resolvePresetComposeSlug("nclex")).toBe("nclex");
    expect(PRESET_EXAM_MAX).toBe(100);
    expect(PRESET_EXAM_QUESTION_COUNT.nclex).toBe(80);
  });
});

describe("composeValidatedExamFromPool batch dedupe", () => {
  it("composes two exams without reusing question ids", () => {
    const config = resolveExamComposeConfig("usmle-step-1")!;
    const pool: BankItem[] = [];
    const subjects = ["pathology", "pharmacology", "biochemistry", "microbiology", "physiology"];
    for (let i = 0; i < 50; i++) {
      pool.push(uniqueItem(`u-${i}`, subjects[i % subjects.length]!, i));
    }

    const used = new Set<string>();
    const examA = composeValidatedExamFromPool(config, pool, 6, 11);
    expect(examA.status).toBe("PASSED");
    for (const q of examA.exam!.questions) used.add(q.questionId);

    const freshPool = pool.filter((item) => item.id && !used.has(item.id));
    const examB = composeValidatedExamFromPool(config, freshPool, 6, 22);
    expect(examB.status).toBe("PASSED");

    const overlap = examB.exam!.questions.filter((q) => used.has(q.questionId));
    expect(overlap).toHaveLength(0);
  });
});
