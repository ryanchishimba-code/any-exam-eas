import type { Mesh, Object3D } from "three";
import { Box3, Vector3 } from "three";
import { FIGURE, getFigureHeadHeight } from "@/lib/anatomy/cartoon/proportions";

/** Brain fills most of the cranial vault — small inset for skin clearance. */
const CRANIAL_VAULT_PADDING = 0.97;

/** Visual downscale from vault-fit size (0.7 = 30% smaller). */
const BRAIN_DISPLAY_SCALE = 0.7;

function headHalfHeight(): number {
  return FIGURE.headRadius * FIGURE.headScaleY;
}

function headHalfWidth(): number {
  return FIGURE.headRadius * FIGURE.headScaleZ;
}

/** Cranial vault in FIGURE space when VH skin is not loaded. */
function getFigureCranialVaultBox(): Box3 {
  const junctionY = FIGURE.neckY + 0.028;
  const cranialTop = FIGURE.headY + headHalfHeight() * 0.94;
  const halfW = headHalfWidth() * 0.96;
  const halfD = FIGURE.headRadius * 0.9;
  return new Box3(
    new Vector3(-halfW, junctionY, FIGURE.centerZ - halfD),
    new Vector3(halfW, cranialTop, FIGURE.centerZ + halfD)
  );
}

function cranialHeightFraction(): number {
  const crownY = FIGURE.headY + FIGURE.headRadius * FIGURE.headScaleY;
  const standingHeight = crownY - FIGURE.footY;
  return getFigureHeadHeight() / Math.max(standingHeight, 1e-6);
}

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
  const cranialFraction = cranialHeightFraction();
  const minY = bodyBox.max.y - size.y * cranialFraction;
  return new Box3(
    new Vector3(bodyBox.min.x, minY, bodyBox.min.z),
    bodyBox.max.clone()
  );
}

/** Lower bound of cranial vault slice (foramen magnum region). */
function cranialVaultFloorY(bodyBox: Box3): number {
  const size = new Vector3();
  bodyBox.getSize(size);
  return bodyBox.max.y - size.y * cranialHeightFraction();
}

/** Standing figure envelope when VH skin is not loaded (staged atlas). */
function getFigureStandingBodyBox(): Box3 {
  const crownY = FIGURE.headY + FIGURE.headRadius * FIGURE.headScaleY;
  return new Box3(
    new Vector3(-FIGURE.shoulderSpan, FIGURE.footY, FIGURE.centerZ - 0.22),
    new Vector3(FIGURE.shoulderSpan, crownY, FIGURE.centerZ + 0.22)
  );
}

/** Prefer fitted skin; fall back to FIGURE standing bounds so brain fit works without skin. */
export function getReferenceBodyBoxForBrainFit(atlasRoot: Object3D): Box3 {
  const skinBox = atlasOrganBox(atlasRoot, "skin");
  if (skinBox && !skinBox.isEmpty()) return skinBox;
  return getFigureStandingBodyBox();
}

/** Y of craniocervical junction — brainstem sits just above spinal cord / throat. */
export function getCraniocervicalJunctionY(atlasRoot: Object3D, bodyBox: Box3): number {
  const size = new Vector3();
  bodyBox.getSize(size);
  const vaultFloor = cranialVaultFloorY(bodyBox);
  const vaultHeight = bodyBox.max.y - vaultFloor;

  const cordBox = atlasOrganBox(atlasRoot, "spinal-cord");
  if (cordBox) {
    // VH cord mesh often stops short of the vault — keep the brain base inside the cranium.
    const cordJunction = cordBox.max.y;
    const vaultJunction = vaultFloor + vaultHeight * 0.1;
    return Math.max(cordJunction, vaultJunction);
  }

  return vaultFloor + vaultHeight * 0.12;
}

/** Cranial vault envelope from fitted VH skin (preferred) or FIGURE head bounds. */
export function getCranialVaultWorldBounds(atlasRoot: Object3D): Box3 | null {
  atlasRoot.updateMatrixWorld(true);
  const skinBox = atlasOrganBox(atlasRoot, "skin");
  if (skinBox && !skinBox.isEmpty()) {
    return cranialSliceFromBodyBox(skinBox);
  }
  return getFigureCranialVaultBox();
}

