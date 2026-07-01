import type { QaScanExamSlug } from "./types";

/** CLI exam slug → Prisma fieldId(s). */
export const EXAM_FIELD_MAP: Record<Exclude<QaScanExamSlug, "all">, string[]> = {
  naplex: ["pharmacy"],
  nclex: ["nursing"],
  usmle: ["usmle-step-1", "usmle-step-2", "usmle-step-3"],
  pance: ["pance"],
  "aanp-fnp": ["aanp-fnp"],
  "npte-pt": ["npte-pt"],
};

export function resolveFieldIds(exam: QaScanExamSlug): string[] {
  if (exam === "all") {
    return Object.values(EXAM_FIELD_MAP).flat();
  }
  return EXAM_FIELD_MAP[exam];
}

export function examLabel(fieldId: string): string {
  if (fieldId === "pharmacy") return "NAPLEX";
  if (fieldId === "nursing") return "NCLEX";
  if (fieldId.startsWith("usmle")) return "USMLE";
  if (fieldId === "pance") return "PANCE";
  if (fieldId === "aanp-fnp") return "AANP FNP";
  if (fieldId === "npte-pt") return "NPTE-PT";
  return fieldId;
}
