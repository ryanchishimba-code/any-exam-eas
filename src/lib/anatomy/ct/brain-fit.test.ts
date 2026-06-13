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

  it("uses spinal cord top as craniocervical junction", () => {
    const atlas = new Group();
    const skin = new Mesh(new BoxGeometry(0.48, 2.35, 0.34), new MeshBasicMaterial());
    skin.userData.atlasOrganId = "skin";
    skin.position.set(0, 0.18, FIGURE.centerZ);
    const cord = new Mesh(new BoxGeometry(0.04, 1.1, 0.04), new MeshBasicMaterial());
    cord.userData.atlasOrganId = "spinal-cord";
    cord.position.set(0, 0.55, FIGURE.centerZ - 0.08);
    atlas.add(skin, cord);

    const cordTop = new Box3().setFromObject(cord).max.y;
    expect(getCraniocervicalJunctionY(atlas, new Box3().setFromObject(skin))).toBeCloseTo(cordTop, 3);
  });

  it("seats brain base above spinal cord (over the throat)", () => {
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
    const cordTop = new Box3().setFromObject(cord).max.y;

    expect(brainBox.min.y).toBeGreaterThanOrEqual(cordTop - 0.01);
    expect(brainBox.max.y).toBeLessThanOrEqual(getCranialVaultWorldBounds(atlas)!.max.y + 0.02);
    expect(brainBox.getCenter(new Vector3()).y).toBeGreaterThan(cordTop);
  });

  it("falls back to figure neck junction when atlas bounds are missing", () => {
    const brain = new Group();
    brain.add(new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial()));

    fitAllenBrainToFigure(brain);

    brain.updateMatrixWorld(true);
    const box = new Box3().setFromObject(brain);
    expect(box.min.y).toBeGreaterThan(FIGURE.neckY);
    expect(box.max.y).toBeGreaterThan(FIGURE.headY);
  });
});
