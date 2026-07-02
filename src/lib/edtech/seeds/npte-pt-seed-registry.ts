/**
 * Central registry for NPTE-PT physician-educator seed batches.
 * Target: 200 curated seeds per content category over time.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_01 } from "./npte-pt-physician-educator-batch-01";
import { NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_02 } from "./npte-pt-physician-educator-batch-02";
import { NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_03 } from "./npte-pt-physician-educator-batch-03";
import { NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_04 } from "./npte-pt-physician-educator-batch-04";
import { NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_05 } from "./npte-pt-physician-educator-batch-05";
import { NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_06 } from "./npte-pt-physician-educator-batch-06";
import { NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_07 } from "./npte-pt-physician-educator-batch-07";
import { NPTE_PT_SEED_TARGET_PER_CATEGORY } from "@/lib/exam-prep/npte-pt/types";

export type NptePtSeedBatch = {
  id: string;
  contentCategory: string;
  items: EnrichedBankItem[];
  reviewed: boolean;
};

export const NPTE_PT_SEED_BATCHES: NptePtSeedBatch[] = [
  {
    id: "physician-educator-batch-01",
    contentCategory: "musculoskeletal",
    items: NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_01,
    reviewed: true,
  },
  {
    id: "physician-educator-batch-02",
    contentCategory: "neuromuscular-nervous",
    items: NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_02,
    reviewed: true,
  },
  {
    id: "physician-educator-batch-03",
    contentCategory: "cardiovascular-pulmonary",
    items: NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_03,
    reviewed: true,
  },
  {
    id: "physician-educator-batch-04",
    contentCategory: "mixed-non-systems",
    items: NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_04,
    reviewed: true,
  },
  {
    id: "physician-educator-batch-05",
    contentCategory: "musculoskeletal",
    items: NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_05,
    reviewed: true,
  },
  {
    id: "physician-educator-batch-06",
    contentCategory: "neuromuscular-nervous",
    items: NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_06,
    reviewed: true,
  },
  {
    id: "physician-educator-batch-07",
    contentCategory: "system-interactions",
    items: NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_07,
    reviewed: true,
  },
];

/** All curated NPTE-PT seed items for bank sync and generation exemplars. */
export function collectNptePtSeedItems(): EnrichedBankItem[] {
  return NPTE_PT_SEED_BATCHES.flatMap((b) => b.items);
}

/** Starter bank size (physician-educator seeds shipped in repo). */
export function nptePtStarterSeedCount(): number {
  return collectNptePtSeedItems().length;
}

/** Per-category seed counts vs 200 target. */
export function nptePtSeedProgressByCategory(): Record<
  string,
  { count: number; target: number; pct: number }
> {
  const counts: Record<string, number> = {};
  for (const batch of NPTE_PT_SEED_BATCHES) {
    for (const item of batch.items) {
      const cat = item.subjectId ?? "unknown";
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
  }
  const out: Record<string, { count: number; target: number; pct: number }> = {};
  for (const [cat, count] of Object.entries(counts)) {
    out[cat] = {
      count,
      target: NPTE_PT_SEED_TARGET_PER_CATEGORY,
      pct: Math.round((count / NPTE_PT_SEED_TARGET_PER_CATEGORY) * 100),
    };
  }
  return out;
}

export {
  NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_01,
  NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_02,
  NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_03,
  NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_04,
  NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_05,
  NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_06,
  NPTE_PT_PHYSICIAN_EDUCATOR_BATCH_07,
};
