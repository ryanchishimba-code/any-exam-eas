"use client";

import {
  forwardRef,
  Suspense,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Canvas, useThree } from "@react-three/fiber";
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
  onOrbitingChange,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  onOrbitingChange?: (orbiting: boolean) => void;
}) {
  const { resetAllHovers } = useAnatomyPointer();
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const onStart = () => {
      resetAllHovers();
      onOrbitingChange?.(true);
    };
    const onEnd = () => onOrbitingChange?.(false);
    controls.addEventListener("start", onStart);
    controls.addEventListener("end", onEnd);
    return () => {
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("end", onEnd);
    };
  }, [controlsRef, onOrbitingChange, resetAllHovers]);

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
  const userOrbitingRef = useRef(false);
  const pendingFocusIdRef = useRef<string | null>(null);
  const zoomLevelRef = useRef(zoomLevel);
  zoomLevelRef.current = zoomLevel;
  const prevZoomRef = useRef(zoomLevel);

  const applyOrbitLimits = useCallback(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const z = zoomLevelRef.current;
    controls.minDistance = cameraConfig.minDistance / z;
    controls.maxDistance = cameraConfig.maxDistance / z;
  }, [cameraConfig.maxDistance, cameraConfig.minDistance, controlsRef]);

  const applyCameraFocus = useCallback(
    (structureId: string | null) => {
      const controls = controlsRef.current;
      if (!controls) return;
      const persp = camera as PerspectiveCamera;
      const z = zoomLevelRef.current;

      if (!structureId) {
        controls.target.copy(defaultTarget);
        persp.position.copy(defaultCamPos);
        applyOrbitLimits();
        controls.update();
        return;
      }

      const structure = getAnatomyStructure(structureId);
      if (!structure) return;
      const mod = getAnatomyModule(structure.meshId);
      const focus = mod?.position ?? getBoneFocus(structure.id);
      if (!focus) return;

      controls.target.set(focus[0], focus[1], focus[2]);
      const offset = new Vector3().subVectors(persp.position, controls.target);
      if (offset.lengthSq() < 1e-8) {
        offset.set(0, 0, 1);
      } else {
        offset.normalize();
      }
      const baseDistance = mod?.focusDistance ?? getBoneFocusDistance(structure.id);
      persp.position.copy(controls.target).addScaledVector(offset, baseDistance / z);
      applyOrbitLimits();
      controls.update();
    },
    [applyOrbitLimits, camera, controlsRef, defaultCamPos, defaultTarget]
  );

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const persp = camera as PerspectiveCamera;
    controls.target.copy(defaultTarget);
    persp.position.copy(defaultCamPos);
    applyOrbitLimits();
    controls.update();
    pendingFocusIdRef.current = null;
    prevZoomRef.current = zoomLevelRef.current;
  }, [resetToken, defaultTarget, defaultCamPos, camera, applyOrbitLimits, controlsRef]);

  useEffect(() => {
    if (userOrbitingRef.current) {
      pendingFocusIdRef.current = selectedId;
      return;
    }
    applyCameraFocus(selectedId);
    pendingFocusIdRef.current = null;
  }, [selectedId, applyCameraFocus]);

  useEffect(() => {
    if (prevZoomRef.current === zoomLevel) return;
    const prev = prevZoomRef.current;
    prevZoomRef.current = zoomLevel;

    const controls = controlsRef.current;
    if (!controls) return;
    const persp = camera as PerspectiveCamera;
    const offset = new Vector3().subVectors(persp.position, controls.target);
    if (offset.lengthSq() < 1e-8) return;

    persp.position.copy(controls.target).addScaledVector(offset, offset.length() * (prev / zoomLevel));
    applyOrbitLimits();
    controls.update();
  }, [zoomLevel, applyOrbitLimits, camera, controlsRef]);

  const handleOrbitingChange = useCallback(
    (orbiting: boolean) => {
      userOrbitingRef.current = orbiting;
      if (!orbiting && pendingFocusIdRef.current !== null) {
        applyCameraFocus(pendingFocusIdRef.current);
        pendingFocusIdRef.current = null;
      }
    },
    [applyCameraFocus]
  );

  const ctWindow = CT_WINDOWS[ctWindowId];
  const focusStructureId = highlightedId ?? selectedId;

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
      <NeuroConnectionRig focusStructureId={focusStructureId} />

      <ScenePointerBridge controlsRef={controlsRef} onOrbitingChange={handleOrbitingChange} />
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
    visibleLayers,
    systemFilter = "all",
    selectedId,
    highlightedId,
    onSelect,
    autoSpin = false,
    className,
    ctWindowId = "soft",
    ctClipPlaneId = "off",
    ctSliceOffset = 0,
  }: SceneProps,
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
