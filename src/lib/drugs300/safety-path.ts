/**
 * Board-generic drug safety path.
 *
 * Today's drugs row and pharmacological misses share one fixed list per board.
 * NCLEX ships the nursing high-alert five first. Other boards use the same
 * shape: an editorial list when one exists, otherwise the shared high-alert
 * five. Nothing here rewrites the question bank or the Top 500 catalog.
 */

import { drugs300DrugHref } from "@/lib/edtech/practice-links-core";
import { isExamSlug } from "@/lib/edtech/exams";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";
import { getDrugById } from "./catalog";

export const DRUG_SAFETY_PATH_ID = "safety";

/**
 * Shared high-alert set. Boards without an editorial list use this so the
 * path is never a random slice of the deck.
 */
export const SHARED_SAFETY_DRUG_IDS = [
  "warfarin",
  "insulin-glargine",
  "heparin-unfractionated",
  "digoxin",
  "morphine",
] as const;

/**
 * Editorial lists. Add a board here without forking the study loop.
 * Ids must exist on the Top 500 catalog; missing ids are dropped.
 */
const BOARD_SAFETY_DRUG_IDS: Partial<Record<ExamSlug, readonly string[]>> = {
  nclex: SHARED_SAFETY_DRUG_IDS,
  naplex: [
    "warfarin",
    "insulin-glargine",
    "vancomycin",
    "digoxin",
    "enoxaparin",
  ],
};

export type SafetyPathDrug = {
  id: string;
  generic: string;
};

function boardList(examSlug: string): readonly string[] {
  if (!isExamSlug(examSlug)) return SHARED_SAFETY_DRUG_IDS;
  return BOARD_SAFETY_DRUG_IDS[examSlug] ?? SHARED_SAFETY_DRUG_IDS;
}

/** Catalog ids for this board's safety path, in study order. */
export function safetyPathDrugIds(examSlug: string): string[] {
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const id of boardList(examSlug)) {
    if (seen.has(id) || !getDrugById(id)) continue;
    seen.add(id);
    ids.push(id);
  }
  if (ids.length > 0) return ids;
  return SHARED_SAFETY_DRUG_IDS.filter((id) => getDrugById(id));
}

export function safetyPathDrugs(examSlug: string): SafetyPathDrug[] {
  return safetyPathDrugIds(examSlug).flatMap((id) => {
    const drug = getDrugById(id);
    return drug ? [{ id, generic: drug.generic }] : [];
  });
}

export function isSafetyPathDrug(examSlug: string, drugId: string): boolean {
  return safetyPathDrugIds(examSlug).includes(drugId);
}

/** Short label for the path list: "Warfarin, Insulin, Heparin, Digoxin, and Morphine". */
export function safetyPathLabel(examSlug: string): string {
  const names = safetyPathDrugs(examSlug).map((drug) => shortSafetyName(drug.generic));
  if (names.length === 0) return "High-alert drugs";
  if (names.length === 1) return names[0] ?? "High-alert drugs";
  const lead = names.slice(0, -1).join(", ");
  return `${lead}, and ${names[names.length - 1]}`;
}

function shortSafetyName(generic: string): string {
  if (/insulin/i.test(generic)) return "Insulin";
  if (/heparin/i.test(generic)) return "Heparin";
  return generic.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

export function drugSafetyPathHref(examSlug: string, drugId?: string): string {
  const exam = isExamSlug(examSlug) ? examSlug : "nclex";
  const qs = new URLSearchParams({
    path: DRUG_SAFETY_PATH_ID,
    exam,
  });
  if (drugId) qs.set("drug", drugId);
  return `${ROUTES.drugs300}?${qs.toString()}`;
}

/** Safety-path drugs open inside the path. Every other catalog drug stays a single card. */
export function drugStudyHref(examSlug: string, drugId: string): string {
  if (isSafetyPathDrug(examSlug, drugId)) return drugSafetyPathHref(examSlug, drugId);
  return drugs300DrugHref(drugId);
}

export function utcDayStart(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/** True when every safety-path drug was reviewed on this UTC day. */
export function safetyPathComplete(reviewedIds: Iterable<string>, examSlug: string): boolean {
  const required = safetyPathDrugIds(examSlug);
  if (required.length === 0) return false;
  const reviewed = new Set(reviewedIds);
  return required.every((id) => reviewed.has(id));
}
