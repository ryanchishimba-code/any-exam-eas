/**
 * Procedural hands, feet, fingers, toes — shared by skin shell.
 * Bone skeletons live in bone-geometry.ts (same digit proportions).
 */

import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { FINGER_SPECS, THUMB_SPEC, TOE_SPECS } from "./digit-proportions";
import type { FIGURE as FigureConst } from "./proportions";

type Figure = typeof FigureConst;

export function limbCapsule(
  from: THREE.Vector3,
  to: THREE.Vector3,
  radius: number,
  radialSegments = 14
) {
  const dir = new THREE.Vector3().subVectors(to, from);
  const length = dir.length();
  const geo = new THREE.CapsuleGeometry(radius, Math.max(0.03, length - radius * 2), 8, radialSegments);
  const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize()
  );
  geo.applyMatrix4(new THREE.Matrix4().compose(mid, quat, new THREE.Vector3(1, 1, 1)));
  return geo;
}

function softSegment(base: THREE.Vector3, dir: THREE.Vector3, length: number, radius: number) {
  const end = base.clone().add(dir.clone().normalize().multiplyScalar(length));
  return limbCapsule(base, end, radius, 10);
}

function buildFingerSoft(
  palm: THREE.Vector3,
  sx: -1 | 1,
  spec: (typeof FINGER_SPECS)[number]
): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const mcBase = palm.clone().add(new THREE.Vector3(sx * spec.spreadX, -0.006, 0.014));
  const down = new THREE.Vector3(0, -0.2, 0.38).normalize();

  parts.push(softSegment(mcBase, down, spec.metacarpal, spec.radii[0]! * 1.05));

  let tip = mcBase.clone().add(down.clone().multiplyScalar(spec.metacarpal * 0.95));
  for (let i = 0; i < spec.phalanges.length; i++) {
    const curl = new THREE.Vector3(0, -1, spec.curl[i] ?? 0.12).normalize();
    parts.push(softSegment(tip, curl, spec.phalanges[i]!, spec.radii[i]!));
    tip = tip.clone().add(curl.clone().multiplyScalar(spec.phalanges[i]! * 0.94));
  }
  return parts;
}

/** Five fingers + palm at wrist. */
export function buildHandParts(wrist: THREE.Vector3, sx: -1 | 1): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const palmCenter = wrist.clone().add(new THREE.Vector3(0, -0.032, 0.018));

  const palm = new THREE.BoxGeometry(0.064, 0.026, 0.036);
  palm.translate(palmCenter.x, palmCenter.y, palmCenter.z);
  parts.push(palm);

  const thenar = new THREE.SphereGeometry(0.022, 12, 12);
  thenar.scale(0.85, 0.72, 0.65);
  thenar.translate(palmCenter.x + sx * 0.028, palmCenter.y + 0.004, palmCenter.z + 0.006);
  parts.push(thenar);

  for (const spec of FINGER_SPECS) {
    parts.push(...buildFingerSoft(palmCenter, sx, spec));
  }

  const thumbBase = palmCenter.clone().add(new THREE.Vector3(sx * THUMB_SPEC.spreadX, 0.002, 0.008));
  const thumbDir = new THREE.Vector3(sx * THUMB_SPEC.baseDir.x, THUMB_SPEC.baseDir.y, THUMB_SPEC.baseDir.z).normalize();
  parts.push(softSegment(thumbBase, thumbDir, THUMB_SPEC.metacarpal, THUMB_SPEC.radii[0]! * 1.1));
  let tTip = thumbBase.clone().add(thumbDir.clone().multiplyScalar(THUMB_SPEC.metacarpal * 0.92));
  for (let i = 0; i < THUMB_SPEC.phalanges.length; i++) {
    parts.push(softSegment(tTip, thumbDir, THUMB_SPEC.phalanges[i]!, THUMB_SPEC.radii[i]!));
    tTip = tTip.clone().add(thumbDir.clone().multiplyScalar(THUMB_SPEC.phalanges[i]! * 0.94));
  }

  return parts;
}

