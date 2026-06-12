import type { AnatomyLayer } from "../types";
import {
  CARTOON_ARTERY,
  CARTOON_BONE,
  CARTOON_MUSCLE,
  CARTOON_SKIN,
} from "./palette";
import { ORGAN_COLORS } from "./organ-colors";

/** Sidebar / legend swatches for layer toggles. */
export const LAYER_SWATCHES: Record<AnatomyLayer, string> = {
  skin: CARTOON_SKIN,
  bone: CARTOON_BONE,
  muscle: CARTOON_MUSCLE,
  organ: ORGAN_COLORS.heart,
  vascular: CARTOON_ARTERY,
  nerve: ORGAN_COLORS.nerve,
};

/** Organ + skeleton default — skin off; toggle muscle from the layer bar. */
export const DEFAULT_STUDY_LAYERS: AnatomyLayer[] = ["organ", "bone", "vascular", "nerve"];
