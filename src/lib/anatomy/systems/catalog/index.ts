/**
 * Catalog system — structure data and queries only.
 * Usable without any viewer, regions, or teach layer.
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
} from "./queries";

export { getAnatomyCatalogStats, type AnatomyCatalogStats } from "./stats";
export { assertCatalogContentIntegrity } from "./integrity";

export { ANATOMY_STRUCTURES } from "../../structures";
