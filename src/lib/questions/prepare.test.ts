import { describe, expect, it } from "vitest";
import {
  examQuestionToStudy,
  isAnswerCorrect,
  prepareQuestionsForSession,
  studyQuestionsToExamQuestions,
} from "./prepare";
import type { RawQuestionInput } from "./types";

const sample: RawQuestionInput = {
  id: 1,
  type: "multiple_choice",
  question: "Case: Which ion drives the Na/K pump?",
  options: ["Sodium", "Potassium", "Calcium", "Chloride"],
  correctAnswer: "Sodium",
  explanation: "ATPase pumps 3 Na+ out for 2 K+ in.",
};

describe("examQuestionToStudy", () => {
  it("normalizes stem and shuffles options while preserving correct answer", () => {
    const q = examQuestionToStudy(sample, 0);
    expect(q.stem).not.toMatch(/^case:/i);
    expect(q.options).toHaveLength(4);
    expect(q.correctAnswers).toHaveLength(1);
    const correct = q.correctAnswers[0];
    expect(q.options).toContain(correct);
  });

  it("keeps source and review date through the study round trip", () => {
    const q = examQuestionToStudy(
      {
        ...sample,
        sourceLabel: "ACC/AHA guideline",
        sourceUrl: "https://example.com/guideline",
        reviewedAt: "2026-06-01T00:00:00.000Z",
      },
      0
    );
    expect(q.sourceLabel).toBe("ACC/AHA guideline");
    expect(q.sourceUrl).toBe("https://example.com/guideline");
    expect(q.reviewedAt).toBe("2026-06-01T00:00:00.000Z");
    const [back] = studyQuestionsToExamQuestions([q]);
    expect(back?.sourceLabel).toBe("ACC/AHA guideline");
    expect(back?.reviewedAt).toBe("2026-06-01T00:00:00.000Z");
  });

  it("relabels a Step 2 CK outline citation on a Step 3 item", () => {
    const q = examQuestionToStudy(
      {
        ...sample,
        field: "usmle-step-3",
        sourceLabel: "USMLE Step 2 CK Content Outline 2026",
        references: ["USMLE Step 2 CK Content Outline 2026"],
      },
      0
    );
    expect(q.sourceLabel).toBe("USMLE Step 3 Content Outline 2026");
    expect(q.references).toEqual(["USMLE Step 3 Content Outline 2026"]);
  });

  it("leaves a Step 2 CK outline citation on a Step 2 item", () => {
    const q = examQuestionToStudy(
      {
        ...sample,
        field: "usmle-step-2",
        sourceLabel: "USMLE Step 2 CK Content Outline 2026",
      },
      0
    );
    expect(q.sourceLabel).toBe("USMLE Step 2 CK Content Outline 2026");
  });

  it("keeps subject and blueprint fields through the study round trip", () => {
    const q = examQuestionToStudy(
      {
        ...sample,
        subjectId: "pharmacokinetics",
        topicCategory: "pharmacokinetics",
        blueprintDomain: "naplex-2026-pharmacotherapy",
        blueprintTopic: "half-life",
      },
      0
    );
    expect(q.subjectId).toBe("pharmacokinetics");
    expect(q.topicCategory).toBe("pharmacokinetics");
    expect(q.blueprintDomain).toBe("naplex-2026-pharmacotherapy");
    expect(q.blueprintTopic).toBe("half-life");
    const [back] = studyQuestionsToExamQuestions([q]);
    expect(back?.subjectId).toBe("pharmacokinetics");
    expect(back?.topicCategory).toBe("pharmacokinetics");
    expect(back?.blueprintDomain).toBe("naplex-2026-pharmacotherapy");
    expect(back?.blueprintTopic).toBe("half-life");
  });
});

describe("isAnswerCorrect", () => {
  it("matches answers case-insensitively", () => {
    const q = examQuestionToStudy(sample, 0);
    const correct = q.correctAnswers[0];
    expect(isAnswerCorrect(q, [correct])).toBe(true);
    expect(isAnswerCorrect(q, ["wrong"])).toBe(false);
  });
});

describe("prepareQuestionsForSession", () => {
  it("can preserve order when shuffleOrder is false", () => {
    const items = [sample, { ...sample, id: 2, question: "Second question?" }];
    const ordered = prepareQuestionsForSession(items, { shuffleOrder: false });
    expect(ordered).toHaveLength(2);
    expect(ordered[0].sourceIndex).toBe(1);
    expect(ordered[1].sourceIndex).toBe(2);
  });
});
