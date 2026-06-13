import type { Object3D } from "three";
import { Box3, Vector3 } from "three";
import { FIGURE } from "@/lib/anatomy/cartoon/proportions";

/** Fit Allen CCF brain mesh into the FIGURE cranial vault (independent of VH atlas rig). */
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
