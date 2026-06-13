import type { Mesh, Object3D } from "three";
import { Box3, Plane, Vector3 } from "three";
import { FIGURE } from "@/lib/anatomy/cartoon/proportions";
import type { CtClipPlaneId } from "./ct-atlas-registry";

/** HuBMAP organs that define the thoracic cavity envelope for rib-cage overlay. */
export const THORACIC_ATLAS_ORGAN_IDS = new Set(["lungs", "heart", "thymus"]);

/** Rib cage should sit slightly outside the lung/heart bbox after VH atlas fit. */
const THORAX_OVERLAY_PADDING = { x: 1.12, y: 1.06, z: 1.08 } as const;

/** Fit Visible Human atlas (shared VH coords) into the FIGURE scene box. */
export function fitVisibleHumanAtlas(root: Object3D) {
  const crownY = FIGURE.headY + FIGURE.headRadius * FIGURE.headScaleY;
  const floorY = FIGURE.footY;
  const targetHeight = crownY - floorY;
  const targetCenterY = (crownY + floorY) / 2;

  root.updateMatrixWorld(true);
  const box = new Box3().setFromObject(root);
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

/** World-space bbox of fitted thoracic atlas organs (lungs, heart, thymus). */
export function getThoracicOrganWorldBounds(atlasRoot: Object3D): Box3 | null {
  atlasRoot.updateMatrixWorld(true);
  const box = new Box3();
  let found = false;
  atlasRoot.traverse((node) => {
    const mesh = node as Mesh;
    if (!mesh.isMesh) return;
    const organId = mesh.userData.atlasOrganId as string | undefined;
    if (!organId || !THORACIC_ATLAS_ORGAN_IDS.has(organId)) return;
    const meshBox = new Box3().setFromObject(mesh);
    if (!meshBox.isEmpty()) {
      box.union(meshBox);
      found = true;
    }
  });
  return found ? box : null;
}

/**
 * Scale and position procedural thorax (figure-space ribs/sternum) to overlay fitted VH organs.
 * Call after fitVisibleHumanAtlas on the atlas root.
 */
export function fitProceduralThoraxToAtlas(atlasRoot: Object3D, thoraxRoot: Object3D) {
  const targetBox = getThoracicOrganWorldBounds(atlasRoot);

  thoraxRoot.scale.set(1, 1, 1);
  thoraxRoot.rotation.set(0, Math.PI, 0);
  thoraxRoot.position.set(0, 0, 0);
  thoraxRoot.updateMatrixWorld(true);

  if (!targetBox || targetBox.isEmpty()) {
    thoraxRoot.scale.copy(atlasRoot.scale);
    thoraxRoot.rotation.copy(atlasRoot.rotation);
    thoraxRoot.position.copy(atlasRoot.position);
    return;
  }

  const thoraxBox = new Box3().setFromObject(thoraxRoot);
  const targetSize = new Vector3();
  const targetCenter = new Vector3();
  const thoraxSize = new Vector3();
  targetBox.getSize(targetSize);
  targetBox.getCenter(targetCenter);
  thoraxBox.getSize(thoraxSize);

  const scaleX = (targetSize.x * THORAX_OVERLAY_PADDING.x) / Math.max(thoraxSize.x, 1e-6);
  const scaleY = (targetSize.y * THORAX_OVERLAY_PADDING.y) / Math.max(thoraxSize.y, 1e-6);
  const scaleZ = (targetSize.z * THORAX_OVERLAY_PADDING.z) / Math.max(thoraxSize.z, 1e-6);
  thoraxRoot.scale.set(scaleX, scaleY, scaleZ);
  thoraxRoot.updateMatrixWorld(true);

  const scaledBox = new Box3().setFromObject(thoraxRoot);
  const scaledCenter = new Vector3();
  scaledBox.getCenter(scaledCenter);
  thoraxRoot.position.set(
    targetCenter.x - scaledCenter.x,
    targetCenter.y - scaledCenter.y,
    targetCenter.z - scaledCenter.z
  );
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
