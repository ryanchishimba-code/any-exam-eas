"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import {
  buildAllExtremityParts,
  limbCapsule,
} from "@/lib/anatomy/cartoon/extremity-geometry";
import { SkinMaterial } from "@/components/anatomy/cartoon/AnatomyMaterials";
import { HumanFaceFeatures } from "@/components/anatomy/cartoon/HumanFaceFeatures";
import { getFigureFaceTransform } from "@/lib/anatomy/cartoon/face-landmarks";
import { FIGURE } from "@/lib/anatomy/cartoon/proportions";
import { noopRaycast } from "@/lib/anatomy/cartoon/anatomy-raycast";
import {
  CARTOON_HAIR,
  CARTOON_SKIN,
  CARTOON_CAVITY_WALL,
  CARTOON_SKIN_GHOST,
  CARTOON_SKIN_SHADOW,
  TISSUE_PBR,
} from "@/lib/anatomy/cartoon/palette";

type Props = {
  /** Faint mannequin when skin layer is off — keeps human readable silhouette. */
  ghost?: boolean;
};

export function torsoLathe(f: typeof FIGURE) {
  const z = f.centerZ;
  const profile = [
    new THREE.Vector2(0.12, f.hipY - 0.1),
    new THREE.Vector2(0.22, f.hipY - 0.02),
    new THREE.Vector2(0.27, f.hipY + 0.04),
    new THREE.Vector2(0.25, f.hipY + 0.1),
    new THREE.Vector2(0.19, f.waistY - 0.14),
    new THREE.Vector2(0.155, f.waistY - 0.02),
    new THREE.Vector2(0.16, f.waistY + 0.06),
    new THREE.Vector2(0.2, f.waistY + 0.16),
    new THREE.Vector2(0.27, f.chestY - 0.26),
    new THREE.Vector2(0.31, f.chestY - 0.1),
    new THREE.Vector2(0.34, f.chestY + 0.02),
    new THREE.Vector2(0.355, f.chestY + 0.16),
    new THREE.Vector2(0.36, f.shoulderY - 0.06),
    new THREE.Vector2(f.shoulderSpan * 0.92, f.shoulderY),
    new THREE.Vector2(f.shoulderSpan * 0.78, f.shoulderY + 0.04),
    new THREE.Vector2(f.neckRadius * 1.5, f.neckY),
    new THREE.Vector2(f.neckRadius, f.neckY + 0.08),
    new THREE.Vector2(f.neckRadius * 0.85, f.neckY + 0.12),
  ];
  const geo = new THREE.LatheGeometry(profile, 52);
  geo.scale(1, 1, 0.74);
  geo.translate(0, 0, z - 0.02);
  return geo;
}

function buildBodyGeometries() {
  const f = FIGURE;
  const z = f.centerZ;
  const parts: THREE.BufferGeometry[] = [];

  parts.push(torsoLathe(f));

  parts.push(
    limbCapsule(
      new THREE.Vector3(0, f.neckY + 0.02, z + 0.01),
      new THREE.Vector3(0, f.shoulderY + 0.06, z),
      f.neckRadius * 0.95
    )
  );

  const head = new THREE.SphereGeometry(f.headRadius, 32, 32);
  head.scale(1, f.headScaleY, f.headScaleZ);
  head.translate(0, f.headY, z + 0.02);
  parts.push(head);

  const jaw = new THREE.SphereGeometry(f.headRadius * 0.76, 20, 18);
  jaw.scale(1.04, 0.52, 0.84);
  jaw.translate(0, f.headY - f.headRadius * 0.52, z + 0.06);
  parts.push(jaw);

  parts.push(...buildAllExtremityParts(f));

  const merged = mergeGeometries(parts, false);
  if (merged) merged.computeVertexNormals();

  const hair = new THREE.SphereGeometry(f.headRadius * 1.03, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.52);
  hair.scale(1, f.headScaleY * 0.95, f.headScaleZ);
  hair.translate(0, f.headY + f.headRadius * 0.3, z);

  const chestPlate = new THREE.SphereGeometry(0.14, 20, 16);
  chestPlate.scale(1.3, 0.7, 0.38);
  chestPlate.translate(0, f.chestY + 0.01, z + 0.12);

  return { shellGeo: merged, shadowGeo: chestPlate, hairGeo: hair };
}

/** Human body shell — smooth merged mesh, PBR skin, separate hair & eyes. */
export function CartoonBodyShell({ ghost = false }: Props) {
  const { shellGeo, shadowGeo, hairGeo } = useMemo(() => buildBodyGeometries(), []);
  const f = FIGURE;
  const faceTransform = useMemo(() => getFigureFaceTransform(f), [f]);
  const cavityGeo = useMemo(() => {
    if (!ghost) return null;
    const inner = torsoLathe(f);
    inner.scale(0.9, 0.94, 0.86);
    inner.computeVertexNormals();
    return inner;
  }, [f, ghost]);

  if (!shellGeo) return null;

  const skinOpacity = ghost ? 0.44 : 0.93;
  const skinColor = ghost ? CARTOON_SKIN_GHOST : CARTOON_SKIN;

  return (
    <group renderOrder={ghost ? 0 : 4}>
      {ghost && cavityGeo ? (
        <mesh geometry={cavityGeo} renderOrder={0} raycast={noopRaycast}>
          <meshStandardMaterial
            color={CARTOON_CAVITY_WALL}
            transparent
            opacity={0.14}
            roughness={0.85}
            metalness={0}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>
      ) : null}
      <mesh
        geometry={shellGeo}
        castShadow={!ghost}
        receiveShadow
        renderOrder={ghost ? 0 : 4}
        raycast={noopRaycast}
      >
        <SkinMaterial color={skinColor} opacity={skinOpacity} ghost={ghost} />
      </mesh>

      {!ghost && hairGeo ? (
        <mesh geometry={hairGeo} castShadow renderOrder={5} raycast={noopRaycast}>
          <meshStandardMaterial color={CARTOON_HAIR} roughness={0.88} metalness={0.02} />
        </mesh>
      ) : null}

      {!ghost && shadowGeo ? (
        <mesh geometry={shadowGeo} renderOrder={3} raycast={noopRaycast}>
          <meshStandardMaterial
            color={CARTOON_SKIN_SHADOW}
            transparent
            opacity={0.12}
            roughness={TISSUE_PBR.skin.roughness}
            metalness={0}
            depthWrite={false}
          />
        </mesh>
      ) : null}

      <group
        position={faceTransform.position}
        scale={faceTransform.scale}
        renderOrder={ghost ? 5 : 6}
      >
        <HumanFaceFeatures
          variant={ghost ? "bone" : "skin"}
          showSockets={ghost}
        />
      </group>
    </group>
  );
}
