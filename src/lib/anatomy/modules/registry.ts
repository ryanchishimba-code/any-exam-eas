import { getBoneFocus, getBoneFocusDistance, getBoneModules } from "../bones";
import { ANATOMY_STRUCTURES } from "../structures";
import { ORGAN_COLORS, getOrganMeshColor } from "../cartoon/organ-colors";
import { ORGAN_MODULE_LAYOUT } from "../cartoon/organ-layout";
import type { AnatomyModuleDef } from "./types";

function withLayout(mod: AnatomyModuleDef): AnatomyModuleDef {
  const layout = ORGAN_MODULE_LAYOUT[mod.id];
  const color = getOrganMeshColor(mod.id, mod.color);
  const base = { ...mod, color };
  if (!layout) return base;
  return {
    ...base,
    position: layout.position,
    scale: layout.scale,
    rotation: layout.rotation ?? mod.rotation,
  };
}

/** Organ / vessel / nerve / muscle modules — bones use ClickableSkeleton + bone catalog. */
const BASE_MODULES: AnatomyModuleDef[] = [
  { id: "thyroid", layer: "organ", position: [0, 1.14, 0.14], scale: [0.14, 0.07, 0.09], color: ORGAN_COLORS.thyroid, geometry: "box", profile: "thyroid", focusDistance: 1.35 },
  { id: "trachea", layer: "organ", position: [0, 1.18, 0.1], scale: [0.06, 0.18, 0.06], color: ORGAN_COLORS.trachea, geometry: "cylinder", profile: "trachea-tube", focusDistance: 1.4 },
  { id: "carotid-artery", layer: "vascular", position: [0, 1.19, 0.07], scale: [0.11, 0.13, 0.11], color: ORGAN_COLORS.artery, geometry: "cylinder", profile: "carotid-pair", focusDistance: 1.35, metalness: 0.12 },
  { id: "esophagus", layer: "organ", position: [0, 0.82, 0.06], scale: [0.045, 0.28, 0.045], color: ORGAN_COLORS.esophagus, geometry: "cylinder", profile: "esophagus-tube", focusDistance: 1.45 },
  { id: "lungs", layer: "organ", position: [0, 0.94, -0.04], scale: [0.42, 0.32, 0.2], color: ORGAN_COLORS.lung, geometry: "box", profile: "lungs", focusDistance: 1.65, opacity: 0.9 },
  { id: "heart", layer: "organ", position: [0.06, 0.86, 0.06], scale: [0.11, 0.13, 0.09], color: ORGAN_COLORS.heart, geometry: "sphere", profile: "heart", focusDistance: 1.3 },
  { id: "aorta", layer: "vascular", position: [0.02, 1.02, -0.04], scale: [0.11, 0.18, 0.11], color: ORGAN_COLORS.artery, geometry: "cylinder", profile: "aorta-arch", focusDistance: 1.4, metalness: 0.1 },
  { id: "diaphragm", layer: "muscle", position: [0, 0.68, -0.02], scale: [0.46, 0.035, 0.22], color: ORGAN_COLORS.muscleAccent, geometry: "box", profile: "diaphragm-disc", focusDistance: 1.75 },
  { id: "liver", layer: "organ", position: [0.14, 0.5, -0.01], scale: [0.2, 0.12, 0.1], color: ORGAN_COLORS.liver, geometry: "box", profile: "liver", focusDistance: 1.35 },
  { id: "stomach", layer: "organ", position: [-0.07, 0.48, 0.02], scale: [0.12, 0.1, 0.08], color: ORGAN_COLORS.stomach, geometry: "sphere", profile: "stomach-sac", focusDistance: 1.35 },
  { id: "spleen", layer: "organ", position: [-0.18, 0.54, -0.03], scale: [0.08, 0.1, 0.05], color: ORGAN_COLORS.spleen, geometry: "sphere", profile: "spleen-oval", focusDistance: 1.4 },
  { id: "gallbladder", layer: "organ", position: [0.14, 0.44, 0.06], scale: [0.07, 0.08, 0.05], color: ORGAN_COLORS.gallbladder, geometry: "sphere", profile: "gallbladder-pear", focusDistance: 1.3 },
  { id: "pancreas", layer: "organ", position: [0.03, 0.4, -0.01], scale: [0.17, 0.045, 0.06], color: ORGAN_COLORS.pancreas, geometry: "box", profile: "pancreas-band", focusDistance: 1.45 },
  { id: "duodenum", layer: "organ", position: [0.08, 0.36, 0.03], scale: [0.1, 0.07, 0.07], color: ORGAN_COLORS.duodenum, geometry: "box", profile: "duodenum-loop", focusDistance: 1.4 },
  { id: "small-intestine", layer: "organ", position: [0, 0.3, 0], scale: [0.2, 0.16, 0.14], color: ORGAN_COLORS.smallIntestine, geometry: "sphere", profile: "small-intestine-coils", focusDistance: 1.4, opacity: 0.92 },
  { id: "colon", layer: "organ", position: [0, 0.26, 0.02], scale: [0.26, 0.2, 0.12], color: ORGAN_COLORS.colon, geometry: "box", profile: "colon-frame", focusDistance: 1.42, opacity: 0.9 },
  { id: "appendix", layer: "organ", position: [0.16, 0.22, 0.03], scale: [0.04, 0.08, 0.035], color: ORGAN_COLORS.appendix, geometry: "capsule", profile: "appendix-tube", focusDistance: 1.35 },
  { id: "kidneys", layer: "organ", position: [0, 0.28, -0.08], scale: [0.3, 0.09, 0.07], color: ORGAN_COLORS.kidney, geometry: "box", profile: "kidneys", focusDistance: 1.5 },
  { id: "adrenal-glands", layer: "organ", position: [0, 0.32, -0.1], scale: [0.26, 0.04, 0.06], color: ORGAN_COLORS.adrenal, geometry: "box", profile: "adrenal-pair", focusDistance: 1.45 },
  { id: "bladder", layer: "organ", position: [0, 0.06, 0.04], scale: [0.12, 0.08, 0.08], color: ORGAN_COLORS.bladder, geometry: "sphere", profile: "bladder-sac", focusDistance: 1.3 },
  { id: "prostate", layer: "organ", position: [0, 0, 0.02], scale: [0.08, 0.045, 0.06], color: ORGAN_COLORS.prostate, geometry: "sphere", profile: "prostate-disc", focusDistance: 1.25 },
  { id: "spinal-cord", layer: "nerve", position: [0, 0.6, -0.14], scale: [0.045, 0.78, 0.045], color: ORGAN_COLORS.nerve, geometry: "cylinder", profile: "nerve-cord", focusDistance: 1.75 },
  { id: "biceps", layer: "muscle", position: [0.33, 0.7, 0.05], scale: [0.07, 0.18, 0.07], color: ORGAN_COLORS.muscleAccent, geometry: "capsule", profile: "muscle-bulge", focusDistance: 1.4 },
];

