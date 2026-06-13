/** Standing figure anchors — ~7.5-head adult canon, aligned to organ layout. */

export const FIGURE = {
  /** Crown center — oval head sits inside cranium module. */
  headY: 1.6,
  /** Horizontal head radius (oval is taller via headScaleY). */
  headRadius: 0.158,
  headScaleY: 1.36,
  headScaleZ: 0.92,
  neckY: 1.36,
  neckRadius: 0.054,
  shoulderY: 1.24,
  /** Half-width at deltoid line — ~2.45× head width. */
  shoulderSpan: 0.4,
  chestY: 0.94,
  waistY: 0.5,
  hipY: 0.06,
  kneeY: -0.44,
  ankleY: -0.94,
  footY: -0.99,
  footLength: 0.14,
  hipSpan: 0.182,
  /** Limb radii — thighs thicker than calves, upper arms thicker than forearms. */
  thighRadius: 0.086,
  calfRadius: 0.054,
  upperArmRadius: 0.058,
  forearmRadius: 0.044,
  /** Arm chain — slight bend at elbow, natural hang. */
  elbowX: 0.515,
  elbowY: 0.86,
  elbowForward: 0.055,
  wristX: 0.465,
  wristY: 0.4,
  wristForward: 0.045,
  /** Knee/ankle forward offset for natural stance. */
  kneeForward: 0.035,
  centerZ: 0.05,
  /** Face landmarks — see face-landmarks.ts (derived from headHeight). */
  eyeOffsetX: 0.047,
  eyeOffsetY: 0.012,
  eyeOffsetZ: 0.138,
  eyeRadius: 0.021,
  noseOffsetY: -0.018,
  noseOffsetZ: 0.148,
  earOffsetX: 0.138,
  earOffsetY: -0.012,
  earOffsetZ: 0.02,
} as const;

/** Standing height ≈ 7.5× craniofacial height (young adult male canon). */
export function getFigureHeadHeight(f: typeof FIGURE = FIGURE): number {
  return f.headRadius * f.headScaleY * 2;
}

export const CARTOON_CAMERA = {
  position: [0, 0.38, 4.35] as [number, number, number],
  target: [0, 0.28, 0] as [number, number, number],
  fov: 31,
  minDistance: 1.65,
  maxDistance: 7.2,
};

/** CT atlas — closer framing for Visible Human volume readability. */
export const CT_CAMERA = {
  position: [0, 0.3, 3.55] as [number, number, number],
  target: [0, 0.2, 0.02] as [number, number, number],
  fov: 36,
  minDistance: 1.45,
  maxDistance: 6.4,
};
