/** PBR tuning + naturalistic palette — stylized study model, not flat cartoon. */

export const CARTOON_SKIN = "#ddb892";
export const CARTOON_SKIN_SHADOW = "#c4956a";
export const CARTOON_SKIN_GHOST = "#b8a9d4";
export const CARTOON_HAIR = "#3d2b1f";
export const CARTOON_EYE_WHITE = "#f8fafc";
export const CARTOON_EYE_IRIS = "#4a3728";
export const CARTOON_OUTLINE = "#1e1b4b";
export const CARTOON_SCENE_BG = "#e4eaf0";
export const CARTOON_SCENE_FOG = "#d8e0e8";
export const CARTOON_FLOOR = "#b8c4d0";
export const CARTOON_BONE = "#f0ebe3";
export const CARTOON_BONE_SHADOW = "#d6cfc4";
export const CARTOON_MUSCLE = "#b8845e";
export const CARTOON_MUSCLE_DARK = "#8f6344";
export const CARTOON_MUSCLE_HIGHLIGHT = "#d4a574";
export const CARTOON_ARTERY = "#c41e3a";
export const CARTOON_VEIN = "#1d4ed8";

/** Shared meshStandardMaterial tuning by tissue type. */
export const TISSUE_PBR = {
  skin: { roughness: 0.58, metalness: 0.04 },
  organ: { roughness: 0.45, metalness: 0.03 },
  bone: { roughness: 0.68, metalness: 0.06 },
  muscle: { roughness: 0.52, metalness: 0.04 },
  vessel: { roughness: 0.32, metalness: 0.15 },
  ghost: { roughness: 0.75, metalness: 0.02 },
} as const;
