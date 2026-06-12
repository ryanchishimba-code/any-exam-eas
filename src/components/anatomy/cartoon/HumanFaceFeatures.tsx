"use client";

import {
  CARTOON_EYE_IRIS,
  CARTOON_EYE_WHITE,
  CARTOON_HAIR,
  CARTOON_LIP,
  CARTOON_SKIN,
  CARTOON_SKIN_SHADOW,
  CARTOON_SOCKET,
} from "@/lib/anatomy/cartoon/palette";
import { CATALOG_SKULL_RADIUS } from "@/lib/anatomy/cartoon/skull-geometry";
import { FACE_CATALOG } from "@/lib/anatomy/cartoon/face-landmarks";
import { TissueSurface } from "@/components/anatomy/cartoon/AnatomyMaterials";

type BoneFaceStyle = {
  color: string;
  opacity: number;
  emissive: string;
  emissiveIntensity: number;
  outlineColor: string;
};

type Props = {
  /** Extra multiplier on catalog layout (default 1). Prefer parent `getFigureFaceTransform`. */
  scale?: number;
  boneStyle?: BoneFaceStyle;
  showSockets?: boolean;
  /** Living skin tones vs bone/peeled mannequin. */
  variant?: "skin" | "bone";
};

const F = FACE_CATALOG;
const R = CATALOG_SKULL_RADIUS;

