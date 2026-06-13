import type { Mesh, Object3D } from "three";
import { Box3, Vector3 } from "three";
import { FIGURE } from "@/lib/anatomy/cartoon/proportions";

/** Crown-to-foramen region as a fraction of fitted standing height. */
const CRANIAL_HEIGHT_FRACTION = 0.115;

/** Brain mesh should sit slightly inside the skin cranial vault. */
const CRANIAL_VAULT_PADDING = 0.9;

function atlasOrganBox(root: Object3D, organId: string): Box3 | null {
  let found: Box3 | null = null;
  root.traverse((node) => {
    const mesh = node as Mesh;
    if (!mesh.isMesh) return;
    if (mesh.userData.atlasOrganId !== organId) return;
    const box = new Box3().setFromObject(mesh);
    if (!box.isEmpty()) found = box;
  });
  return found;
}

function cranialSliceFromBodyBox(bodyBox: Box3): Box3 {
  const size = new Vector3();
  bodyBox.getSize(size);
  const minY = bodyBox.max.y - size.y * CRANIAL_HEIGHT_FRACTION;
  return new Box3(
    new Vector3(bodyBox.min.x, minY, bodyBox.min.z),
    bodyBox.max.clone()
  );
}

/** Cranial vault envelope from fitted VH skin (preferred) or full atlas bbox. */
export function getCranialVaultWorldBounds(atlasRoot: Object3D): Box3 | null {
  atlasRoot.updateMatrixWorld(true);

  const skinBox = atlasOrganBox(atlasRoot, "skin");
  const cordBox = atlasOrganBox(atlasRoot, "spinal-cord");
  const bodyBox = skinBox ?? new Box3().setFromObject(atlasRoot);
  if (bodyBox.isEmpty()) return null;

  const cranial = cranialSliceFromBodyBox(bodyBox);
  if (cordBox) {
    cranial.min.y = Math.min(cranial.min.y, cordBox.max.y - bodyBox.getSize(new Vector3()).y * 0.02);
  }

  return cranial;
}

/** Fit Allen CCF brain mesh into the FIGURE cranial vault (fallback when atlas skin is absent). */
export function fitAllenBrainToFigure(root: Object3D) {
  const headCenter = new Vector3(0, FIGURE.headY - 0.05, FIGURE.centerZ + 0.01);
  const cranialSpan =
    Math.max(FIGURE.headRadius * 2 * FIGURE.headScaleZ, FIGURE.headRadius * 2 * FIGURE.headScaleY) * 0.94;

  root.updateMatrixWorld(true);
  const box = new Box3().setFromObject(root);
  const size = new Vector3();
  const center = new Vector3();
  box.getSize(size);
  box.getCenter(center);

  const scale = cranialSpan / Math.max(size.x, size.y, size.z, 1e-6);
  root.scale.setScalar(scale);

  root.updateMatrixWorld(true);
  box.setFromObject(root);
  box.getCenter(center);

  root.position.set(headCenter.x - center.x, headCenter.y - center.y, headCenter.z - center.z);
  root.rotation.set(0, Math.PI, 0);
}

/**
 * Register Allen brain to the fitted Visible Human body (call after fitVisibleHumanAtlas).
 */
export function fitAllenBrainToAtlas(atlasRoot: Object3D, brainRoot: Object3D) {
  const targetBox = getCranialVaultWorldBounds(atlasRoot);
  if (!targetBox || targetBox.isEmpty()) {
    fitAllenBrainToFigure(brainRoot);
    return;
  }

  brainRoot.scale.set(1, 1, 1);
  brainRoot.rotation.set(0, 0, 0);
  brainRoot.position.set(0, 0, 0);
  brainRoot.updateMatrixWorld(true);

  const brainBox = new Box3().setFromObject(brainRoot);
  const targetSize = new Vector3();
  const targetCenter = new Vector3();
  const brainSize = new Vector3();
  targetBox.getSize(targetSize);
  targetBox.getCenter(targetCenter);
  brainBox.getSize(brainSize);

  const sx = (targetSize.x * CRANIAL_VAULT_PADDING) / Math.max(brainSize.x, 1e-6);
  const sy = (targetSize.y * CRANIAL_VAULT_PADDING) / Math.max(brainSize.y, 1e-6);
  const sz = (targetSize.z * CRANIAL_VAULT_PADDING) / Math.max(brainSize.z, 1e-6);
  brainRoot.scale.setScalar(Math.min(sx, sy, sz));
  brainRoot.rotation.set(0, Math.PI, 0);
  brainRoot.updateMatrixWorld(true);

  const scaledBox = new Box3().setFromObject(brainRoot);
  const scaledCenter = new Vector3();
  scaledBox.getCenter(scaledCenter);
  brainRoot.position.set(
    targetCenter.x - scaledCenter.x,
    targetCenter.y - scaledCenter.y,
    targetCenter.z - scaledCenter.z
  );
}
