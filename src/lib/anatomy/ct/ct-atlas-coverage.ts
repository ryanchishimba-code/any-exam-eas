import { getAnatomyStructure } from "@/lib/anatomy";
import type { AnatomyStructure } from "@/lib/anatomy/types";
import {
  CT_ATLAS_ORGANS,
  isMeshIdCoveredByAtlas,
  resolveStructureIdForAtlasEntry,
} from "./ct-atlas-registry";

/** Viewport highlight when the catalog id has no VH mesh. */
const CT_VIEWPORT_STRUCTURE_FALLBACKS: Record<string, string> = {
  trachea: "lungs",
  "trachea-carina": "lungs",
  skull: "spinal-cord",
  brain: "spinal-cord",
  gallbladder: "liver",
  "gallbladder-cystic-duct": "liver",
  diaphragm: "lungs",
  esophagus: "stomach",
  humerus: "femur",
  clavicle: "femur",
  scapula: "femur",
  sternum: "lungs",
  "adrenal-glands": "kidneys",
  "vertebral-column": "spinal-cord",
};

/** Structure ids that map to a loaded VH atlas organ (including alias mesh ids). */
export function getCtAtlasRenderableStructureIds(): Set<string> {
  const ids = new Set<string>();
  for (const entry of CT_ATLAS_ORGANS) {
    const structureId = resolveStructureIdForAtlasEntry(entry);
    if (structureId) ids.add(structureId);
  }
  return ids;
}

const RENDERABLE_STRUCTURE_IDS = getCtAtlasRenderableStructureIds();

export function isStructureRenderableInCtAtlas(structure: AnatomyStructure): boolean {
  if (RENDERABLE_STRUCTURE_IDS.has(structure.id)) return true;
  return isMeshIdCoveredByAtlas(structure.meshId);
}

/** Sidebar / search list — top-level structures with a 3D CT mesh (hides orphan bones). */
export function isStructureBrowsableInCtAtlas(structure: AnatomyStructure): boolean {
  if (structure.parentId) {
    const parent = getAnatomyStructure(structure.parentId);
    return parent ? isStructureBrowsableInCtAtlas(parent) : false;
  }
  if (isStructureRenderableInCtAtlas(structure)) return true;
  if (structure.system === "skeletal" && structure.layer === "bone") return false;
  return false;
}

/** Map tour picks and procedure deep-links to a structure the CT viewport can highlight. */
export function resolveCtViewportStructureId(structureId: string): string {
  const direct = getAnatomyStructure(structureId);
  if (direct && isStructureRenderableInCtAtlas(direct)) return structureId;

  const fallbackId = CT_VIEWPORT_STRUCTURE_FALLBACKS[structureId];
  if (fallbackId) {
    const fallback = getAnatomyStructure(fallbackId);
    if (fallback && isStructureRenderableInCtAtlas(fallback)) return fallbackId;
  }

  let current = direct;
  while (current?.parentId) {
    const parent = getAnatomyStructure(current.parentId);
    if (!parent) break;
    if (isStructureRenderableInCtAtlas(parent)) return parent.id;
    current = parent;
  }

  return structureId;
}
