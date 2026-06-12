/**
 * Procedural human skull — calvaria, orbits, nasal aperture, zygomatic arches, mandible.
 * Built in catalog space (radius ≈ 0.8) to align with HumanFaceFeatures orbit positions.
 */

import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { FIGURE } from "./proportions";

/** Reference radius — matches OrganVisual skull + HumanFaceFeatures (eyes at ±0.34). */
export const CATALOG_SKULL_RADIUS = 0.8;

type Figure = typeof FIGURE;

function catmullRomTube(points: THREE.Vector3[], radius: number, segments = 20) {
  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.38);
  return new THREE.TubeGeometry(curve, segments, radius, 8, false);
}

function orbitRim(sx: -1 | 1, r: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const ox = sx * r * 0.375;
  const oy = r * 0.075;
  const oz = r * 0.55;

  const sup = new THREE.CapsuleGeometry(r * 0.012, r * 0.34, 4, 12);
  sup.rotateZ(Math.PI / 2);
  sup.translate(ox, oy + r * 0.14, oz);
  parts.push(sup);

  const inf = new THREE.CapsuleGeometry(r * 0.01, r * 0.28, 4, 10);
  inf.rotateZ(Math.PI / 2);
  inf.translate(ox, oy - r * 0.12, oz + r * 0.02);
  parts.push(inf);

  const lat = new THREE.CapsuleGeometry(r * 0.009, r * 0.22, 4, 10);
  lat.rotateX(0.35);
  lat.translate(ox + sx * r * 0.15, oy, oz);
  parts.push(lat);

  const med = new THREE.CapsuleGeometry(r * 0.008, r * 0.18, 4, 10);
  med.rotateX(0.28);
  med.translate(ox - sx * r * 0.11, oy + r * 0.02, oz + r * 0.02);
  parts.push(med);

  const floor = new THREE.BoxGeometry(r * 0.32, r * 0.018, r * 0.12);
  floor.translate(ox, oy - r * 0.08, oz - r * 0.04);
  parts.push(floor);

  return parts;
}

function buildMandible(r: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const chinZ = r * 0.48;
  const chinY = -r * 0.72;

  const leftAngle = new THREE.Vector3(-r * 0.52, -r * 0.58, r * 0.38);
  const chin = new THREE.Vector3(0, chinY, chinZ);
  const rightAngle = new THREE.Vector3(r * 0.52, -r * 0.58, r * 0.38);

  parts.push(catmullRomTube([leftAngle, new THREE.Vector3(-r * 0.28, chinY + r * 0.04, chinZ), chin, new THREE.Vector3(r * 0.28, chinY + r * 0.04, chinZ), rightAngle], r * 0.022, 22));

  for (const sx of [-1, 1] as const) {
    const condyle = new THREE.Vector3(sx * r * 0.44, -r * 0.32, r * 0.18);
    const gonion = new THREE.Vector3(sx * r * 0.52, -r * 0.58, r * 0.38);
    const coronoid = new THREE.Vector3(sx * r * 0.38, -r * 0.08, r * 0.32);

    parts.push(catmullRomTube([gonion, new THREE.Vector3(sx * r * 0.48, -r * 0.42, r * 0.28), condyle], r * 0.018, 14));

    const ramus = new THREE.CapsuleGeometry(r * 0.016, r * 0.38, 4, 10);
    ramus.translate(condyle.x * 0.92 + gonion.x * 0.08, (condyle.y + gonion.y) * 0.5, (condyle.z + gonion.z) * 0.5);
    parts.push(ramus);

    const condyleHead = new THREE.SphereGeometry(r * 0.035, 12, 12);
    condyleHead.scale(0.95, 0.72, 0.82);
    condyleHead.translate(condyle.x, condyle.y, condyle.z);
    parts.push(condyleHead);

    const coronoidProc = new THREE.CapsuleGeometry(r * 0.012, r * 0.12, 4, 8);
    coronoidProc.translate(coronoid.x, coronoid.y, coronoid.z);
    parts.push(coronoidProc);
  }

  const symphysis = new THREE.SphereGeometry(r * 0.055, 14, 14);
  symphysis.scale(1.1, 0.52, 0.75);
  symphysis.translate(0, chinY, chinZ);
  parts.push(symphysis);

  const alveolar = new THREE.BoxGeometry(r * 0.72, r * 0.035, r * 0.08);
  alveolar.translate(0, chinY + r * 0.08, chinZ - r * 0.04);
  parts.push(alveolar);

  return parts;
}

function buildZygomaticArch(sx: -1 | 1, r: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const temporal = new THREE.Vector3(sx * r * 0.78, -r * 0.02, -r * 0.02);
  const archPeak = new THREE.Vector3(sx * r * 0.72, -r * 0.14, r * 0.28);
  const zygoma = new THREE.Vector3(sx * r * 0.58, -r * 0.22, r * 0.48);

  parts.push(catmullRomTube([temporal, archPeak, zygoma], r * 0.014, 16));

  const zygBody = new THREE.SphereGeometry(r * 0.08, 12, 12);
  zygBody.scale(0.82, 0.62, 0.72);
  zygBody.translate(zygoma.x, zygoma.y, zygoma.z);
  parts.push(zygBody);

  return parts;
}

/**
 * Skull parts in catalog space — origin near cranial center, +Z anterior, +Y superior.
 */
