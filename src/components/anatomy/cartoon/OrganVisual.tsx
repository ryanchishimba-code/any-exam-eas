"use client";

import type { ReactNode } from "react";
import { TISSUE_PBR } from "@/lib/anatomy/cartoon/palette";
import { TissueSurface } from "@/components/anatomy/cartoon/AnatomyMaterials";

export type OrganSurfaceStyle = {
  color: string;
  opacity: number;
  emissive: string;
  emissiveIntensity: number;
  outlineThickness: number;
  outlineColor: string;
  roughness?: number;
  metalness?: number;
};

type Props = Pick<import("@/lib/anatomy/modules/types").AnatomyModuleDef, "profile" | "geometry"> & {
  style: OrganSurfaceStyle;
  mirrored?: boolean;
};

const SEG = 24;

function Surface({ style, children }: { style: OrganSurfaceStyle; children: ReactNode }) {
  return (
    <TissueSurface
      color={style.color}
      opacity={style.opacity}
      emissive={style.emissive}
      emissiveIntensity={style.emissiveIntensity}
      roughness={style.roughness ?? TISSUE_PBR.organ.roughness}
      metalness={style.metalness ?? TISSUE_PBR.organ.metalness}
      outlineThickness={style.outlineThickness}
      outlineColor={style.outlineColor}
    >
      {children}
    </TissueSurface>
  );
}

