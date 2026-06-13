/**
 * Adult human skeleton — 206 bones (standard medical count).
 *
 * Axial (80): skull 22, ossicles 6, hyoid 1, vertebrae 26, ribs 24, sternum 1
 * Appendicular (126): upper limbs 64 (32×2), lower limbs 62 (31×2)
 */

import * as THREE from "three";
import { FINGER_SPECS, THUMB_SPEC, TOE_SPECS } from "../cartoon/digit-proportions";
import {
  CARPAL_NAMES,
  carpalPosition,
  palmFromWrist,
  TARSAL_NAMES,
  tarsalOffsets,
} from "../cartoon/digit-placements";
import { OSSICLE_NAMES, ossicleWorldCenter } from "../cartoon/ossicle-hyoid-geometry";
import { FIGURE } from "../cartoon/proportions";
import { claviclePathPoints, ribPathPoints } from "../cartoon/skeletal-geometry";
import { CATALOG_SKULL_RADIUS } from "../cartoon/skull-geometry";
import { skullCatalogPointToWorld } from "../cartoon/skull-bone-geometry";

export const ADULT_BONE_COUNT = 206;

export type BoneSide = "right" | "left" | "midline";
export type BoneRegion =
  | "cranium"
  | "face"
  | "ossicles"
  | "hyoid"
  | "vertebral"
  | "thorax"
  | "pelvis"
  | "upper-limb"
  | "hand"
  | "lower-limb"
  | "foot";

export type BoneKind = "long" | "short" | "flat" | "irregular" | "sesamoid";

export type BoneInstance = {
  id: string;
  name: string;
  region: BoneRegion;
  side: BoneSide;
  kind: BoneKind;
  from?: THREE.Vector3;
  to?: THREE.Vector3;
  shaftR?: number;
  position?: THREE.Vector3;
  scale?: [number, number, number];
  rotation?: [number, number, number];
  /** Camera focus when this bone is selected. */
  focus: [number, number, number];
  focusDistance?: number;
  highYield?: boolean;
};

type Figure = typeof FIGURE;

function sx(side: BoneSide): -1 | 1 {
  if (side === "midline") return 1;
  return side === "right" ? -1 : 1;
}

function mid(a: THREE.Vector3, b: THREE.Vector3): THREE.Vector3 {
  return new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
}

function pathCentroid(points: THREE.Vector3[]): THREE.Vector3 {
  const c = new THREE.Vector3();
  for (const p of points) c.add(p);
  return c.multiplyScalar(1 / points.length);
}

function ribBone(
  ribIndex: number,
  side: "right" | "left",
  f: Figure,
  z: number
): BoneInstance {
  const sideMult = side === "right" ? (-1 as const) : (1 as const);
  const { bone } = ribPathPoints(ribIndex, sideMult, f, z);
  const c = pathCentroid(bone);
  return {
    id: `rib-${ribIndex + 1}-${side[0]}`,
    name: `Rib ${ribIndex + 1} (${side[0].toUpperCase()})`,
    region: "thorax",
    side,
    kind: "flat",
    focus: [c.x, c.y, c.z],
    focusDistance: 1.35 + Math.abs(c.y) * 0.15,
  };
}

function clavicleBone(side: "right" | "left", f: Figure, z: number): BoneInstance {
  const sideMult = side === "right" ? (-1 as const) : (1 as const);
  const path = claviclePathPoints(sideMult, f, z);
  const c = pathCentroid(path);
  return {
    id: `clavicle-${side[0]}`,
    name: `Clavicle (${side[0].toUpperCase()})`,
    region: "upper-limb",
    side,
    kind: "long",
    focus: [c.x, c.y, c.z],
    focusDistance: 1.35 + Math.abs(c.y) * 0.12,
    highYield: true,
  };
}

