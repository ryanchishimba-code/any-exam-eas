"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import type * as THREE from "three";
import { TISSUE_PBR, type TissueKind } from "@/lib/anatomy/cartoon/palette";
import { buildCatalogSkullGeometry } from "@/lib/anatomy/cartoon/skull-geometry";
import {
  buildCatalogAortaGeometry,
  buildCatalogDiaphragmGeometry,
  buildCatalogEsophagusGeometry,
  buildCatalogHeartGeometry,
  buildCatalogLiverGeometry,
  buildCatalogLungsGeometry,
  buildCatalogPancreasGeometry,
  buildCatalogSpleenGeometry,
  buildCatalogStomachGeometry,
  buildCatalogThyroidGeometry,
  buildCatalogTracheaGeometry,
} from "@/lib/anatomy/cartoon/thoracic-organ-geometry";
import { TissueSurface, StandardTissueMaterial } from "@/components/anatomy/cartoon/AnatomyMaterials";
import { VolumeOrganVisual } from "@/components/anatomy/cartoon/VolumeOrganVisual";
import { HumanFaceFeatures } from "@/components/anatomy/cartoon/HumanFaceFeatures";
import { buildSpinalCordUnitGeometry } from "@/lib/anatomy/cartoon/nerve-geometry";
import { hasVisibleHumanOrgan } from "@/lib/anatomy/cartoon/visible-human-organs";

export type OrganSurfaceStyle = {
  color: string;
  opacity: number;
  emissive: string;
  emissiveIntensity: number;
  outlineThickness: number;
  outlineColor: string;
  tissue?: TissueKind;
  roughness?: number;
  metalness?: number;
};

type Props = Pick<import("@/lib/anatomy/modules/types").AnatomyModuleDef, "profile" | "geometry"> & {
  style: OrganSurfaceStyle;
  mirrored?: boolean;
  /** Module id — enables Visible Human GLB when registered. */
  meshId?: string;
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
      tissue={style.tissue}
    >
      {children}
    </TissueSurface>
  );
}

function CatalogOrganMesh({
  geometry,
  style,
  pbr = TISSUE_PBR.organ,
}: {
  geometry: THREE.BufferGeometry | null;
  style: OrganSurfaceStyle;
  pbr?: { roughness: number; metalness: number };
}) {
  if (!geometry) return null;
  return (
    <mesh geometry={geometry} castShadow>
      <StandardTissueMaterial
        color={style.color}
        opacity={style.opacity}
        emissive={style.emissive}
        emissiveIntensity={style.emissiveIntensity}
        roughness={style.roughness ?? pbr.roughness}
        metalness={style.metalness ?? pbr.metalness}
        tissue={style.tissue ?? "organ"}
      />
    </mesh>
  );
}

function SkullVisual({ style }: { style: OrganSurfaceStyle }) {
  const skullGeo = useMemo(() => buildCatalogSkullGeometry(), []);

  return (
    <group scale={[0.98, 1.05, 0.96]}>
      <CatalogOrganMesh geometry={skullGeo} style={style} pbr={TISSUE_PBR.bone} />
      <HumanFaceFeatures scale={1} boneStyle={style} showSockets variant="bone" />
    </group>
  );
}

function HeartVisual({ style }: { style: OrganSurfaceStyle }) {
  const geo = useMemo(() => buildCatalogHeartGeometry(), []);
  return (
    <group rotation={[0.15, -0.06, -0.42]} scale={[0.92, 0.92, 0.88]}>
      <CatalogOrganMesh geometry={geo} style={style} />
    </group>
  );
}

function LungsVisual({ style }: { style: OrganSurfaceStyle }) {
  const geo = useMemo(() => buildCatalogLungsGeometry(), []);
  return <CatalogOrganMesh geometry={geo} style={style} />;
}

function LiverVisual({ style }: { style: OrganSurfaceStyle }) {
  const geo = useMemo(() => buildCatalogLiverGeometry(), []);
  return (
    <group rotation={[0, 0.06, 0.04]} scale={[0.95, 0.95, 0.92]}>
      <CatalogOrganMesh geometry={geo} style={style} />
    </group>
  );
}

function TracheaVisual({ style }: { style: OrganSurfaceStyle }) {
  const geo = useMemo(() => buildCatalogTracheaGeometry(), []);
  return <CatalogOrganMesh geometry={geo} style={style} />;
}

function EsophagusVisual({ style }: { style: OrganSurfaceStyle }) {
  const geo = useMemo(() => buildCatalogEsophagusGeometry(), []);
  return <CatalogOrganMesh geometry={geo} style={style} />;
}

