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

/** Exam accent colors — vivid on landing hero & exam cards */
export const EXAM_ACCENTS = {
  nclex: "#00E5D8",
  usmle: "#3B9EFF",
  naplex: "#9B8CFF",
  pance: "#FF5C9A",
  aanpFnp: "#E040FB",
  nptePt: "#22D3EE",
  comlex: "#38bdf8",
} as const;
