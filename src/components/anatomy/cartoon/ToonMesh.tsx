"use client";

import { Outlines } from "@react-three/drei";
import type { ReactNode } from "react";
import { CARTOON_OUTLINE } from "@/lib/anatomy/cartoon/palette";

type Props = {
  color: string;
  children: ReactNode;
  opacity?: number;
  transparent?: boolean;
  emissive?: string;
  emissiveIntensity?: number;
  outlineWidth?: number;
};

/** Flat toon material + ink outline for cartoon organs and body. */
export function ToonMesh({
  color,
  children,
  opacity = 1,
  transparent = false,
  emissive = "#000000",
  emissiveIntensity = 0,
  outlineWidth = 0.018,
}: Props) {
  return (
    <mesh castShadow receiveShadow>
      {children}
      <meshToonMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        transparent={transparent}
        opacity={opacity}
      />
      <Outlines thickness={outlineWidth} color={CARTOON_OUTLINE} screenspace />
    </mesh>
  );
}
