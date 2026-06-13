/**
 * CT window presets — Hounsfield-inspired display (teaching PACS look).
 * W = window width, L = window level (center).
 */

export type CtWindowId = "soft" | "bone" | "lung" | "contrast";

export type CtWindow = {
  id: CtWindowId;
  label: string;
  /** Window level (HU center). */
  level: number;
  /** Window width (HU). */
  width: number;
  background: string;
  ambient: number;
  /** Base grey lift so low-HU structures stay readable. */
  floor: number;
  /** Display gamma (< 1 lifts mid-tones). */
  gamma: number;
};

export const CT_WINDOWS: Record<CtWindowId, CtWindow> = {
  soft: {
    id: "soft",
    label: "Soft tissue",
    level: 40,
    width: 400,
    background: "#161618",
    ambient: 0.85,
    floor: 0.06,
    gamma: 0.78,
  },
  bone: {
    id: "bone",
    label: "Bone",
    level: 300,
    width: 1500,
    background: "#121214",
    ambient: 0.8,
    floor: 0.08,
    gamma: 0.72,
  },
  lung: {
    id: "lung",
    label: "Lung",
    level: -600,
    width: 1500,
    background: "#101012",
    ambient: 0.82,
    floor: 0.05,
    gamma: 0.8,
  },
  contrast: {
    id: "contrast",
    label: "Angio",
    level: 120,
    width: 600,
    background: "#141416",
    ambient: 0.82,
    floor: 0.07,
    gamma: 0.76,
  },
};

export const CT_WINDOW_ORDER: CtWindowId[] = ["soft", "bone", "lung", "contrast"];

/** Approximate HU for atlas organ rendering (Visible Human soft-tissue scale). */
export const CT_ORGAN_HU: Record<string, number> = {
  skin: 30,
  heart: 42,
  lungs: -320,
  liver: 58,
  spleen: 48,
  pancreas: 36,
  kidneys: 32,
  colon: 18,
  "small-intestine": 22,
  stomach: 28,
  bladder: 12,
  prostate: 35,
  "blood-vasculature": 95,
  brain: 36,
  "spinal-cord": 38,
  thymus: 34,
  thyroid: 80,
  pelvis: 280,
  "knee-l": 320,
  "knee-r": 320,
  "ct-thorax": 310,
  "ct-sternum": 330,
  "ct-rib-cage": 300,
  rib: 305,
  "ct-clavicle-r": 315,
  "ct-clavicle-l": 315,
  femur: 350,
  tibia: 340,
  trachea: -450,
  esophagus: 28,
  aorta: 90,
};

/** Map HU + window → greyscale display intensity 0–1. */
export function huToIntensity(hu: number, window: CtWindow): number {
  const min = window.level - window.width / 2;
  const max = window.level + window.width / 2;
  return Math.max(0, Math.min(1, (hu - min) / (max - min)));
}

export function huToDisplayIntensity(hu: number, window: CtWindow): number {
  const raw = huToIntensity(hu, window);
  const gamma = Math.pow(raw, window.gamma);
  return Math.max(window.floor, Math.min(1, window.floor + gamma * (1 - window.floor)));
}

export function huToHex(hu: number, window: CtWindow): string {
  const t = huToDisplayIntensity(hu, window);
  const v = Math.round(t * 255);
  const c = v.toString(16).padStart(2, "0");
  return `#${c}${c}${c}`;
}

export function isCtAtlasEnabled(): boolean {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_ANATOMY_CT_MODE === "0") {
    return false;
  }
  return true;
}
