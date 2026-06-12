/**
 * Per-bone mesh geometry for the clickable skeleton.
 */

import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { longBone } from "../cartoon/bone-geometry";
import type { BoneInstance } from "./instances";

export function createBoneMeshGeometry(bone: BoneInstance): THREE.BufferGeometry | null {
  const parts: THREE.BufferGeometry[] = [];

  if (bone.from && bone.to && bone.shaftR) {
    parts.push(...longBone(bone.from, bone.to, bone.shaftR, { proximalR: bone.shaftR * 1.5, distalR: bone.shaftR * 1.3 }));
  } else if (bone.position && bone.scale) {
    const [w, h, d] = bone.scale;
    const geo = new THREE.BoxGeometry(w, h, d);
    if (bone.rotation) {
      geo.applyMatrix4(
        new THREE.Matrix4().makeRotationFromEuler(
          new THREE.Euler(bone.rotation[0], bone.rotation[1], bone.rotation[2], "XYZ")
        )
      );
    }
    geo.translate(bone.position.x, bone.position.y, bone.position.z);
    parts.push(geo);
  }

  if (parts.length === 0) return null;
  const merged = mergeGeometries(parts, false);
  if (merged) merged.computeVertexNormals();
  return merged;
}

export function createBoneMeshMap(bones: BoneInstance[]): Map<string, THREE.BufferGeometry> {
  const map = new Map<string, THREE.BufferGeometry>();
  for (const bone of bones) {
    const geo = createBoneMeshGeometry(bone);
    if (geo) map.set(bone.id, geo);
  }
  return map;
}
