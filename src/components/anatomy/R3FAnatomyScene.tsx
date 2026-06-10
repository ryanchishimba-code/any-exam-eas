"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html, type OrbitControls as OrbitControlsImpl } from "@react-three/drei";
import type { Mesh } from "three";
import { Vector3 } from "three";
import { getAnatomyStructure } from "@/lib/anatomy";
import type { AnatomyLayer, AnatomyStructure } from "@/lib/anatomy/types";
import { cn } from "@/lib/utils";

type MeshDef = {
  id: string;
  layer: AnatomyLayer;
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  geometry: "sphere" | "box" | "cylinder" | "capsule";
  rotation?: [number, number, number];
};

const MESH_DEFS: MeshDef[] = [
  { id: "skull", layer: "bone", position: [0, 1.55, 0], scale: [0.42, 0.38, 0.42], color: "#e8e4dc", geometry: "sphere" },
  { id: "brain", layer: "organ", position: [0, 1.52, 0.05], scale: [0.32, 0.28, 0.34], color: "#c4a882", geometry: "sphere" },
  { id: "thyroid", layer: "organ", position: [0, 1.15, 0.18], scale: [0.14, 0.06, 0.08], color: "#d97706", geometry: "box" },
  { id: "lungs", layer: "organ", position: [0, 0.95, -0.05], scale: [0.55, 0.42, 0.28], color: "#f87171", geometry: "box" },
  { id: "heart", layer: "organ", position: [0.08, 0.88, 0.12], scale: [0.16, 0.18, 0.12], color: "#dc2626", geometry: "sphere" },
  { id: "aorta", layer: "vascular", position: [0.02, 1.05, 0.08], scale: [0.05, 0.35, 0.05], color: "#991b1b", geometry: "cylinder" },
  { id: "diaphragm", layer: "muscle", position: [0, 0.72, 0], scale: [0.62, 0.04, 0.32], color: "#78716c", geometry: "box" },
  { id: "liver", layer: "organ", position: [0.22, 0.52, 0.05], scale: [0.28, 0.18, 0.16], color: "#92400e", geometry: "box" },
  { id: "stomach", layer: "organ", position: [-0.12, 0.5, 0.08], scale: [0.18, 0.14, 0.12], color: "#eab308", geometry: "sphere" },
  { id: "spleen", layer: "organ", position: [-0.28, 0.58, -0.02], scale: [0.1, 0.14, 0.08], color: "#7c2d12", geometry: "sphere" },
  { id: "kidneys", layer: "organ", position: [0, 0.32, -0.12], scale: [0.38, 0.12, 0.1], color: "#b45309", geometry: "box" },
  { id: "spinal-cord", layer: "nerve", position: [0, 0.65, -0.18], scale: [0.04, 0.85, 0.04], color: "#fef08a", geometry: "cylinder" },
  { id: "femur", layer: "bone", position: [0, -0.35, 0], scale: [0.12, 0.55, 0.12], color: "#e7e5e4", geometry: "capsule" },
  { id: "biceps", layer: "muscle", position: [0.38, 0.75, 0.05], scale: [0.08, 0.22, 0.08], color: "#a8a29e", geometry: "capsule" },
  { id: "carotid-artery", layer: "vascular", position: [0.12, 1.22, 0.12], scale: [0.04, 0.18, 0.04], color: "#7f1d1d", geometry: "cylinder" },
  { id: "trachea", layer: "organ", position: [0, 1.18, 0.14], scale: [0.06, 0.22, 0.06], color: "#93c5fd", geometry: "cylinder" },
  { id: "gallbladder", layer: "organ", position: [0.18, 0.48, 0.1], scale: [0.08, 0.1, 0.06], color: "#84cc16", geometry: "sphere" },
  { id: "pancreas", layer: "organ", position: [0.05, 0.44, -0.02], scale: [0.22, 0.06, 0.08], color: "#fbbf24", geometry: "box" },
  { id: "appendix", layer: "organ", position: [-0.2, 0.28, 0.06], scale: [0.06, 0.12, 0.05], color: "#fdba74", geometry: "capsule" },
  { id: "bladder", layer: "organ", position: [0, 0.08, 0.06], scale: [0.16, 0.12, 0.12], color: "#fde68a", geometry: "sphere" },
  { id: "humerus", layer: "bone", position: [0.42, 0.45, 0], scale: [0.07, 0.38, 0.07], color: "#d6d3d1", geometry: "capsule" },
  { id: "tibia", layer: "bone", position: [0.1, -0.75, 0.02], scale: [0.08, 0.42, 0.08], color: "#e7e5e4", geometry: "capsule" },
  { id: "sternum", layer: "bone", position: [0, 0.92, 0.18], scale: [0.08, 0.28, 0.04], color: "#fafaf9", geometry: "box" },
  { id: "esophagus", layer: "organ", position: [0, 0.78, 0.1], scale: [0.05, 0.35, 0.05], color: "#fda4af", geometry: "cylinder" },
  { id: "duodenum", layer: "organ", position: [0.12, 0.4, 0.04], scale: [0.14, 0.08, 0.1], color: "#fcd34d", geometry: "box", rotation: [0, 0.4, 0] },
  { id: "clavicle", layer: "bone", position: [0, 1.28, 0.08], scale: [0.5, 0.04, 0.04], color: "#e7e5e4", geometry: "box", rotation: [0, 0, 0.15] },
  { id: "scapula", layer: "bone", position: [-0.32, 1.05, -0.12], scale: [0.12, 0.18, 0.04], color: "#d6d3d1", geometry: "box", rotation: [0, 0.3, 0] },
  { id: "prostate", layer: "organ", position: [0, 0.02, 0.04], scale: [0.1, 0.06, 0.08], color: "#c4b5fd", geometry: "sphere" },
  { id: "adrenal-glands", layer: "organ", position: [0, 0.36, -0.14], scale: [0.32, 0.06, 0.08], color: "#f59e0b", geometry: "box" },
  { id: "vertebral-column", layer: "bone", position: [0, 0.55, -0.2], scale: [0.06, 0.95, 0.06], color: "#fafaf9", geometry: "cylinder" },
];

