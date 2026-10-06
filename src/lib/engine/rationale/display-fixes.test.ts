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
import {
  rationaleFragmentShownInLead,
  shortRationaleLead,
} from "@/lib/study/rationale-disclosure";
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

  it("hides generic priority filler, a repeated block, a duplicate pearl, and cross-board lines", () => {
    const filler =
      "Incorrect — Plausible nursing action but not the FIRST priority for this presentation.";
    const parsed = parseRationaleForDisplay(`## Why this answer is correct
Aprepitant is the best choice to improve nausea control during chemotherapy.
• Aprepitant is the best choice to improve nausea control during chemotherapy.
**In practice:** Adding it can help manage both acute and delayed nausea.

## Why the other options are wrong
**Lorazepam**
${filler}
**Promethazine**
Promethazine causes sedation, which this client cannot tolerate.

## Key takeaway
Adding it can help manage both acute and delayed nausea.
**Memory hook:** Aprepitant for acute and delayed nausea.

## Clinical pearl
Adding it can help manage both acute and delayed nausea.
`);
    expect(parsed.whyCorrectHeadline).toBeUndefined();
    expect(parsed.wrongOptions.map((row) => row.option)).toEqual(["Promethazine"]);
    expect(parsed.clinicalPearl).toBeUndefined();
    expect(adaptBoardPracticeWording("This is crucial for pharmacy practice and for both NCLEX and NAPLEX.", "nursing")).toBe(
      "This is important for nursing practice and for NCLEX."
    );
    expect(adaptBoardPracticeWording("This point is crucial for both NAPLEX and NCLEX.", "nursing")).toBe(
      "This point is important for nursing practice."
    );
    expect(adaptBoardPracticeWording("This skill is crucial for pharmacists as well.", "nursing")).toBe(
      "This skill is important for nursing practice."
    );
    expect(adaptBoardPracticeWording("This skill is crucial for pharmacists.", "nursing")).toBe(
      "This skill is important for nursing practice."
    );
    expect(
      adaptBoardPracticeWording(
        "Consult with a pharmacist if there are any uncertainties regarding the medication or dosage.",
        "nursing"
      )
    ).toMatch(/consult with a pharmacist/i);
    expect(
      adaptBoardPracticeWording(
        "Consider involving pharmacists or utilizing teach-back methods.",
        "nursing"
      )
    ).toMatch(/involving pharmacists/i);
    expect(adaptBoardPracticeWording("Remember: Remember, steady-state takes four half-lives.", "nursing")).toBe(
      "Remember: steady-state takes four half-lives."
    );
    expect(adaptBoardPracticeWording(`${filler}\n\n${filler}`, "nursing")).toBe("");
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
    expect(beats.map((beat) => beat.title[0])).toEqual(["1", "2", "3"]);
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

describe("duplicated rationale lead", () => {
  it("drops the section title and treats the repeated opening sentence as already shown", () => {
    const stored = `## Why this answer is correct
Adding a GLP-1 receptor agonist is the most effective way to improve this patient's diabetes management.
• Adding a GLP-1 receptor agonist is the most effective way to improve this patient's diabetes management.
• HbA1c of 8.5% indicates inadequate glycemic control.`;
    const lead = shortRationaleLead(stored);
    expect(lead.toLowerCase()).not.toContain("why this answer is correct");
    expect(lead).toMatch(/Adding a GLP-1 receptor agonist/i);
    expect(rationaleFragmentShownInLead(lead, lead)).toBe(true);
    expect(
      rationaleFragmentShownInLead("HbA1c of 8.5% indicates inadequate glycemic control.", lead)
    ).toBe(false);
    const heading = "Encouraging Ambulation Promotes Bowel Recovery";
    const sentence = "Ambulation stimulates peristalsis, which is crucial after abdominal surgery.";
    const nclexLead = shortRationaleLead(`## Why this answer is correct\n${heading}\n${sentence}`);
    expect(rationaleFragmentShownInLead(heading, nclexLead)).toBe(true);
    expect(rationaleFragmentShownInLead(sentence, nclexLead)).toBe(true);
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