function seg(
  id: string,
  name: string,
  region: BoneRegion,
  side: BoneSide,
  from: THREE.Vector3,
  to: THREE.Vector3,
  shaftR: number,
  kind: BoneKind = "long",
  highYield?: boolean
): BoneInstance {
  const c = mid(from, to);
  return {
    id,
    name,
    region,
    side,
    kind,
    from,
    to,
    shaftR,
    focus: [c.x, c.y, c.z],
    focusDistance: 1.35 + Math.abs(c.y) * 0.15,
    highYield,
  };
}

function point(
  id: string,
  name: string,
  region: BoneRegion,
  side: BoneSide,
  position: THREE.Vector3,
  scale: [number, number, number],
  kind: BoneKind,
  rotation?: [number, number, number],
  highYield?: boolean
): BoneInstance {
  return {
    id,
    name,
    region,
    side,
    kind,
    position,
    scale,
    rotation,
    focus: [position.x, position.y, position.z],
    focusDistance: 1.3 + Math.abs(position.y) * 0.12,
    highYield,
  };
}

function skullBones(f: Figure, z: number, scale: number): BoneInstance[] {
  const r = CATALOG_SKULL_RADIUS * scale;
  const bones: BoneInstance[] = [];

  const cranial: [string, string, [number, number, number], [number, number, number]][] = [
    ["frontal-bone", "Frontal bone", [0, 0.38, 0.38], [r * 0.42, r * 0.22, r * 0.12]],
    ["parietal-bone-r", "Parietal bone (R)", [-0.22, 0.42, -0.04], [r * 0.32, r * 0.28, r * 0.08]],
    ["parietal-bone-l", "Parietal bone (L)", [0.22, 0.42, -0.04], [r * 0.32, r * 0.28, r * 0.08]],
    ["temporal-bone-r", "Temporal bone (R)", [-0.58, -0.02, 0.05], [r * 0.18, r * 0.22, r * 0.14]],
    ["temporal-bone-l", "Temporal bone (L)", [0.58, -0.02, 0.05], [r * 0.18, r * 0.22, r * 0.14]],
    ["occipital-bone", "Occipital bone", [0, 0.05, -0.48], [r * 0.38, r * 0.32, r * 0.1]],
    ["sphenoid-bone", "Sphenoid bone", [0, 0.02, 0.08], [r * 0.28, r * 0.18, r * 0.22]],
    ["ethmoid-bone", "Ethmoid bone", [0, 0.12, 0.35], [r * 0.14, r * 0.16, r * 0.1]],
  ];

  for (const [id, name, catalog, sc] of cranial) {
    const pos = skullCatalogPointToWorld(catalog[0], catalog[1], catalog[2], f, z);
    bones.push(
      point(
        id,
        name,
        "cranium",
        id.includes("-r") ? "right" : id.includes("-l") ? "left" : "midline",
        pos,
        sc,
        "flat",
        undefined,
        id === "frontal-bone"
      )
    );
  }

  const facial: [string, string, BoneSide, [number, number, number], [number, number, number]][] = [
    ["mandible", "Mandible", "midline", [0, -0.55, 0.42], [r * 0.62, r * 0.14, r * 0.1]],
    ["maxilla-r", "Maxilla (R)", "right", [-0.22, -0.28, 0.42], [r * 0.2, r * 0.1, r * 0.08]],
    ["maxilla-l", "Maxilla (L)", "left", [0.22, -0.28, 0.42], [r * 0.2, r * 0.1, r * 0.08]],
    ["zygomatic-r", "Zygomatic bone (R)", "right", [-0.52, -0.15, 0.45], [r * 0.12, r * 0.08, r * 0.06]],
    ["zygomatic-l", "Zygomatic bone (L)", "left", [0.52, -0.15, 0.45], [r * 0.12, r * 0.08, r * 0.06]],
    ["nasal-r", "Nasal bone (R)", "right", [-0.06, 0.05, 0.58], [r * 0.06, r * 0.05, r * 0.02]],
    ["nasal-l", "Nasal bone (L)", "left", [0.06, 0.05, 0.58], [r * 0.06, r * 0.05, r * 0.02]],
    ["lacrimal-r", "Lacrimal bone (R)", "right", [-0.38, 0.08, 0.48], [r * 0.05, r * 0.06, r * 0.03]],
    ["lacrimal-l", "Lacrimal bone (L)", "left", [0.38, 0.08, 0.48], [r * 0.05, r * 0.06, r * 0.03]],
    ["palatine-r", "Palatine bone (R)", "right", [-0.12, -0.22, 0.25], [r * 0.08, r * 0.1, r * 0.05]],
    ["palatine-l", "Palatine bone (L)", "left", [0.12, -0.22, 0.25], [r * 0.08, r * 0.1, r * 0.05]],
    ["nasal-concha-r", "Inferior nasal concha (R)", "right", [-0.18, -0.08, 0.52], [r * 0.1, r * 0.04, r * 0.03]],
    ["nasal-concha-l", "Inferior nasal concha (L)", "left", [0.18, -0.08, 0.52], [r * 0.1, r * 0.04, r * 0.03]],
    ["vomer", "Vomer", "midline", [0, -0.05, 0.48], [r * 0.04, r * 0.14, r * 0.06]],
  ];

  for (const [id, name, side, catalog, sc] of facial) {
    bones.push(point(id, name, "face", side, skullCatalogPointToWorld(catalog[0], catalog[1], catalog[2], f, z), sc, "flat"));
  }

  return bones;
}

