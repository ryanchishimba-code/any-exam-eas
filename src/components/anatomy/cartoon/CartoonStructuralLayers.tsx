"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { FIGURE } from "@/lib/anatomy/cartoon/proportions";
import { StandardTissueMaterial } from "@/components/anatomy/cartoon/AnatomyMaterials";
import {
  CARTOON_ARTERY,
  CARTOON_MUSCLE,
  CARTOON_VEIN,
  TISSUE_PBR,
} from "@/lib/anatomy/cartoon/palette";
import type { AnatomyLayer } from "@/lib/anatomy/types";

type Props = {
  visibleLayers: Set<AnatomyLayer>;
  skinOn: boolean;
};

function tube(from: THREE.Vector3, to: THREE.Vector3, radius: number) {
  const dir = new THREE.Vector3().subVectors(to, from);
  const length = dir.length();
  const geo = new THREE.CapsuleGeometry(radius, Math.max(0.03, length - radius * 2), 6, 12);
  const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize()
  );
  geo.applyMatrix4(new THREE.Matrix4().compose(mid, quat, new THREE.Vector3(1, 1, 1)));
  return geo;
}

function layerOpacity(skinOn: boolean, peek: number, full: number) {
  return skinOn ? peek : full;
}

function StructuralMesh({
  geometry,
  color,
  opacity,
  renderOrder,
  tissue,
}: {
  geometry: THREE.BufferGeometry | null;
  color: string;
  opacity: number;
  renderOrder: number;
  tissue: keyof typeof TISSUE_PBR;
}) {
  if (!geometry) return null;
  const pbr = TISSUE_PBR[tissue];
  return (
    <mesh geometry={geometry} renderOrder={renderOrder} castShadow={opacity > 0.5}>
      <StandardTissueMaterial
        color={color}
        opacity={opacity}
        roughness={pbr.roughness}
        metalness={pbr.metalness}
      />
    </mesh>
  );
}

function buildMuscleGeometry() {
  const f = FIGURE;
  const z = f.centerZ;
  const parts: THREE.BufferGeometry[] = [];

  const trap = new THREE.BoxGeometry(0.32, 0.11, 0.032);
  trap.translate(0, f.shoulderY - 0.05, z - 0.1);
  parts.push(trap);

  for (const sx of [-1, 1] as const) {
    const lat = new THREE.SphereGeometry(0.105, 14, 14);
    lat.scale(1.15, 0.82, 0.32);
    lat.translate(sx * 0.2, f.chestY - 0.14, z - 0.09);
    parts.push(lat);

    const pec = new THREE.SphereGeometry(0.105, 14, 14);
    pec.scale(1.1, 0.72, 0.45);
    pec.translate(sx * 0.1, f.chestY + 0.02, z + 0.1);
    parts.push(pec);

    const delt = new THREE.SphereGeometry(0.078, 14, 14);
    delt.scale(1.12, 0.86, 0.8);
    delt.translate(sx * f.shoulderSpan, f.shoulderY - 0.02, z + 0.03);
    parts.push(delt);

    for (let i = 0; i < 3; i++) {
      const serr = new THREE.BoxGeometry(0.038, 0.042, 0.02);
      serr.translate(sx * 0.15, f.chestY - 0.06 - i * 0.068, z + 0.065);
      parts.push(serr);
    }
  }

  for (let row = 0; row < 4; row++) {
    for (const sx of [-1, 1] as const) {
      const ab = new THREE.BoxGeometry(0.072, 0.045, 0.026);
      ab.translate(sx * 0.04, f.waistY + 0.2 - row * 0.062, z + 0.095);
      parts.push(ab);
    }
  }

  for (const sx of [-1, 1] as const) {
    const oblique = new THREE.BoxGeometry(0.052, 0.17, 0.028);
    oblique.translate(sx * 0.13, f.waistY + 0.06, z + 0.075);
    parts.push(oblique);
  }

  const diaphragm = new THREE.CylinderGeometry(0.22, 0.26, 0.026, 28, 1, false, 0, Math.PI);
  diaphragm.rotateX(Math.PI / 2);
  diaphragm.rotateZ(Math.PI);
  diaphragm.translate(0, f.waistY + 0.2, z - 0.02);
  parts.push(diaphragm);

  for (const sx of [-1, 1] as const) {
    const shoulder = new THREE.Vector3(sx * f.shoulderSpan, f.shoulderY - 0.02, z + 0.02);
    const elbow = new THREE.Vector3(sx * f.elbowX, f.elbowY, z + f.elbowForward);
    const wrist = new THREE.Vector3(sx * f.wristX, f.wristY, z + f.wristForward);
    const hip = new THREE.Vector3(sx * f.hipSpan, f.hipY + 0.02, z - 0.01);
    const knee = new THREE.Vector3(sx * f.hipSpan * 0.96, f.kneeY, z + f.kneeForward);
    const ankle = new THREE.Vector3(sx * f.hipSpan * 0.88, f.ankleY, z + 0.02);

    const bicepMid = new THREE.Vector3().addVectors(shoulder, elbow).multiplyScalar(0.5);
    bicepMid.z += 0.035;
    parts.push(tube(shoulder, elbow, 0.046));
    const bicepBulge = new THREE.SphereGeometry(0.052, 12, 12);
    bicepBulge.scale(0.82, 1.32, 0.72);
    bicepBulge.translate(bicepMid.x, bicepMid.y, bicepMid.z);
    parts.push(bicepBulge);

    const tri = new THREE.SphereGeometry(0.048, 12, 12);
    tri.scale(0.72, 1.28, 0.68);
    tri.translate(sx * f.elbowX * 0.95, f.elbowY + 0.05, z - 0.01);
    parts.push(tri);

    parts.push(tube(elbow, wrist, 0.038));

    const glute = new THREE.SphereGeometry(0.085, 14, 14);
    glute.scale(1.02, 0.72, 0.62);
    glute.translate(sx * f.hipSpan * 1.02, f.hipY + 0.02, z - 0.055);
    parts.push(glute);

    parts.push(tube(hip, knee, 0.065));
    const quad = new THREE.SphereGeometry(0.062, 12, 12);
    quad.scale(0.88, 1.22, 0.82);
    quad.translate(sx * f.hipSpan * 0.97, f.kneeY + 0.12, z + 0.04);
    parts.push(quad);

    const ham = new THREE.SphereGeometry(0.055, 12, 12);
    ham.scale(0.82, 1.18, 0.72);
    ham.translate(sx * f.hipSpan * 0.94, f.kneeY + 0.08, z - 0.035);
    parts.push(ham);

    parts.push(tube(knee, ankle, 0.044));
    const calf = new THREE.SphereGeometry(0.052, 12, 12);
    calf.scale(0.85, 1.28, 0.8);
    calf.translate(sx * f.hipSpan * 0.87, f.kneeY - 0.13, z - 0.02);
    parts.push(calf);
  }

  const merged = mergeGeometries(parts, false);
  if (merged) merged.computeVertexNormals();
  return merged;
}

