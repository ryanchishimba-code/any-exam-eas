/**
 * Individual skull bone meshes — catalog space, composed into full skull in skull-geometry.ts.
 */

import * as THREE from "three";
import type { FIGURE as FigureConst } from "./proportions";

type Figure = typeof FigureConst;

/** Reference radius — matches OrganVisual skull + HumanFaceFeatures (eyes at ±0.34). */
export const CATALOG_SKULL_RADIUS = 0.8;

export const SKULL_BONE_IDS = [
  "frontal-bone",
  "parietal-bone-r",
  "parietal-bone-l",
  "temporal-bone-r",
  "temporal-bone-l",
  "occipital-bone",
  "sphenoid-bone",
  "ethmoid-bone",
  "mandible",
  "maxilla-r",
  "maxilla-l",
  "zygomatic-r",
  "zygomatic-l",
  "nasal-r",
  "nasal-l",
  "lacrimal-r",
  "lacrimal-l",
  "palatine-r",
  "palatine-l",
  "nasal-concha-r",
  "nasal-concha-l",
  "vomer",
] as const;

export type SkullBoneId = (typeof SKULL_BONE_IDS)[number];

const SKULL_BONE_ID_SET = new Set<string>(SKULL_BONE_IDS);

export function parseSkullBoneId(boneId: string): SkullBoneId | null {
  return SKULL_BONE_ID_SET.has(boneId) ? (boneId as SkullBoneId) : null;
}

function catmullRomTube(points: THREE.Vector3[], radius: number, segments = 20) {
  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.38);
  return new THREE.TubeGeometry(curve, segments, radius, 8, false);
}

function orbitRimMedial(sx: -1 | 1, r: number): THREE.BufferGeometry {
  const ox = sx * r * 0.375;
  const oy = r * 0.075;
  const oz = r * 0.55;
  const med = new THREE.CapsuleGeometry(r * 0.008, r * 0.18, 4, 10);
  med.rotateX(0.28);
  med.translate(ox - sx * r * 0.11, oy + r * 0.02, oz + r * 0.02);
  return med;
}