export function buildSkullGeometryParts(r: number = CATALOG_SKULL_RADIUS): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];

  const vaultProfile = [
    new THREE.Vector2(r * 0.08, -r * 0.18),
    new THREE.Vector2(r * 0.48, -r * 0.12),
    new THREE.Vector2(r * 0.72, r * 0.08),
    new THREE.Vector2(r * 0.78, r * 0.42),
    new THREE.Vector2(r * 0.74, r * 0.68),
    new THREE.Vector2(r * 0.58, r * 0.78),
    new THREE.Vector2(r * 0.38, r * 0.72),
    new THREE.Vector2(r * 0.22, r * 0.55),
  ];
  const calvaria = new THREE.LatheGeometry(vaultProfile, 40, 0, Math.PI * 2);
  calvaria.scale(1, 1, 0.82);
  calvaria.translate(0, r * 0.08, -r * 0.06);
  parts.push(calvaria);

  const occiput = new THREE.SphereGeometry(r * 0.52, 24, 20, 0, Math.PI * 2, Math.PI * 0.38, Math.PI * 0.42);
  occiput.scale(0.88, 0.92, 0.72);
  occiput.translate(0, r * 0.05, -r * 0.52);
  parts.push(occiput);

  const frontal = new THREE.SphereGeometry(r * 0.48, 28, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
  frontal.scale(1.02, 0.58, 0.42);
  frontal.translate(0, r * 0.38, r * 0.38);
  parts.push(frontal);

  const glabella = new THREE.BoxGeometry(r * 0.22, r * 0.08, r * 0.06);
  glabella.translate(0, r * 0.28, r * 0.58);
  parts.push(glabella);

  for (const sx of [-1, 1] as const) {
    parts.push(...orbitRim(sx, r));

    const brow = new THREE.CapsuleGeometry(r * 0.012, r * 0.28, 4, 10);
    brow.rotateZ(sx * 0.06);
    brow.rotateX(0.48);
    brow.translate(sx * r * 0.42, r * 0.22, r * 0.52);
    parts.push(brow);

    parts.push(...buildZygomaticArch(sx, r));

    const temporal = new THREE.SphereGeometry(r * 0.18, 14, 14);
    temporal.scale(0.48, 0.68, 0.42);
    temporal.translate(sx * r * 0.74, -r * 0.02, r * 0.02);
    parts.push(temporal);

    const mastoid = new THREE.SphereGeometry(r * 0.06, 10, 10);
    mastoid.scale(0.72, 0.85, 0.68);
    mastoid.translate(sx * r * 0.62, -r * 0.22, -r * 0.08);
    parts.push(mastoid);
  }

  const nasalBone = new THREE.BoxGeometry(r * 0.1, r * 0.09, r * 0.025);
  nasalBone.translate(0, r * 0.08, r * 0.62);
  parts.push(nasalBone);

  const piriform = new THREE.BoxGeometry(r * 0.14, r * 0.16, r * 0.06);
  piriform.translate(0, -r * 0.04, r * 0.58);
  parts.push(piriform);

  for (const sx of [-1, 1] as const) {
    const maxillaSide = new THREE.BoxGeometry(r * 0.22, r * 0.12, r * 0.08);
    maxillaSide.translate(sx * r * 0.22, -r * 0.22, r * 0.44);
    parts.push(maxillaSide);
  }

  const maxillaCenter = new THREE.BoxGeometry(r * 0.38, r * 0.06, r * 0.07);
  maxillaCenter.translate(0, -r * 0.28, r * 0.46);
  parts.push(maxillaCenter);

  const palate = new THREE.BoxGeometry(r * 0.52, r * 0.025, r * 0.06);
  palate.translate(0, -r * 0.26, r * 0.28);
  parts.push(palate);

  const teethShelf = new THREE.BoxGeometry(r * 0.62, r * 0.03, r * 0.05);
  teethShelf.translate(0, -r * 0.32, r * 0.5);
  parts.push(teethShelf);

  parts.push(...buildMandible(r));

  const foramenMagnum = new THREE.TorusGeometry(r * 0.12, r * 0.018, 8, 20);
  foramenMagnum.rotateX(Math.PI / 2);
  foramenMagnum.translate(0, -r * 0.2, -r * 0.42);
  parts.push(foramenMagnum);

  return parts;
}

export function buildCatalogSkullGeometry(): THREE.BufferGeometry | null {
  const merged = mergeGeometries(buildSkullGeometryParts(CATALOG_SKULL_RADIUS), false);
  if (merged) merged.computeVertexNormals();
  return merged;
}

/** World-space skull aligned to FIGURE head position. */
export function buildSkullParts(f: Figure, z: number): THREE.BufferGeometry[] {
  const scale = f.headRadius / CATALOG_SKULL_RADIUS;
  const center = new THREE.Vector3(0, f.headY, z + 0.02);
  const parts = buildSkullGeometryParts(CATALOG_SKULL_RADIUS);

  for (const geo of parts) {
    geo.scale(scale, scale * (f.headScaleY / 1.36), scale * (f.headScaleZ / 0.92));
    geo.translate(center.x, center.y, center.z);
  }

  return parts;
}

export function buildSkullGeometry(f: Figure, z: number): THREE.BufferGeometry | null {
  const merged = mergeGeometries(buildSkullParts(f, z), false);
  if (merged) merged.computeVertexNormals();
  return merged;
}
