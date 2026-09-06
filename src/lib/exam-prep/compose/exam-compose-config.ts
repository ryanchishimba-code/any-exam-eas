/**
 * Per-exam configuration for the intelligent exam composer.
 *
 * Maps a public exam slug to the bank fieldId, the runtime serve gate used to
 * pull a server-ready pool, board-reference metadata, and timing. The composer
 * (compose-practice-exam.ts) is exam-agnostic and reads everything it needs
 * from here, so adding a board is a single config entry.
 */

import type { BankItem } from "@/lib/question-bank";
import type { TimedExamFilterFn } from "@/lib/questions/timed-exam-sampling";
import { nclexItemPassesBestExamGate } from "@/lib/exam-prep/nclex-serve-gate";
import { prepareNclexBankItem } from "@/lib/exam-prep/nclex-format-coherence";
import {
  naplexItemPassesTimedExamGate,
  prepareNaplexBankItem,
} from "@/lib/exam-prep/naplex-serve-gate";
import { nptePtItemPassesTimedExamGate } from "@/lib/exam-prep/npte-pt-serve-gate";
import { usmleBankItemIsServeReady } from "@/lib/exam-prep/usmle-clinical-gate";

export type ExamComposeConfig = {
  /** Public slug used in /api/exams/<slug>/compose. */
  slug: string;
  /** Bank fieldId + blueprint key (getExamBlueprint). */
  fieldId: string;
  /** Human-readable exam name for the composed header title. */
  examName: string;
  /** Cited published outline for the Selection Summary. */
  boardReference: string;
  /** Estimated minutes per item, from the real exam pace. */
  minutesPerItem: number;
  /** Runtime serve gate — only QA-passed, exam-ready items pass. */
  gate: TimedExamFilterFn;
  /** Optional per-item normalization applied to the gathered pool. */
  prepareItem?: (item: BankItem) => BankItem;
};

const usmleGate = (fieldId: string): TimedExamFilterFn => (item) =>
  usmleBankItemIsServeReady(item, fieldId);

const CONFIGS: Record<string, ExamComposeConfig> = {
  nclex: {
    slug: "nclex",
    fieldId: "nursing",
    examName: "NCLEX-RN",
    boardReference: "NCSBN NCLEX-RN Test Plan (2023) — Client Needs categories",
    minutesPerItem: 1.5,
    gate: nclexItemPassesBestExamGate,
    prepareItem: prepareNclexBankItem,
  },
  naplex: {
    slug: "naplex",
    fieldId: "pharmacy",
    examName: "NAPLEX",
    boardReference: "NABP NAPLEX Content Outline (effective May 1, 2025) — five content domains",
    minutesPerItem: 1.6,
    gate: naplexItemPassesTimedExamGate,
    prepareItem: prepareNaplexBankItem,
  },
  pance: {
    slug: "pance",
    fieldId: "pance",
    examName: "PANCE",
    boardReference: "NCCPA PANCE Content Blueprint (2026) — task areas + organ systems",
    minutesPerItem: 1.0,
    gate: usmleGate("pance"),
  },
  "aanp-fnp": {
    slug: "aanp-fnp",
    fieldId: "aanp-fnp",
    examName: "AANP FNP",
    boardReference: "AANPCB FNP Test Content Outline — patient age groups + domains",
    minutesPerItem: 1.2,
    gate: usmleGate("aanp-fnp"),
  },
  "npte-pt": {
    slug: "npte-pt",
    fieldId: "npte-pt",
    examName: "NPTE-PT",
    boardReference: "FSBPT NPTE Content Outline — systems + non-systems areas",
    minutesPerItem: 1.33,
    gate: nptePtItemPassesTimedExamGate,
  },
  "usmle-step-1": {
    slug: "usmle-step-1",
    fieldId: "usmle-step-1",
    examName: "USMLE Step 1",
    boardReference: "USMLE Content Outline — organ systems + physician tasks (shared Steps 1–3)",
    minutesPerItem: 1.5,
    gate: usmleGate("usmle-step-1"),
  },
  "usmle-step-2": {
    slug: "usmle-step-2",
    fieldId: "usmle-step-2",
    examName: "USMLE Step 2 CK",
    boardReference: "USMLE Content Outline — organ systems + physician tasks (shared Steps 1–3)",
    minutesPerItem: 1.5,
    gate: usmleGate("usmle-step-2"),
  },
  "usmle-step-3": {
    slug: "usmle-step-3",
    fieldId: "usmle-step-3",
    examName: "USMLE Step 3",
    boardReference: "USMLE Content Outline — organ systems + physician tasks (shared Steps 1–3)",
    minutesPerItem: 1.5,
    gate: usmleGate("usmle-step-3"),
  },
};

/** "usmle" defaults to Step 2 CK, the most representative single sitting. */
const SLUG_ALIASES: Record<string, string> = {
  usmle: "usmle-step-2",
  "usmle-step2": "usmle-step-2",
  "usmle-step1": "usmle-step-1",
  "usmle-step3": "usmle-step-3",
  pharmacy: "naplex",
  nursing: "nclex",
  "nclex-rn": "nclex",
  fnp: "aanp-fnp",
  npte: "npte-pt",
};

export function resolveExamComposeConfig(slug: string): ExamComposeConfig | undefined {
  const key = slug.trim().toLowerCase();
  return CONFIGS[key] ?? CONFIGS[SLUG_ALIASES[key] ?? ""];
}

/** Resolve compose config from a bank fieldId (e.g. nursing, usmle-step-2). */
export function resolveExamComposeConfigByFieldId(fieldId: string): ExamComposeConfig | undefined {
  const direct = Object.values(CONFIGS).find((c) => c.fieldId === fieldId);
  if (direct) return direct;
  return resolveExamComposeConfig(fieldId);
}

/** Per-field item normalization for timed/full-exam assembly (NCLEX + NAPLEX today). */
export function timedExamPrepareItemForField(
  fieldId: string
): ((item: BankItem) => BankItem) | undefined {
  return resolveExamComposeConfigByFieldId(fieldId)?.prepareItem;
}

export function listComposableExamSlugs(): string[] {
  return Object.keys(CONFIGS);
}