function AnatomyMesh({
  def,
  label,
  visible,
  highlighted,
  selected,
  onSelect,
}: {
  def: MeshDef;
  label: string;
  visible: boolean;
  highlighted: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const ref = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!ref.current) return;
    const target = highlighted || selected ? 1.15 : hovered ? 1.08 : 1;
    const next = new Vector3(def.scale[0] * target, def.scale[1] * target, def.scale[2] * target);
    ref.current.scale.lerp(next, 0.12);
  });

  if (!visible) return null;

  const emissive = highlighted || selected ? "#6366f1" : hovered ? "#818cf8" : "#000000";
  const emissiveIntensity = highlighted || selected ? 0.35 : hovered ? 0.2 : 0;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(def.id);
  };

  const geom =
    def.geometry === "sphere" ? (
      <sphereGeometry args={[1, 24, 24]} />
    ) : def.geometry === "box" ? (
      <boxGeometry args={[1, 1, 1]} />
    ) : def.geometry === "cylinder" ? (
      <cylinderGeometry args={[1, 1, 1, 16]} />
    ) : (
      <capsuleGeometry args={[0.5, 1, 8, 16]} />
    );

  return (
    <mesh
      ref={ref}
      position={def.position}
      scale={def.scale}
      rotation={def.rotation}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {geom}
      <meshStandardMaterial
        color={def.color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        roughness={0.65}
        metalness={0.05}
        transparent={!visible}
        opacity={visible ? 1 : 0}
      />
      {(hovered || selected || highlighted) && (
        <Html
          center
          distanceFactor={6}
          position={[0, 1.15, 0]}
          style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
        >
          <span className="rounded-full bg-slate-900/90 px-2 py-0.5 text-[10px] font-semibold text-white shadow-lg">
            {label}
          </span>
        </Html>
      )}
    </mesh>
  );
}

function BodySilhouette() {
  return (
    <group>
      <mesh position={[0, 0.5, 0]} scale={[0.35, 1.1, 0.2]}>
        <capsuleGeometry args={[0.5, 1, 8, 16]} />
        <meshStandardMaterial color="#f1f5f9" transparent opacity={0.35} roughness={0.9} />
      </mesh>
    </group>
  );
}

function CameraFocus({
  selectedId,
  controlsRef,
}: {
  selectedId: string | null;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const targetPos = useMemo(() => new Vector3(), []);
  const desiredTarget = useMemo(() => new Vector3(0, 0.7, 0), []);

  useEffect(() => {
    if (!selectedId) {
      desiredTarget.set(0, 0.7, 0);
      return;
    }
    const structure = getAnatomyStructure(selectedId);
    if (!structure) return;
    const mesh = MESH_DEFS.find((d) => d.id === structure.meshId);
    if (mesh) desiredTarget.set(...mesh.position);
  }, [desiredTarget, selectedId]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    targetPos.copy(controls.target);
    if (targetPos.distanceTo(desiredTarget) < 0.001) return;
    controls.target.lerp(desiredTarget, 0.08);
    controls.update();
  });

  return null;
}

function SceneContent({
  structures,
  visibleLayers,
  selectedId,
  highlightedId,
  onSelect,
}: {
  structures: AnatomyStructure[];
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const structureByMesh = useMemo(
    () => new Map(structures.map((s) => [s.meshId, s])),
    [structures]
  );

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 4]} intensity={0.85} />
      <directionalLight position={[-3, 2, -2]} intensity={0.35} />
      <BodySilhouette />
      {MESH_DEFS.map((def) => {
        const structure = structureByMesh.get(def.id);
        if (!structure) return null;
        const layerVisible = visibleLayers.has(def.layer);
        return (
          <AnatomyMesh
            key={def.id}
            def={def}
            label={structure.name}
            visible={layerVisible}
            highlighted={highlightedId === structure.id}
            selected={selectedId === structure.id}
            onSelect={() => onSelect(structure.id)}
          />
        );
      })}
      <CameraFocus selectedId={selectedId} controlsRef={controlsRef} />
      <OrbitControls
        ref={controlsRef}
        enablePan
        enableZoom
        minDistance={1.2}
        maxDistance={4.5}
        target={[0, 0.7, 0]}
        makeDefault
      />
    </>
  );
}

type Props = {
  structures: AnatomyStructure[];
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
};

export function R3FAnatomyScene({
  structures,
  visibleLayers,
  selectedId,
  highlightedId,
  onSelect,
  className,
}: Props) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200/80", className)}>
      <Canvas
        camera={{ position: [0, 0.85, 2.4], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <SceneContent
            structures={structures}
            visibleLayers={visibleLayers}
            selectedId={selectedId}
            highlightedId={highlightedId}
            onSelect={onSelect}
          />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
        <p className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-medium text-[var(--color-ink-muted)] shadow-sm backdrop-blur-sm">
          Drag to rotate · Scroll to zoom · Click structures to explore
        </p>
      </div>
    </div>
  );
}
