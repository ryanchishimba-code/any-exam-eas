/**
 * Hand / foot digit proportions — adult canon (~7.5-head figure).
 * Lengths in meters at world scale; metacarpal/metatarsal = 1.0 reference.
 */

export type FingerSpec = {
  /** Lateral offset from palm center (pre sx multiply). + = thumb side on right hand. */
  spreadX: number;
  metacarpal: number;
  phalanges: readonly number[];
  radii: readonly number[];
  /** Skin-only: slight forward curl in palm plane. */
  curl: readonly number[];
};

/** Index → pinky order; thumb separate. */
export const FINGER_SPECS: readonly FingerSpec[] = [
  { spreadX: 0.028, metacarpal: 0.048, phalanges: [0.028, 0.022, 0.016], radii: [0.0072, 0.0062, 0.0052], curl: [0.08, 0.12, 0.15] },
  { spreadX: 0.01, metacarpal: 0.052, phalanges: [0.026, 0.022, 0.015], radii: [0.0075, 0.0065, 0.0055], curl: [0.08, 0.12, 0.14] },
  { spreadX: -0.008, metacarpal: 0.055, phalanges: [0.028, 0.024, 0.017], radii: [0.008, 0.007, 0.006], curl: [0.08, 0.12, 0.14] },
  { spreadX: -0.026, metacarpal: 0.05, phalanges: [0.026, 0.021, 0.014], radii: [0.007, 0.006, 0.005], curl: [0.08, 0.11, 0.13] },
];

export const THUMB_SPEC = {
  spreadX: 0.042,
  metacarpal: 0.038,
  phalanges: [0.026, 0.022] as const,
  radii: [0.008, 0.0065] as const,
  /** Thumb extends in palm plane with opposition. */
  baseDir: { x: 0.35, y: -0.12, z: 0.55 },
  curl: [0.05, 0.08] as const,
};

/** Toe order: big → little. Big toe has 2 phalanges. */
export type ToeSpec = {
  spreadX: number;
  metatarsal: number;
  phalanges: readonly number[];
  radii: readonly number[];
};

export const TOE_SPECS: readonly ToeSpec[] = [
  { spreadX: 0.024, metatarsal: 0.048, phalanges: [0.022, 0.018], radii: [0.006, 0.005] },
  { spreadX: 0.008, metatarsal: 0.052, phalanges: [0.018, 0.014, 0.012], radii: [0.0055, 0.0048, 0.004] },
  { spreadX: -0.008, metatarsal: 0.054, phalanges: [0.019, 0.015, 0.013], radii: [0.0058, 0.005, 0.0042] },
  { spreadX: -0.022, metatarsal: 0.05, phalanges: [0.017, 0.013, 0.011], radii: [0.0052, 0.0045, 0.0038] },
  { spreadX: -0.034, metatarsal: 0.042, phalanges: [0.014, 0.011, 0.009], radii: [0.0048, 0.004, 0.0035] },
];

/** Foot length ≈ 26% of stature; palm ≈ 19% face height — tuned to FIGURE.footLength. */
export const FOOT_ARCH = {
  heelToBall: 0.55,
  ballToToe: 0.45,
} as const;
