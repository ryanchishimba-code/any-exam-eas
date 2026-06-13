import { describe, expect, it } from "vitest";
import { Box3, BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { FIGURE } from "@/lib/anatomy/cartoon/proportions";
import {
  createCtClipPlanes,
  fitProceduralThoraxToAtlas,
  formatCtSliceLabel,
  getClipSliceRange,
  getFigureClipCenter,
  getThoracicOrganWorldBounds,
  sliceOffsetToWorld,
} from "./ct-atlas-fit";

describe("ct-atlas-fit MPR slices", () => {
  it("returns anatomical ranges per MPR plane", () => {
    const axial = getClipSliceRange("axial");
    expect(axial?.axis).toBe("y");
    expect(axial?.min).toBe(FIGURE.footY);
    expect(axial?.max).toBeGreaterThan(axial!.min);

    expect(getClipSliceRange("coronal")?.axis).toBe("z");
    expect(getClipSliceRange("sagittal")?.axis).toBe("x");
    expect(getClipSliceRange("off")).toBeNull();
  });

  it("maps slice offset −1…1 through the body axis", () => {
    const range = getClipSliceRange("axial")!;
    expect(sliceOffsetToWorld("axial", -1)).toBe(range.min);
    expect(sliceOffsetToWorld("axial", 1)).toBeCloseTo(range.max, 5);
    const mid = sliceOffsetToWorld("axial", 0)!;
    expect(mid).toBeCloseTo((range.min + range.max) / 2, 5);
  });

  it("moves clip plane with slice offset", () => {
    const center = getFigureClipCenter();
    const mid = createCtClipPlanes("axial", 0)[0]!;
    const feet = createCtClipPlanes("axial", -1)[0]!;
    expect(mid.distanceToPoint(center)).toBeLessThan(0.01);
    expect(Math.abs(feet.distanceToPoint(center))).toBeGreaterThan(0.5);
  });

  it("formats slice position as percentage label", () => {
    expect(formatCtSliceLabel("axial", -1)).toBe("Axial 0%");
    expect(formatCtSliceLabel("sagittal", 1)).toBe("Sagittal 100%");
    expect(formatCtSliceLabel("coronal", 0)).toBe("Coronal 50%");
  });
});

describe("ct-atlas-fit thorax overlay", () => {
  it("collects thoracic organ world bounds from atlas meshes", () => {
    const atlas = new Group();
    const lung = new Mesh(new BoxGeometry(0.4, 0.5, 0.3), new MeshBasicMaterial());
    lung.userData.atlasOrganId = "lungs";
    lung.position.set(0, 0.9, FIGURE.centerZ);
    atlas.add(lung);

    const bounds = getThoracicOrganWorldBounds(atlas);
    expect(bounds).not.toBeNull();
    const center = new Vector3();
    bounds!.getCenter(center);
    expect(center.y).toBeCloseTo(0.9, 2);
  });

  it("aligns procedural thorax center and scale to fitted lung/heart envelope", () => {
    const atlas = new Group();
    const lung = new Mesh(new BoxGeometry(0.36, 0.48, 0.28), new MeshBasicMaterial());
    lung.userData.atlasOrganId = "lungs";
    lung.position.set(0, 0.91, FIGURE.centerZ);
    const heart = new Mesh(new BoxGeometry(0.14, 0.16, 0.12), new MeshBasicMaterial());
    heart.userData.atlasOrganId = "heart";
    heart.position.set(0.04, 0.82, FIGURE.centerZ + 0.04);
    atlas.add(lung, heart);

    const thorax = new Group();
    const cage = new Mesh(new BoxGeometry(0.42, 0.52, 0.32), new MeshBasicMaterial());
    cage.position.set(0, 0.94, FIGURE.centerZ);
    thorax.add(cage);

    fitProceduralThoraxToAtlas(atlas, thorax);

    thorax.updateMatrixWorld(true);
    const thoraxCenter = new Vector3();
    const targetCenter = new Vector3();
    const thoraxBox = new Box3().setFromObject(thorax);
    getThoracicOrganWorldBounds(atlas)!.getCenter(targetCenter);
    thoraxBox.getCenter(thoraxCenter);

    expect(thoraxCenter.x).toBeCloseTo(targetCenter.x, 2);
    expect(thoraxCenter.y).toBeCloseTo(targetCenter.y, 2);
    expect(thoraxCenter.z).toBeCloseTo(targetCenter.z, 2);

    const thoraxSize = new Vector3();
    const targetSize = new Vector3();
    thoraxBox.getSize(thoraxSize);
    getThoracicOrganWorldBounds(atlas)!.getSize(targetSize);
    expect(thoraxSize.x).toBeGreaterThan(targetSize.x);
    expect(thoraxSize.y).toBeGreaterThan(targetSize.y);
  });
});