const SUBREGION_MODULE_DEFS: Omit<AnatomyModuleDef, "position" | "scale" | "rotation">[] = [
  { id: "heart-aortic-valve", layer: "organ", color: ORGAN_COLORS.heart, geometry: "sphere", focusDistance: 1.15 },
  { id: "heart-mitral-valve", layer: "organ", color: ORGAN_COLORS.heart, geometry: "sphere", focusDistance: 1.15 },
  { id: "heart-left-ventricle", layer: "organ", color: ORGAN_COLORS.heart, geometry: "box", profile: "heart", focusDistance: 1.2 },
  { id: "heart-coronary-arteries", layer: "vascular", color: ORGAN_COLORS.artery, geometry: "cylinder", focusDistance: 1.2, metalness: 0.15 },
  { id: "lung-right-upper", layer: "organ", color: ORGAN_COLORS.lung, geometry: "box", focusDistance: 1.55, opacity: 0.88 },
  { id: "lung-right-lower", layer: "organ", color: ORGAN_COLORS.lung, geometry: "box", focusDistance: 1.55, opacity: 0.88 },
  { id: "lung-left-upper", layer: "organ", color: ORGAN_COLORS.lung, geometry: "box", focusDistance: 1.55, opacity: 0.88 },
  { id: "liver-right-lobe", layer: "organ", color: ORGAN_COLORS.liver, geometry: "box", profile: "liver", focusDistance: 1.3 },
  { id: "liver-portal-hilum", layer: "organ", color: ORGAN_COLORS.liver, geometry: "box", focusDistance: 1.25 },
  { id: "gallbladder-cystic-duct", layer: "organ", color: ORGAN_COLORS.gallbladder, geometry: "cylinder", focusDistance: 1.2 },
  { id: "pancreas-head", layer: "organ", color: ORGAN_COLORS.pancreas, geometry: "box", profile: "pancreas-band", focusDistance: 1.35 },
  { id: "pancreas-tail", layer: "organ", color: ORGAN_COLORS.pancreas, geometry: "box", profile: "pancreas-band", focusDistance: 1.35 },
  { id: "kidney-renal-pelvis", layer: "organ", color: ORGAN_COLORS.kidney, geometry: "sphere", focusDistance: 1.45 },
  { id: "thyroid-isthmus", layer: "organ", color: ORGAN_COLORS.thyroid, geometry: "box", profile: "thyroid", focusDistance: 1.3 },
  { id: "prostate-peripheral-zone", layer: "organ", color: ORGAN_COLORS.prostate, geometry: "sphere", profile: "prostate-disc", focusDistance: 1.2 },
  { id: "stomach-pylorus", layer: "organ", color: ORGAN_COLORS.stomach, geometry: "sphere", focusDistance: 1.3 },
  { id: "colon-sigmoid", layer: "organ", color: ORGAN_COLORS.colon, geometry: "box", focusDistance: 1.38, opacity: 0.9 },
  { id: "bladder-trigone", layer: "organ", color: ORGAN_COLORS.bladder, geometry: "box", focusDistance: 1.25 },
  { id: "spleen-hilum", layer: "organ", color: ORGAN_COLORS.spleen, geometry: "sphere", focusDistance: 1.38 },
  { id: "aorta-ascending", layer: "vascular", color: ORGAN_COLORS.artery, geometry: "cylinder", focusDistance: 1.35, metalness: 0.12 },
  { id: "trachea-carina", layer: "organ", color: ORGAN_COLORS.trachea, geometry: "box", focusDistance: 1.35 },
  { id: "femur-neck", layer: "bone", color: ORGAN_COLORS.boneAccent, geometry: "sphere", focusDistance: 1.2 },
  { id: "spinal-cord-cervical", layer: "nerve", color: ORGAN_COLORS.nerve, geometry: "cylinder", profile: "nerve-cord", focusDistance: 1.5 },
];

