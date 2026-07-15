import { getAllAnatomyStructures } from "@/lib/anatomy";
import { getDiseaseLinkForPathology, getResolvedDiseaseLinksForStructure } from "./registry";

const CORE_STRUCTURE_IDS = new Set([
  "heart",
  "aorta",
  "carotid-artery",
  "lungs",
  "trachea",
  "brain",
  "spinal-cord",
  "liver",
  "gallbladder",
  "pancreas",
  "stomach",
  "appendix",
  "kidneys",
  "bladder",
  "femur",
  "humerus",
  "tibia",
  "skull",
  "sternum",
  "diaphragm",
  "biceps-brachii",
  "spleen",
  "thyroid",
  "esophagus",
  "duodenum",
  "small-intestine",
  "colon",
  "clavicle",
  "scapula",
  "prostate",
  "adrenal-glands",
  "vertebral-column",
]);

export type PathologyCoverage = {
  structureId: string;
  structureName: string;
  pathology: string;
  diseaseId: string | null;
  hasDrugs: boolean;
  curated: boolean;
};

/** Audit: every core-structure pathology should resolve to a disease thread with drugs. */
export function getCorePathologyCoverage(): PathologyCoverage[] {
  const rows: PathologyCoverage[] = [];

  for (const structure of getAllAnatomyStructures()) {
    if (!CORE_STRUCTURE_IDS.has(structure.id)) continue;
    for (const pathology of structure.pathologies ?? []) {
      const link = getDiseaseLinkForPathology(structure.id, pathology);
      const resolved = link
        ? getResolvedDiseaseLinksForStructure(structure.id).find((d) => d.id === link.id)
        : undefined;
      const hasDrugs = Boolean(
        resolved &&
          (resolved.firstLineDrugs.length > 0 || resolved.adjunctDrugs.length > 0)
      );
      rows.push({
        structureId: structure.id,
        structureName: structure.name,
        pathology,
        diseaseId: link?.id ?? null,
        hasDrugs,
        curated: link ? !link.generated : false,
      });
    }
  }

  return rows;
}

export function getUncoveredCorePathologies(): PathologyCoverage[] {
  return getCorePathologyCoverage().filter((r) => !r.hasDrugs);
}
