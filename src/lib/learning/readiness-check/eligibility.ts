/**
 * Which bank items a readiness check may use.
 *
 * Tighten this in one place: `readinessItemIsEligible`. Call sites must not
 * add a second, looser filter. `readinessEligibilityWhere` is only a database
 * prefilter for the same rule.
 *
 * Current pool: standard single-answer multiple choice that passes the existing
 * ingest QA gate (`bankItemPassesIngestGate`, the check that sets `qaPassed`)
 * and the shared student-eligibility rule (`assessStudentEligibility`). A row
 * that rule suppresses cannot be used in a readiness check.
 *
 * Excluded, and never used to fill a short area:
 * - SATA, NGN, K-type, true/false, and any other non-MCQ type
 * - a "select all" stem with a single keyed answer
 * - `qaPassed` not true, or a row the QA gate rejects now
 * - flagged for review (`reviewFlag`, or reviewStatus flagged / rejected)
 * - reviewStatus pending
 * - any stored Item QA code
 * - retired rows (`itemQa.retiredAt` / `retiredReason`, or a retire/quarantine status),
 *   including ones still marked active
 *
 * Area tags are not part of this rule. Levels that use them stay provisional.
 *
 * RN-reviewed only: set `requireApprovedReview` to true. Eligible items must
 * also have `reviewStatus === "approved"`.
 */
import type { Prisma } from "@prisma/client";
import { bankItemPassesIngestGate } from "@/lib/exam-prep/bank-ingest-gate";
import { readItemQaRecord } from "@/lib/exam-prep/item-qa/flag";
import { isPlainSingleAnswerReclass, PLAIN_MCQ_CANDIDATE_TYPES } from "@/lib/exam-prep/effective-type";
import {
  assessStudentEligibility,
  peekCompleteCaseGroups,
} from "@/lib/exam-prep/student-eligibility";
import { READINESS_THIN_AREA_LABEL } from "@/lib/learning/readiness-check/thresholds";
import type { BankItem } from "@/lib/question-bank";

export { READINESS_THIN_AREA_LABEL };

export const READINESS_ITEM_POLICY = {
  id: "standard_mcq_no_open_qa" as const,
  /** Flip to true to require editorial sign-off (reviewStatus "approved"). */
  requireApprovedReview: false,
};

export type ReadinessItemPolicy = {
  requireApprovedReview: boolean;
};

const STANDARD_MCQ_TYPES = new Set(["mcq", "multiple_choice", "vignette"]);

/** Formats the readiness check does not grade. Shared by the query and the function. */
export const READINESS_EXCLUDED_ITEM_TYPES = [
  "select_all",
  "sata",
  "bow_tie",
  "ngn_bowtie",
  "matrix",
  "ngn_matrix",
  "highlight",
  "ngn_highlight",
  "ordered_response",
  "drag_drop",
  "unfolding_case",
  "case_study",
  "k_type",
  "true_false",
] as const;

const EXCLUDED_ITEM_TYPES = new Set<string>(READINESS_EXCLUDED_ITEM_TYPES);

const SELECT_ALL_STEM = /select all that apply|\bselect all\b|\bSATA\b/i;

export type ReadinessEligibilityRow = {
  id?: string;
  fieldId?: string;
  active?: boolean | null;
  qaPassed?: boolean | null;
  itemType?: string | null;
  question?: string;
  scenario?: string | null;
  vignette?: string | null;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  ngnPayload?: Record<string, unknown> | null;
  reviewFlag?: boolean | null;
  reviewStatus?: string | null;
  curationMeta?: unknown;
  generationMeta?: unknown;
  qualityScore?: number | null;
  keepRecommendation?: boolean | null;
  source?: string | null;
  tags?: string[];
};

function itemQaRecord(row: ReadinessEligibilityRow) {
  return readItemQaRecord(row.curationMeta) ?? readItemQaRecord(row.generationMeta);
}

function itemQaCodes(row: ReadinessEligibilityRow): string[] {
  return itemQaRecord(row)?.codes ?? [];
}

function stemBlob(row: ReadinessEligibilityRow): string {
  return `${row.scenario ?? ""}\n${row.vignette ?? ""}\n${row.question ?? ""}`;
}

function answerParts(correctAnswer: string | null | undefined): string[] {
  const trimmed = correctAnswer?.trim() ?? "";
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((part) => String(part).trim()).filter(Boolean);
      }
    } catch {
      /* A single answer can contain a bracket. Treat it as one key. */
    }
  }
  if (trimmed.includes("|||")) {
    return trimmed
      .split("|||")
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return [trimmed];
}

function ngnKind(row: ReadinessEligibilityRow): string {
  const kind = row.ngnPayload?.kind;
  return typeof kind === "string" ? kind.trim().toLowerCase() : "";
}

function normalizedType(row: ReadinessEligibilityRow): string {
  return (row.itemType ?? "mcq").trim().toLowerCase();
}

/** Select-all wording with one stored key. These are broken SATA rows, not MCQs. */
export function isSelectAllStemWithOneKey(row: ReadinessEligibilityRow): boolean {
  if (!SELECT_ALL_STEM.test(stemBlob(row))) return false;
  return answerParts(row.correctAnswer).length <= 1;
}

