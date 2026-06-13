/**
 * Per-bone mesh geometry for the clickable skeleton.
 */

import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { longBone, buildSingleInnominateParts, buildSingleScapulaParts } from "../cartoon/bone-geometry";
import {
  buildCarpalParts,
  buildPatellaParts,
  buildPhalanxParts,
  buildTarsalParts,
} from "../cartoon/digit-bone-geometry";
import {
  parseCarpalName,
  parseMetacarpal,
  parseMetatarsal,
  parsePhalanxKind,
  parseTarsalName,
} from "../cartoon/digit-placements";
import { FIGURE } from "../cartoon/proportions";
import {
  buildSacrumBoneParts,
  buildSingleClavicleParts,
  buildSingleRibParts,
  buildSternumBoneParts,
  buildVertebraBoneParts,
} from "../cartoon/skeletal-geometry";
import { buildCoccyxBoneParts } from "../cartoon/bone-geometry";
import type { BoneInstance } from "./instances";
import { buildSkullBoneWorldParts, parseSkullBoneId } from "../cartoon/skull-bone-geometry";
import {
  buildHyoidWorldParts,
  buildOssicleWorldParts,
  parseOssicleName,
} from "../cartoon/ossicle-hyoid-geometry";

function mergeParts(parts: THREE.BufferGeometry[]): THREE.BufferGeometry | null {
  if (parts.length === 0) return null;
  const merged = mergeGeometries(parts, false);
  if (merged) merged.computeVertexNormals();
  return merged;
}

function vertebraParams(boneId: string): {
  bodyHeight: number;
  taper: number;
  thoracic: boolean;
} {
  const prefix = boneId.charAt(0);
  if (prefix === "c") return { bodyHeight: 0.014, taper: 0.88, thoracic: false };
  if (prefix === "t") return { bodyHeight: 0.017, taper: 0.96, thoracic: true };
  return { bodyHeight: 0.02, taper: 1.06, thoracic: false };
}

function parseRibIndex(boneId: string): number | null {
  const match = /^rib-(\d+)-[rl]$/.exec(boneId);
  if (!match) return null;
  return Number.parseInt(match[1]!, 10) - 1;
}

function parseClavicleSide(boneId: string): -1 | 1 | null {
  if (boneId === "clavicle-r") return -1;
  if (boneId === "clavicle-l") return 1;
  return null;
}

function parseScapulaSide(boneId: string): -1 | 1 | null {
  if (boneId === "scapula-r") return -1;
  if (boneId === "scapula-l") return 1;
  return null;
}

function parseInnominateSide(boneId: string): -1 | 1 | null {
  if (boneId === "innominate-r") return -1;
  if (boneId === "innominate-l") return 1;
  return null;
}

export function createBoneMeshGeometry(bone: BoneInstance): THREE.BufferGeometry | null {
  const z = FIGURE.centerZ;

  const ribIndex = parseRibIndex(bone.id);
  if (ribIndex !== null) {
    const sx = bone.id.endsWith("-r") ? (-1 as const) : (1 as const);
    return mergeParts(buildSingleRibParts(ribIndex, sx, FIGURE, z));
  }

  const clavicleSide = parseClavicleSide(bone.id);
  if (clavicleSide !== null) {
    return mergeParts(buildSingleClavicleParts(clavicleSide, FIGURE, z));
  }

  if (bone.id === "sternum-bone") {
    return mergeParts(buildSternumBoneParts(FIGURE, z));
  }

  if (bone.id === "sacrum") {
    return mergeParts(buildSacrumBoneParts(FIGURE, z));
  }

  if (bone.id === "coccyx") {
    return mergeParts(buildCoccyxBoneParts(FIGURE, z));
  }

  const scapulaSide = parseScapulaSide(bone.id);
  if (scapulaSide !== null) {
    return mergeParts(buildSingleScapulaParts(scapulaSide, FIGURE, z));
  }

  const innominateSide = parseInnominateSide(bone.id);
  if (innominateSide !== null) {
    return mergeParts(buildSingleInnominateParts(innominateSide, FIGURE, z));
  }

  if (bone.id.endsWith("-vertebra") && bone.position) {
    const { bodyHeight, taper, thoracic } = vertebraParams(bone.id);
    const spinous = !bone.id.startsWith("c1-");
    return mergeParts(
      buildVertebraBoneParts(bone.position.y, bone.position.z, bodyHeight, taper, thoracic, spinous)
    );
  }

  const carpalName = parseCarpalName(bone.id);
  if (carpalName && bone.position) {
    return mergeParts(buildCarpalParts(carpalName, bone.position));
  }

  const tarsalName = parseTarsalName(bone.id);
  if (tarsalName && bone.position) {
    return mergeParts(buildTarsalParts(tarsalName, bone.position));
  }

  if (bone.id.startsWith("patella-") && bone.position) {
    return mergeParts(buildPatellaParts(bone.position));
  }

  const phalanxKind = parsePhalanxKind(bone.id);
  if (phalanxKind && bone.from && bone.to && bone.shaftR) {
    return mergeParts(
      buildPhalanxParts(bone.from, bone.to, bone.shaftR, {
        distal: phalanxKind.distal,
        metacarpal: false,
        metatarsal: false,
      })
    );
  }

  if (parseSkullBoneId(bone.id)) {
    const skullParts = buildSkullBoneWorldParts(bone.id, FIGURE, z);
    if (skullParts) return mergeParts(skullParts);
  }

  if (parseOssicleName(bone.id)) {
    const ossicleParts = buildOssicleWorldParts(bone.id, FIGURE, z);
    if (ossicleParts) return mergeParts(ossicleParts);
  }

  if (bone.id === "hyoid") {
    return mergeParts(buildHyoidWorldParts(FIGURE, z));
  }

  const parts: THREE.BufferGeometry[] = [];

  if (bone.from && bone.to && bone.shaftR) {
    if (parseMetacarpal(bone.id) || parseMetatarsal(bone.id)) {
      parts.push(
        ...buildPhalanxParts(bone.from, bone.to, bone.shaftR, {
          metacarpal: parseMetacarpal(bone.id),
          metatarsal: parseMetatarsal(bone.id),
        })
      );
    } else {
      parts.push(...longBone(bone.from, bone.to, bone.shaftR, { proximalR: bone.shaftR * 1.5, distalR: bone.shaftR * 1.3 }));
    }
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

  return mergeParts(parts);
}

export function createBoneMeshMap(bones: BoneInstance[]): Map<string, THREE.BufferGeometry> {
  const map = new Map<string, THREE.BufferGeometry>();
  for (const bone of bones) {
    const geo = createBoneMeshGeometry(bone);
    if (geo) map.set(bone.id, geo);
  }
  return map;
}
