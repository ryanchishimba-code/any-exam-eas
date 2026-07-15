export type {
  AnatomyDiseaseLink,
  AnatomyEvidenceLevel,
  ClinicalEndpoint,
  DrugClinicalContext,
  ResolvedAnatomyDiseaseLink,
} from "./types";

export { CURATED_DISEASE_LINKS } from "./diseases-curated";
export { CURATED_DISEASE_LINKS_EXTENDED } from "./diseases-curated-extended";
export { CURATED_DISEASE_LINKS_LONGTAIL } from "./diseases-curated-longtail";
export {
  DISEASE_GUIDELINE_MAP,
  enrichDiseaseLinkWithAuthorities,
  enrichDiseaseLinksWithAuthorities,
} from "./disease-guideline-map";
export { getCorePathologyCoverage, getUncoveredCorePathologies } from "./coverage";
export { buildSupplementalDiseaseLinks, matchDrugsToPathologyForTest } from "./matcher";

export {
  ANATOMY_DISEASE_LINKS,
  resolveDiseaseLink,
  getDiseaseLinkById,
  getDiseaseLinksForStructure,
  getResolvedDiseaseLinksForStructure,
  getResolvedDiseaseLinkById,
  getDiseaseLinkForPathology,
  findDiseaseIdForPathology,
  getDiseaseLinksForDrug,
  getClinicalContextForDrug,
  drugUsedAsFirstLine,
} from "./registry";

import { ROUTES } from "@/lib/routes";

/** Drug catalog deep link for anatomy ↔ pharmacology bridge. */
export function anatomyDrugHref(drugId: string): string {
  return `${ROUTES.drugs300}?drug=${encodeURIComponent(drugId)}`;
}

/** Anatomy explorer deep link for drug ↔ structure bridge. */
export function anatomyStructureHref(structureId: string): string {
  return `${ROUTES.anatomy}?structure=${encodeURIComponent(structureId)}`;
}
