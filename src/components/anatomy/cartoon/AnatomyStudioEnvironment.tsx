"use client";

import { ContactShadows } from "@react-three/drei";
import { FIGURE } from "@/lib/anatomy/cartoon/proportions";
import {
  CARTOON_FLOOR,
  CARTOON_SCENE_BG,
  CARTOON_SCENE_FOG,
  CARTOON_STUDIO_BACKDROP,
} from "@/lib/anatomy/cartoon/palette";

/** Soft studio backdrop + floor disc for the cartoon anatomy scene. */
export function AnatomyStudioEnvironment() {
  return (
    <>
      <color attach="background" args={[CARTOON_SCENE_BG]} />
      <fog attach="fog" args={[CARTOON_SCENE_FOG, 9, 20]} />

      <mesh position={[0, FIGURE.headY + 0.15, -4.2]} scale={[16, 11, 1]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={CARTOON_STUDIO_BACKDROP} />
      </mesh>

      <ContactShadows
        position={[0, FIGURE.footY + 0.02, 0]}
        opacity={0.55}
        scale={14}
        blur={3.2}
        far={4.5}
        color="#000000"
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FIGURE.footY + 0.015, 0]} receiveShadow>
        <circleGeometry args={[5.5, 72]} />
        <meshStandardMaterial color={CARTOON_FLOOR} roughness={0.88} metalness={0.04} />
      </mesh>
    </>
  );
}
