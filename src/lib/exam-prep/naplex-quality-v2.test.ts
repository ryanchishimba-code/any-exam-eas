import { describe, expect, it } from "vitest";
import { NAPLEX_QUALITY_V2 } from "./naplex-quality-v2";
import { bankItemToNaplexExam } from "./naplex-bank-bridge";
import { examQuestionToStudy, isAnswerCorrect } from "@/lib/questions/prepare";
import { bankItemContentHash } from "@/lib/sync-question-bank";

const DOMAINS = {
  A1: "naplex-area1-foundations",
  A2: "naplex-area2-therapeutics",
  A3: "naplex-area3-treatment-planning",
  A4: "naplex-area4-safety",
  A5: "naplex-area5-management",
};

describe("NAPLEX_QUALITY_V2", () => {
  it("ships exactly 50 blueprint-aligned items", () => {
    expect(NAPLEX_QUALITY_V2).toHaveLength(50);
    const counts: Record<string, number> = {};
    for (const q of NAPLEX_QUALITY_V2) {
      const d = q.blueprintDomain ?? "unknown";
      counts[d] = (counts[d] ?? 0) + 1;
    }
    expect(counts[DOMAINS.A1]).toBe(12);
    expect(counts[DOMAINS.A2]).toBe(13);
    expect(counts[DOMAINS.A3]).toBe(20);
    expect(counts[DOMAINS.A4]).toBe(3);
    expect(counts[DOMAINS.A5]).toBe(2);
  });

  it("includes diverse item types", () => {
    const types = new Set(NAPLEX_QUALITY_V2.map((q) => q.itemType));
    expect(types.has("case_based")).toBe(true);
    expect(types.has("select_all")).toBe(true);
    expect(types.has("ordered_response")).toBe(true);
    expect(types.has("constructed_response")).toBe(true);
    expect(types.has("drag_drop")).toBe(true);
    expect(types.has("exhibit")).toBe(true);
  });

  it("round-trips constructed response through study pipeline", () => {
    const item = NAPLEX_QUALITY_V2.find((q) => q.itemType === "constructed_response");
    expect(item).toBeDefined();
    const exam = bankItemToNaplexExam(item!, 0);
    const study = examQuestionToStudy({ ...exam, field: "pharmacy" }, 0);
    expect(study.type).toBe("short_answer");
    expect(isAnswerCorrect(study, [study.correctAnswers[0]!])).toBe(true);
  });

  it("keys the Cockcroft-Gault vancomycin item to 28 mL/min without changing its content hash", () => {
    const item = NAPLEX_QUALITY_V2.find((q) =>
      q.question.includes("Cockcroft")
    );
    expect(item).toBeDefined();
    expect(item?.options).toEqual([
      "28 mL/min",
      "38 mL/min",
      "48 mL/min",
      "58 mL/min",
    ]);
    expect(item?.correctAnswer).toBe("28 mL/min");
    expect(item?.explanation).toBe(
      "CrCl = [(140−72)×60]/(72×1.6) × 0.85 ≈ 30.1 mL/min; the closest option is 28 mL/min. Guides initial vancomycin dosing and monitoring. (FDA prescribing information)"
    );
    const hash = bankItemContentHash("pharmacy", item!.subjectId, item!);
    const sameStemDifferentKey = bankItemContentHash("pharmacy", item!.subjectId, {
      question: item!.question,
      vignette: item!.vignette,
      scenario: item!.scenario,
    });
    expect(sameStemDifferentKey).toBe(hash);
    expect(hash).toHaveLength(64);
  });

  it("round-trips drag-drop matching", () => {
    const item = NAPLEX_QUALITY_V2.find((q) => q.itemType === "drag_drop");
    expect(item).toBeDefined();
    const study = examQuestionToStudy(
      { ...bankItemToNaplexExam(item!, 0), field: "pharmacy" },
      0
    );
    expect(study.type).toBe("drag_drop");
    expect(study.correctAnswers.length).toBeGreaterThan(1);
    expect(isAnswerCorrect(study, study.correctAnswers)).toBe(true);
  });
});
