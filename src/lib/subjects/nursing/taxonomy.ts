import type { TaxonomyNode } from "../types";
import { linkTaxonomyToSubjects } from "../taxonomy";
import { NURSING_SUBJECTS } from "./subjects";

const ROOT: TaxonomyNode = {
  id: "nursing",
  label: "Nursing",
  children: [
    {
      id: "nclex-safe-care",
      label: "Safe & Effective Care",
      children: [
        { id: "moc", label: "Management of Care", subjectId: "management-of-care" },
        { id: "safety", label: "Safety & Infection Control", subjectId: "safety-infection" },
      ],
    },
    {
      id: "nclex-health",
      label: "Health Promotion & Psychosocial",
      children: [
        { id: "hp", label: "Health Promotion", subjectId: "health-promotion" },
        { id: "psy", label: "Psychosocial Integrity", subjectId: "psychosocial" },
      ],
    },
    {
      id: "nclex-physiological",
      label: "Physiological Integrity",
      children: [
        { id: "pharm", label: "Pharmacological Therapies", subjectId: "pharmacology-nursing" },
        { id: "comfort", label: "Basic Care & Comfort", subjectId: "basic-care-comfort" },
        { id: "risk", label: "Reduction of Risk", subjectId: "reduction-risk" },
        { id: "adapt", label: "Physiological Adaptation", subjectId: "physiological-adaptation" },
      ],
    },
    {
      id: "nursing-practice",
      label: "Practice Areas",
      children: [
        { id: "fund", label: "Fundamentals", subjectId: "fundamentals" },
        { id: "ms", label: "Med-Surg", subjectId: "med-surg" },
        { id: "mat", label: "Maternal-Child", subjectId: "maternal-child" },
        { id: "peds", label: "Pediatric Nursing", subjectId: "pediatrics-nursing" },
      ],
    },
  ],
};

export const NURSING_TAXONOMY = linkTaxonomyToSubjects(ROOT, NURSING_SUBJECTS);
