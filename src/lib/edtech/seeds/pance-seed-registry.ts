/**
 * Central registry for PANCE physician-educator seed batches.
 * Target: 200–300 manually reviewed seeds per content category over time.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { PANCE_PHYSICIAN_EDUCATOR_BATCH_01 } from "./pance-physician-educator-batch-01";
import { PANCE_PHYSICIAN_EDUCATOR_BATCH_02 } from "./pance-physician-educator-batch-02";
import { PANCE_PHYSICIAN_EDUCATOR_BATCH_03 } from "./pance-physician-educator-batch-03";
import { PANCE_PHYSICIAN_EDUCATOR_BATCH_04 } from "./pance-physician-educator-batch-04";
import { PANCE_PHYSICIAN_EDUCATOR_BATCH_05 } from "./pance-physician-educator-batch-05";
import { PANCE_PHYSICIAN_EDUCATOR_BATCH_06 } from "./pance-physician-educator-batch-06";
import { PANCE_PHYSICIAN_EDUCATOR_BATCH_07 } from "./pance-physician-educator-batch-07";
import { PANCE_PHYSICIAN_EDUCATOR_BATCH_08 } from "./pance-physician-educator-batch-08";
import { PANCE_SEED_TARGET_PER_CATEGORY } from "@/lib/exam-prep/pance/types";

export type PanceSeedBatch = {
  id: string;
  contentCategory: string;
  items: EnrichedBankItem[];
  reviewed: boolean;
};

export const PANCE_SEED_BATCHES: PanceSeedBatch[] = [
  {
    id: "physician-educator-batch-01",
    contentCategory: "mixed",
    items: PANCE_PHYSICIAN_EDUCATOR_BATCH_01,
    reviewed: true,
  },
  {
    id: "physician-educator-batch-02",
    contentCategory: "cardiovascular",
    items: PANCE_PHYSICIAN_EDUCATOR_BATCH_02,
    reviewed: true,
  },
  {
    id: "physician-educator-batch-03",
    contentCategory: "pulmonary",
    items: PANCE_PHYSICIAN_EDUCATOR_BATCH_03,
    reviewed: true,
  },
  {
    id: "physician-educator-batch-04",
    contentCategory: "gastrointestinal",
    items: PANCE_PHYSICIAN_EDUCATOR_BATCH_04,
    reviewed: true,
  },
  {
    id: "physician-educator-batch-05",
    contentCategory: "musculoskeletal-infectious",
    items: PANCE_PHYSICIAN_EDUCATOR_BATCH_05,
    reviewed: true,
  },
  {
    id: "physician-educator-batch-06",
    contentCategory: "neurologic-psychiatry",
    items: PANCE_PHYSICIAN_EDUCATOR_BATCH_06,
    reviewed: true,
  },
  {
    id: "physician-educator-batch-07",
    contentCategory: "reproductive-endocrine-hematologic",
    items: PANCE_PHYSICIAN_EDUCATOR_BATCH_07,
    reviewed: true,
  },
  {
    id: "physician-educator-batch-08",
    contentCategory: "renal-derm-gu-eent-professional",
    items: PANCE_PHYSICIAN_EDUCATOR_BATCH_08,
    reviewed: true,
  },
];

/** All curated PANCE seed items for bank sync and generation exemplars. */
export function collectPanceSeedItems(): EnrichedBankItem[] {
  return PANCE_SEED_BATCHES.flatMap((b) => b.items);
}

/** Starter bank size (physician-educator seeds shipped in repo). */
export function panceStarterSeedCount(): number {
  return collectPanceSeedItems().length;
}

/** Per-category seed counts vs 250 target. */
export function panceSeedProgressByCategory(): Record<
  string,
  { count: number; target: number; pct: number }
> {
  const counts: Record<string, number> = {};
  for (const batch of PANCE_SEED_BATCHES) {
    for (const item of batch.items) {
      const cat = item.subjectId ?? "unknown";
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
  }
  const out: Record<string, { count: number; target: number; pct: number }> = {};
  for (const [cat, count] of Object.entries(counts)) {
    out[cat] = {
      count,
      target: PANCE_SEED_TARGET_PER_CATEGORY,
      pct: Math.round((count / PANCE_SEED_TARGET_PER_CATEGORY) * 100),
    };
  }
  return out;
}

export {
  PANCE_PHYSICIAN_EDUCATOR_BATCH_01,
  PANCE_PHYSICIAN_EDUCATOR_BATCH_02,
  PANCE_PHYSICIAN_EDUCATOR_BATCH_03,
  PANCE_PHYSICIAN_EDUCATOR_BATCH_04,
  PANCE_PHYSICIAN_EDUCATOR_BATCH_05,
  PANCE_PHYSICIAN_EDUCATOR_BATCH_06,
  PANCE_PHYSICIAN_EDUCATOR_BATCH_07,
  PANCE_PHYSICIAN_EDUCATOR_BATCH_08,
};
