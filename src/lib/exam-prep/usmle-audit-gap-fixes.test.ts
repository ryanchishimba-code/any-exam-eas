import { describe, expect, it } from "vitest";
import type { BankItem } from "@/lib/question-bank";
import { BOARD_SERVE_MIN_EXPLANATION_CHARS } from "./board-serve-quality";
import { fixUsmleAuditGaps, splitUsmleEmbeddedVignette } from "./usmle-audit-gap-fixes";
import { splitUsmleBankItem } from "./usmle-bank-split";

describe("fixUsmleAuditGaps", () => {
  it("restores short explanations from USMLE quality seeds", () => {
    const item: BankItem = {
      subjectId: "biochemistry",
      question: "Von Gierke disease involves deficiency of:",
      options: [
        "Von Gierke disease (GSD I)",
        "Pompe disease",
        "McArdle disease",
        "Tay-Sachs disease",
      ],
      correctAnswer: "Von Gierke disease (GSD I)",
      explanation: "Severe fasting hypoglycemia (GSD I).",
      tags: ["seed"],
    };

    const { item: fixed, changed } = fixUsmleAuditGaps(item);
    expect(changed).toBe(true);
    expect(fixed.explanation.length).toBeGreaterThanOrEqual(BOARD_SERVE_MIN_EXPLANATION_CHARS);
  });

  it("splits embedded clinical text from a long combined stem", () => {
    const stem =
      "After a right-sided spinal cord knife injury at T10, a patient has right leg loss of proprioception, left leg loss of pain and temperature, and right leg spastic paralysis below the lesion. Which pattern best explains these findings?";
    const item: BankItem = {
      subjectId: "anatomy",
      question: stem,
      options: ["Brown-Séquard", "Anterior cord", "Central cord", "Posterior cord"],
      correctAnswer: "Brown-Séquard",
      explanation: "Hemisection pattern with ipsilateral motor/proprioception and contralateral pain/temp loss.",
      tags: [],
    };

    const split = splitUsmleEmbeddedVignette(item);
    expect(split?.vignette).toContain("spinal cord knife injury");
    expect(split?.question).toContain("Which pattern");

    const { item: fixed } = fixUsmleAuditGaps(item);
    expect(splitUsmleBankItem(fixed).vignette?.length ?? 0).toBeGreaterThan(40);
  });
});
