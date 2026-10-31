import { beforeEach, describe, expect, it, vi } from "vitest";
import { bankItemToSessionRaw } from "@/lib/exam-prep/prepare-bank-session";
import { getFieldMetaById } from "@/lib/fields";
import { applyRevealedAnswer } from "@/lib/questions/apply-revealed-answer";
import { createStudySession } from "@/lib/questions/session-engine";
import { examQuestionToStudy, isAnswerCorrect } from "@/lib/questions/prepare";
import type { BankItem } from "@/lib/question-bank";
import type { RawQuestionInput } from "@/lib/questions/types";

const SHUFFLE_SEED = 0x161;
const FIELD_ID = "nursing";
const FIELD_LABEL = getFieldMetaById(FIELD_ID)?.label ?? FIELD_ID;

const buildNclexTodayForUser = vi.hoisted(() => vi.fn());
const guardExamReveal = vi.hoisted(() => vi.fn());
const findMany = vi.hoisted(() => vi.fn());
const findUnique = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api-access", () => ({
  requireStudyApi: async () => ({
    ok: true,
    userId: "user-1",
    access: { hasStudyAccess: true },
  }),
}));

vi.mock("@/lib/engine/mastery/feature-flag", () => ({
  isTodayEngineEnabled: () => true,
  isTodayEngineNaplexEnabled: () => true,
  isTodayEngineUsmleEnabled: () => true,
}));

vi.mock("@/lib/engine/mastery/today-service", () => ({
  buildNclexTodayForUser,
  buildNaplexTodayForUser: vi.fn(),
  buildUsmleTodayForUser: vi.fn(),
}));

vi.mock("@/lib/exam-sessions/reveal-guard", () => ({
  guardExamReveal,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { questionBankItem: { findMany, findUnique } },
}));

import { POST as postToday } from "./route";
import { POST as postReveal } from "../ngn-reveal/route";

const NORMAL: BankItem = {
  id: "today-shuffle-normal",
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
  id: "today-shuffle-locked",
  question: "Which statements are true?",
  options: ["Statement I only", "Statements I and III", "Statements II and III", "I, II, and III"],
  correctAnswer: "Statements I and III",
  explanation: "Both true statements apply.",
  subjectId: "safety",
  itemType: "mcq",
};

const PINNED: BankItem = {
  id: "today-shuffle-pinned",
  question: "Which action addresses the elevated INR?",
  options: ["Check the INR", "Hold today's warfarin", "Give vitamin K now", "All of the above"],
  correctAnswer: "Hold today's warfarin",
  explanation: "A mildly high INR is held, not reversed.",
  subjectId: "safety",
  itemType: "mcq",
};

const ITEMS = [NORMAL, LOCKED, PINNED];

function storedRow(item: BankItem) {
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
}

function seeded(item: BankItem, index: number) {
  const raw = bankItemToSessionRaw(FIELD_ID, FIELD_LABEL, item.subjectId ?? "mixed", item, index);
  return examQuestionToStudy(
    { ...raw, bankItemId: item.id, subjectId: item.subjectId ?? "mixed", field: FIELD_LABEL },
    index,
    { shuffleOptions: true, shuffleSeed: SHUFFLE_SEED }
  );
}

function unshuffled(item: BankItem, index: number) {
  const raw = bankItemToSessionRaw(FIELD_ID, FIELD_LABEL, item.subjectId ?? "mixed", item, index);
  return examQuestionToStudy(
    { ...raw, bankItemId: item.id, subjectId: item.subjectId ?? "mixed", field: FIELD_LABEL },
    index,
    { shuffleOptions: false }
  );
}

async function loadToday() {
  const response = await postToday(
    new Request("https://example.test/api/study/today", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ examSlug: "nclex" }),
    })
  );
  expect(response.status).toBe(200);
  return (await response.json()) as {
    questions: Array<{
      stem?: string;
      options: string[];
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

describe("POST /api/study/today option shuffle", () => {
  beforeEach(() => {
    buildNclexTodayForUser.mockReset();
    buildNclexTodayForUser.mockResolvedValue({
      bankItemIds: ITEMS.map((item) => item.id),
      fieldId: FIELD_ID,
      cellKeys: [],
      primers: [],
      size: ITEMS.length,
    });
    findMany.mockReset();
    findMany.mockImplementation(async (args: { where: { id: { in: string[] } } }) => {
      const wanted = new Set(args.where.id.in);
      return ITEMS.filter((item) => item.id && wanted.has(item.id));
    });
    findUnique.mockReset();
    findUnique.mockImplementation(async (args: { where: { id: string } }) => {
      const item = ITEMS.find((row) => row.id === args.where.id);
      return item ? storedRow(item) : null;
    });
    guardExamReveal.mockReset();
    guardExamReveal.mockResolvedValue("allow");
  });

  it("shuffles for the seed, grades the client order, and keeps locked choices put", async () => {
    const first = await loadToday();
    const second = await loadToday();
    expect(second.questions.map((question) => question.options)).toEqual(
      first.questions.map((question) => question.options)
    );

    const [normal, locked, pinned] = first.questions;
    expect(normal?.options).toEqual(seeded(NORMAL, 0).options);
    expect(normal?.options).not.toEqual(unshuffled(NORMAL, 0).options);
    expect(locked?.options).toEqual(unshuffled(LOCKED, 1).options);
    expect(pinned?.options.at(-1)).toBe("All of the above");
    expect(pinned?.options).toEqual(seeded(PINNED, 2).options);
    for (const question of first.questions) expect(question.correctAnswer).toBe("");

    // StudyBankPractice copies the delivered options, then StudySessionPlayer
    // sends that client order to the reveal route.
    const raw: RawQuestionInput[] = first.questions.map((question, index) => ({
      id: index + 1,
      question: question.stem ?? "",
      options: question.options,
      correctAnswer: (question.correctAnswers ?? []).join(", "),
      explanation: question.explanation ?? "",
      field: FIELD_LABEL,
      subjectId: question.subjectId ?? "safety",
      bankItemId: question.bankItemId ?? question.id,
      type: (question.type as RawQuestionInput["type"]) ?? "multiple_choice",
      vignette: question.vignette,
      tags: question.tags,
    }));
    const session = createStudySession({
      questions: raw,
      field: FIELD_LABEL,
      subjectId: "safety",
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
