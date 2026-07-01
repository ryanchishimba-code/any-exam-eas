import { useGLTF } from "@react-three/drei";
import { DEFAULT_STUDY_LAYERS } from "@/lib/anatomy/cartoon/layer-styles";
import type { AnatomyLayer } from "@/lib/anatomy/types";
import {
  CT_ATLAS_TIER_DELAYS_MS,
  ctAtlasEntryTier,
  type CtAtlasLoadTier,
} from "./ct-atlas-load-plan";
import { CT_ATLAS_ORGANS, resolveCtAtlasUrl } from "./ct-atlas-registry";

const preloadedUrls = new Set<string>();

function preloadUrl(url: string): void {
  if (!url || preloadedUrls.has(url)) return;
  preloadedUrls.add(url);
  useGLTF.preload(url);
}

/** Primary URL only — skip CDN fallback until load failure. */
export function preloadCtAtlasEntries(entryIds: Iterable<string>): void {
  const idSet = new Set(entryIds);
  for (const entry of CT_ATLAS_ORGANS) {
    if (!idSet.has(entry.id)) continue;
    preloadUrl(resolveCtAtlasUrl(entry.fileName));
  }
}

export function preloadCtAtlasTier(maxTier: CtAtlasLoadTier, visibleLayers?: Set<AnatomyLayer>): void {
  const layers = visibleLayers ?? new Set(DEFAULT_STUDY_LAYERS);
  for (const entry of CT_ATLAS_ORGANS) {
    if (ctAtlasEntryTier(entry) > maxTier) continue;
    if (entry.id === "skin" && !layers.has("skin")) continue;
    if (!layers.has(entry.layer)) continue;
    preloadUrl(resolveCtAtlasUrl(entry.fileName));
  }
}

let stagedPreloadStarted = false;

/** Warm tier 0 immediately; schedule tier 1–2 during idle time. */
export function startStagedCtAtlasPreload(visibleLayers?: Set<AnatomyLayer>): void {
  if (stagedPreloadStarted) return;
  stagedPreloadStarted = true;

  const layers = visibleLayers ?? new Set(DEFAULT_STUDY_LAYERS);
  preloadCtAtlasTier(0, layers);

  window.setTimeout(() => preloadCtAtlasTier(1, layers), CT_ATLAS_TIER_DELAYS_MS[1]);

  const runTier2 = () => preloadCtAtlasTier(2, layers);
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(runTier2, { timeout: 2500 });
  } else {
    window.setTimeout(runTier2, CT_ATLAS_TIER_DELAYS_MS[2]);
  }
}

/** Reset for tests. */
export function resetCtAtlasPreloadStateForTests(): void {
  stagedPreloadStarted = false;
  preloadedUrls.clear();
}
