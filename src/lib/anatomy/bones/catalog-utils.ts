import { buildBoneInstances } from "./instances";

let cachedIds: Set<string> | null = null;

/** The 206 individually clickable 3D bones (not legacy summary entries like "femur"). */
export function getIndividualBoneCatalogIds(): Set<string> {
  if (!cachedIds) {
    cachedIds = new Set(buildBoneInstances().map((b) => b.id));
  }
  return cachedIds;
}

export function isIndividual3dBoneStructure(structureId: string): boolean {
  return getIndividualBoneCatalogIds().has(structureId);
}

/** Structures that use atlas / video overlays (organs + legacy bone summaries). */
export function isAtlasMappedStructure(structureId: string): boolean {
  return !isIndividual3dBoneStructure(structureId);
}
