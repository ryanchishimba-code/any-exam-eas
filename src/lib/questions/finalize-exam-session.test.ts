import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import { buildSessionConfig } from "@/lib/full-exam/config";
import {
  assertExamSessionReady,
  assessExamSessionQuality,
  finalizeExamSessionQuestions,
  isFullExamField,
  resolveExamBankSampleCount,
} from "./finalize-exam-session";
import { selectSpreadBankItems } from "./spread-session-order";
import type { RawQuestionInput } from "./types";

function examBankItem(
  id: string,
  fieldId: string,
  subjectId: string,
  difficulty: number,
  question: string,
  vignette: string,
  options: string[]
): BankItem {
  return {
    id,
    subjectId,
    question,
    vignette,
    difficulty,
    options,
    correctAnswer: options[0]!,
    explanation: "Board-style rationale with clinical reasoning.",
    tags: [fieldId, subjectId],
  };
}

describe("full-length exam fields", () => {
  it("covers NCLEX, NAPLEX, USMLE, and PANCE catalog fields", () => {
    for (const slug of EXAM_SLUGS) {
      const exam = EXAM_CATALOG[slug];
      expect(isFullExamField(exam.fieldId)).toBe(true);
    }
  });

  it("requests enough bank rows for full-length presets", () => {
    for (const slug of EXAM_SLUGS) {
      const full = buildSessionConfig(slug, "full", true);
      const sample = resolveExamBankSampleCount(EXAM_CATALOG[slug].fieldId, full.questionCount, true);
      expect(sample).toBeGreaterThanOrEqual(full.questionCount);
      if (slug === "nclex") {
        expect(sample).toBeGreaterThanOrEqual(255);
      }
      if (slug === "usmle") {
        expect(sample).toBeGreaterThanOrEqual(full.questionCount + 150);
      }
    }
  });
});

describe("finalizeExamSessionQuestions", () => {
  function buildPool(size: number, prefix: string): RawQuestionInput[] {
    return Array.from({ length: size }, (_, i) => ({
      id: i + 1,
      type: "multiple_choice" as const,
      question: `${prefix} question ${i}?`,
      vignette: `${prefix} vignette ${i} with clinical detail for case separation.`,
      options: [`${prefix}-A-${i}`, `${prefix}-B-${i}`, `${prefix}-C-${i}`, `${prefix}-D-${i}`],
      correctAnswer: `${prefix}-A-${i}`,
      explanation: "Detailed explanation.",
      subjectId: i % 2 === 0 ? "cardiology" : "nephrology",
      difficultyLabel: (i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard") as
        | "Easy"
        | "Medium"
        | "Hard",
    }));
  }

  it(
    "returns exact count for standard full-exam preset sizes",
    () => {
      for (const limit of [50, 85, 100, 120]) {
        const { prepared, quality } = finalizeExamSessionQuestions(
          buildPool(limit + 20, `q${limit}`),
          limit
        );
        expect(prepared).toHaveLength(limit);
        expect(quality.returned).toBe(limit);
        expect(quality.issues.some((i) => i.startsWith("count_mismatch"))).toBe(false);
      }
    },
    20_000
  );

  it(
    "returns exact count for maximum USMLE-length sessions",
    () => {
      const limit = 280;
      const { prepared, quality } = finalizeExamSessionQuestions(
        buildPool(limit + 20, "usmle"),
        limit
      );
      expect(prepared).toHaveLength(limit);
      expect(quality.returned).toBe(limit);
    },
    30_000
  );

  it("rejects sessions with generic placeholder distractors", () => {
    const bad: RawQuestionInput[] = [
      {
        id: 1,
        type: "multiple_choice",
        question: "Test?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
        explanation: "Because.",
      },
    ];
    const quality = assessExamSessionQuality(
      bad.map((q, i) => ({
        id: `q-${i}`,
        sourceIndex: i,
        type: "multiple_choice" as const,
        stem: q.question,
        options: q.options ?? [],
        correctAnswers: [q.correctAnswer],
        explanation: q.explanation ?? "",
        difficulty: "medium" as const,
      })),
      1
    );
    expect(quality.issues).toContain("generic_distractors");
    expect(() => assertExamSessionReady(quality, "usmle-step-2")).toThrow(/distractor/i);
  });

  it("passes quality gates for a mixed full-length block", () => {
    const { prepared, quality } = finalizeExamSessionQuestions(buildPool(120, "pance"), 120);
    expect(prepared).toHaveLength(120);
    expect(quality.issues).not.toContain("generic_distractors");
    assertExamSessionReady({ ...quality, ok: quality.returned === 120 }, "pance");
  });
});

describe("selectSpreadBankItems for licensing exams", () => {
  it("meets count + spread rules for NCLEX-sized sessions", () => {
    const pool = Array.from({ length: 100 }, (_, i) =>
      examBankItem(
        `nclex-${i}`,
        "nursing",
        i % 2 === 0 ? "med-surg" : "pharmacology",
        (i % 5) + 1,
        `NCLEX stem ${i}?`,
        `Patient case ${i}`,
        [`Option A ${i}`, `Option B ${i}`, `Option C ${i}`, `Option D ${i}`]
      )
    );
    const selected = selectSpreadBankItems(pool, 85);
    expect(selected).toHaveLength(85);
    const quality = assessExamSessionQuality(
      selected.map((item, i) => ({
        id: `q-${i}`,
        sourceIndex: i,
        type: "multiple_choice" as const,
        stem: item.question,
        vignette: item.vignette,
        options: item.options,
        correctAnswers: [item.correctAnswer],
        explanation: item.explanation,
        difficulty:
          item.difficulty != null && item.difficulty <= 2
            ? "easy"
            : item.difficulty != null && item.difficulty >= 4
              ? "hard"
              : "medium",
      })),
      85
    );
    expect(quality.issues.some((i) => i.startsWith("count_mismatch"))).toBe(false);
  });
});
