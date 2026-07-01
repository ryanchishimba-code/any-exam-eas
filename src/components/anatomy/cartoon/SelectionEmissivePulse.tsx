"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import type { Group } from "three";
import { Mesh, MeshPhysicalMaterial, MeshStandardMaterial } from "three";

/** Emissive pulse on selected anatomy meshes. */
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
      ? baseIntensity + Math.sin(clock.elapsedTime * 4.1) * 0.18
      : baseIntensity;

    root.traverse((node) => {
      if (node instanceof Mesh && (node.material instanceof MeshPhysicalMaterial || node.material instanceof MeshStandardMaterial)) {
        node.material.emissiveIntensity = intensity;
      }
    });
  });

  return <group ref={groupRef}>{children}</group>;
}
