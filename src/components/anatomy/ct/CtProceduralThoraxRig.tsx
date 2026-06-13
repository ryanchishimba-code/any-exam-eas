"use client";

import { forwardRef, useMemo } from "react";
import type { BufferGeometry, Group, Plane } from "three";
import { DoubleSide, MeshBasicMaterial } from "three";
import {
  getCtProceduralThoraxSegments,
  buildCtProceduralThoraxGeometries,
  ctThoraxSegmentHighlighted,
  ctThoraxSegmentPickStructure,
  type CtProceduralThoraxSegment,
} from "@/lib/anatomy/ct/ct-procedural-thorax";
import { CT_ORGAN_HU, CT_WINDOWS, huToHex, type CtWindowId } from "@/lib/anatomy/ct/ct-windows";

type Props = {
  visible: boolean;
  windowId: CtWindowId;
  clippingPlanes: Plane[];
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (structureId: string) => void;
};

function CtThoraxSegmentMesh({
  segment,
  geometry,
  windowId,
  clippingPlanes,
  highlighted,
  onSelect,
}: {
  segment: CtProceduralThoraxSegment;
  geometry: BufferGeometry;
  windowId: CtWindowId;
  clippingPlanes: Plane[];
  highlighted: boolean;
  onSelect: (structureId: string) => void;
}) {
  const material = useMemo(() => {
    const window = CT_WINDOWS[windowId];
    const hu =
      CT_ORGAN_HU[segment.id] ??
      CT_ORGAN_HU[segment.meshId] ??
      CT_ORGAN_HU["ct-thorax"] ??
      310;
    const color = huToHex(highlighted ? hu + 40 : hu, window);
    const boneWindow = windowId === "bone";
    return new MeshBasicMaterial({
      color: highlighted ? "#ddd6fe" : color,
      transparent: !boneWindow || highlighted,
      opacity: highlighted ? 0.98 : boneWindow ? 0.99 : 0.88,
      depthWrite: true,
      side: DoubleSide,
      clippingPlanes,
    });
  }, [segment.id, segment.meshId, windowId, clippingPlanes, highlighted]);

  return (
    <mesh
      geometry={geometry}
      material={material}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(ctThoraxSegmentPickStructure(segment));
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    />
  );
}

/** Figure-space thorax bones for CT mode (fills gap where HuBMAP lacks VH rib/sternum GLBs). */
export const CtProceduralThoraxRig = forwardRef<Group, Props>(function CtProceduralThoraxRig(
  { visible, windowId, clippingPlanes, selectedId, highlightedId, onSelect },
  ref
) {
  const geometries = useMemo(() => buildCtProceduralThoraxGeometries(), []);
  const segments = useMemo(() => getCtProceduralThoraxSegments(), []);

  const focusStructureIds = useMemo(() => {
    const ids = new Set<string>();
    const id = highlightedId ?? selectedId;
    if (id) ids.add(id);
    return ids;
  }, [highlightedId, selectedId]);

  return (
    <group ref={ref} visible={visible}>
      {segments.map((segment) => {
        const geometry = geometries.get(segment.id);
        if (!geometry) return null;
        return (
          <CtThoraxSegmentMesh
            key={segment.id}
            segment={segment}
            geometry={geometry}
            windowId={windowId}
            clippingPlanes={clippingPlanes}
            highlighted={ctThoraxSegmentHighlighted(segment, focusStructureIds)}
            onSelect={onSelect}
          />
        );
      })}
    </group>
  );
});
