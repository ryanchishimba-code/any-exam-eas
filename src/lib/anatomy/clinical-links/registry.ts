import { getAnatomyStructure } from "@/lib/anatomy";
import { getDrugById } from "@/lib/drugs300/catalog";
import type { DrugEntry } from "@/lib/drugs300/types";
import { CURATED_DISEASE_LINKS } from "./diseases-curated";
import { buildSupplementalDiseaseLinks } from "./matcher";
import type {
  AnatomyDiseaseLink,
  DrugClinicalContext,
  ResolvedAnatomyDiseaseLink,
} from "./types";

const SUPPLEMENTAL_DISEASE_LINKS = buildSupplementalDiseaseLinks(CURATED_DISEASE_LINKS);

export const ANATOMY_DISEASE_LINKS: AnatomyDiseaseLink[] = [
  ...CURATED_DISEASE_LINKS,
  ...SUPPLEMENTAL_DISEASE_LINKS,
];

function hydrateDrugs(ids: string[] | undefined): DrugEntry[] {
  if (!ids?.length) return [];
  return ids.map((id) => getDrugById(id)).filter((d): d is DrugEntry => Boolean(d));
}

export function resolveDiseaseLink(link: AnatomyDiseaseLink): ResolvedAnatomyDiseaseLink {
  return {
    ...link,
    firstLineDrugs: hydrateDrugs(link.firstLineDrugIds),
    adjunctDrugs: hydrateDrugs(link.adjunctDrugIds),
  };
}

export function getDiseaseLinkById(id: string): AnatomyDiseaseLink | undefined {
  return ANATOMY_DISEASE_LINKS.find((d) => d.id === id);
}

export function getDiseaseLinksForStructure(structureId: string): AnatomyDiseaseLink[] {
  return ANATOMY_DISEASE_LINKS.filter((d) => d.structureIds.includes(structureId));
}

export function getResolvedDiseaseLinksForStructure(
  structureId: string
): ResolvedAnatomyDiseaseLink[] {
  return getDiseaseLinksForStructure(structureId).map(resolveDiseaseLink);
}

export function getResolvedDiseaseLinkById(id: string): ResolvedAnatomyDiseaseLink | undefined {
  const link = getDiseaseLinkById(id);
  return link ? resolveDiseaseLink(link) : undefined;
}

export function getDiseaseLinkForPathology(
  structureId: string,
  pathologyLabel: string
): AnatomyDiseaseLink | undefined {
  const norm = pathologyLabel.toLowerCase();
  return ANATOMY_DISEASE_LINKS.find(
    (d) =>
      d.structureIds.includes(structureId) &&
      (d.pathologyLabel?.toLowerCase() === norm ||
        d.name.toLowerCase() === norm ||
        d.name.toLowerCase().includes(norm))
  );
}

export function findDiseaseIdForPathology(
  structureId: string,
  pathologyLabel: string
): string | undefined {
  return getDiseaseLinkForPathology(structureId, pathologyLabel)?.id;
}

export function getDiseaseLinksForDrug(drugId: string): ResolvedAnatomyDiseaseLink[] {
  return ANATOMY_DISEASE_LINKS.filter(
    (d) =>
      d.firstLineDrugIds.includes(drugId) ||
      (d.adjunctDrugIds?.includes(drugId) ?? false)
  ).map(resolveDiseaseLink);
}

export function getClinicalContextForDrug(drugId: string): DrugClinicalContext {
  const diseases = getDiseaseLinksForDrug(drugId);
  const structureIds = [...new Set(diseases.flatMap((d) => d.structureIds))];
  const structureNames = structureIds
    .map((id) => getAnatomyStructure(id)?.name)
    .filter((n): n is string => Boolean(n));

  return { drugId, diseases, structureIds, structureNames };
}

export function drugUsedAsFirstLine(disease: AnatomyDiseaseLink, drugId: string): boolean {
  return disease.firstLineDrugIds.includes(drugId);
}
