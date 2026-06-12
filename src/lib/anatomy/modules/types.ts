import type { AnatomyLayer } from "../types";

export type AnatomyModuleGeometry = "sphere" | "box" | "cylinder" | "capsule";

/** Visual profile for anatomically shaped procedural geometry. */
export type AnatomyShapeProfile =
  | "default"
  | "skull"
  | "brain"
  | "lungs"
  | "heart"
  | "liver"
  | "kidneys"
  | "thyroid"
  | "carotid-pair"
  | "vertebrae"
  | "clavicle-pair"
  | "long-bone"
  | "diaphragm-disc"
  | "trachea-tube"
  | "aorta-arch"
  | "stomach-sac"
  | "pancreas-band"
  | "gallbladder-pear"
  | "spleen-oval"
  | "bladder-sac"
  | "scapula-blade"
  | "muscle-bulge"
  | "nerve-cord"
  | "appendix-tube"
  | "duodenum-loop"
  | "small-intestine-coils"
  | "colon-frame"
  | "esophagus-tube"
  | "adrenal-pair"
  | "prostate-disc";

/** One clickable 3D body-part module in the interactive explorer. */
export type AnatomyModuleDef = {
  /** Mesh id — matches AnatomyStructure.meshId */
  id: string;
  layer: AnatomyLayer;
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  geometry: AnatomyModuleGeometry;
  profile?: AnatomyShapeProfile;
  rotation?: [number, number, number];
  /** Preferred camera distance when this module is selected. */
  focusDistance?: number;
  roughness?: number;
  metalness?: number;
  opacity?: number;
};

export const ANATOMY_DEFAULT_CAMERA = {
  position: [0, 0.78, 3.0] as [number, number, number],
  target: [0, 0.75, 0] as [number, number, number],
  fov: 36,
  minDistance: 1.1,
  maxDistance: 6.5,
};
