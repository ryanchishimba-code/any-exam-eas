import type { ReviewModuleContent } from "../types";

import { ACS_MODULE } from "./acute-coronary-syndrome";
import { ANTIBIOTICS_STEWARDSHIP_MODULE } from "./antibiotics-stewardship";
import { ANTICOAGULATION_MODULE } from "./anticoagulation-reversal";
import { CONTROLLED_SUBSTANCES_MODULE } from "./controlled-substances";
import { CONTROLLED_SUBSTANCES_PANCE_MODULE } from "./controlled-substances-pance";
import { COPD_EXACERBATION_MODULE } from "./copd-exacerbation";
import { DIABETES_PHARMACOTHERAPY_MODULE } from "./diabetes-pharmacotherapy";
import { HEART_FAILURE_MODULE } from "./heart-failure-gdmt";
import { INFECTIOUS_DISEASE_USMLE_MODULE } from "./infectious-disease-usmle";
import { INFECTION_CONTROL_NCLEX_MODULE } from "./infection-control-nclex";
import { SEPSIS_MODULE } from "./sepsis-shock";

import { DELEGATION_MODULE } from "./nclex-delegation-scope";
import { AANP_ASSESS_MODULE } from "./aanp-assess-domain";
import { AANP_DIAGNOSE_MODULE } from "./aanp-diagnose-domain";
import { AANP_PLAN_MODULE } from "./aanp-plan-domain";
import { AANP_EVALUATE_MODULE } from "./aanp-evaluate-domain";
import { AANP_GERIATRICS_MODULE } from "./aanp-geriatrics-high-yield";
import { AANP_PEDIATRICS_MODULE } from "./aanp-pediatrics-high-yield";
import { MSK_REHABILITATION_MODULE } from "./msk-rehabilitation";
import { STROKE_REHABILITATION_MODULE } from "./stroke-rehabilitation";
import { CARDIOPULMONARY_REHAB_MODULE } from "./cardiopulmonary-rehab";
import { THERAPEUTIC_MODALITIES_NPTE_MODULE } from "./therapeutic-modalities-npte";

export {
  ACS_MODULE,
  ANTIBIOTICS_STEWARDSHIP_MODULE,
  ANTICOAGULATION_MODULE,
  CONTROLLED_SUBSTANCES_MODULE,
  CONTROLLED_SUBSTANCES_PANCE_MODULE,
  COPD_EXACERBATION_MODULE,
  AANP_ASSESS_MODULE,
  AANP_DIAGNOSE_MODULE,
  AANP_PLAN_MODULE,
  AANP_EVALUATE_MODULE,
  AANP_GERIATRICS_MODULE,
  AANP_PEDIATRICS_MODULE,
  MSK_REHABILITATION_MODULE,
  STROKE_REHABILITATION_MODULE,
  CARDIOPULMONARY_REHAB_MODULE,
  THERAPEUTIC_MODALITIES_NPTE_MODULE,
  DELEGATION_MODULE,
  DIABETES_PHARMACOTHERAPY_MODULE,
  HEART_FAILURE_MODULE,
  INFECTION_CONTROL_NCLEX_MODULE,
  INFECTIOUS_DISEASE_USMLE_MODULE,
  SEPSIS_MODULE,
};

export const REVIEW_MODULE_CONTENT_BY_SLUG: Record<string, ReviewModuleContent> = {
  "heart-failure-gdmt": HEART_FAILURE_MODULE,
  "antibiotics-stewardship": ANTIBIOTICS_STEWARDSHIP_MODULE,
  "anticoagulation-reversal": ANTICOAGULATION_MODULE,
  "insulin-diabetes-management": DIABETES_PHARMACOTHERAPY_MODULE,
  "infection-control": INFECTION_CONTROL_NCLEX_MODULE,
  "sepsis-shock": SEPSIS_MODULE,
  "acute-coronary-syndrome": ACS_MODULE,
  "infectious-disease": INFECTIOUS_DISEASE_USMLE_MODULE,
  "controlled-substances": CONTROLLED_SUBSTANCES_MODULE,
  "controlled-substances-pance": CONTROLLED_SUBSTANCES_PANCE_MODULE,
  "copd-exacerbation": COPD_EXACERBATION_MODULE,
  "aanp-assess-domain": AANP_ASSESS_MODULE,
  "aanp-diagnose-domain": AANP_DIAGNOSE_MODULE,
  "aanp-plan-domain": AANP_PLAN_MODULE,
  "aanp-evaluate-domain": AANP_EVALUATE_MODULE,
  "aanp-geriatrics-high-yield": AANP_GERIATRICS_MODULE,
  "aanp-pediatrics-high-yield": AANP_PEDIATRICS_MODULE,
  "msk-rehabilitation": MSK_REHABILITATION_MODULE,
  "stroke-rehabilitation": STROKE_REHABILITATION_MODULE,
  "cardiopulmonary-rehab": CARDIOPULMONARY_REHAB_MODULE,
  "therapeutic-modalities": THERAPEUTIC_MODALITIES_NPTE_MODULE,
  delegation: DELEGATION_MODULE,
};
