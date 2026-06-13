"use client";

import { useGLTF } from "@react-three/drei";
import { Component, type ReactNode, useCallback, useLayoutEffect, useMemo, useRef } from "react";
import type { Group, Mesh, Plane } from "three";
import { DoubleSide, MeshBasicMaterial } from "three";
import {
  CT_ATLAS_ORGANS,
  entryMatchesMeshId,
  resolveCtAtlasUrlCandidates,
  resolveStructureIdForAtlasEntry,
  type CtAtlasOrganEntry,
  type CtClipPlaneId,
} from "@/lib/anatomy/ct/ct-atlas-registry";
import { createCtClipPlanes, fitVisibleHumanAtlas } from "@/lib/anatomy/ct/ct-atlas-fit";
import { fitAllenBrainToFigure } from "@/lib/anatomy/ct/brain-fit";
import {
  CT_ORGAN_HU,
  CT_WINDOWS,
  huToHex,
  type CtWindowId,
} from "@/lib/anatomy/ct/ct-windows";
import { getNeuroConnectedStructureIds } from "@/lib/anatomy/neuro-connections";
import type { AnatomyLayer, AnatomySystem } from "@/lib/anatomy/types";
import { getAnatomyStructure, getAnatomyStructureByMeshId } from "@/lib/anatomy";
import { CtProceduralThoraxRig } from "@/components/anatomy/ct/CtProceduralThoraxRig";

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
  onLoaded,
  headAnchored = false,
}: {
  entry: CtAtlasOrganEntry;
  url: string;
  windowId: CtWindowId;
  clippingPlanes: Plane[];
  visible: boolean;
  highlighted: boolean;
  dimmed: boolean;
  onPick: () => void;
  onLoaded: () => void;
  headAnchored?: boolean;
}) {
  const { scene } = useGLTF(url);
  const window = CT_WINDOWS[windowId];
  const hu = CT_ORGAN_HU[entry.id] ?? CT_ORGAN_HU[entry.meshId] ?? 40;

  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    if (headAnchored) fitAllenBrainToFigure(clone);
    const baseColor = huToHex(hu, window);
    const opacity = entry.opacity ?? (entry.layer === "skin" ? 0.18 : 0.98);
    const mat = new MeshBasicMaterial({
      color: highlighted ? "#ddd6fe" : baseColor,
      transparent: opacity < 1 || dimmed,
      opacity: dimmed ? opacity * 0.38 : opacity,
      depthWrite: opacity > 0.5 && !dimmed,
      side: entry.layer === "skin" ? DoubleSide : undefined,
      clippingPlanes,
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
  }, [scene, entry, windowId, window, hu, highlighted, dimmed, clippingPlanes, headAnchored]);

  useLayoutEffect(() => {
    onLoaded();
  }, [prepared, onLoaded]);

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
  onLoaded,
}: {
  entry: CtAtlasOrganEntry;
  windowId: CtWindowId;
  clippingPlanes: Plane[];
  visible: boolean;
  highlighted: boolean;
  dimmed: boolean;
  onPick: () => void;
  onLoaded: () => void;
}) {
  const urls = resolveCtAtlasUrlCandidates(entry.fileName);
  const headAnchored = entry.fit === "head";
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
      onLoaded={onLoaded}
      headAnchored={headAnchored}
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
  onLoaded,
  headAnchored = false,
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
  onLoaded: () => void;
  headAnchored?: boolean;
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
        onLoaded={onLoaded}
        headAnchored={headAnchored}
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
        onLoaded={onLoaded}
        headAnchored={headAnchored}
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
  const loadGeneration = useRef(0);

  const scheduleRefit = useCallback(() => {
    if (!rootRef.current) return;
    const gen = ++loadGeneration.current;
    requestAnimationFrame(() => {
      if (gen !== loadGeneration.current || !rootRef.current) return;
      fitVisibleHumanAtlas(rootRef.current);
    });
  }, []);

  const clippingPlanes = useMemo(
    () => createCtClipPlanes(clipPlaneId, sliceOffset),
    [clipPlaneId, sliceOffset]
  );

  const focusStructureIds = useMemo(() => {
    const id = highlightedId ?? selectedId;
    return getNeuroConnectedStructureIds(id);
  }, [highlightedId, selectedId]);

  const focusMeshIds = useMemo(() => {
    const meshIds = new Set<string>();
    for (const structureId of focusStructureIds) {
      const meshId = getAnatomyStructure(structureId)?.meshId;
      if (meshId) meshIds.add(meshId);
    }
    return meshIds;
  }, [focusStructureIds]);

  const vhAtlasOrgans = CT_ATLAS_ORGANS.filter((entry) => entry.fit !== "head");
  const headAnchoredOrgans = CT_ATLAS_ORGANS.filter((entry) => entry.fit === "head");

  return (
    <>
      <group ref={rootRef}>
        {vhAtlasOrgans.map((entry) => {
          const visible = visibleLayers.has(entry.layer);
          const structureForMesh = getAnatomyStructureByMeshId(entry.meshId);
          const system = structureForMesh?.system ?? entry.system;
          const systemFiltered =
            systemFilter !== "all" && system !== systemFilter && entry.layer === "organ";
          const highlighted =
            focusMeshIds.size > 0 &&
            [...focusMeshIds].some((meshId) => entryMatchesMeshId(entry, meshId));

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
              onLoaded={scheduleRefit}
            />
          );
        })}
      </group>
      {headAnchoredOrgans.map((entry) => {
        const visible = visibleLayers.has(entry.layer);
        const structureForMesh = getAnatomyStructureByMeshId(entry.meshId);
        const system = structureForMesh?.system ?? entry.system;
        const systemFiltered =
          systemFilter !== "all" && system !== systemFilter && entry.layer === "organ";
        const highlighted =
          focusMeshIds.size > 0 &&
          [...focusMeshIds].some((meshId) => entryMatchesMeshId(entry, meshId));

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
            onLoaded={() => {}}
          />
        );
      })}
      <CtProceduralThoraxRig
        visible={visibleLayers.has("bone")}
        windowId={windowId}
        clippingPlanes={clippingPlanes}
        selectedId={selectedId}
        highlightedId={highlightedId}
        onSelect={onSelect}
      />
    </>
  );
}

export function preloadCtAtlas() {
  for (const url of CT_ATLAS_ORGANS.flatMap((o) => resolveCtAtlasUrlCandidates(o.fileName))) {
    useGLTF.preload(url);
  }
}
