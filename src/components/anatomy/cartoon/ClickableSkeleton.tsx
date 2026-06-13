"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Group } from "three";
import { Vector3 } from "three";
import type { BufferGeometry } from "three";
import { StandardTissueMaterial } from "@/components/anatomy/cartoon/AnatomyMaterials";
import { useAnatomyPointer, useAnatomyHoverReset } from "@/components/anatomy/cartoon/AnatomyPointerProvider";
import { isPrimaryPointerHit } from "@/lib/anatomy/cartoon/anatomy-raycast";
import {
  buildBoneInstances,
  createBoneMeshMap,
  isBoneHighlighted,
  type BoneInstance,
} from "@/lib/anatomy/bones";
import { CARTOON_BONE, CARTOON_OUTLINE, TISSUE_PBR } from "@/lib/anatomy/cartoon/palette";

type Props = {
  visible: boolean;
  skinOn: boolean;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (structureId: string) => void;
};

function BoneMesh({
  bone,
  geometry,
  active,
  selected,
  opacity,
  onSelect,
}: {
  bone: BoneInstance;
  geometry: BufferGeometry;
  active: boolean;
  selected: boolean;
  opacity: number;
  onSelect: (id: string) => void;
}) {
  const ref = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const { setHovering } = useAnatomyPointer();

  const clearHover = useCallback(() => {
    setHovered(false);
    setHovering(false);
  }, [setHovering]);
  useAnatomyHoverReset(clearHover);
  const base = useRef(new Vector3(1, 1, 1));
  const target = useRef(new Vector3(1, 1, 1));

  useEffect(() => {
    const s = active ? 1.12 : hovered ? 1.06 : 1;
    base.current.set(s, s, s);
    if (ref.current) ref.current.scale.copy(base.current);
  }, [active, hovered]);

  useFrame(() => {
    if (!ref.current) return;
    const s = active ? 1.12 : hovered ? 1.06 : 1;
    target.current.set(s, s, s);
    if (s === 1 && ref.current.scale.distanceToSquared(target.current) < 1e-5) return;
    ref.current.scale.lerp(target.current, 0.14);
  });

  const emissive = active ? "#7c3aed" : hovered ? "#8b5cf6" : "#000000";
  const emissiveIntensity = active ? 0.5 : hovered ? 0.2 : 0;

  return (
    <group
      ref={ref}
      renderOrder={active ? 8 : 2}
      onClick={(e) => {
        if (!isPrimaryPointerHit(e)) return;
        e.stopPropagation();
        onSelect(bone.id);
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
      <mesh geometry={geometry} castShadow={opacity > 0.5}>
        <StandardTissueMaterial
          color={CARTOON_BONE}
          opacity={opacity}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={TISSUE_PBR.bone.roughness}
          metalness={TISSUE_PBR.bone.metalness}
        />
      </mesh>
      {hovered ? (
        <Html
          center
          distanceFactor={5}
          position={[bone.focus[0], bone.focus[1] + 0.06, bone.focus[2]]}
          style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
        >
          <span
            className="rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-md"
            style={{ borderColor: CARTOON_OUTLINE, background: "#fff", color: "#312e81" }}
          >
            {bone.name}
          </span>
        </Html>
      ) : null}
    </group>
  );
}

/** 206 individually clickable adult bones. */
export function ClickableSkeleton({
  visible,
  skinOn,
  selectedId,
  highlightedId,
  onSelect,
}: Props) {
  const bones = useMemo(() => buildBoneInstances(), []);
  const meshMap = useMemo(() => createBoneMeshMap(bones), [bones]);
  const focusId = highlightedId ?? selectedId;
  const baseOpacity = skinOn ? 0.78 : 0.96;

  if (!visible) return null;

  return (
    <group>
      {bones.map((bone) => {
        const geo = meshMap.get(bone.id);
        if (!geo) return null;
        const active = isBoneHighlighted(bone.id, focusId);
        const selected = selectedId === bone.id;
        return (
          <BoneMesh
            key={bone.id}
            bone={bone}
            geometry={geo}
            active={active}
            selected={selected}
            opacity={active ? Math.min(0.98, baseOpacity + 0.04) : baseOpacity}
            onSelect={onSelect}
          />
        );
      })}
    </group>
  );
}
