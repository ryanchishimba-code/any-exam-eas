import { beforeEach, describe, expect, it, vi } from "vitest";
import { bankItemToSessionRaw } from "@/lib/exam-prep/prepare-bank-session";
import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";
import { getFieldMetaById } from "@/lib/fields";
import { applyRevealedAnswer } from "@/lib/questions/apply-revealed-answer";
import { createStudySession } from "@/lib/questions/session-engine";
import { examQuestionToStudy, isAnswerCorrect } from "@/lib/questions/prepare";
import type { BankItem } from "@/lib/question-bank";
import type { RawQuestionInput } from "@/lib/questions/types";

const SHUFFLE_SEED = 0x161;
const FIELD_ID = "nursing";
const FIELD_LABEL = getFieldMetaById(FIELD_ID)?.label ?? FIELD_ID;

const loadServedTodaySet = vi.hoisted(() => vi.fn());
const guardExamReveal = vi.hoisted(() => vi.fn());
const findUnique = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api-access", () => ({
  requireStudyApi: async () => ({
    ok: true,
    userId: "user-1",
    access: { hasStudyAccess: true },
  }),
}));

vi.mock("@/lib/edtech/question-bank-scope", async () => {
  const actual = await vi.importActual<typeof import("@/lib/edtech/question-bank-scope")>(
    "@/lib/edtech/question-bank-scope"
  );
  return {
    ...actual,
    enforceQuestionBankFieldAccess: async () => ({ ok: true as const }),
  };
});

vi.mock("@/lib/study/usage-limits", () => ({
  checkStudyQuestionUsage: async () => ({ ok: true, allowedCount: 25, plan: "pro" }),
  recordStudyQuestionsServed: async () => undefined,
}));

vi.mock("@/lib/learning/today-set-plan", () => ({
  loadServedTodaySet,
}));

vi.mock("@/lib/analytics/conversions", () => ({
  trackConversionServer: () => undefined,
}));

vi.mock("@/lib/exam-sessions/reveal-guard", () => ({
  guardExamReveal,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { questionBankItem: { findUnique, findMany: vi.fn() } },
}));

import { POST as postDaily } from "./route";
import { POST as postReveal } from "../ngn-reveal/route";

const NORMAL: BankItem = {
  id: "daily-shuffle-normal",
  question: "Which action should the nurse take first?",
  options: [
    "Give intravenous fluids",
    "Obtain cultures, then antibiotics",
    "Apply oxygen and reassess",
    "Document and continue to monitor",
  ],
  correctAnswer: "Obtain cultures, then antibiotics",
  explanation: "Cultures come before antibiotics.",
  subjectId: "safety",
  itemType: "mcq",
};

const LOCKED: BankItem = {
  id: "daily-shuffle-locked",
  question: "Which statements are true?",
  options: ["Statement I only", "Statements I and III", "Statements II and III", "I, II, and III"],
  correctAnswer: "Statements I and III",
  explanation: "Both true statements apply.",
  subjectId: "safety",
  itemType: "mcq",
};

const PINNED: BankItem = {
  id: "daily-shuffle-pinned",
  question: "Which finding rules out this drug effect?",
  options: ["Rising potassium", "A new rash", "Missed doses", "None of the above"],
  correctAnswer: "A new rash",
  explanation: "A new rash is a separate problem.",
  subjectId: "safety",
  itemType: "mcq",
};

const ITEMS = [NORMAL, LOCKED, PINNED];

function seeded(item: BankItem, index: number) {
  return examQuestionToStudy(
    bankItemToSessionRaw(FIELD_ID, FIELD_LABEL, item.subjectId ?? MIXED_SUBJECT_ID, item, index),
    index,
    { shuffleOptions: true, shuffleSeed: SHUFFLE_SEED }
  );
}

function unshuffled(item: BankItem, index: number) {
  return examQuestionToStudy(
    bankItemToSessionRaw(FIELD_ID, FIELD_LABEL, item.subjectId ?? MIXED_SUBJECT_ID, item, index),
    index,
    { shuffleOptions: false }
  );
}

