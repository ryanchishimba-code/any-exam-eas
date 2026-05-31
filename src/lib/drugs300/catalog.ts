export type { DrugEntry, DrugEntryInput } from "./types";
export {
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

import { TOP_300_DRUGS, type DrugEntry } from "./catalog/index";

/** Full ClinCalc-aligned catalog (300 drugs). */
export function getTop300DrugCatalog(): DrugEntry[] {
  return TOP_300_DRUGS;
}
