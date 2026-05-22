/**
 * Health sciences fields — Medicine, Nursing, Pharmacy only.
 * Each maps to OER domains and board-exam focus areas (USMLE, NCLEX, NAPLEX).
 */
export type StudyField = {
  id: string;
  label: string;
  category: "professional";
  oerDomains: string[];
  examFocus: string;
  topicPlaceholder: string;
  boardExam: string;
};

export const STUDY_FIELDS: StudyField[] = [
  {
    id: "medicine",
    label: "Medicine",
    category: "professional",
    boardExam: "USMLE / board-style clinical exams",
    oerDomains: [
      "openstax.org",
      "med.libretexts.org",
      "nih.gov",
      "ncbi.nlm.nih.gov",
      "cdc.gov",
    ],
    examFocus:
      "clinical vignettes, pathophysiology, diagnostics, pharmacology, anatomy, physiology, pathology, microbiology",
    topicPlaceholder: "Select a subject area below (e.g. Cardiology, Pharmacology)",
  },
  {
    id: "nursing",
    label: "Nursing",
    category: "professional",
    boardExam: "NCLEX-RN",
    oerDomains: ["openstax.org", "openrn.org", "med.libretexts.org", "nih.gov", "cdc.gov"],
    examFocus:
      "NCLEX prioritization, safety, infection control, pharmacology, med-surg, maternal-child, psychosocial care",
    topicPlaceholder: "Select NCLEX category (e.g. Pharmacological Therapies)",
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    category: "professional",
    boardExam: "NAPLEX",
    oerDomains: [
      "chem.libretexts.org",
      "med.libretexts.org",
      "nih.gov",
      "ncbi.nlm.nih.gov",
      "fda.gov",
    ],
    examFocus:
      "pharmacokinetics, pharmacodynamics, drug interactions, dosing, compounding, patient counseling, therapeutic classes",
    topicPlaceholder: "Select NAPLEX area (e.g. Cardiovascular Pharmacotherapy)",
  },
];

export const FIELD_LABELS = STUDY_FIELDS.map((f) => f.label);

export function getFieldMeta(label: string): StudyField | undefined {
  return STUDY_FIELDS.find(
    (f) => f.label.toLowerCase() === label.toLowerCase()
  );
}
