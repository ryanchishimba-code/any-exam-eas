import { describe, expect, it } from "vitest";
import { preparedTimedExamItemsForClient } from "@/lib/exam-prep/prepare-timed-exam-client-payload";
import { canonicalStoredQuestionKey } from "@/lib/assessment/serve";
import type { BankItem } from "@/lib/question-bank";
import { NCLEX_STEP_NAMES } from "@/lib/full-exam/nclex-exam-labels";
import { examQuestionToStudy, isAnswerCorrect, studyQuestionsToExamQuestions } from "@/lib/questions/prepare";
import { applyRevealedAnswer } from "@/lib/questions/apply-revealed-answer";
import { revealStudyAnswer } from "@/lib/questions/reveal-study-answer";
import { findBannedStudentKeys, findPreSubmitAnswerLeaks } from "@/lib/questions/student-payload";

describe("pre-submit payloads", () => {
  it("scans practice and exam payloads for key and rationale fields", () => {
    const study = examQuestionToStudy(
      {
        id: 1,
        bankItemId: "ngn:NC003-S1:v1",
        type: "multiple_choice",
        question: "Which finding should the nurse report first?",
        vignette: "Day after PCI: chest pain\nThe client is short of breath.",
        options: ["New chest pain", "Warm feet", "Quiet room", "Finished lunch"],
        correctAnswer: "New chest pain",
        explanation: "Option A is the change to report. Chest pain can mean ischemia.",
        expertRationale: {
          short: "Report the new pain.",
          expanded: { perOption: {}, cjmmCoaching: "", pointsLost: "", takeaway: "Report new pain." },
        },
        solutionSteps: ["Compare with the last pain score."],
        clinicalReasoning: "A new pain report comes before comfort measures.",
        ngnPayload: {
          kind: "sequential",
          setId: "NC003",
          stepIndex: 1,
          caseTitle: "Day after PCI: chest pain",
          cjmmFunction: "recognize_cues",
          rationale: "Hidden rationale",
          highlights: ["chest pain"],
          rnFlags: ["RN to confirm oxytocin at 14 mL/h. Scenario revised during self-review."],
          qaNotes: ["RN to confirm the revised rate."],
          pharmdFlags: ["PharmD flag: revised"],
          reviewerNotes: "RN to confirm",
          signoff: "revised",
          authoring: { note: "RN to confirm revised" },
          rows: [{ id: "r1", text: "New chest pain", reviewNotes: "RN to confirm revised", signoff: "revised" }],
        },
      },
      0,
      { shuffleOptions: false }
    );
    const [api] = studyQuestionsToExamQuestions([study]);
    expect(findPreSubmitAnswerLeaks(api)).toEqual([]);
    expect(findBannedStudentKeys(api)).toEqual([]);
    expect(api?.correctAnswer).toBe("");
    expect(api?.explanation).toBe("");
    expect(JSON.stringify(api)).not.toContain("Hidden rationale");
    expect(JSON.stringify(api)).not.toContain("recognize_cues");
    expect(JSON.stringify(api)).not.toMatch(/RN to confirm/i);
    expect(JSON.stringify(api)).not.toMatch(/revised/i);
    expect(JSON.stringify(study)).not.toMatch(/RN to confirm/i);
    expect(JSON.stringify(study)).not.toMatch(/revised/i);

    const revealed = revealStudyAnswer(study, {
      selected: ["New chest pain"],
      options: api?.options,
    });
    expect(revealed.correct).toBe(true);
    expect(revealed.correctAnswer).toBe("New chest pain");
    expect(revealed.explanation.length).toBeGreaterThan(20);
    const graded = applyRevealedAnswer(
      examQuestionToStudy({ ...api!, id: 1, bankItemId: study.bankItemId }, 0, { shuffleOptions: false }),
      revealed
    );
    expect(isAnswerCorrect(graded, ["New chest pain"])).toBe(true);
    expect(isAnswerCorrect(graded, ["Quiet room"])).toBe(false);
  });

  it("keeps a shuffled explanation letter on the delivered choice", () => {
    const study = examQuestionToStudy(
      {
        id: 4,
        bankItemId: "letter-1",
        type: "multiple_choice",
        question: "Which action should the nurse take first?",
        options: ["Give fluids", "Obtain cultures, then antibiotics", "Apply oxygen", "Document only"],
        correctAnswer: "Obtain cultures, then antibiotics",
        explanation: "Option B is correct because cultures come before antibiotics.",
      },
      0,
      { shuffleSeed: 11 }
    );
    const [api] = studyQuestionsToExamQuestions([study]);
    expect(findPreSubmitAnswerLeaks(api)).toEqual([]);
    const revealed = revealStudyAnswer(study, {
      selected: [study.correctAnswers[0]!],
      options: api?.options,
    });
    const letter = String.fromCharCode(65 + (api?.options ?? []).indexOf(study.correctAnswers[0]!));
    expect(revealed.explanation).toContain(`Option ${letter}`);
    expect(revealed.correct).toBe(true);
  });

  it("seals catalog slot ids on the exam payload and still opens them for scoring", () => {
    const item: BankItem = {
      id: "ngn:NC003-S1:v1",
      question: "Which finding should the nurse report first?",
      vignette: "Day after PCI: chest pain\nMed-surg unit",
      options: ["New chest pain", "Warm feet", "Quiet room", "Finished lunch"],
      correctAnswer: "New chest pain",
      explanation: "New chest pain is the change to report first.",
      itemType: "case_study",
      subjectId: "physiological-adaptation",
      ngnPayload: {
        kind: "sequential",
        setId: "NC003",
        stepIndex: 1,
        caseTitle: "Day after PCI: chest pain",
        cjmmFunction: "recognize_cues",
        rnFlags: ["RN to confirm oxytocin at 14 mL/h. Scenario revised during self-review."],
        qaNotes: ["revised"],
        pharmdFlags: ["RN to confirm"],
        reviewerNotes: "revised",
        signoff: "RN to confirm",
        rows: [{ id: "r1", text: "New chest pain", reviewNotes: "RN to confirm this row was revised" }],
      },
      tags: ["published-ngn-catalog"],
      qaPassed: true,
      active: true,
    };
    const payload = preparedTimedExamItemsForClient("nursing", "nursing", [item], 1, { shuffleSeed: 2 });
    const wire = JSON.stringify({ questions: payload.questions, bankItemIds: payload.bankItemIds });
    expect(findPreSubmitAnswerLeaks(payload.questions)).toEqual([]);
    expect(findBannedStudentKeys(payload.questions)).toEqual([]);
    expect(wire).not.toMatch(/RN to confirm/i);
    expect(wire).not.toMatch(/revised/i);
    expect(wire).not.toMatch(/NC003-S/);
    expect(wire).not.toMatch(/"NC003"/);
    expect(wire).not.toContain("Day after PCI");
    for (const name of NCLEX_STEP_NAMES) expect(wire).not.toContain(name);
    expect(wire).not.toContain("recognize_cues");
    expect(payload.canonicalBankItemIds).toEqual(["ngn:NC003-S1:v1"]);
    expect(canonicalStoredQuestionKey(payload.bankItemIds[0]!)).toBe("ngn:NC003-S1:v1");
    expect(payload.questions[0]?.ngnPayload?.stepIndex).toBe(1);
  });
});
