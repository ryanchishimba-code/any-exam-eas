import { getFieldMeta, getFieldMetaById } from "@/lib/fields";
import { computeTimeLimitSec } from "@/lib/full-exam/config";
import type { ExamSlug } from "@/lib/exams/catalog";

/** Board-style session types. */
export type ExamSessionMode = "timed" | "bank";

export type BoardExamKey = "nclex" | "usmle" | "naplex" | "mpje";

/** NCLEX timed exam lengths — mirrors real CAT minimum and maximum. */
export const NCLEX_TIMED_COUNTS = {
  minimum: 85,
  maximum: 150,
} as const;

export type NclexTimedVariant = keyof typeof NCLEX_TIMED_COUNTS;

const FIELD_ID_TO_BOARD: Record<string, BoardExamKey> = {
  nursing: "nclex",
  "usmle-step-1": "usmle",
  "usmle-step-2": "usmle",
  pharmacy: "naplex",
  mpje: "mpje",
};

const SLUG_TO_BOARD: Record<ExamSlug, BoardExamKey | null> = {
  nclex: "nclex",
  usmle: "usmle",
  naplex: "naplex",
  mpje: "mpje",
  top500: null,
};

/** Fixed question counts for USMLE and NAPLEX timed simulations. */
const TIMED_EXAM_COUNTS: Record<Exclude<BoardExamKey, "nclex">, number> = {
  usmle: 280,
  naplex: 225,
  mpje: 120,
};

const BOARD_LABELS: Record<BoardExamKey, string> = {
  nclex: "NCLEX",
  usmle: "USMLE",
  naplex: "NAPLEX",
  mpje: "MPJE",
};

export function parseNclexTimedVariant(value: string | null | undefined): NclexTimedVariant {
  return value === "maximum" ? "maximum" : "minimum";
}

export function resolveFieldId(fieldOrLabel: string): string {
  const meta = getFieldMeta(fieldOrLabel) ?? getFieldMetaById(fieldOrLabel);
  return meta?.id ?? fieldOrLabel.toLowerCase();
}

export function resolveBoardExam(fieldOrLabel: string): BoardExamKey | null {
  const fieldId = resolveFieldId(fieldOrLabel);
  return FIELD_ID_TO_BOARD[fieldId] ?? null;
}

export function boardExamFromSlug(slug: string): BoardExamKey | null {
  if (!(slug in SLUG_TO_BOARD)) return null;
  return SLUG_TO_BOARD[slug as ExamSlug];
}

export function isNclexField(fieldOrLabel: string): boolean {
  return resolveBoardExam(fieldOrLabel) === "nclex";
}

export function getTimedExamQuestionCount(
  fieldOrLabel: string,
  options?: { nclexLength?: NclexTimedVariant }
): number {
  const board = resolveBoardExam(fieldOrLabel);
  if (!board) return 50;
  if (board === "nclex") {
    const variant = options?.nclexLength ?? "minimum";
    return NCLEX_TIMED_COUNTS[variant];
  }
  return TIMED_EXAM_COUNTS[board];
}

/** Resolve a valid timed-exam limit for the board (ignores invalid client values). */
export function resolveTimedExamLimit(
  fieldOrLabel: string,
  requestedLimit?: number,
  nclexLength?: NclexTimedVariant
): number {
  const board = resolveBoardExam(fieldOrLabel);
  if (board === "nclex") {
    const allowed = new Set<number>(Object.values(NCLEX_TIMED_COUNTS));
    if (requestedLimit && allowed.has(requestedLimit)) {
      return requestedLimit;
    }
    return NCLEX_TIMED_COUNTS[nclexLength ?? "minimum"];
  }
  if (board) {
    return TIMED_EXAM_COUNTS[board];
  }
  return 50;
}

/** @deprecated Use getTimedExamQuestionCount — kept for callers during migration. */
export function getExamQuestionCount(
  fieldOrLabel: string,
  mode: ExamSessionMode = "timed"
): number {
  if (mode === "bank") return 25;
  return getTimedExamQuestionCount(fieldOrLabel);
}

export function getExamQuestionCountBySlug(
  slug: string,
  nclexLength: NclexTimedVariant = "minimum"
): number {
  const board = boardExamFromSlug(slug);
  if (!board) return 40;
  if (board === "nclex") return NCLEX_TIMED_COUNTS[nclexLength];
  return TIMED_EXAM_COUNTS[board];
}

/** Board-style timed session duration (scales official exam time to question count). */
export function computeTimedExamTimeLimitSec(
  fieldOrLabel: string,
  questionCount?: number,
  options?: { nclexLength?: NclexTimedVariant }
): number {
  const board = resolveBoardExam(fieldOrLabel);
  if (!board) return (questionCount ?? 50) * 90;
  const count = questionCount ?? getTimedExamQuestionCount(fieldOrLabel, options);
  return computeTimeLimitSec(board, count, true);
}

export function formatExamLengthLabel(
  fieldOrLabel: string,
  options?: { nclexLength?: NclexTimedVariant }
): string {
  const board = resolveBoardExam(fieldOrLabel);
  const boardLabel = board ? BOARD_LABELS[board] : "Exam";
  if (board === "nclex") {
    const variant = options?.nclexLength ?? "minimum";
    const count = NCLEX_TIMED_COUNTS[variant];
    return variant === "minimum"
      ? `${count} questions (${boardLabel} minimum)`
      : `${count} questions (${boardLabel} maximum)`;
  }
  const count = getTimedExamQuestionCount(fieldOrLabel);
  return `${count} questions (${boardLabel})`;
}
