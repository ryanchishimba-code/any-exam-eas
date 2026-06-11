/**
 * Modular anatomy systems — each can run alone or compose via kernel/compose.
 *
 * - catalog: structure data + search
 * - regions: hit areas (video, atlas, 3D)
 * - surfaces: viewport metadata + resolution
 * - teach: tours + quiz
 * - links: memory cards + practice hrefs
 * - recommendations: exam-scoped defaults
 */

export * as catalog from "./catalog";
export * as regions from "./regions";
export * as surfaces from "./surfaces";
export * as teach from "./teach";
export * as links from "./links";
export * as recommendations from "./recommendations";
export * as kernel from "./kernel/types";

export {
  assertBundleIntegrity,
  createAnatomyBundle,
  createAtlasBundle,
  createCatalogOnlyBundle,
  createSupportiveBundle,
  type AnatomyBundle,
  type AnatomyBundleId,
} from "./kernel/compose";
