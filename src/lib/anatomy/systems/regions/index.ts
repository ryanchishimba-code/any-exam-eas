/**
 * Regions system — clickable hit areas decoupled from rendering.
 * Video is the default provider; atlas/3D can register alternate providers.
 */

export type { AnatomyRegion, RegionMeta, RegionProvider, RegionProviderConfig } from "./types";
export { videoRegionProvider } from "./video";
export { atlasRegionProvider, getAtlasStructureLabel } from "./atlas";
