export type { DrugEntry, DrugEntryInput } from "./types";
export {
  TOP_500_DRUGS,
  TOP_500_COUNT,
  TOP_300_DRUGS,
  TOP_300_COUNT,
  getDrugById,
  getDrugsByTherapeuticClass,
  getDrugsByDrugClass,
  DRUG_CATEGORIES,
  DRUG_CLASSES,
  classifyDrug,
  drugMatchesClass,
  getDrugClassMeta,
  slugDrugId,
  buildDrugEntry,
  type DrugClassId,
} from "./catalog/index";

import { TOP_500_DRUGS, type DrugEntry } from "./catalog/index";

/** Full high-yield drug catalog (500 drugs). */
export function getTop500DrugCatalog(): DrugEntry[] {
  return TOP_500_DRUGS;
}

/** @deprecated Use getTop500DrugCatalog */
export function getTop300DrugCatalog(): DrugEntry[] {
  return getTop500DrugCatalog();
}
