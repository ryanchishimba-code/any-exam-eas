import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { finalizeExamSessionItems } from "./finalize-exam-selection";
import { auditBlockingExamSimilarity } from "./exam-similarity";

describe("finalizeExamSessionItems", () => {
  it("allows at most one template clone per exam across fields", () => {
    const stem = "Which finding requires immediate nursing follow-up?";
    const options = [
      "fruity breath odor",
      "deep rapid (Kussmaul) respirations and Glucose 412 mg/dL",
      "dry mucous membranes",
      "reports polyuria and nausea",
    ];
    const clone = (id: string, room: number): BankItem => ({
      id,
      subjectId: "med-surg",
      question: stem,
      vignette: `Emergency department, Room ${room}. DKA template vignette with enough clinical detail for dedupe.`,
      options,
      correctAnswer: options[1]!,
      explanation: "Board-style rationale.",
    });

    const pool = [
      clone("dka-1", 548),
      clone("dka-2", 312),
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `other-${i}`,
        subjectId: "pharmacology",
        question: `Unique question ${i}?`,
        vignette: `Unique vignette ${i} with enough detail.`,
        options: [`A${i}`, `B${i}`, `C${i}`, `D${i}`],
        correctAnswer: `A${i}`,
        explanation: "Explanation.",
      })),
    ];

    const session = finalizeExamSessionItems(pool, 5, { seed: 11, requestedCount: 5 });
    expect(session.filter((row) => row.options.join("|") === options.join("|"))).toHaveLength(1);
    expect(auditBlockingExamSimilarity(session, 5)).toHaveLength(0);
  });
});
