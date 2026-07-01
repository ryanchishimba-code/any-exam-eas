import { describe, expect, it } from "vitest";
import { DEFAULT_STUDY_LAYERS } from "@/lib/anatomy/cartoon/layer-styles";
import {
  CT_ATLAS_ENTRY_TIER,
  forceEntryIdsForMeshIds,
  getCtAtlasTier0EntryIds,
  shouldMountCtAtlasEntry,
} from "@/lib/anatomy/ct/ct-atlas-load-plan";
import { CT_ATLAS_ORGANS } from "@/lib/anatomy/ct/ct-atlas-registry";

const DEFAULT_LAYERS = new Set(DEFAULT_STUDY_LAYERS);

describe("ct-atlas-load-plan", () => {
  it("assigns tier 0 to core silhouette organs", () => {
    expect(CT_ATLAS_ENTRY_TIER.heart).toBe(0);
    expect(CT_ATLAS_ENTRY_TIER.lungs).toBe(0);
    expect(CT_ATLAS_ENTRY_TIER.pelvis).toBe(0);
  });

  it("defers skin until the layer is enabled", () => {
    const skin = CT_ATLAS_ORGANS.find((e) => e.id === "skin")!;
    expect(
      shouldMountCtAtlasEntry(skin, {
        visibleLayers: DEFAULT_LAYERS,
        maxTier: 3,
        forceEntryIds: new Set(),
      })
    ).toBe(false);
    expect(
      shouldMountCtAtlasEntry(skin, {
        visibleLayers: new Set([...DEFAULT_LAYERS, "skin"]),
        maxTier: 3,
        forceEntryIds: new Set(),
      })
    ).toBe(true);
  });

  it("loads tier 0 entries on default study layers before tier 1", () => {
    const tier0 = getCtAtlasTier0EntryIds(DEFAULT_LAYERS);
    expect(tier0).toContain("heart");
    expect(tier0).toContain("lungs");
    expect(tier0).not.toContain("skin");
    expect(tier0).not.toContain("brain");

    const deferred = CT_ATLAS_ORGANS.find((e) => e.id === "colon")!;
    expect(
      shouldMountCtAtlasEntry(deferred, {
        visibleLayers: DEFAULT_LAYERS,
        maxTier: 0,
        forceEntryIds: new Set(),
      })
    ).toBe(false);
    expect(
      shouldMountCtAtlasEntry(deferred, {
        visibleLayers: DEFAULT_LAYERS,
        maxTier: 2,
        forceEntryIds: new Set(),
      })
    ).toBe(true);
  });

  it("forces load for focused mesh ids", () => {
    const forced = forceEntryIdsForMeshIds(["brain-frontal"]);
    expect(forced.has("brain")).toBe(true);
  });
});