function AortaVisual({ style }: { style: OrganSurfaceStyle }) {
  const geo = useMemo(() => buildCatalogAortaGeometry(), []);
  return (
    <group rotation={[0.08, 0, 0]}>
      <CatalogOrganMesh geometry={geo} style={style} />
    </group>
  );
}

function DiaphragmVisual({ style }: { style: OrganSurfaceStyle }) {
  const geo = useMemo(() => buildCatalogDiaphragmGeometry(), []);
  return <CatalogOrganMesh geometry={geo} style={style} />;
}

function ThyroidVisual({ style }: { style: OrganSurfaceStyle }) {
  const geo = useMemo(() => buildCatalogThyroidGeometry(), []);
  return (
    <group rotation={[0.1, 0, 0]}>
      <CatalogOrganMesh geometry={geo} style={style} />
    </group>
  );
}

function StomachVisual({ style }: { style: OrganSurfaceStyle }) {
  const geo = useMemo(() => buildCatalogStomachGeometry(), []);
  return (
    <group rotation={[0.08, 0, 0.1]}>
      <CatalogOrganMesh geometry={geo} style={style} />
    </group>
  );
}

function SpleenVisual({ style }: { style: OrganSurfaceStyle }) {
  const geo = useMemo(() => buildCatalogSpleenGeometry(), []);
  return (
    <group scale={[0.88, 1, 0.9]} rotation={[0, 0, 0.22]}>
      <CatalogOrganMesh geometry={geo} style={style} />
    </group>
  );
}

function PancreasVisual({ style }: { style: OrganSurfaceStyle }) {
  const geo = useMemo(() => buildCatalogPancreasGeometry(), []);
  return (
    <group rotation={[0, 0, -0.08]}>
      <CatalogOrganMesh geometry={geo} style={style} />
    </group>
  );
}

