import { classifyDrug, DRUG_CLASSES, TOP_500_DRUGS, type DrugClassId } from "./catalog";
import type { DrugEntry } from "./types";

export { DRUGS_PAGE_DESCRIPTION, DRUGS_PAGE_TITLE } from "@/lib/seo/public-tool-metadata";

/** Fields safe to print in the public HTML. Card backs stay off this type. */
export type PublicDrugRow = {
  id: string;
  generic: string;
  brand: string;
  therapeuticClass: string;
};

function publicRow(drug: DrugEntry): PublicDrugRow {
  return {
    id: drug.id,
    generic: drug.generic.trim(),
    brand: drug.brand.trim(),
    therapeuticClass: drug.therapeuticClass.trim(),
  };
}

function byGeneric(a: PublicDrugRow, b: PublicDrugRow): number {
  return a.generic.localeCompare(b.generic, "en", { sensitivity: "base" });
}

/** Every catalog drug, A–Z by generic name. One row per id. */
export function publicDrugRows(): PublicDrugRow[] {
  return TOP_500_DRUGS.map(publicRow).sort(byGeneric);
}

export function drugIndexLetter(generic: string): string {
  const first = generic.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(first) ? first : "#";
}

export function publicDrugRowsByLetter(): { letter: string; drugs: PublicDrugRow[] }[] {
  const groups = new Map<string, PublicDrugRow[]>();
  for (const drug of publicDrugRows()) {
    const letter = drugIndexLetter(drug.generic);
    const list = groups.get(letter);
    if (list) list.push(drug);
    else groups.set(letter, [drug]);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, drugs]) => ({ letter, drugs }));
}

export function publicDrugRowsByClass(): {
  id: Exclude<DrugClassId, "all">;
  label: string;
  drugs: PublicDrugRow[];
}[] {
  const buckets = new Map<Exclude<DrugClassId, "all">, PublicDrugRow[]>();
  for (const drug of TOP_500_DRUGS) {
    const id = classifyDrug(drug.therapeuticClass);
    const list = buckets.get(id);
    const row = publicRow(drug);
    if (list) list.push(row);
    else buckets.set(id, [row]);
  }
  return DRUG_CLASSES.filter((cls) => cls.id !== "all").flatMap((cls) => {
    const drugs = buckets.get(cls.id);
    if (!drugs?.length) return [];
    drugs.sort(byGeneric);
    return [{ id: cls.id, label: cls.label, drugs }];
  });
}

/**
 * ItemList for the public name index. No ratings and no per-drug URLs:
 * a drug is not its own page. numberOfItems is the catalog length.
 */
export function drugCatalogItemListJsonLd(): Record<string, unknown> {
  const drugs = publicDrugRows();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top 500+ drug catalog",
    description: "Generic name, brand, and class for each drug in the Top 500+ flashcard deck.",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: drugs.length,
    itemListElement: drugs.map((drug, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${drug.generic} (${drug.brand})`,
      description: drug.therapeuticClass,
    })),
  };
}
