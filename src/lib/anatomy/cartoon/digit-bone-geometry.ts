/**
 * Shaped mesh builders for carpals, tarsals, and digit phalanges.
 */

import * as THREE from "three";
import { FINGER_SPECS, THUMB_SPEC, TOE_SPECS } from "./digit-proportions";
import {
  CARPAL_NAMES,
  carpalPosition,
  palmFromWrist,
  TARSAL_NAMES,
  tarsalPosition,
  type CarpalName,
  type TarsalName,
} from "./digit-placements";
import type { FIGURE as FigureConst } from "./proportions";
import { longBone } from "./long-bone-geometry";

type Figure = typeof FigureConst;

type ShortProfile = {
  size: [number, number, number];
  rotation?: [number, number, number];
  shape: "block" | "sphere" | "capsule" | "wedge" | "heel";
  hook?: [number, number, number];
};

const CARPAL_PROFILES: Record<CarpalName, ShortProfile> = {
  scaphoid: { shape: "capsule", size: [0.022, 0.01, 0.014], rotation: [0, 0.22, 0.38] },
  lunate: { shape: "wedge", size: [0.014, 0.012, 0.011], rotation: [0.18, 0, 0] },
  triquetrum: { shape: "wedge", size: [0.012, 0.011, 0.01], rotation: [0, -0.28, -0.22] },
  pisiform: { shape: "sphere", size: [0.009, 0.009, 0.009] },
  trapezium: { shape: "block", size: [0.013, 0.01, 0.012], rotation: [0.12, 0.35, 0] },
  trapezoid: { shape: "block", size: [0.011, 0.009, 0.01], rotation: [0.08, 0.15, 0] },
  capitate: { shape: "block", size: [0.016, 0.013, 0.012], rotation: [0.05, 0, 0] },
  hamate: { shape: "hook", size: [0.013, 0.011, 0.011], rotation: [0, 0.2, 0], hook: [0, -0.008, 0.006] },
};

const TARSAL_PROFILES: Record<TarsalName, ShortProfile> = {
  calcaneus: { shape: "heel", size: [0.038, 0.028, 0.048], rotation: [0.08, 0, 0] },
  talus: { shape: "sphere", size: [0.024, 0.018, 0.022], rotation: [0.22, 0, 0] },
  navicular: { shape: "capsule", size: [0.02, 0.011, 0.013], rotation: [0, 0.15, 0.25] },
  cuboid: { shape: "block", size: [0.018, 0.012, 0.014], rotation: [0, -0.12, 0] },
  "medial-cuneiform": { shape: "wedge", size: [0.014, 0.011, 0.012], rotation: [0, 0.35, 0.18] },
  "intermediate-cuneiform": { shape: "wedge", size: [0.013, 0.01, 0.011], rotation: [0, 0.1, 0.12] },
  "lateral-cuneiform": { shape: "wedge", size: [0.013, 0.01, 0.011], rotation: [0, -0.18, 0.1] },
};

function applyTransform(
  geo: THREE.BufferGeometry,
  center: THREE.Vector3,
  rotation?: [number, number, number]
) {
  if (rotation) {
    geo.applyMatrix4(
      new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rotation[0], rotation[1], rotation[2], "XYZ"))
    );
  }
  geo.translate(center.x, center.y, center.z);
}

function shortBoneParts(center: THREE.Vector3, profile: ShortProfile): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const [w, h, d] = profile.size;

  switch (profile.shape) {
    case "sphere": {
      const r = Math.max(w, h, d) * 0.5;
      const geo = new THREE.SphereGeometry(r, 10, 10);
      geo.scale(w / (r * 2), h / (r * 2), d / (r * 2));
      applyTransform(geo, center, profile.rotation);
      parts.push(geo);
      break;
    }
    case "capsule": {
      const geo = new THREE.CapsuleGeometry(Math.min(w, d) * 0.38, h, 6, 10);
      geo.rotateZ(Math.PI / 2);
      geo.scale(w / (Math.min(w, d) * 0.76 + h), 1, d / (Math.min(w, d) * 0.76));
      applyTransform(geo, center, profile.rotation);
      parts.push(geo);
      break;
    }
    case "wedge": {
      const geo = new THREE.BoxGeometry(w, h, d);
      geo.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0.08, 0, 0.12, "XYZ")));
      applyTransform(geo, center, profile.rotation);
      parts.push(geo);
      break;
    }
    case "heel": {
      const body = new THREE.BoxGeometry(w, h, d * 0.72);
      applyTransform(body, center.clone().add(new THREE.Vector3(0, 0, -d * 0.08)), profile.rotation);
      parts.push(body);
      const tub = new THREE.SphereGeometry(w * 0.42, 10, 10);
      tub.scale(1, 0.72, 0.88);
      applyTransform(tub, center.clone().add(new THREE.Vector3(0, -h * 0.12, -d * 0.34)), profile.rotation);
      parts.push(tub);
      break;
    }
    case "hook": {
      const body = new THREE.BoxGeometry(w, h, d);
      applyTransform(body, center, profile.rotation);
      parts.push(body);
      if (profile.hook) {
        const [hx, hy, hz] = profile.hook;
        const hook = new THREE.CapsuleGeometry(w * 0.14, h * 0.55, 4, 8);
        hook.translate(hx, hy, hz);
        applyTransform(hook, center, profile.rotation);
        parts.push(hook);
      }
      break;
    }
    default: {
      const geo = new THREE.BoxGeometry(w, h, d);
      applyTransform(geo, center, profile.rotation);
      parts.push(geo);
    }
  }

  return parts;
}

