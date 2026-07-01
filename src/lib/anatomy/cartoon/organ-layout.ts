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
  brain: { position: [0, 1.56, 0.015], scale: [0.22, 0.18, 0.23], depthOrder: 1 },
  thyroid: { position: [0, 1.13, 0.08], scale: [0.12, 0.052, 0.06], depthOrder: 8 },
  trachea: { position: [0, 1.15, 0.05], scale: [0.05, 0.16, 0.05], depthOrder: 7 },
  esophagus: { position: [0, 0.82, -0.02], scale: [0.038, 0.26, 0.038], depthOrder: 5 },
  lungs: { position: [0, 0.91, -0.1], scale: [0.36, 0.26, 0.13], depthOrder: 2 },
  heart: {
    position: [0.07, 0.82, 0.05],
    scale: [0.11, 0.12, 0.078],
    rotation: [0.12, -0.08, -0.4],
    depthOrder: 6,
  },
  liver: { position: [-0.11, 0.5, -0.02], scale: [0.2, 0.11, 0.078], depthOrder: 3 },
  stomach: {
    position: [0.08, 0.46, 0.02],
    scale: [0.11, 0.095, 0.07],
    rotation: [0.08, 0, 0.12],
    depthOrder: 4,
  },
  spleen: { position: [0.14, 0.51, -0.05], scale: [0.068, 0.09, 0.04], depthOrder: 2 },
  gallbladder: { position: [-0.1, 0.44, 0.02], scale: [0.05, 0.062, 0.034], depthOrder: 5 },
  pancreas: { position: [0.01, 0.39, -0.04], scale: [0.15, 0.038, 0.048], depthOrder: 2 },
  duodenum: { position: [0.05, 0.36, -0.03], scale: [0.085, 0.06, 0.06], depthOrder: 3 },
  "small-intestine": { position: [0, 0.28, -0.04], scale: [0.2, 0.15, 0.13], depthOrder: 5 },
  colon: { position: [0, 0.25, -0.01], scale: [0.26, 0.19, 0.12], depthOrder: 4 },
  appendix: { position: [0.14, 0.2, 0.01], scale: [0.028, 0.065, 0.024], depthOrder: 5 },
  kidneys: { position: [0, 0.29, -0.11], scale: [0.26, 0.078, 0.058], depthOrder: 1 },
  "adrenal-glands": { position: [0, 0.32, -0.11], scale: [0.2, 0.028, 0.038], depthOrder: 1 },
  bladder: { position: [0, 0.04, 0.02], scale: [0.095, 0.062, 0.058], depthOrder: 5 },
  prostate: { position: [0, -0.02, 0.008], scale: [0.062, 0.032, 0.044], depthOrder: 6 },
  // Structural catalog meshes — tucked inside body shell
  skull: { position: [0, 1.56, 0.02], scale: [0.33, 0.35, 0.33], depthOrder: 0 },
  "carotid-artery": { position: [0, 1.17, 0.06], scale: [0.1, 0.12, 0.1], depthOrder: 7 },
  clavicle: { position: [0, 1.24, 0.04], scale: [0.44, 0.048, 0.048], depthOrder: 1 },
  sternum: { position: [0, 0.9, 0.07], scale: [0.048, 0.2, 0.022], depthOrder: 6 },
  aorta: { position: [0.02, 0.98, -0.04], scale: [0.11, 0.17, 0.11], depthOrder: 3 },
  diaphragm: { position: [0, 0.64, -0.04], scale: [0.46, 0.38, 0.22], depthOrder: 2 },
  "spinal-cord": { position: [0, 0.58, -0.1], scale: [0.032, 0.72, 0.032], depthOrder: 1 },
  "vertebral-column": { position: [0, 0.48, -0.1], scale: [0.055, 0.82, 0.055], depthOrder: 0 },
  scapula: { position: [-0.24, 1.0, -0.07], scale: [0.09, 0.13, 0.03], rotation: [0, 0.28, 0], depthOrder: 1 },
  biceps: { position: [0.3, 0.68, 0.04], scale: [0.065, 0.16, 0.065], depthOrder: 4 },
  humerus: { position: [0.34, 0.38, 0.02], scale: [0.048, 0.3, 0.048], depthOrder: 2 },
  femur: { position: [0.1, -0.12, 0.01], scale: [0.078, 0.44, 0.078], depthOrder: 2 },
  tibia: { position: [0.1, -0.62, 0.02], scale: [0.055, 0.32, 0.055], depthOrder: 2 },
  // Sub-regions — positioned on/near parent organs
  "heart-aortic-valve": {
    position: [0.04, 0.9, 0.08],
    scale: [0.028, 0.028, 0.022],
    depthOrder: 8,
  },
  "heart-mitral-valve": {
    position: [0.02, 0.84, 0.07],
    scale: [0.026, 0.024, 0.02],
    depthOrder: 8,
  },
  "heart-left-ventricle": {
    position: [0.05, 0.78, 0.06],
    scale: [0.055, 0.065, 0.04],
    depthOrder: 7,
  },
  "heart-coronary-arteries": {
    position: [0.06, 0.86, 0.065],
    scale: [0.048, 0.05, 0.035],
    depthOrder: 9,
  },
  "lung-right-upper": {
    position: [-0.1, 1.0, -0.06],
    scale: [0.12, 0.11, 0.06],
    depthOrder: 3,
  },
  "lung-right-lower": {
    position: [-0.11, 0.82, -0.08],
    scale: [0.13, 0.12, 0.065],
    depthOrder: 3,
  },
  "lung-left-upper": {
    position: [0.1, 0.98, -0.06],
    scale: [0.11, 0.1, 0.055],
    depthOrder: 3,
  },
  "liver-right-lobe": {
    position: [-0.14, 0.52, -0.03],
    scale: [0.14, 0.09, 0.06],
    depthOrder: 4,
  },
  "liver-portal-hilum": {
    position: [-0.04, 0.48, 0.01],
    scale: [0.045, 0.04, 0.035],
    depthOrder: 6,
  },
  "gallbladder-cystic-duct": {
    position: [-0.08, 0.46, 0.03],
    scale: [0.035, 0.045, 0.025],
    depthOrder: 6,
  },
  "pancreas-head": {
    position: [0.06, 0.38, 0.0],
    scale: [0.07, 0.045, 0.04],
    depthOrder: 4,
  },
  "pancreas-tail": {
    position: [-0.1, 0.4, -0.05],
    scale: [0.08, 0.035, 0.035],
    depthOrder: 3,
  },
  "kidney-renal-pelvis": {
    position: [0, 0.29, -0.1],
    scale: [0.08, 0.035, 0.03],
    depthOrder: 2,
  },
  "thyroid-isthmus": {
    position: [0, 1.12, 0.07],
    scale: [0.06, 0.022, 0.028],
    depthOrder: 9,
  },
  "prostate-peripheral-zone": {
    position: [0, -0.02, -0.01],
    scale: [0.055, 0.028, 0.038],
    depthOrder: 7,
  },
  "stomach-pylorus": {
    position: [0.1, 0.44, 0.04],
    scale: [0.045, 0.04, 0.035],
    depthOrder: 6,
  },
  "colon-sigmoid": {
    position: [-0.1, 0.22, 0.03],
    scale: [0.08, 0.07, 0.05],
    depthOrder: 5,
  },
  "bladder-trigone": {
    position: [0, 0.05, 0.03],
    scale: [0.05, 0.025, 0.04],
    depthOrder: 6,
  },
  "spleen-hilum": {
    position: [0.1, 0.52, -0.04],
    scale: [0.035, 0.04, 0.025],
    depthOrder: 4,
  },
  "aorta-ascending": {
    position: [0.03, 1.0, 0.02],
    scale: [0.045, 0.08, 0.045],
    depthOrder: 7,
  },
  "trachea-carina": {
    position: [0, 1.02, 0.04],
    scale: [0.055, 0.035, 0.04],
    depthOrder: 8,
  },
  "femur-neck": {
    position: [0.1, -0.02, 0.02],
    scale: [0.065, 0.045, 0.065],
    depthOrder: 3,
  },
  "spinal-cord-cervical": {
    position: [0, 1.35, -0.1],
    scale: [0.028, 0.14, 0.028],
    depthOrder: 2,
  },
};

export function getOrganDepthOrder(meshId: string): number {
  return ORGAN_MODULE_LAYOUT[meshId]?.depthOrder ?? 5;
}
