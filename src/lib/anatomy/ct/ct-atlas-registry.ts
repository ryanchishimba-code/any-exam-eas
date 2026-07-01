/**
 * HuBMAP CCF v1.2 — full Visible Human male atlas in shared VH coordinate space.
 * All meshes load under one rig (no per-organ normalization) for CT registration.
 */

import { getAnatomyStructureByMeshId } from "@/lib/anatomy/systems/catalog/queries";
import type { AnatomyLayer, AnatomySystem } from "@/lib/anatomy/types";
import { HRA_CDN_BASE, LOCAL_VH_BASE } from "@/lib/anatomy/cartoon/visible-human-organs";

export type CtAtlasFitStrategy = "vh-atlas" | "head";

export type CtAtlasOrganEntry = {
  /** Unique atlas key. */
  id: string;
  fileName: string;
  /** Primary meshId for structure lookup & highlight. */
  meshId: string;
  layer: AnatomyLayer;
  system: AnatomySystem;
  /** Optional extra meshIds that map to this GLB. */
  aliasMeshIds?: string[];
  opacity?: number;
  /** VH shared coords vs independent cranial fit (Allen brain). */
  fit?: CtAtlasFitStrategy;
};

export const CT_ATLAS_ORGANS: CtAtlasOrganEntry[] = [
  { id: "skin", fileName: "VH_M_Skin.glb", meshId: "skin", layer: "skin", system: "muscular", opacity: 0.22 },
  { id: "lungs", fileName: "VH_M_Lung.glb", meshId: "lungs", layer: "organ", system: "respiratory" },
  { id: "heart", fileName: "VH_M_Heart.glb", meshId: "heart", layer: "organ", system: "cardiovascular" },
  {
    id: "blood-vasculature",
    fileName: "VH_M_Blood_Vasculature.glb",
    meshId: "aorta",
    layer: "vascular",
    system: "cardiovascular",
    aliasMeshIds: ["carotid-artery"],
  },
  { id: "liver", fileName: "VH_M_Liver.glb", meshId: "liver", layer: "organ", system: "digestive" },
  { id: "spleen", fileName: "VH_M_Spleen.glb", meshId: "spleen", layer: "organ", system: "lymphatic" },
  { id: "pancreas", fileName: "VH_M_Pancreas.glb", meshId: "pancreas", layer: "organ", system: "digestive" },
  { id: "kidney-l", fileName: "VH_M_Kidney_L.glb", meshId: "kidneys", layer: "organ", system: "urinary" },
  { id: "kidney-r", fileName: "VH_M_Kidney_R.glb", meshId: "kidneys", layer: "organ", system: "urinary" },
  {
    id: "small-intestine",
    fileName: "VH_M_Small_Intestine.glb",
    meshId: "small-intestine",
    layer: "organ",
    system: "digestive",
    aliasMeshIds: ["stomach", "duodenum"],
  },
  { id: "colon", fileName: "SBU_M_Intestine_Large.glb", meshId: "colon", layer: "organ", system: "digestive", aliasMeshIds: ["appendix"] },
  { id: "bladder", fileName: "VH_M_Urinary_Bladder.glb", meshId: "bladder", layer: "organ", system: "urinary" },
  { id: "prostate", fileName: "VH_M_Prostate.glb", meshId: "prostate", layer: "organ", system: "urinary" },
  {
    id: "brain",
    fileName: "Allen_M_Brain.glb",
    meshId: "brain",
    layer: "organ",
    system: "nervous",
    fit: "head",
    opacity: 0.96,
  },
  { id: "spinal-cord", fileName: "VH_M_Spinal_Cord.glb", meshId: "spinal-cord", layer: "nerve", system: "nervous" },
  { id: "thymus", fileName: "VH_M_Thymus.glb", meshId: "thyroid", layer: "organ", system: "endocrine" },
  // Skeletal — HuBMAP v1.2 pelvis/knee GLBs only (no VH thorax/skull meshes).
  { id: "pelvis", fileName: "VH_M_Pelvis.glb", meshId: "pelvis", layer: "bone", system: "skeletal", opacity: 0.95 },
  { id: "knee-l", fileName: "VH_M_Knee_L.glb", meshId: "femur", layer: "bone", system: "skeletal", aliasMeshIds: ["tibia", "patella-l"] },
  { id: "knee-r", fileName: "VH_M_Knee_R.glb", meshId: "femur", layer: "bone", system: "skeletal", aliasMeshIds: ["patella-r"] },
];

