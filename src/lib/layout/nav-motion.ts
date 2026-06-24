/** Snappy spring for study nav active indicators — fast settle, Apple-like. */
export const STUDY_NAV_SPRING = {
  type: "spring" as const,
  stiffness: 520,
  damping: 38,
  mass: 0.82,
};

export const STUDY_NAV_COLOR =
  "transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]";
