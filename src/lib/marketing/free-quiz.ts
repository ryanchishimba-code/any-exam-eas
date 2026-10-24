import { unstable_cache } from "next/cache";
import { parseBankOptions } from "@/lib/mpje/parse-bank-options";
import { parseSelectAllCorrectAnswers, selectAllAnswersMatchOptions } from "@/lib/question-format";
import { studentEligibleAndSql } from "@/lib/exam-prep/student-eligibility-sql";
import { sqlQuery } from "@/lib/db";
import type { BoardMarketingSlug } from "@/lib/landing/tokens";
import { MARKETING_BOARD_SLUGS } from "@/lib/marketing/board-paths";
import { readStoredCitations } from "@/lib/marketing/public-sample";
import { gradeSelection } from "@/lib/learning/readiness-check/present";
import { isAnswerCorrect } from "@/lib/questions/prepare";
import type { StudyQuestion } from "@/lib/questions/types";

export const FREE_QUIZ_QUESTION_COUNT = 10;

export type FreeQuizBoardSlug = BoardMarketingSlug;

export function isFreeQuizBoardSlug(value: string): value is FreeQuizBoardSlug {
  return (MARKETING_BOARD_SLUGS as readonly string[]).includes(value);
}

export type FreeQuizSelectionMode = "single" | "multi";

/** Client-safe question shape (no keyed answers or rationales). */
export type PublicFreeQuizQuestion = {
  id: string;
  stem: string;
  options: string[];
  selection: FreeQuizSelectionMode;
};

export type PublicFreeQuizPayload = {
  board: FreeQuizBoardSlug;
  /** UTC date bucket for the served set (rotates daily). */
  rotationKey: string;
  questions: PublicFreeQuizQuestion[];
};

/** Full bank row used for grading on the server only. */
export type FreeQuizBankQuestion = PublicFreeQuizQuestion & {
  correct: string[];
  rationale: string;
  sources: string[];
};

export type FreeQuizBankPayload = {
  board: FreeQuizBoardSlug;
  rotationKey: string;
  questions: FreeQuizBankQuestion[];
};

export type FreeQuizGradeAnswer = {
  id: string;
  selected: string[];
};

export type FreeQuizGradeResultItem = {
  id: string;
  stem: string;
  selection: FreeQuizSelectionMode;
  selected: string[];
  correctAnswers: string[];
  correct: boolean;
};

export type FreeQuizGradePayload = {
  board: FreeQuizBoardSlug;
  rotationKey: string;
  score: number;
  total: number;
  results: FreeQuizGradeResultItem[];
};

type QuizRow = {
  id: string;
  fieldId: string;
  itemType: string;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  references: unknown;
};

const BOARD_FIELD_IDS: Record<FreeQuizBoardSlug, readonly string[]> = {
  nclex: ["nursing"],
  naplex: ["pharmacy"],
  usmle: ["usmle-step-1", "usmle-step-2", "usmle-step-3"],
  "aanp-fnp": ["aanp-fnp"],
  pance: ["pance"],
  "npte-pt": ["npte-pt"],
};

/** Daily UTC rotation so the public set changes without exposing the full bank. */
export function freeQuizRotationKey(now = new Date()): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function usmleStepScopeSql(): string {
  return `
    AND (
      "fieldId" NOT LIKE 'usmle-step-%'
      OR (
        ("fieldId" = 'usmle-step-2' AND COALESCE("stepLevel", '') <> 'step3')
        OR ("fieldId" = 'usmle-step-3' AND COALESCE("stepLevel", 'step3') IN ('step3', ''))
        OR ("fieldId" = 'usmle-step-1')
      )
    )
  `;
}

export function toPublicFreeQuizQuestion(question: FreeQuizBankQuestion): PublicFreeQuizQuestion {
  return {
    id: question.id,
    stem: question.stem,
    options: question.options,
    selection: question.selection,
  };
}

export function toPublicFreeQuizPayload(bank: FreeQuizBankPayload): PublicFreeQuizPayload {
  return {
    board: bank.board,
    rotationKey: bank.rotationKey,
    questions: bank.questions.map(toPublicFreeQuizQuestion),
  };
}

function bankQuestionToStudy(question: FreeQuizBankQuestion): StudyQuestion {
  return {
    id: question.id,
    sourceIndex: 0,
    type: question.selection === "multi" ? "select_all" : "multiple_choice",
    stem: question.stem,
    options: question.options,
    correctAnswers: question.correct,
    explanation: question.rationale,
  };
}

function rowToQuizQuestion(row: QuizRow): FreeQuizBankQuestion | null {
  const stem = row.question?.trim() ?? "";
  const rationale = row.explanation?.trim() ?? "";
  const sources = readStoredCitations(row.references);
  if (!stem || !rationale) return null;

  const parsed = parseBankOptions(row.options ?? "");
  const options = parsed.options.map((option) => option.trim()).filter(Boolean);
  if (options.length < 2 || options.length > 6) return null;
  if (new Set(options).size !== options.length) return null;

  const key = row.correctAnswer?.trim() ?? "";
  if (!key) return null;

  const isSelectAll = row.itemType === "select_all";
  if (isSelectAll) {
    if (!selectAllAnswersMatchOptions(options, key)) return null;
    const correct = parseSelectAllCorrectAnswers(options, key);
    if (correct.length < 2) return null;
    return {
      id: row.id,
      stem,
      options,
      selection: "multi",
      correct,
      rationale,
      sources,
    };
  }

  if (key.includes("|||")) return null;
  const match =
    options.find((option) => option === key) ??
    options.find((option) => option.toLowerCase() === key.toLowerCase());
  if (!match) return null;

  return {
    id: row.id,
    stem,
    options,
    selection: "single",
    correct: [match],
    rationale,
    sources,
  };
}