/** Eyes, brows, nose, mouth, ears — anthropometric catalog layout scaled to head. */
export function HumanFaceFeatures({
  scale = 1,
  boneStyle,
  showSockets = true,
  variant = "skin",
}: Props) {
  const isSkin = variant === "skin";
  const style = boneStyle;

  return (
    <group scale={[scale, scale, scale]}>
      {([-1, 1] as const).map((sx) => (
        <group key={`brow-${sx}`} position={[sx * F.browX, F.browY, F.eyeZ - 0.02]}>
          <mesh rotation={[0.12, sx * 0.08, sx * -0.12]} renderOrder={5}>
            <capsuleGeometry args={[F.eyeGlobeRadius * 0.09, F.eyeGlobeRadius * 0.55, 4, 8]} />
            <meshStandardMaterial
              color={isSkin ? CARTOON_HAIR : CARTOON_SOCKET}
              roughness={0.82}
              metalness={0}
            />
          </mesh>
        </group>
      ))}

      {([-1, 1] as const).map((sx) => (
        <group key={`eye-${sx}`} position={[sx * F.eyeX, F.eyeY, F.eyeZ]}>
          {showSockets ? (
            <group rotation={[0.32, sx * 0.12, 0]} scale={[0.95, 0.82, 0.58]}>
              <mesh renderOrder={2}>
                <sphereGeometry args={[F.socketRadius, 14, 14]} />
                <meshStandardMaterial color={CARTOON_SOCKET} roughness={0.9} metalness={0} />
              </mesh>
            </group>
          ) : null}
          <group position={[0, 0, 0.035]} renderOrder={4}>
            <mesh>
              <sphereGeometry args={[F.eyeGlobeRadius, 14, 14]} />
              <meshStandardMaterial color={CARTOON_EYE_WHITE} roughness={0.32} metalness={0} />
            </mesh>
            <mesh position={[0, 0, F.eyeGlobeRadius * 0.34]} renderOrder={5}>
              <sphereGeometry args={[F.irisRadius, 12, 12]} />
              <meshStandardMaterial color={CARTOON_EYE_IRIS} roughness={0.38} metalness={0.04} />
            </mesh>
            <mesh position={[0, 0, F.eyeGlobeRadius * 0.52]} renderOrder={6}>
              <sphereGeometry args={[F.pupilRadius, 8, 8]} />
              <meshStandardMaterial color="#0a0a0c" roughness={0.2} metalness={0.1} />
            </mesh>
            <mesh position={[sx * 0.012, F.eyeGlobeRadius * 0.2, F.eyeGlobeRadius * 0.48]} renderOrder={7}>
              <sphereGeometry args={[F.pupilRadius * 0.45, 6, 6]} />
              <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0} transparent opacity={0.85} />
            </mesh>
          </group>
          {style ? (
            <group rotation={[0.32, sx * 0.12, 0]} scale={[1.05, 0.92, 0.72]}>
              <TissueSurface
                color={style.color}
                opacity={style.opacity}
                emissive={style.emissive}
                emissiveIntensity={style.emissiveIntensity}
                roughness={0.72}
                metalness={0.04}
                outlineThickness={0}
                outlineColor={style.outlineColor}
              >
                <torusGeometry args={[F.socketRadius, F.socketRadius * 0.11, 8, 20, Math.PI * 1.05]} />
              </TissueSurface>
            </group>
          ) : null}
        </group>
      ))}

      <group position={[0, F.noseBridgeY, F.noseZ]}>
        <mesh position={[0, (F.noseTipY - F.noseBridgeY) * 0.35, 0.02]} scale={[0.2, 0.52, 0.3]} renderOrder={4}>
          <sphereGeometry args={[R * 0.14, 12, 12]} />
          <meshStandardMaterial
            color={isSkin ? CARTOON_SKIN_SHADOW : CARTOON_SOCKET}
            roughness={0.78}
            metalness={0}
          />
        </mesh>
        {style ? (
          <group position={[0, (F.noseTipY - F.noseBridgeY) * 0.45, 0.04]} scale={[0.48, 0.88, 0.68]}>
            <TissueSurface
              color={style.color}
              opacity={style.opacity}
              emissive={style.emissive}
              emissiveIntensity={style.emissiveIntensity}
              roughness={0.72}
              metalness={0.04}
              outlineThickness={0}
              outlineColor={style.outlineColor}
            >
              <boxGeometry args={[R * 0.38, R * 0.26, R * 0.14]} />
            </TissueSurface>
          </group>
        ) : null}
        {([-1, 1] as const).map((sx) => (
          <mesh key={sx} position={[sx * F.nostrilX, F.noseTipY - F.noseBridgeY, 0.06]} scale={[0.55, 0.42, 0.48]} renderOrder={4}>
            <sphereGeometry args={[R * 0.07, 10, 10]} />
            <meshStandardMaterial
              color={isSkin ? CARTOON_SKIN_SHADOW : CARTOON_SOCKET}
              roughness={0.86}
              metalness={0}
            />
          </mesh>
        ))}
      </group>

      <group position={[0, F.mouthY, F.mouthZ]}>
        <mesh position={[0, 0.02, 0.04]} scale={[0.7, 0.32, 0.22]} renderOrder={3}>
          <sphereGeometry args={[F.lipRadius, 12, 12]} />
          <meshStandardMaterial color={CARTOON_SOCKET} roughness={0.9} metalness={0} />
        </mesh>
        <mesh position={[0, 0.05, 0.05]} scale={[0.66, 0.12, 0.18]} renderOrder={4}>
          <boxGeometry args={[F.lipRadius * 2.1, R * 0.14, R * 0.09]} />
          <meshStandardMaterial color="#e8e4dc" roughness={0.45} metalness={0} />
        </mesh>
        <mesh position={[0, -0.01, 0.07]} rotation={[0.14, 0, 0]} renderOrder={5}>
          <torusGeometry args={[F.lipRadius, R * 0.022, 8, 22, Math.PI]} />
          <meshStandardMaterial color={CARTOON_LIP} roughness={0.52} metalness={0.02} />
        </mesh>
        <mesh position={[0, -0.045, 0.065]} rotation={[0.08, 0, 0]} renderOrder={5}>
          <torusGeometry args={[F.lipRadius * 0.88, R * 0.018, 8, 20, Math.PI]} />
          <meshStandardMaterial color={CARTOON_LIP} roughness={0.55} metalness={0.02} />
        </mesh>
        {style ? (
          <group position={[0, -0.07, 0.02]} scale={[0.86, 0.4, 0.7]}>
            <TissueSurface
              color={style.color}
              opacity={style.opacity}
              emissive={style.emissive}
              emissiveIntensity={style.emissiveIntensity}
              roughness={0.72}
              metalness={0.04}
              outlineThickness={0}
              outlineColor={style.outlineColor}
            >
              <boxGeometry args={[F.lipRadius * 2.4, R * 0.18, R * 0.38]} />
            </TissueSurface>
          </group>
        ) : null}
      </group>

      {isSkin
        ? ([-1, 1] as const).map((sx) => (
            <group key={`ear-${sx}`} position={[sx * F.earX, F.earY, F.earZ]} rotation={[0, sx * 0.35, 0]}>
              <mesh scale={[0.42, 0.88, 0.52]} renderOrder={4}>
                <sphereGeometry args={[R * 0.09, 10, 10]} />
                <meshStandardMaterial color={CARTOON_SKIN} roughness={0.62} metalness={0} />
              </mesh>
            </group>
          ))
        : null}
    </group>
  );
}
