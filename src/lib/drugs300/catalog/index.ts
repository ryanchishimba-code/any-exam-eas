import { mergeCatalog } from "./entry";
import { CLINCALC_1 } from "./clincalc-1";
import { CLINCALC_2 } from "./clincalc-2";
import { CLINCALC_3 } from "./clincalc-3";
import { CLINCALC_4 } from "./clincalc-4";
import { CLINCALC_5 } from "./clincalc-5";
import { classifyDrug, type DrugClassId } from "../drug-classes";

export type { DrugEntry, DrugEntryInput } from "../types";
export { slugDrugId, buildDrugEntry } from "../types";
export { DRUG_CLASSES, classifyDrug, drugMatchesClass, getDrugClassMeta, type DrugClassId } from "../drug-classes";

/** ClinCalc Top 300 + board-exam extension (301–500) — 500 high-yield drugs. */
export const TOP_500_DRUGS = mergeCatalog([
  CLINCALC_1,
  CLINCALC_2,
  CLINCALC_3,
  CLINCALC_4,
  CLINCALC_5,
]);

export const TOP_500_COUNT = TOP_500_DRUGS.length;

/** @deprecated Use TOP_500_DRUGS */
export const TOP_300_DRUGS = TOP_500_DRUGS;
/** @deprecated Use TOP_500_COUNT */
export const TOP_300_COUNT = TOP_500_COUNT;

export function getDrugById(id: string) {
  return TOP_500_DRUGS.find((d) => d.id === id);
}

export function getDrugsByTherapeuticClass(therapeuticClass: string) {
  return TOP_500_DRUGS.filter((d) =>
    d.therapeuticClass.toLowerCase().includes(therapeuticClass.toLowerCase())
  );
}

export function getDrugsByDrugClass(classId: DrugClassId) {
  if (classId === "all") return TOP_500_DRUGS;
  return TOP_500_DRUGS.filter((d) => classifyDrug(d.therapeuticClass) === classId);
}

export const DRUG_CATEGORIES = [...new Set(TOP_500_DRUGS.map((d) => d.therapeuticClass))].sort();