/** Foot sole, heel, and five proportional toes. */
export function buildFootParts(ankle: THREE.Vector3, sx: -1 | 1, f: Figure): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const z = f.centerZ;
  const soleY = f.footY + 0.016;
  const forward = new THREE.Vector3(0, 0.035, 1).normalize();

  const heelPad = new THREE.SphereGeometry(0.036, 14, 14);
  heelPad.scale(1, 0.68, 0.82);
  heelPad.translate(ankle.x, soleY + 0.01, z - 0.022);
  parts.push(heelPad);

  const sole = new THREE.BoxGeometry(0.074, 0.02, f.footLength * 0.88);
  sole.translate(ankle.x, soleY, z + f.footLength * 0.4);
  parts.push(sole);

  const instep = new THREE.BoxGeometry(0.058, 0.034, 0.044);
  instep.translate(ankle.x, ankle.y - 0.018, z + 0.035);
  parts.push(instep);

  const ball = new THREE.SphereGeometry(0.032, 12, 12);
  ball.scale(1.15, 0.45, 0.88);
  ball.translate(ankle.x, soleY + 0.006, z + f.footLength * 0.55);
  parts.push(ball);

  const toeRow = new THREE.Vector3(ankle.x, soleY + 0.006, z + f.footLength * 0.68);
  for (const spec of TOE_SPECS) {
    const mtBase = toeRow.clone().add(new THREE.Vector3(sx * spec.spreadX, 0, 0));
    parts.push(softSegment(mtBase, forward, spec.metatarsal * 0.55, spec.radii[0]! * 1.2));

    let tip = mtBase.clone().add(forward.clone().multiplyScalar(spec.metatarsal * 0.5));
    for (let i = 0; i < spec.phalanges.length; i++) {
      parts.push(softSegment(tip, forward, spec.phalanges[i]!, spec.radii[i]! * 1.15));
      tip = tip.clone().add(forward.clone().multiplyScalar(spec.phalanges[i]! * 0.96));
    }
  }

  return parts;
}

/** Upper/lower arm with elbow joint. */
export function buildArmParts(sx: -1 | 1, f: Figure, z: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const shoulder = new THREE.Vector3(sx * f.shoulderSpan, f.shoulderY - 0.02, z + 0.01);
  const elbow = new THREE.Vector3(sx * f.elbowX, f.elbowY, z + f.elbowForward);
  const wrist = new THREE.Vector3(sx * f.wristX, f.wristY, z + f.wristForward);

  const deltoid = new THREE.SphereGeometry(f.upperArmRadius * 1.1, 14, 14);
  deltoid.scale(1.06, 0.86, 0.9);
  deltoid.translate(shoulder.x, shoulder.y, shoulder.z);
  parts.push(deltoid);

  parts.push(limbCapsule(shoulder, elbow, f.upperArmRadius * 0.95));

  const elbowJoint = new THREE.SphereGeometry(f.upperArmRadius * 0.88, 12, 12);
  elbowJoint.scale(1, 0.78, 0.85);
  elbowJoint.translate(elbow.x, elbow.y, elbow.z);
  parts.push(elbowJoint);

  parts.push(limbCapsule(elbow, wrist, f.forearmRadius));

  const wristJoint = new THREE.SphereGeometry(f.forearmRadius * 0.9, 10, 10);
  wristJoint.scale(0.85, 0.68, 0.62);
  wristJoint.translate(wrist.x, wrist.y, wrist.z);
  parts.push(wristJoint);

  parts.push(...buildHandParts(wrist, sx));
  return parts;
}

/** Thigh, calf, knee, ankle, foot. */
export function buildLegParts(sx: -1 | 1, f: Figure, z: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const hip = new THREE.Vector3(sx * f.hipSpan, f.hipY + 0.02, z - 0.01);
  const knee = new THREE.Vector3(sx * f.hipSpan * 0.96, f.kneeY, z + f.kneeForward);
  const ankle = new THREE.Vector3(sx * f.hipSpan * 0.88, f.ankleY, z + 0.02);

  const glute = new THREE.SphereGeometry(f.thighRadius * 0.9, 14, 14);
  glute.scale(1, 0.65, 0.7);
  glute.translate(sx * f.hipSpan * 1.0, f.hipY + 0.035, z - 0.048);
  parts.push(glute);

  parts.push(limbCapsule(hip, knee, f.thighRadius * 0.96));

  const kneeCap = new THREE.SphereGeometry(f.thighRadius * 0.52, 12, 12);
  kneeCap.scale(0.82, 0.42, 0.52);
  kneeCap.translate(knee.x, knee.y, knee.z + 0.042);
  parts.push(kneeCap);

  parts.push(limbCapsule(knee, ankle, f.calfRadius));

  const malleolus = new THREE.SphereGeometry(f.calfRadius * 0.82, 10, 10);
  malleolus.scale(0.62, 0.68, 0.52);
  malleolus.translate(ankle.x + sx * 0.011, ankle.y, ankle.z + 0.016);
  parts.push(malleolus);

  parts.push(...buildFootParts(ankle, sx, f));
  return parts;
}

export function buildAllExtremityParts(f: Figure): THREE.BufferGeometry[] {
  const z = f.centerZ;
  const parts: THREE.BufferGeometry[] = [];
  for (const sx of [-1, 1] as const) {
    parts.push(...buildArmParts(sx, f, z));
    parts.push(...buildLegParts(sx, f, z));
  }
  return parts;
}

export function mergeExtremityParts(f: Figure): THREE.BufferGeometry | null {
  const merged = mergeGeometries(buildAllExtremityParts(f), false);
  if (merged) merged.computeVertexNormals();
  return merged;
}

// Re-export bone builders for skeletal layer consumers.
export { buildHandBoneParts, buildFootBoneParts } from "./bone-geometry";
