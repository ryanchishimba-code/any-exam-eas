/** PBR tuning + naturalistic palette — medical-illustration realism, not flat cartoon. */

export const CARTOON_SKIN = "#d9ad82";
export const CARTOON_SKIN_SHADOW = "#bc8f66";
/** Flesh-tinted mannequin when skin layer is off — must read as a body, not a wireframe. */
export const CARTOON_SKIN_GHOST = "#c9a484";
export const CARTOON_CAVITY_WALL = "#9a8478";
export const CARTOON_HAIR = "#2e2118";
export const CARTOON_EYE_WHITE = "#f4f6f8";
export const CARTOON_EYE_IRIS = "#3d3028";
export const CARTOON_SOCKET = "#3a2e38";
export const CARTOON_LIP = "#9a5a58";
export const CARTOON_OUTLINE = "#1a1838";
export const CARTOON_SCENE_BG = "#dce4ec";
export const CARTOON_SCENE_FOG = "#cdd6e0";
export const CARTOON_FLOOR = "#b0bcc8";
export const CARTOON_BONE = "#ebe6de";
export const CARTOON_BONE_SHADOW = "#d4cec4";
export const CARTOON_MUSCLE = "#a67a58";
export const CARTOON_MUSCLE_DARK = "#765438";
export const CARTOON_MUSCLE_HIGHLIGHT = "#c8986e";
export const CARTOON_ARTERY = "#9e1e2c";
export const CARTOON_VEIN = "#2e4a88";
export const CARTOON_NERVE = "#ffd43b";
export const CARTOON_NERVE_GLOW = "#fbbf24";

/** Shared meshStandardMaterial tuning by tissue type. */
export const TISSUE_PBR = {
  skin: { roughness: 0.58, metalness: 0.02 },
  organ: { roughness: 0.46, metalness: 0.015 },
  bone: { roughness: 0.7, metalness: 0.04 },
  muscle: { roughness: 0.52, metalness: 0.025 },
  vessel: { roughness: 0.34, metalness: 0.14 },
  nerve: { roughness: 0.38, metalness: 0.06 },
  ghost: { roughness: 0.8, metalness: 0.01 },
} as const;