/** Clean stylized silhouettes — each part gets its own shaded surface. */
export function OrganVisual({ profile, geometry, style, mirrored = false }: Props) {
  switch (profile) {
    case "heart":
      return (
        <group rotation={[0.35, -0.25, 0.15]}>
          <Surface style={style}>
            <sphereGeometry args={[0.52, SEG, SEG]} />
          </Surface>
          <group position={[0.08, -0.12, 0]} scale={[0.55, 0.7, 0.5]}>
            <Surface style={style}>
              <sphereGeometry args={[0.38, 16, 16]} />
            </Surface>
          </group>
          <group position={[-0.06, 0.1, 0.12]} scale={[0.35, 0.45, 0.3]} rotation={[0.2, 0, -0.15]}>
            <Surface style={style}>
              <sphereGeometry args={[0.4, 12, 12]} />
            </Surface>
          </group>
        </group>
      );
    case "lungs":
      return (
        <group>
          {/* Left lung — smaller (cardiac notch) */}
          <group position={[-0.34, -0.02, -0.05]} scale={[0.62, 0.88, 0.48]}>
            <Surface style={style}>
              <sphereGeometry args={[0.5, SEG, SEG]} />
            </Surface>
          </group>
          {/* Right lung — larger */}
          <group position={[0.36, 0.02, -0.07]} scale={[0.78, 0.96, 0.52]}>
            <Surface style={style}>
              <sphereGeometry args={[0.5, SEG, SEG]} />
            </Surface>
          </group>
        </group>
      );
    case "brain":
      return (
        <group scale={[1, 0.88, 0.92]}>
          <Surface style={style}>
            <sphereGeometry args={[0.82, SEG, SEG]} />
          </Surface>
        </group>
      );
    case "skull":
      return (
        <group scale={[1, 1.08, 0.92]}>
          <Surface style={style}>
            <sphereGeometry args={[0.88, SEG, SEG]} />
          </Surface>
        </group>
      );
    case "liver":
      return (
        <group rotation={[0, 0, -0.1]}>
          <group scale={[1.2, 0.68, 0.5]} position={[0.05, 0, 0]}>
            <Surface style={style}>
              <boxGeometry args={[0.92, 0.58, 0.45]} />
            </Surface>
          </group>
          <group scale={[0.55, 0.45, 0.4]} position={[-0.28, 0.12, 0.02]}>
            <Surface style={style}>
              <boxGeometry args={[0.7, 0.5, 0.4]} />
            </Surface>
          </group>
        </group>
      );
    case "kidneys":
      return (
        <group>
          {([-1, 1] as const).map((sx) => (
            <group
              key={sx}
              position={[sx * 0.42, 0, 0]}
              scale={[0.42, 0.72, 0.55]}
              rotation={[0, 0, sx * 0.25]}
            >
              <Surface style={style}>
                <sphereGeometry args={[0.48, 16, 16]} />
              </Surface>
            </group>
          ))}
        </group>
      );
    case "stomach-sac":
      return (
        <group rotation={[0.15, 0, 0.08]}>
          <group scale={[0.85, 0.75, 0.65]} position={[0, 0.08, 0]}>
            <Surface style={style}>
              <sphereGeometry args={[0.55, SEG, SEG]} />
            </Surface>
          </group>
          <group scale={[0.5, 0.65, 0.45]} position={[0.12, -0.22, 0.04]}>
            <Surface style={style}>
              <sphereGeometry args={[0.45, 14, 14]} />
            </Surface>
          </group>
        </group>
      );
    case "spleen-oval":
      return (
        <group scale={[0.75, 1, 0.55]} rotation={[0, 0, 0.2]}>
          <Surface style={style}>
            <sphereGeometry args={[0.52, 16, 16]} />
          </Surface>
        </group>
      );
    case "gallbladder-pear":
      return (
        <group scale={[0.65, 0.95, 0.55]}>
          <Surface style={style}>
            <sphereGeometry args={[0.48, 16, 16]} />
          </Surface>
        </group>
      );
    case "bladder-sac":
      return (
        <group scale={[1, 0.72, 0.85]}>
          <Surface style={style}>
            <sphereGeometry args={[0.52, 16, 16]} />
          </Surface>
        </group>
      );
    case "pancreas-band":
      return (
        <group rotation={[0, 0, -0.12]} scale={[1.1, 0.55, 0.45]}>
          <Surface style={style}>
            <boxGeometry args={[0.95, 0.28, 0.35]} />
          </Surface>
        </group>
      );
    case "thyroid":
      return (
        <group>
          {([-1, 1] as const).map((sx) => (
            <group key={sx} position={[sx * 0.22, 0, 0]} scale={[0.42, 0.55, 0.48]}>
              <Surface style={style}>
                <sphereGeometry args={[0.45, 14, 14]} />
              </Surface>
            </group>
          ))}
          <group position={[0, -0.02, 0]} scale={[0.55, 0.22, 0.32]}>
            <Surface style={style}>
              <boxGeometry args={[0.5, 0.35, 0.35]} />
            </Surface>
          </group>
        </group>
      );
    case "aorta-arch":
      return (
        <group rotation={[0, Math.PI / 2, 0]}>
          <Surface style={style}>
            <torusGeometry args={[0.38, 0.09, 12, 28, Math.PI * 0.95]} />
          </Surface>
        </group>
      );
    case "carotid-pair":
      return (
        <group>
          {([-1, 1] as const).map((sx) => (
            <group key={sx} position={[sx * 0.12, 0.08, 0]}>
              <Surface style={style}>
                <capsuleGeometry args={[0.1, 0.35, 6, 12]} />
              </Surface>
            </group>
          ))}
        </group>
      );
    case "clavicle-pair":
      return (
        <group>
          {([-1, 1] as const).map((sx) => (
            <group key={sx} rotation={[0, 0, sx * 0.18]} position={[sx * 0.22, 0.02, 0]}>
              <Surface style={style}>
                <capsuleGeometry args={[0.04, 0.55, 6, 12]} />
              </Surface>
            </group>
          ))}
        </group>
      );
    case "long-bone":
      return (
        <Surface style={style}>
          <capsuleGeometry args={[0.28, 1.05, 8, 16]} />
        </Surface>
      );
    case "muscle-bulge":
      return (
        <group rotation={[0.12, 0, 0]}>
          <Surface style={style}>
            <capsuleGeometry args={[0.32, 0.65, 8, 14]} />
          </Surface>
          <group position={[-0.08, 0.05, 0.04]} rotation={[0, 0, 0.15]}>
            <Surface style={style}>
              <capsuleGeometry args={[0.18, 0.45, 6, 12]} />
            </Surface>
          </group>
          <group position={[0.08, 0.02, 0.05]} rotation={[0, 0, -0.1]}>
            <Surface style={style}>
              <capsuleGeometry args={[0.16, 0.42, 6, 12]} />
            </Surface>
          </group>
        </group>
      );
    case "vertebrae":
      return (
        <Surface style={style}>
          <capsuleGeometry args={[0.28, 1.2, 8, 14]} />
        </Surface>
      );
    case "trachea-tube":
      return (
        <group>
          <Surface style={style}>
            <capsuleGeometry args={[0.2, 1.15, 8, 12]} />
          </Surface>
          {Array.from({ length: 6 }, (_, i) => (
            <group key={i} position={[0, -0.42 + i * 0.17, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <Surface style={{ ...style, opacity: Math.min(style.opacity, 0.85) }}>
                <torusGeometry args={[0.22, 0.025, 6, 16]} />
              </Surface>
            </group>
          ))}
        </group>
      );
    case "nerve-cord":
    case "esophagus-tube":
    case "appendix-tube":
      return (
        <Surface style={style}>
          <capsuleGeometry args={[0.22, 1.2, 8, 12]} />
        </Surface>
      );
    case "diaphragm-disc":
      return (
        <group rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.14, 1]}>
          <Surface style={style}>
            <cylinderGeometry args={[0.92, 0.98, 1, 28]} />
          </Surface>
        </group>
      );
    case "scapula-blade":
      return (
        <group scale={[0.85, 1, 0.35]} rotation={[0, mirrored ? -0.3 : 0.3, 0]}>
          <Surface style={style}>
            <boxGeometry args={[0.55, 0.85, 0.12]} />
          </Surface>
        </group>
      );
    case "duodenum-loop":
      return (
        <group rotation={[Math.PI / 2, 0, 0.4]}>
          <Surface style={style}>
            <torusGeometry args={[0.28, 0.07, 10, 20, Math.PI * 1.1]} />
          </Surface>
        </group>
      );
    case "small-intestine-coils": {
      const coils: { pos: [number, number, number]; rot: [number, number, number]; r: number; tube: number }[] = [
        { pos: [0, 0.06, 0], rot: [0.35, 0.15, 0.25], r: 0.22, tube: 0.06 },
        { pos: [0.1, -0.02, 0.04], rot: [0.55, 0.75, -0.1], r: 0.18, tube: 0.055 },
        { pos: [-0.08, -0.04, -0.02], rot: [0.2, -0.4, 0.35], r: 0.17, tube: 0.05 },
        { pos: [0.04, -0.1, 0.02], rot: [0.65, 0.2, -0.25], r: 0.16, tube: 0.048 },
        { pos: [-0.06, 0.04, 0.03], rot: [0.15, 0.55, 0.1], r: 0.15, tube: 0.045 },
      ];
      return (
        <group>
          {coils.map((c, i) => (
            <group key={i} position={c.pos} rotation={c.rot}>
              <Surface style={style}>
                <torusGeometry args={[c.r, c.tube, 10, 18, Math.PI * 1.35]} />
              </Surface>
            </group>
          ))}
        </group>
      );
    }
    case "colon-frame":
      return (
        <group>
          {/* Ascending colon — right */}
          <group position={[0.34, 0.06, 0]} rotation={[0, 0, -0.04]}>
            <Surface style={style}>
              <capsuleGeometry args={[0.085, 0.34, 8, 12]} />
            </Surface>
          </group>
          {/* Transverse colon — upper frame */}
          <group position={[0, 0.26, 0.02]} rotation={[0.12, 0, 0]}>
            <Surface style={style}>
              <capsuleGeometry args={[0.075, 0.62, 8, 14]} />
            </Surface>
          </group>
          {/* Descending colon — left */}
          <group position={[-0.34, 0.02, 0]} rotation={[0, 0, 0.04]}>
            <Surface style={style}>
              <capsuleGeometry args={[0.085, 0.38, 8, 12]} />
            </Surface>
          </group>
          {/* Sigmoid sweep — lower center */}
          <group position={[0.02, -0.14, 0.01]} rotation={[0.4, 0, 0.55]}>
            <Surface style={style}>
              <torusGeometry args={[0.18, 0.065, 10, 20, Math.PI * 0.85]} />
            </Surface>
          </group>
        </group>
      );
    case "adrenal-pair":
      return (
        <group>
          {([-1, 1] as const).map((sx) => (
            <group key={sx} position={[sx * 0.42, 0.05, 0]} scale={[0.35, 0.55, 0.45]}>
              <Surface style={style}>
                <boxGeometry args={[0.55, 0.22, 0.35]} />
              </Surface>
            </group>
          ))}
        </group>
      );
    default:
      switch (geometry) {
        case "sphere":
          return (
            <Surface style={style}>
              <sphereGeometry args={[0.68, 18, 18]} />
            </Surface>
          );
        case "box":
          return (
            <Surface style={style}>
              <boxGeometry args={[0.88, 0.88, 0.88]} />
            </Surface>
          );
        case "cylinder":
          return (
            <Surface style={style}>
              <cylinderGeometry args={[0.42, 0.42, 0.95, 16]} />
            </Surface>
          );
        default:
          return (
            <Surface style={style}>
              <capsuleGeometry args={[0.36, 0.65, 8, 14]} />
            </Surface>
          );
      }
  }
}

/** Catalog muscle modules represented in the structural muscle shell. */
export const STRUCTURAL_MUSCLE_MESH_IDS = new Set(["biceps", "diaphragm"]);

/** Bone catalog modules covered by the structural skeleton shell. */
export const STRUCTURAL_BONE_MESH_IDS = new Set([
  "skull",
  "clavicle",
  "sternum",
  "vertebral-column",
  "humerus",
  "femur",
  "tibia",
  "scapula",
]);
