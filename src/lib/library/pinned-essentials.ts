import type { ExamSlug } from "@/types/edtech";

/** High-yield memory cards surfaced on the Library landing. */
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
    "pance-acs-reperfusion",
    "pance-sepsis-bundle",
  ],
  "aanp-fnp": [
    "fnp-hypertension-first-line",
    "fnp-diabetes-intensification",
    "fnp-depression-screening",
    "fnp-pediatric-immunization",
  ],
  "npte-pt": [
    "npte-rotator-cuff-testing",
    "npte-lumbar-red-flags",
    "npte-stroke-gait",
    "npte-copd-breathing",
  ],
};

export function getPinnedMemoryCardIds(examSlug: ExamSlug): string[] {
  return PINNED_MEMORY_CARD_IDS[examSlug] ?? [];
}
