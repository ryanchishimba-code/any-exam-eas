import { describe, expect, it } from "vitest";
import { bankItemToSessionRaw } from "@/lib/exam-prep/prepare-bank-session";
import { examQuestionToStudy } from "@/lib/questions/prepare";
import type { BankItem } from "@/lib/question-bank";
import { gradeSelection, promptFromStudy, toPlayableQuestion } from "./present";

const SHUFFLE_SEED = 0x161;
const FIELD_ID = "nursing";

const NORMAL: BankItem = {
  id: "readiness-shuffle-normal",
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
  id: "readiness-shuffle-locked",
  question: "Which statements are true?",
  options: ["Statement I only", "Statements I and III", "Statements II and III", "I, II, and III"],
  correctAnswer: "Statements I and III",
  explanation: "Both true statements apply.",
  subjectId: "safety",
  itemType: "mcq",
};

const PINNED: BankItem = {
  id: "readiness-shuffle-pinned",
  question: "Which action addresses the elevated INR?",
  options: ["Check the INR", "Hold today's warfarin", "Give vitamin K now", "None of the following"],
  correctAnswer: "Hold today's warfarin",
  explanation: "A mildly high INR is held, not reversed.",
  subjectId: "safety",
  itemType: "mcq",
};

function seeded(item: BankItem) {
  const raw = bankItemToSessionRaw(FIELD_ID, FIELD_ID, item.subjectId ?? "mixed", item, 0);
  return examQuestionToStudy(
    { ...raw, bankItemId: item.id, field: FIELD_ID, subjectId: item.subjectId },
    0,
    { shuffleOptions: true, shuffleSeed: SHUFFLE_SEED }
  );
}

function unshuffled(item: BankItem) {
  const raw = bankItemToSessionRaw(FIELD_ID, FIELD_ID, item.subjectId ?? "mixed", item, 0);
  return examQuestionToStudy(
    { ...raw, bankItemId: item.id, field: FIELD_ID, subjectId: item.subjectId },
    0,
    { shuffleOptions: false }
  );
}

describe("readiness option shuffle", () => {
  it("shuffles for the seed, grades by option text, and keeps locked choices put", () => {
    const normal = toPlayableQuestion(FIELD_ID, NORMAL);
    const normalAgain = toPlayableQuestion(FIELD_ID, NORMAL);
    const locked = toPlayableQuestion(FIELD_ID, LOCKED);
    const pinned = toPlayableQuestion(FIELD_ID, PINNED);
    expect(normal?.options).toEqual(normalAgain?.options);
    expect(normal?.options).toEqual(seeded(NORMAL).options);
    expect(normal?.options).not.toEqual(unshuffled(NORMAL).options);
    expect(locked?.options).toEqual(unshuffled(LOCKED).options);
    expect(pinned?.options.at(-1)).toBe("None of the following");
    expect(pinned?.options).toEqual(seeded(PINNED).options);

    for (const [item, study] of [
      [NORMAL, normal],
      [LOCKED, locked],
      [PINNED, pinned],
    ] as const) {
      expect(study).not.toBeNull();
      const prompt = promptFromStudy(study!, {
        itemId: item.id!,
        index: 0,
        total: 3,
        areaId: "safety",
        areaLabel: "Safety",
      });
      expect(prompt.options).toEqual(study!.options);
      const right = gradeSelection(study!, [item.correctAnswer]);
      const wrong = gradeSelection(study!, [study!.options.find((option) => option !== item.correctAnswer)!]);
      expect(right).toMatchObject({ ok: true, correct: true });
      expect(wrong).toMatchObject({ ok: true, correct: false });
    }
  });
});
