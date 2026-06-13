import type { ExamSlug } from "@/types/edtech";

/** High-yield memory cards surfaced on the Reference hub landing. */
export const PINNED_MEMORY_CARD_IDS: Record<ExamSlug, string[]> = {
  nclex: [
    "nclex-sepsis-bundle",
    "nclex-five-rights",
    "nclex-shock-types",
    "nclex-delegation-decision-tree",
  ],
  usmle: [
    "usmle-stemi-path",
    "usmle-stroke-tpa",
    "usmle-hyperkalemia",
    "usmle-dka-orders",
  ],
  naplex: [
    "naplex-hf-four-pillars",
    "naplex-reversal-chart",
    "naplex-hypoglycemia-15-15",
    "all-creatinine-clearance",
  ],
  mpje: ["mpje-cii-rules", "mpje-schedules", "mpje-transfer-rules", "mpje-pseudoephedrine"],
};

export function getPinnedMemoryCardIds(examSlug: ExamSlug): string[] {
  return PINNED_MEMORY_CARD_IDS[examSlug] ?? [];
}
