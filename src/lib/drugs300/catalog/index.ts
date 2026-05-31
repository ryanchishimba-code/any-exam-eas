import { mergeCatalog } from "./entry";
import { CLINCALC_1 } from "./clincalc-1";
import { CLINCALC_2 } from "./clincalc-2";
import { CLINCALC_3 } from "./clincalc-3";
import { classifyDrug, type DrugClassId } from "../drug-classes";

export type { DrugEntry, DrugEntryInput } from "../types";
export { slugDrugId, buildDrugEntry } from "../types";
export { DRUG_CLASSES, classifyDrug, drugMatchesClass, getDrugClassMeta, type DrugClassId } from "../drug-classes";

/** ClinCalc Top 300 — generic, brand, class, indications, side effects, mnemonic. */
export const TOP_300_DRUGS = mergeCatalog([CLINCALC_1, CLINCALC_2, CLINCALC_3]);

export const TOP_300_COUNT = TOP_300_DRUGS.length;

export function getDrugById(id: string) {
  return TOP_300_DRUGS.find((d) => d.id === id);
}

export function getDrugsByTherapeuticClass(therapeuticClass: string) {
  return TOP_300_DRUGS.filter((d) =>
    d.therapeuticClass.toLowerCase().includes(therapeuticClass.toLowerCase())
  );
}

export function getDrugsByDrugClass(classId: DrugClassId) {
  if (classId === "all") return TOP_300_DRUGS;
  return TOP_300_DRUGS.filter((d) => classifyDrug(d.therapeuticClass) === classId);
}

export const DRUG_CATEGORIES = [...new Set(TOP_300_DRUGS.map((d) => d.therapeuticClass))].sort();
