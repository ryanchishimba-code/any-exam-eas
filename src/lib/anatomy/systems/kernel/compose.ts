import * as catalog from "../catalog";
import * as links from "../links";
import * as recommendations from "../recommendations";
import type { RegionProvider } from "../regions/types";
import {
  getActiveAnatomySurface,
  getCatalogOnlySurface,
  resolveAnatomySurface,
  type ResolvedAnatomySurface,
} from "../surfaces";
import type { AnatomySurfaceId } from "../surfaces/types";
import * as teach from "../teach";

export type AnatomyBundleId = "supportive" | "catalog-only" | "atlas" | "custom";

export type AnatomyBundle = {
  id: AnatomyBundleId;
  catalog: typeof catalog;
  links: typeof links;
  teach: typeof teach;
  recommendations: typeof recommendations;
  surface: ResolvedAnatomySurface;
  regionProvider: RegionProvider | null;
};

function bundleIdForSurface(id: AnatomySurfaceId): AnatomyBundleId {
  switch (id) {
    case "none":
      return "catalog-only";
    case "illustrated-atlas":
      return "atlas";
    case "cartoon-3d":
    case "reference-video":
      return "supportive";
    default:
      return "supportive";
  }
}

export function createAnatomyBundle(surfaceId?: AnatomySurfaceId): AnatomyBundle {
  const surface = surfaceId ? resolveAnatomySurface(surfaceId) : getActiveAnatomySurface();

  return {
    id: bundleIdForSurface(surface.id),
    catalog,
    links,
    teach,
    recommendations,
    surface,
    regionProvider: null,
  };
}

/** Full supportive stack: cartoon 3D + teach + links. */
export function createSupportiveBundle(): AnatomyBundle {
  return createAnatomyBundle("cartoon-3d");
}

/** @deprecated Atlas removed — aliases to the 3D cartoon bundle. */
export function createAtlasBundle(): AnatomyBundle {
  return createSupportiveBundle();
}

/** Catalog, pearls, tours, and practice — no body viewport. */
export function createCatalogOnlyBundle(): AnatomyBundle {
  return createAnatomyBundle("none");
}

export function assertBundleIntegrity(bundle: AnatomyBundle): string[] {
  const issues: string[] = [];
  issues.push(...catalog.assertCatalogContentIntegrity());
  issues.push(...teach.assertTeachContentIntegrity());
  if (bundle.regionProvider?.assertIntegrity) {
    issues.push(...bundle.regionProvider.assertIntegrity());
  }
  return issues;
}
