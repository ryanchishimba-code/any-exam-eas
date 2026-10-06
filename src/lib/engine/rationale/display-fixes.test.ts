import { describe, expect, it } from "vitest";
import {
  adaptBoardPracticeWording,
  clipRationaleSection,
  parseRationaleForDisplay,
} from "@/lib/engine/rationale/parse-rationale-display";
import { inferAnatomyStructuresFromText } from "@/lib/anatomy/structure-inference";
import { buildFiveDeepDiveBeats } from "@/lib/engine/mastery/deep-dive-beats";
import { trapsFromQuestion } from "@/lib/learning/insights";
import { vignetteWithoutRepeatedQuestion } from "@/lib/questions/student-display-text";
import type { StudyQuestion } from "@/lib/questions/types";

const MARKDOWN = `## Why this answer is correct
**Warfarin** excess raises the bleeding risk when the INR is 4.5.

## Clinical pearl
## Why the other options are wrong
**Vitamin K now**
Delay reversal until bleeding is present.

## Key takeaway
Recheck the INR and hold the next dose.
`;

describe("explanation display", () => {
  it("does not leak the wrong-option block into the clinical pearl", () => {
    const parsed = parseRationaleForDisplay(MARKDOWN);
    expect(parsed.whyCorrectHeadline ?? "").not.toMatch(/##/);
    expect(parsed.whyCorrectHeadline ?? "").not.toMatch(/\*\*/);
    expect(parsed.clinicalPearl ?? "").not.toMatch(/Why the other options/);
    expect(parsed.clinicalPearl ?? "").not.toMatch(/##/);
    expect(parsed.wrongOptions.length).toBeGreaterThan(0);
  });

  it("rewrites nursing unit phrasing for pharmacy", () => {
    expect(adaptBoardPracticeWording("On the unit, this means hold the dose.", "pharmacy")).toBe(
      "In the pharmacy, this means hold the dose."
    );
    expect(adaptBoardPracticeWording("On the unit, this means stay with the client.", "nursing")).toMatch(
      /On the unit/
    );
  });

  it("hides filler traps when the item has no specific text", () => {
    const question = {
      id: "q",
      stem: "Which action is first?",
      options: ["A", "B"],
      correctAnswers: ["A"],
      explanation: "Airway first.",
    } satisfies StudyQuestion;
    expect(trapsFromQuestion(question, false)).toEqual([]);
    const beats = buildFiveDeepDiveBeats(question);
    expect(beats.some((beat) => /Compare each wrong option/i.test(beat.body))).toBe(false);
    expect(beats.some((beat) => beat.id === "why_distractors")).toBe(false);
  });

  it("drops an empty clipped section", () => {
    expect(clipRationaleSection("## Clinical pearl\n")).toBe("");
  });
});

describe("anatomy confidence", () => {
  it("hides prostate and intermediate cuneiform when the stem never names them", () => {
    const levodopa = inferAnatomyStructuresFromText(
      "A 70-year-old male takes levodopa and develops nausea. Which finding requires follow-up?"
    );
    const stroke = inferAnatomyStructuresFromText(
      "Intermediate teaching for a client with a stroke, terminal cancer, anorexia, and pediatric acetaminophen dosing."
    );
    expect(levodopa.some((row) => row.id === "prostate")).toBe(false);
    expect(stroke.some((row) => /cuneiform/i.test(row.id))).toBe(false);
  });

  it("keeps a structure the stem names", () => {
    const heart = inferAnatomyStructuresFromText("Auscultate the heart at the mitral area.");
    expect(heart.some((row) => row.id === "heart")).toBe(true);
  });
});

describe("repeated question line", () => {
  it("drops the question when the scenario already ends with it", () => {
    const scene = vignetteWithoutRepeatedQuestion(
      'The client says, "I\'m not ready to die." Which therapeutic response is best?',
      "Which therapeutic response is best?"
    );
    expect(scene.endsWith("best?")).toBe(false);
    expect(scene).toMatch(/not ready to die/i);
  });
});
