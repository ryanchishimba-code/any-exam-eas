/**
 * Anatomical bone shapes — tapered long bones, fused pelvis, digit skeletons.
 */

import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { FINGER_SPECS, THUMB_SPEC, TOE_SPECS } from "./digit-proportions";
import type { FIGURE as FigureConst } from "./proportions";

type Figure = typeof FigureConst;

function catmullRomTube(points: THREE.Vector3[], radius: number, segments = 20, radial = 8) {
  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.42);
  return new THREE.TubeGeometry(curve, segments, radius, radial, false);
}

/** Long bone — narrow shaft, flared epiphyses at each end. */
export function longBone(
  from: THREE.Vector3,
  to: THREE.Vector3,
  shaftR: number,
  opts?: { proximalR?: number; distalR?: number }
) {
  const parts: THREE.BufferGeometry[] = [];
  const dir = new THREE.Vector3().subVectors(to, from);
  const len = dir.length();
  const axis = dir.clone().normalize();
  const proxR = opts?.proximalR ?? shaftR * 1.45;
  const distR = opts?.distalR ?? shaftR * 1.35;

  const shaftLen = Math.max(0.04, len * 0.62);
  const shaft = new THREE.CylinderGeometry(shaftR * 0.92, shaftR, shaftLen, 10);
  const shaftMid = from.clone().add(to).multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
  shaft.applyMatrix4(new THREE.Matrix4().compose(shaftMid, quat, new THREE.Vector3(1, 1, 1)));
  parts.push(shaft);

  for (const [pt, r, t] of [
    [from, proxR, 0.08] as const,
    [to, distR, 0.92] as const,
  ]) {
    const epiphysis = new THREE.SphereGeometry(r, 12, 12);
    epiphysis.scale(1, len * 0.08 / r, 1);
    epiphysis.translate(
      pt.x + axis.x * len * t * 0.02,
      pt.y + axis.y * len * t * 0.02,
      pt.z + axis.z * len * t * 0.02
    );
    parts.push(epiphysis);
  }

  return parts;
}

/** Unified os coxae + sacrum — seamless spine and femur connections. */
export function buildPelvisParts(f: Figure, z: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const hy = f.hipY;
  const sacrumTop = hy + 0.1;
  const sacrumBase = hy - 0.04;

  const sacrum = new THREE.BoxGeometry(0.1, sacrumTop - sacrumBase, 0.055);
  sacrum.translate(0, (sacrumTop + sacrumBase) * 0.5, z - 0.095);
  parts.push(sacrum);

  for (let i = 0; i < 5; i++) {
    const seg = new THREE.BoxGeometry(0.088 - i * 0.004, 0.022, 0.048);
    seg.translate(0, sacrumTop - 0.012 - i * 0.024, z - 0.092 - i * 0.002);
    parts.push(seg);
  }

  for (const sx of [-1, 1] as const) {
    const hip = new THREE.Vector3(sx * f.hipSpan, hy + 0.02, z - 0.01);

    const iliumWing = new THREE.BoxGeometry(0.12, 0.09, 0.07);
    iliumWing.rotateZ(sx * 0.32);
    iliumWing.rotateY(sx * -0.12);
    iliumWing.translate(sx * 0.14, hy + 0.06, z - 0.07);
    parts.push(iliumWing);

    const iliacCrest = catmullRomTube(
      [
        new THREE.Vector3(sx * 0.06, hy + 0.11, z - 0.04),
        new THREE.Vector3(sx * 0.14, hy + 0.1, z - 0.075),
        new THREE.Vector3(sx * 0.2, hy + 0.04, z - 0.09),
        new THREE.Vector3(sx * 0.12, hy - 0.01, z - 0.1),
      ],
      0.014,
      16
    );
    parts.push(iliacCrest);

    const acetabulum = new THREE.SphereGeometry(0.028, 12, 12);
    acetabulum.scale(0.95, 0.82, 0.88);
    acetabulum.translate(hip.x, hip.y, hip.z);
    parts.push(acetabulum);

    const pubis = catmullRomTube(
      [
        hip.clone().add(new THREE.Vector3(sx * 0.02, -0.02, 0.04)),
        new THREE.Vector3(sx * 0.04, hy - 0.04, z + 0.04),
        new THREE.Vector3(sx * 0.018, hy - 0.05, z + 0.055),
      ],
      0.01,
      12
    );
    parts.push(pubis);

    const ischium = catmullRomTube(
      [
        hip.clone().add(new THREE.Vector3(0, -0.01, -0.02)),
        new THREE.Vector3(sx * 0.1, hy - 0.05, z - 0.05),
        new THREE.Vector3(sx * 0.06, hy - 0.07, z - 0.02),
      ],
      0.012,
      12
    );
    parts.push(ischium);
  }

  const pubicSymphysis = new THREE.BoxGeometry(0.032, 0.038, 0.028);
  pubicSymphysis.translate(0, hy - 0.048, z + 0.052);
  parts.push(pubicSymphysis);

  const pubicArch = catmullRomTube(
    [
      new THREE.Vector3(-0.018, hy - 0.05, z + 0.055),
      new THREE.Vector3(0, hy - 0.062, z + 0.062),
      new THREE.Vector3(0.018, hy - 0.05, z + 0.055),
    ],
    0.009,
    10
  );
  parts.push(pubicArch);

  return parts;
}

