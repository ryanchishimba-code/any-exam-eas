"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { FIGURE } from "@/lib/anatomy/cartoon/proportions";
import { StandardTissueMaterial } from "@/components/anatomy/cartoon/AnatomyMaterials";
import {
  CARTOON_ARTERY,
  CARTOON_BONE,
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

function buildBoneGeometry() {
  const f = FIGURE;
  const z = f.centerZ;
  const parts: THREE.BufferGeometry[] = [];

  const skull = new THREE.SphereGeometry(f.headRadius * 1.1, 28, 28);
  skull.scale(1, f.headScaleY, f.headScaleZ);
  skull.translate(0, f.headY, z + 0.02);
  parts.push(skull);

  const jaw = new THREE.SphereGeometry(f.headRadius * 0.72, 16, 12);
  jaw.scale(1, 0.42, 0.72);
  jaw.translate(0, f.headY - f.headRadius * 0.58, z + 0.05);
  parts.push(jaw);

  for (let i = 0; i < 5; i++) {
    const ribY = f.chestY + 0.1 - i * 0.085;
    const ribR = 0.23 - i * 0.016;
    const rib = new THREE.TorusGeometry(ribR, 0.012, 6, 24, Math.PI * 1.05);
    rib.rotateX(Math.PI / 2);
    rib.translate(0, ribY, z - 0.04);
    parts.push(rib);
  }

  const sternum = new THREE.BoxGeometry(0.055, 0.34, 0.028);
  sternum.translate(0, f.chestY + 0.02, z + 0.1);
  parts.push(sternum);

  parts.push(
    tube(
      new THREE.Vector3(0, f.hipY + 0.15, z - 0.13),
      new THREE.Vector3(0, f.shoulderY + 0.05, z - 0.12),
      0.038
    )
  );

  for (const sx of [-1, 1] as const) {
    const clav = new THREE.CapsuleGeometry(0.018, 0.16, 4, 10);
    clav.rotateZ(sx * 0.25);
    clav.translate(sx * 0.11, f.shoulderY + 0.04, z + 0.08);
    parts.push(clav);

    const scap = new THREE.BoxGeometry(0.09, 0.12, 0.022);
    scap.rotateY(sx * 0.3);
    scap.translate(sx * 0.26, f.chestY + 0.06, z - 0.09);
    parts.push(scap);
  }

  const pelvis = new THREE.BoxGeometry(0.26, 0.09, 0.12);
  pelvis.translate(0, f.hipY, z - 0.05);
  parts.push(pelvis);

  for (const sx of [-1, 1] as const) {
    const shoulder = new THREE.Vector3(sx * f.shoulderSpan, f.shoulderY, z + 0.02);
    const elbow = new THREE.Vector3(sx * f.elbowX, f.elbowY, z + 0.05);
    const wrist = new THREE.Vector3(sx * f.wristX, f.wristY, z + 0.04);
    const hip = new THREE.Vector3(sx * f.hipSpan, f.hipY, z);
    const knee = new THREE.Vector3(sx * f.hipSpan * 0.94, f.kneeY, z + 0.02);
    const ankle = new THREE.Vector3(sx * f.hipSpan * 0.82, f.ankleY, z + 0.03);

    parts.push(tube(shoulder, elbow, 0.024));
    parts.push(tube(elbow, wrist, 0.019));
    parts.push(tube(hip, knee, 0.032));
    parts.push(tube(knee, ankle, 0.026));
  }

  const merged = mergeGeometries(parts, false);
  if (merged) merged.computeVertexNormals();
  return merged;
}

function buildMuscleGeometry() {
  const f = FIGURE;
  const z = f.centerZ;
  const parts: THREE.BufferGeometry[] = [];

  // Upper back — trapezius
  const trap = new THREE.BoxGeometry(0.34, 0.12, 0.035);
  trap.translate(0, f.shoulderY - 0.04, z - 0.11);
  parts.push(trap);

  for (const sx of [-1, 1] as const) {
    // Latissimus dorsi
    const lat = new THREE.SphereGeometry(0.11, 14, 14);
    lat.scale(1.2, 0.85, 0.35);
    lat.translate(sx * 0.22, f.chestY - 0.12, z - 0.1);
    parts.push(lat);

    // Pectoralis major
    const pec = new THREE.SphereGeometry(0.11, 14, 14);
    pec.scale(1.15, 0.75, 0.48);
    pec.translate(sx * 0.11, f.chestY + 0.04, z + 0.11);
    parts.push(pec);

    // Deltoid
    const delt = new THREE.SphereGeometry(0.082, 14, 14);
    delt.scale(1.15, 0.88, 0.82);
    delt.translate(sx * f.shoulderSpan, f.shoulderY, z + 0.04);
    parts.push(delt);

    // Serratus anterior — rib-side slips
    for (let i = 0; i < 3; i++) {
      const serr = new THREE.BoxGeometry(0.04, 0.045, 0.022);
      serr.translate(sx * 0.16, f.chestY - 0.04 - i * 0.07, z + 0.07);
      parts.push(serr);
    }
  }

  // Rectus abdominis — segmented blocks
  for (let row = 0; row < 4; row++) {
    for (const sx of [-1, 1] as const) {
      const ab = new THREE.BoxGeometry(0.075, 0.048, 0.028);
      ab.translate(sx * 0.042, f.waistY + 0.22 - row * 0.065, z + 0.1);
      parts.push(ab);
    }
  }

  // External obliques
  for (const sx of [-1, 1] as const) {
    const oblique = new THREE.BoxGeometry(0.055, 0.18, 0.03);
    oblique.translate(sx * 0.14, f.waistY + 0.08, z + 0.08);
    parts.push(oblique);
  }

  // Diaphragm dome
  const diaphragm = new THREE.CylinderGeometry(0.23, 0.27, 0.032, 28, 1, false, 0, Math.PI);
  diaphragm.rotateX(Math.PI / 2);
  diaphragm.rotateZ(Math.PI);
  diaphragm.translate(0, f.waistY + 0.2, z - 0.01);
  parts.push(diaphragm);

  for (const sx of [-1, 1] as const) {
    const shoulder = new THREE.Vector3(sx * f.shoulderSpan, f.shoulderY, z + 0.03);
    const elbow = new THREE.Vector3(sx * f.elbowX, f.elbowY, z + 0.05);
    const wrist = new THREE.Vector3(sx * f.wristX, f.wristY, z + 0.04);
    const hip = new THREE.Vector3(sx * f.hipSpan, f.hipY, z);
    const knee = new THREE.Vector3(sx * f.hipSpan * 0.94, f.kneeY, z + 0.02);
    const ankle = new THREE.Vector3(sx * f.hipSpan * 0.82, f.ankleY, z + 0.03);

    // Biceps — anterior upper arm
    const bicepMid = new THREE.Vector3().addVectors(shoulder, elbow).multiplyScalar(0.5);
    bicepMid.z += 0.04;
    parts.push(tube(shoulder, elbow, 0.048));
    const bicepBulge = new THREE.SphereGeometry(0.055, 12, 12);
    bicepBulge.scale(0.85, 1.35, 0.75);
    bicepBulge.translate(bicepMid.x, bicepMid.y, bicepMid.z);
    parts.push(bicepBulge);

    // Triceps — posterior upper arm
    const tri = new THREE.SphereGeometry(0.05, 12, 12);
    tri.scale(0.75, 1.3, 0.7);
    tri.translate(sx * f.elbowX * 0.95, f.elbowY + 0.06, z - 0.01);
    parts.push(tri);

    // Forearm flexors
    parts.push(tube(elbow, wrist, 0.04));

    // Gluteus
    const glute = new THREE.SphereGeometry(0.09, 14, 14);
    glute.scale(1.05, 0.75, 0.65);
    glute.translate(sx * f.hipSpan * 1.05, f.hipY + 0.02, z - 0.06);
    parts.push(glute);

    // Quadriceps — anterior thigh
    parts.push(tube(hip, knee, 0.068));
    const quad = new THREE.SphereGeometry(0.065, 12, 12);
    quad.scale(0.9, 1.25, 0.85);
    quad.translate(sx * f.hipSpan * 0.98, f.kneeY + 0.14, z + 0.05);
    parts.push(quad);

    // Hamstrings — posterior thigh
    const ham = new THREE.SphereGeometry(0.058, 12, 12);
    ham.scale(0.85, 1.2, 0.75);
    ham.translate(sx * f.hipSpan * 0.95, f.kneeY + 0.1, z - 0.04);
    parts.push(ham);

    // Calf (gastrocnemius)
    parts.push(tube(knee, ankle, 0.046));
    const calf = new THREE.SphereGeometry(0.055, 12, 12);
    calf.scale(0.88, 1.3, 0.82);
    calf.translate(sx * f.hipSpan * 0.88, f.kneeY - 0.14, z - 0.025);
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

  const aorticArch = new THREE.TorusGeometry(0.12, 0.016, 8, 24, Math.PI);
  aorticArch.rotateY(Math.PI / 2);
  aorticArch.translate(0.02, f.chestY + 0.26, z - 0.02);
  arteryParts.push(aorticArch);

  arteryParts.push(
    tube(
      new THREE.Vector3(0.02, f.chestY + 0.26, z - 0.02),
      new THREE.Vector3(0.02, f.hipY + 0.18, z - 0.04),
      0.018
    )
  );

  for (const sx of [-1, 1] as const) {
    arteryParts.push(
      tube(
        new THREE.Vector3(sx * 0.04, f.chestY + 0.24, z + 0.02),
        new THREE.Vector3(sx * 0.05, f.neckY + 0.04, z + 0.05),
        0.012
      )
    );
    arteryParts.push(
      tube(
        new THREE.Vector3(sx * 0.07, f.chestY + 0.2, z + 0.03),
        new THREE.Vector3(sx * f.elbowX, f.elbowY, z + 0.04),
        0.01
      )
    );
    arteryParts.push(
      tube(
        new THREE.Vector3(sx * 0.05, f.hipY + 0.04, z + 0.01),
        new THREE.Vector3(sx * f.hipSpan, f.kneeY, z + 0.02),
        0.011
      )
    );
  }

  const veinParts: THREE.BufferGeometry[] = [];
  for (const sx of [-1, 1] as const) {
    veinParts.push(
      tube(
        new THREE.Vector3(sx * 0.06, f.headY - 0.06, z + 0.03),
        new THREE.Vector3(sx * 0.07, f.chestY + 0.08, z + 0.04),
        0.01
      )
    );
    veinParts.push(
      tube(
        new THREE.Vector3(sx * f.wristX, f.wristY, z + 0.04),
        new THREE.Vector3(sx * f.elbowX, f.elbowY, z + 0.03),
        0.009
      )
    );
  }

  return {
    arteries: mergeGeometries(arteryParts, false),
    veins: mergeGeometries(veinParts, false),
  };
}

/** Full-body bone, muscle, and vascular shells — visible per layer toggle. */
export function CartoonStructuralLayers({ visibleLayers, skinOn }: Props) {
  const showBone = visibleLayers.has("bone");
  const showMuscle = visibleLayers.has("muscle");
  const showVascular = visibleLayers.has("vascular");

  const boneGeo = useMemo(() => (showBone ? buildBoneGeometry() : null), [showBone]);
  const muscleGeo = useMemo(() => (showMuscle ? buildMuscleGeometry() : null), [showMuscle]);
  const vascularGeo = useMemo(
    () => (showVascular ? buildVascularGeometry() : null),
    [showVascular]
  );

  if (!showBone && !showMuscle && !showVascular) return null;

  return (
    <group>
      <StructuralMesh
        geometry={boneGeo}
        color={CARTOON_BONE}
        opacity={layerOpacity(skinOn, 0.78, 0.94)}
        renderOrder={1}
        tissue="bone"
      />
      <StructuralMesh
        geometry={muscleGeo}
        color={CARTOON_MUSCLE}
        opacity={layerOpacity(skinOn, 0.7, 0.92)}
        renderOrder={2}
        tissue="muscle"
      />
      {vascularGeo?.arteries ? (
        <StructuralMesh
          geometry={vascularGeo.arteries}
          color={CARTOON_ARTERY}
          opacity={layerOpacity(skinOn, 0.82, 0.96)}
          renderOrder={3}
          tissue="vessel"
        />
      ) : null}
      {vascularGeo?.veins ? (
        <StructuralMesh
          geometry={vascularGeo.veins}
          color={CARTOON_VEIN}
          opacity={layerOpacity(skinOn, 0.72, 0.9)}
          renderOrder={3}
          tissue="vessel"
        />
      ) : null}
    </group>
  );
}
