import { describe, expect, it } from "vitest";
import { examQuestionToStudy } from "./prepare";
import {
  citationFitsQuestion,
  figureFitsQuestion,
  splitGluedLeadIn,
  stripInternalDisplayMetadata,
  studentFacingExhibitKind,
} from "./student-display-text";

describe("student display text", () => {
  it("splits a lead-in that runs into the scenario without punctuation", () => {
    expect(splitGluedLeadIn("The client finished chemotherapy Which action should the nurse take first?")).toEqual({
      vignette: "The client finished chemotherapy.",
      stem: "Which action should the nurse take first?",
    });
    expect(splitGluedLeadIn("Reports a side effect Which action should the nurse take?")).toEqual({
      vignette: "Reports a side effect.",
      stem: "Which action should the nurse take?",
    });
  });

  it("leaves a punctuated scenario and lead-in together for the existing splitter", () => {
    const text = "The client finished chemotherapy. Which action should the nurse take first?";
    expect(splitGluedLeadIn(text).vignette).toBeUndefined();
    expect(splitGluedLeadIn(text).stem).toBe(text);
  });

  it("strips visit-batch metadata without touching the clinical sentence", () => {
    expect(stripInternalDisplayMetadata("The fundus is boggy (Visit batch 13).")).toBe("The fundus is boggy.");
    expect(stripInternalDisplayMetadata("Visit batch 13 The client is dizzy.")).toBe("The client is dizzy.");
  });

  it("hides internal blueprint stamps and exhibit ids", () => {
    expect(stripInternalDisplayMetadata("references: NABP NAPLEX 2026, ADA Standards")).toBe(
      "references: ADA Standards"
    );
    expect(studentFacingExhibitKind("med_label")).toBe("Medication label");
    expect(studentFacingExhibitKind("diagram")).toBe("Diagram");
  });

  it("strips unit tags, doubled punctuation, and a quote split across a line break", () => {
    expect(stripInternalDisplayMetadata("Check the fundus (Unit 19).")).toBe("Check the fundus.");
    expect(stripInternalDisplayMetadata("Hold the dose.)?")).toBe("Hold the dose.");
    expect(stripInternalDisplayMetadata("Recheck the INR..")).toBe("Recheck the INR.");
    expect(stripInternalDisplayMetadata('The client said "I feel\nshort of breath" today.')).toBe(
      'The client said "I feel short of breath" today.'
    );
  });

  it("hides a bare source and a citation that does not match the stem", () => {
    expect(citationFitsQuestion("Source / Content Outline", "Pediatric triage")).toBe(false);
    expect(citationFitsQuestion("Content Outline", "A statin refill")).toBe(false);
    expect(
      citationFitsQuestion("AHA heart failure guideline", "A 4-year-old in pediatric triage has a fever.")
    ).toBe(false);
    expect(citationFitsQuestion("AHA heart failure guideline", "Heart failure with a low ejection fraction.")).toBe(
      true
    );
    expect(figureFitsQuestion("MDI technique diagram", "Teach dry-powder inhaler Diskus use.")).toBe(false);
    expect(figureFitsQuestion("DPI Diskus diagram", "Teach dry-powder inhaler Diskus use.")).toBe(true);
  });

  it("applies the split at study-question render time and keeps the stored stem intact", () => {
    const stored = "The client reports a side effect Which action should the nurse take first? (Visit batch 13)";
    const study = examQuestionToStudy(
      {
        id: 1,
        type: "multiple_choice",
        question: stored,
        options: ["Assess the client", "Leave the room", "Document later", "Discharge"],
        correctAnswer: "Assess the client",
        explanation: "Assessment comes first.",
      },
      0
    );
    expect(study.vignette).toBe("The client reports a side effect.");
    expect(study.stem).toMatch(/^Which action should the nurse take first/);
    expect(study.stem).not.toMatch(/visit batch/i);
    expect(study.vignette).not.toMatch(/visit batch/i);
    expect(stored).toMatch(/side effect Which action/);
  });
});
