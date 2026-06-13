"use client";

import { Html } from "@react-three/drei";
import { useCallback, useMemo, useState } from "react";
import type { AnatomyLayer } from "@/lib/anatomy/types";
import { STRUCTURAL_PICK_ZONES, type StructuralPickZone } from "@/lib/anatomy/cartoon/structural-pick-zones";
import { useAnatomyPointer, useAnatomyHoverReset } from "@/components/anatomy/cartoon/AnatomyPointerProvider";
import { isPrimaryPointerHit } from "@/lib/anatomy/cartoon/anatomy-raycast";

type Props = {
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (structureId: string) => void;
};

function PickProxy({
  zone,
  position,
  highlighted,
  selected,
  onSelect,
}: {
  zone: StructuralPickZone;
  position: [number, number, number];
  highlighted: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const { setHovering } = useAnatomyPointer();
  const [hovered, setHovered] = useState(false);

  const clearHover = useCallback(() => {
    setHovered(false);
    setHovering(false);
  }, [setHovering]);
  useAnatomyHoverReset(clearHover);

  const showLabel = hovered;

  return (
    <group position={position}>
      <mesh
        visible={false}
        onClick={(e) => {
          if (!isPrimaryPointerHit(e)) return;
          e.stopPropagation();
          onSelect(zone.structureId);
        }}
        onPointerOver={(e) => {
          if (!isPrimaryPointerHit(e)) return;
          e.stopPropagation();
          setHovered(true);
          setHovering(true);
        }}
        onPointerOut={() => {
          setHovered(false);
          setHovering(false);
        }}
      >
        <boxGeometry args={zone.scale} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {showLabel ? (
        <Html
          center
          distanceFactor={5.5}
          position={[0, zone.scale[1] * 0.65, 0]}
          style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
        >
          <span className="rounded-full border border-violet-200 bg-white px-2.5 py-1 text-[11px] font-bold text-indigo-900 shadow-md">
            {zone.label}
          </span>
        </Html>
      ) : null}
    </group>
  );
}

/** Invisible pick proxies over merged muscle / vascular shells. */
export function StructuralPickRig({ visibleLayers, selectedId, highlightedId, onSelect }: Props) {
  const zones = useMemo(
    () => STRUCTURAL_PICK_ZONES.filter((zone) => visibleLayers.has(zone.layer)),
    [visibleLayers]
  );

  if (zones.length === 0) return null;

  return (
    <group>
      {zones.flatMap((zone) => {
        const highlighted = highlightedId === zone.structureId;
        const selected = selectedId === zone.structureId;
        const instances: [number, number, number][] = [zone.position];
        if (zone.bilateral) {
          instances.push([-zone.position[0], zone.position[1], zone.position[2]]);
        }
        return instances.map((position, i) => (
          <PickProxy
            key={`${zone.structureId}-${i}`}
            zone={zone}
            position={position}
            highlighted={highlighted}
            selected={selected}
            onSelect={onSelect}
          />
        ));
      })}
    </group>
  );
}
