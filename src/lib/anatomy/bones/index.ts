export {
  ADULT_BONE_COUNT,
  buildBoneInstances,
  getBoneFocus,
  getBoneFocusDistance,
  getBoneIdsForStructure,
  isBoneHighlighted,
  LEGACY_BONE_GROUPS,
  verifyBoneCount,
  type BoneInstance,
  type BoneRegion,
} from "./instances";

export { generateBoneStructures, getBoneRegionLabel, LEGACY_BONE_IDS } from "./structures";
export { getBoneModules } from "./registry";
export { createBoneMeshGeometry, createBoneMeshMap } from "./mesh";
export {
  getIndividualBoneCatalogIds,
  isAtlasMappedStructure,
  isIndividual3dBoneStructure,
} from "./catalog-utils";
