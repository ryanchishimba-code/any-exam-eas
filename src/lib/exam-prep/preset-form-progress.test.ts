import { describe, expect, it } from "vitest";
import {
  nextUnstartedExamNumber,
  pickNextUnusedPresetForm,
  practiceExamBoardLabel,
  practiceExamDisplayIndex,
  practiceExamLengthNote,
  preservePresetFormOnAnalysis,
  previewPracticeExams,
  studentPracticeExamTitle,
  summarizePresetFormUses,
  usedPresetExamNumbers,
} from "./preset-form-progress";

const forms = [
  { examNumber: 1, questionCount: 85 },
  { examNumber: 2, questionCount: 85 },
  { examNumber: 10, questionCount: 85 },
  { examNumber: 11, questionCount: 225 },
];

describe("pickNextUnusedPresetForm", () => {
  it("picks the lowest unused form whose length matches the simulation", () => {
    expect(pickNextUnusedPresetForm(forms, new Set(), 85)?.examNumber).toBe(1);
    expect(pickNextUnusedPresetForm(forms, new Set([1]), 85)?.examNumber).toBe(2);
    expect(pickNextUnusedPresetForm(forms, new Set([1, 2]), 85)?.examNumber).toBe(10);
  });

  it("leaves a longer simulation on the bank path when no form matches", () => {
    expect(pickNextUnusedPresetForm(forms, new Set(), 225)?.examNumber).toBe(11);
    expect(pickNextUnusedPresetForm(forms.filter((form) => form.questionCount === 85), new Set(), 225)).toBeNull();
    expect(pickNextUnusedPresetForm(forms, new Set([1, 2, 10]), 85)).toBeNull();
  });
});

describe("practice exam labels", () => {
  it("names a shorter form by its stored length and keeps a matching form plain", () => {
    expect(practiceExamLengthNote(85, 225)).toBe("85-question practice exam");
    expect(practiceExamLengthNote(85, 85)).toBe("85 questions");
    expect(practiceExamLengthNote(85, 150)).toBe("85-question practice exam");
    expect(practiceExamLengthNote(40, 200)).toBe("40-question practice exam");
    expect(practiceExamLengthNote(55, 200)).toBe("55-question practice exam");
    expect(practiceExamLengthNote(70, 200)).toBe("70-question practice exam");
  });

  it("numbers student titles in list order and leaves stored exam numbers out", () => {
    const stored = [2621, 9172, 9301];
    expect(practiceExamBoardLabel("usmle", "usmle-step-3")).toBe("USMLE Step 3");
    expect(practiceExamBoardLabel("usmle", "usmle-step-1")).toBe("USMLE Step 1");
    expect(practiceExamBoardLabel("usmle", "usmle-step-2")).toBe("USMLE Step 2 CK");
    expect(practiceExamBoardLabel("naplex", "pharmacy")).toBe("NAPLEX");
    expect(practiceExamBoardLabel("nclex", "nursing")).toBe("NCLEX-RN");
    expect(practiceExamBoardLabel("aanp-fnp", "aanp-fnp")).toBe("AANP FNP-C");
    expect(practiceExamBoardLabel("pance", "pance")).toBe("PANCE");
    expect(practiceExamBoardLabel("npte-pt", "npte-pt")).toBe("NPTE-PT");
    expect(studentPracticeExamTitle("USMLE Step 3", practiceExamDisplayIndex(stored, 2621))).toBe(
      "USMLE Step 3 Practice Exam 1"
    );
    expect(studentPracticeExamTitle("USMLE Step 3", practiceExamDisplayIndex(stored, 9301))).toBe(
      "USMLE Step 3 Practice Exam 3"
    );
    expect(studentPracticeExamTitle("USMLE Step 3", 2)).not.toMatch(/9172|2621|9301|shortfall|coming soon|placeholder/i);
  });
});

describe("preset form status", () => {
  it("keeps the newest in-progress or completed sitting and ignores abandoned rows", () => {
    const uses = summarizePresetFormUses([
      { id: "new", status: "in_progress", score: null, analysis: { presetFormId: "nclex:2" } },
      { id: "old", status: "completed", score: 70, analysis: { presetFormId: "nclex:2" } },
      { id: "done", status: "completed", score: 81, analysis: { presetFormId: "nclex:1", presetExamNumber: 1 } },
      { id: "drop", status: "abandoned", score: null, analysis: { presetFormId: "nclex:3" } },
    ]);
    expect(uses.get("nclex:2")).toMatchObject({ status: "in_progress", sessionId: "new" });
    expect(uses.get("nclex:1")).toMatchObject({ status: "completed", score: 81 });
    expect(uses.has("nclex:3")).toBe(false);
    expect(usedPresetExamNumbers(uses)).toEqual(new Set([1, 2]));
  });

  it("preserves the form id when a submit replaces analysis", () => {
    const next = preservePresetFormOnAnalysis(
      { presetFormId: "naplex:12", presetExamNumber: 12, prefetchedQuestionIds: ["a"] },
      { summary: "Completed NAPLEX simulation.", endedEarly: false }
    );
    expect(next.presetFormId).toBe("naplex:12");
    expect(next.presetExamNumber).toBe(12);
    expect(next.summary).toBe("Completed NAPLEX simulation.");
    expect(preservePresetFormOnAnalysis(null, { summary: "x" })).toEqual({ summary: "x" });
  });

  it("highlights the next unstarted form and keeps the preview compact", () => {
    const rows = [
      { examNumber: 1, status: "completed" as const },
      { examNumber: 2, status: "in_progress" as const },
      { examNumber: 3, status: "not_started" as const },
      { examNumber: 4, status: "not_started" as const },
      { examNumber: 5, status: "not_started" as const },
    ];
    expect(nextUnstartedExamNumber(rows)).toBe(3);
    expect(previewPracticeExams(rows, false).map((row) => row.examNumber)).toEqual([2, 3, 4]);
    const manyOpen = [
      { examNumber: 1, status: "in_progress" as const },
      { examNumber: 2, status: "in_progress" as const },
      { examNumber: 3, status: "in_progress" as const },
      { examNumber: 4, status: "in_progress" as const },
      { examNumber: 5, status: "not_started" as const },
    ];
    expect(previewPracticeExams(manyOpen, false).map((row) => row.examNumber)).toEqual([1, 2, 3, 4, 5]);
    expect(previewPracticeExams(rows, true)).toHaveLength(5);
    expect(previewPracticeExams(rows.slice(0, 2), false)).toHaveLength(2);
  });
});
