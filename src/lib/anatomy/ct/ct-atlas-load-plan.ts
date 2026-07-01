import type { AnatomyLayer } from "@/lib/anatomy/types";
import {
  CT_ATLAS_ORGANS,
  entryMatchesMeshId,
  getAtlasEntryForMeshId,
  type CtAtlasOrganEntry,
} from "./ct-atlas-registry";

/** Progressive load tiers — lower = sooner. Skin is on-demand only. */
export type CtAtlasLoadTier = 0 | 1 | 2 | 3;

export const CT_ATLAS_ENTRY_TIER: Record<string, CtAtlasLoadTier> = {
  heart: 0,
  lungs: 0,
  liver: 0,
  pelvis: 0,
  "knee-l": 0,
  "knee-r": 0,
  "spinal-cord": 0,
  "blood-vasculature": 1,
  "kidney-l": 1,
  "kidney-r": 1,
  spleen: 1,
  pancreas: 1,
  colon: 2,
  "small-intestine": 2,
  bladder: 2,
  prostate: 2,
  thymus: 2,
  brain: 2,
  skin: 3,
};

export function ctAtlasEntryTier(entry: CtAtlasOrganEntry): CtAtlasLoadTier {
  return CT_ATLAS_ENTRY_TIER[entry.id] ?? 2;
}

export type CtAtlasMountContext = {
  visibleLayers: Set<AnatomyLayer>;
  maxTier: CtAtlasLoadTier;
  /** Entry ids required for selection / highlight (load even if layer hidden). */
  forceEntryIds: ReadonlySet<string>;
};

export function shouldMountCtAtlasEntry(entry: CtAtlasOrganEntry, ctx: CtAtlasMountContext): boolean {
  if (ctx.forceEntryIds.has(entry.id)) return true;

  if (entry.id === "skin") return ctx.visibleLayers.has("skin");

  if (!ctx.visibleLayers.has(entry.layer)) return false;

  return ctAtlasEntryTier(entry) <= ctx.maxTier;
}

/** Resolve atlas entries that must load for the current focus mesh ids. */
export function forceEntryIdsForMeshIds(meshIds: Iterable<string>): Set<string> {
  const ids = new Set<string>();
  for (const meshId of meshIds) {
    const entry = getAtlasEntryForMeshId(meshId);
    if (entry) ids.add(entry.id);
    if (meshId === "brain" || meshId.startsWith("brain-")) {
      ids.add("brain");
    }
  }
  return ids;
}

/** Tier-0 entries on default study layers (for `<link rel="preload">`). */
export function getCtAtlasTier0EntryIds(visibleLayers: Set<AnatomyLayer>): string[] {
  const ctx: CtAtlasMountContext = {
    visibleLayers,
    maxTier: 0,
    forceEntryIds: new Set(),
  };
  return CT_ATLAS_ORGANS.filter((e) => shouldMountCtAtlasEntry(e, ctx)).map((e) => e.id);
}

export function listCtAtlasEntriesForTier(maxTier: CtAtlasLoadTier): CtAtlasOrganEntry[] {
  return CT_ATLAS_ORGANS.filter((e) => ctAtlasEntryTier(e) <= maxTier && e.id !== "skin");
}

/** Delay before advancing to the next load tier (ms). */
export const CT_ATLAS_TIER_DELAYS_MS: Record<Exclude<CtAtlasLoadTier, 3>, number> = {
  0: 0,
  1: 120,
  2: 480,
};

export function entryMatchesAnyMeshId(entry: CtAtlasOrganEntry, meshIds: Set<string>): boolean {
  for (const meshId of meshIds) {
    if (entryMatchesMeshId(entry, meshId)) return true;
  }
  return false;
}
