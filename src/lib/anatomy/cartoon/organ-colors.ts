/**
 * Per-organ colors — distinct, saturated teaching palette for easy identification.
 * Each catalog meshId maps to a unique hue (no shared browns across abdomen).
 */

export const ORGAN_COLORS = {
  heart: "#E63946",
  lung: "#4895EF",
  brain: "#BC6C25",
  liver: "#606C38",
  stomach: "#F4A261",
  spleen: "#9D0208",
  gallbladder: "#55A630",
  pancreas: "#FFBE0B",
  duodenum: "#FB8500",
  smallIntestine: "#FFB703",
  colon: "#7209B7",
  appendix: "#F72585",
  kidney: "#0077B6",
  adrenal: "#FF006E",
  bladder: "#F9C74F",
  thyroid: "#EF476F",
  trachea: "#4CC9F0",
  esophagus: "#FF9F1C",
  prostate: "#7B6CF6",
  nerve: "#FFD43B",
  boneAccent: "#E6E1D8",
  artery: "#D00000",
  muscleAccent: "#C77D58",
  muscleDeep: "#8B5E3C",
} as const;

/** One unique color per anatomy module mesh id. */
export const ORGAN_MESH_COLORS: Record<string, string> = {
  brain: ORGAN_COLORS.brain,
  thyroid: ORGAN_COLORS.thyroid,
  trachea: ORGAN_COLORS.trachea,
  esophagus: ORGAN_COLORS.esophagus,
  lungs: ORGAN_COLORS.lung,
  heart: ORGAN_COLORS.heart,
  liver: ORGAN_COLORS.liver,
  stomach: ORGAN_COLORS.stomach,
  spleen: ORGAN_COLORS.spleen,
  gallbladder: ORGAN_COLORS.gallbladder,
  pancreas: ORGAN_COLORS.pancreas,
  duodenum: ORGAN_COLORS.duodenum,
  "small-intestine": ORGAN_COLORS.smallIntestine,
  colon: ORGAN_COLORS.colon,
  appendix: ORGAN_COLORS.appendix,
  kidneys: ORGAN_COLORS.kidney,
  "adrenal-glands": ORGAN_COLORS.adrenal,
  bladder: ORGAN_COLORS.bladder,
  prostate: ORGAN_COLORS.prostate,
  "spinal-cord": ORGAN_COLORS.nerve,
  "carotid-artery": ORGAN_COLORS.artery,
  aorta: "#B5179E",
  diaphragm: ORGAN_COLORS.muscleAccent,
  biceps: ORGAN_COLORS.muscleDeep,
};

export function getOrganMeshColor(meshId: string, fallback = "#888888"): string {
  return ORGAN_MESH_COLORS[meshId] ?? fallback;
}
