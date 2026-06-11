/**
 * Organ-first layout — positions tuned to sit inside the cartoon torso cavity.
 * Posterior structures use negative Z; anterior structures positive Z.
 */

type Layout = {
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  /** Draw order — lower = further back. */
  depthOrder?: number;
};

export const ORGAN_MODULE_LAYOUT: Record<string, Layout> = {
  brain: { position: [0, 1.52, 0.02], scale: [0.24, 0.2, 0.26], depthOrder: 1 },
  thyroid: { position: [0, 1.12, 0.1], scale: [0.12, 0.06, 0.07], depthOrder: 8 },
  trachea: { position: [0, 1.16, 0.06], scale: [0.05, 0.15, 0.05], depthOrder: 7 },
  esophagus: { position: [0, 0.84, 0.02], scale: [0.038, 0.24, 0.038], depthOrder: 5 },
  lungs: { position: [0, 0.93, -0.08], scale: [0.32, 0.22, 0.11], depthOrder: 2 },
  heart: { position: [0.06, 0.87, 0.05], scale: [0.09, 0.1, 0.07], depthOrder: 6 },
  liver: { position: [0.12, 0.52, 0.01], scale: [0.16, 0.09, 0.07], depthOrder: 3 },
  stomach: { position: [-0.08, 0.48, 0.04], scale: [0.1, 0.085, 0.065], depthOrder: 4 },
  spleen: { position: [-0.15, 0.52, -0.04], scale: [0.065, 0.085, 0.04], depthOrder: 2 },
  gallbladder: { position: [0.12, 0.44, 0.05], scale: [0.06, 0.07, 0.04], depthOrder: 5 },
  pancreas: { position: [0.01, 0.4, -0.05], scale: [0.14, 0.038, 0.05], depthOrder: 2 },
  duodenum: { position: [0.07, 0.36, -0.01], scale: [0.085, 0.06, 0.06], depthOrder: 3 },
  "small-intestine": { position: [0, 0.3, -0.01], scale: [0.2, 0.16, 0.14], depthOrder: 5 },
  colon: { position: [0, 0.26, 0.02], scale: [0.26, 0.2, 0.12], depthOrder: 4 },
  appendix: { position: [0.14, 0.22, 0.04], scale: [0.032, 0.065, 0.028], depthOrder: 5 },
  kidneys: { position: [0, 0.28, -0.11], scale: [0.24, 0.07, 0.055], depthOrder: 1 },
  "adrenal-glands": { position: [0, 0.32, -0.12], scale: [0.2, 0.032, 0.045], depthOrder: 1 },
  bladder: { position: [0, 0.06, 0.02], scale: [0.1, 0.07, 0.065], depthOrder: 5 },
  prostate: { position: [0, 0, 0.015], scale: [0.07, 0.038, 0.05], depthOrder: 6 },
};

export function getOrganDepthOrder(meshId: string): number {
  return ORGAN_MODULE_LAYOUT[meshId]?.depthOrder ?? 5;
}
