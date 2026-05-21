/**
 * Medicine subject areas — user picks one, then optional specific focus.
 */
export type MedicineSubjectArea = {
  id: string;
  label: string;
  topicPlaceholder: string;
  examHints: string;
};

export const MEDICINE_SUBJECT_AREAS: MedicineSubjectArea[] = [
  {
    id: "anatomy",
    label: "Anatomy",
    topicPlaceholder: "e.g. Brachial plexus, thoracic viscera",
    examHints: "structures, relations, innervation, clinical correlations",
  },
  {
    id: "physiology",
    label: "Physiology",
    topicPlaceholder: "e.g. Cardiac cycle, renal clearance",
    examHints: "mechanisms, regulation, curves, integrative systems",
  },
  {
    id: "biochemistry",
    label: "Biochemistry",
    topicPlaceholder: "e.g. Glycolysis, amino acid metabolism",
    examHints: "pathways, enzymes, deficiencies, lab values",
  },
  {
    id: "pathology",
    label: "Pathology",
    topicPlaceholder: "e.g. Neoplasia, inflammation patterns",
    examHints: "histology, disease mechanisms, classic presentations",
  },
  {
    id: "pharmacology",
    label: "Pharmacology",
    topicPlaceholder: "e.g. Beta-blockers, antibiotics",
    examHints: "MOA, side effects, interactions, contraindications",
  },
  {
    id: "microbiology",
    label: "Microbiology & Immunology",
    topicPlaceholder: "e.g. Gram-negative rods, hypersensitivity",
    examHints: "organisms, virulence, vaccines, immune responses",
  },
  {
    id: "behavioral",
    label: "Behavioral Science & Psychiatry",
    topicPlaceholder: "e.g. Mood disorders, defense mechanisms",
    examHints: "DSM concepts, ethics, biostatistics tie-ins",
  },
  {
    id: "internal-medicine",
    label: "Internal Medicine",
    topicPlaceholder: "e.g. Heart failure, diabetes management",
    examHints: "diagnosis, workup, first-line treatment, complications",
  },
  {
    id: "surgery",
    label: "Surgery",
    topicPlaceholder: "e.g. Acute abdomen, hernias",
    examHints: "indications, complications, anatomy for surgeons",
  },
  {
    id: "pediatrics",
    label: "Pediatrics",
    topicPlaceholder: "e.g. Neonatal jaundice, growth milestones",
    examHints: "age-specific norms, congenital conditions, vaccines",
  },
  {
    id: "obgyn",
    label: "Obstetrics & Gynecology",
    topicPlaceholder: "e.g. Prenatal care, cervical cancer screening",
    examHints: "pregnancy complications, STIs, reproductive endocrinology",
  },
  {
    id: "neurology",
    label: "Neurology",
    topicPlaceholder: "e.g. Stroke localization, seizures",
    examHints: "lesion localization, CSF, neuro exam findings",
  },
  {
    id: "cardiology",
    label: "Cardiology",
    topicPlaceholder: "e.g. Arrhythmias, valvular disease",
    examHints: "ECG, hemodynamics, acute coronary syndromes",
  },
  {
    id: "emergency",
    label: "Emergency Medicine",
    topicPlaceholder: "e.g. Trauma primary survey, toxicology",
    examHints: "stabilization, algorithms, can't-miss diagnoses",
  },
  {
    id: "radiology",
    label: "Radiology",
    topicPlaceholder: "e.g. Chest X-ray findings, CT basics",
    examHints: "imaging signs, modality choice, classic appearances",
  },
  {
    id: "clinical-skills",
    label: "Clinical Skills & Ethics",
    topicPlaceholder: "e.g. Informed consent, patient safety",
    examHints: "communication, ethics, quality improvement",
  },
];

export const QUESTION_COUNT_OPTIONS = [10, 15, 20, 25, 30, 35, 40, 45, 50] as const;

export type QuestionCount = (typeof QUESTION_COUNT_OPTIONS)[number];

export function isValidQuestionCount(n: number): n is QuestionCount {
  return (QUESTION_COUNT_OPTIONS as readonly number[]).includes(n);
}

export function getMedicineSubject(idOrLabel: string): MedicineSubjectArea | undefined {
  return MEDICINE_SUBJECT_AREAS.find(
    (s) =>
      s.id === idOrLabel ||
      s.label.toLowerCase() === idOrLabel.toLowerCase()
  );
}

/** Full topic string sent to research + AI */
export function buildMedicineTopic(
  subjectAreaId: string,
  specificFocus?: string
): string {
  const subject = getMedicineSubject(subjectAreaId);
  const base = subject?.label ?? subjectAreaId;
  const focus = specificFocus?.trim();
  return focus ? `${base} — ${focus}` : base;
}