export function isStandardSingleAnswerMcq(row: ReadinessEligibilityRow): boolean {
  if (
    isPlainSingleAnswerReclass({
      itemType: row.itemType,
      question: row.question,
      scenario: row.scenario ?? row.vignette,
      correctAnswer: row.correctAnswer,
      options: row.options,
      ngnPayload: row.ngnPayload,
      curationMeta: row.curationMeta,
    })
  ) {
    return true;
  }
  const type = normalizedType(row);
  const kind = ngnKind(row);
  if (EXCLUDED_ITEM_TYPES.has(type) || (kind && EXCLUDED_ITEM_TYPES.has(kind))) return false;
  if (!STANDARD_MCQ_TYPES.has(type)) return false;
  if (SELECT_ALL_STEM.test(stemBlob(row))) return false;

  const options = (row.options ?? []).map((option) => option.trim()).filter(Boolean);
  const parts = answerParts(row.correctAnswer);
  if (parts.length !== 1 || options.length < 2) return false;
  const key = parts[0]!.toLowerCase();
  if (options.some((option) => option.toLowerCase() === key)) return true;
  return /^[A-F]$/i.test(parts[0]!);
}

/** True when a person still needs to clear this row, or it was retired. */
export function readinessItemHasOpenQaFlag(row: ReadinessEligibilityRow): boolean {
  if (row.reviewFlag === true) return true;
  const status = (row.reviewStatus ?? "").trim().toLowerCase();
  if (status === "flagged" || status === "rejected" || status === "pending") return true;
  if (status.includes("retire") || status.includes("quarantine")) return true;
  if (itemQaCodes(row).length > 0) return true;
  const record = itemQaRecord(row);
  if (record?.retiredAt || record?.retiredReason) return true;
  return false;
}

function passesStudentEligibility(row: ReadinessEligibilityRow): boolean {
  const complete = peekCompleteCaseGroups();
  return assessStudentEligibility(
    {
      id: row.id,
      fieldId: row.fieldId,
      active: row.active,
      qaPassed: row.qaPassed,
      itemType: row.itemType,
      question: row.question,
      scenario: row.scenario ?? row.vignette,
      correctAnswer: row.correctAnswer,
      explanation: row.explanation,
      options: row.options,
      ngnPayload: row.ngnPayload,
      curationMeta: row.curationMeta,
    },
    complete ? { completeCaseGroups: complete } : {}
  ).eligible;
}

function passesExistingQaGate(row: ReadinessEligibilityRow): boolean {
  if (row.qaPassed !== true) return false;
  if (row.active === false) return false;
  if (!row.fieldId || !row.question || !row.correctAnswer) return false;
  try {
    return bankItemPassesIngestGate(row.fieldId, row as BankItem, row.source);
  } catch {
    return false;
  }
}

/**
 * The only eligibility decision for a readiness item.
 * A short area stays short. Do not call a looser sampler to fill it.
 */
export function readinessItemIsEligible(
  row: ReadinessEligibilityRow,
  policy: ReadinessItemPolicy = READINESS_ITEM_POLICY
): boolean {
  if (!isStandardSingleAnswerMcq(row)) return false;
  if (isSelectAllStemWithOneKey(row)) return false;
  if (readinessItemHasOpenQaFlag(row)) return false;
  if (policy.requireApprovedReview && row.reviewStatus !== "approved") return false;
  if (!passesExistingQaGate(row)) return false;
  if (!passesStudentEligibility(row)) return false;
  return true;
}

/**
 * Coarse database prefilter. The function above is the real rule.
 *
 * Nullable columns must keep NULL. In SQL, `NOT (review_flag = true)` and
 * `NOT (review_status IN (...))` are unknown when the column is null, so those
 * rows disappear. Almost every published item has a null review flag, meaning
 * "not flagged". Treating null as flagged left one NCLEX area with a few
 * hundred rows and every other area empty, so a check could not reach 8 items.
 */
export function readinessEligibilityWhere(
  policy: ReadinessItemPolicy = READINESS_ITEM_POLICY
): Prisma.QuestionBankItemWhereInput {
  const and: Prisma.QuestionBankItemWhereInput[] = [
    { active: true },
    { qaPassed: true },
    { OR: [{ reviewFlag: null }, { reviewFlag: false }] },
    {
      OR: [
        { reviewStatus: null },
        {
          AND: [
            { NOT: { reviewStatus: { in: ["flagged", "rejected", "pending"] } } },
            { NOT: { reviewStatus: { contains: "retire", mode: "insensitive" } } },
            { NOT: { reviewStatus: { contains: "quarantine", mode: "insensitive" } } },
          ],
        },
      ],
    },
    {
      OR: [
        { NOT: { itemType: { in: [...READINESS_EXCLUDED_ITEM_TYPES] } } },
        { itemType: { in: [...PLAIN_MCQ_CANDIDATE_TYPES] } },
      ],
    },
  ];
  if (policy.requireApprovedReview) and.push({ reviewStatus: "approved" });
  return { AND: and };
}

function qualityRank(row: ReadinessEligibilityRow): number {
  const score = typeof row.qualityScore === "number" && Number.isFinite(row.qualityScore) ? row.qualityScore : 0;
  const keep =
    row.keepRecommendation === true ? 0.01 : row.keepRecommendation === false ? -0.01 : 0;
  return score + keep;
}

/**
 * Keep the stronger eligible items, then shuffle that band so a retake is not
 * the same sequence. Never reaches past the eligible list to fill `need`.
 */
export function selectReadinessItems<T extends ReadinessEligibilityRow>(
  items: T[],
  need: number,
  policy: ReadinessItemPolicy = READINESS_ITEM_POLICY,
  random: () => number = Math.random
): T[] {
  if (need <= 0) return [];
  const eligible = items.filter((item) => readinessItemIsEligible(item, policy));
  const ranked = [...eligible].sort((a, b) => qualityRank(b) - qualityRank(a));
  const bandSize = Math.min(ranked.length, Math.max(need, Math.min(ranked.length, need * 3)));
  const band = ranked.slice(0, bandSize);
  for (let i = band.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const current = band[i]!;
    band[i] = band[j]!;
    band[j] = current;
  }
  return band.slice(0, need);
}
