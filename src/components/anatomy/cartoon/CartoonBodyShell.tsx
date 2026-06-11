"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { SkinMaterial } from "@/components/anatomy/cartoon/AnatomyMaterials";
import { FIGURE } from "@/lib/anatomy/cartoon/proportions";
import {
  CARTOON_EYE_IRIS,
  CARTOON_EYE_WHITE,
  CARTOON_HAIR,
  CARTOON_SKIN,
  CARTOON_SKIN_GHOST,
  CARTOON_SKIN_SHADOW,
  TISSUE_PBR,
} from "@/lib/anatomy/cartoon/palette";

type Props = {
  /** Faint mannequin when skin layer is off — keeps human readable silhouette. */
  ghost?: boolean;
};

function limbCapsule(
  from: THREE.Vector3,
  to: THREE.Vector3,
  radius: number,
  radialSegments = 16
) {
  const dir = new THREE.Vector3().subVectors(to, from);
  const length = dir.length();
  const geo = new THREE.CapsuleGeometry(radius, Math.max(0.04, length - radius * 2), 10, radialSegments);
  const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize()
  );
  geo.applyMatrix4(new THREE.Matrix4().compose(mid, quat, new THREE.Vector3(1, 1, 1)));
  return geo;
}

function torsoLathe(f: typeof FIGURE) {
  const z = f.centerZ;
  const profile = [
    new THREE.Vector2(0.19, f.hipY - 0.06),
    new THREE.Vector2(0.25, f.hipY + 0.02),
    new THREE.Vector2(0.27, f.hipY + 0.08),
    new THREE.Vector2(0.24, f.waistY - 0.1),
    new THREE.Vector2(0.19, f.waistY),
    new THREE.Vector2(0.21, f.waistY + 0.1),
    new THREE.Vector2(0.27, f.chestY - 0.2),
    new THREE.Vector2(0.33, f.chestY - 0.06),
    new THREE.Vector2(0.36, f.chestY + 0.06),
    new THREE.Vector2(0.38, f.chestY + 0.18),
    new THREE.Vector2(f.shoulderSpan, f.shoulderY),
    new THREE.Vector2(f.shoulderSpan * 0.86, f.shoulderY + 0.06),
    new THREE.Vector2(f.neckRadius * 1.5, f.neckY + 0.02),
    new THREE.Vector2(f.neckRadius, f.neckY + 0.08),
  ];
  const geo = new THREE.LatheGeometry(profile, 48);
  geo.scale(1, 1, 0.68);
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
      new THREE.Vector3(0, f.neckY + 0.04, z + 0.02),
      new THREE.Vector3(0, f.shoulderY + 0.08, z + 0.01),
      f.neckRadius
    )
  );

  const head = new THREE.SphereGeometry(f.headRadius, 32, 32);
  head.scale(1, f.headScaleY, f.headScaleZ);
  head.translate(0, f.headY, z + 0.03);
  parts.push(head);

  const jaw = new THREE.SphereGeometry(f.headRadius * 0.78, 20, 18);
  jaw.scale(1.02, 0.55, 0.82);
  jaw.translate(0, f.headY - f.headRadius * 0.55, z + 0.07);
  parts.push(jaw);

  for (const sx of [-1, 1] as const) {
    const shoulder = new THREE.Vector3(sx * f.shoulderSpan, f.shoulderY, z + 0.02);
    const elbow = new THREE.Vector3(sx * f.elbowX, f.elbowY, z + 0.07);
    const wrist = new THREE.Vector3(sx * f.wristX, f.wristY, z + 0.05);

    parts.push(limbCapsule(shoulder, elbow, f.upperArmRadius));
    parts.push(limbCapsule(elbow, wrist, f.forearmRadius));

    const hand = new THREE.SphereGeometry(0.058, 14, 14);
    hand.scale(0.75, 1.0, 0.48);
    hand.translate(wrist.x, wrist.y - 0.07, wrist.z + 0.02);
    parts.push(hand);

    const hip = new THREE.Vector3(sx * f.hipSpan, f.hipY, z);
    const knee = new THREE.Vector3(sx * f.hipSpan * 0.94, f.kneeY, z + 0.02);
    const ankle = new THREE.Vector3(sx * f.hipSpan * 0.82, f.ankleY, z + 0.03);
    parts.push(limbCapsule(hip, knee, f.thighRadius));
    parts.push(limbCapsule(knee, ankle, f.calfRadius));

    const foot = new THREE.CapsuleGeometry(0.045, 0.14, 6, 12);
    foot.rotateX(Math.PI / 2);
    foot.translate(sx * f.hipSpan * 0.82, f.footY + 0.03, z + 0.14);
    parts.push(foot);
  }

  const merged = mergeGeometries(parts, false);
  if (merged) merged.computeVertexNormals();

  const hair = new THREE.SphereGeometry(f.headRadius * 1.04, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.55);
  hair.scale(1, f.headScaleY * 0.96, f.headScaleZ);
  hair.translate(0, f.headY + f.headRadius * 0.32, z + 0.01);

  const chestPlate = new THREE.SphereGeometry(0.15, 20, 16);
  chestPlate.scale(1.35, 0.75, 0.42);
  chestPlate.translate(0, f.chestY + 0.02, z + 0.14);

  return { shellGeo: merged, shadowGeo: chestPlate, hairGeo: hair };
}

/** Human body shell — smooth merged mesh, PBR skin, separate hair & eyes. */
export function CartoonBodyShell({ ghost = false }: Props) {
  const { shellGeo, shadowGeo, hairGeo } = useMemo(() => buildBodyGeometries(), []);
  const f = FIGURE;

  if (!shellGeo) return null;

  const skinOpacity = ghost ? 0.22 : 0.96;
  const skinColor = ghost ? CARTOON_SKIN_GHOST : CARTOON_SKIN;

  return (
    <group renderOrder={ghost ? 0 : 4}>
      <mesh geometry={shellGeo} castShadow={!ghost} receiveShadow renderOrder={ghost ? 0 : 4}>
        <SkinMaterial color={skinColor} opacity={skinOpacity} ghost={ghost} />
      </mesh>

      {!ghost && hairGeo ? (
        <mesh geometry={hairGeo} castShadow renderOrder={5}>
          <meshStandardMaterial
            color={CARTOON_HAIR}
            roughness={0.85}
            metalness={0.02}
          />
        </mesh>
      ) : null}

      {!ghost ? (
        <mesh geometry={shadowGeo} renderOrder={3}>
          <meshStandardMaterial
            color={CARTOON_SKIN_SHADOW}
            transparent
            opacity={0.18}
            roughness={TISSUE_PBR.skin.roughness}
            metalness={0}
            depthWrite={false}
          />
        </mesh>
      ) : null}

      {!ghost
        ? ([-1, 1] as const).map((sx) => (
            <group
              key={sx}
              position={[sx * f.eyeOffsetX, f.headY + f.eyeOffsetY, f.centerZ + f.eyeOffsetZ]}
            >
              <mesh renderOrder={6}>
                <sphereGeometry args={[f.eyeRadius * 1.15, 12, 12]} />
                <meshStandardMaterial color={CARTOON_EYE_WHITE} roughness={0.35} metalness={0} />
              </mesh>
              <mesh position={[0, 0, 0.012]} renderOrder={7}>
                <sphereGeometry args={[f.eyeRadius * 0.72, 10, 10]} />
                <meshStandardMaterial color={CARTOON_EYE_IRIS} roughness={0.4} metalness={0.05} />
              </mesh>
            </group>
          ))
        : null}
    </group>
  );
}