export type CtClipPlaneId = "off" | "axial" | "coronal" | "sagittal";

export const CT_CLIP_PLANES: { id: CtClipPlaneId; label: string }[] = [
  { id: "off", label: "3D" },
  { id: "axial", label: "Axial" },
  { id: "coronal", label: "Coronal" },
  { id: "sagittal", label: "Sagittal" },
];

function readVolumeBase(): string | undefined {
  if (typeof process === "undefined") return undefined;
  return process.env.NEXT_PUBLIC_VOLUME_ORGAN_BASE?.trim();
}

function cdnCtAtlasUrl(fileName: string): string {
  return `${HRA_CDN_BASE}/${fileName}`;
}

function localCtAtlasUrl(fileName: string): string {
  return `${LOCAL_VH_BASE}/${fileName}`;
}

/** Ordered candidates — local first by default, CDN fallback on 404 in the loader. */
export function resolveCtAtlasUrlCandidates(fileName: string): string[] {
  const envBase = readVolumeBase();
  if (envBase === "cdn") return [cdnCtAtlasUrl(fileName)];
  if (envBase === "local" || envBase === LOCAL_VH_BASE) {
    return [localCtAtlasUrl(fileName), cdnCtAtlasUrl(fileName)];
  }
  if (envBase) {
    const custom = `${envBase.replace(/\/$/, "")}/${fileName}`;
    return [custom, cdnCtAtlasUrl(fileName)];
  }
  return [localCtAtlasUrl(fileName), cdnCtAtlasUrl(fileName)];
}

/** Primary URL (first candidate). */
export function resolveCtAtlasUrl(fileName: string): string {
  return resolveCtAtlasUrlCandidates(fileName)[0];
}

export function getCtAtlasPreloadUrls(): string[] {
  const urls = new Set<string>();
  for (const entry of CT_ATLAS_ORGANS) {
    for (const url of resolveCtAtlasUrlCandidates(entry.fileName)) {
      urls.add(url);
    }
  }
  return [...urls];
}

export function entryMatchesMeshId(entry: CtAtlasOrganEntry, meshId: string): boolean {
  if (entry.meshId === meshId) return true;
  return entry.aliasMeshIds?.includes(meshId) ?? false;
}

export function getAtlasEntryForMeshId(meshId: string): CtAtlasOrganEntry | undefined {
  return CT_ATLAS_ORGANS.find((e) => entryMatchesMeshId(e, meshId));
}

/** True when the VH atlas supplies this mesh (skip procedural duplicate). */
export function isMeshIdCoveredByAtlas(meshId: string): boolean {
  return Boolean(getAtlasEntryForMeshId(meshId));
}

/** Mesh ids associated with an atlas GLB (primary + aliases). */
export function meshIdsForAtlasEntry(entry: CtAtlasOrganEntry): string[] {
  return [entry.meshId, ...(entry.aliasMeshIds ?? [])];
}

/** Resolve catalog structure id for picking / sidebar sync. */
export function resolveStructureIdForAtlasEntry(entry: CtAtlasOrganEntry): string | undefined {
  for (const meshId of meshIdsForAtlasEntry(entry)) {
    const structure = getAnatomyStructureByMeshId(meshId);
    if (structure) return structure.id;
  }
  return undefined;
}

export function resolveStructureIdForMeshId(meshId: string): string | undefined {
  const direct = getAnatomyStructureByMeshId(meshId);
  if (direct) return direct.id;

  const entry = getAtlasEntryForMeshId(meshId);
  if (entry) return resolveStructureIdForAtlasEntry(entry);
  return undefined;
}
