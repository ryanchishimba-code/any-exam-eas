/**
 * Maps Any Exam Easy structure ids → Zygote Body external entity ids (adult male model).
 * @see https://www.zygotebody.com/
 */
export const ZYGOTE_BODY_ORIGIN = "https://www.zygotebody.com";

/** Default camera from a neutral full-body anterior view. */
export const ZYGOTE_DEFAULT_NAV = "-1.63,81.8,160,0,0,0,0";

/** Layer opacity slider state (Zygote hash format). */
export const ZYGOTE_DEFAULT_LAYERS = "0,1,9415";

export const STRUCTURE_TO_ZYGOTE_ENTITY: Record<string, string> = {
  heart: "heart",
  aorta: "abdominal_aorta",
  "carotid-artery": "l_common_carotid_artery",
  lungs: "l_lung",
  trachea: "trachea",
  brain: "brain",
  "spinal-cord": "spinal_cord",
  liver: "liver",
  gallbladder: "gallbladder",
  pancreas: "pancreas",
  stomach: "stomach_body",
  appendix: "appendix",
  kidneys: "l_kidney",
  bladder: "bladder",
  femur: "l_femur",
  humerus: "l_humerus",
  tibia: "l_tibia",
  skull: "skull_cranium",
  sternum: "sternum",
  diaphragm: "diaphragm",
  "biceps-brachii": "l_bicep_brachii_long_head",
  spleen: "spleen",
  thyroid: "thyroid_gland",
  esophagus: "esophagus",
  duodenum: "stomach_duodenum",
  "small-intestine": "small_intestine",
  colon: "large_intestine",
  clavicle: "l_clavicle",
  scapula: "l_scapula",
  prostate: "prostate",
  "adrenal-glands": "l_adrenal_gland",
  "vertebral-column": "spinal_cord",
};

export function getZygoteEntityForStructure(structureId: string): string | undefined {
  return STRUCTURE_TO_ZYGOTE_ENTITY[structureId];
}

export function buildZygoteBodyHash(opts?: {
  nav?: string;
  entityId?: string;
  layers?: string;
}): string {
  const nav = opts?.nav ?? ZYGOTE_DEFAULT_NAV;
  const entity = opts?.entityId ?? "";
  const layers = opts?.layers ?? ZYGOTE_DEFAULT_LAYERS;
  const sel = `p:;h:;s:${entity};c:0;o:0`;
  return `nav=${nav}&sel=${sel}&layers=${layers}`;
}

export function buildZygoteBodyUrl(opts?: Parameters<typeof buildZygoteBodyHash>[0]): string {
  return `${ZYGOTE_BODY_ORIGIN}/#${buildZygoteBodyHash(opts)}`;
}
