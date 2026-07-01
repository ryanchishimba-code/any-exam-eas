"use client";

import { Outlines } from "@react-three/drei";
import type { ReactNode } from "react";
import { TISSUE_PBR, type TissueKind } from "@/lib/anatomy/cartoon/palette";

type StandardProps = {
  color: string;
  opacity?: number;
  emissive?: string;
  emissiveIntensity?: number;
  roughness?: number;
  metalness?: number;
  depthWrite?: boolean;
  tissue?: TissueKind;
  envMapIntensity?: number;
};

function tissuePhysicalProps(tissue: TissueKind) {
  const pbr = TISSUE_PBR[tissue];
  return {
    roughness: pbr.roughness,
    metalness: pbr.metalness,
    clearcoat: pbr.clearcoat,
    clearcoatRoughness: pbr.clearcoatRoughness,
    sheen: pbr.sheen,
    sheenRoughness: pbr.sheenRoughness,
    envMapIntensity: pbr.envMapIntensity,
  };
}

export function StandardTissueMaterial({
  color,
  opacity = 1,
  emissive = "#000000",
  emissiveIntensity = 0,
  roughness,
  metalness,
  depthWrite,
  tissue = "organ",
  envMapIntensity,
}: StandardProps) {
  const pbr = tissuePhysicalProps(tissue);
  const transparent = opacity < 1;

  return (
    <meshPhysicalMaterial
      color={color}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      roughness={roughness ?? pbr.roughness}
      metalness={metalness ?? pbr.metalness}
      clearcoat={pbr.clearcoat}
      clearcoatRoughness={pbr.clearcoatRoughness}
      sheen={pbr.sheen}
      sheenRoughness={pbr.sheenRoughness}
      sheenColor={color}
      envMapIntensity={envMapIntensity ?? pbr.envMapIntensity}
      transparent={transparent}
      opacity={opacity}
      depthWrite={depthWrite ?? opacity > 0.65}
    />
  );
}

type SurfaceProps = StandardProps & {
  children: ReactNode;
  outlineThickness?: number;
  outlineColor?: string;
  castShadow?: boolean;
};

/** Organ / structure surface — physical PBR with optional selection outline. */
export function TissueSurface({
  children,
  outlineThickness = 0,
  outlineColor = "#22d3ee",
  castShadow = true,
  tissue = "organ",
  ...mat
}: SurfaceProps) {
  return (
    <mesh castShadow={castShadow} receiveShadow>
      {children}
      <StandardTissueMaterial tissue={tissue} {...mat} />
      {outlineThickness > 0.004 ? (
        <Outlines
          thickness={outlineThickness}
          color={outlineColor}
          screenspace
          opacity={0.95}
          angle={Math.PI}
        />
      ) : null}
    </mesh>
  );
}

export function SkinMaterial({
  color,
  opacity = 1,
  ghost = false,
}: {
  color: string;
  opacity?: number;
  ghost?: boolean;
}) {
  const tissue = ghost ? "ghost" : "skin";
  const pbr = TISSUE_PBR[tissue];

  return (
    <meshPhysicalMaterial
      color={color}
      roughness={pbr.roughness}
      metalness={pbr.metalness}
      clearcoat={pbr.clearcoat}
      clearcoatRoughness={pbr.clearcoatRoughness}
      sheen={pbr.sheen}
      sheenRoughness={pbr.sheenRoughness}
      sheenColor={color}
      envMapIntensity={pbr.envMapIntensity}
      transparent={opacity < 1}
      opacity={opacity}
      depthWrite={!ghost && opacity > 0.5}
    />
  );
}
