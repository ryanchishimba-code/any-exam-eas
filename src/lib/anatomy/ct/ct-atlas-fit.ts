import type { Mesh, Object3D } from "three";
import { Box3, Plane, Vector3 } from "three";
import { FIGURE } from "@/lib/anatomy/cartoon/proportions";
import type { CtClipPlaneId } from "./ct-atlas-registry";

function atlasBoundingBox(root: Object3D): Box3 {
  root.updateMatrixWorld(true);
  let skinBox: Box3 | null = null;
  root.traverse((node) => {
    const mesh = node as Mesh;
    if (!mesh.isMesh || mesh.userData.atlasOrganId !== "skin") return;
    const box = new Box3().setFromObject(mesh);
    if (!box.isEmpty()) skinBox = box;
  });
  return skinBox ?? new Box3().setFromObject(root);
}

/** Fit Visible Human atlas (shared VH coords) into the FIGURE scene box. */
export function fitVisibleHumanAtlas(root: Object3D) {
  const crownY = FIGURE.headY + FIGURE.headRadius * FIGURE.headScaleY;
  const floorY = FIGURE.footY;
  const targetHeight = crownY - floorY;
  const targetCenterY = (crownY + floorY) / 2;

  const box = atlasBoundingBox(root);
  const size = new Vector3();
  const center = new Vector3();
  box.getSize(size);
  box.getCenter(center);

  const scale = targetHeight / Math.max(size.y, 1e-6);
  root.scale.setScalar(scale);

  root.updateMatrixWorld(true);
  box.setFromObject(root);
  box.getCenter(center);

  root.position.set(-center.x, targetCenterY - center.y, -center.z + FIGURE.centerZ * 0.15);
  root.rotation.y = Math.PI;
}

/** Anatomical center for MPR clip planes (standing figure midline). */
export function getFigureClipCenter(): Vector3 {
  const crownY = FIGURE.headY + FIGURE.headRadius * FIGURE.headScaleY;
  const centerY = (crownY + FIGURE.footY) / 2;
  return new Vector3(0, centerY, FIGURE.centerZ);
}

export type CtClipSliceAxis = "x" | "y" | "z";

/** Anatomical travel range for scrollable MPR slices (normalized −1…1). */
export function getClipSliceRange(clipId: CtClipPlaneId): {
  axis: CtClipSliceAxis;
  min: number;
  max: number;
} | null {
  if (clipId === "off") return null;
  const crownY = FIGURE.headY + FIGURE.headRadius * FIGURE.headScaleY;
  switch (clipId) {
    case "axial":
      return { axis: "y", min: FIGURE.footY, max: crownY };
    case "coronal":
      return { axis: "z", min: FIGURE.centerZ - 0.38, max: FIGURE.centerZ + 0.38 };
    case "sagittal":
      return { axis: "x", min: -FIGURE.shoulderSpan, max: FIGURE.shoulderSpan };
    default:
      return null;
  }
}

/** Map normalized slice offset (−1…1) to world coordinate along the active MPR axis. */
export function sliceOffsetToWorld(clipId: CtClipPlaneId, sliceOffset: number): number | null {
  const range = getClipSliceRange(clipId);
  if (!range) return null;
  const t = Math.max(-1, Math.min(1, sliceOffset));
  const u = (t + 1) / 2;
  return range.min + u * (range.max - range.min);
}

/** Human-readable slice position for the MPR slider (0–100 % through body). */
export function formatCtSliceLabel(clipId: CtClipPlaneId, sliceOffset: number): string {
  const pct = Math.round(((Math.max(-1, Math.min(1, sliceOffset)) + 1) / 2) * 100);
  const plane = CT_CLIP_PLANE_LABELS[clipId] ?? clipId;
  return `${plane} ${pct}%`;
}

const CT_CLIP_PLANE_LABELS: Partial<Record<CtClipPlaneId, string>> = {
  axial: "Axial",
  coronal: "Coronal",
  sagittal: "Sagittal",
};

/** Single half-space clip plane for teaching MPR views; sliceOffset scrolls through the body (−1…1). */
export function createCtClipPlanes(clipId: CtClipPlaneId, sliceOffset = 0): Plane[] {
  if (clipId === "off") return [];
  const range = getClipSliceRange(clipId);
  const center = getFigureClipCenter();
  const point = center.clone();
  if (range) {
    const world = sliceOffsetToWorld(clipId, sliceOffset)!;
    if (range.axis === "x") point.x = world;
    else if (range.axis === "y") point.y = world;
    else point.z = world;
  }
  const plane = new Plane();
  switch (clipId) {
    case "axial":
      plane.setFromNormalAndCoplanarPoint(new Vector3(0, -1, 0), point);
      break;
    case "coronal":
      plane.setFromNormalAndCoplanarPoint(new Vector3(0, 0, -1), point);
      break;
    case "sagittal":
      plane.setFromNormalAndCoplanarPoint(new Vector3(-1, 0, 0), point);
      break;
    default:
      return [];
  }
  return [plane];
}