function buildVascularGeometry() {
  const f = FIGURE;
  const z = f.centerZ;
  const arteryParts: THREE.BufferGeometry[] = [];

  const aorticArch = new THREE.TorusGeometry(0.12, 0.014, 8, 24, Math.PI);
  aorticArch.rotateY(Math.PI / 2);
  aorticArch.translate(0.01, f.chestY + 0.26, z - 0.02);
  arteryParts.push(aorticArch);

  arteryParts.push(
    tube(
      new THREE.Vector3(0.01, f.chestY + 0.26, z - 0.02),
      new THREE.Vector3(0.01, f.hipY + 0.12, z - 0.04),
      0.016
    )
  );

  for (const sx of [-1, 1] as const) {
    arteryParts.push(
      tube(
        new THREE.Vector3(sx * 0.035, f.chestY + 0.22, z + 0.01),
        new THREE.Vector3(sx * 0.045, f.neckY + 0.02, z + 0.04),
        0.011
      )
    );
    arteryParts.push(
      tube(
        new THREE.Vector3(sx * 0.065, f.chestY + 0.18, z + 0.02),
        new THREE.Vector3(sx * f.elbowX, f.elbowY, z + f.elbowForward * 0.6),
        0.009
      )
    );
    arteryParts.push(
      tube(
        new THREE.Vector3(sx * 0.045, f.hipY + 0.02, z),
        new THREE.Vector3(sx * f.hipSpan, f.kneeY, z + f.kneeForward * 0.5),
        0.01
      )
    );
  }

  const veinParts: THREE.BufferGeometry[] = [];

  veinParts.push(
    tube(
      new THREE.Vector3(0.04, f.chestY + 0.1, z - 0.02),
      new THREE.Vector3(0.04, f.hipY + 0.08, z - 0.03),
      0.014
    )
  );

  for (const sx of [-1, 1] as const) {
    veinParts.push(
      tube(
        new THREE.Vector3(sx * 0.055, f.headY - 0.08, z + 0.02),
        new THREE.Vector3(sx * 0.065, f.chestY + 0.06, z + 0.03),
        0.009
      )
    );
    veinParts.push(
      tube(
        new THREE.Vector3(sx * f.wristX, f.wristY, z + f.wristForward),
        new THREE.Vector3(sx * f.elbowX, f.elbowY, z + f.elbowForward * 0.5),
        0.008
      )
    );
    veinParts.push(
      tube(
        new THREE.Vector3(sx * f.hipSpan, f.kneeY, z + f.kneeForward * 0.5),
        new THREE.Vector3(sx * f.hipSpan * 0.88, f.ankleY, z + 0.02),
        0.008
      )
    );
  }

  return {
    arteries: mergeGeometries(arteryParts, false),
    veins: mergeGeometries(veinParts, false),
  };
}

/** Full-body muscle and vascular shells — bones use ClickableSkeleton. */
export function CartoonStructuralLayers({ visibleLayers, skinOn }: Props) {
  const showMuscle = visibleLayers.has("muscle");
  const showVascular = visibleLayers.has("vascular");

  const muscleGeo = useMemo(() => (showMuscle ? buildMuscleGeometry() : null), [showMuscle]);
  const vascularGeo = useMemo(
    () => (showVascular ? buildVascularGeometry() : null),
    [showVascular]
  );

  if (!showMuscle && !showVascular) return null;

  return (
    <group>
      <StructuralMesh
        geometry={muscleGeo}
        color={CARTOON_MUSCLE}
        opacity={layerOpacity(skinOn, 0.68, 0.92)}
        renderOrder={2}
        tissue="muscle"
      />
      {vascularGeo?.arteries ? (
        <StructuralMesh
          geometry={vascularGeo.arteries}
          color={CARTOON_ARTERY}
          opacity={layerOpacity(skinOn, 0.8, 0.96)}
          renderOrder={3}
          tissue="vessel"
        />
      ) : null}
      {vascularGeo?.veins ? (
        <StructuralMesh
          geometry={vascularGeo.veins}
          color={CARTOON_VEIN}
          opacity={layerOpacity(skinOn, 0.7, 0.9)}
          renderOrder={3}
          tissue="vessel"
        />
      ) : null}
    </group>
  );
}
