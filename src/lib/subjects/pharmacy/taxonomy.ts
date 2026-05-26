import type { TaxonomyNode } from "../types";
import { linkTaxonomyToSubjects } from "../taxonomy";
import { PHARMACY_SUBJECTS } from "./subjects";

const ROOT: TaxonomyNode = {
  id: "pharmacy",
  label: "Pharmacy",
  children: [
    {
      id: "foundations",
      label: "Foundational Sciences",
      children: [
        { id: "pk", label: "PK/PD", subjectId: "pharmacokinetics" },
        { id: "pharm", label: "Pharmacology", subjectId: "pharmacology" },
        { id: "pharmaceutics", label: "Pharmaceutics", subjectId: "pharmaceutics" },
        { id: "calc", label: "Calculations", subjectId: "compounding-calculations" },
      ],
    },
    {
      id: "therapeutics",
      label: "Therapeutics",
      children: [
        { id: "cv", label: "Cardiovascular", subjectId: "cardiovascular-rx" },
        { id: "id", label: "Infectious Disease", subjectId: "infectious-disease-rx" },
        { id: "endo", label: "Endocrine", subjectId: "endocrine-rx" },
        { id: "cns", label: "CNS", subjectId: "cns-rx" },
        { id: "onc", label: "Oncology", subjectId: "oncology-rx" },
      ],
    },
    {
      id: "practice",
      label: "Practice",
      children: [
        { id: "otc", label: "OTC & Self-Care", subjectId: "otc-self-care" },
        { id: "counsel", label: "Counseling", subjectId: "patient-counseling" },
        { id: "law", label: "Law & Ethics", subjectId: "pharmacy-law" },
      ],
    },
  ],
};

export const PHARMACY_TAXONOMY = linkTaxonomyToSubjects(ROOT, PHARMACY_SUBJECTS);
