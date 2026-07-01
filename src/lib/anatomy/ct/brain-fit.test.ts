import { describe, expect, it } from "vitest";
import { Box3, BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { FIGURE } from "@/lib/anatomy/cartoon/proportions";
import {
  fitAllenBrainToAtlas,
  fitAllenBrainToFigure,
  getCraniocervicalJunctionY,
  getCranialVaultWorldBounds,
} from "./brain-fit";

describe("brain-fit", () => {
  it("derives cranial vault from fitted skin upper slice", () => {
    const atlas = new Group();
    const skin = new Mesh(new BoxGeometry(0.5, 2.4, 0.35), new MeshBasicMaterial());
    skin.userData.atlasOrganId = "skin";
    skin.position.set(0, 0.2, FIGURE.centerZ);
    atlas.add(skin);

    const cranial = getCranialVaultWorldBounds(atlas);
    expect(cranial).not.toBeNull();
    expect(cranial!.max.y).toBeCloseTo(1.4, 1);
    expect(cranial!.min.y).toBeGreaterThan(0.9);
  });

  it("anchors junction to spinal cord top when cord is present", () => {
    const atlas = new Group();
    const skin = new Mesh(new BoxGeometry(0.48, 2.35, 0.34), new MeshBasicMaterial());
    skin.userData.atlasOrganId = "skin";
    skin.position.set(0, 0.18, FIGURE.centerZ);
    const cord = new Mesh(new BoxGeometry(0.04, 1.1, 0.04), new MeshBasicMaterial());
    cord.userData.atlasOrganId = "spinal-cord";
    cord.position.set(0, 0.55, FIGURE.centerZ - 0.08);
    atlas.add(skin, cord);

    const skinBox = new Box3().setFromObject(skin);
    const junction = getCraniocervicalJunctionY(atlas, skinBox);
    const cordTop = new Box3().setFromObject(cord).max.y;
    expect(junction).toBeLessThan(cordTop);
    expect(junction).toBeCloseTo(cordTop, 1);
  });

  it("seats brain base on spinal cord and inside cranial vault", () => {
    const atlas = new Group();
    const skin = new Mesh(new BoxGeometry(0.48, 2.35, 0.34), new MeshBasicMaterial());
    skin.userData.atlasOrganId = "skin";
    skin.position.set(0, 0.18, FIGURE.centerZ);
    const cord = new Mesh(new BoxGeometry(0.04, 1.1, 0.04), new MeshBasicMaterial());
    cord.userData.atlasOrganId = "spinal-cord";
    cord.position.set(0, 0.55, FIGURE.centerZ - 0.08);
    atlas.add(skin, cord);

    const brain = new Group();
    brain.add(new Mesh(new BoxGeometry(0.32, 0.28, 0.3), new MeshBasicMaterial()));

    fitAllenBrainToAtlas(atlas, brain);

    brain.updateMatrixWorld(true);
    const brainBox = new Box3().setFromObject(brain);
    const cranial = getCranialVaultWorldBounds(atlas)!;
    const junction = getCraniocervicalJunctionY(atlas, new Box3().setFromObject(skin));
    const cordBox = new Box3().setFromObject(cord);

    expect(brainBox.min.y).toBeGreaterThan(junction);
    expect(brainBox.min.y).toBeLessThanOrEqual(cordBox.max.y + 0.03);
    expect(brainBox.max.y).toBeLessThanOrEqual(cranial.max.y + 0.02);
    expect(brainBox.getCenter(new Vector3()).y).toBeGreaterThan(junction);
  });

  it("scales an oversized brain down when skin is not loaded", () => {
    const atlas = new Group();
    const cord = new Mesh(new BoxGeometry(0.04, 1.1, 0.04), new MeshBasicMaterial());
    cord.userData.atlasOrganId = "spinal-cord";
    cord.position.set(0, 0.55, FIGURE.centerZ - 0.08);
    atlas.add(cord);

    const brain = new Group();
    brain.add(new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial()));

    fitAllenBrainToAtlas(atlas, brain);

    brain.updateMatrixWorld(true);
    const brainBox = new Box3().setFromObject(brain);
    const cranial = getCranialVaultWorldBounds(atlas)!;

    expect(brainBox.max.x - brainBox.min.x).toBeGreaterThan(0.15);
    expect(brainBox.max.x - brainBox.min.x).toBeLessThan(0.32);
    expect(brainBox.max.y).toBeLessThanOrEqual(cranial.max.y + 0.05);
  });

  it("falls back to figure neck junction when atlas bounds are missing", () => {
    const brain = new Group();
    brain.add(new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial()));

    fitAllenBrainToFigure(brain);

    brain.updateMatrixWorld(true);
    const box = new Box3().setFromObject(brain);
    const vault = getCranialVaultWorldBounds(new Group())!;
    expect(box.min.y).toBeGreaterThanOrEqual(vault.min.y);
    expect(box.min.y).toBeLessThanOrEqual(vault.min.y + 0.03);
    expect(box.max.y).toBeLessThanOrEqual(vault.max.y + 0.02);
  });
});