function BrainProceduralVisual({ style }: { style: OrganSurfaceStyle }) {
  const lobeStyle = (scale: number) => ({ ...style, opacity: style.opacity * scale });
  return (
    <group scale={[0.98, 0.88, 0.92]}>
      {/* Frontal — anterior */}
      <group position={[0, 0.06, 0.14]} scale={[0.72, 0.62, 0.58]}>
        <Surface style={style}>
          <sphereGeometry args={[0.62, SEG, SEG, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        </Surface>
      </group>
      {/* Parietal — superior */}
      <group position={[0, 0.22, -0.02]} scale={[0.78, 0.48, 0.72]}>
        <Surface style={style}>
          <sphereGeometry args={[0.58, SEG, SEG, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
        </Surface>
      </group>
      {/* Temporal — lateral (both sides) */}
      {([-1, 1] as const).map((sx) => (
        <group key={sx} position={[sx * 0.34, -0.02, 0.04]} scale={[0.42, 0.5, 0.44]}>
          <Surface style={style}>
            <sphereGeometry args={[0.44, 12, 12]} />
          </Surface>
        </group>
      ))}
      {/* Occipital — posterior */}
      <group position={[0, 0.04, -0.2]} scale={[0.68, 0.58, 0.5]}>
        <Surface style={style}>
          <sphereGeometry args={[0.5, 14, 14]} />
        </Surface>
      </group>
      {/* Interhemispheric fissure */}
      <group position={[0, 0.02, 0]} scale={[0.04, 0.82, 0.72]}>
        <Surface style={lobeStyle(0.55)}>
          <boxGeometry args={[0.5, 0.9, 0.08]} />
        </Surface>
      </group>
      {/* Cerebellum */}
      <group position={[0, -0.24, -0.18]} scale={[0.82, 0.48, 0.62]}>
        <Surface style={style}>
          <sphereGeometry args={[0.44, 14, 14]} />
        </Surface>
      </group>
      {/* Brainstem */}
      <group position={[0, -0.34, -0.06]} scale={[0.14, 0.22, 0.14]}>
        <Surface style={style}>
          <capsuleGeometry args={[0.12, 0.18, 6, 10]} />
        </Surface>
      </group>
    </group>
  );
}

function NerveCordVisual({ style }: { style: OrganSurfaceStyle }) {
  const geometry = useMemo(() => buildSpinalCordUnitGeometry(), []);
  if (!geometry) return null;
  return (
    <mesh geometry={geometry}>
      <StandardTissueMaterial
        color={style.color}
        opacity={style.opacity}
        emissive={style.emissive}
        emissiveIntensity={style.emissiveIntensity}
        roughness={TISSUE_PBR.nerve.roughness}
        metalness={TISSUE_PBR.nerve.metalness}
      />
    </mesh>
  );
}

const VH_ENABLED_PROFILES = new Set([
  "heart",
  "lungs",
  "liver",
  "spleen-oval",
  "pancreas-band",
  "kidneys",
  "colon-frame",
  "brain",
  "bladder-sac",
  "prostate-disc",
  "small-intestine-coils",
]);

function VisibleHumanOrProcedural({
  meshId,
  profile,
  style,
  procedural,
}: {
  meshId?: string;
  profile: string;
  style: OrganSurfaceStyle;
  procedural: ReactNode;
}) {
  if (meshId && VH_ENABLED_PROFILES.has(profile) && hasVisibleHumanOrgan(meshId)) {
    return <VolumeOrganVisual meshId={meshId} style={style} />;
  }
  return <>{procedural}</>;
}

/** Clean stylized silhouettes — each part gets its own shaded surface. */
export function OrganVisual({ profile, geometry, style, mirrored = false, meshId }: Props) {
  switch (profile) {
    case "heart":
      return (
        <VisibleHumanOrProcedural
          meshId={meshId}
          profile={profile}
          style={style}
          procedural={<HeartVisual style={style} />}
        />
      );
    case "lungs":
      return (
        <VisibleHumanOrProcedural
          meshId={meshId}
          profile={profile}
          style={style}
          procedural={<LungsVisual style={style} />}
        />
      );
    case "brain":
      return (
        <VisibleHumanOrProcedural
          meshId={meshId}
          profile={profile}
          style={style}
          procedural={<BrainProceduralVisual style={style} />}
        />
      );
    case "skull":
      return <SkullVisual style={style} />;
    case "liver":
      return (
        <VisibleHumanOrProcedural
          meshId={meshId}
          profile={profile}
          style={style}
          procedural={<LiverVisual style={style} />}
        />
      );
    case "kidneys":
      return (
        <VisibleHumanOrProcedural
          meshId={meshId}
          profile={profile}
          style={style}
          procedural={
            <group>
              {([
                { sx: -1 as const, y: -0.05 },
                { sx: 1 as const, y: 0.04 },
              ] as const).map(({ sx, y }) => (
                <group
                  key={sx}
                  position={[sx * 0.4, y, 0]}
                  rotation={[0, 0, sx * -0.35]}
                >
                  <group scale={[0.42, 0.82, 0.52]}>
                    <Surface style={style}>
                      <sphereGeometry args={[0.46, 18, 18]} />
                    </Surface>
                  </group>
                  <group position={[sx * -0.14, 0.02, 0.06]} scale={[0.32, 0.45, 0.28]}>
                    <Surface style={{ ...style, opacity: style.opacity * 0.75 }}>
                      <sphereGeometry args={[0.28, 10, 10]} />
                    </Surface>
                  </group>
                  <group position={[0, -0.22, 0]} scale={[0.28, 0.38, 0.32]}>
                    <Surface style={style}>
                      <sphereGeometry args={[0.32, 10, 10]} />
                    </Surface>
                  </group>
                  <group position={[sx * -0.1, 0, 0.1]} scale={[0.18, 0.35, 0.22]}>
                    <Surface style={{ ...style, opacity: style.opacity * 0.5 }}>
                      <boxGeometry args={[0.4, 0.5, 0.3]} />
                    </Surface>
                  </group>
                </group>
              ))}
            </group>
          }
        />
      );
    case "stomach-sac":
      return <StomachVisual style={style} />;
    case "spleen-oval":
      return (
        <VisibleHumanOrProcedural
          meshId={meshId}
          profile={profile}
          style={style}
          procedural={<SpleenVisual style={style} />}
        />
      );
    case "gallbladder-pear":
      return (
        <group scale={[0.62, 0.98, 0.52]} rotation={[0.1, 0, -0.08]}>
          <Surface style={style}>
            <sphereGeometry args={[0.48, 16, 16]} />
          </Surface>
          {/* Neck */}
          <group position={[0, 0.22, 0]} scale={[0.35, 0.4, 0.35]}>
            <Surface style={style}>
              <capsuleGeometry args={[0.15, 0.12, 6, 10]} />
            </Surface>
          </group>
        </group>
      );
    case "bladder-sac":
      return (
        <VisibleHumanOrProcedural
          meshId={meshId}
          profile={profile}
          style={style}
          procedural={
            <group scale={[1.02, 0.68, 0.82]}>
              <Surface style={style}>
                <sphereGeometry args={[0.52, 16, 16]} />
              </Surface>
            </group>
          }
        />
      );
    case "pancreas-band":
      return (
        <VisibleHumanOrProcedural
          meshId={meshId}
          profile={profile}
          style={style}
          procedural={<PancreasVisual style={style} />}
        />
      );
    case "thyroid":
      return <ThyroidVisual style={style} />;
    case "aorta-arch":
      return <AortaVisual style={style} />;
    case "carotid-pair":
      return (
        <group>
          {([-1, 1] as const).map((sx) => (
            <group key={sx} position={[sx * 0.1, 0.06, 0]} rotation={[0, 0, sx * 0.06]}>
              <Surface style={style}>
                <capsuleGeometry args={[0.09, 0.32, 6, 12]} />
              </Surface>
            </group>
          ))}
        </group>
      );
    case "clavicle-pair":
      return (
        <group>
          {([-1, 1] as const).map((sx) => (
            <group key={sx}>
              <group position={[sx * 0.1, 0.035, 0.1]} rotation={[0, 0, sx * -0.42]}>
                <Surface style={style}>
                  <capsuleGeometry args={[0.032, 0.2, 6, 12]} />
                </Surface>
              </group>
              <group position={[sx * 0.28, 0.01, 0.04]} rotation={[0, sx * 0.1, sx * 0.18]}>
                <Surface style={style}>
                  <capsuleGeometry args={[0.028, 0.18, 6, 12]} />
                </Surface>
              </group>
              <group position={[sx * 0.46, 0.02, 0.01]} rotation={[0, sx * 0.08, sx * 0.28]}>
                <Surface style={style}>
                  <capsuleGeometry args={[0.024, 0.16, 6, 12]} />
                </Surface>
              </group>
              <group position={[sx * 0.08, 0.038, 0.1]} scale={[1.1, 0.7, 0.65]}>
                <Surface style={style}>
                  <sphereGeometry args={[0.034, 10, 10]} />
                </Surface>
              </group>
              <group position={[sx * 0.48, 0.02, 0.01]} scale={[1.2, 0.6, 0.7]}>
                <Surface style={style}>
                  <sphereGeometry args={[0.028, 10, 10]} />
                </Surface>
              </group>
            </group>
          ))}
        </group>
      );
    case "long-bone":
      return (
        <Surface style={style}>
          <capsuleGeometry args={[0.26, 1.05, 8, 16]} />
        </Surface>
      );
    case "muscle-bulge":
      return (
        <group rotation={[0.1, 0, 0]}>
          <Surface style={style}>
            <capsuleGeometry args={[0.3, 0.62, 8, 14]} />
          </Surface>
          <group position={[-0.08, 0.04, 0.04]} rotation={[0, 0, 0.12]}>
            <Surface style={style}>
              <capsuleGeometry args={[0.17, 0.42, 6, 12]} />
            </Surface>
          </group>
          <group position={[0.08, 0.01, 0.04]} rotation={[0, 0, -0.08]}>
            <Surface style={style}>
              <capsuleGeometry args={[0.15, 0.4, 6, 12]} />
            </Surface>
          </group>
        </group>
      );
    case "vertebrae":
      return (
        <group>
          <Surface style={style}>
            <capsuleGeometry args={[0.26, 1.2, 8, 14]} />
          </Surface>
          {Array.from({ length: 8 }, (_, i) => (
            <group key={i} position={[0, -0.48 + i * 0.14, 0]} scale={[1.15, 0.35, 1.1]}>
              <Surface style={{ ...style, opacity: Math.min(style.opacity, 0.9) }}>
                <boxGeometry args={[0.38, 0.12, 0.32]} />
              </Surface>
            </group>
          ))}
        </group>
      );
    case "trachea-tube":
      return <TracheaVisual style={style} />;
    case "nerve-cord":
      return <NerveCordVisual style={style} />;
    case "appendix-tube":
      return (
        <Surface style={style}>
          <capsuleGeometry args={[0.2, 1.15, 8, 12]} />
        </Surface>
      );
    case "esophagus-tube":
      return <EsophagusVisual style={style} />;
    case "diaphragm-disc":
      return <DiaphragmVisual style={style} />;
    case "scapula-blade":
      return (
        <group scale={[0.82, 1, 0.32]} rotation={[0, mirrored ? -0.28 : 0.28, 0]}>
          <Surface style={style}>
            <boxGeometry args={[0.55, 0.85, 0.12]} />
          </Surface>
        </group>
      );
    case "duodenum-loop":
      return (
        <group rotation={[Math.PI / 2, 0, 0.35]}>
          <Surface style={style}>
            <torusGeometry args={[0.26, 0.065, 10, 20, Math.PI * 1.15]} />
          </Surface>
        </group>
      );
    case "small-intestine-coils": {
      const coils: { pos: [number, number, number]; rot: [number, number, number]; r: number; tube: number }[] = [
        { pos: [0, 0.1, 0], rot: [0.3, 0.2, 0.2], r: 0.19, tube: 0.052 },
        { pos: [0.1, 0.02, 0.04], rot: [0.5, 0.75, -0.12], r: 0.16, tube: 0.048 },
        { pos: [-0.1, -0.02, -0.02], rot: [0.25, -0.42, 0.28], r: 0.15, tube: 0.045 },
        { pos: [0.05, -0.1, 0.02], rot: [0.55, 0.22, -0.18], r: 0.14, tube: 0.042 },
        { pos: [-0.08, 0.08, 0.03], rot: [0.1, 0.48, 0.12], r: 0.13, tube: 0.04 },
        { pos: [0, -0.14, -0.01], rot: [0.38, -0.18, 0.32], r: 0.12, tube: 0.038 },
        { pos: [0.07, 0.05, -0.04], rot: [0.65, 0.08, -0.28], r: 0.11, tube: 0.035 },
      ];
      return (
        <VisibleHumanOrProcedural
          meshId={meshId}
          profile={profile}
          style={style}
          procedural={
            <group>
              {coils.map((c, i) => (
                <group key={i} position={c.pos} rotation={c.rot}>
                  <Surface style={style}>
                    <torusGeometry args={[c.r, c.tube, 10, 18, Math.PI * 1.35]} />
                  </Surface>
                </group>
              ))}
            </group>
          }
        />
      );
    }
    case "colon-frame":
      return (
        <VisibleHumanOrProcedural
          meshId={meshId}
          profile={profile}
          style={style}
          procedural={
            <group>
              <group position={[0.26, -0.12, 0.01]} scale={[0.52, 0.62, 0.48]}>
                <Surface style={style}>
                  <sphereGeometry args={[0.22, 12, 12]} />
                </Surface>
              </group>
              <group position={[0.34, 0.02, 0]} rotation={[0, 0, -0.04]}>
                <Surface style={style}>
                  <capsuleGeometry args={[0.075, 0.34, 8, 12]} />
                </Surface>
              </group>
              <group position={[0.28, 0.2, 0.01]} rotation={[0, 0, 0.55]}>
                <Surface style={style}>
                  <capsuleGeometry args={[0.065, 0.11, 6, 10]} />
                </Surface>
              </group>
              <group position={[0, 0.26, 0.02]} rotation={[0.06, 0, Math.PI / 2]}>
                <Surface style={style}>
                  <capsuleGeometry args={[0.068, 0.62, 8, 14]} />
                </Surface>
              </group>
              <group position={[-0.28, 0.18, 0.01]} rotation={[0, 0, -0.5]}>
                <Surface style={style}>
                  <capsuleGeometry args={[0.065, 0.11, 6, 10]} />
                </Surface>
              </group>
              <group position={[-0.34, -0.02, 0]} rotation={[0, 0, 0.04]}>
                <Surface style={style}>
                  <capsuleGeometry args={[0.075, 0.38, 8, 12]} />
                </Surface>
              </group>
              <group position={[0, -0.18, 0.01]} rotation={[0.42, 0, 0.48]}>
                <Surface style={style}>
                  <torusGeometry args={[0.16, 0.058, 10, 20, Math.PI * 0.92]} />
                </Surface>
              </group>
            </group>
          }
        />
      );
    case "adrenal-pair":
      return (
        <group>
          {([
            { sx: -1 as const, y: 0.02 },
            { sx: 1 as const, y: -0.02 },
          ]).map(({ sx, y }) => (
            <group key={sx} position={[sx * 0.4, y, 0]} scale={[0.32, 0.52, 0.42]}>
              <Surface style={style}>
                <boxGeometry args={[0.55, 0.22, 0.35]} />
              </Surface>
            </group>
          ))}
        </group>
      );
    case "prostate-disc":
      return (
        <VisibleHumanOrProcedural
          meshId={meshId}
          profile={profile}
          style={style}
          procedural={
            <group scale={[1.08, 0.72, 0.92]}>
              <Surface style={style}>
                <sphereGeometry args={[0.48, 16, 16]} />
              </Surface>
            </group>
          }
        />
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
