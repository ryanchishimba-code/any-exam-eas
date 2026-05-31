import { buildDrugEntry, type DrugEntry, type DrugEntryInput } from "../types";

/** Shorthand for catalog rows — rank + 6 pharmacology fields. */
export function d(
  rank: number,
  generic: string,
  brand: string,
  therapeuticClass: string,
  indications: string,
  sideEffects: string,
  mnemonic: string
): DrugEntry {
  return buildDrugEntry({
    rank,
    generic,
    brand,
    therapeuticClass,
    indications,
    sideEffects,
    mnemonic,
  });
}

export function mergeCatalog(parts: DrugEntry[][]): DrugEntry[] {
  const byId = new Map<string, DrugEntry>();
  for (const part of parts) {
    for (const drug of part) {
      if (!byId.has(drug.id)) byId.set(drug.id, drug);
    }
  }
  return [...byId.values()].sort((a, b) => a.rank - b.rank);
}
