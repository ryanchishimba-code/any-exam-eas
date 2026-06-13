/**
 * Tapered long-bone shaft with flared epiphyses — shared by limb and digit builders.
 */

import * as THREE from "three";

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
