"use client";

import { useGLTF } from "@react-three/drei";
import { Component, type ReactNode, useLayoutEffect, useMemo, useRef } from "react";
import type { Group, Mesh, Plane } from "three";
import { DoubleSide, MeshStandardMaterial } from "three";
import {
  CT_ATLAS_ORGANS,
  entryMatchesMeshId,
  resolveCtAtlasUrlCandidates,
  resolveStructureIdForAtlasEntry,
  type CtAtlasOrganEntry,
  type CtClipPlaneId,
} from "@/lib/anatomy/ct/ct-atlas-registry";
import { createCtClipPlanes, fitVisibleHumanAtlas } from "@/lib/anatomy/ct/ct-atlas-fit";
import {
  CT_ORGAN_HU,
  CT_WINDOWS,
  huToHex,
  type CtWindowId,
} from "@/lib/anatomy/ct/ct-windows";
import type { AnatomyLayer, AnatomySystem } from "@/lib/anatomy/types";
import { getAnatomyStructure, getAnatomyStructureByMeshId } from "@/lib/anatomy";

type RigProps = {
  visibleLayers: Set<AnatomyLayer>;
  systemFilter: AnatomySystem | "all";
  windowId: CtWindowId;
  clipPlaneId: CtClipPlaneId;
  sliceOffset: number;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (structureId: string) => void;
};

class GltfLoadBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function CtAtlasOrganMeshInner({
  entry,
  url,
  windowId,
  clippingPlanes,
  visible,
  highlighted,
  dimmed,
  onPick,
}: {
  entry: CtAtlasOrganEntry;
  url: string;
  windowId: CtWindowId;
  clippingPlanes: Plane[];
  visible: boolean;
  highlighted: boolean;
  dimmed: boolean;
  onPick: () => void;
}) {
  const { scene } = useGLTF(url);
  const window = CT_WINDOWS[windowId];
  const hu = CT_ORGAN_HU[entry.id] ?? CT_ORGAN_HU[entry.meshId] ?? 40;

  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    const baseColor = huToHex(hu, window);
    const opacity = entry.opacity ?? (entry.layer === "skin" ? 0.2 : 0.92);
    const mat = new MeshStandardMaterial({
      color: highlighted ? "#c4b5fd" : baseColor,
      emissive: highlighted ? "#5b21b6" : "#000000",
      emissiveIntensity: highlighted ? 0.35 : 0,
      roughness: 0.92,
      metalness: 0,
      transparent: opacity < 1 || dimmed,
      opacity: dimmed ? opacity * 0.12 : opacity,
      depthWrite: opacity > 0.5 && !dimmed,
      side: entry.layer === "skin" ? DoubleSide : undefined,
      clippingPlanes,
      clipShadows: true,
    });
    clone.traverse((node) => {
      if ((node as Mesh).isMesh) {
        const mesh = node as Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        mesh.material = mat;
        mesh.userData.atlasOrganId = entry.id;
        mesh.userData.meshId = entry.meshId;
      }
    });
    return clone;
  }, [scene, entry, windowId, window, hu, highlighted, dimmed, clippingPlanes]);

  if (!visible) return null;

  return (
    <primitive
      object={prepared}
      onClick={(e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        onPick();
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

function CtAtlasOrganMesh({
  entry,
  windowId,
  clippingPlanes,
  visible,
  highlighted,
  dimmed,
  onPick,
}: {
  entry: CtAtlasOrganEntry;
  windowId: CtWindowId;
  clippingPlanes: Plane[];
  visible: boolean;
  highlighted: boolean;
  dimmed: boolean;
  onPick: () => void;
}) {
  const urls = resolveCtAtlasUrlCandidates(entry.fileName);
  return (
    <CtAtlasOrganMeshWithFallback
      entry={entry}
      urls={urls}
      windowId={windowId}
      clippingPlanes={clippingPlanes}
      visible={visible}
      highlighted={highlighted}
      dimmed={dimmed}
      onPick={onPick}
    />
  );
}

function CtAtlasOrganMeshWithFallback({
  entry,
  urls,
  urlIndex = 0,
  windowId,
  clippingPlanes,
  visible,
  highlighted,
  dimmed,
  onPick,
}: {
  entry: CtAtlasOrganEntry;
  urls: string[];
  urlIndex?: number;
  windowId: CtWindowId;
  clippingPlanes: Plane[];
  visible: boolean;
  highlighted: boolean;
  dimmed: boolean;
  onPick: () => void;
}) {
  const url = urls[urlIndex];
  if (!url) return null;

  const nextIndex = urlIndex + 1;
  const fallback =
    nextIndex < urls.length ? (
      <CtAtlasOrganMeshWithFallback
        entry={entry}
        urls={urls}
        urlIndex={nextIndex}
        windowId={windowId}
        clippingPlanes={clippingPlanes}
        visible={visible}
        highlighted={highlighted}
        dimmed={dimmed}
        onPick={onPick}
      />
    ) : null;

  return (
    <GltfLoadBoundary key={url} fallback={fallback}>
      <CtAtlasOrganMeshInner
        entry={entry}
        url={url}
        windowId={windowId}
        clippingPlanes={clippingPlanes}
        visible={visible}
        highlighted={highlighted}
        dimmed={dimmed}
        onPick={onPick}
      />
    </GltfLoadBoundary>
  );
}

export function CtAtlasRig({
  visibleLayers,
  systemFilter,
  windowId,
  clipPlaneId,
  sliceOffset,
  selectedId,
  highlightedId,
  onSelect,
}: RigProps) {
  const rootRef = useRef<Group>(null);
  const fittedRef = useRef(false);

  useLayoutEffect(() => {
    if (!rootRef.current || fittedRef.current) return;
    fitVisibleHumanAtlas(rootRef.current);
    fittedRef.current = true;
  });

  const clippingPlanes = useMemo(
    () => createCtClipPlanes(clipPlaneId, sliceOffset),
    [clipPlaneId, sliceOffset]
  );

  const focusMeshId = useMemo(() => {
    const id = highlightedId ?? selectedId;
    if (!id) return null;
    return getAnatomyStructure(id)?.meshId ?? null;
  }, [highlightedId, selectedId]);

  return (
    <group ref={rootRef}>
      {CT_ATLAS_ORGANS.map((entry) => {
        const visible = visibleLayers.has(entry.layer);
        const structureForMesh = getAnatomyStructureByMeshId(entry.meshId);
        const system = structureForMesh?.system ?? entry.system;
        const systemFiltered =
          systemFilter !== "all" && system !== systemFilter && entry.layer === "organ";
        const highlighted = focusMeshId ? entryMatchesMeshId(entry, focusMeshId) : false;

        const pickStructure = () => {
          const structureId = resolveStructureIdForAtlasEntry(entry);
          if (structureId) onSelect(structureId);
        };

        return (
          <CtAtlasOrganMesh
            key={entry.id}
            entry={entry}
            windowId={windowId}
            clippingPlanes={clippingPlanes}
            visible={visible}
            highlighted={highlighted}
            dimmed={systemFiltered}
            onPick={pickStructure}
          />
        );
      })}
    </group>
  );
}

export function preloadCtAtlas() {
  for (const url of CT_ATLAS_ORGANS.flatMap((o) => resolveCtAtlasUrlCandidates(o.fileName))) {
    useGLTF.preload(url);
  }
}