/** Fit Allen CCF brain mesh into the FIGURE cranial vault (fallback when atlas skin is absent). */
export function fitAllenBrainToFigure(root: Object3D) {
  const vault = getFigureCranialVaultBox();
  const junctionY = vault.min.y;
  const cranialTop = vault.max.y;
  const vaultSize = new Vector3();
  vault.getSize(vaultSize);
  const cranialSpan = Math.max(vaultSize.x, vaultSize.z);
  const availableHeight = cranialTop - junctionY;

  root.updateMatrixWorld(true);
  const box = new Box3().setFromObject(root);
  const size = new Vector3();
  const center = new Vector3();
  box.getSize(size);
  box.getCenter(center);

  const scaleByWidth = cranialSpan / Math.max(size.x, size.y, size.z, 1e-6);
  const scaleByHeight = (availableHeight * CRANIAL_VAULT_PADDING) / Math.max(size.y, 1e-6);
  const scale = Math.min(scaleByWidth, scaleByHeight) * BRAIN_DISPLAY_SCALE;
  root.scale.setScalar(scale);

  root.rotation.set(0, Math.PI, 0);
  root.updateMatrixWorld(true);
  box.setFromObject(root);
  box.getCenter(center);

  const targetBrainCenterY = junctionY + availableHeight * 0.58;
  const headCenter = new Vector3(0, targetBrainCenterY, FIGURE.centerZ + 0.01);
  root.position.set(headCenter.x - center.x, headCenter.y - center.y, headCenter.z - center.z);
}

/**
 * Register Allen brain above the throat/neck — brainstem on spinal cord, bulk in cranial vault.
 * Call after fitVisibleHumanAtlas.
 */
export function fitAllenBrainToAtlas(atlasRoot: Object3D, brainRoot: Object3D) {
  const targetBox = getCranialVaultWorldBounds(atlasRoot);
  if (!targetBox || targetBox.isEmpty()) {
    fitAllenBrainToFigure(brainRoot);
    return;
  }

  const skinBox = atlasOrganBox(atlasRoot, "skin");
  const usingFigureVault = !skinBox || skinBox.isEmpty();
  const bodyBox = skinBox && !skinBox.isEmpty() ? skinBox : getFigureStandingBodyBox();
  const junctionY = usingFigureVault
    ? getFigureCranialVaultBox().min.y
    : getCraniocervicalJunctionY(atlasRoot, bodyBox);
  const cranialTop = targetBox.max.y;

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

  const availableHeight = Math.max(cranialTop - junctionY, 1e-6);
  const scaleH = (availableHeight * CRANIAL_VAULT_PADDING) / Math.max(brainSize.y, 1e-6);
  const scaleW = (targetSize.x * CRANIAL_VAULT_PADDING) / Math.max(brainSize.x, 1e-6);
  const scaleD = (targetSize.z * CRANIAL_VAULT_PADDING) / Math.max(brainSize.z, 1e-6);
  brainRoot.scale.setScalar(Math.min(scaleH, scaleW, scaleD) * BRAIN_DISPLAY_SCALE);
  brainRoot.rotation.set(0, Math.PI, 0);
  brainRoot.updateMatrixWorld(true);

  brainRoot.updateMatrixWorld(true);
  const scaledBox = new Box3().setFromObject(brainRoot);
  const scaledCenter = new Vector3();
  scaledBox.getCenter(scaledCenter);

  const vaultHeight = Math.max(cranialTop - junctionY, 1e-6);
  const targetBrainCenterY = junctionY + vaultHeight * 0.58;

  const worldPos = new Vector3(
    targetCenter.x - scaledCenter.x,
    targetBrainCenterY - scaledCenter.y,
    targetCenter.z - scaledCenter.z
  );

  if (brainRoot.parent) {
    brainRoot.parent.updateMatrixWorld(true);
    brainRoot.parent.worldToLocal(worldPos);
  }
  brainRoot.position.copy(worldPos);
}
