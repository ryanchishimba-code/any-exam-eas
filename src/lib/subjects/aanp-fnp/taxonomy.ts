import type { TaxonomyNode } from "../types";
import { linkTaxonomyToSubjects } from "../taxonomy";
import { AANP_FNP_SUBJECTS } from "./subjects";

const ROOT: TaxonomyNode = {
  id: "aanp-fnp",
  label: "AANP FNP",
  children: [
    {
      id: "aanp-domains",
      label: "AANP Blueprint Domains",
      children: [
        { id: "assess", label: "Assess (32%)", subjectId: "assess" },
        { id: "diagnose", label: "Diagnose (26.5%)", subjectId: "diagnose" },
        { id: "plan", label: "Plan (26.5%)", subjectId: "plan" },
        { id: "evaluate", label: "Evaluate (15%)", subjectId: "evaluate" },
      ],
    },
    {
      id: "aanp-systems",
      label: "Clinical Systems",
      children: [
        { id: "cv", label: "Cardiovascular", subjectId: "cardiovascular" },
        { id: "pulm", label: "Pulmonary", subjectId: "pulmonary" },
        { id: "endo", label: "Endocrine", subjectId: "endocrine" },
        { id: "wh", label: "Women's Health", subjectId: "womens-health" },
        { id: "peds", label: "Pediatrics", subjectId: "pediatrics" },
        { id: "geri", label: "Geriatrics", subjectId: "geriatrics" },
        { id: "psych", label: "Psychiatry", subjectId: "psychiatry-behavioral" },
        { id: "id", label: "Infectious Disease", subjectId: "infectious-disease" },
      ],
    },
  ],
};

export const AANP_FNP_TAXONOMY = linkTaxonomyToSubjects(ROOT, AANP_FNP_SUBJECTS);
