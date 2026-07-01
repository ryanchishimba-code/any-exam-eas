import { describe, expect, it } from "vitest";
import { getAnatomyStructure } from "@/lib/anatomy";
import {
  isStructureBrowsableInCtAtlas,
  isStructureRenderableInCtAtlas,
  resolveCtViewportStructureId,
} from "./ct-atlas-coverage";

describe("ct-atlas-coverage", () => {
  it("marks VH atlas organs as renderable", () => {
    expect(isStructureRenderableInCtAtlas(getAnatomyStructure("heart")!)).toBe(true);
    expect(isStructureRenderableInCtAtlas(getAnatomyStructure("pelvis")!)).toBe(true);
    expect(isStructureRenderableInCtAtlas(getAnatomyStructure("brain-frontal-lobe")!)).toBe(true);
  });

  it("shows brain lobes under the brain parent in CT browse", () => {
    expect(isStructureBrowsableInCtAtlas(getAnatomyStructure("brain-frontal-lobe")!)).toBe(true);
  });

  it("hides catalog-only structures from CT browse list", () => {
    expect(isStructureBrowsableInCtAtlas(getAnatomyStructure("skull")!)).toBe(false);
    expect(isStructureBrowsableInCtAtlas(getAnatomyStructure("gallbladder")!)).toBe(false);
    expect(isStructureBrowsableInCtAtlas(getAnatomyStructure("femur-r")!)).toBe(false);
  });

  it("maps unavailable tour targets to atlas parents", () => {
    expect(resolveCtViewportStructureId("gallbladder-cystic-duct")).toBe("liver");
    expect(resolveCtViewportStructureId("heart-aortic-valve")).toBe("heart");
    expect(resolveCtViewportStructureId("trachea-carina")).toBe("lungs");
    expect(resolveCtViewportStructureId("skull")).toBe("brain");
  });
});
