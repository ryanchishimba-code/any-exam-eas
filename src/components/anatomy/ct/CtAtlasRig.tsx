"use client";

import { useGLTF } from "@react-three/drei";
import { Html } from "@react-three/drei";
import { Component, type ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
import { fitAllenBrainToAtlas, fitAllenBrainToFigure } from "@/lib/anatomy/ct/brain-fit";
import {
  CT_ORGAN_HU,
  CT_WINDOWS,
  blendHuTintHex,
  type CtWindowId,
} from "@/lib/anatomy/ct/ct-windows";
import { getNeuroConnectedStructureIds } from "@/lib/anatomy/neuro-connections";
import { getAnatomyModule } from "@/lib/anatomy/modules/registry";
import { ORGAN_MESH_COLORS } from "@/lib/anatomy/cartoon/organ-colors";
import { createClinicalOrganMaterial } from "@/lib/anatomy/clinical/clinical-organ-material";
import type { AnatomyLayer, AnatomySystem } from "@/lib/anatomy/types";
import { getAnatomyStructure, getAnatomyStructureByMeshId } from "@/lib/anatomy";
import type { ThreeEvent } from "@react-three/fiber";
import { useAnatomyPointer, useAnatomyHoverReset } from "@/components/anatomy/cartoon/AnatomyPointerProvider";
import { isPrimaryPointerHit } from "@/lib/anatomy/cartoon/anatomy-raycast";

type AtlasShading = "pacs" | "clinical";

type RigProps = {
  visibleLayers: Set<AnatomyLayer>;
  systemFilter: AnatomySystem | "all";
  windowId: CtWindowId;
  clipPlaneId: CtClipPlaneId;
  sliceOffset: number;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (structureId: string) => void;
  shading?: AtlasShading;
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

function buildOrganMaterial(opts: {
  entry: CtAtlasOrganEntry;
  windowId: CtWindowId;
  hu: number;
  tintColor: string;
  emphasized: boolean;
  selected: boolean;
  dimmed: boolean;
  clippingPlanes: Plane[];
  shading: AtlasShading;
}) {
  const { entry, windowId, hu, tintColor, emphasized, selected, dimmed, clippingPlanes, shading } = opts;
  const window = CT_WINDOWS[windowId];
  const opacity = entry.opacity ?? (entry.layer === "skin" ? 0.18 : 0.98);

  if (shading === "clinical") {
    return createClinicalOrganMaterial({
      entry,
      tintColor,
      emphasized,
      selected,
      dimmed,
      clippingPlanes,
    });
  }

  const tintWeight = entry.layer === "skin" ? 0.08 : entry.layer === "bone" ? 0.22 : 0.42;
  const baseColor = emphasized ? "#ddd6fe" : blendHuTintHex(hu, tintColor, window, tintWeight);

  return new MeshBasicMaterial({
    color: baseColor,
    transparent: opacity < 1 || dimmed,
    opacity: dimmed ? opacity * 0.38 : opacity,
    depthWrite: opacity > 0.5 && !dimmed,
    side: entry.layer === "skin" ? DoubleSide : undefined,
    clippingPlanes,
  });
}

function CtAtlasOrganMeshInner({
  entry,
  url,
  windowId,
  clippingPlanes,
  visible,
  highlighted,
  selected,
  dimmed,
  onPick,
  onGeometryReady,
  headAnchored = false,
  deferHeadFit = false,
  shading = "pacs",
}: {
  entry: CtAtlasOrganEntry;
  url: string;
  windowId: CtWindowId;
  clippingPlanes: Plane[];
  visible: boolean;
  highlighted: boolean;
  selected: boolean;
  dimmed: boolean;
  onPick: () => void;
  onGeometryReady: () => void;
  headAnchored?: boolean;
  deferHeadFit?: boolean;
  shading?: AtlasShading;
}) {
  const [hovered, setHovered] = useState(false);
  const emphasized = highlighted || selected || hovered;
  const geometryReady = useRef(false);
  const { setHovering } = useAnatomyPointer();

  const clearHover = useCallback(() => {
    setHovered(false);
    setHovering(false);
  }, [setHovering]);
  useAnatomyHoverReset(clearHover);
  const label = useMemo(() => {
    const resolvedId = resolveStructureIdForAtlasEntry(entry);
    if (resolvedId) {
      const structure = getAnatomyStructure(resolvedId);
      if (structure) return structure.name;
    }
    return getAnatomyStructureByMeshId(entry.meshId)?.name ?? entry.meshId;
  }, [entry]);
  const { scene } = useGLTF(url);
  const hu = CT_ORGAN_HU[entry.id] ?? CT_ORGAN_HU[entry.meshId] ?? 40;
  const tintColor =
    getAnatomyModule(entry.meshId)?.color ??
    ORGAN_MESH_COLORS[entry.meshId] ??
    ORGAN_MESH_COLORS[entry.id] ??
    "#9ca3af";

  const meshRoot = useMemo(() => {
    const clone = scene.clone(true);
    if (headAnchored && !deferHeadFit) fitAllenBrainToFigure(clone);

    clone.traverse((node) => {
      if ((node as Mesh).isMesh) {
        const mesh = node as Mesh;
        mesh.geometry?.computeVertexNormals();
        mesh.userData.atlasOrganId = entry.id;
        mesh.userData.meshId = entry.meshId;
      }
    });
    return clone;
  }, [scene, entry.id, entry.meshId, headAnchored, deferHeadFit]);

  useLayoutEffect(() => {
    if (geometryReady.current) return;
    geometryReady.current = true;
    onGeometryReady();
  }, [meshRoot, onGeometryReady]);

  useEffect(() => {
    const material = buildOrganMaterial({
      entry,
      windowId,
      hu,
      tintColor,
      emphasized,
      selected,
      dimmed,
      clippingPlanes,
      shading,
    });
    meshRoot.traverse((node) => {
      if ((node as Mesh).isMesh) {
        (node as Mesh).material = material;
      }
    });
  }, [meshRoot, entry, windowId, hu, tintColor, emphasized, selected, dimmed, clippingPlanes, shading]);

  if (!visible) return null;

  return (
    <group>
      <primitive
        object={meshRoot}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          if (!isPrimaryPointerHit(e)) return;
          e.stopPropagation();
          onPick();
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          if (!isPrimaryPointerHit(e)) return;
          e.stopPropagation();
          setHovered(true);
          setHovering(true);
        }}
        onPointerOut={() => {
          setHovered(false);
          setHovering(false);
        }}
      />
      {hovered ? (
        <Html
          center
          distanceFactor={6}
          position={[0, 0.35, 0]}
          style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
        >
          <span className="rounded-full border border-cyan-400/40 bg-[#0b1220]/92 px-2.5 py-1 text-[11px] font-bold text-cyan-50 shadow-[0_0_16px_rgba(34,211,238,0.35)]">
            {label}
          </span>
        </Html>
      ) : null}
    </group>
  );
}

