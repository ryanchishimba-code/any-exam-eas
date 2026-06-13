/**
 * Procedural skeletal meshes — skull vault, rib cage, sternum, spine, limbs.
 * Shared by structural bone layer and catalog skull module alignment.
 */

import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { FIGURE } from "./proportions";
import {
  buildArmBones,
  buildLegBones,
  buildPelvisParts,
  buildSacrumBoneParts,
  buildSingleScapulaParts,
} from "./bone-geometry";
import { buildSkullParts } from "./skull-geometry";

export { buildSacrumBoneParts } from "./bone-geometry";

type Figure = typeof FIGURE;

export type RibBuildOpts = {
  /** CT bone window — omit costal cartilage, higher segment count, flattened shaft. */
  ctFidelity?: boolean;
};

function spineSpan(f: Figure) {
  const spineBase = f.hipY + 0.1;
  const spineTop = f.shoulderY + 0.04;
  return { spineBase, spineTop, spineH: spineTop - spineBase };
}

/** Y center for thoracic vertebra (ribIndex 0 = T1 … 11 = T12) — matches vertebral catalog. */
export function thoracicVertebraY(f: Figure, ribIndex: number): number {
  const { spineBase, spineH } = spineSpan(f);
  const t = 0.62 - (ribIndex / 12) * 0.18;
  return spineBase + spineH * t;
}

/** Lateral half-width of rib arc — short upper ribs, peak at 4–6, taper lower false ribs. */
export function ribLateralReach(ribIndex: number): number {
  if (ribIndex === 0) return 0.21;
  if (ribIndex <= 6) return 0.21 + ribIndex * 0.019;
  return 0.34 - (ribIndex - 6) * 0.021;
}

function bezierTube(
  p0: THREE.Vector3,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  radius: number,
  segments = 14,
  radialSegments = 8
) {
  const curve = new THREE.QuadraticBezierCurve3(p0, p1, p2);
  return new THREE.TubeGeometry(curve, segments, radius, radialSegments, false);
}

function catmullRomTube(
  points: THREE.Vector3[],
  radius: number,
  segments = 24,
  radialSegments = 8
) {
  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.38);
  return new THREE.TubeGeometry(curve, segments, radius, radialSegments, false);
}

/** Flatten tube in anteroposterior (Z) — CT ribs appear thin on axial slices. */
function flattenRibShaft(geo: THREE.BufferGeometry, apScale = 0.48): THREE.BufferGeometry {
  geo.applyMatrix4(new THREE.Matrix4().makeScale(1, 0.92, apScale));
  return geo;
}

/** Rib pair control points — posterior spine → lateral flare → anterior sternal/costal end. */
export function ribPathPoints(
  ribIndex: number,
  sx: -1 | 1,
  f: Figure,
  z: number
): { bone: THREE.Vector3[]; cartilageEnd?: THREE.Vector3; sternalY: number } {
  const level = ribIndex + 1;
  const postY = thoracicVertebraY(f, ribIndex);
  const spineZ = z - 0.112 - ribIndex * 0.0015;
  const lateralReach = ribLateralReach(ribIndex);
  const anteriorDrop = 0.028 + ribIndex * 0.009;
  const sternalY = postY - 0.018 - ribIndex * 0.004;

  const p0 = new THREE.Vector3(0, postY + 0.006, spineZ);
  const p1 = new THREE.Vector3(sx * lateralReach * 0.26, postY + 0.002, spineZ + 0.032);
  const p2 = new THREE.Vector3(sx * lateralReach, postY - anteriorDrop * 0.32, z + 0.032);
  const p3 = new THREE.Vector3(
    sx * lateralReach * 0.58,
    postY - anteriorDrop * 0.62,
    z + 0.078 + ribIndex * 0.0015
  );

  if (level <= 7) {
    const boneEnd = new THREE.Vector3(sx * 0.036, sternalY, z + 0.102);
    const cartilageEnd = new THREE.Vector3(0, sternalY - 0.003, z + 0.106);
    return { bone: [p0, p1, p2, p3, boneEnd], cartilageEnd, sternalY };
  }

  if (level <= 10) {
    const medial = sx * Math.max(0.038, 0.1 - (level - 7) * 0.016);
    const boneEnd = new THREE.Vector3(medial, postY - anteriorDrop * 0.78, z + 0.056);
    return { bone: [p0, p1, p2, p3, boneEnd], sternalY };
  }

  const boneEnd = new THREE.Vector3(sx * lateralReach * 0.42, postY - anteriorDrop * 0.38, z + 0.022);
  return { bone: [p0, p1, p2, p3, boneEnd], sternalY };
}