async function loadDaily() {
  const response = await postDaily(
    new Request("https://example.test/api/study/daily-set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field: FIELD_ID }),
    })
  );
  expect(response.status).toBe(200);
  return (await response.json()) as {
    bankItemIds: string[];
    questions: Array<{
      stem?: string;
      question?: string;
      options?: string[];
      correctAnswer?: string;
      correctAnswers?: string[];
      explanation?: string;
      subjectId?: string;
      bankItemId?: string;
      id?: string;
      type?: string;
      vignette?: string;
      tags?: string[];
    }>;
  };
}

describe("POST /api/study/daily-set option shuffle", () => {
  beforeEach(() => {
    loadServedTodaySet.mockReset();
    loadServedTodaySet.mockResolvedValue({
      selection: { target: 25, tomorrowCount: 25, topics: {} },
      mix: {
        ids: ITEMS.map((item) => item.id),
        reviewCount: 0,
        spacedReviewIds: [],
        newCount: ITEMS.length,
        mixLine: "3 new",
      },
      items: ITEMS,
    });
    findUnique.mockReset();
    findUnique.mockImplementation(async (args: { where: { id: string } }) => {
      const item = ITEMS.find((row) => row.id === args.where.id);
      if (!item) return null;
      return {
        id: item.id,
        subjectId: item.subjectId,
        question: item.question,
        options: JSON.stringify(item.options),
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        solutionSteps: null,
        tags: null,
        itemType: "mcq",
      };
    });
    guardExamReveal.mockReset();
    guardExamReveal.mockResolvedValue("allow");
  });

  it("shuffles for the seed, grades the client order, and keeps locked choices put", async () => {
    const first = await loadDaily();
    const second = await loadDaily();
    expect(second.questions.map((question) => question.options)).toEqual(
      first.questions.map((question) => question.options)
    );

    const [normal, locked, pinned] = first.questions;
    expect(normal?.options).toEqual(seeded(NORMAL, 0).options);
    expect(normal?.options).not.toEqual(unshuffled(NORMAL, 0).options);
    expect(locked?.options).toEqual(unshuffled(LOCKED, 1).options);
    expect(pinned?.options?.at(-1)).toBe("None of the above");
    expect(pinned?.options).toEqual(seeded(PINNED, 2).options);
    for (const question of first.questions) expect(question.correctAnswer).toBe("");

    const raw: RawQuestionInput[] = first.questions.map((question, index) => ({
      id: index + 1,
      question: question.question || question.stem || "",
      options: question.options ?? [],
      correctAnswer: question.correctAnswer || (question.correctAnswers ?? []).join(", "),
      explanation: question.explanation ?? "",
      field: FIELD_LABEL,
      subjectId: question.subjectId ?? MIXED_SUBJECT_ID,
      bankItemId: question.bankItemId ?? first.bankItemIds[index] ?? question.id,
      type: (question.type as RawQuestionInput["type"]) ?? "multiple_choice",
      vignette: question.vignette,
      tags: question.tags,
    }));
    const session = createStudySession({
      questions: raw,
      field: FIELD_LABEL,
      subjectId: MIXED_SUBJECT_ID,
      sourceType: "bank",
      mode: "practice",
    });

    for (const item of ITEMS) {
      const played = session.questions.find((question) => question.bankItemId === item.id);
      expect(played?.options).toEqual(expect.arrayContaining(item.options));
      expect(played?.options).toHaveLength(item.options.length);
      const reveal = await postReveal(
        new Request("https://example.test/api/study/ngn-reveal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemId: played?.bankItemId,
            version: 1,
            response: [item.correctAnswer],
            options: played?.options,
          }),
        })
      );
      expect(reveal.status).toBe(200);
      const body = (await reveal.json()) as {
        correct: boolean;
        answer: { correctAnswer: string; explanation: string };
      };
      expect(body.correct).toBe(true);
      expect(body.answer.correctAnswer).toBe(item.correctAnswer);
      const graded = applyRevealedAnswer(played!, body.answer);
      expect(isAnswerCorrect(graded, [item.correctAnswer])).toBe(true);
      const wrong = played!.options.find((option) => option !== item.correctAnswer)!;
      expect(isAnswerCorrect(graded, [wrong])).toBe(false);
    }
  });
});
