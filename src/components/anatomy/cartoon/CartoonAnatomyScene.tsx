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
import { getAnatomyModule } from "@/lib/anatomy/modules/registry";
import { CT_CAMERA } from "@/lib/anatomy/cartoon/proportions";
import type { AnatomyLayer, AnatomyStructure, AnatomySystem } from "@/lib/anatomy/types";
import { cn } from "@/lib/utils";
import { AnatomyPointerProvider, useAnatomyPointer } from "./AnatomyPointerProvider";
import { CtAtlasRig, preloadCtAtlas } from "@/components/anatomy/ct/CtAtlasRig";
import { CtThoracicBonesRig } from "@/components/anatomy/ct/CtThoracicBonesRig";
import { createCtClipPlanes } from "@/lib/anatomy/ct/ct-atlas-fit";
import { NeuroConnectionRig } from "./NeuroConnectionRig";
import { CT_WINDOWS, isCtAtlasEnabled, type CtWindowId } from "@/lib/anatomy/ct/ct-windows";
import type { CtClipPlaneId } from "@/lib/anatomy/ct/ct-atlas-registry";

export type CartoonSceneHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
};

function CtRenderSettings() {
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMapping = THREE.NoToneMapping;
    gl.toneMappingExposure = 1;
  }, [gl]);
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
  visibleLayers,
  systemFilter,
  selectedId,
  highlightedId,
  onSelect,
  autoSpin,
  zoomLevel,
  resetToken,
  controlsRef,
  ctWindowId,
  ctClipPlaneId,
  ctSliceOffset,
}: {
  visibleLayers: Set<AnatomyLayer>;
  systemFilter: AnatomySystem | "all";
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  autoSpin: boolean;
  zoomLevel: number;
  resetToken: number;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  ctWindowId: CtWindowId;
  ctClipPlaneId: CtClipPlaneId;
  ctSliceOffset: number;
}) {
  const { camera } = useThree();
  const cameraConfig = CT_CAMERA;
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
  }, [camera, cameraConfig.position, cameraConfig.target, controlsRef, defaultCamPos, defaultTarget, resetToken]);

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

  const ctWindow = CT_WINDOWS[ctWindowId];
  const focusStructureId = highlightedId ?? selectedId;
  const showBones = visibleLayers.has("bone");
  const boneSystemFiltered =
    systemFilter !== "all" && systemFilter !== "skeletal";

  const clippingPlanes = useMemo(
    () => createCtClipPlanes(ctClipPlaneId, ctSliceOffset),
    [ctClipPlaneId, ctSliceOffset]
  );

  useEffect(() => {
    if (!isCtAtlasEnabled()) return;
    preloadCtAtlas();
  }, []);

  if (!isCtAtlasEnabled()) {
    return (
      <>
        <color attach="background" args={["#161618"]} />
        <ambientLight intensity={0.4} />
      </>
    );
  }

  return (
    <>
      <CtRenderSettings />
      <color attach="background" args={[ctWindow.background]} />
      <fog attach="fog" args={[ctWindow.background, 8, 18]} />
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
      <CtThoracicBonesRig
        visible={showBones}
        windowId={ctWindowId}
        clippingPlanes={clippingPlanes}
        selectedId={selectedId}
        highlightedId={highlightedId}
        onSelect={onSelect}
        systemFiltered={boneSystemFiltered}
      />
      <NeuroConnectionRig focusStructureId={focusStructureId} />

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
    structures: _structures,
    visibleLayers,
    systemFilter = "all",
    selectedId,
    highlightedId,
    onSelect,
    autoSpin = false,
    className,
    ctWindowId = "bone",
    ctClipPlaneId = "off",
    ctSliceOffset = 0,
  },
  ref
) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [resetToken, setResetToken] = useState(0);
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
    <div className={cn("relative h-full w-full overflow-hidden rounded-2xl bg-[#161618]", className)}>
      <Canvas
        camera={{ position: CT_CAMERA.position, fov: CT_CAMERA.fov }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NoToneMapping;
          gl.toneMappingExposure = 1;
        }}
      >
        <AnatomyPointerProvider>
          <LocalClippingToggle enabled={clipActive} />
          <Suspense fallback={null}>
            <SceneRig
              visibleLayers={visibleLayers}
              systemFilter={systemFilter}
              selectedId={selectedId}
              highlightedId={highlightedId}
              onSelect={onSelect}
              autoSpin={autoSpin}
              zoomLevel={zoomLevel}
              resetToken={resetToken}
              controlsRef={controlsRef}
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