export function buildCarpalParts(name: CarpalName, center: THREE.Vector3): THREE.BufferGeometry[] {
  return shortBoneParts(center, CARPAL_PROFILES[name]);
}

export function buildTarsalParts(name: TarsalName, center: THREE.Vector3): THREE.BufferGeometry[] {
  return shortBoneParts(center, TARSAL_PROFILES[name]);
}

/** Small digit bone — tapered shaft with rounded condyles; optional distal tuft. */
export function buildPhalanxParts(
  from: THREE.Vector3,
  to: THREE.Vector3,
  shaftR: number,
  opts?: { distal?: boolean; metacarpal?: boolean; metatarsal?: boolean }
): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const lenScale = opts?.metacarpal || opts?.metatarsal ? 1 : 0.92;
  const shaft = shaftR * (opts?.metacarpal || opts?.metatarsal ? 0.88 : 0.72);
  const proxR = shaftR * (opts?.metacarpal || opts?.metatarsal ? 1.35 : 1.22);
  const distR = shaftR * (opts?.distal ? 1.05 : 1.12);

  parts.push(...longBone(from, to, shaft * lenScale, { proximalR: proxR, distalR: distR }));

  if (opts?.distal) {
    const dir = new THREE.Vector3().subVectors(to, from).normalize();
    const tuft = new THREE.SphereGeometry(shaftR * 0.95, 8, 8);
    tuft.scale(0.82, 0.55, 0.78);
    tuft.translate(to.x + dir.x * shaftR * 0.15, to.y + dir.y * shaftR * 0.15, to.z + dir.z * shaftR * 0.15);
    parts.push(tuft);
  }

  return parts;
}

export function buildPatellaParts(center: THREE.Vector3): THREE.BufferGeometry[] {
  const geo = new THREE.SphereGeometry(0.018, 10, 10);
  geo.scale(0.75, 0.45, 0.35);
  geo.translate(center.x, center.y, center.z);
  return [geo];
}

export function buildHandBoneParts(wrist: THREE.Vector3, sx: -1 | 1): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const palm = palmFromWrist(wrist);
  const down = new THREE.Vector3(0, -0.15, 0.35).normalize();

  CARPAL_NAMES.forEach((name, i) => {
    parts.push(...buildCarpalParts(name, carpalPosition(i, palm, sx)));
  });

  for (const spec of FINGER_SPECS) {
    const mcBase = palm.clone().add(new THREE.Vector3(sx * spec.spreadX, -0.006, 0.012));
    const mcEnd = mcBase.clone().add(down.clone().multiplyScalar(spec.metacarpal));
    parts.push(...buildPhalanxParts(mcBase, mcEnd, 0.004, { metacarpal: true }));

    let tip = mcEnd.clone();
    const curl = new THREE.Vector3(0, -1, 0.35).normalize();
    for (let i = 0; i < spec.phalanges.length; i++) {
      const len = spec.phalanges[i]!;
      const r = spec.radii[i]! * 0.55;
      const end = tip.clone().add(curl.clone().multiplyScalar(len));
      parts.push(...buildPhalanxParts(tip, end, r, { distal: i === spec.phalanges.length - 1 }));
      tip = end;
    }
  }

  const thumbBase = palm.clone().add(new THREE.Vector3(sx * THUMB_SPEC.spreadX, 0, 0.006));
  const thumbDir = new THREE.Vector3(sx * THUMB_SPEC.baseDir.x, THUMB_SPEC.baseDir.y, THUMB_SPEC.baseDir.z).normalize();
  const thumbMcEnd = thumbBase.clone().add(thumbDir.clone().multiplyScalar(THUMB_SPEC.metacarpal));
  parts.push(...buildPhalanxParts(thumbBase, thumbMcEnd, 0.004, { metacarpal: true }));
  let tTip = thumbMcEnd.clone();
  for (let i = 0; i < THUMB_SPEC.phalanges.length; i++) {
    const len = THUMB_SPEC.phalanges[i]!;
    const r = THUMB_SPEC.radii[i]! * 0.55;
    const end = tTip.clone().add(thumbDir.clone().multiplyScalar(len));
    parts.push(...buildPhalanxParts(tTip, end, r, { distal: i === THUMB_SPEC.phalanges.length - 1 }));
    tTip = end;
  }

  return parts;
}

export function buildFootBoneParts(ankle: THREE.Vector3, sx: -1 | 1, f: Figure): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const z = f.centerZ;
  const footY = f.footY + 0.016;
  const forward = new THREE.Vector3(0, 0.04, 1).normalize();

  TARSAL_NAMES.forEach((name, i) => {
    parts.push(...buildTarsalParts(name, tarsalPosition(i, ankle, sx, f)));
  });

  const metOrigin = new THREE.Vector3(ankle.x, footY, z + f.footLength * 0.38);

  for (const spec of TOE_SPECS) {
    const mtBase = metOrigin.clone().add(new THREE.Vector3(sx * spec.spreadX, 0, 0));
    const mtEnd = mtBase.clone().add(forward.clone().multiplyScalar(spec.metatarsal));
    parts.push(...buildPhalanxParts(mtBase, mtEnd, 0.0032, { metatarsal: true }));

    let tip = mtEnd.clone();
    for (let i = 0; i < spec.phalanges.length; i++) {
      const len = spec.phalanges[i]!;
      const r = spec.radii[i]! * 0.55;
      const end = tip.clone().add(forward.clone().multiplyScalar(len));
      parts.push(...buildPhalanxParts(tip, end, r, { distal: i === spec.phalanges.length - 1 }));
      tip = end;
    }
  }

  return parts;
}
