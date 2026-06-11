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
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import * as THREE from "three";
import { Vector3 } from "three";
import { getAnatomyStructure } from "@/lib/anatomy";
import { ANATOMY_MODULES, getAnatomyModule } from "@/lib/anatomy/modules/registry";
import { getOrganDepthOrder } from "@/lib/anatomy/cartoon/organ-layout";
import { CARTOON_CAMERA, FIGURE } from "@/lib/anatomy/cartoon/proportions";
import {
  CARTOON_FLOOR,
  CARTOON_SCENE_BG,
  CARTOON_SCENE_FOG,
} from "@/lib/anatomy/cartoon/palette";
import type { AnatomyLayer, AnatomyStructure, AnatomySystem } from "@/lib/anatomy/types";
import { cn } from "@/lib/utils";
import { CartoonBodyShell } from "./CartoonBodyShell";
import { CartoonOrganMesh } from "./CartoonOrganMesh";
import { CartoonStructuralLayers } from "./CartoonStructuralLayers";

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
}: {
  structures: AnatomyStructure[];
  visibleLayers: Set<AnatomyLayer>;
  systemFilter: AnatomySystem | "all";
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  skinOn: boolean;
}) {
  const structureByMesh = useMemo(
    () => new Map(structures.map((s) => [s.meshId, s])),
    [structures]
  );
  const boneStructuralOn = visibleLayers.has("bone");
  const muscleStructuralOn = visibleLayers.has("muscle");
  const sortedModules = useMemo(
    () => [...ANATOMY_MODULES].sort((a, b) => getOrganDepthOrder(a.id) - getOrganDepthOrder(b.id)),
    []
  );

  return (
    <>
      {sortedModules.map((mod) => {
        const structure = structureByMesh.get(mod.id);
        if (!structure) return null;
        return (
          <CartoonOrganMesh
            key={mod.id}
            def={mod}
            label={structure.name}
            structureSystem={structure.system}
            systemFilter={systemFilter}
            visible={visibleLayers.has(mod.layer)}
            highlighted={highlightedId === structure.id}
            selected={selectedId === structure.id}
            skinOn={skinOn}
            boneStructuralOn={boneStructuralOn}
            muscleStructuralOn={muscleStructuralOn}
            onSelect={() => onSelect(structure.id)}
          />
        );
      })}
    </>
  );
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
}) {
  const { camera } = useThree();
  const cameraConfig = CARTOON_CAMERA;
  const defaultCamPos = useMemo(() => new Vector3(...cameraConfig.position), [cameraConfig.position]);
  const defaultTarget = useMemo(() => new Vector3(...cameraConfig.target), [cameraConfig.target]);
  const desiredTarget = useMemo(() => new Vector3(), []);
  const focusDistance = useRef(cameraConfig.position[2]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.target.copy(defaultTarget);
    camera.position.copy(defaultCamPos);
    focusDistance.current = cameraConfig.position[2];
    controls.update();
  }, [camera, cameraConfig.position, controlsRef, defaultCamPos, defaultTarget, resetToken]);

  useEffect(() => {
    if (!selectedId) {
      desiredTarget.copy(defaultTarget);
      focusDistance.current = cameraConfig.position[2] / zoomLevel;
      return;
    }
    const structure = getAnatomyStructure(selectedId);
    if (!structure) return;
    const mod = getAnatomyModule(structure.meshId);
    if (!mod) return;
    desiredTarget.set(...mod.position);
    focusDistance.current = (mod.focusDistance ?? 1.6) / zoomLevel;
  }, [cameraConfig.position, defaultTarget, desiredTarget, selectedId, zoomLevel]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.target.lerp(desiredTarget, 0.1);
    controls.minDistance = cameraConfig.minDistance / zoomLevel;
    controls.maxDistance = cameraConfig.maxDistance / zoomLevel;
    const persp = camera as PerspectiveCamera;
    const dir = new Vector3().subVectors(persp.position, controls.target).normalize();
    const goal = controls.target.clone().add(dir.multiplyScalar(focusDistance.current));
    persp.position.lerp(goal, 0.08);
    controls.update();
  });

  const showSkin = visibleLayers.has("skin");

  return (
    <>
      <color attach="background" args={[CARTOON_SCENE_BG]} />
      <fog attach="fog" args={[CARTOON_SCENE_FOG, 8, 18]} />
      <Environment preset="studio" environmentIntensity={0.85} />
      <ambientLight intensity={0.42} color="#f0f4f8" />
      <directionalLight
        position={[4, 8, 5]}
        intensity={1.35}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0002}
        color="#fff8f0"
      />
      <directionalLight position={[-5, 4, -2]} intensity={0.45} color="#c8d8e8" />
      <directionalLight position={[0, 2, -6]} intensity={0.25} color="#ffffff" />
      <ContactShadows
        position={[0, FIGURE.footY + 0.02, 0]}
        opacity={0.45}
        scale={14}
        blur={2.8}
        far={4.5}
        color="#1e293b"
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FIGURE.footY + 0.02, 0]} receiveShadow>
        <circleGeometry args={[4, 64]} />
        <meshStandardMaterial color={CARTOON_FLOOR} roughness={0.92} metalness={0.05} />
      </mesh>

      <CartoonStructuralLayers visibleLayers={visibleLayers} skinOn={showSkin} />
      <OrganModules
        structures={structures}
        visibleLayers={visibleLayers}
        systemFilter={systemFilter}
        selectedId={selectedId}
        highlightedId={highlightedId}
        onSelect={onSelect}
        skinOn={showSkin}
      />
      <CartoonBodyShell ghost={!showSkin} />

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
};

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
  },
  ref
) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [resetToken, setResetToken] = useState(0);

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
        "relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200/80",
        className
      )}
    >
      <Canvas
        camera={{ position: CARTOON_CAMERA.position, fov: CARTOON_CAMERA.fov }}
        dpr={[1, 2]}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
        }}
      >
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
          />
        </Suspense>
      </Canvas>
    </div>
  );
});
