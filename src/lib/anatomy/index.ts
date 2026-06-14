/**
 * Anatomy public API — re-exports modular systems for backward compatibility.
 */

export {
  getAllAnatomyStructures,
  getTopLevelAnatomyStructures,
  getSubregionsForStructure,
  isAnatomySubregion,
  getAnatomyStructure,
  getAnatomyStructureByMeshId,
  getAnatomyStructuresForMemoryCard,
  getHighYieldStructures,
  getStructuresForSystem,
  groupStructuresBySystem,
  searchAnatomyStructures,
  structureVisibleInLayers,
  getAnatomyCatalogStats,
  type AnatomyCatalogStats,
} from "./systems/catalog";

export { getMemoryCardsForStructure } from "./systems/links";

export { isBioDigitalAvailable } from "./legacy-helpers";

export {
  createAnatomyBundle,
  createAtlasBundle,
  createCatalogOnlyBundle,
  createSupportiveBundle,
  assertBundleIntegrity,
} from "./systems";