function CtAtlasOrganMesh({
  entry,
  windowId,
  clippingPlanes,
  visible,
  highlighted,
  selected,
  dimmed,
  onPick,
  onGeometryReady,
  deferHeadFit = false,
  shading = "pacs",
}: {
  entry: CtAtlasOrganEntry;
  windowId: CtWindowId;
  clippingPlanes: Plane[];
  visible: boolean;
  highlighted: boolean;
  selected: boolean;
  dimmed: boolean;
  onPick: () => void;
  onGeometryReady: () => void;
  deferHeadFit?: boolean;
  shading?: AtlasShading;
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
      selected={selected}
      dimmed={dimmed}
      onPick={onPick}
      onGeometryReady={onGeometryReady}
      headAnchored={headAnchored}
      deferHeadFit={deferHeadFit}
      shading={shading}
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
  selected,
  dimmed,
  onPick,
  onGeometryReady,
  headAnchored = false,
  deferHeadFit = false,
  shading = "pacs",
}: {
  entry: CtAtlasOrganEntry;
  urls: string[];
  urlIndex?: number;
  windowId: CtWindowId;
  clippingPlanes: Plane[];
  visible: boolean;
  highlighted: boolean;
  selected: boolean;
  dimmed: boolean;
  onPick: () => void;
  onGeometryReady: () => void;
  headAnchored?: boolean;
  deferHeadFit?: boolean;
  shading?: AtlasShading;
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
        selected={selected}
        dimmed={dimmed}
        onPick={onPick}
        onGeometryReady={onGeometryReady}
        headAnchored={headAnchored}
        deferHeadFit={deferHeadFit}
        shading={shading}
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
        selected={selected}
        dimmed={dimmed}
        onPick={onPick}
        onGeometryReady={onGeometryReady}
        headAnchored={headAnchored}
        deferHeadFit={deferHeadFit}
        shading={shading}
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
  shading = "pacs",
}: RigProps) {
  const rootRef = useRef<Group>(null);
  const brainRef = useRef<Group>(null);
  const loadGeneration = useRef(0);
  const loadedOrgans = useRef(new Set<string>());

  const scheduleRefit = useCallback(() => {
    if (!rootRef.current) return;
    const gen = ++loadGeneration.current;
    requestAnimationFrame(() => {
      if (gen !== loadGeneration.current || !rootRef.current) return;
      fitVisibleHumanAtlas(rootRef.current);
      if (loadedOrgans.current.has("skin") && brainRef.current) {
        fitAllenBrainToAtlas(rootRef.current, brainRef.current);
      }
    });
  }, []);

  const onOrganGeometryReady = useCallback(
    (entryId: string) => {
      if (loadedOrgans.current.has(entryId)) return;
      loadedOrgans.current.add(entryId);
      scheduleRefit();
    },
    [scheduleRefit]
  );

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
          const structureId = resolveStructureIdForAtlasEntry(entry);
          const selected = structureId != null && selectedId === structureId;

          return (
            <CtAtlasOrganMesh
              key={entry.id}
              entry={entry}
              windowId={windowId}
              clippingPlanes={clippingPlanes}
              visible={visible}
              highlighted={highlighted}
              selected={selected}
              dimmed={systemFiltered}
              onPick={pickStructure}
              onGeometryReady={() => onOrganGeometryReady(entry.id)}
              shading={shading}
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
        const structureId = resolveStructureIdForAtlasEntry(entry);
        const selected = structureId != null && selectedId === structureId;

        return (
          <group key={entry.id} ref={brainRef} visible={visible}>
            <CtAtlasOrganMesh
              entry={entry}
              windowId={windowId}
              clippingPlanes={clippingPlanes}
              visible
              highlighted={highlighted}
              selected={selected}
              dimmed={systemFiltered}
              onPick={pickStructure}
              onGeometryReady={() => onOrganGeometryReady(entry.id)}
              deferHeadFit
              shading={shading}
            />
          </group>
        );
      })}
    </>
  );
}

export function preloadCtAtlas() {
  for (const url of CT_ATLAS_ORGANS.flatMap((o) => resolveCtAtlasUrlCandidates(o.fileName))) {
    useGLTF.preload(url);
  }
}
