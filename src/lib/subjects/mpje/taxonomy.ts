import type { TaxonomyNode } from "../types";
import { linkTaxonomyToSubjects } from "../taxonomy";
import { MPJE_SUBJECTS } from "./subjects";

const ROOT: TaxonomyNode = {
  id: "mpje",
  label: "MPJE",
  children: [
    {
      id: "federal",
      label: "Federal Law",
      children: [
        { id: "fed-law", label: "Federal Pharmacy Law", subjectId: "federal-pharmacy-law" },
        { id: "cs", label: "Controlled Substances", subjectId: "controlled-substances" },
        { id: "hipaa", label: "HIPAA & Privacy", subjectId: "patient-privacy" },
      ],
    },
    {
      id: "state",
      label: "State & Uniform Law",
      children: [
        { id: "umpje", label: "Uniform MPJE", subjectId: "uniform-mpje" },
        { id: "practice-act", label: "State Practice Act", subjectId: "state-practice-act" },
        { id: "dispensing", label: "Dispensing Procedures", subjectId: "dispensing-procedures" },
      ],
    },
    {
      id: "ethics-ops",
      label: "Ethics & Operations",
      children: [
        { id: "ethics", label: "Pharmacy Ethics", subjectId: "pharmacy-ethics" },
        { id: "ops", label: "Operations & Records", subjectId: "pharmacy-operations" },
        { id: "compounding", label: "Compounding Regulations", subjectId: "compounding-regulations" },
      ],
    },
  ],
};

export const MPJE_TAXONOMY = linkTaxonomyToSubjects(ROOT, MPJE_SUBJECTS);
