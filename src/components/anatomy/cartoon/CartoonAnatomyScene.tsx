"use client";

import {
  forwardRef,
  Suspense,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import * as THREE from "three";
import { Vector3 } from "three";
import { getAnatomyStructure } from "@/lib/anatomy";
import { getBoneFocus, getBoneFocusDistance } from "@/lib/anatomy/bones";
import { ANATOMY_MODULES, getAnatomyModule } from "@/lib/anatomy/modules/registry";
import { getOrganDepthOrder } from "@/lib/anatomy/cartoon/organ-layout";
import { isMeshIdCoveredByAtlas } from "@/lib/anatomy/ct/ct-atlas-registry";
import { CARTOON_CAMERA, CT_CAMERA } from "@/lib/anatomy/cartoon/proportions";
import { CARTOON_SCENE_BG } from "@/lib/anatomy/cartoon/palette";
import type { AnatomyLayer, AnatomyStructure, AnatomySystem } from "@/lib/anatomy/types";
import { cn } from "@/lib/utils";
import { AnatomyStudioEnvironment } from "./AnatomyStudioEnvironment";
import { AnatomySceneLighting } from "./AnatomySceneLighting";
import { AnatomyPostFX } from "./AnatomyPostFX";
import { CartoonBodyShell } from "./CartoonBodyShell";
import { ClickableSkeleton } from "./ClickableSkeleton";
import { CartoonOrganMesh } from "./CartoonOrganMesh";
import { CartoonStructuralLayers } from "./CartoonStructuralLayers";
import { CartoonNerveLayers } from "./CartoonNerveLayers";
import { StructuralPickRig } from "./StructuralPickRig";
import { AnatomyPointerProvider, useAnatomyPointer } from "./AnatomyPointerProvider";
import { CtAtlasRig, preloadCtAtlas } from "@/components/anatomy/ct/CtAtlasRig";
import { preloadVisibleHumanOrgans } from "./VolumeOrganVisual";
import { NeuroConnectionRig } from "./NeuroConnectionRig";
import { isNeuroConnected } from "@/lib/anatomy/neuro-connections";
import {
  isVisibleHumanOrganEnabled,
  VISIBLE_HUMAN_ORGANS,
} from "@/lib/anatomy/cartoon/visible-human-organs";
import { CT_WINDOWS, isCtAtlasEnabled, type CtWindowId } from "@/lib/anatomy/ct/ct-windows";
import type { CtClipPlaneId } from "@/lib/anatomy/ct/ct-atlas-registry";

export type CartoonSceneHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
};

function OrganModules({
  structures,
  visibleLayers,
  systemFilter,
  selectedId,
  highlightedId,
  onSelect,
  skinOn,
  skipAtlasMeshes = false,
}: {
  structures: AnatomyStructure[];
  visibleLayers: Set<AnatomyLayer>;
  systemFilter: AnatomySystem | "all";
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  skinOn: boolean;
  skipAtlasMeshes?: boolean;
}) {
  const structureByMesh = useMemo(
    () => new Map(structures.map((s) => [s.meshId, s])),
    [structures]
  );
  const muscleStructuralOn = visibleLayers.has("muscle");
  const sortedModules = useMemo(
    () =>
      [...ANATOMY_MODULES]
        .filter((m) => m.layer !== "bone")
        .sort((a, b) => getOrganDepthOrder(a.id) - getOrganDepthOrder(b.id)),
    []
  );

  const focusStructureId = highlightedId ?? selectedId;
  const focusStructure = focusStructureId ? getAnatomyStructure(focusStructureId) : null;

  return (
    <>
      {sortedModules.map((mod) => {
        const structure = structureByMesh.get(mod.id);
        if (!structure) return null;
        if (skipAtlasMeshes && isMeshIdCoveredByAtlas(mod.id)) return null;
        const connected = isNeuroConnected(focusStructureId, structure.id);
        const isFocused = focusStructureId === structure.id;
        const isParentOfFocus = focusStructure?.parentId === structure.id;
        const isChildOfFocus = structure.parentId === focusStructureId;
        const isRelated =
          isFocused || connected || isParentOfFocus || isChildOfFocus;
        return (
          <CartoonOrganMesh
            key={mod.id}
            def={mod}
            label={structure.name}
            structureSystem={structure.system}
            systemFilter={systemFilter}
            visible={visibleLayers.has(mod.layer)}
            highlighted={isRelated}
            selected={selectedId === structure.id}
            deemphasized={Boolean(focusStructureId && !isRelated)}
            skinOn={skinOn}
            muscleStructuralOn={muscleStructuralOn}
            onSelect={() => onSelect(structure.id)}
          />
        );
      })}
    </>
  );
}

