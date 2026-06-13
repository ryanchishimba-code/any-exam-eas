/**
 * Anatomical bone shapes — tapered long bones, fused pelvis, digit skeletons.
 */

import * as THREE from "three";
import { buildHandBoneParts, buildFootBoneParts } from "./digit-bone-geometry";
import type { FIGURE as FigureConst } from "./proportions";
import { longBone } from "./long-bone-geometry";

export { longBone } from "./long-bone-geometry";
export { buildHandBoneParts, buildFootBoneParts } from "./digit-bone-geometry";

type Figure = typeof FigureConst;

function catmullRomTube(points: THREE.Vector3[], radius: number, segments = 20, radial = 8) {
  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.42);
  return new THREE.TubeGeometry(curve, segments, radius, radial, false);
}

/** Fused sacral segments. */
export function buildSacrumBoneParts(f: Figure, z: number): THREE.BufferGeometry[] {
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

  return parts;
}

/** Single hip bone — ilium, ischium, pubis, acetabulum. */
export function buildSingleInnominateParts(sx: -1 | 1, f: Figure, z: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const hy = f.hipY;
  const hip = new THREE.Vector3(sx * f.hipSpan, hy + 0.02, z - 0.01);

  const iliumWing = new THREE.BoxGeometry(0.12, 0.09, 0.07);
  iliumWing.rotateZ(sx * 0.32);
  iliumWing.rotateY(sx * -0.12);
  iliumWing.translate(sx * 0.14, hy + 0.06, z - 0.07);
  parts.push(iliumWing);

  parts.push(
    catmullRomTube(
      [
        new THREE.Vector3(sx * 0.06, hy + 0.11, z - 0.04),
        new THREE.Vector3(sx * 0.14, hy + 0.1, z - 0.075),
        new THREE.Vector3(sx * 0.2, hy + 0.04, z - 0.09),
        new THREE.Vector3(sx * 0.12, hy - 0.01, z - 0.1),
      ],
      0.014,
      16
    )
  );

  const acetabulum = new THREE.SphereGeometry(0.028, 12, 12);
  acetabulum.scale(0.95, 0.82, 0.88);
  acetabulum.translate(hip.x, hip.y, hip.z);
  parts.push(acetabulum);

  parts.push(
    catmullRomTube(
      [
        hip.clone().add(new THREE.Vector3(sx * 0.02, -0.02, 0.04)),
        new THREE.Vector3(sx * 0.04, hy - 0.04, z + 0.04),
        new THREE.Vector3(sx * 0.018, hy - 0.05, z + 0.055),
      ],
      0.01,
      12
    )
  );

  parts.push(
    catmullRomTube(
      [
        hip.clone().add(new THREE.Vector3(0, -0.01, -0.02)),
        new THREE.Vector3(sx * 0.1, hy - 0.05, z - 0.05),
        new THREE.Vector3(sx * 0.06, hy - 0.07, z - 0.02),
      ],
      0.012,
      12
    )
  );

  return parts;
}

/** Scapula blade with spine, glenoid, and acromion. */
export function buildSingleScapulaParts(sx: -1 | 1, f: Figure, z: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [];
  const cy = f.chestY + 0.038;
  const cz = z - 0.082;

  const blade = new THREE.BoxGeometry(0.088, 0.128, 0.018);
  blade.rotateY(sx * 0.32);
  blade.translate(sx * 0.238, cy, cz);
  parts.push(blade);

  const spine = new THREE.BoxGeometry(0.014, 0.102, 0.024);
  spine.rotateY(sx * 0.32);
  spine.translate(sx * 0.198, cy, cz + 0.01);
  parts.push(spine);

  const glenoid = new THREE.SphereGeometry(0.018, 10, 10);
  glenoid.scale(0.92, 0.74, 0.82);
  glenoid.translate(sx * 0.268, f.chestY + 0.02, z - 0.055);
  parts.push(glenoid);

  const acromion = new THREE.BoxGeometry(0.044, 0.012, 0.022);
  acromion.rotateY(sx * 0.15);
  acromion.translate(sx * 0.288, f.chestY + 0.072, z - 0.058);
  parts.push(acromion);

  return parts;
}

/** Unified os coxae + sacrum — seamless spine and femur connections. */
export function buildPelvisParts(f: Figure, z: number): THREE.BufferGeometry[] {
  const parts: THREE.BufferGeometry[] = [...buildSacrumBoneParts(f, z)];
  const hy = f.hipY;

  for (const sx of [-1, 1] as const) {
    parts.push(...buildSingleInnominateParts(sx, f, z));
  }

  const pubicSymphysis = new THREE.BoxGeometry(0.032, 0.038, 0.028);
  pubicSymphysis.translate(0, hy - 0.048, z + 0.052);
  parts.push(pubicSymphysis);

  parts.push(
    catmullRomTube(
      [
        new THREE.Vector3(-0.018, hy - 0.05, z + 0.055),
        new THREE.Vector3(0, hy - 0.062, z + 0.062),
        new THREE.Vector3(0.018, hy - 0.05, z + 0.055),
      ],
      0.009,
      10
    )
  );

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
