import { describe, expect, it } from "vitest";
import { practiceScorePercent } from "@/lib/full-exam/administered-score";
import {
  serializeCorrectAnswer,
  storedAnswerIncludesChoice,
} from "@/lib/full-exam/answer-serialize";
import { buildTopicBreakdown } from "@/lib/full-exam/topic-breakdown";
import { shouldOfferFullExamReviewSubmit } from "@/lib/full-exam/submit-intent";
import { initCatSession } from "@/lib/questions/cat-engine";
import { pickCatNext } from "@/lib/questions/cat-select";
import { mapApiQuestionsToStudy } from "@/lib/questions/map-api-questions";
import {
  examQuestionToStudy,
  isAnswerCorrect,
  studyQuestionsToExamQuestions,
} from "@/lib/questions/prepare";
import { applyRevealedAnswer } from "@/lib/questions/apply-revealed-answer";
import { revealStudyAnswer } from "@/lib/questions/reveal-study-answer";
import { findPreSubmitAnswerLeaks } from "@/lib/questions/student-payload";

describe("shuffled delivery and NGN CAT results", () => {
  it("scores and highlights the keyed choice after the client keeps the delivered order", () => {
    const prepared = examQuestionToStudy(
      {
        id: 1,
        bankItemId: "sepsis-1",
        type: "multiple_choice",
        question: "Which action should the nurse take first for suspected sepsis?",
        options: [
          "Give intravenous fluids",
          "Obtain cultures, then antibiotics",
          "Apply oxygen and reassess",
          "Document and continue to monitor",
        ],
        correctAnswer: "Obtain cultures, then antibiotics",
        explanation: "Option B is correct because cultures come before antibiotics.",
        subjectId: "management-of-care",
        topicCategory: "management-of-care",
      },
      0,
      { shuffleSeed: 11 }
    );
    const [delivered] = studyQuestionsToExamQuestions([prepared]);
    expect(findPreSubmitAnswerLeaks(delivered)).toEqual([]);
    expect(delivered?.correctAnswer).toBe("");
    expect(delivered?.explanation).toBe("");
    const revealed = revealStudyAnswer(prepared, {
      options: delivered?.options,
      selected: [prepared.correctAnswers[0]!],
    });
    expect(revealed.correct).toBe(true);
    const graded = applyRevealedAnswer(
      mapApiQuestionsToStudy(
        [
          {
            ...delivered!,
            subjectId: prepared.subjectId,
            topicCategory: prepared.topicCategory,
            bankItemId: prepared.bankItemId,
          },
        ],
        { shuffleOptions: false }
      )[0]!,
      revealed
    );
    const seen = graded;

    expect(seen!.options).toEqual(prepared.options);
    expect(isAnswerCorrect(seen!, [prepared.correctAnswers[0]!])).toBe(true);
    expect(isAnswerCorrect(seen!, ["Document and continue to monitor"])).toBe(false);
    expect(practiceScorePercent(1, 1)).toBe(100);

    const storedCorrect = serializeCorrectAnswer(seen!);
    expect(seen!.options).toContain(storedCorrect);
    expect(storedAnswerIncludesChoice(storedCorrect, storedCorrect)).toBe(true);
    expect(storedAnswerIncludesChoice(storedCorrect, "Document and continue to monitor")).toBe(
      storedCorrect === "Document and continue to monitor"
    );

    const topics = buildTopicBreakdown(
      [{ subjectId: seen!.subjectId, topicCategory: seen!.topicCategory }],
      [
        {
          questionIndex: 0,
          selected: storedCorrect,
          correct: true,
          answeredAt: "2026-10-06T00:00:00.000Z",
        },
      ]
    );
    expect(topics.map((row) => row.topic)).toEqual(["Management of Care"]);
  });

  it("scores an NGN select-all item in a CAT log and keeps its topic", () => {
    const study = examQuestionToStudy(
      {
        id: 2,
        bankItemId: "sata-1",
        type: "select_all",
        question: "Which actions are indicated? Select all that apply.",
        options: ["Draw cultures", "Start oxygen", "Document only"],
        correctAnswer: "Draw cultures|||Start oxygen",
        explanation: "Cultures and oxygen come before documentation.",
        subjectId: "pharmacology-nursing",
        topicCategory: "pharmacology-nursing",
        ngnPayload: { kind: "select_all" },
      },
      0,
      { shuffleOptions: false }
    );

    expect(study.type).toBe("select_all");
    expect(isAnswerCorrect(study, ["Start oxygen", "Draw cultures"])).toBe(true);
    expect(isAnswerCorrect(study, ["Document only"])).toBe(false);

    const storedCorrect = serializeCorrectAnswer(study);
    expect(storedAnswerIncludesChoice(storedCorrect, "Draw cultures")).toBe(true);
    expect(storedAnswerIncludesChoice(storedCorrect, "Start oxygen")).toBe(true);
    expect(storedAnswerIncludesChoice(storedCorrect, "Document only")).toBe(false);

    const topics = buildTopicBreakdown(
      [{ subjectId: study.subjectId, topicCategory: study.topicCategory }],
      [
        {
          questionIndex: 0,
          selected: storedCorrect,
          correct: true,
          answeredAt: "2026-10-06T00:00:00.000Z",
        },
      ]
    );
    expect(topics[0]?.topic).toBe("Pharmacological Therapies");
    expect(practiceScorePercent(1, 1)).toBe(100);
  });

  it("does not offer Review and submit while an NGN item is still available", () => {
    const pool = [
      { id: "served", difficultyBand: "medium" as const, ngn: false },
      { id: "ngn-next", difficultyBand: "medium" as const, ngn: true },
    ];
    const state = initCatSession();
    const next = pickCatNext(state, pool, new Set(["served"]), () => 0, {
      ngnTargetRatio: 0.22,
      delivered: [{ id: "served", ngn: false }],
    });
    expect(next).not.toBeNull();
    expect(
      shouldOfferFullExamReviewSubmit({
        isCat: true,
        index: 0,
        servedCount: 1,
        catAlreadyComplete: false,
        catStopsAfterCurrent: next == null,
      })
    ).toBe(false);
  });
});
