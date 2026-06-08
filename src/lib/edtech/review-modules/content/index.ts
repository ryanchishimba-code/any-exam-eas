import type { ReviewModuleContent } from "../types";

import { ACS_MODULE } from "./acute-coronary-syndrome";
import { ANTICOAGULATION_MODULE } from "./anticoagulation-reversal";
import { CONTROLLED_SUBSTANCES_MODULE } from "./controlled-substances";
import { HEART_FAILURE_MODULE } from "./heart-failure-gdmt";
import { SEPSIS_MODULE } from "./sepsis-shock";

import { DELEGATION_MODULE } from "./nclex-delegation-scope";

export {
  ACS_MODULE,
  ANTICOAGULATION_MODULE,
  CONTROLLED_SUBSTANCES_MODULE,
  DELEGATION_MODULE,
  HEART_FAILURE_MODULE,
  SEPSIS_MODULE,
};

export const REVIEW_MODULE_CONTENT_BY_SLUG: Record<string, ReviewModuleContent> = {
  "heart-failure-gdmt": HEART_FAILURE_MODULE,
  "anticoagulation-reversal": ANTICOAGULATION_MODULE,
  "sepsis-shock": SEPSIS_MODULE,
  "acute-coronary-syndrome": ACS_MODULE,
  "controlled-substances": CONTROLLED_SUBSTANCES_MODULE,
  delegation: DELEGATION_MODULE,
};
