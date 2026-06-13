"use client";

import { useMemo } from "react";
import { StandardTissueMaterial } from "@/components/anatomy/cartoon/AnatomyMaterials";
import { buildPeripheralNerveGeometry } from "@/lib/anatomy/cartoon/nerve-geometry";
import { noopRaycast } from "@/lib/anatomy/cartoon/anatomy-raycast";
import {
  CARTOON_NERVE,
  CARTOON_NERVE_GLOW,
  TISSUE_PBR,
} from "@/lib/anatomy/cartoon/palette";
import type { AnatomyLayer } from "@/lib/anatomy/types";

type Props = {
  visibleLayers: Set<AnatomyLayer>;
  skinOn: boolean;
};

/** Distal peripheral nerves + cord rootlets — visual overlay when nerve layer is on. */
export function CartoonNerveLayers({ visibleLayers, skinOn }: Props) {
  const visible = visibleLayers.has("nerve");
  const geometry = useMemo(
    () => (visible ? buildPeripheralNerveGeometry() : null),
    [visible]
  );

  if (!geometry) return null;

  const opacity = skinOn ? 0.9 : 0.96;

  return (
    <mesh geometry={geometry} renderOrder={9} raycast={noopRaycast}>
      <StandardTissueMaterial
        color={CARTOON_NERVE}
        emissive={CARTOON_NERVE_GLOW}
        emissiveIntensity={0.38}
        opacity={opacity}
        roughness={TISSUE_PBR.nerve.roughness}
        metalness={TISSUE_PBR.nerve.metalness}
      />
    </mesh>
  );
}
