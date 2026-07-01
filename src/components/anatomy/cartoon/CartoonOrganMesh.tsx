"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Euler, Group } from "three";
import { MathUtils, Vector3 } from "three";
import type { AnatomyModuleDef } from "@/lib/anatomy/modules/types";
import { getOrganDepthOrder } from "@/lib/anatomy/cartoon/organ-layout";
import { SelectionEmissivePulse } from "@/components/anatomy/cartoon/SelectionEmissivePulse";
import { ANATOMY_SYSTEM_COLORS, blendHexColor } from "@/lib/anatomy/system-colors";
import type { AnatomyLayer, AnatomySystem } from "@/lib/anatomy/types";
import { useAnatomyPointer, useAnatomyHoverReset } from "@/components/anatomy/cartoon/AnatomyPointerProvider";
import { isPrimaryPointerHit } from "@/lib/anatomy/cartoon/anatomy-raycast";
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
      return 0.9;
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
  deemphasized = false,
  skinOn,
  layerFade = 1,
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
  deemphasized?: boolean;
  skinOn: boolean;
  layerFade?: number;
  structureSystem?: AnatomySystem;
  systemFilter: AnatomySystem | "all";
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
  if (deemphasized) opacity *= 0.34;
  opacity *= layerFade;

  const nerveGlow = def.layer === "nerve";
  const emissive =
    highlighted || selected ? "#22d3ee" : hovered ? "#67e8f9" : nerveGlow ? "#fbbf24" : "#000000";
  const emissiveIntensity =
    highlighted || selected ? 0.55 : hovered ? 0.28 : nerveGlow ? 0.28 : 0;

  const outlineThickness = selected ? 0.024 : highlighted ? 0.018 : hovered ? 0.013 : 0;
  const outlineColor = selected ? "#22d3ee" : highlighted ? "#67e8f9" : "#a78bfa";

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
      outlineThickness,
      outlineColor,
    }),
    [emissive, emissiveIntensity, opacity, outlineColor, outlineThickness, tintedColor]
  );

  const euler = rotation as Euler | undefined;
  const depthBase = def.layer === "organ" ? getOrganDepthOrder(def.id) : 5;
  const renderOrder = (skinOn ? 2 : 3) + depthBase;

  const showLabel = hovered;

  return (
    <group
      ref={ref}
      position={position}
      rotation={euler}
      renderOrder={renderOrder}
      onClick={(e) => {
        if (!isPrimaryPointerHit(e)) return;
        e.stopPropagation();
        onSelect(def.id);
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
      <SelectionEmissivePulse active={selected} baseIntensity={emissiveIntensity}>
        <OrganVisual
          profile={def.profile}
          geometry={def.geometry}
          style={surfaceStyle}
          mirrored={mirrored}
          meshId={def.id}
        />
      </SelectionEmissivePulse>

      {showLabel ? (
        <Html
          center
          distanceFactor={5.5}
          position={[0, 0.75, 0]}
          style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
        >
          <span className="rounded-full border border-cyan-500/30 bg-[#0f172a]/90 px-2.5 py-1 text-[11px] font-bold text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.25)]">
            {label}
          </span>
        </Html>
      ) : null}
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
  deemphasized?: boolean;
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
  deemphasized = false,
  skinOn,
  onSelect,
  boneStructuralOn = false,
  muscleStructuralOn = false,
}: Props) {
  const fadeRef = useRef(visible ? 1 : 0);
  const [layerFade, setLayerFade] = useState(visible ? 1 : 0);
  const [rendering, setRendering] = useState(visible);
  const frameRef = useRef(0);

  useEffect(() => {
    if (visible) setRendering(true);
  }, [visible]);

  useFrame(() => {
    const target = visible ? 1 : 0;
    fadeRef.current = MathUtils.lerp(fadeRef.current, target, 0.14);
    frameRef.current += 1;
    if (frameRef.current % 2 === 0) {
      setLayerFade(fadeRef.current);
    }
    if (!visible && fadeRef.current < 0.025) setRendering(false);
  });

  if (!rendering) return null;

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
          deemphasized={deemphasized}
          skinOn={skinOn}
          layerFade={layerFade}
          structureSystem={structureSystem}
          systemFilter={systemFilter}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}
