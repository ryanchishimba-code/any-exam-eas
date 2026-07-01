"use client";

import { ContactShadows } from "@react-three/drei";
import { DoubleSide } from "three";
import { FIGURE } from "@/lib/anatomy/cartoon/proportions";
import {
  CARTOON_FLOOR,
  CARTOON_SCENE_BG,
  CARTOON_SCENE_FOG,
  CARTOON_STUDIO_ACCENT,
  CARTOON_STUDIO_BACKDROP,
} from "@/lib/anatomy/cartoon/palette";

/** Medical exam-table studio: gradient backdrop, reflective pedestal, contact shadows. */
export function AnatomyStudioEnvironment() {
  const floorY = FIGURE.footY + 0.015;

  return (
    <>
      <color attach="background" args={[CARTOON_SCENE_BG]} />
      <fog attach="fog" args={[CARTOON_SCENE_FOG, 7.5, 19]} />

      {/* Deep backdrop */}
      <mesh position={[0, FIGURE.headY + 0.2, -4.6]} scale={[18, 12, 1]}>
        <sphereGeometry args={[1, 40, 40]} />
        <meshBasicMaterial color={CARTOON_STUDIO_BACKDROP} />
      </mesh>

      {/* Teal key-light wash on backdrop */}
      <mesh position={[0, FIGURE.headY + 1.8, -4.15]} scale={[11, 5.5, 1]}>
        <circleGeometry args={[1, 48]} />
        <meshBasicMaterial color={CARTOON_STUDIO_ACCENT} transparent opacity={0.12} />
      </mesh>

      {/* Subtle overhead halo */}
      <mesh position={[0, 5.8, -2.2]} rotation={[Math.PI / 2.2, 0, 0]}>
        <ringGeometry args={[2.2, 5.5, 64]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.06} side={DoubleSide} />
      </mesh>

      {/* Pedestal ring — lit exam table edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, floorY - 0.004, 0]}>
        <ringGeometry args={[4.6, 5.65, 96]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#0e7490"
          emissiveIntensity={0.14}
          metalness={0.72}
          roughness={0.28}
        />
      </mesh>

      {/* Reflective floor disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, floorY, 0]} receiveShadow>
        <circleGeometry args={[5.5, 96]} />
        <meshPhysicalMaterial
          color={CARTOON_FLOOR}
          roughness={0.22}
          metalness={0.42}
          clearcoat={1}
          clearcoatRoughness={0.18}
          envMapIntensity={0.9}
        />
      </mesh>

      <ContactShadows
        position={[0, FIGURE.footY + 0.02, 0]}
        opacity={0.72}
        scale={15}
        blur={3.6}
        far={5}
        color="#000000"
      />
    </>
  );
}
