/**
 * Central registry for AANP FNP physician-educator seed batches.
 * Target: 200–300 manually reviewed seeds per blueprint domain over time.
 */
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import { AANP_FNP_PHYSICIAN_EDUCATOR_BATCH_ASSESS } from "./aanp-fnp-physician-educator-batch-assess";
import { AANP_FNP_PHYSICIAN_EDUCATOR_BATCH_DIAGNOSE } from "./aanp-fnp-physician-educator-batch-diagnose";
import { AANP_FNP_PHYSICIAN_EDUCATOR_BATCH_PLAN } from "./aanp-fnp-physician-educator-batch-plan";
import { AANP_FNP_PHYSICIAN_EDUCATOR_BATCH_EVALUATE } from "./aanp-fnp-physician-educator-batch-evaluate";
import { AANP_FNP_SEED_TARGET_PER_DOMAIN } from "@/lib/exam-prep/aanp-fnp/types";

export type AanpFnpSeedBatch = {
  id: string;
  blueprintDomain: string;
  items: EnrichedBankItem[];
  reviewed: boolean;
};

export const AANP_FNP_SEED_BATCHES: AanpFnpSeedBatch[] = [
  {
    id: "physician-educator-batch-assess",
    blueprintDomain: "assess",
    items: AANP_FNP_PHYSICIAN_EDUCATOR_BATCH_ASSESS,
    reviewed: true,
  },
  {
    id: "physician-educator-batch-diagnose",
    blueprintDomain: "diagnose",
    items: AANP_FNP_PHYSICIAN_EDUCATOR_BATCH_DIAGNOSE,
    reviewed: true,
  },
  {
    id: "physician-educator-batch-plan",
    blueprintDomain: "plan",
    items: AANP_FNP_PHYSICIAN_EDUCATOR_BATCH_PLAN,
    reviewed: true,
  },
  {
    id: "physician-educator-batch-evaluate",
    blueprintDomain: "evaluate",
    items: AANP_FNP_PHYSICIAN_EDUCATOR_BATCH_EVALUATE,
    reviewed: true,
  },
];

/** All curated AANP FNP seed items for bank sync and generation exemplars. */
export function collectAanpFnpSeedItems(): EnrichedBankItem[] {
  return AANP_FNP_SEED_BATCHES.flatMap((b) => b.items);
}

/** Per-domain seed counts vs 250 target. */
export function aanpFnpSeedProgressByDomain(): Record<
  string,
  { count: number; target: number; pct: number }
> {
  const counts: Record<string, number> = {};
  for (const batch of AANP_FNP_SEED_BATCHES) {
    counts[batch.blueprintDomain] =
      (counts[batch.blueprintDomain] ?? 0) + batch.items.length;
  }
  const out: Record<string, { count: number; target: number; pct: number }> = {};
  for (const [domain, count] of Object.entries(counts)) {
    out[domain] = {
      count,
      target: AANP_FNP_SEED_TARGET_PER_DOMAIN,
      pct: Math.round((count / AANP_FNP_SEED_TARGET_PER_DOMAIN) * 100),
    };
  }
  return out;
}

export {
  AANP_FNP_PHYSICIAN_EDUCATOR_BATCH_ASSESS,
  AANP_FNP_PHYSICIAN_EDUCATOR_BATCH_DIAGNOSE,
  AANP_FNP_PHYSICIAN_EDUCATOR_BATCH_PLAN,
  AANP_FNP_PHYSICIAN_EDUCATOR_BATCH_EVALUATE,
};
