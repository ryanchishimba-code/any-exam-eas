"use client";

import { useGLTF } from "@react-three/drei";
import { Component, type ReactNode, useMemo } from "react";
import type { Group } from "three";
import { Box3, Mesh, MeshPhysicalMaterial, Vector3 } from "three";
import type { OrganSurfaceStyle } from "@/components/anatomy/cartoon/OrganVisual";
import { TISSUE_PBR } from "@/lib/anatomy/cartoon/palette";
import {
  getVisibleHumanOrganDef,
  resolveVolumeOrganCompanionUrlCandidates,
  resolveVolumeOrganUrlCandidates,
} from "@/lib/anatomy/cartoon/visible-human-organs";

type Props = {
  meshId: string;
  style: OrganSurfaceStyle;
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

function tissueMaterial(style: OrganSurfaceStyle) {
  const pbr = TISSUE_PBR.organ;
  return new MeshPhysicalMaterial({
    color: style.color,
    emissive: style.emissive,
    emissiveIntensity: style.emissiveIntensity,
    roughness: style.roughness ?? pbr.roughness,
    metalness: style.metalness ?? pbr.metalness,
    clearcoat: pbr.clearcoat,
    clearcoatRoughness: pbr.clearcoatRoughness,
    sheen: pbr.sheen,
    sheenRoughness: pbr.sheenRoughness,
    sheenColor: style.color,
    envMapIntensity: pbr.envMapIntensity,
    transparent: style.opacity < 1,
    opacity: style.opacity,
    depthWrite: style.opacity > 0.65,
  });
}

function normalizeScene(root: Group, targetSize: number) {
  const box = new Box3().setFromObject(root);
  const size = new Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z, 1e-6);
  root.scale.setScalar(targetSize / maxDim);

  const centered = new Box3().setFromObject(root);
  const center = new Vector3();
  centered.getCenter(center);
  root.position.sub(center);
}

function prepareScene(scene: Group, targetSize: number, style: OrganSurfaceStyle) {
  const clone = scene.clone(true);
  normalizeScene(clone, targetSize);
  const mat = tissueMaterial(style);
  clone.traverse((node) => {
    if (node instanceof Mesh) {
      node.geometry?.computeVertexNormals();
      node.castShadow = true;
      node.receiveShadow = true;
      node.material = mat;
    }
  });
  return clone;
}

function VolumeOrganGltfInner({
  url,
  targetSize,
  rotation,
  style,
  position,
}: {
  url: string;
  targetSize: number;
  rotation?: [number, number, number];
  style: OrganSurfaceStyle;
  position?: [number, number, number];
}) {
  const { scene } = useGLTF(url);
  const prepared = useMemo(
    () => prepareScene(scene, targetSize, style),
    [
      scene,
      targetSize,
      style.color,
      style.opacity,
      style.emissive,
      style.emissiveIntensity,
      style.roughness,
      style.metalness,
    ]
  );

  return (
    <group rotation={rotation ?? [0, 0, 0]} position={position ?? [0, 0, 0]}>
      <primitive object={prepared} />
    </group>
  );
}

function VolumeOrganGltf({
  urls,
  urlIndex = 0,
  targetSize,
  rotation,
  style,
  position,
}: {
  urls: string[];
  urlIndex?: number;
  targetSize: number;
  rotation?: [number, number, number];
  style: OrganSurfaceStyle;
  position?: [number, number, number];
}) {
  const url = urls[urlIndex];
  if (!url) return null;

  const nextIndex = urlIndex + 1;
  const fallback =
    nextIndex < urls.length ? (
      <VolumeOrganGltf
        urls={urls}
        urlIndex={nextIndex}
        targetSize={targetSize}
        rotation={rotation}
        style={style}
        position={position}
      />
    ) : null;

  return (
    <GltfLoadBoundary key={url} fallback={fallback}>
      <VolumeOrganGltfInner
        url={url}
        targetSize={targetSize}
        rotation={rotation}
        style={style}
        position={position}
      />
    </GltfLoadBoundary>
  );
}

/** Visible Human / HRA reference organ mesh (CC BY 4.0). */
export function VolumeOrganVisual({ meshId, style }: Props) {
  const def = getVisibleHumanOrganDef(meshId);
  const urls = resolveVolumeOrganUrlCandidates(meshId);
  if (!def || urls.length === 0) return null;

  if (meshId === "kidneys") {
    const rightUrls = resolveVolumeOrganCompanionUrlCandidates("kidneys");
    if (rightUrls.length === 0) return null;
    return (
      <group>
        <VolumeOrganGltf
          urls={urls}
          targetSize={def.targetSize}
          rotation={[-0, 0, -0.35]}
          style={style}
          position={[-0.42, -0.05, 0]}
        />
        <VolumeOrganGltf
          urls={rightUrls}
          targetSize={def.targetSize}
          rotation={[0, 0, 0.35]}
          style={style}
          position={[0.42, 0.04, 0]}
        />
      </group>
    );
  }

  return (
    <VolumeOrganGltf
      urls={urls}
      targetSize={def.targetSize}
      rotation={def.rotation}
      style={style}
    />
  );
}

export function preloadVisibleHumanOrgans(meshIds: string[]) {
  for (const id of meshIds) {
    for (const url of resolveVolumeOrganUrlCandidates(id)) {
      useGLTF.preload(url);
    }
    for (const url of resolveVolumeOrganCompanionUrlCandidates(id)) {
      useGLTF.preload(url);
    }
  }
}
