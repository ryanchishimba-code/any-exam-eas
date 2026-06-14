import { CARDIAC_PROCEDURES } from "./curated-cardiac";
import { EXTENDED_PROCEDURES } from "./curated-extended";
import { GI_PROCEDURES } from "./curated-gi";
import { NEURO_MSK_PROCEDURES } from "./curated-neuro-msk";
import { THORACIC_GU_PROCEDURES } from "./curated-thoracic-gu";

export const ANATOMY_PROCEDURES = [
  ...CARDIAC_PROCEDURES,
  ...GI_PROCEDURES,
  ...THORACIC_GU_PROCEDURES,
  ...NEURO_MSK_PROCEDURES,
  ...EXTENDED_PROCEDURES,
];
