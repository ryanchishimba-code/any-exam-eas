import { describe, expect, it } from "vitest";
import { bankItemToSessionRaw } from "@/lib/exam-prep/prepare-bank-session";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { examQuestionToStudy } from "@/lib/questions/prepare";
import { shuffleDeliveryChoices } from "@/lib/questions/shuffle-delivery";

const OPTIONS = [
  "Give intravenous fluids",
  "Obtain cultures, then antibiotics",
  "Apply oxygen and reassess",
  "Document and continue to monitor",
];

describe("bank strings in prepare and shuffle", () => {
  it("shuffles when tags and solution steps are JSON strings instead of arrays", () => {
    const row = {
      id: "string-fields",
      subjectId: "safety",
      question: "Which action should the nurse take first?",
      options: JSON.stringify(OPTIONS),
      correctAnswer: OPTIONS[1]!,
      explanation: "Cultures come before antibiotics.",
      solutionSteps: JSON.stringify(["Draw cultures", "Start antibiotics"]),
      tags: JSON.stringify(["safety", "priority"]),
      itemType: "mcq",
    };
    const item = enrichBankItemFromRow(row);
    const raw = bankItemToSessionRaw("nursing", "NCLEX", "safety", item, 0);
    const study = examQuestionToStudy(
      { ...raw, bankItemId: row.id, subjectId: "safety", field: "NCLEX" },
      0,
      { shuffleOptions: true, shuffleSeed: 0x161 }
    );

    expect(study.options).not.toEqual(OPTIONS);
    expect(study.options).toEqual(expect.arrayContaining(OPTIONS));
    expect(study.tags).toEqual(expect.arrayContaining(["safety", "priority"]));
    expect(study.solutionSteps).toEqual(["Draw cultures", "Start antibiotics"]);

    const guarded = shuffleDeliveryChoices({
      options: OPTIONS,
      correctAnswer: OPTIONS[1]!,
      solutionSteps: row.solutionSteps as unknown as string[],
      seed: 4,
    });
    expect(guarded.options).toHaveLength(4);
    expect(guarded.solutionSteps).toEqual(["Draw cultures", "Start antibiotics"]);
  });
});
