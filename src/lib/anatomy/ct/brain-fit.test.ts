import { describe, expect, it } from "vitest";
import { Box3, BoxGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { FIGURE } from "@/lib/anatomy/cartoon/proportions";
import {
  fitAllenBrainToAtlas,
  fitAllenBrainToFigure,
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

  it("aligns Allen brain center to cranial vault after atlas fit", () => {
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
    const brainCenter = new Vector3();
    const vaultCenter = new Vector3();
    new Box3().setFromObject(brain).getCenter(brainCenter);
    getCranialVaultWorldBounds(atlas)!.getCenter(vaultCenter);

    expect(brainCenter.x).toBeCloseTo(vaultCenter.x, 2);
    expect(brainCenter.y).toBeCloseTo(vaultCenter.y, 2);
    expect(brainCenter.z).toBeCloseTo(vaultCenter.z, 2);
  });

  it("falls back to figure head anchors when atlas bounds are missing", () => {
    const brain = new Group();
    brain.add(new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial()));

    fitAllenBrainToFigure(brain);

    brain.updateMatrixWorld(true);
    const center = new Vector3();
    new Box3().setFromObject(brain).getCenter(center);
    expect(center.y).toBeCloseTo(FIGURE.headY - 0.05, 1);
  });
});
