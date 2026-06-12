"use client";

import { Outlines } from "@react-three/drei";
import type { ReactNode } from "react";
import { TISSUE_PBR } from "@/lib/anatomy/cartoon/palette";

type StandardProps = {
  color: string;
  opacity?: number;
  emissive?: string;
  emissiveIntensity?: number;
  roughness?: number;
  metalness?: number;
  depthWrite?: boolean;
};

export function StandardTissueMaterial({
  color,
  opacity = 1,
  emissive = "#000000",
  emissiveIntensity = 0,
  roughness = TISSUE_PBR.organ.roughness,
  metalness = TISSUE_PBR.organ.metalness,
  depthWrite,
}: StandardProps) {
  const transparent = opacity < 1;
  return (
    <meshStandardMaterial
      color={color}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      roughness={roughness}
      metalness={metalness}
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

/** Organ / structure surface — PBR with optional selection outline only. */
export function TissueSurface({
  children,
  outlineThickness = 0,
  outlineColor = "#312e81",
  castShadow = true,
  ...mat
}: SurfaceProps) {
  return (
    <mesh castShadow={castShadow}>
      {children}
      <StandardTissueMaterial {...mat} />
      {outlineThickness > 0.004 ? (
        <Outlines thickness={outlineThickness} color={outlineColor} screenspace />
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
  const pbr = ghost ? TISSUE_PBR.ghost : TISSUE_PBR.skin;
  return (
    <meshStandardMaterial
      color={color}
      roughness={pbr.roughness}
      metalness={pbr.metalness}
      transparent={opacity < 1}
      opacity={opacity}
      depthWrite={!ghost && opacity > 0.5}
      envMapIntensity={ghost ? 0.4 : 0.65}
    />
  );
}
