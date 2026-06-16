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
    structureIds: ["lungs", "brain"],
    diseaseIds: ["community-pneumonia", "ischemic-stroke-brain"],
  },
  "heart-failure-gdmt": {
    structureIds: ["heart"],
    diseaseIds: ["heart-failure-hfref"],
  },
  "anticoagulation-reversal": {
    structureIds: ["heart", "brain"],
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
};

export function getReviewModuleAnatomy(moduleSlug: string): ReviewModuleAnatomyLink | undefined {
  return REVIEW_MODULE_ANATOMY[moduleSlug];
}