export function buildMandibleCatalogParts(r: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const chinZ = r * 0.48;
  const chinY = -r * 0.72;

  const leftAngle = new THREE.Vector3(-r * 0.52, -r * 0.58, r * 0.38);
  const chin = new THREE.Vector3(0, chinY, chinZ);
  const rightAngle = new THREE.Vector3(r * 0.52, -r * 0.58, r * 0.38);

  parts.push(
    catmullRomTube(
      [
        leftAngle,
        new THREE.Vector3(-r * 0.28, chinY + r * 0.04, chinZ),
        chin,
        new THREE.Vector3(r * 0.28, chinY + r * 0.04, chinZ),
        rightAngle,
      ],
      r * 0.022,
      22
    )
  );

  for (const sx of [-1, 1] as const) {
    const condyle = new THREE.Vector3(sx * r * 0.44, -r * 0.32, r * 0.18);
    const gonion = new THREE.Vector3(sx * r * 0.52, -r * 0.58, r * 0.38);
    const coronoid = new THREE.Vector3(sx * r * 0.38, -r * 0.08, r * 0.32);

    parts.push(
      catmullRomTube(
        [gonion, new THREE.Vector3(sx * r * 0.48, -r * 0.42, r * 0.28), condyle],
        r * 0.018,
        14
      )
    );

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

function buildZygomaticArchCatalogParts(sx: -1 | 1, r: number): THREE.BufferGeometry[] {
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

function buildFrontalCatalogParts(r: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const frontal = new THREE.SphereGeometry(r * 0.48, 28, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
  frontal.scale(1.02, 0.58, 0.42);
  frontal.translate(0, r * 0.38, r * 0.38);
  parts.push(frontal);

  const glabella = new THREE.BoxGeometry(r * 0.22, r * 0.08, r * 0.06);
  glabella.translate(0, r * 0.28, r * 0.58);
  parts.push(glabella);

  for (const sx of [-1, 1] as const) {
    const brow = new THREE.CapsuleGeometry(r * 0.012, r * 0.28, 4, 10);
    brow.rotateZ(sx * 0.06);
    brow.rotateX(0.48);
    brow.translate(sx * r * 0.42, r * 0.22, r * 0.52);
    parts.push(brow);
  }

  return parts;
}

function buildParietalCatalogParts(sx: -1 | 1, r: number): THREE.BufferGeometry[] {
  const start = sx === -1 ? Math.PI / 2 : -Math.PI / 2;
  const dome = new THREE.SphereGeometry(r * 0.54, 24, 20, start, Math.PI / 2, Math.PI * 0.18, Math.PI * 0.58);
  dome.translate(sx * r * 0.18, r * 0.42, -r * 0.04);
  return [dome];
}

function buildTemporalCatalogParts(sx: -1 | 1, r: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const temporal = new THREE.SphereGeometry(r * 0.18, 14, 14);
  temporal.scale(0.48, 0.68, 0.42);
  temporal.translate(sx * r * 0.74, -r * 0.02, r * 0.02);
  parts.push(temporal);

  const mastoid = new THREE.SphereGeometry(r * 0.06, 10, 10);
  mastoid.scale(0.72, 0.85, 0.68);
  mastoid.translate(sx * r * 0.62, -r * 0.22, -r * 0.08);
  parts.push(mastoid);

  const archRoot = new THREE.CapsuleGeometry(r * 0.012, r * 0.14, 4, 8);
  archRoot.rotateZ(sx * -0.2);
  archRoot.translate(sx * r * 0.72, -r * 0.06, r * 0.08);
  parts.push(archRoot);

  return parts;
}

function buildOccipitalCatalogParts(r: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const occiput = new THREE.SphereGeometry(r * 0.52, 24, 20, 0, Math.PI * 2, Math.PI * 0.38, Math.PI * 0.42);
  occiput.scale(0.88, 0.92, 0.72);
  occiput.translate(0, r * 0.05, -r * 0.52);
  parts.push(occiput);

  const foramenMagnum = new THREE.TorusGeometry(r * 0.12, r * 0.018, 8, 20);
  foramenMagnum.rotateX(Math.PI / 2);
  foramenMagnum.translate(0, -r * 0.2, -r * 0.42);
  parts.push(foramenMagnum);

  return parts;
}

function buildSphenoidCatalogParts(r: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const body = new THREE.BoxGeometry(r * 0.28, r * 0.18, r * 0.22);
  body.translate(0, r * 0.02, r * 0.08);
  parts.push(body);

  for (const sx of [-1, 1] as const) {
    const wing = new THREE.BoxGeometry(r * 0.2, r * 0.06, r * 0.14);
    wing.rotateY(sx * 0.42);
    wing.translate(sx * r * 0.22, r * 0.04, r * 0.02);
    parts.push(wing);

    const pterion = new THREE.SphereGeometry(r * 0.04, 8, 8);
    pterion.translate(sx * r * 0.34, r * 0.18, r * 0.12);
    parts.push(pterion);
  }

  return parts;
}

function buildEthmoidCatalogParts(r: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const plate = new THREE.BoxGeometry(r * 0.14, r * 0.16, r * 0.1);
  plate.translate(0, r * 0.12, r * 0.35);
  parts.push(plate);

  const crista = new THREE.BoxGeometry(r * 0.02, r * 0.1, r * 0.04);
  crista.translate(0, r * 0.22, r * 0.32);
  parts.push(crista);

  const nasal = new THREE.BoxGeometry(r * 0.1, r * 0.09, r * 0.025);
  nasal.translate(0, r * 0.08, r * 0.62);
  parts.push(nasal);

  return parts;
}

function buildMaxillaCatalogParts(sx: -1 | 1, r: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const maxillaSide = new THREE.BoxGeometry(r * 0.22, r * 0.12, r * 0.08);
  maxillaSide.translate(sx * r * 0.22, -r * 0.22, r * 0.44);
  parts.push(maxillaSide);

  const alveolus = new THREE.BoxGeometry(r * 0.18, r * 0.03, r * 0.05);
  alveolus.translate(sx * r * 0.22, -r * 0.3, r * 0.5);
  parts.push(alveolus);

  const halfPalate = new THREE.BoxGeometry(r * 0.24, r * 0.025, r * 0.06);
  halfPalate.translate(sx * r * 0.12, -r * 0.26, r * 0.28);
  parts.push(halfPalate);

  return parts;
}

function buildNasalHalfCatalogParts(sx: -1 | 1, r: number): THREE.BufferGeometry[] {
  const half = new THREE.BoxGeometry(r * 0.05, r * 0.05, r * 0.02);
  half.translate(sx * r * 0.03, r * 0.08, r * 0.62);
  return [half];
}

function buildLacrimalCatalogParts(sx: -1 | 1, r: number): THREE.BufferGeometry[] {
  return [orbitRimMedial(sx, r)];
}

function buildPalatineCatalogParts(sx: -1 | 1, r: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const vertical = new THREE.BoxGeometry(r * 0.04, r * 0.1, r * 0.05);
  vertical.translate(sx * r * 0.12, -r * 0.22, r * 0.25);
  parts.push(vertical);

  const horizontal = new THREE.BoxGeometry(r * 0.1, r * 0.02, r * 0.05);
  horizontal.translate(sx * r * 0.1, -r * 0.26, r * 0.28);
  parts.push(horizontal);

  return parts;
}

function buildNasalConchaCatalogParts(sx: -1 | 1, r: number): THREE.BufferGeometry[] {
  const curve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(sx * r * 0.12, -r * 0.04, r * 0.54),
      new THREE.Vector3(sx * r * 0.2, -r * 0.08, r * 0.52),
      new THREE.Vector3(sx * r * 0.16, -r * 0.12, r * 0.5),
    ],
    false,
    "catmullrom",
    0.5
  );
  const scroll = new THREE.TubeGeometry(curve, 12, r * 0.012, 6, false);
  return [scroll];
}

function buildVomerCatalogParts(r: number): THREE.BufferGeometry[] {
  const vomer = new THREE.BoxGeometry(r * 0.04, r * 0.14, r * 0.06);
  vomer.translate(0, -r * 0.05, r * 0.48);
  return [vomer];
}

/** Shared calvaria vault — split between parietals in individual views; included in full skull merge. */
export function buildCalvariaCatalogParts(r: number): THREE.BufferGeometry[] {
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
  return [calvaria];
}

/** Orbit rim segments — used in full skull; lateral parts stay with frontal/temporal context. */
export function buildOrbitRimCatalogParts(sx: -1 | 1, r: number): THREE.BufferGeometry[] {
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

  parts.push(orbitRimMedial(sx, r));

  const floor = new THREE.BoxGeometry(r * 0.32, r * 0.018, r * 0.12);
  floor.translate(ox, oy - r * 0.08, oz - r * 0.04);
  parts.push(floor);

  return parts;
}

export function buildSingleSkullBoneCatalogParts(boneId: SkullBoneId, r: number): THREE.BufferGeometry[] {
  switch (boneId) {
    case "frontal-bone":
      return buildFrontalCatalogParts(r);
    case "parietal-bone-r":
      return buildParietalCatalogParts(-1, r);
    case "parietal-bone-l":
      return buildParietalCatalogParts(1, r);
    case "temporal-bone-r":
      return buildTemporalCatalogParts(-1, r);
    case "temporal-bone-l":
      return buildTemporalCatalogParts(1, r);
    case "occipital-bone":
      return buildOccipitalCatalogParts(r);
    case "sphenoid-bone":
      return buildSphenoidCatalogParts(r);
    case "ethmoid-bone":
      return buildEthmoidCatalogParts(r);
    case "mandible":
      return buildMandibleCatalogParts(r);
    case "maxilla-r":
      return buildMaxillaCatalogParts(-1, r);
    case "maxilla-l":
      return buildMaxillaCatalogParts(1, r);
    case "zygomatic-r":
      return buildZygomaticArchCatalogParts(-1, r);
    case "zygomatic-l":
      return buildZygomaticArchCatalogParts(1, r);
    case "nasal-r":
      return buildNasalHalfCatalogParts(-1, r);
    case "nasal-l":
      return buildNasalHalfCatalogParts(1, r);
    case "lacrimal-r":
      return buildLacrimalCatalogParts(-1, r);
    case "lacrimal-l":
      return buildLacrimalCatalogParts(1, r);
    case "palatine-r":
      return buildPalatineCatalogParts(-1, r);
    case "palatine-l":
      return buildPalatineCatalogParts(1, r);
    case "nasal-concha-r":
      return buildNasalConchaCatalogParts(-1, r);
    case "nasal-concha-l":
      return buildNasalConchaCatalogParts(1, r);
    case "vomer":
      return buildVomerCatalogParts(r);
    default:
      return [];
  }
}

export function buildSkullBoneWorldParts(boneId: string, f: Figure, z: number): THREE.BufferGeometry[] | null {
  const id = parseSkullBoneId(boneId);
  if (!id) return null;

  const parts = buildSingleSkullBoneCatalogParts(id, CATALOG_SKULL_RADIUS);
  applySkullWorldTransform(parts, f, z);
  return parts;
}

export function skullCatalogPointToWorld(
  x: number,
  y: number,
  cz: number,
  f: Figure,
  z: number
): THREE.Vector3 {
  const scale = f.headRadius / CATALOG_SKULL_RADIUS;
  const center = new THREE.Vector3(0, f.headY, z + 0.02);
  const r = CATALOG_SKULL_RADIUS;
  return new THREE.Vector3(
    center.x + x * r * scale,
    center.y + y * r * scale * (f.headScaleY / 1.36),
    center.z + cz * r * scale * (f.headScaleZ / 0.92)
  );
}

export function applySkullWorldTransform(parts: THREE.BufferGeometry[], f: Figure, z: number) {
  const scale = f.headRadius / CATALOG_SKULL_RADIUS;
  const center = new THREE.Vector3(0, f.headY, z + 0.02);
  for (const geo of parts) {
    geo.scale(scale, scale * (f.headScaleY / 1.36), scale * (f.headScaleZ / 0.92));
    geo.translate(center.x, center.y, center.z);
  }
}
