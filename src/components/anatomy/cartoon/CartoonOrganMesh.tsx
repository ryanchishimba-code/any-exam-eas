"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Euler, Group } from "three";
import { Vector3 } from "three";
import type { AnatomyModuleDef } from "@/lib/anatomy/modules/types";
import { getOrganDepthOrder } from "@/lib/anatomy/cartoon/organ-layout";
import { CARTOON_OUTLINE } from "@/lib/anatomy/cartoon/palette";
import { ANATOMY_SYSTEM_COLORS, blendHexColor } from "@/lib/anatomy/system-colors";
import type { AnatomyLayer, AnatomySystem } from "@/lib/anatomy/types";
import { useAnatomyPointer } from "@/components/anatomy/cartoon/AnatomyPointerProvider";
import { OrganVisual, STRUCTURAL_BONE_MESH_IDS, STRUCTURAL_MUSCLE_MESH_IDS, type OrganSurfaceStyle } from "./OrganVisual";

const BILATERAL_MESH_IDS = new Set(["biceps", "humerus", "femur", "tibia", "scapula"]);

function resolveOpacity(
  layer: AnatomyLayer,
  skinOn: boolean,
  active: boolean,
  baseOpacity: number
): number {
  if (active) return Math.min(0.98, baseOpacity);
  if (!skinOn) return baseOpacity;
  switch (layer) {
    case "bone":
      return 0.82;
    case "muscle":
      return 0.72;
    case "vascular":
      return 0.85;
    case "nerve":
      return 0.6;
    case "organ":
      return baseOpacity * 0.58;
    default:
      return baseOpacity * 0.45;
  }
}

function OrganMeshInstance({
  def,
  label,
  position,
  rotation,
  mirrored,
  highlighted,
  selected,
  skinOn,
  structureSystem,
  systemFilter,
  onSelect,
}: {
  def: AnatomyModuleDef;
  label: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  mirrored: boolean;
  highlighted: boolean;
  selected: boolean;
  skinOn: boolean;
  structureSystem?: AnatomySystem;
  systemFilter: AnatomySystem | "all";
  onSelect: (id: string) => void;
}) {
  const ref = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const { setHovering } = useAnatomyPointer();
  const baseScale = useMemo(() => new Vector3(...def.scale), [def.scale]);
  const targetScale = useRef(new Vector3(...def.scale));

  useEffect(() => {
    if (ref.current) ref.current.scale.copy(baseScale);
  }, [baseScale]);

  useFrame(() => {
    if (!ref.current) return;
    const factor = highlighted || selected ? 1.1 : hovered ? 1.05 : 1;
    targetScale.current.set(baseScale.x * factor, baseScale.y * factor, baseScale.z * factor);
    if (
      factor === 1 &&
      ref.current.scale.distanceToSquared(targetScale.current) < 1e-5
    ) {
      return;
    }
    ref.current.scale.lerp(targetScale.current, 0.14);
  });

  const active = highlighted || selected || hovered;
  const baseOpacity = def.opacity ?? 1;
  let opacity = resolveOpacity(def.layer, skinOn, active, baseOpacity);

  const systemFiltered =
    systemFilter !== "all" &&
    def.layer === "organ" &&
    structureSystem &&
    structureSystem !== systemFilter &&
    !active;
  if (systemFiltered) opacity *= 0.14;

  const emissive = highlighted || selected ? "#7c3aed" : hovered ? "#8b5cf6" : "#000000";
  const emissiveIntensity = highlighted || selected ? 0.45 : hovered ? 0.18 : 0;

  const tintedColor = useMemo(() => {
    if (def.layer !== "organ") return def.color;
    // Keep each organ's assigned color — only nudge toward system accent when filtering
    if (systemFilter === "all" || !structureSystem) return def.color;
    if (structureSystem !== systemFilter) return def.color;
    const accent = ANATOMY_SYSTEM_COLORS[structureSystem];
    return blendHexColor(def.color, accent, 0.12);
  }, [def.color, def.layer, structureSystem, systemFilter]);

  const surfaceStyle: OrganSurfaceStyle = useMemo(
    () => ({
      color: tintedColor,
      opacity,
      emissive,
      emissiveIntensity,
      outlineThickness: active ? 0.014 : 0,
      outlineColor: active ? "#5b21b6" : CARTOON_OUTLINE,
    }),
    [active, emissive, emissiveIntensity, opacity, tintedColor]
  );

  const euler = rotation as Euler | undefined;
  const depthBase = def.layer === "organ" ? getOrganDepthOrder(def.id) : 5;
  const renderOrder = (skinOn ? 2 : 3) + depthBase;

  return (
    <group
      ref={ref}
      position={position}
      rotation={euler}
      renderOrder={renderOrder}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(def.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        setHovering(true);
      }}
      onPointerOut={() => {
        setHovered(false);
        setHovering(false);
      }}
    >
      <OrganVisual
        profile={def.profile}
        geometry={def.geometry}
        style={surfaceStyle}
        mirrored={mirrored}
        meshId={def.id}
      />

      {active && (
        <Html
          center
          distanceFactor={5.5}
          position={[0, 0.75, 0]}
          style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
        >
          <span className="rounded-full border border-violet-200 bg-white px-2.5 py-1 text-[11px] font-bold text-indigo-900 shadow-md">
            {label}
          </span>
        </Html>
      )}
    </group>
  );
}

type Props = {
  def: AnatomyModuleDef;
  label: string;
  structureSystem?: AnatomySystem;
  systemFilter?: AnatomySystem | "all";
  visible: boolean;
  highlighted: boolean;
  selected: boolean;
  skinOn: boolean;
  onSelect: (id: string) => void;
  boneStructuralOn?: boolean;
  muscleStructuralOn?: boolean;
};

export function CartoonOrganMesh({
  def,
  label,
  structureSystem,
  systemFilter = "all",
  visible,
  highlighted,
  selected,
  skinOn,
  onSelect,
  boneStructuralOn = false,
  muscleStructuralOn = false,
}: Props) {
  if (!visible) return null;

  const hideDuplicateBone =
    boneStructuralOn &&
    def.layer === "bone" &&
    STRUCTURAL_BONE_MESH_IDS.has(def.id) &&
    !highlighted &&
    !selected;

  const hideDuplicateMuscle =
    muscleStructuralOn &&
    def.layer === "muscle" &&
    STRUCTURAL_MUSCLE_MESH_IDS.has(def.id) &&
    !highlighted &&
    !selected;

  if (hideDuplicateBone || hideDuplicateMuscle) return null;

  const instances: { position: [number, number, number]; mirrored: boolean }[] = [
    { position: def.position, mirrored: false },
  ];
  if (BILATERAL_MESH_IDS.has(def.id)) {
    instances.push({
      position: [-def.position[0], def.position[1], def.position[2]],
      mirrored: true,
    });
  }

  return (
    <>
      {instances.map(({ position, mirrored }, i) => (
        <OrganMeshInstance
          key={`${def.id}-${i}`}
          def={def}
          label={label}
          position={position}
          rotation={def.rotation}
          mirrored={mirrored}
          highlighted={highlighted}
          selected={selected}
          skinOn={skinOn}
          structureSystem={structureSystem}
          systemFilter={systemFilter}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}