export function ribShaftRadius(ribIndex: number): number {
  const base = 0.011 - ribIndex * 0.00035;
  return Math.max(0.0065, base);
}

/** S-shaped clavicle — sternal end at manubrium, acromial end at shoulder. */
export function claviclePathPoints(sx: -1 | 1, f: Figure, z: number): THREE.Vector3[] {
  const notchY = thoracicVertebraY(f, 0) + 0.028;
  const medial = new THREE.Vector3(sx * 0.024, notchY, z + 0.098);
  const midAnterior = new THREE.Vector3(sx * 0.1, notchY + 0.018, z + 0.092);
  const midPosterior = new THREE.Vector3(sx * 0.2, notchY - 0.022, z + 0.072);
  const lateral = new THREE.Vector3(sx * (f.shoulderSpan - 0.012), f.shoulderY - 0.01, z + 0.032);
  return [medial, midAnterior, midPosterior, lateral];
}

export function buildClavicleParts(f: Figure, z: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  for (const sx of [-1, 1] as const) {
    parts.push(...buildSingleClavicleParts(sx, f, z));
  }
  return parts;
}

export function buildSingleRibParts(
  ribIndex: number,
  sx: -1 | 1,
  f: Figure,
  z: number,
  opts?: RibBuildOpts
): THREE.BufferGeometry[] {
  const { bone, cartilageEnd } = ribPathPoints(ribIndex, sx, f, z);
  const shaftR = ribShaftRadius(ribIndex);
  const segments = opts?.ctFidelity ? 32 : 24;
  const radial = opts?.ctFidelity ? 10 : 8;
  const shaft = flattenRibShaft(catmullRomTube(bone, shaftR, segments, radial), opts?.ctFidelity ? 0.44 : 0.52);
  const parts: THREE.BufferGeometry[] = [shaft];

  const head = new THREE.SphereGeometry(shaftR * 1.5, opts?.ctFidelity ? 10 : 8, opts?.ctFidelity ? 10 : 8);
  head.scale(1.08, 0.78, 0.68);
  head.translate(bone[0]!.x, bone[0]!.y, bone[0]!.z);
  parts.push(head);

  if (cartilageEnd && !opts?.ctFidelity) {
    const boneEnd = bone[bone.length - 1]!;
    const cartMid = new THREE.Vector3(
      (boneEnd.x + cartilageEnd.x) * 0.5,
      boneEnd.y - 0.006,
      (boneEnd.z + cartilageEnd.z) * 0.5
    );
    parts.push(bezierTube(boneEnd, cartMid, cartilageEnd, shaftR * 0.72, 10, 6));
  }
  return parts;
}

export function buildSingleClavicleParts(
  sx: -1 | 1,
  f: Figure,
  z: number,
  opts?: RibBuildOpts
): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const path = claviclePathPoints(sx, f, z);
  const segments = opts?.ctFidelity ? 24 : 18;
  const radial = opts?.ctFidelity ? 10 : 8;
  parts.push(catmullRomTube(path, 0.0115, segments, radial));

  const medial = path[0]!;
  const medialFlare = new THREE.SphereGeometry(0.018, opts?.ctFidelity ? 10 : 8, opts?.ctFidelity ? 10 : 8);
  medialFlare.scale(1.12, 0.68, 0.62);
  medialFlare.translate(medial.x, medial.y, medial.z);
  parts.push(medialFlare);

  const lateral = path[path.length - 1]!;
  const acromial = new THREE.SphereGeometry(0.015, opts?.ctFidelity ? 10 : 8, opts?.ctFidelity ? 10 : 8);
  acromial.scale(1.2, 0.58, 0.68);
  acromial.translate(lateral.x, lateral.y, lateral.z);
  parts.push(acromial);

  return parts;
}

export function sternumAnchorY(f: Figure): { manubrium: number; body: number; xiphoid: number } {
  const t1 = thoracicVertebraY(f, 0);
  const t4 = thoracicVertebraY(f, 3);
  const t10 = thoracicVertebraY(f, 9);
  return {
    manubrium: (t1 + t4) * 0.5 + 0.012,
    body: (t4 + t10) * 0.5 - 0.038,
    xiphoid: t10 - 0.072,
  };
}