function buildSubregionModules(): AnatomyModuleDef[] {
  return SUBREGION_MODULE_DEFS.map((def) => {
    const layout = ORGAN_MODULE_LAYOUT[def.id];
    const color = getOrganMeshColor(def.id, def.color);
    return withLayout({
      ...def,
      position: layout?.position ?? [0, 0.5, 0],
      scale: layout?.scale ?? [0.05, 0.05, 0.05],
      color,
    });
  });
}

const LEGACY_BONE_MESH_IDS = [
  "skull",
  "femur",
  "humerus",
  "tibia",
  "clavicle",
  "scapula",
  "sternum",
  "vertebral-column",
] as const;

function legacyBoneModules(): AnatomyModuleDef[] {
  return LEGACY_BONE_MESH_IDS.map((id) => {
    const focus = getBoneFocus(id) ?? [0, 0.5, 0];
    return {
      id,
      layer: "bone" as const,
      position: focus as [number, number, number],
      scale: [1, 1, 1] as [number, number, number],
      color: ORGAN_COLORS.boneAccent,
      geometry: "capsule" as const,
      focusDistance: getBoneFocusDistance(id),
      opacity: 0.95,
    };
  });
}

export const ANATOMY_MODULES: AnatomyModuleDef[] = [
  ...BASE_MODULES.map(withLayout),
  ...buildSubregionModules(),
  ...getBoneModules(),
  ...legacyBoneModules(),
];

const moduleByMeshId = new Map(ANATOMY_MODULES.map((m) => [m.id, m]));

export function getAnatomyModule(meshId: string): AnatomyModuleDef | undefined {
  return moduleByMeshId.get(meshId);
}

export function getAllAnatomyModules(): AnatomyModuleDef[] {
  return ANATOMY_MODULES;
}

export function getModulesForStructures(): { module: AnatomyModuleDef; structureId: string }[] {
  return ANATOMY_STRUCTURES.flatMap((s) => {
    const mod = moduleByMeshId.get(s.meshId);
    return mod ? [{ module: mod, structureId: s.id }] : [];
  });
}

export function assertModuleCatalogIntegrity(): string[] {
  return ANATOMY_STRUCTURES.filter((s) => !moduleByMeshId.has(s.meshId)).map((s) => s.id);
}
