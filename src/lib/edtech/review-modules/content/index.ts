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

import { ENDOCRINE_EMERGENCIES_MODULE } from "./endocrine-emergencies-usmle";
import { RENAL_ELECTROLYTES_MODULE } from "./renal-electrolytes-usmle";
import { STROKE_NEURO_MODULE } from "./stroke-neuro-usmle";
import { PATHOLOGY_NEOPLASIA_STEP1_MODULE } from "./pathology-neoplasia-step1";
import { PHARMACOLOGY_MOA_STEP1_MODULE } from "./pharmacology-moa-step1";
import {
  BIOSTATISTICS_USMLE_STEP3_MODULE,
  CCS_CASE_MANAGEMENT_USMLE_MODULE,
  MEDICAL_ETHICS_USMLE_STEP3_MODULE,
} from "./biostatistics-ethics-ccs-step3";

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
import { NPTE_VESTIBULAR_BALANCE_MODULE } from "./npte-vestibular-balance";
import { NPTE_PEDS_GERIATRICS_MODULE } from "./npte-peds-geriatrics-rehab";
import { NPTE_SAFETY_RED_FLAGS_MODULE } from "./npte-safety-red-flags";
import { AANP_FNP_SYSTEM_REVIEW_MODULES } from "./aanp-fnp-system-modules";

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
  NPTE_VESTIBULAR_BALANCE_MODULE,
  NPTE_PEDS_GERIATRICS_MODULE,
  NPTE_SAFETY_RED_FLAGS_MODULE,
  ENDOCRINE_EMERGENCIES_MODULE,
  RENAL_ELECTROLYTES_MODULE,
  STROKE_NEURO_MODULE,
  PATHOLOGY_NEOPLASIA_STEP1_MODULE,
  PHARMACOLOGY_MOA_STEP1_MODULE,
  BIOSTATISTICS_USMLE_STEP3_MODULE,
  CCS_CASE_MANAGEMENT_USMLE_MODULE,
  MEDICAL_ETHICS_USMLE_STEP3_MODULE,
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
  "npte-vestibular-balance": NPTE_VESTIBULAR_BALANCE_MODULE,
  "npte-peds-geriatrics": NPTE_PEDS_GERIATRICS_MODULE,
  "npte-safety-red-flags": NPTE_SAFETY_RED_FLAGS_MODULE,
  "endocrine-dm": ENDOCRINE_EMERGENCIES_MODULE,
  "renal-electrolytes": RENAL_ELECTROLYTES_MODULE,
  "neurology-stroke": STROKE_NEURO_MODULE,
  "pathology-neoplasia": PATHOLOGY_NEOPLASIA_STEP1_MODULE,
  "pharmacology-moa": PHARMACOLOGY_MOA_STEP1_MODULE,
  "biostatistics-epidemiology": BIOSTATISTICS_USMLE_STEP3_MODULE,
  "medical-ethics-legal": MEDICAL_ETHICS_USMLE_STEP3_MODULE,
  "ccs-case-management": CCS_CASE_MANAGEMENT_USMLE_MODULE,
  delegation: DELEGATION_MODULE,
  ...AANP_FNP_SYSTEM_REVIEW_MODULES,
};
