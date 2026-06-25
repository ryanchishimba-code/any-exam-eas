import type { FdaDrugReference, FdaDrugReferenceDocument } from "./schema";
import { TOP_500_DRUGS } from "./catalog";

const CURATED_IDS = new Set(TOP_500_DRUGS.map((drug) => drug.id));

let cachedCatalog: FdaDrugReference[] | null = null;
let loadPromise: Promise<FdaDrugReference[]> | null = null;

export type FdaDrugSearchIndex = {
  drugs: FdaDrugReference[];
  byId: Map<string, FdaDrugReference>;
};

export async function loadFdaReferenceCatalog(): Promise<FdaDrugReference[]> {
  if (cachedCatalog) return cachedCatalog;
  if (!loadPromise) {
    loadPromise = fetch("/data/fda-approved-drugs.json")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to load FDA reference catalog (${res.status})`);
        }
        const doc = (await res.json()) as FdaDrugReferenceDocument;
        cachedCatalog = doc.drugs;
        return cachedCatalog;
      })
      .catch((error) => {
        loadPromise = null;
        throw error;
      });
  }
  return loadPromise;
}

export function buildFdaDrugSearchIndex(drugs: FdaDrugReference[]): FdaDrugSearchIndex {
  const byId = new Map<string, FdaDrugReference>();
  for (const drug of drugs) {
    if (CURATED_IDS.has(drug.id)) continue;
    byId.set(drug.id, drug);
  }
  return {
    drugs: [...byId.values()],
    byId,
  };
}

export async function loadFdaDrugSearchIndex(): Promise<FdaDrugSearchIndex> {
  const drugs = await loadFdaReferenceCatalog();
  return buildFdaDrugSearchIndex(drugs);
}

export function getFdaDrugReferenceById(
  id: string,
  index: FdaDrugSearchIndex
): FdaDrugReference | null {
  return index.byId.get(id) ?? null;
}

export function isCuratedDrugId(id: string): boolean {
  return CURATED_IDS.has(id);
}
