"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import type { Group } from "three";
import { Mesh, MeshStandardMaterial } from "three";

/** Subtle emissive pulse on selected anatomy meshes. */
export function SelectionEmissivePulse({
  active,
  baseIntensity,
  children,
}: {
  active: boolean;
  baseIntensity: number;
  children: ReactNode;
}) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const root = groupRef.current;
    if (!root) return;
    const intensity = active
      ? baseIntensity + Math.sin(clock.elapsedTime * 3.4) * 0.11
      : baseIntensity;
    root.traverse((node) => {
      if (node instanceof Mesh && node.material instanceof MeshStandardMaterial) {
        node.material.emissiveIntensity = intensity;
      }
    });
  });

  return <group ref={groupRef}>{children}</group>;
}
