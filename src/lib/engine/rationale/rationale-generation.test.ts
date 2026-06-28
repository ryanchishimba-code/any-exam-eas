import { describe, expect, it } from "vitest";
import {
  assembleStructuredRationale,
  buildRationaleMasterSystemPrompt,
  buildRationaleUserPrompt,
  needsRationaleEnrichment,
  parseRationaleForDisplay,
  validateStructuredRationale,
} from "./index";

const SAMPLE = {
  whyCorrect: {
    headline:
      "**Notify the provider and prepare for IV fluid resuscitation** is correct because this patient shows hypovolemic shock cues.",
    conceptBreakdown: [
      "**Hypotension + tachycardia + cool extremities** = perfusion is failing — treat before reassessing endlessly.",
      "**Crackles and edema** suggest overload may coexist, but **MAP and mental status** drive the first action.",
      "NCLEX tests **life threat first**, then fine-tune fluids.",
    ],
    clinicalContext:
      "On the unit, unstable vitals trump charting tasks — escalate early and stay at the bedside while fluids run.",
  },
  whyIncorrect: [
    {
      option: "Document findings and recheck vital signs in 4 hours",
      misconception: "Students think thorough documentation satisfies the standard of care.",
      correction:
        "Delaying action with **active hypotension and altered perfusion** risks organ injury; reassessment without intervention is unsafe here.",
      conceptLink: "When ABCs and perfusion are threatened, **intervene and notify** — don't defer.",
    },
    {
      option: "Administer prescribed PO diuretic and encourage oral fluids",
      misconception: "Edema triggers a reflex to diurese, even when blood pressure is already low.",
      correction:
        "Further volume loss can **worsen shock**; diuresis is not the priority with MAP compromise.",
      conceptLink: "Match the intervention to the **dominant problem** — perfusion, not edema alone.",
    },
    {
      option: "Place the client in high Fowler's position and provide a fan",
      misconception: "Positioning for breathing feels helpful when crackles are present.",
      correction:
        "High Fowler's may **drop preload** in a hypovolemic patient and does not restore perfusion.",
      conceptLink: "Positioning supports the **primary deficit** — here, circulating volume/pressure.",
    },
  ],
  keyTakeaway:
    "When vitals scream **perfusion failure**, act and escalate — don't document your way past instability.",
  memoryHook: "**Shock before sheet** — unstable MAP → notify + fluids, then reassess.",
};

describe("rationale generation system", () => {
  it("master prompt includes required sections and exam voice", () => {
    const prompt = buildRationaleMasterSystemPrompt("nursing");
    expect(prompt).toMatch(/whyIncorrect/i);
    expect(prompt).toMatch(/Key takeaway/i);
    expect(prompt).toMatch(/NCLEX/i);
    expect(prompt).toMatch(/JSON/i);
  });

  it("user prompt lists every wrong option", () => {
    const user = buildRationaleUserPrompt({
      fieldId: "nursing",
      question: "What is the nurse's priority action?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
    });
    expect(user).toMatch(/WRONG OPTIONS/);
    expect(user).toMatch(/- B/);
    expect(user).toMatch(/- C/);
  });

  it("assembles markdown explanation with all sections", () => {
    const assembled = assembleStructuredRationale(SAMPLE);
    expect(assembled.explanation).toMatch(/Why this answer is correct/);
    expect(assembled.explanation).toMatch(/Why the other options are wrong/);
    expect(assembled.explanation).toMatch(/Key takeaway/);
    expect(assembled.explanation).toMatch(/Memory hook/);
    expect(Object.keys(assembled.distractorRationale)).toHaveLength(3);
  });

  it("validates complete rationales", () => {
    const verdict = validateStructuredRationale(
      SAMPLE,
      [
        "Notify the provider and prepare for IV fluid resuscitation",
        "Document findings and recheck vital signs in 4 hours",
        "Administer prescribed PO diuretic and encourage oral fluids",
        "Place the client in high Fowler's position and provide a fan",
      ],
      "Notify the provider and prepare for IV fluid resuscitation"
    );
    expect(verdict.ok).toBe(true);
    expect(verdict.score).toBeGreaterThanOrEqual(70);
  });

  it("detects weak legacy rationales", () => {
    const check = needsRationaleEnrichment({
      question: "Priority action?",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "A is correct because the patient is unstable.",
    });
    expect(check.needs).toBe(true);
    expect(check.reasons).toContain("missing_distractors");
  });

  it("parses assembled markdown for display", () => {
    const assembled = assembleStructuredRationale(SAMPLE);
    const parsed = parseRationaleForDisplay(assembled.explanation);
    expect(parsed.isStructured).toBe(true);
    expect(parsed.wrongOptions.length).toBe(3);
    expect(parsed.keyTakeaway).toMatch(/perfusion failure/i);
    expect(parsed.memoryHook).toMatch(/Shock before sheet/i);
  });
});
