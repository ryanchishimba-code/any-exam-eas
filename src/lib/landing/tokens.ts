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

/** Public board slugs on marketing pages (matches `board-landing--*` themes from #255). */
export const BOARD_MARKETING_SLUGS = [
  "nclex",
  "naplex",
  "usmle",
  "aanp-fnp",
  "pance",
  "npte-pt",
] as const;

export type BoardMarketingSlug = (typeof BOARD_MARKETING_SLUGS)[number];

/**
 * Board accent colors for pills, menus, and landing themes (#255).
 * `primary` is the button fill; `hover` is a darker stop for gradients/hover.
 */
export const BOARD_MARKETING_ACCENTS: Record<
  BoardMarketingSlug,
  { primary: string; hover: string; secondary: string }
> = {
  nclex: { primary: "#0f766e", hover: "#115e59", secondary: "#14b8a6" },
  naplex: { primary: "#1d4ed8", hover: "#1e40af", secondary: "#3b82f6" },
  usmle: { primary: "#6d28d9", hover: "#5b21b6", secondary: "#a78bfa" },
  "aanp-fnp": { primary: "#be185d", hover: "#9d174d", secondary: "#f472b6" },
  pance: { primary: "#c2410c", hover: "#9a3412", secondary: "#fb923c" },
  "npte-pt": { primary: "#047857", hover: "#065f46", secondary: "#34d399" },
};

/** Exam accent colors — primary board marketing accent per exam. */
export const EXAM_ACCENTS = {
  nclex: BOARD_MARKETING_ACCENTS.nclex.primary,
  usmle: BOARD_MARKETING_ACCENTS.usmle.primary,
  naplex: BOARD_MARKETING_ACCENTS.naplex.primary,
  pance: BOARD_MARKETING_ACCENTS.pance.primary,
  aanpFnp: BOARD_MARKETING_ACCENTS["aanp-fnp"].primary,
  nptePt: BOARD_MARKETING_ACCENTS["npte-pt"].primary,
} as const;
