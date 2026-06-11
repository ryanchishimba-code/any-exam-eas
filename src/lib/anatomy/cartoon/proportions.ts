/** Standing figure anchors — ~8-head canon, aligned to ANATOMY_MODULES organ layout. */

export const FIGURE = {
  /** Crown center — oval head sits slightly above organ skull anchor. */
  headY: 1.58,
  /** Horizontal head radius (oval is taller via headScaleY). */
  headRadius: 0.17,
  headScaleY: 1.28,
  headScaleZ: 0.88,
  neckY: 1.34,
  neckRadius: 0.065,
  shoulderY: 1.22,
  /** Half-width at deltoid line — ~2.3× head width. */
  shoulderSpan: 0.39,
  chestY: 0.92,
  waistY: 0.48,
  hipY: 0.1,
  kneeY: -0.4,
  ankleY: -0.9,
  footY: -0.96,
  hipSpan: 0.18,
  /** Limb radii — thighs thicker than calves, upper arms thicker than forearms. */
  thighRadius: 0.092,
  calfRadius: 0.062,
  upperArmRadius: 0.068,
  forearmRadius: 0.052,
  /** Lateral offsets for arm chain (shoulder → elbow → wrist). */
  elbowX: 0.5,
  elbowY: 0.9,
  wristX: 0.46,
  wristY: 0.5,
  centerZ: 0.04,
  /** Face landmarks (eyes) relative to head center. */
  eyeOffsetX: 0.062,
  eyeOffsetY: 0.035,
  eyeOffsetZ: 0.13,
  eyeRadius: 0.022,
} as const;

export const CARTOON_CAMERA = {
  position: [0, 0.38, 4.15] as [number, number, number],
  target: [0, 0.31, 0] as [number, number, number],
  fov: 34,
  minDistance: 1.4,
  maxDistance: 7,
};
