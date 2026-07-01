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
export const CARTOON_SCENE_BG = "#0a0e14";
export const CARTOON_SCENE_FOG = "#06080c";
export const CARTOON_FLOOR = "#121820";
/** Studio backdrop sphere for dark medical viewer. */
export const CARTOON_STUDIO_BACKDROP = "#141a24";
/** Teal wash on studio backdrop. */
export const CARTOON_STUDIO_ACCENT = "#155e75";
export const CARTOON_BONE = "#ebe6de";
export const CARTOON_BONE_SHADOW = "#d4cec4";
export const CARTOON_MUSCLE = "#a67a58";
export const CARTOON_MUSCLE_DARK = "#765438";
export const CARTOON_MUSCLE_HIGHLIGHT = "#c8986e";
export const CARTOON_ARTERY = "#9e1e2c";
export const CARTOON_VEIN = "#2e4a88";
export const CARTOON_NERVE = "#ffd43b";
export const CARTOON_NERVE_GLOW = "#fbbf24";

/** Shared meshPhysicalMaterial tuning by tissue type. */
export type TissueKind = keyof typeof TISSUE_PBR;

export const TISSUE_PBR = {
  skin: {
    roughness: 0.48,
    metalness: 0.02,
    clearcoat: 0.18,
    clearcoatRoughness: 0.42,
    sheen: 0.38,
    sheenRoughness: 0.55,
    envMapIntensity: 0.95,
  },
  organ: {
    roughness: 0.34,
    metalness: 0.02,
    clearcoat: 0.28,
    clearcoatRoughness: 0.32,
    sheen: 0.22,
    sheenRoughness: 0.48,
    envMapIntensity: 1.05,
  },
  bone: {
    roughness: 0.62,
    metalness: 0.06,
    clearcoat: 0.08,
    clearcoatRoughness: 0.55,
    sheen: 0.05,
    sheenRoughness: 0.7,
    envMapIntensity: 0.75,
  },
  muscle: {
    roughness: 0.44,
    metalness: 0.03,
    clearcoat: 0.12,
    clearcoatRoughness: 0.45,
    sheen: 0.18,
    sheenRoughness: 0.52,
    envMapIntensity: 0.88,
  },
  vessel: {
    roughness: 0.18,
    metalness: 0.28,
    clearcoat: 0.55,
    clearcoatRoughness: 0.12,
    sheen: 0.08,
    sheenRoughness: 0.35,
    envMapIntensity: 1.2,
  },
  nerve: {
    roughness: 0.28,
    metalness: 0.1,
    clearcoat: 0.35,
    clearcoatRoughness: 0.2,
    sheen: 0.15,
    sheenRoughness: 0.4,
    envMapIntensity: 1.15,
  },
  ghost: {
    roughness: 0.72,
    metalness: 0.01,
    clearcoat: 0.05,
    clearcoatRoughness: 0.65,
    sheen: 0.12,
    sheenRoughness: 0.6,
    envMapIntensity: 0.5,
  },
} as const;
