import { describe, expect, it } from "vitest";
import {
  GENERIC_JUDGMENT_LABELS,
  NCLEX_STEP_NAMES,
  clientNeedLabel,
  examAnswerEditable,
  examModeItemText,
  genericJudgmentLabel,
  lockAnswerOnNext,
  studentCaseChrome,
  studentQuestionPosition,
  tallyLabeledScores,
  withoutCaseTitle,
} from "./nclex-exam-labels";

const STEP_NAME = /Recognize cues|Analyze cues|Prioritize hypotheses|Generate solutions|Take action|Evaluate outcomes/;

describe("exam-mode labels and locking", () => {
  it("prints no step name and no case title in exam mode", () => {
    for (let step = 1; step <= 6; step += 1) {
      const text = examModeItemText({
        stem: "Which finding requires follow-up?",
        step,
        caseTitle: "Night-time confusion",
      });
      expect(text).toBe("Which finding requires follow-up?");
      expect(text).not.toMatch(STEP_NAME);
      expect(text).not.toContain("Night-time confusion");
    }
    const chrome = studentCaseChrome({
      surface: "exam",
      step: 1,
      caseTitle: "Going home safely",
    });
    expect(chrome.stepLabel).toBeNull();
    expect(chrome.caseTitle).toBeNull();
  });

  it("counts case questions without a step number or step name", () => {
    expect(studentQuestionPosition(2, 6)).toBe("Question 3 of 6");
    expect(studentQuestionPosition(0, 1)).toBe("Question 1 of 1");
    expect(studentQuestionPosition(2, 6)).not.toMatch(STEP_NAME);
    expect(studentQuestionPosition(2, 6)).not.toMatch(/^\d+\s/);
  });

  it("hides step names in practice and keeps them on review", () => {
    expect(studentCaseChrome({ surface: "practice", step: 3, caseTitle: "Going home safely" })).toEqual({
      stepLabel: null,
      caseTitle: "Going home safely",
    });
    expect(studentCaseChrome({ surface: "review", step: 1, caseTitle: "Going home safely" }).stepLabel).toBe(
      "Recognize cues"
    );
  });

  it("locks the answered item on Next and does not move backward", () => {
    const first = lockAnswerOnNext(0, 85);
    expect(first).toEqual({ index: 1, lockedThrough: 1 });
    if (first === "submit") return;
    expect(examAnswerEditable(0, first.lockedThrough)).toBe(false);
    expect(examAnswerEditable(1, first.lockedThrough)).toBe(true);
    const later = lockAnswerOnNext(first.index, 85);
    expect(later).toEqual({ index: 2, lockedThrough: 2 });
    expect(lockAnswerOnNext(84, 85)).toBe("submit");
  });

  it("scores results with plain step labels and client-need categories", () => {
    expect(genericJudgmentLabel(1)).toBe("Noticing key findings");
    expect(GENERIC_JUDGMENT_LABELS.join(" ")).not.toMatch(STEP_NAME);
    expect(NCLEX_STEP_NAMES).toHaveLength(6);
    const steps = tallyLabeledScores([
      { label: genericJudgmentLabel(1), answered: true, correct: true },
      { label: genericJudgmentLabel(1), answered: true, correct: false },
      { label: genericJudgmentLabel(5), answered: false, correct: false },
    ]);
    expect(steps).toEqual([{ label: "Noticing key findings", correct: 1, total: 2, pct: 50 }]);
    expect(clientNeedLabel("Physiological Adaptation")).toBe("Physiological Adaptation");
    expect(clientNeedLabel("med-surg", "reduction-risk")).toBe("Reduction of Risk Potential");
    expect(withoutCaseTitle("Night-time confusion\n84-year-old man.", "Night-time confusion")).toBe(
      "84-year-old man."
    );
  });
});
