/**
 * Pharmacy seed lookup by vignette. Kept off the serve-gate graph: the
 * mismatch check in naplex-stem-coherence does not need the seed catalog.
 */
import type { BankItem } from "@/lib/question-bank";
import type { EnrichedBankItem } from "./seed-helpers";
import { collectHighYieldSeedRows } from "./high-yield-index";
import { resolveNaplexVignette } from "./naplex-stem";

function normVignette(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

let pharmacySeedByVignette: Map<string, EnrichedBankItem> | null = null;

export function buildPharmacySeedIndexByVignette(): Map<string, EnrichedBankItem> {
  if (pharmacySeedByVignette) return pharmacySeedByVignette;

  const map = new Map<string, EnrichedBankItem>();
  for (const row of collectHighYieldSeedRows()) {
    if (row.fieldId !== "pharmacy") continue;
    const vignette = row.item.vignette?.trim() ?? row.item.scenario?.trim() ?? "";
    if (!vignette) continue;
    map.set(normVignette(vignette), row.item);
  }
  pharmacySeedByVignette = map;
  return map;
}

/** Reset cached seed index (tests). */
export function resetPharmacySeedIndexForTests(): void {
  pharmacySeedByVignette = null;
}

/** Look up canonical hand-authored seed content by vignette text. */
export function findPharmacySeedByVignette(item: BankItem): EnrichedBankItem | null {
  const vignette = resolveNaplexVignette(item);
  if (!vignette) return null;
  return buildPharmacySeedIndexByVignette().get(normVignette(vignette)) ?? null;
}
