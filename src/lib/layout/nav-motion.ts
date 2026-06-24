/** Snappy spring for study nav active indicators — fast settle, Apple-like. */
export const STUDY_NAV_SPRING = {
  type: "spring" as const,
  stiffness: 520,
  damping: 38,
  mass: 0.82,
};

/** Shell chrome (sidebar / bottom bar) when entering full-exam simulator. */
export const SHELL_CHROME_SPRING = {
  type: "spring" as const,
  stiffness: 480,
  damping: 42,
  mass: 0.88,
};

export const STUDY_NAV_COLOR =
  "transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]";

export const SHELL_LAYOUT_TRANSITION =
  "transition-[padding,gap,max-width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";
