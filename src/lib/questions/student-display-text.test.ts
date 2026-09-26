import { describe, expect, it } from "vitest";
import { examQuestionToStudy } from "./prepare";
import {
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
