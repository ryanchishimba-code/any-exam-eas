import { describe, expect, it } from "vitest";
import { examQuestionToStudy, studyQuestionsToExamQuestions } from "./prepare";
import { difficultyChipText, storedDifficultyValue } from "./difficulty-label";

describe("stored difficulty label", () => {
  it("shows the stored number and hides a missing field", () => {
    expect(difficultyChipText(3)).toBe("Difficulty 3");
    expect(difficultyChipText(null)).toBeNull();
    expect(difficultyChipText(undefined)).toBeNull();
    expect(storedDifficultyValue("medium")).toBeUndefined();
  });

  it("keeps a stored difficulty on the student payload and drops a missing one", () => {
    const withDifficulty = examQuestionToStudy(
      {
        id: 1,
        type: "multiple_choice",
        question: "Which finding is urgent?",
        options: ["New chest pain", "Warm feet"],
        correctAnswer: "New chest pain",
        explanation: "New chest pain can mean ischemia.",
        difficulty: 4,
      },
      0,
      { shuffleOptions: false }
    );
    expect(withDifficulty.storedDifficulty).toBe(4);
    expect(difficultyChipText(withDifficulty.storedDifficulty)).toBe("Difficulty 4");
    const [delivered] = studyQuestionsToExamQuestions([withDifficulty]);
    expect(delivered?.difficulty).toBe(4);

    const missing = examQuestionToStudy(
      {
        id: 2,
        type: "multiple_choice",
        question: "Which finding is urgent?",
        options: ["New chest pain", "Warm feet"],
        correctAnswer: "New chest pain",
        explanation: "New chest pain can mean ischemia.",
      },
      1,
      { shuffleOptions: false }
    );
    expect(missing.storedDifficulty).toBeUndefined();
    expect(difficultyChipText(missing.storedDifficulty)).toBeNull();
    const [without] = studyQuestionsToExamQuestions([missing]);
    expect(without?.difficulty).toBeUndefined();
  });
});
