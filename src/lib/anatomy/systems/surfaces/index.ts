/**
 * Surfaces system — pluggable viewports (video, atlas, catalog-only).
 */

export type {
  AnatomySurfaceDefinition,
  AnatomySurfaceId,
  AnatomySurfaceParam,
  ResolvedAnatomySurface,
} from "./types";

export {
  getActiveAnatomySurface,
  getAnatomySurfaceDefinition,
  getCatalogOnlySurface,
  listAnatomySurfaces,
  listSelectableAnatomySurfaces,
  parseAnatomySurfaceParam,
  resolveAnatomySurface,
  resolveAnatomySurfaceFromParam,
  surfaceIdToParam,
} from "./registry";
