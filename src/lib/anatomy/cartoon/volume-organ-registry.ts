/**
 * CT / volumetric organ fidelity — re-exports Visible Human (HRA) registry.
 */

export {
  getVisibleHumanOrganDef,
  getVisibleHumanPreloadUrls,
  hasVisibleHumanOrgan,
  HRA_CCF_CITATION,
  isVisibleHumanOrganEnabled,
  resolveVolumeOrganCompanionUrl,
  resolveVolumeOrganUrl,
  VISIBLE_HUMAN_ORGANS,
  type VisibleHumanOrganDef,
} from "@/lib/anatomy/cartoon/visible-human-organs";

import {
  getVisibleHumanOrganDef,
  hasVisibleHumanOrgan,
  isVisibleHumanOrganEnabled,
  resolveVolumeOrganUrl,
} from "@/lib/anatomy/cartoon/visible-human-organs";

export type VolumeOrganFormat = "gltf" | "glb" | "nifti" | "dicom-series";

export type VolumeOrganAsset = {
  organId: string;
  url: string;
  format: VolumeOrganFormat;
};

export function getVolumeOrganAsset(organId: string): VolumeOrganAsset | undefined {
  if (!isVisibleHumanOrganEnabled()) return undefined;
  const def = getVisibleHumanOrganDef(organId);
  const url = resolveVolumeOrganUrl(organId);
  if (!def || !url) return undefined;
  return { organId, url, format: "glb" };
}

export function hasVolumeOrganAsset(organId: string): boolean {
  return hasVisibleHumanOrgan(organId);
}

export const CT_FIDELITY_PIPELINE = [
  "HuBMAP CCF v1.2 GLBs (Visible Human) load from jsDelivr CDN by default",
  "Optional local: npm run anatomy:fetch-vh then NEXT_PUBLIC_VOLUME_ORGAN_BASE=local",
  "Segment custom DICOM in 3D Slicer → GLB → register in VISIBLE_HUMAN_ORGANS",
  "Future: single NIfTI label volume for raymarched CT windowing",
] as const;