function ossiclesAndHyoid(f: Figure, z: number, _scale: number): BoneInstance[] {
  const bones: BoneInstance[] = [];

  bones.push(
    point("hyoid", "Hyoid bone", "hyoid", "midline", new THREE.Vector3(0, f.neckY - 0.02, z + 0.06), [0.048, 0.012, 0.022], "irregular", undefined, true)
  );

  for (const side of ["right", "left"] as const) {
    const s = sx(side);
    const scales: Record<(typeof OSSICLE_NAMES)[number], [number, number, number]> = {
      malleus: [0.012, 0.008, 0.006],
      incus: [0.01, 0.008, 0.008],
      stapes: [0.006, 0.004, 0.004],
    };
    for (const name of OSSICLE_NAMES) {
      bones.push(
        point(
          `${name}-${side[0]}`,
          `${name.charAt(0).toUpperCase()}${name.slice(1)} (${side[0].toUpperCase()})`,
          "ossicles",
          side,
          ossicleWorldCenter(name, s, f, z),
          scales[name],
          "short"
        )
      );
    }
  }

  return bones;
}

function vertebralBones(f: Figure, z: number): BoneInstance[] {
  const bones: BoneInstance[] = [];
  const spineBase = f.hipY + 0.1;
  const spineTop = f.shoulderY + 0.04;
  const spineH = spineTop - spineBase;

  const regions: { prefix: string; name: string; count: number; start: number }[] = [
    { prefix: "c", name: "Cervical", count: 7, start: 0.88 },
    { prefix: "t", name: "Thoracic", count: 12, start: 0.62 },
    { prefix: "l", name: "Lumbar", count: 5, start: 0.22 },
  ];

  for (const { prefix, name, count, start } of regions) {
    for (let i = 0; i < count; i++) {
      const t = start - (i / count) * (start - (prefix === "l" ? 0.05 : start - 0.18));
      const vy = spineBase + spineH * t;
      const pos = new THREE.Vector3(0, vy, z - 0.1);
      bones.push(
        point(
          `${prefix}${i + 1}-vertebra`,
          `${name} vertebra ${i + 1}`,
          "vertebral",
          "midline",
          pos,
          [0.038, 0.018, 0.032],
          "irregular",
          undefined,
          prefix === "c" && i === 0
        )
      );
    }
  }

  bones.push(
    point("sacrum", "Sacrum", "vertebral", "midline", new THREE.Vector3(0, f.hipY + 0.04, z - 0.095), [0.1, 0.08, 0.05], "irregular", undefined, true),
    point("coccyx", "Coccyx", "vertebral", "midline", new THREE.Vector3(0, f.hipY - 0.02, z - 0.08), [0.028, 0.035, 0.022], "irregular")
  );

  return bones;
}

