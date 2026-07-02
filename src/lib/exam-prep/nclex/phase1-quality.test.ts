import { describe, expect, it } from "vitest";
import {
  LIVE_TIMED_EXAM_COMPOSE_TIERS,
  userFacingComposeTiers,
} from "@/lib/exam-prep/progressive-compose";
import { nclexItemPassesBestExamGate } from "@/lib/exam-prep/nclex-serve-gate";
import type { BankItem } from "@/lib/question-bank";

describe("NCLEX phase 1 quality bar", () => {
  it("NCLEX user-facing compose uses a short exact-fill ladder", () => {
    expect(userFacingComposeTiers("nursing")).toEqual(LIVE_TIMED_EXAM_COMPOSE_TIERS);
    expect(userFacingComposeTiers("nursing").length).toBe(3);
    expect(userFacingComposeTiers("nursing")[0]!.minFillRatio).toBe(1);
    expect(userFacingComposeTiers("nursing").at(-1)!.minFillRatio).toBe(1);
    expect(userFacingComposeTiers("nursing")[0]!.useRelaxedGate).toBe(false);
    expect(userFacingComposeTiers("nursing").some((tier) => tier.useRelaxedGate)).toBe(true);
  });

  it("rejects items with auto-padded generic distractor rationales", () => {
    const item: BankItem = {
      question: "Which action should the nurse take first?",
      options: ["Obtain cultures", "Give fluids", "Apply oxygen", "Insert catheter"],
      correctAnswer: "Obtain cultures",
      explanation:
        "Sepsis requires cultures before antibiotics.\n\nWhy other options are incorrect:\n• Give fluids: Incorrect — plausible but not the priority action for this client's presentation.",
      vignette:
        "A 68-year-old client has fever 39°C, HR 118, BP 88/54, lactate 3.8, and altered mental status.",
      subjectId: "physiological-adaptation",
      tags: ["nclex-ngn", "curated"],
    };
    expect(nclexItemPassesBestExamGate(item)).toBe(false);
  });
});
