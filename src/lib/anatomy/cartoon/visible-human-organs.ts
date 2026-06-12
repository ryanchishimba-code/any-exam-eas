/**
 * HuBMAP CCF v1.2 reference organs — Visible Human Male/Female derivatives.
 * License: CC BY 4.0 — https://hubmapconsortium.github.io/ccf/pages/ccf-3d-reference-library.html
 *
 * Source repo: https://github.com/hubmapconsortium/ccf-releases/tree/main/v1.2/models
 *
 * URL strategy (stability-first):
 * - Default: jsDelivr CDN (works on fresh clone, no download)
 * - NEXT_PUBLIC_VOLUME_ORGAN_BASE=/anatomy/volumes → local first, CDN fallback
 * - NEXT_PUBLIC_VOLUME_ORGAN_BASE=cdn → CDN only
 */

export const HRA_CCF_CITATION =
  "HuBMAP CCF 3D Reference Object Library (v1.2), derived from NLM Visible Human Project data. CC BY 4.0.";

export const HRA_CDN_BASE =
  "https://cdn.jsdelivr.net/gh/hubmapconsortium/ccf-releases@main/v1.2/models";

/** Served from public/anatomy/volumes after npm run anatomy:fetch-vh */
export const LOCAL_VH_BASE = "/anatomy/volumes";

export type VisibleHumanOrganDef = {
  meshId: string;
  fileName: string;
  targetSize: number;
  rotation?: [number, number, number];
  sex: "male" | "female";
};

/** Thoracic + upper abdominal organs inside the rib cage. */
export const VISIBLE_HUMAN_ORGANS: Record<string, VisibleHumanOrganDef> = {
  heart: {
    meshId: "heart",
    fileName: "VH_M_Heart.glb",
    targetSize: 1.05,
    rotation: [0.12, -0.06, -0.42],
    sex: "male",
  },
  lungs: {
    meshId: "lungs",
    fileName: "VH_M_Lung.glb",
    targetSize: 1.15,
    rotation: [0, 0, 0],
    sex: "male",
  },
  liver: {
    meshId: "liver",
    fileName: "VH_M_Liver.glb",
    targetSize: 1.1,
    rotation: [0, 0.06, 0.04],
    sex: "male",
  },
  spleen: {
    meshId: "spleen",
    fileName: "VH_M_Spleen.glb",
    targetSize: 0.75,
    rotation: [0, 0, 0.22],
    sex: "male",
  },
  pancreas: {
    meshId: "pancreas",
    fileName: "VH_M_Pancreas.glb",
    targetSize: 0.9,
    rotation: [0, 0, -0.08],
    sex: "male",
  },
  kidneys: {
    meshId: "kidneys",
    fileName: "VH_M_Kidney_L.glb",
    targetSize: 0.7,
    rotation: [0, 0, -0.35],
    sex: "male",
  },
  "spinal-cord": {
    meshId: "spinal-cord",
    fileName: "VH_M_Spinal_Cord.glb",
    targetSize: 1.2,
    sex: "male",
  },
  colon: {
    meshId: "colon",
    fileName: "SBU_M_Intestine_Large.glb",
    targetSize: 1.0,
    sex: "male",
  },
};

function readVolumeOrganBase(): string | undefined {
  if (typeof process === "undefined") return undefined;
  return process.env.NEXT_PUBLIC_VOLUME_ORGAN_BASE?.trim();
}

function cdnUrl(fileName: string): string {
  return `${HRA_CDN_BASE}/${fileName}`;
}

function localUrl(fileName: string): string {
  return `${LOCAL_VH_BASE}/${fileName}`;
}

/** Ordered candidates — first wins; later entries are fallbacks in the loader. */
export function resolveVolumeOrganUrlCandidates(meshId: string): string[] {
  const def = VISIBLE_HUMAN_ORGANS[meshId];
  if (!def) return [];

  const envBase = readVolumeOrganBase();
  const { fileName } = def;

  if (envBase === "cdn") return [cdnUrl(fileName)];
  if (envBase === "local" || envBase === LOCAL_VH_BASE) {
    return [localUrl(fileName), cdnUrl(fileName)];
  }
  if (envBase) {
    const custom = `${envBase.replace(/\/$/, "")}/${fileName}`;
    return [custom, cdnUrl(fileName)];
  }

  // Default: CDN (stable on fresh clone; no npm run anatomy:fetch-vh required)
  return [cdnUrl(fileName)];
}

export function resolveVolumeOrganCompanionUrlCandidates(meshId: string): string[] {
  if (meshId !== "kidneys") return [];
  const fileName = "VH_M_Kidney_R.glb";
  const envBase = readVolumeOrganBase();

  if (envBase === "cdn") return [cdnUrl(fileName)];
  if (envBase === "local" || envBase === LOCAL_VH_BASE) {
    return [localUrl(fileName), cdnUrl(fileName)];
  }
  if (envBase) {
    return [`${envBase.replace(/\/$/, "")}/${fileName}`, cdnUrl(fileName)];
  }
  return [cdnUrl(fileName)];
}

export function getVisibleHumanPreloadUrls(): string[] {
  const urls = new Set<string>();
  for (const def of Object.values(VISIBLE_HUMAN_ORGANS)) {
    for (const url of resolveVolumeOrganUrlCandidates(def.meshId)) {
      urls.add(url);
    }
  }
  return [...urls];
}

export function isVisibleHumanOrganEnabled(): boolean {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_USE_VISIBLE_HUMAN_ORGANS === "0") {
    return false;
  }
  return true;
}

export function getVisibleHumanOrganDef(meshId: string): VisibleHumanOrganDef | undefined {
  return VISIBLE_HUMAN_ORGANS[meshId];
}

export function hasVisibleHumanOrgan(meshId: string): boolean {
  return isVisibleHumanOrganEnabled() && Boolean(VISIBLE_HUMAN_ORGANS[meshId]);
}

/** Primary URL (first candidate). */
export function resolveVolumeOrganUrl(meshId: string): string | undefined {
  return resolveVolumeOrganUrlCandidates(meshId)[0];
}

export function resolveVolumeOrganCompanionUrl(meshId: string): string | undefined {
  return resolveVolumeOrganCompanionUrlCandidates(meshId)[0];
}
