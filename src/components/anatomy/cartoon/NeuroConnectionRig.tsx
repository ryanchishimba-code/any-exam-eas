"use client";

import { useMemo } from "react";
import { CatmullRomCurve3, Vector3 } from "three";
import { ORGAN_MODULE_LAYOUT } from "@/lib/anatomy/cartoon/organ-layout";
import { isNeuroStructure, NEURO_CONNECTIONS } from "@/lib/anatomy/neuro-connections";

const LINK_COLORS: Record<string, string> = {
  ascending: "#a78bfa",
  vascular: "#dc2626",
  protective: "#94a3b8",
};

function moduleAnchor(meshId: string, yBias = 0): Vector3 {
  const layout = ORGAN_MODULE_LAYOUT[meshId];
  if (!layout) return new Vector3(0, 1.5, 0);
  const [x, y, z] = layout.position;
  const [, sy] = layout.scale;
  return new Vector3(x, y + yBias * sy, z);
}

function NeuralTube({
  from,
  to,
  mid,
  color,
  radius = 0.0035,
  opacity = 0.82,
}: {
  from: Vector3;
  to: Vector3;
  mid: Vector3;
  color: string;
  radius?: number;
  opacity?: number;
}) {
  const curve = useMemo(() => new CatmullRomCurve3([from, mid, to]), [from, mid, to]);
  return (
    <mesh>
      <tubeGeometry args={[curve, 28, radius, 8, false]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.35}
        transparent
        opacity={opacity}
        roughness={0.45}
        metalness={0.08}
      />
    </mesh>
  );
}

/** Anatomical pathway overlays when a neuro structure is selected or highlighted. */
export function NeuroConnectionRig({ focusStructureId }: { focusStructureId: string | null }) {
  if (!focusStructureId || !isNeuroStructure(focusStructureId)) return null;

  const cordTop = moduleAnchor("spinal-cord", 0.42);
  const skullInner = moduleAnchor("skull", -0.05);
  const carotidL = new Vector3(-0.048, 1.28, 0.09);
  const carotidR = new Vector3(0.048, 1.28, 0.09);
  const skullL = new Vector3(-0.09, 1.5, 0.03);
  const skullR = new Vector3(0.09, 1.5, 0.03);

  const activeLinks = NEURO_CONNECTIONS.filter(
    (link) => link.from === focusStructureId || link.to === focusStructureId
  );
  if (activeLinks.length === 0) return null;

  return (
    <group>
      {activeLinks.map((link) => {
        const color = LINK_COLORS[link.kind] ?? "#a78bfa";
        if (link.kind === "vascular") {
          return (
            <group key={`${link.from}-${link.to}`}>
              <NeuralTube
                from={carotidL}
                to={skullL}
                mid={new Vector3(-0.07, 1.4, 0.08)}
                color={color}
                radius={0.003}
              />
              <NeuralTube
                from={carotidR}
                to={skullR}
                mid={new Vector3(0.07, 1.4, 0.08)}
                color={color}
                radius={0.003}
              />
            </group>
          );
        }
        const mid = skullInner.clone().lerp(cordTop, 0.35);
        return (
          <NeuralTube
            key={`${link.from}-${link.to}`}
            from={skullInner}
            to={cordTop}
            mid={mid}
            color={color}
            radius={0.0025}
            opacity={0.55}
          />
        );
      })}
    </group>
  );
}
