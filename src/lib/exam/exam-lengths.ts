import { getFieldMeta, getFieldMetaById } from "@/lib/fields";
import { normalizeFieldId } from "@/lib/subjects/field-ids";
import { computeTimeLimitSec } from "@/lib/full-exam/config";
import type { ExamSlug } from "@/lib/exams/catalog";

/** Board-style session types. */
export type ExamSessionMode = "timed" | "bank";

export type BoardExamKey = "nclex" | "usmle" | "naplex" | "pance" | "aanp-fnp" | "npte-pt";

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
  pance: "pance",
  "aanp-fnp": "aanp-fnp",
  "npte-pt": "npte-pt",
  mpje: "pance",
};

const SLUG_TO_BOARD: Record<ExamSlug, BoardExamKey | null> = {
  nclex: "nclex",
  usmle: "usmle",
  naplex: "naplex",
  pance: "pance",
  "aanp-fnp": "aanp-fnp",
  "npte-pt": "npte-pt",
  top500: null,
};

/** Fixed question counts for USMLE, NAPLEX, and PANCE timed simulations. */
const TIMED_EXAM_COUNTS: Record<Exclude<BoardExamKey, "nclex">, number> = {
  usmle: 280,
  naplex: 225,
  pance: 300,
  "aanp-fnp": 135,
  "npte-pt": 250,
};

const BOARD_LABELS: Record<BoardExamKey, string> = {
  nclex: "NCLEX",
  usmle: "USMLE",
  naplex: "NAPLEX",
  pance: "PANCE",
  "aanp-fnp": "AANP FNP",
  "npte-pt": "NPTE-PT",
};

export function parseNclexTimedVariant(value: string | null | undefined): NclexTimedVariant {
  return value === "maximum" ? "maximum" : "minimum";
}

export function resolveFieldId(fieldOrLabel: string): string {
  const meta = getFieldMeta(fieldOrLabel) ?? getFieldMetaById(fieldOrLabel);
  return normalizeFieldId(meta?.id ?? fieldOrLabel);
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

const SPRINT_EXAM_LIMITS = new Set([50, 100]);

/** Resolve a valid timed-exam limit for the board (ignores invalid client values). */
export function resolveTimedExamLimit(
  fieldOrLabel: string,
  requestedLimit?: number,
  nclexLength?: NclexTimedVariant
): number {
  const board = resolveBoardExam(fieldOrLabel);
  if (board === "nclex") {
    const allowed = new Set<number>([
      ...Object.values(NCLEX_TIMED_COUNTS),
      ...SPRINT_EXAM_LIMITS,
    ]);
    if (requestedLimit && allowed.has(requestedLimit)) {
      return requestedLimit;
    }
    return NCLEX_TIMED_COUNTS[nclexLength ?? "minimum"];
  }
  if (board) {
    const full = TIMED_EXAM_COUNTS[board];
    if (
      requestedLimit &&
      (SPRINT_EXAM_LIMITS.has(requestedLimit) || requestedLimit === full)
    ) {
      return requestedLimit;
    }
    return full;
  }
  if (requestedLimit && SPRINT_EXAM_LIMITS.has(requestedLimit)) {
    return requestedLimit;
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

const BOARD_TO_EXAM_SLUG: Record<BoardExamKey, import("@/types/edtech").ExamSlug> = {
  nclex: "nclex",
  usmle: "usmle",
  naplex: "naplex",
  pance: "pance",
  "aanp-fnp": "aanp-fnp",
  "npte-pt": "npte-pt",
};

/** Board-style timed session duration (scales official exam time to question count). */
export function computeTimedExamTimeLimitSec(
  fieldOrLabel: string,
  questionCount?: number,
  options?: { nclexLength?: NclexTimedVariant }
): number {
  const board = resolveBoardExam(fieldOrLabel);
  if (!board) return (questionCount ?? 50) * 90;
  const count = questionCount ?? getTimedExamQuestionCount(fieldOrLabel, options);
  return computeTimeLimitSec(BOARD_TO_EXAM_SLUG[board], count, true);
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