async function queryFreeQuizRows(board: FreeQuizBoardSlug, rotationKey: string): Promise<QuizRow[]> {
  const fieldIds = BOARD_FIELD_IDS[board];
  const fieldList = fieldIds.map((id) => `'${id}'`).join(", ");
  const seed = rotationKey.replace(/'/g, "");
  return sqlQuery<QuizRow[]>(
    `
    SELECT id, "fieldId", "itemType", question, options, "correctAnswer", explanation, "references"
    FROM "QuestionBankItem"
    WHERE active = true
      AND "qaPassed" = true
      AND "itemType" IN ('mcq', 'vignette', 'select_all')
      AND "fieldId" IN (${fieldList})
      AND length(btrim(question)) BETWEEN 40 AND 900
      AND length(btrim(explanation)) BETWEEN 80 AND 1600
      AND (
        position('|||' IN "correctAnswer") = 0
        OR "itemType" = 'select_all'
      )
      AND "references" IS NOT NULL
      AND jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      ${usmleStepScopeSql()}
      ${studentEligibleAndSql()}
    ORDER BY md5(id || '${seed}')
    LIMIT ${FREE_QUIZ_QUESTION_COUNT}
    `,
    []
  );
}

async function loadFreeQuizPayload(board: FreeQuizBoardSlug): Promise<FreeQuizBankPayload> {
  const rotationKey = freeQuizRotationKey();
  try {
    const rows = await queryFreeQuizRows(board, rotationKey);
    const questions = rows
      .map((row) => rowToQuizQuestion(row))
      .filter((item): item is FreeQuizBankQuestion => item !== null);
    return { board, rotationKey, questions };
  } catch {
    return { board, rotationKey, questions: [] };
  }
}

const loadCachedFreeQuiz = unstable_cache(
  async (board: FreeQuizBoardSlug) => loadFreeQuizPayload(board),
  ["public-free-quiz-v2"],
  { revalidate: 3600 }
);

export async function getFreeQuizBank(board: FreeQuizBoardSlug): Promise<FreeQuizBankPayload> {
  return loadCachedFreeQuiz(board);
}

export async function getPublicFreeQuiz(board: FreeQuizBoardSlug): Promise<PublicFreeQuizPayload> {
  const bank = await getFreeQuizBank(board);
  return toPublicFreeQuizPayload(bank);
}

export function gradeFreeQuizAnswers(
  bank: FreeQuizBankPayload,
  rotationKey: string,
  answers: FreeQuizGradeAnswer[]
): { ok: true; payload: FreeQuizGradePayload } | { ok: false; error: string; status: number } {
  if (bank.rotationKey !== rotationKey) {
    return {
      ok: false,
      error: "This quiz set has expired. Refresh the page to load today's questions.",
      status: 400,
    };
  }

  const byId = new Map(bank.questions.map((question) => [question.id, question]));
  const seen = new Set<string>();
  const results: FreeQuizGradeResultItem[] = [];
  let score = 0;

  for (const entry of answers) {
    const id = entry.id?.trim() ?? "";
    if (!id || seen.has(id)) {
      return { ok: false, error: "Invalid answer payload.", status: 400 };
    }
    seen.add(id);
    const question = byId.get(id);
    if (!question) {
      return { ok: false, error: "Unknown question in this quiz set.", status: 400 };
    }

    const study = bankQuestionToStudy(question);
    const cleaned = (entry.selected ?? []).map((value) => value.trim()).filter(Boolean);
    const unique = [...new Set(cleaned)];
    const allowed = new Set(question.options);
    if (unique.some((value) => !allowed.has(value))) {
      return { ok: false, error: "That choice is not on this question.", status: 400 };
    }

    let selected: string[];
    let correct: boolean;
    if (unique.length === 0) {
      selected = [];
      correct = false;
    } else {
      const graded = gradeSelection(study, unique);
      if (!graded.ok) {
        return { ok: false, error: graded.error, status: 400 };
      }
      selected = graded.selected;
      correct = isAnswerCorrect(study, selected);
    }
    if (correct) score += 1;

    results.push({
      id: question.id,
      stem: question.stem,
      selection: question.selection,
      selected,
      correctAnswers: question.correct,
      correct,
    });
  }

  if (seen.size !== bank.questions.length) {
    return { ok: false, error: "Submit an answer entry for each question in the set.", status: 400 };
  }

  const order = bank.questions.map((question) => question.id);
  results.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

  return {
    ok: true,
    payload: {
      board: bank.board,
      rotationKey: bank.rotationKey,
      score,
      total: bank.questions.length,
      results,
    },
  };
}

/** Signup deep link for the marketing board slug. */
export function freeQuizSignupHref(board: FreeQuizBoardSlug): string {
  return `/signup?exam=${encodeURIComponent(board)}`;
}