function CtRenderSettings({ active }: { active: boolean }) {
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMapping = active ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = active ? 1 : 1.24;
  }, [active, gl]);
  return null;
}

function ScenePointerBridge({
  controlsRef,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const { resetAllHovers } = useAnatomyPointer();
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const onStart = () => resetAllHovers();
    controls.addEventListener("start", onStart);
    return () => controls.removeEventListener("start", onStart);
  }, [controlsRef, resetAllHovers]);

  useEffect(() => {
    const el = gl.domElement;
    const onLeave = () => resetAllHovers();
    el.addEventListener("pointerleave", onLeave);
    return () => el.removeEventListener("pointerleave", onLeave);
  }, [gl, resetAllHovers]);

  return null;
}

function SceneRig({
  structures,
  visibleLayers,
  systemFilter,
  selectedId,
  highlightedId,
  onSelect,
  autoSpin,
  zoomLevel,
  resetToken,
  controlsRef,
  ctMode,
  ctWindowId,
  ctClipPlaneId,
  ctSliceOffset,
}: {
  structures: AnatomyStructure[];
  visibleLayers: Set<AnatomyLayer>;
  systemFilter: AnatomySystem | "all";
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  autoSpin: boolean;
  zoomLevel: number;
  resetToken: number;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  ctMode: boolean;
  ctWindowId: CtWindowId;
  ctClipPlaneId: CtClipPlaneId;
  ctSliceOffset: number;
}) {
  const { camera } = useThree();
  const ctActive = ctMode && isCtAtlasEnabled();
  const clinicalAtlasActive = isCtAtlasEnabled() && !ctActive;
  const cameraConfig = ctActive ? CT_CAMERA : CARTOON_CAMERA;
  const defaultCamPos = useMemo(() => new Vector3(...cameraConfig.position), [cameraConfig.position]);
  const defaultTarget = useMemo(() => new Vector3(...cameraConfig.target), [cameraConfig.target]);
  const desiredTarget = useMemo(() => new Vector3(), []);
  const focusDistance = useRef(cameraConfig.position[2]);
  const cameraDirRef = useRef(new Vector3());
  const cameraGoalRef = useRef(new Vector3());

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.target.copy(defaultTarget);
    camera.position.copy(defaultCamPos);
    focusDistance.current = cameraConfig.position[2];
    controls.update();
  }, [camera, cameraConfig.position, cameraConfig.target, controlsRef, defaultCamPos, defaultTarget, resetToken, ctActive]);

  useEffect(() => {
    const focusId = highlightedId ?? selectedId;
    if (!focusId) {
      desiredTarget.copy(defaultTarget);
      focusDistance.current = cameraConfig.position[2] / zoomLevel;
      return;
    }
    const structure = getAnatomyStructure(focusId);
    if (!structure) return;
    const mod = getAnatomyModule(structure.meshId);
    const focus = mod?.position ?? getBoneFocus(structure.id);
    if (!focus) return;
    desiredTarget.set(focus[0], focus[1], focus[2]);
    const baseDistance = mod?.focusDistance ?? getBoneFocusDistance(structure.id);
    const previewOnly = Boolean(highlightedId && highlightedId !== selectedId);
    focusDistance.current = (previewOnly ? baseDistance * 1.08 : baseDistance) / zoomLevel;
  }, [cameraConfig.position, defaultTarget, desiredTarget, highlightedId, selectedId, zoomLevel]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.target.lerp(desiredTarget, 0.14);
    controls.minDistance = cameraConfig.minDistance / zoomLevel;
    controls.maxDistance = cameraConfig.maxDistance / zoomLevel;
    const persp = camera as PerspectiveCamera;
    cameraDirRef.current.subVectors(persp.position, controls.target).normalize();
    cameraGoalRef.current
      .copy(controls.target)
      .addScaledVector(cameraDirRef.current, focusDistance.current);
    persp.position.lerp(cameraGoalRef.current, 0.11);
    controls.update();
  });

  const showSkin = visibleLayers.has("skin");
  const ctWindow = CT_WINDOWS[ctWindowId];
  const focusStructureId = highlightedId ?? selectedId;

  useEffect(() => {
    if (!isCtAtlasEnabled()) return;
    preloadCtAtlas();
  }, []);

  useEffect(() => {
    if (!isVisibleHumanOrganEnabled() || ctActive || clinicalAtlasActive) return;

    const visibleMeshIds = ANATOMY_MODULES.filter(
      (mod) => mod.layer === "organ" && visibleLayers.has("organ") && VISIBLE_HUMAN_ORGANS[mod.id]
    ).map((mod) => mod.id);

    if (visibleMeshIds.length === 0) return;

    const preload = () => preloadVisibleHumanOrgans(visibleMeshIds);
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(preload, { timeout: 2500 });
      return () => cancelIdleCallback(id);
    }
    const timer = window.setTimeout(preload, 600);
    return () => window.clearTimeout(timer);
  }, [clinicalAtlasActive, ctActive, visibleLayers]);

  const atlasSkinLayer = clinicalAtlasActive && showSkin;

  return (
    <>
      <CtRenderSettings active={ctActive} />
      <color attach="background" args={[ctActive ? ctWindow.background : CARTOON_SCENE_BG]} />
      {ctActive ? <fog attach="fog" args={[ctWindow.background, 8, 18]} /> : null}
      {ctActive ? (
        <>
          <ambientLight intensity={0.35} color="#f0f0f4" />
          <CtAtlasRig
            visibleLayers={visibleLayers}
            systemFilter={systemFilter}
            windowId={ctWindowId}
            clipPlaneId={ctClipPlaneId}
            sliceOffset={ctSliceOffset}
            selectedId={selectedId}
            highlightedId={highlightedId}
            onSelect={onSelect}
            shading="pacs"
          />
          <NeuroConnectionRig focusStructureId={focusStructureId} />
        </>
      ) : (
        <>
          <AnatomyStudioEnvironment />
          <AnatomySceneLighting />

          {clinicalAtlasActive ? (
            <CtAtlasRig
              visibleLayers={visibleLayers}
              systemFilter={systemFilter}
              windowId="soft"
              clipPlaneId={ctClipPlaneId}
              sliceOffset={ctSliceOffset}
              selectedId={selectedId}
              highlightedId={highlightedId}
              onSelect={onSelect}
              shading="clinical"
            />
          ) : null}

          <CartoonStructuralLayers
            visibleLayers={visibleLayers}
            skinOn={showSkin && !atlasSkinLayer}
            skipVascularShell={clinicalAtlasActive}
          />
          <CartoonNerveLayers visibleLayers={visibleLayers} skinOn={showSkin && !atlasSkinLayer} />
          <ClickableSkeleton
            visible={visibleLayers.has("bone")}
            skinOn={showSkin && !atlasSkinLayer}
            selectedId={selectedId}
            highlightedId={highlightedId}
            onSelect={onSelect}
          />
          <OrganModules
            structures={structures}
            visibleLayers={visibleLayers}
            systemFilter={systemFilter}
            selectedId={selectedId}
            highlightedId={highlightedId}
            onSelect={onSelect}
            skinOn={showSkin}
            skipAtlasMeshes={clinicalAtlasActive}
          />
          <StructuralPickRig
            visibleLayers={visibleLayers}
            selectedId={selectedId}
            highlightedId={highlightedId}
            onSelect={onSelect}
          />
          <NeuroConnectionRig focusStructureId={focusStructureId} />
          {!atlasSkinLayer ? <CartoonBodyShell ghost={!showSkin} /> : null}
          <AnatomyPostFX />
        </>
      )}

      <ScenePointerBridge controlsRef={controlsRef} />
      <OrbitControls
        ref={controlsRef}
        enablePan
        enableZoom
        enableDamping
        dampingFactor={0.07}
        autoRotate={autoSpin}
        autoRotateSpeed={0.9}
        minDistance={cameraConfig.minDistance}
        maxDistance={cameraConfig.maxDistance}
        target={cameraConfig.target}
        makeDefault
      />
    </>
  );
}