function thoraxBones(f: Figure, z: number): BoneInstance[] {
  const bones: BoneInstance[] = [];

  for (let i = 0; i < 12; i++) {
    for (const side of ["right", "left"] as const) {
      bones.push(ribBone(i, side, f, z));
    }
  }

  bones.push(
    point(
      "sternum-bone",
      "Sternum",
      "thorax",
      "midline",
      new THREE.Vector3(0, f.chestY + 0.05, z + 0.1),
      [0.048, 0.22, 0.024],
      "flat",
      undefined,
      true
    )
  );

  return bones;
}

function pelvisBones(f: Figure, z: number): BoneInstance[] {
  const bones: BoneInstance[] = [];
  for (const side of ["right", "left"] as const) {
    const s = sx(side);
    const hip = new THREE.Vector3(s * f.hipSpan, f.hipY + 0.02, z - 0.01);
    bones.push(
      point(
        `innominate-${side[0]}`,
        `Hip bone / innominate (${side[0].toUpperCase()})`,
        "pelvis",
        side,
        hip,
        [0.11, 0.09, 0.08],
        "irregular",
        [0, 0, s * 0.18],
        true
      )
    );
  }
  return bones;
}

function upperLimbBones(f: Figure, z: number): BoneInstance[] {
  const bones: BoneInstance[] = [];

  for (const side of ["right", "left"] as const) {
    const s = sx(side);
    const shoulder = new THREE.Vector3(s * f.shoulderSpan, f.shoulderY - 0.02, z + 0.01);
    const elbow = new THREE.Vector3(s * f.elbowX, f.elbowY, z + f.elbowForward);
    const wrist = new THREE.Vector3(s * f.wristX, f.wristY, z + f.wristForward);

    bones.push(
      clavicleBone(side, f, z),
      point(`scapula-${side[0]}`, `Scapula (${side[0].toUpperCase()})`, "upper-limb", side, new THREE.Vector3(s * 0.24, f.chestY + 0.04, z - 0.085), [0.09, 0.13, 0.022], "flat", [0, s * 0.32, 0], true),
      seg(`humerus-${side[0]}`, `Humerus (${side[0].toUpperCase()})`, "upper-limb", side, shoulder, elbow, 0.012, "long", true),
      seg(`radius-${side[0]}`, `Radius (${side[0].toUpperCase()})`, "upper-limb", side, elbow.clone().add(new THREE.Vector3(s * 0.008, 0, 0.01)), wrist, 0.008, "long"),
      seg(`ulna-${side[0]}`, `Ulna (${side[0].toUpperCase()})`, "upper-limb", side, elbow.clone().add(new THREE.Vector3(s * -0.01, 0, -0.005)), wrist, 0.009, "long")
    );

    const carpals = CARPAL_NAMES;
    const palm = palmFromWrist(wrist);
    carpals.forEach((name, i) => {
      bones.push(
        point(
          `${name}-${side[0]}`,
          `${name.charAt(0).toUpperCase()}${name.slice(1)} (${side[0].toUpperCase()})`,
          "hand",
          side,
          carpalPosition(i, palm, s),
          [0.012, 0.008, 0.01],
          "short"
        )
      );
    });

    for (let m = 1; m <= 5; m++) {
      if (m === 1) {
        const mcBase = palm.clone().add(new THREE.Vector3(s * THUMB_SPEC.spreadX, 0, 0.006));
        const mcDir = thumbDir(side);
        const mcEnd = mcBase.clone().add(mcDir.clone().multiplyScalar(THUMB_SPEC.metacarpal));
        bones.push(seg(`mc-1-${side[0]}`, `Metacarpal 1 / thumb (${side[0].toUpperCase()})`, "hand", side, mcBase, mcEnd, 0.004));
        let tip = mcEnd;
        THUMB_SPEC.phalanges.forEach((len, pi) => {
          const labels = ["Proximal", "Distal"];
          const end = tip.clone().add(mcDir.clone().multiplyScalar(len));
          bones.push(seg(`phalanx-1-${pi + 1}-${side[0]}`, `${labels[pi]} phalanx 1 (${side[0].toUpperCase()})`, "hand", side, tip, end, 0.003 + pi * 0.0005));
          tip = end;
        });
        continue;
      }

      const spec = FINGER_SPECS[5 - m]!;
      const mcBase = palm.clone().add(new THREE.Vector3(s * spec.spreadX, -0.006, 0.012));
      const mcDir = new THREE.Vector3(0, -0.2, 0.35).normalize();
      const mcEnd = mcBase.clone().add(mcDir.clone().multiplyScalar(spec.metacarpal));
      bones.push(seg(`mc-${m}-${side[0]}`, `Metacarpal ${m} (${side[0].toUpperCase()})`, "hand", side, mcBase, mcEnd, 0.004));

      let tip = mcEnd;
      const curl = new THREE.Vector3(0, -1, 0.35).normalize();
      spec.phalanges.forEach((len, pi) => {
        const labels = ["Proximal", "Middle", "Distal"];
        const end = tip.clone().add(curl.clone().multiplyScalar(len));
        bones.push(
          seg(`phalanx-${m}-${pi + 1}-${side[0]}`, `${labels[pi]} phalanx ${m} (${side[0].toUpperCase()})`, "hand", side, tip, end, 0.003 + pi * 0.0005)
        );
        tip = end;
      });
    }
  }

  return bones;
}

