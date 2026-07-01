/**
 * Explicit anatomy + clinical-disease links for flagship review modules.
 * Single source of truth for deep-dive ↔ 3D structure integration.
 */
export type ReviewModuleAnatomyLink = {
  structureIds: string[];
  /** Curated disease ids from anatomy/clinical-links for contextual pearls. */
  diseaseIds?: string[];
};

export const REVIEW_MODULE_ANATOMY: Record<string, ReviewModuleAnatomyLink> = {
  "acute-coronary-syndrome": {
    structureIds: ["heart", "aorta"],
    diseaseIds: ["stemi-acs"],
  },
  "sepsis-shock": {
    structureIds: ["heart", "lungs", "kidneys"],
    diseaseIds: ["heart-failure-hfref"],
  },
  "infectious-disease": {
    structureIds: ["lungs", "spinal-cord"],
    diseaseIds: ["community-pneumonia", "ischemic-stroke-brain"],
  },
  "heart-failure-gdmt": {
    structureIds: ["heart"],
    diseaseIds: ["heart-failure-hfref"],
  },
  "anticoagulation-reversal": {
    structureIds: ["heart", "spinal-cord"],
    diseaseIds: ["atrial-fibrillation-stroke"],
  },
  "insulin-diabetes-management": {
    structureIds: ["pancreas"],
    diseaseIds: ["type-2-diabetes", "type-1-diabetes"],
  },
  "antibiotics-stewardship": {
    structureIds: ["lungs", "liver"],
    diseaseIds: ["community-pneumonia"],
  },
  "infection-control": {
    structureIds: ["lungs", "trachea"],
  },
  delegation: {
    structureIds: ["heart", "lungs"],
  },
  "endocrine-dm": {
    structureIds: ["pancreas", "adrenal-glands", "thyroid"],
    diseaseIds: ["type-2-diabetes", "type-1-diabetes"],
  },
  "renal-electrolytes": {
    structureIds: ["kidneys", "adrenal-glands"],
  },
  "neurology-stroke": {
    structureIds: ["spinal-cord", "carotid-artery"],
    diseaseIds: ["ischemic-stroke-brain"],
  },
  "pathology-neoplasia": {
    structureIds: ["lungs", "liver", "spleen"],
  },
  "pharmacology-moa": {
    structureIds: ["heart", "spinal-cord", "adrenal-glands"],
  },
  "copd-exacerbation": {
    structureIds: ["lungs", "trachea", "diaphragm"],
  },
  "controlled-substances": {
    structureIds: ["spinal-cord"],
  },
  "controlled-substances-pance": {
    structureIds: ["spinal-cord"],
  },
  "ccs-case-management": {
    structureIds: ["heart", "lungs", "kidneys"],
  },
  "aanp-assess-domain": {
    structureIds: ["heart", "lungs", "stomach"],
  },
  "aanp-diagnose-domain": {
    structureIds: ["heart", "spinal-cord", "lungs"],
  },
  "aanp-plan-domain": {
    structureIds: ["heart", "pancreas", "lungs"],
  },
  "aanp-evaluate-domain": {
    structureIds: ["heart", "kidneys", "lungs"],
  },
  "aanp-geriatrics-high-yield": {
    structureIds: ["spinal-cord", "heart", "kidneys"],
  },
  "aanp-pediatrics-high-yield": {
    structureIds: ["heart", "lungs", "spinal-cord"],
  },
  "msk-rehabilitation": {
    structureIds: ["femur", "humerus", "scapula", "vertebral-column"],
  },
  "stroke-rehabilitation": {
    structureIds: ["spinal-cord", "carotid-artery"],
  },
  "cardiopulmonary-rehab": {
    structureIds: ["heart", "lungs", "diaphragm"],
  },
  "therapeutic-modalities": {
    structureIds: ["femur", "humerus", "vertebral-column"],
  },
};

export function getReviewModuleAnatomy(moduleSlug: string): ReviewModuleAnatomyLink | undefined {
  return REVIEW_MODULE_ANATOMY[moduleSlug];
}