type SceneProps = {
  structures: AnatomyStructure[];
  visibleLayers: Set<AnatomyLayer>;
  systemFilter?: AnatomySystem | "all";
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  autoSpin?: boolean;
  className?: string;
  ctMode?: boolean;
  ctWindowId?: CtWindowId;
  ctClipPlaneId?: CtClipPlaneId;
  ctSliceOffset?: number;
};

function LocalClippingToggle({ enabled }: { enabled: boolean }) {
  const { gl } = useThree();
  useEffect(() => {
    gl.localClippingEnabled = enabled;
    return () => {
      gl.localClippingEnabled = false;
    };
  }, [enabled, gl]);
  return null;
}

export const CartoonAnatomyScene = forwardRef<CartoonSceneHandle, SceneProps>(function CartoonAnatomyScene(
  {
    structures,
    visibleLayers,
    systemFilter = "all",
    selectedId,
    highlightedId,
    onSelect,
    autoSpin = false,
    className,
    ctMode = false,
    ctWindowId = "soft",
    ctClipPlaneId = "off",
    ctSliceOffset = 0,
  },
  ref
) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [resetToken, setResetToken] = useState(0);
  const ctActive = ctMode && isCtAtlasEnabled();
  const clipActive = isCtAtlasEnabled() && ctClipPlaneId !== "off";

  useImperativeHandle(ref, () => ({
    zoomIn: () => setZoomLevel((z) => Math.min(2.2, z + 0.2)),
    zoomOut: () => setZoomLevel((z) => Math.max(0.55, z - 0.2)),
    resetView: () => {
      setZoomLevel(1);
      setResetToken((t) => t + 1);
    },
  }));

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl",
        ctActive ? "bg-[#161618]" : "bg-[#05080c]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(ellipse_at_50%_35%,rgba(34,211,238,0.07)_0%,transparent_52%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_140px_rgba(0,0,0,0.45)]"
        aria-hidden
      />
      <Canvas
        camera={{
          position: ctActive ? CT_CAMERA.position : CARTOON_CAMERA.position,
          fov: ctActive ? CT_CAMERA.fov : CARTOON_CAMERA.fov,
        }}
        dpr={[1, 2.5]}
        shadows={!ctActive}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = ctActive ? 1 : 1.32;
          gl.shadowMap.enabled = !ctActive;
          if (!ctActive) gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <AnatomyPointerProvider>
          <LocalClippingToggle enabled={clipActive} />
          <Suspense fallback={null}>
            <SceneRig
              structures={structures}
              visibleLayers={visibleLayers}
              systemFilter={systemFilter}
              selectedId={selectedId}
              highlightedId={highlightedId}
              onSelect={onSelect}
              autoSpin={autoSpin}
              zoomLevel={zoomLevel}
              resetToken={resetToken}
              controlsRef={controlsRef}
              ctMode={ctMode}
              ctWindowId={ctWindowId}
              ctClipPlaneId={ctClipPlaneId}
              ctSliceOffset={ctSliceOffset}
            />
          </Suspense>
        </AnatomyPointerProvider>
      </Canvas>
    </div>
  );
});
