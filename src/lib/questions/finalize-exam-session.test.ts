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
  resolveSessionSpreadPoolLimit,
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
  it("covers all six board exam catalog fields", () => {
    for (const slug of EXAM_SLUGS) {
      const exam = EXAM_CATALOG[slug];
      expect(isFullExamField(exam.fieldId)).toBe(true);
    }
  });

  it("requests enough bank rows for every exam preset size", () => {
    for (const slug of EXAM_SLUGS) {
      const full = buildSessionConfig(slug, "full", true);
      const sample = resolveExamBankSampleCount(EXAM_CATALOG[slug].fieldId, full.questionCount, true);
      expect(sample).toBeGreaterThanOrEqual(full.questionCount);
      // Timed exams pull a modest headroom pool — gatherTimedExamBankItems tops up if gates thin the pool.
      expect(sample).toBeLessThanOrEqual(500);
      if (slug === "nclex" || slug === "usmle" || slug === "naplex") {
        expect(sample).toBeGreaterThanOrEqual(full.questionCount + 32);
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
      explanation: "Detailed explanation with board-style clinical teaching rationale.",
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
    expect(quality.issues.some((i) => i === "generic_distractors" || i === "below_board_bar")).toBe(
      true
    );
    expect(() => assertExamSessionReady(quality, "usmle-step-2")).toThrow(/board/i);
  });

  it("fills from relaxed board bar when strict pool is too small", () => {
    const strictOnly = buildPool(3, "strict");
    const relaxedExtra = Array.from({ length: 5 }, (_, i) => ({
      id: 100 + i,
      type: "multiple_choice" as const,
      question: `Relaxed Q ${i}?`,
      vignette: `Relaxed vignette ${i}.`,
      options: [`A-${i}`, `B-${i}`, `C-${i}`, `D-${i}`],
      correctAnswer: `A-${i}`,
      explanation: "Short but still valid teaching rationale.",
      subjectId: "cardiology",
      difficultyLabel: "Medium" as const,
    }));

    const { prepared, quality } = finalizeExamSessionQuestions(
      [...strictOnly, ...relaxedExtra],
      5
    );
    expect(prepared).toHaveLength(5);
    expect(quality.ok).toBe(true);
  });

  it("passes quality gates for a mixed full-length block", () => {
    const { prepared, quality } = finalizeExamSessionQuestions(buildPool(120, "pance"), 120);
    expect(prepared).toHaveLength(120);
    expect(quality.issues).not.toContain("generic_distractors");
    assertExamSessionReady({ ...quality, ok: quality.returned === 120 }, "pance");
  });

  it("passes AANP FNP diversity gates with clustered look-alike vignettes", () => {
    const sharedPrefix =
      "A 52-year-old woman presents for a wellness visit. She has no chronic conditions";
    const pool: RawQuestionInput[] = Array.from({ length: 80 }, (_, i) => ({
      id: i + 1,
      type: "multiple_choice" as const,
      bankItemId: `aanp-${i}`,
      question: `Which is the best next step for case ${i}?`,
      vignette:
        i % 8 === 0
          ? `${sharedPrefix} and asks about screening test ${i}.`
          : `A ${30 + (i % 40)}-year-old ${i % 2 === 0 ? "man" : "woman"} presents with complaint ${i}. Vitals stable.`,
      options: [`Start drug A-${i}`, `Order test B-${i}`, `Refer specialty C-${i}`, `Reassure D-${i}`],
      correctAnswer: `Start drug A-${i}`,
      explanation: "Clinical rationale with teaching points for board review.",
      subjectId: ["assess", "diagnose", "plan", "evaluate"][i % 4],
      difficultyLabel: (i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard") as
        | "Easy"
        | "Medium"
        | "Hard",
    }));

    const { prepared, quality } = finalizeExamSessionQuestions(pool, 25);
    expect(prepared).toHaveLength(25);
    expect(quality.issues).not.toContain("window_similar_cases");
    expect(quality.issues).not.toContain("window_similar_options");
    assertExamSessionReady({ ...quality, ok: quality.returned === 25 }, "aanp-fnp");
  });
});

describe("resolveSessionSpreadPoolLimit", () => {
  it("returns the full vetted pool when available", () => {
    expect(resolveSessionSpreadPoolLimit(25)).toBe(65);
    expect(resolveSessionSpreadPoolLimit(25, 120)).toBe(120);
    expect(resolveSessionSpreadPoolLimit(120, 500)).toBe(500);
  });
});

describe("all board exams — templated vignette banks", () => {
  const templateV =
    "A 45-year-old woman presents to the primary care clinic with fatigue and weight gain for 3 months.";

  for (const fieldId of [
    "nursing",
    "pharmacy",
    "usmle-step-2",
    "pance",
    "aanp-fnp",
    "npte-pt",
  ] as const) {
    it(`assembles ${fieldId} sessions from bulk-style template pools`, () => {
      const pool: RawQuestionInput[] = Array.from({ length: 80 }, (_, i) => ({
        id: i + 1,
        type: "multiple_choice" as const,
        bankItemId: `${fieldId}-bulk-${i}`,
        question:
          i % 3 === 0
            ? "What is the best initial test?"
            : i % 3 === 1
              ? "What is the most likely diagnosis?"
              : "What is the best next step in management?",
        vignette: `Case ${i}: ${templateV} Additional unique findings for item ${i}.`,
        options: [`Start therapy ${i}`, `Order labs ${i}`, `Refer specialty ${i}`, `Reassure ${i}`],
        correctAnswer: `Start therapy ${i}`,
        explanation: "Clinical rationale with teaching points for board review.",
        subjectId: ["topic-a", "topic-b", "topic-c", "topic-d"][i % 4],
        difficultyLabel: (i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard") as
          | "Easy"
          | "Medium"
          | "Hard",
      }));

      const { prepared, quality } = finalizeExamSessionQuestions(pool, 25);
      expect(prepared).toHaveLength(25);
      expect(quality.issues).not.toContain("window_similar_cases");
      assertExamSessionReady({ ...quality, ok: quality.returned === 25 }, fieldId);
    });
  }
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
    expect(quality.issues).not.toContain("window_similar_cases");
    expect(quality.issues).not.toContain("window_similar_options");
  });
});
