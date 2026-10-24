import { unstable_cache } from "next/cache";
import { parseBankOptions } from "@/lib/mpje/parse-bank-options";
import { studentEligibleAndSql } from "@/lib/exam-prep/student-eligibility-sql";
import { sqlQuery } from "@/lib/db";
import type { BoardMarketingSlug } from "@/lib/landing/tokens";
import { MARKETING_BOARD_SLUGS } from "@/lib/marketing/board-paths";
import { readStoredCitations, type PublicSampleQuestion } from "@/lib/marketing/public-sample";

export const FREE_QUIZ_QUESTION_COUNT = 10;

export type FreeQuizBoardSlug = BoardMarketingSlug;

export function isFreeQuizBoardSlug(value: string): value is FreeQuizBoardSlug {
  return (MARKETING_BOARD_SLUGS as readonly string[]).includes(value);
}

type QuizRow = {
  id: string;
  fieldId: string;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  references: unknown;
};

export type PublicFreeQuizQuestion = Pick<
  PublicSampleQuestion,
  "id" | "stem" | "options" | "correct" | "rationale" | "sources"
>;

export type PublicFreeQuizPayload = {
  board: FreeQuizBoardSlug;
  /** UTC date bucket for the served set (rotates daily). */
  rotationKey: string;
  questions: PublicFreeQuizQuestion[];
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

function rowToQuizQuestion(row: QuizRow): PublicFreeQuizQuestion | null {
  const stem = row.question?.trim() ?? "";
  const rationale = row.explanation?.trim() ?? "";
  const sources = readStoredCitations(row.references);
  if (!stem || !rationale) return null;

  const parsed = parseBankOptions(row.options ?? "");
  const options = parsed.options.map((option) => option.trim()).filter(Boolean);
  if (options.length < 2 || options.length > 6) return null;
  if (new Set(options).size !== options.length) return null;

  const key = row.correctAnswer?.trim() ?? "";
  if (!key || key.includes("|||")) return null;
  const correct =
    options.find((option) => option === key) ??
    options.find((option) => option.toLowerCase() === key.toLowerCase());
  if (!correct) return null;

  return {
    id: row.id,
    stem,
    options,
    correct,
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
    SELECT id, "fieldId", question, options, "correctAnswer", explanation, "references"
    FROM "QuestionBankItem"
    WHERE active = true
      AND "qaPassed" = true
      AND "itemType" IN ('mcq', 'vignette')
      AND "fieldId" IN (${fieldList})
      AND length(btrim(question)) BETWEEN 40 AND 900
      AND length(btrim(explanation)) BETWEEN 80 AND 1600
      AND position('|||' IN "correctAnswer") = 0
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

async function loadFreeQuizPayload(board: FreeQuizBoardSlug): Promise<PublicFreeQuizPayload> {
  const rotationKey = freeQuizRotationKey();
  try {
    const rows = await queryFreeQuizRows(board, rotationKey);
    const questions = rows
      .map((row) => rowToQuizQuestion(row))
      .filter((item): item is PublicFreeQuizQuestion => item !== null);
    return { board, rotationKey, questions };
  } catch {
    return { board, rotationKey, questions: [] };
  }
}

const loadCachedFreeQuiz = unstable_cache(
  async (board: FreeQuizBoardSlug) => loadFreeQuizPayload(board),
  ["public-free-quiz-v1"],
  { revalidate: 3600 }
);

export async function getPublicFreeQuiz(board: FreeQuizBoardSlug): Promise<PublicFreeQuizPayload> {
  return loadCachedFreeQuiz(board);
}

/** Signup deep link for the marketing board slug. */
export function freeQuizSignupHref(board: FreeQuizBoardSlug): string {
  return `/signup?exam=${encodeURIComponent(board)}`;
}
