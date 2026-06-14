import type { DrugEntry } from "../types";
import type { DrugEnrichment, EnrichedDrugView } from "./types";
import { enrichmentFromClass } from "./class-pearls";
import { DRUG_ENRICHMENT_OVERLAYS } from "./drug-overlays";

export type { DrugEnrichment, EnrichedDrugView } from "./types";

export const DRUG_GUIDELINE_NOTE =
  "Pearls align with current society guidelines (ADA, ACC/AHA, IDSA, APA, ACOG, FDA labeling) — the same sources referenced in UpToDate monographs.";

function mergeEnrichment(
  base: Partial<DrugEnrichment>,
  overlay: Partial<DrugEnrichment> | undefined
): DrugEnrichment {
  return {
    mechanism: overlay?.mechanism ?? base.mechanism,
    counseling: overlay?.counseling ?? base.counseling,
    monitoring: overlay?.monitoring ?? base.monitoring,
    contraindications: overlay?.contraindications ?? base.contraindications,
    pearls: [...(base.pearls ?? []), ...(overlay?.pearls ?? [])],
    guidelines: dedupeGuidelines([...(base.guidelines ?? []), ...(overlay?.guidelines ?? [])]),
  };
}

function dedupeGuidelines(
  refs: DrugEnrichment["guidelines"]
): DrugEnrichment["guidelines"] {
  const seen = new Set<string>();
  return refs.filter((r) => {
    if (seen.has(r.label)) return false;
    seen.add(r.label);
    return true;
  });
}

/** Attach guideline-aligned high-yield layer to a catalog drug row. */
export function enrichDrug(drug: DrugEntry): EnrichedDrugView {
  const fromClass = enrichmentFromClass(drug);
  const overlay = DRUG_ENRICHMENT_OVERLAYS[drug.id];
  const merged = mergeEnrichment(fromClass, overlay);

  return {
    ...merged,
    pearls: uniqueStrings(merged.pearls).slice(0, 6),
    guidelineNote: DRUG_GUIDELINE_NOTE,
  };
}

function uniqueStrings(items: string[]): string[] {
  const seen = new Set<string>();
  return items.filter((p) => {
    const key = p.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function hasDrugEnrichment(drug: DrugEntry): boolean {
  const e = enrichDrug(drug);
  return e.pearls.length > 0 || Boolean(e.mechanism);
}
