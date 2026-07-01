/**
 * Allen Human Brain (HuBMAP CCF) — map 280+ cortical/subcortical meshes to study lobes.
 * Matchers run in priority order (first win).
 */

export type BrainRegionDef = {
  id: string;
  label: string;
  /** Allen GLB mesh name patterns (case-insensitive). */
  matchers: RegExp[];
};

/** Lobe / region ids — also used as anatomy structure + meshId suffixes. */
export const BRAIN_REGIONS: BrainRegionDef[] = [
  {
    id: "brain-brainstem",
    label: "Brainstem",
    matchers: [
      /midbrain/i,
      /\bpons\b/i,
      /_pons_/i,
      /medulla/i,
      /central_canal_of_medulla/i,
    ],
  },
  {
    id: "brain-cerebellum",
    label: "Cerebellum",
    matchers: [/cerebell/i, /paravermis/i, /vermis/i],
  },
  {
    id: "brain-occipital-lobe",
    label: "Occipital lobe",
    matchers: [
      /occipital/i,
      /lingual_gyrus/i,
      /occipitotemporal_fusiform_gyrus_occipital/i,
    ],
  },
  {
    id: "brain-temporal-lobe",
    label: "Temporal lobe",
    matchers: [
      /temporal/i,
      /Heschl/i,
      /planum_temporale/i,
      /occipitotemporal_fusiform_gyrus_temporal/i,
    ],
  },
  {
    id: "brain-parietal-lobe",
    label: "Parietal lobe",
    matchers: [/postcentral/i, /supraparietal/i, /parietal_operculum/i, /paracentral_lobule_caudal/i],
  },
  {
    id: "brain-insula",
    label: "Insula",
    matchers: [/insul/i, /limen_insula/i],
  },
  {
    id: "brain-frontal-lobe",
    label: "Frontal lobe",
    matchers: [
      /frontal/i,
      /precentral/i,
      /paracingulate/i,
      /paracentral_lobule_rostral/i,
    ],
  },
];

export const BRAIN_REGION_IDS = new Set(BRAIN_REGIONS.map((r) => r.id));

export function isBrainRegionStructureId(structureId: string): boolean {
  return BRAIN_REGION_IDS.has(structureId);
}

/** Map an Allen mesh name to a catalog structure id (e.g. brain-frontal-lobe). */
export function resolveBrainRegionForAllenMeshName(meshName: string): string | null {
  if (!meshName || !meshName.startsWith("Allen_")) return null;
  for (const region of BRAIN_REGIONS) {
    if (region.matchers.some((re) => re.test(meshName))) return region.id;
  }
  return null;
}

export function getBrainRegionDef(regionId: string): BrainRegionDef | undefined {
  return BRAIN_REGIONS.find((r) => r.id === regionId);
}
