import { unstable_cache } from "next/cache";
import { parseBankOptions } from "@/lib/mpje/parse-bank-options";
import { parseSelectAllCorrectAnswers, selectAllAnswersMatchOptions } from "@/lib/question-format";
import { studentEligibleAndSql } from "@/lib/exam-prep/student-eligibility-sql";
import {
  resolveExhibitTable,
  type ExhibitTablePayload,
} from "@/lib/exam-prep/exhibit-normalize";
import { splitUsmleBankItem } from "@/lib/exam-prep/usmle-bank-split";
import { sqlQuery } from "@/lib/db";
import type { BoardMarketingSlug } from "@/lib/landing/tokens";
import { MARKETING_BOARD_SLUGS } from "@/lib/marketing/board-paths";
import { readStoredCitations } from "@/lib/marketing/public-sample";
import { gradeSelection } from "@/lib/learning/readiness-check/present";
import { isAnswerCorrect } from "@/lib/questions/prepare";
import type { StudyQuestion } from "@/lib/questions/types";
import type { BankItem } from "@/lib/question-bank";

export const FREE_QUIZ_QUESTION_COUNT = 10;

/** How many bank rows to pull before filtering to ten unique, text-only items. */
export const FREE_QUIZ_CANDIDATE_PULL = 250;

const MIN_PUBLIC_STEM_CHARS = 40;
const MAX_PUBLIC_STEM_CHARS = 2000;

const VISUAL_DEPENDENCY_PATTERNS: RegExp[] = [
  /!\[[^\]]*\]\([^)]+\)/,
  /<img\b/i,
  /\bsee (the )?exhibit\b/i,
  /\brefer to (the )?(figure|image|diagram|chart|illustration|radiograph|x-?ray)\b/i,
  /\bshown in (the )?(figure|image|diagram|exhibit|radiograph)\b/i,
  /\bas (shown|depicted|illustrated) (in|below)\b/i,
  /\b(image|figure|diagram|exhibit) (above|below)\b/i,
];

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

export type FreeQuizCandidateRow = {
  id: string;
  fieldId: string;
  itemType: string;
  scenario: string | null;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  references: unknown;
};

type QuizRow = FreeQuizCandidateRow;

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

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function ngnPayloadFromRow(row: QuizRow): Record<string, unknown> | undefined {
  const parsed = parseBankOptions(row.options ?? "");
  return parsed.ngnPayload ? (parsed.ngnPayload as Record<string, unknown>) : undefined;
}

function freeQuizRowRequiresImage(row: QuizRow): boolean {
  const ngn = ngnPayloadFromRow(row);
  if (ngn) {
    const media = ngn.media;
    if (Array.isArray(media) && media.length > 0) return true;
    if (ngn.figure || ngn.imageUrl || ngn.svg || ngn.stemMedia) return true;
    const exhibit = asRecord(ngn.exhibit);
    if (exhibit?.svg || exhibit?.imageUrl || exhibit?.figureId) return true;
  }
  const text = [row.scenario, row.question].filter(Boolean).join("\n");
  return VISUAL_DEPENDENCY_PATTERNS.some((pattern) => pattern.test(text));
}

function formatExhibitTablePlainText(table: ExhibitTablePayload): string {
  const lines: string[] = [];
  if (table.title?.trim()) lines.push(table.title.trim());
  lines.push(table.headers.join(" | "));
  for (const row of table.rows) {
    lines.push(row.join(" | "));
  }
  return lines.join("\n");
}

/** Full patient context + lead-in (+ plain-text lab table when stored in options JSON). */
export function composeFreeQuizStem(row: Pick<QuizRow, "scenario" | "question" | "options">): string {
  const bankItem: BankItem = {
    id: "compose",
    subjectId: "marketing",
    scenario: row.scenario?.trim() || undefined,
    vignette: row.scenario?.trim() || undefined,
    question: row.question?.trim() ?? "",
    options: [],
    correctAnswer: "",
    explanation: "",
  };
  const { vignette, stem: leadIn } = splitUsmleBankItem(bankItem);
  const parts: string[] = [];
  if (vignette?.trim()) parts.push(vignette.trim());

  const ngn = ngnPayloadFromRow(row as QuizRow);
  const table = resolveExhibitTable(ngn);
  if (table && !freeQuizRowRequiresImage(row as QuizRow)) {
    parts.push(formatExhibitTablePlainText(table));
  }

  if (leadIn?.trim()) {
    const normalizedLeadIn = leadIn.trim();
    if (!vignette || !vignette.includes(normalizedLeadIn)) {
      parts.push(normalizedLeadIn);
    }
  }

  return parts.join("\n\n").trim();
}