export function buildHandBoneParts(wrist: THREE.Vector3, sx: -1 | 1): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const palm = wrist.clone().add(new THREE.Vector3(0, -0.028, 0.018));
  const down = new THREE.Vector3(0, -0.15, 0.35).normalize();

  const carpalBlock = new THREE.BoxGeometry(0.058, 0.014, 0.038);
  carpalBlock.translate(palm.x, palm.y, palm.z);
  parts.push(carpalBlock);

  for (const spec of FINGER_SPECS) {
    const mcBase = palm.clone().add(new THREE.Vector3(sx * spec.spreadX, -0.006, 0.012));
    const mcEnd = mcBase.clone().add(down.clone().multiplyScalar(spec.metacarpal));
    parts.push(...longBone(mcBase, mcEnd, 0.0038, { proximalR: 0.0055, distalR: 0.005 }));

    let tip = mcEnd.clone();
    const curl = new THREE.Vector3(0, -1, 0.35).normalize();
    for (let i = 0; i < spec.phalanges.length; i++) {
      const len = spec.phalanges[i]!;
      const r = spec.radii[i]! * 0.55;
      const end = tip.clone().add(curl.clone().multiplyScalar(len));
      parts.push(...longBone(tip, end, r * 0.5, { proximalR: r, distalR: r * 0.8 }));
      tip = end;
    }
  }

  const thumbBase = palm.clone().add(new THREE.Vector3(sx * THUMB_SPEC.spreadX, 0, 0.006));
  const thumbDir = new THREE.Vector3(sx * THUMB_SPEC.baseDir.x, THUMB_SPEC.baseDir.y, THUMB_SPEC.baseDir.z).normalize();
  const thumbMcEnd = thumbBase.clone().add(thumbDir.clone().multiplyScalar(THUMB_SPEC.metacarpal));
  parts.push(...longBone(thumbBase, thumbMcEnd, 0.004, { proximalR: 0.006, distalR: 0.005 }));
  let tTip = thumbMcEnd.clone();
  for (let i = 0; i < THUMB_SPEC.phalanges.length; i++) {
    const len = THUMB_SPEC.phalanges[i]!;
    const r = THUMB_SPEC.radii[i]! * 0.55;
    const end = tTip.clone().add(thumbDir.clone().multiplyScalar(len));
    parts.push(...longBone(tTip, end, r * 0.5, { proximalR: r, distalR: r * 0.75 }));
    tTip = end;
  }

  return parts;
}

