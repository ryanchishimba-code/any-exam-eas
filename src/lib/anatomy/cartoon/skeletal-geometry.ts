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
} from "./bone-geometry";
import { buildSkullParts } from "./skull-geometry";

export { buildSkullParts } from "./skull-geometry";

type Figure = typeof FIGURE;

function bezierTube(
  p0: THREE.Vector3,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  radius: number,
  segments = 14
) {
  const curve = new THREE.QuadraticBezierCurve3(p0, p1, p2);
  return new THREE.TubeGeometry(curve, segments, radius, 8, false);
}

function catmullRomTube(points: THREE.Vector3[], radius: number, segments = 24) {
  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.42);
  return new THREE.TubeGeometry(curve, segments, radius, 8, false);
}

/** Rib pair control points — posterior spine → lateral flare → anterior sternal/costal end. */
function ribPathPoints(
  ribIndex: number,
  sx: -1 | 1,
  f: Figure,
  z: number
): { bone: THREE.Vector3[]; cartilageEnd?: THREE.Vector3; sternalY: number } {
  const level = ribIndex + 1;
  const ribY = f.chestY + 0.21 - ribIndex * 0.062;
  const spineZ = z - 0.115 - ribIndex * 0.0025;
  const lateralReach = 0.26 - ribIndex * 0.009;
  const anteriorDrop = 0.06 + ribIndex * 0.014;

  const p0 = new THREE.Vector3(0, ribY + 0.012, spineZ);
  const p1 = new THREE.Vector3(sx * lateralReach * 0.32, ribY + 0.004, spineZ + 0.038);
  const p2 = new THREE.Vector3(sx * lateralReach, ribY - anteriorDrop * 0.28, z + 0.028 + ribIndex * 0.002);
  const p3 = new THREE.Vector3(sx * lateralReach * 0.62, ribY - anteriorDrop * 0.58, z + 0.072);

  const sternalY = f.chestY + 0.2 - ribIndex * 0.036;

  if (level <= 7) {
    const boneEnd = new THREE.Vector3(sx * 0.038, sternalY, z + 0.1);
    const cartilageEnd = new THREE.Vector3(0, sternalY - 0.004, z + 0.104);
    return { bone: [p0, p1, p2, p3, boneEnd], cartilageEnd, sternalY };
  }

  if (level <= 10) {
    const medial = sx * Math.max(0.04, 0.11 - (level - 7) * 0.018);
    const boneEnd = new THREE.Vector3(medial, ribY - anteriorDrop * 0.72, z + 0.058);
    return { bone: [p0, p1, p2, p3, boneEnd], sternalY };
  }

  const boneEnd = new THREE.Vector3(sx * lateralReach * 0.46, ribY - anteriorDrop * 0.35, z + 0.018);
  return { bone: [p0, p1, p2, p3, boneEnd], sternalY };
}

function ribShaftRadius(ribIndex: number): number {
  return 0.0125 - ribIndex * 0.00045;
}

/** S-shaped clavicle — sternal end anterior, acromial end at shoulder. */
function claviclePathPoints(sx: -1 | 1, f: Figure, z: number): THREE.Vector3[] {
  const medial = new THREE.Vector3(sx * 0.022, f.shoulderY + 0.055, z + 0.1);
  const midAnterior = new THREE.Vector3(sx * 0.11, f.shoulderY + 0.078, z + 0.094);
  const midPosterior = new THREE.Vector3(sx * 0.22, f.shoulderY + 0.028, z + 0.072);
  const lateral = new THREE.Vector3(sx * (f.shoulderSpan - 0.015), f.shoulderY + 0.05, z + 0.028);
  return [medial, midAnterior, midPosterior, lateral];
}

export function buildClavicleParts(f: Figure, z: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];

  for (const sx of [-1, 1] as const) {
    const path = claviclePathPoints(sx, f, z);
    parts.push(catmullRomTube(path, 0.013, 18));

    const medial = path[0]!;
    const medialFlare = new THREE.SphereGeometry(0.02, 10, 10);
    medialFlare.scale(1.15, 0.72, 0.68);
    medialFlare.translate(medial.x, medial.y, medial.z);
    parts.push(medialFlare);

    const lateral = path[path.length - 1]!;
    const acromial = new THREE.SphereGeometry(0.017, 10, 10);
    acromial.scale(1.25, 0.62, 0.72);
    acromial.translate(lateral.x, lateral.y, lateral.z);
    parts.push(acromial);
  }

  return parts;
}

/** 12 paired ribs + costal cartilage + sternum. */
export function buildRibCageParts(f: Figure, z: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const ribCount = 12;

  for (let i = 0; i < ribCount; i++) {
    const shaftR = ribShaftRadius(i);

    for (const sx of [-1, 1] as const) {
      const { bone, cartilageEnd } = ribPathPoints(i, sx, f, z);
      parts.push(catmullRomTube(bone, shaftR));

      if (cartilageEnd) {
        const boneEnd = bone[bone.length - 1]!;
        const cartMid = new THREE.Vector3(
          (boneEnd.x + cartilageEnd.x) * 0.5,
          boneEnd.y - 0.008,
          (boneEnd.z + cartilageEnd.z) * 0.5
        );
        parts.push(bezierTube(boneEnd, cartMid, cartilageEnd, shaftR * 0.78, 10));
      }
    }
  }

  const costalArch = new THREE.TorusGeometry(0.2, 0.007, 6, 32, Math.PI * 0.92);
  costalArch.rotateX(Math.PI / 2);
  costalArch.rotateZ(0.06);
  costalArch.translate(0, f.chestY - 0.1, z + 0.04);
  parts.push(costalArch);

  const manubrium = new THREE.BoxGeometry(0.058, 0.11, 0.03);
  manubrium.translate(0, f.chestY + 0.23, z + 0.102);
  parts.push(manubrium);

  const manubriumWingL = new THREE.BoxGeometry(0.032, 0.04, 0.022);
  manubriumWingL.rotateZ(0.35);
  manubriumWingL.translate(-0.04, f.chestY + 0.24, z + 0.1);
  parts.push(manubriumWingL);
  const manubriumWingR = new THREE.BoxGeometry(0.032, 0.04, 0.022);
  manubriumWingR.rotateZ(-0.35);
  manubriumWingR.translate(0.04, f.chestY + 0.24, z + 0.1);
  parts.push(manubriumWingR);

  const sternalBody = new THREE.BoxGeometry(0.044, 0.24, 0.024);
  sternalBody.translate(0, f.chestY + 0.05, z + 0.098);
  parts.push(sternalBody);

  const sternalKeel = new THREE.BoxGeometry(0.018, 0.2, 0.038);
  sternalKeel.translate(0, f.chestY + 0.05, z + 0.112);
  parts.push(sternalKeel);

  const xiphoid = new THREE.BoxGeometry(0.03, 0.055, 0.02);
  xiphoid.translate(0, f.chestY - 0.085, z + 0.094);
  parts.push(xiphoid);

  return parts;
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
    const scap = new THREE.BoxGeometry(0.09, 0.13, 0.022);
    scap.rotateY(sx * 0.32);
    scap.translate(sx * 0.24, f.chestY + 0.04, z - 0.085);
    parts.push(scap);
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