export function pickFreeQuizQuestionsFromRows(rows: QuizRow[]): FreeQuizBankQuestion[] {
  const seen = new Set<string>();
  const questions: FreeQuizBankQuestion[] = [];
  for (const row of rows) {
    if (seen.has(row.id)) continue;
    const question = rowToQuizQuestion(row);
    if (!question) continue;
    seen.add(row.id);
    questions.push(question);
    if (questions.length >= FREE_QUIZ_QUESTION_COUNT) break;
  }
  return questions;
}

function rowToQuizQuestion(row: QuizRow): FreeQuizBankQuestion | null {
  if (freeQuizRowRequiresImage(row)) return null;

  const stem = composeFreeQuizStem(row);
  const rationale = row.explanation?.trim() ?? "";
  const sources = readStoredCitations(row.references);
  if (!stem || stem.length < MIN_PUBLIC_STEM_CHARS || stem.length > MAX_PUBLIC_STEM_CHARS) return null;
  if (!rationale) return null;

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

async function queryFreeQuizRows(
  board: FreeQuizBoardSlug,
  rotationKey: string,
  opts?: { excludeIds?: readonly string[]; seedSuffix?: string; limit?: number }
): Promise<QuizRow[]> {
  const fieldIds = BOARD_FIELD_IDS[board];
  const fieldList = fieldIds.map((id) => `'${id}'`).join(", ");
  const seed = `${rotationKey}${opts?.seedSuffix ?? ""}`.replace(/'/g, "");
  const limit = opts?.limit ?? FREE_QUIZ_CANDIDATE_PULL;
  const excludeIds = opts?.excludeIds ?? [];
  const excludeSql =
    excludeIds.length > 0
      ? `AND id NOT IN (${excludeIds.map((id) => `'${id.replace(/'/g, "")}'`).join(", ")})`
      : "";
  return sqlQuery<QuizRow[]>(
    `
    SELECT id, "fieldId", "itemType", scenario, question, options, "correctAnswer", explanation, "references"
    FROM "QuestionBankItem"
    WHERE active = true
      AND "qaPassed" = true
      AND "itemType" IN ('mcq', 'vignette', 'select_all')
      AND "fieldId" IN (${fieldList})
      AND length(btrim(question)) >= 12
      AND length(
        btrim(
          COALESCE(scenario, '') || CASE WHEN scenario IS NOT NULL AND btrim(scenario) <> '' THEN E'\\n\\n' ELSE '' END || question
        )
      ) BETWEEN ${MIN_PUBLIC_STEM_CHARS} AND ${MAX_PUBLIC_STEM_CHARS}
      AND length(btrim(explanation)) BETWEEN 80 AND 1600
      AND (
        position('|||' IN "correctAnswer") = 0
        OR "itemType" = 'select_all'
      )
      AND "references" IS NOT NULL
      AND jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      ${excludeSql}
      ${usmleStepScopeSql()}
      ${studentEligibleAndSql()}
    ORDER BY md5(id || '${seed}')
    LIMIT ${limit}
    `,
    []
  );
}

async function loadFreeQuizPayload(board: FreeQuizBoardSlug): Promise<FreeQuizBankPayload> {
  const rotationKey = freeQuizRotationKey();
  try {
    let rows = await queryFreeQuizRows(board, rotationKey);
    let questions = pickFreeQuizQuestionsFromRows(rows);
    if (questions.length < FREE_QUIZ_QUESTION_COUNT) {
      const seenIds = new Set(questions.map((question) => question.id));
      const extra = await queryFreeQuizRows(board, rotationKey, {
        excludeIds: [...seenIds],
        seedSuffix: "-fill",
        limit: FREE_QUIZ_CANDIDATE_PULL,
      });
      rows = [...rows, ...extra];
      questions = pickFreeQuizQuestionsFromRows(rows);
    }
    return { board, rotationKey, questions };
  } catch {
    return { board, rotationKey, questions: [] };
  }
}

const loadCachedFreeQuiz = unstable_cache(
  async (board: FreeQuizBoardSlug) => loadFreeQuizPayload(board),
  ["public-free-quiz-v3"],
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
    const cleaned = (entry.selected ?? [])
      .map((value) => {
        if (typeof value === "string") return value.trim();
        if (typeof value === "number" && Number.isFinite(value)) return String(value);
        return "";
      })
      .filter(Boolean);
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
