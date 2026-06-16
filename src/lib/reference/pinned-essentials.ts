import type { ExamSlug } from "@/types/edtech";

/** High-yield memory cards surfaced on the Reference hub landing. */
export const PINNED_MEMORY_CARD_IDS: Record<ExamSlug, string[]> = {
  nclex: [
    "nclex-precaution-types",
    "nclex-sepsis-bundle",
    "nclex-cdiff-soap",
    "nclex-vanc-red-man",
  ],
  usmle: [
    "usmle-vanc-dosing",
    "usmle-mrsa-agents",
    "usmle-meningitis-emergency",
    "usmle-stemi-path",
  ],
  naplex: [
    "naplex-vanc-auc",
    "naplex-abx-spectrum-ladder",
    "naplex-mrsa-agents",
    "naplex-hf-four-pillars",
  ],
  pance: [
    "pance-hypertension-first-line",
    "pance-diabetes-a1c-targets",
    "pance-febrile-infant-workup",
    "pance-acs-reperfusion",
  ],
};

export function getPinnedMemoryCardIds(examSlug: ExamSlug): string[] {
  return PINNED_MEMORY_CARD_IDS[examSlug] ?? [];
}
