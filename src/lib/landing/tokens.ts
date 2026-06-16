/**
 * Flagship design tokens — reuse across landing, pricing, and marketing surfaces.
 * Palette: deep navy + electric teal (Tesla/Apple × UWorld medical authority).
 */
export const FLAGSHIP = {
  navy: "#0A2540",
  navyMuted: "#0d3254",
  teal: "#00D4C8",
  tealDark: "#00b8ad",
  gray100: "#f4f6f8",
  gray200: "#e2e8f0",
  gray500: "#64748b",
  gray700: "#334155",
  white: "#ffffff",
} as const;

/** Exam accent colors — distinct but restrained for grid harmony */
export const EXAM_ACCENTS = {
  nclex: FLAGSHIP.teal,
  usmle: "#4da3ff",
  naplex: "#9b8cff",
  pance: "#f472b6",
  aanpFnp: "#e879f9",
} as const;
