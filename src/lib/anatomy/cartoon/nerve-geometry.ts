import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { ORGAN_MODULE_LAYOUT } from "./organ-layout";
import { FIGURE } from "./proportions";

export function nerveTube(from: THREE.Vector3, to: THREE.Vector3, radius: number) {
  const dir = new THREE.Vector3().subVectors(to, from);
  const length = dir.length();
  const geo = new THREE.CapsuleGeometry(radius, Math.max(0.02, length - radius * 2), 6, 10);
  const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize()
  );
  geo.applyMatrix4(new THREE.Matrix4().compose(mid, quat, new THREE.Vector3(1, 1, 1)));
  return geo;
}

/** Unit-space spinal cord with dorsal root hints and cauda equina filaments. */
export function buildSpinalCordUnitGeometry(): THREE.BufferGeometry | null {
  const parts: THREE.BufferGeometry[] = [];
  parts.push(new THREE.CapsuleGeometry(0.24, 1.02, 10, 18));

  for (let i = 0; i < 7; i++) {
    const y = 0.44 - i * 0.24;
    for (const sx of [-1, 1] as const) {
      parts.push(
        nerveTube(
          new THREE.Vector3(sx * 0.2, y, 0),
          new THREE.Vector3(sx * 0.5, y - 0.05, sx * 0.08),
          0.055
        )
      );
    }
  }

  for (let i = 0; i < 11; i++) {
    const angle = ((i / 11) - 0.5) * Math.PI * 1.05;
    parts.push(
      nerveTube(
        new THREE.Vector3(0, -0.5, 0),
        new THREE.Vector3(Math.sin(angle) * 0.62, -0.92, -0.14),
        0.038
      )
    );
  }

  return mergeGeometries(parts);
}

/** World-space cervical/cauda rootlets plus distal peripheral nerve endings. */
export function buildPeripheralNerveGeometry(): THREE.BufferGeometry | null {
  const f = FIGURE;
  const z = f.centerZ;
  const parts: THREE.BufferGeometry[] = [];

  const cord = ORGAN_MODULE_LAYOUT["spinal-cord"];
  if (cord) {
    const [cx, cy, cz] = cord.position;
    for (let i = 0; i < 7; i++) {
      const y = cy + 0.4 - i * 0.1;
      for (const sx of [-1, 1] as const) {
        parts.push(
          nerveTube(
            new THREE.Vector3(cx + sx * 0.028, y, cz),
            new THREE.Vector3(cx + sx * 0.13, y - 0.035, cz + 0.025),
            0.006
          )
        );
      }
    }
    for (let i = 0; i < 14; i++) {
      const angle = ((i / 14) - 0.5) * Math.PI * 1.15;
      const baseY = cy - 0.34;
      parts.push(
        nerveTube(
          new THREE.Vector3(cx, baseY, cz),
          new THREE.Vector3(cx + Math.sin(angle) * 0.2, baseY - 0.3, cz - 0.06),
          0.005
        )
      );
    }
  }

  for (const side of [-1, 1] as const) {
    const sx = side;
    const wrist = new THREE.Vector3(sx * f.wristX, f.wristY, z + f.wristForward);
    const elbow = new THREE.Vector3(sx * f.elbowX, f.elbowY, z + f.elbowForward);

    parts.push(nerveTube(elbow, wrist, 0.0055));

    for (let d = 0; d < 5; d++) {
      const spread = (d - 2) * 0.028;
      parts.push(
        nerveTube(
          wrist,
          new THREE.Vector3(wrist.x + spread, f.wristY - 0.1, z + f.wristForward + 0.075),
          0.0042
        )
      );
    }

    parts.push(
      nerveTube(
        new THREE.Vector3(sx * f.elbowX * 0.9, f.elbowY - 0.03, z + 0.03),
        new THREE.Vector3(sx * f.wristX * 0.94, f.wristY + 0.025, z + 0.05),
        0.0048
      )
    );

    const hipX = sx * f.hipSpan;
    const knee = new THREE.Vector3(hipX, f.kneeY, z + f.kneeForward);
    const ankle = new THREE.Vector3(hipX * 0.96, f.ankleY, z + 0.045);

    parts.push(
      nerveTube(new THREE.Vector3(hipX, f.hipY + 0.1, z - 0.07), knee, 0.006)
    );
    parts.push(nerveTube(knee, ankle, 0.0055));

    for (let d = 0; d < 5; d++) {
      const spread = (d - 2) * 0.03;
      parts.push(
        nerveTube(
          ankle,
          new THREE.Vector3(hipX + spread, f.footY + 0.025, z + f.footLength * 0.58),
          0.004
        )
      );
    }

    parts.push(
      nerveTube(
        ankle,
        new THREE.Vector3(hipX, f.footY + 0.05, z + f.footLength * 0.5),
        0.0045
      )
    );
  }

  return mergeGeometries(parts);
}
