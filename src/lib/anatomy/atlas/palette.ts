import type { AnatomyLayer, AnatomySystem } from "../types";

/** Medical-illustration palette — cohesive, exam-atlas inspired. */
export const ATLAS_PALETTE = {
  backgroundTop: "#0f172a",
  backgroundBottom: "#020617",
  skin: "#ddb896",
  skinShadow: "#c49a6c",
  skinHighlight: "#f0d4b8",
  muscle: "#b85c55",
  muscleShadow: "#8f3f3a",
  bone: "#f3efe8",
  boneShadow: "#d4cfc4",
  vessel: "#e85d5d",
  nerve: "#a78bfa",
  outline: "rgba(15,23,42,0.35)",
  outlineSoft: "rgba(15,23,42,0.18)",
  selectedGlow: "rgba(167,139,250,0.55)",
  highlightGlow: "rgba(45,212,191,0.45)",
} as const;

export const ATLAS_SYSTEM_FILLS: Record<AnatomySystem, string> = {
  cardiovascular: "#dc4c4c",
  respiratory: "#7eb8da",
  nervous: "#9b7ed9",
  digestive: "#d4a03c",
  urinary: "#e8c84a",
  skeletal: "#ece8e0",
  muscular: "#b85c55",
  lymphatic: "#3dca9f",
  endocrine: "#e879a8",
};

export const ATLAS_LAYER_OPACITY: Record<AnatomyLayer, number> = {
  skin: 1,
  muscle: 0.92,
  organ: 0.95,
  vascular: 0.88,
  nerve: 0.9,
  bone: 0.98,
};