function thumbDir(side: BoneSide): THREE.Vector3 {
  const s = sx(side);
  return new THREE.Vector3(s * THUMB_SPEC.baseDir.x, THUMB_SPEC.baseDir.y, THUMB_SPEC.baseDir.z).normalize();
}

function lowerLimbBones(f: Figure, z: number): BoneInstance[] {
  const bones: BoneInstance[] = [];

  for (const side of ["right", "left"] as const) {
    const s = sx(side);
    const hip = new THREE.Vector3(s * f.hipSpan, f.hipY + 0.02, z - 0.01);
    const knee = new THREE.Vector3(s * f.hipSpan * 0.96, f.kneeY, z + f.kneeForward);
    const ankle = new THREE.Vector3(s * f.hipSpan * 0.88, f.ankleY, z + 0.02);
    const neck = hip.clone().add(new THREE.Vector3(s * -0.018, 0.02, -0.012));

    bones.push(
      seg(`femur-${side[0]}`, `Femur (${side[0].toUpperCase()})`, "lower-limb", side, neck, knee, 0.014, "long", true),
      point(`patella-${side[0]}`, `Patella (${side[0].toUpperCase()})`, "lower-limb", side, new THREE.Vector3(knee.x, knee.y, knee.z + 0.038), [0.022, 0.012, 0.014], "sesamoid", undefined, true),
      seg(`tibia-${side[0]}`, `Tibia (${side[0].toUpperCase()})`, "lower-limb", side, knee, ankle, 0.012, "long", true),
      seg(`fibula-${side[0]}`, `Fibula (${side[0].toUpperCase()})`, "lower-limb", side, knee.clone().add(new THREE.Vector3(s * 0.014, 0, 0)), ankle.clone().add(new THREE.Vector3(s * 0.014, 0, 0)), 0.006, "long")
    );

    const footY = f.footY + 0.016;
    const tarsals = TARSAL_NAMES;
    const tarsalPos = tarsalOffsets(s);

    tarsals.forEach((name, i) => {
      const p = tarsalPos[i]!;
      bones.push(
        point(
          `${name}-${side[0]}`,
          `${name.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} (${side[0].toUpperCase()})`,
          "foot",
          side,
          new THREE.Vector3(ankle.x + p[0], footY + p[1], z + p[2]),
          [0.022, 0.012, 0.018],
          "short"
        )
      );
    });

    const forward = new THREE.Vector3(0, 0.04, 1).normalize();
    const metOrigin = new THREE.Vector3(ankle.x, footY, z + f.footLength * 0.38);

    TOE_SPECS.forEach((spec, ti) => {
      const mtBase = metOrigin.clone().add(new THREE.Vector3(s * spec.spreadX, 0, 0));
      const mtEnd = mtBase.clone().add(forward.clone().multiplyScalar(spec.metatarsal));
      bones.push(seg(`mt-${ti + 1}-${side[0]}`, `Metatarsal ${ti + 1} (${side[0].toUpperCase()})`, "foot", side, mtBase, mtEnd, 0.0032));

      let tip = mtEnd;
      spec.phalanges.forEach((len, pi) => {
        const end = tip.clone().add(forward.clone().multiplyScalar(len));
        bones.push(
          seg(`toe-phalanx-${ti + 1}-${pi + 1}-${side[0]}`, `Toe ${ti + 1} phalanx ${pi + 1} (${side[0].toUpperCase()})`, "foot", side, tip, end, 0.0028)
        );
        tip = end;
      });
    });
  }

  return bones;
}

