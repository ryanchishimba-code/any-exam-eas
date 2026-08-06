import { describe, expect, it } from "vitest";
import {
  listWrongBankOptions,
  matchRationaleOptionToBank,
  validateStructuredRationale,
} from "./validate-rationale";
import type { StructuredRationale } from "../prompts/rationale-generation";

function baseRationale(wrong: string[]): StructuredRationale {
  return {
    whyCorrect: {
      headline: "This is the safest priority nursing action for this client presentation.",
      conceptBreakdown: [
        "Recognize acute cues from the vignette first",
        "Prioritize airway, bleeding, or safety over comfort",
      ],
      clinicalContext: "On the unit, act on the highest-risk finding before routine tasks.",
    },
    whyIncorrect: wrong.map((option) => ({
      option,
      misconception: "Students often pick a secondary or physician-level action.",
      correction:
        "This option does not address the highest-priority nursing judgment for THIS client right now.",
      conceptLink: "Match action to acuity and RN scope.",
    })),
    keyTakeaway: "Prioritize the most urgent safe nursing action for this vignette.",
  };
}

describe("listWrongBankOptions", () => {
  it("handles single-correct MCQ", () => {
    const options = ["A", "B", "C", "D"];
    expect(listWrongBankOptions(options, "B")).toEqual(["A", "C", "D"]);
  });

  it("handles bowtie / SATA multi-correct without treating the full string as one answer", () => {
    const options = [
      "Massage the fundus until firm.",
      "Administer IV fluids as ordered.",
      "Apply an ice pack to the perineum.",
      "Encourage the client to void.",
      "Monitor vital signs every 15 minutes.",
      "Assess lochia characteristics.",
      "Check for bladder distention.",
      "Evaluate pain level.",
    ];
    const correct =
      "Massage the fundus until firm.,Administer IV fluids as ordered.,Monitor vital signs every 15 minutes.";
    const wrong = listWrongBankOptions(options, correct);
    expect(wrong).toHaveLength(5);
    expect(wrong).not.toContain("Massage the fundus until firm.");
    expect(wrong).toContain("Apply an ice pack to the perineum.");
  });
});

describe("validateStructuredRationale", () => {
  it("passes when all wrong options are covered for multi-correct items", () => {
    const options = ["Correct 1", "Correct 2", "Wrong A", "Wrong B"];
    const correct = "Correct 1,Correct 2";
    const rationale = baseRationale(["Wrong A", "Wrong B"]);
    const verdict = validateStructuredRationale(rationale, options, correct);
    expect(verdict.issues).not.toContain("missing_wrong_option");
    expect(verdict.ok).toBe(true);
  });

  it("fails if a true wrong option is omitted", () => {
    const options = ["Correct 1", "Correct 2", "Wrong A", "Wrong B"];
    const correct = "Correct 1,Correct 2";
    const rationale = baseRationale(["Wrong A"]);
    const verdict = validateStructuredRationale(rationale, options, correct);
    expect(verdict.issues).toContain("missing_wrong_option");
    expect(verdict.ok).toBe(false);
  });

  it("fuzzy-matches quoted option text", () => {
    const options = [
      `"I should feed my baby whenever he seems hungry."`,
      `"I need to drink plenty of fluids to maintain my milk supply."`,
      `"I should supplement with formula if my baby is still hungry."`,
      `"I should ensure my baby latches on properly during feeds."`,
    ];
    const correct = `"I should supplement with formula if my baby is still hungry."`;
    const rationale = baseRationale([
      "I should feed my baby whenever he seems hungry.",
      "I need to drink plenty of fluids to maintain my milk supply.",
      "I should ensure my baby latches on properly during feeds.",
    ]);
    const verdict = validateStructuredRationale(rationale, options, correct);
    expect(verdict.issues).not.toContain("missing_wrong_option");
    expect(verdict.issues).not.toContain("extra_wrong_option");
    expect(verdict.ok).toBe(true);
  });
});

describe("matchRationaleOptionToBank", () => {
  it("strips trailing punctuation when matching", () => {
    const options = ["Massage the uterine fundus.", "Notify the provider"];
    expect(matchRationaleOptionToBank("Massage the uterine fundus", options)).toBe(
      "Massage the uterine fundus."
    );
  });
});
