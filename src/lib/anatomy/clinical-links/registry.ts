import { getAnatomyStructure } from "@/lib/anatomy";
import { getDrugById } from "@/lib/drugs300/catalog";
import type { DrugEntry } from "@/lib/drugs300/types";
import { CURATED_DISEASE_LINKS } from "./diseases-curated";
import { enrichDiseaseLinkWithAuthorities } from "./disease-guideline-map";
import { buildSupplementalDiseaseLinks } from "./matcher";
import type {
  AnatomyDiseaseLink,
  DrugClinicalContext,
  ResolvedAnatomyDiseaseLink,
} from "./types";

let supplementalDiseaseLinks: AnatomyDiseaseLink[] | null = null;
let curatedWithAuthorities: AnatomyDiseaseLink[] | null = null;

function getCuratedWithAuthorities(): AnatomyDiseaseLink[] {
  if (!curatedWithAuthorities) {
    curatedWithAuthorities = CURATED_DISEASE_LINKS.map(enrichDiseaseLinkWithAuthorities);
  }
  return curatedWithAuthorities;
}

function getSupplementalDiseaseLinks(): AnatomyDiseaseLink[] {
  if (!supplementalDiseaseLinks) {
    supplementalDiseaseLinks = buildSupplementalDiseaseLinks(CURATED_DISEASE_LINKS).map(
      enrichDiseaseLinkWithAuthorities
    );
  }
  return supplementalDiseaseLinks;
}

/** Curated disease threads (authority-enriched). */
export const ANATOMY_DISEASE_LINKS: AnatomyDiseaseLink[] = getCuratedWithAuthorities();

function allDiseaseLinks(): AnatomyDiseaseLink[] {
  return [...getCuratedWithAuthorities(), ...getSupplementalDiseaseLinks()];
}

function hydrateDrugs(ids: string[] | undefined): DrugEntry[] {
  if (!ids?.length) return [];
  return ids.map((id) => getDrugById(id)).filter((d): d is DrugEntry => Boolean(d));
}

export function resolveDiseaseLink(link: AnatomyDiseaseLink): ResolvedAnatomyDiseaseLink {
  const enriched = enrichDiseaseLinkWithAuthorities(link);
  return {
    ...enriched,
    firstLineDrugs: hydrateDrugs(enriched.firstLineDrugIds),
    adjunctDrugs: hydrateDrugs(enriched.adjunctDrugIds),
  };
}

export function getDiseaseLinkById(id: string): AnatomyDiseaseLink | undefined {
  return allDiseaseLinks().find((d) => d.id === id);
}

export function getDiseaseLinksForStructure(structureId: string): AnatomyDiseaseLink[] {
  return allDiseaseLinks().filter((d) => d.structureIds.includes(structureId));
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
  const candidates = allDiseaseLinks().filter((d) => d.structureIds.includes(structureId));
  const byLabel = candidates.find((d) => d.pathologyLabel?.toLowerCase() === norm);
  if (byLabel) return byLabel;
  const byExactName = candidates.find((d) => d.name.toLowerCase() === norm);
  if (byExactName) return byExactName;
  // Prefer curated over generated when falling back to name substring.
  const curatedHit = candidates.find(
    (d) => !d.generated && d.name.toLowerCase().includes(norm)
  );
  if (curatedHit) return curatedHit;
  return candidates.find((d) => d.name.toLowerCase().includes(norm));
}

export function findDiseaseIdForPathology(
  structureId: string,
  pathologyLabel: string
): string | undefined {
  return getDiseaseLinkForPathology(structureId, pathologyLabel)?.id;
}

export function getDiseaseLinksForDrug(drugId: string): ResolvedAnatomyDiseaseLink[] {
  return allDiseaseLinks()
    .filter(
      (d) =>
        d.firstLineDrugIds.includes(drugId) || (d.adjunctDrugIds ?? []).includes(drugId)
    )
    .map(resolveDiseaseLink);
}

export function getClinicalContextForDrug(drugId: string): DrugClinicalContext {
  const diseases = getDiseaseLinksForDrug(drugId);
  const structureIds = [...new Set(diseases.flatMap((d) => d.structureIds))];
  const structureNames = structureIds
    .map((id) => getAnatomyStructure(id)?.name)
    .filter((n): n is string => Boolean(n));

  return { drugId, diseases, structureIds, structureNames };
}

export function drugUsedAsFirstLine(
  disease: AnatomyDiseaseLink | ResolvedAnatomyDiseaseLink,
  drugId: string
): boolean {
  return disease.firstLineDrugIds.includes(drugId);
}