export function buildSternumBoneParts(f: Figure, z: number, opts?: RibBuildOpts): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const { manubrium: manY, body: bodyY, xiphoid: xiphY } = sternumAnchorY(f);
  const apDepth = opts?.ctFidelity ? 0.026 : 0.03;

  const manubrium = new THREE.BoxGeometry(0.056, 0.088, apDepth);
  manubrium.translate(0, manY, z + 0.102);
  parts.push(manubrium);

  for (const wingX of [-0.038, 0.038] as const) {
    const wing = new THREE.BoxGeometry(0.03, 0.036, 0.02);
    wing.rotateZ(wingX < 0 ? 0.32 : -0.32);
    wing.translate(wingX, manY + 0.018, z + 0.1);
    parts.push(wing);
  }

  const bodyH = manY - bodyY - 0.04;
  const sternalBody = new THREE.BoxGeometry(0.042, bodyH, apDepth * 0.82);
  sternalBody.translate(0, bodyY, z + 0.098);
  parts.push(sternalBody);

  const sternalKeel = new THREE.BoxGeometry(0.016, bodyH * 0.88, apDepth * 1.22);
  sternalKeel.translate(0, bodyY, z + 0.11);
  parts.push(sternalKeel);

  const xiphoid = new THREE.BoxGeometry(0.028, 0.048, apDepth * 0.72);
  xiphoid.translate(0, xiphY, z + 0.094);
  parts.push(xiphoid);

  return parts;
}

export function buildVertebraBoneParts(
  centerY: number,
  centerZ: number,
  bodyHeight: number,
  taper: number,
  thoracic: boolean,
  spinous: boolean
): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const body = new THREE.CylinderGeometry(0.026 * taper, 0.028 * taper, bodyHeight, 10);
  body.translate(0, centerY, centerZ);
  parts.push(body);

  if (thoracic) {
    const transverse = new THREE.BoxGeometry(0.1, 0.008, 0.016);
    transverse.translate(0, centerY + bodyHeight * 0.08, centerZ + 0.018);
    parts.push(transverse);
  }

  if (spinous) {
    const spinous = new THREE.BoxGeometry(0.01, 0.038, 0.018);
    spinous.translate(0, centerY, centerZ - 0.018);
    parts.push(spinous);
  }

  return parts;
}

/** 12 paired ribs — optional costal cartilage; sternum omitted (use buildRibCageParts). */
export function buildRibOnlyParts(f: Figure, z: number, opts?: RibBuildOpts): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 12; i++) {
    for (const sx of [-1, 1] as const) {
      parts.push(...buildSingleRibParts(i, sx, f, z, opts));
    }
  }
  return parts;
}

/** 12 paired ribs + costal cartilage + sternum. */
export function buildRibCageParts(f: Figure, z: number, opts?: RibBuildOpts): THREE.BufferGeometry[] {
  return [...buildRibOnlyParts(f, z, opts), ...buildSternumBoneParts(f, z, opts)];
}

/** Vertebrae stack + pelvis + limb bones — joints align to pelvis and extremities. */
export function buildAxialAppendicularParts(f: Figure, z: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const vertCount = 18;
  const spineBase = f.hipY + 0.1;
  const spineTop = f.shoulderY + 0.04;
  const spineStep = (spineTop - spineBase) / vertCount;

  for (let i = 0; i < vertCount; i++) {
    const vy = spineBase + i * spineStep;
    const taper = 1 - (i / vertCount) * 0.12;
    const body = new THREE.CylinderGeometry(0.026 * taper, 0.028 * taper, spineStep * 0.84, 10);
    body.translate(0, vy, z - 0.1 - i * 0.0015);
    parts.push(body);

    if (i % 3 === 0) {
      const spinous = new THREE.BoxGeometry(0.011, 0.038, 0.02);
      spinous.translate(0, vy, z - 0.118 - i * 0.0015);
      parts.push(spinous);
    }
  }

  parts.push(...buildPelvisParts(f, z));

  for (const sx of [-1, 1] as const) {
    parts.push(...buildSingleScapulaParts(sx, f, z));
  }

  for (const sx of [-1, 1] as const) {
    parts.push(...buildArmBones(sx, f, z));
    parts.push(...buildLegBones(sx, f, z));
  }

  return parts;
}

export function buildFullBoneGeometry(f: Figure): THREE.BufferGeometry | null {
  const z = f.centerZ;
  const parts = [
    ...buildSkullParts(f, z),
    ...buildClavicleParts(f, z),
    ...buildRibCageParts(f, z),
    ...buildAxialAppendicularParts(f, z),
  ];
  const merged = mergeGeometries(parts, false);
  if (merged) merged.computeVertexNormals();
  return merged;
}
