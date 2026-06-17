import { describe, expect, it } from "vitest";
import {
  examQuestionMeetsBoardBar,
  rawQuestionMeetsBoardBar,
  studyQuestionMeetsBoardBar,
} from "./board-serve-quality";

describe("board-serve-quality", () => {
  it("accepts board-caliber MCQs", () => {
    const q = {
      id: 1,
      type: "multiple_choice" as const,
      question: "What is the most appropriate next step?",
      options: ["Start heparin", "Order CT", "Give nitroglycerin", "Discharge home"],
      correctAnswer: "Start heparin",
      explanation: "STEMI requires immediate anticoagulation and cath lab activation.",
    };
    expect(rawQuestionMeetsBoardBar(q)).toBe(true);
    expect(examQuestionMeetsBoardBar(q)).toBe(true);
  });

  it("rejects placeholder distractors and thin rationales", () => {
    const weak = {
      id: 1,
      type: "multiple_choice" as const,
      question: "Test question?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "Option A",
      explanation: "Because.",
    };
    expect(rawQuestionMeetsBoardBar(weak)).toBe(false);

    const thinRationale = {
      ...weak,
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      explanation: "Twenty chars exactly!!",
    };
    expect(rawQuestionMeetsBoardBar(thinRationale)).toBe(false);

    const shortStem = {
      ...thinRationale,
      explanation: "Long enough rationale with teaching points for learners.",
    };
    expect(rawQuestionMeetsBoardBar({ ...shortStem, question: "Too short" })).toBe(false);
  });

  it("validates prepared study questions", () => {
    expect(
      studyQuestionMeetsBoardBar({
        id: "q-1",
        sourceIndex: 0,
        type: "multiple_choice",
        stem: "Which test confirms the diagnosis?",
        options: ["ECG", "CXR", "CT head", "Urinalysis"],
        correctAnswers: ["ECG"],
        explanation: "ECG shows ST elevation consistent with acute MI.",
        difficulty: "medium",
      })
    ).toBe(true);
  });
});