/** All 206 adult bones with world-space placement. */
export function buildBoneInstances(f: Figure = FIGURE): BoneInstance[] {
  const z = f.centerZ;
  const scale = f.headRadius / CATALOG_SKULL_RADIUS;

  const all = [
    ...skullBones(f, z, scale),
    ...ossiclesAndHyoid(f, z, scale),
    ...vertebralBones(f, z),
    ...thoraxBones(f, z),
    ...pelvisBones(f, z),
    ...upperLimbBones(f, z),
    ...lowerLimbBones(f, z),
  ];

  return all;
}

export function verifyBoneCount(): number {
  return buildBoneInstances().length;
}

/** Legacy catalog ids → bone ids highlighted together. */
export const LEGACY_BONE_GROUPS: Record<string, string[]> = {
  skull: buildBoneInstances()
    .filter((b) => b.region === "cranium" || b.region === "face")
    .map((b) => b.id),
  femur: ["femur-r", "femur-l"],
  humerus: ["humerus-r", "humerus-l"],
  tibia: ["tibia-r", "tibia-l"],
  clavicle: ["clavicle-r", "clavicle-l"],
  scapula: ["scapula-r", "scapula-l"],
  sternum: ["sternum-bone"],
  "vertebral-column": buildBoneInstances()
    .filter((b) => b.region === "vertebral")
    .map((b) => b.id),
};

export function getBoneIdsForStructure(structureId: string): string[] {
  if (LEGACY_BONE_GROUPS[structureId]) return LEGACY_BONE_GROUPS[structureId]!;
  return [structureId];
}

export function getBoneFocus(structureId: string): [number, number, number] | null {
  const ids = getBoneIdsForStructure(structureId);
  const instances = buildBoneInstances();
  const first = instances.find((b) => ids.includes(b.id));
  return first?.focus ?? null;
}

export function getBoneFocusDistance(structureId: string): number {
  const ids = getBoneIdsForStructure(structureId);
  const instances = buildBoneInstances();
  const first = instances.find((b) => ids.includes(b.id));
  return first?.focusDistance ?? 1.6;
}

export function isBoneHighlighted(boneId: string, focusId: string | null): boolean {
  if (!focusId) return false;
  if (boneId === focusId) return true;
  return getBoneIdsForStructure(focusId).includes(boneId);
}
