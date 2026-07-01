import { describe, expect, it } from "vitest";
import {
  BRAIN_REGIONS,
  isBrainRegionStructureId,
  resolveBrainRegionForAllenMeshName,
} from "./brain-regions";

describe("brain-regions", () => {
  it("maps Allen gyri to cerebral lobes", () => {
    expect(resolveBrainRegionForAllenMeshName("Allen_superior_frontal_gyrus_L")).toBe(
      "brain-frontal-lobe"
    );
    expect(resolveBrainRegionForAllenMeshName("Allen_postcentral_gyrus_R")).toBe(
      "brain-parietal-lobe"
    );
    expect(resolveBrainRegionForAllenMeshName("Allen_superior_temporal_gyrus_L")).toBe(
      "brain-temporal-lobe"
    );
    expect(resolveBrainRegionForAllenMeshName("Allen_superior_occipital_gyrus_R")).toBe(
      "brain-occipital-lobe"
    );
    expect(resolveBrainRegionForAllenMeshName("Allen_lateral_hemisphere_of_cerebellum_L")).toBe(
      "brain-cerebellum"
    );
    expect(resolveBrainRegionForAllenMeshName("Allen_midbrain_tegmentum_L")).toBe("brain-brainstem");
    expect(resolveBrainRegionForAllenMeshName("Allen_long_insular_gyri_L")).toBe("brain-insula");
  });

  it("prefers occipital over temporal for occipitotemporal fusiform occipital part", () => {
    expect(
      resolveBrainRegionForAllenMeshName(
        "Allen_lateral_occipitotemporal_fusiform_gyrus_occipital_part_L"
      )
    ).toBe("brain-occipital-lobe");
  });

  it("leaves deep gray unassigned", () => {
    expect(resolveBrainRegionForAllenMeshName("Allen_putamen_L")).toBeNull();
    expect(resolveBrainRegionForAllenMeshName("Allen_thalamus_L")).toBeNull();
  });

  it("exports stable region ids", () => {
    expect(BRAIN_REGIONS.length).toBeGreaterThanOrEqual(7);
    expect(isBrainRegionStructureId("brain-frontal-lobe")).toBe(true);
    expect(isBrainRegionStructureId("heart")).toBe(false);
  });
});
