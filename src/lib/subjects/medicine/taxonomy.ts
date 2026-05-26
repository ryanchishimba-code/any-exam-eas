import type { TaxonomyNode } from "../types";
import { linkTaxonomyToSubjects } from "../taxonomy";
import { MEDICINE_SUBJECTS } from "./subjects";

const MEDICINE_TAXONOMY_ROOT: TaxonomyNode = {
  id: "medicine",
  label: "Medicine",
  children: [
    {
      id: "basic-sciences",
      label: "Basic Sciences",
      children: [
        { id: "anatomy-node", label: "Anatomy", subjectId: "anatomy" },
        { id: "physiology-node", label: "Physiology", subjectId: "physiology" },
        { id: "pathology-node", label: "Pathology", subjectId: "pathology" },
        { id: "pharmacology-node", label: "Pharmacology", subjectId: "pharmacology" },
        { id: "biochemistry-node", label: "Biochemistry", subjectId: "biochemistry" },
        { id: "microbiology-node", label: "Microbiology", subjectId: "microbiology" },
      ],
    },
    {
      id: "clinical-sciences",
      label: "Clinical Sciences",
      children: [
        { id: "cardiology-node", label: "Cardiology", subjectId: "cardiology" },
        { id: "pulmonology-node", label: "Pulmonology", subjectId: "pulmonology" },
        { id: "nephrology-node", label: "Nephrology", subjectId: "nephrology" },
        { id: "neurology-node", label: "Neurology", subjectId: "neurology" },
        { id: "internal-node", label: "Internal Medicine", subjectId: "internal-medicine" },
        { id: "pediatrics-node", label: "Pediatrics", subjectId: "pediatrics" },
        { id: "obgyn-node", label: "OB/GYN", subjectId: "obgyn" },
        { id: "psychiatry-node", label: "Psychiatry", subjectId: "psychiatry" },
        { id: "emergency-node", label: "Emergency Medicine", subjectId: "emergency-medicine" },
      ],
    },
  ],
};

export const MEDICINE_TAXONOMY = linkTaxonomyToSubjects(
  MEDICINE_TAXONOMY_ROOT,
  MEDICINE_SUBJECTS
);