export function buildFootBoneParts(ankle: THREE.Vector3, sx: -1 | 1, f: Figure): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const z = f.centerZ;
  const footY = f.footY + 0.016;
  const forward = new THREE.Vector3(0, 0.04, 1).normalize();

  const calcaneus = new THREE.BoxGeometry(0.038, 0.028, 0.048);
  calcaneus.translate(ankle.x, footY + 0.008, z - 0.02);
  parts.push(calcaneus);

  const talus = new THREE.SphereGeometry(0.022, 10, 10);
  talus.scale(1.1, 0.72, 0.95);
  talus.translate(ankle.x, footY + 0.012, z + 0.015);
  parts.push(talus);

  const metOrigin = new THREE.Vector3(ankle.x, footY, z + f.footLength * 0.38);

  for (const spec of TOE_SPECS) {
    const mtBase = metOrigin.clone().add(new THREE.Vector3(sx * spec.spreadX, 0, 0));
    const mtEnd = mtBase.clone().add(forward.clone().multiplyScalar(spec.metatarsal));
    parts.push(...longBone(mtBase, mtEnd, 0.0032, { proximalR: 0.0048, distalR: 0.004 }));

    let tip = mtEnd.clone();
    for (let i = 0; i < spec.phalanges.length; i++) {
      const len = spec.phalanges[i]!;
      const r = spec.radii[i]! * 0.55;
      const end = tip.clone().add(forward.clone().multiplyScalar(len));
      parts.push(...longBone(tip, end, r * 0.45, { proximalR: r, distalR: r * 0.75 }));
      tip = end;
    }
  }

  return parts;
}

export function buildArmBones(sx: -1 | 1, f: Figure, z: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const shoulder = new THREE.Vector3(sx * f.shoulderSpan, f.shoulderY - 0.02, z + 0.01);
  const elbow = new THREE.Vector3(sx * f.elbowX, f.elbowY, z + f.elbowForward);
  const wrist = new THREE.Vector3(sx * f.wristX, f.wristY, z + f.wristForward);

  parts.push(...longBone(shoulder, elbow, 0.012, { proximalR: 0.022, distalR: 0.018 }));

  const head = new THREE.SphereGeometry(0.024, 12, 12);
  head.scale(0.88, 0.82, 0.78);
  head.translate(shoulder.x, shoulder.y + 0.012, shoulder.z - 0.008);
  parts.push(head);

  parts.push(...longBone(elbow, wrist, 0.01, { proximalR: 0.016, distalR: 0.014 }));

  const ulnaDir = wrist.clone().sub(elbow).normalize();
  const ulnaOff = new THREE.Vector3(-sx * 0.012, 0, 0.008);
  parts.push(
    ...longBone(
      elbow.clone().add(ulnaOff),
      wrist.clone().add(ulnaOff),
      0.007,
      { proximalR: 0.012, distalR: 0.011 }
    )
  );

  parts.push(...buildHandBoneParts(wrist, sx));
  return parts;
}

export function buildLegBones(sx: -1 | 1, f: Figure, z: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const hip = new THREE.Vector3(sx * f.hipSpan, f.hipY + 0.02, z - 0.01);
  const knee = new THREE.Vector3(sx * f.hipSpan * 0.96, f.kneeY, z + f.kneeForward);
  const ankle = new THREE.Vector3(sx * f.hipSpan * 0.88, f.ankleY, z + 0.02);

  const femurNeck = hip.clone().add(new THREE.Vector3(sx * -0.018, 0.02, -0.012));
  const femurHead = new THREE.SphereGeometry(0.026, 12, 12);
  femurHead.translate(femurNeck.x, femurNeck.y, femurNeck.z);
  parts.push(femurHead);

  parts.push(...longBone(femurNeck, knee, 0.014, { proximalR: 0.02, distalR: 0.024 }));

  const patella = new THREE.SphereGeometry(0.018, 10, 10);
  patella.scale(0.75, 0.45, 0.35);
  patella.translate(knee.x, knee.y, knee.z + 0.038);
  parts.push(patella);

  parts.push(...longBone(knee, ankle, 0.012, { proximalR: 0.02, distalR: 0.014 }));

  const fibulaOff = new THREE.Vector3(sx * 0.014, 0, 0);
  parts.push(
    ...longBone(
      knee.clone().add(fibulaOff),
      ankle.clone().add(fibulaOff),
      0.006,
      { proximalR: 0.009, distalR: 0.008 }
    )
  );

  const malleolus = new THREE.SphereGeometry(0.012, 10, 10);
  malleolus.translate(ankle.x + sx * 0.01, ankle.y, ankle.z + 0.014);
  parts.push(malleolus);

  parts.push(...buildFootBoneParts(ankle, sx, f));
  return parts;
}
