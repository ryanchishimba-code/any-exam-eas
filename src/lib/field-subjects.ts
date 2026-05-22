import { getFieldMeta } from "./fields";

export type FieldSubject = {
  id: string;
  label: string;
  textbookRefs: string;
  examHints: string;
  keywords: string[];
  focusPlaceholder: string;
  /** Board exam content area label */
  contentArea?: string;
};

/**
 * Subject areas stratified by field — aligned with USMLE, NCLEX-RN, and NAPLEX content outlines.
 */
export const FIELD_SUBJECTS: Record<string, FieldSubject[]> = {
  medicine: [
    {
      id: "anatomy",
      label: "Anatomy",
      contentArea: "Gross anatomy & embryology",
      textbookRefs: "OpenStax Anatomy & Physiology, LibreTexts Anatomy",
      examHints: "structures, relations, innervation, histology, regional anatomy",
      keywords: ["anatomy", "tissue", "nerve", "artery", "muscle", "organ", "embryology"],
      focusPlaceholder: "e.g. Upper limb, cranial nerves",
    },
    {
      id: "physiology",
      label: "Physiology",
      contentArea: "Physiology",
      textbookRefs: "OpenStax A&P, Guyton-style OER physiology",
      examHints: "cardiovascular, renal, respiratory, endocrine, neurophysiology, homeostasis",
      keywords: ["physiology", "cardiac", "renal", "respiratory", "hormone", "membrane"],
      focusPlaceholder: "e.g. Cardiac cycle, acid-base",
    },
    {
      id: "pathology",
      label: "Pathology",
      contentArea: "Pathology",
      textbookRefs: "LibreTexts Pathology, OpenStax",
      examHints: "inflammation, neoplasia, hemodynamics, tissue injury, disease mechanisms",
      keywords: ["pathology", "neoplasia", "inflammation", "necrosis", "infarct"],
      focusPlaceholder: "e.g. Neoplasia, hemodynamic disorders",
    },
    {
      id: "pharmacology",
      label: "Pharmacology",
      contentArea: "Pharmacology",
      textbookRefs: "OpenStax Pharmacology, NIH DailyMed references",
      examHints: "MOA, adverse effects, interactions, contraindications, autonomic drugs",
      keywords: ["pharmacology", "drug", "receptor", "agonist", "antagonist", "toxicity"],
      focusPlaceholder: "e.g. Antihypertensives, antibiotics",
    },
    {
      id: "biochemistry",
      label: "Biochemistry",
      contentArea: "Biochemistry & nutrition",
      textbookRefs: "LibreTexts Medical Biochemistry",
      examHints: "metabolic pathways, enzymes, genetics, nutrition, inborn errors",
      keywords: ["biochemistry", "glycolysis", "urea", "amino acid", "enzyme", "GSD"],
      focusPlaceholder: "e.g. Glycolysis, lipid metabolism",
    },
    {
      id: "microbiology",
      label: "Microbiology & Immunology",
      contentArea: "Microbiology / immunology",
      textbookRefs: "OpenStax Microbiology, LibreTexts Immunology",
      examHints: "bacteria, viruses, fungi, parasites, hypersensitivity, vaccines",
      keywords: ["microbiology", "bacteria", "virus", "immune", "gram", "antibody"],
      focusPlaceholder: "e.g. Gram-positive cocci, HIV",
    },
    {
      id: "cardiology",
      label: "Cardiology",
      contentArea: "Cardiovascular system",
      textbookRefs: "OpenStax, ACC/AHA guideline summaries (OER texts)",
      examHints: "ECG, heart failure, ACS, arrhythmias, valvular disease, hypertension",
      keywords: ["cardiology", "ECG", "MI", "heart failure", "arrhythmia", "murmur"],
      focusPlaceholder: "e.g. Acute coronary syndrome",
    },
    {
      id: "pulmonology",
      label: "Pulmonology",
      contentArea: "Respiratory system",
      textbookRefs: "OpenStax A&P, pulmonary OER modules",
      examHints: "asthma, COPD, pneumonia, V/Q mismatch, PFTs, ABG interpretation",
      keywords: ["pulmonary", "asthma", "COPD", "pneumonia", "ABG", "ventilation"],
      focusPlaceholder: "e.g. COPD exacerbation",
    },
    {
      id: "nephrology",
      label: "Nephrology",
      contentArea: "Renal / urinary",
      textbookRefs: "OpenStax renal physiology chapters",
      examHints: "AKI, CKD, electrolytes, acid-base, glomerular disease, diuretics",
      keywords: ["renal", "kidney", "AKI", "CKD", "electrolyte", "glomerular"],
      focusPlaceholder: "e.g. Metabolic acidosis",
    },
    {
      id: "neurology",
      label: "Neurology",
      contentArea: "Nervous system & special senses",
      textbookRefs: "OpenStax, neuroanatomy OER",
      examHints: "stroke, seizures, headache, neuropathy, localization, CSF",
      keywords: ["neurology", "stroke", "seizure", "cranial nerve", "MS", "meningitis"],
      focusPlaceholder: "e.g. Ischemic stroke",
    },
    {
      id: "internal-medicine",
      label: "Internal Medicine",
      contentArea: "Multisystem / internal medicine",
      textbookRefs: "OpenStax, CDC guidelines",
      examHints: "diabetes, thyroid, GI, hepatology, rheumatology, preventive care",
      keywords: ["internal medicine", "diabetes", "thyroid", "cirrhosis", "IBD"],
      focusPlaceholder: "e.g. Type 2 diabetes management",
    },
    {
      id: "pediatrics",
      label: "Pediatrics",
      contentArea: "Pediatrics",
      textbookRefs: "OpenStax, AAP open resources",
      examHints: "growth, vaccines, neonatal jaundice, congenital disease, child abuse screening",
      keywords: ["pediatrics", "neonatal", "vaccine", "child", "congenital"],
      focusPlaceholder: "e.g. Neonatal jaundice",
    },
    {
      id: "obgyn",
      label: "OB/GYN",
      contentArea: "Reproductive system",
      textbookRefs: "OpenStax, reproductive health OER",
      examHints: "pregnancy, labor, contraception, STIs, cervical cancer screening",
      keywords: ["obstetrics", "gynecology", "pregnancy", "labor", "preeclampsia"],
      focusPlaceholder: "e.g. Preeclampsia",
    },
    {
      id: "psychiatry",
      label: "Psychiatry",
      contentArea: "Behavioral health",
      textbookRefs: "OpenStax Psychology, psychiatry OER",
      examHints: "mood disorders, psychosis, substance use, psychotropics, suicide risk",
      keywords: ["psychiatry", "depression", "schizophrenia", "bipolar", "SSRI"],
      focusPlaceholder: "e.g. Major depressive disorder",
    },
    {
      id: "emergency-medicine",
      label: "Emergency Medicine",
      contentArea: "Acute care",
      textbookRefs: "ATLS principles (OER summaries), toxicology references",
      examHints: "trauma ABCDE, shock, toxicology, ACLS, anaphylaxis",
      keywords: ["emergency", "trauma", "shock", "toxicology", "ACLS", "anaphylaxis"],
      focusPlaceholder: "e.g. Anaphylaxis management",
    },
  ],
  nursing: [
    {
      id: "management-of-care",
      label: "Management of Care",
      contentArea: "NCLEX — Safe & Effective Care (Management of Care)",
      textbookRefs: "Open RN Nursing Leadership, NCLEX test plan",
      examHints: "prioritization, delegation, advocacy, informed consent, continuity of care",
      keywords: ["prioritize", "delegate", "advocacy", "assignment", "management"],
      focusPlaceholder: "e.g. Delegation to LPN",
    },
    {
      id: "safety-infection",
      label: "Safety & Infection Control",
      contentArea: "NCLEX — Safety and Infection Control",
      textbookRefs: "Open RN, CDC infection prevention",
      examHints: "standard precautions, isolation, needle safety, fall prevention, restraints",
      keywords: ["infection", "isolation", "precautions", "safety", "fall", "PPE"],
      focusPlaceholder: "e.g. Contact precautions",
    },
    {
      id: "health-promotion",
      label: "Health Promotion",
      contentArea: "NCLEX — Health Promotion & Maintenance",
      textbookRefs: "Open RN Health Promotion",
      examHints: "screening, vaccines, lifestyle, development, aging, teaching",
      keywords: ["health promotion", "screening", "vaccine", "wellness", "education"],
      focusPlaceholder: "e.g. Adult immunizations",
    },
    {
      id: "psychosocial",
      label: "Psychosocial Integrity",
      contentArea: "NCLEX — Psychosocial Integrity",
      textbookRefs: "Open RN Mental Health Nursing",
      examHints: "therapeutic communication, abuse, grief, cultural competence, coping",
      keywords: ["psychosocial", "mental health", "abuse", "communication", "grief"],
      focusPlaceholder: "e.g. Therapeutic communication",
    },
    {
      id: "pharmacology-nursing",
      label: "Pharmacological Therapies",
      contentArea: "NCLEX — Pharmacological & Parenteral Therapies",
      textbookRefs: "Open RN Pharmacology",
      examHints: "medication rights, insulin, anticoagulants, pain meds, adverse reactions",
      keywords: ["medication", "pharmacology", "insulin", "dose", "adverse", "IV"],
      focusPlaceholder: "e.g. Insulin administration",
    },
    {
      id: "basic-care-comfort",
      label: "Basic Care & Comfort",
      contentArea: "NCLEX — Basic Care and Comfort",
      textbookRefs: "Open RN Fundamentals",
      examHints: "nutrition, elimination, sleep, mobility, pain, assistive devices",
      keywords: ["comfort", "nutrition", "elimination", "mobility", "pain", "hygiene"],
      focusPlaceholder: "e.g. Pressure injury prevention",
    },
    {
      id: "reduction-risk",
      label: "Reduction of Risk Potential",
      contentArea: "NCLEX — Reduction of Risk Potential",
      textbookRefs: "Open RN Medical-Surgical",
      examHints: "diagnostic tests, pre/post-op, complications, vital sign trends, labs",
      keywords: ["risk", "diagnostic", "preoperative", "postoperative", "complication"],
      focusPlaceholder: "e.g. Post-op complications",
    },
    {
      id: "physiological-adaptation",
      label: "Physiological Adaptation",
      contentArea: "NCLEX — Physiological Adaptation",
      textbookRefs: "Open RN Med-Surg, pathophysiology OER",
      examHints: "heart failure, shock, respiratory failure, fluid overload, sepsis",
      keywords: ["heart failure", "shock", "sepsis", "respiratory", "fluid", "adaptation"],
      focusPlaceholder: "e.g. Heart failure exacerbation",
    },
    {
      id: "fundamentals",
      label: "Nursing Fundamentals",
      contentArea: "Foundational nursing practice",
      textbookRefs: "Open RN Nursing Fundamentals",
      examHints: "assessment, vital signs, documentation, ethics, care planning",
      keywords: ["fundamentals", "assessment", "vital signs", "documentation", "ethics"],
      focusPlaceholder: "e.g. Head-to-toe assessment",
    },
    {
      id: "med-surg",
      label: "Medical-Surgical Nursing",
      contentArea: "Adult health",
      textbookRefs: "Open RN Medical-Surgical Nursing",
      examHints: "chronic disease, post-op, diabetes, COPD, renal failure, wound care",
      keywords: ["medical-surgical", "postoperative", "chronic", "wound", "diabetes"],
      focusPlaceholder: "e.g. Post-op abdominal surgery",
    },
    {
      id: "maternal-child",
      label: "Maternal & Child Health",
      contentArea: "Maternal-newborn / women's health",
      textbookRefs: "Open RN Maternal-Newborn",
      examHints: "prenatal care, labor stages, postpartum, newborn assessment, contraception",
      keywords: ["maternal", "newborn", "labor", "pregnancy", "postpartum", "lactation"],
      focusPlaceholder: "e.g. Postpartum hemorrhage",
    },
    {
      id: "pediatrics-nursing",
      label: "Pediatric Nursing",
      contentArea: "Child health",
      textbookRefs: "Open RN Pediatrics",
      examHints: "growth charts, immunizations, dehydration, asthma in children, fever",
      keywords: ["pediatric", "child", "immunization", "growth", "dehydration"],
      focusPlaceholder: "e.g. Febrile infant assessment",
    },
  ],
  pharmacy: [
    {
      id: "pharmacokinetics",
      label: "Pharmacokinetics & Pharmacodynamics",
      contentArea: "NAPLEX — Foundational sciences",
      textbookRefs: "LibreTexts Pharmacology, NAPLEX competency statements",
      examHints: "ADME, half-life, bioavailability, first-pass, protein binding, receptors",
      keywords: ["pharmacokinetics", "ADME", "half-life", "bioavailability", "clearance"],
      focusPlaceholder: "e.g. Half-life and dosing intervals",
    },
    {
      id: "pharmacology",
      label: "General Pharmacology",
      contentArea: "NAPLEX — Drug mechanisms",
      textbookRefs: "OpenStax Pharmacology",
      examHints: "MOA, drug classes, receptor subtypes, adverse effects, interactions",
      keywords: ["pharmacology", "MOA", "receptor", "agonist", "antagonist"],
      focusPlaceholder: "e.g. Beta-adrenergic blockers",
    },
    {
      id: "pharmaceutics",
      label: "Pharmaceutics",
      contentArea: "NAPLEX — Dosage forms",
      textbookRefs: "LibreTexts Pharmaceutics",
      examHints: "tablets, capsules, suspensions, transdermal, stability, excipients",
      keywords: ["pharmaceutics", "dosage form", "tablet", "bioavailability", "excipient"],
      focusPlaceholder: "e.g. Extended-release formulations",
    },
    {
      id: "compounding-calculations",
      label: "Pharmacy Calculations",
      contentArea: "NAPLEX — Calculations",
      textbookRefs: "NAPLEX calculation competencies, alligation/alligation alternate",
      examHints: "dosing, concentrations, IV flow, isotonicity, pediatric weight-based dosing",
      keywords: ["calculation", "dose", "concentration", "alligation", "IV", "mg/kg"],
      focusPlaceholder: "e.g. IV infusion rate",
    },
    {
      id: "cardiovascular-rx",
      label: "Cardiovascular Pharmacotherapy",
      contentArea: "NAPLEX — Cardiovascular",
      textbookRefs: "OpenStax, ACC guideline summaries",
      examHints: "antihypertensives, heart failure, anticoagulants, statins, ACS therapy",
      keywords: ["cardiovascular", "hypertension", "statin", "warfarin", "ACE inhibitor"],
      focusPlaceholder: "e.g. Heart failure GDMT",
    },
    {
      id: "infectious-disease-rx",
      label: "Infectious Disease Therapy",
      contentArea: "NAPLEX — Anti-infectives",
      textbookRefs: "Sanford Guide open summaries, CDC antibiotic guidance",
      examHints: "antibiotic spectra, resistance, prophylaxis, HIV ART, vaccines",
      keywords: ["antibiotic", "antimicrobial", "resistance", "MRSA", "HIV"],
      focusPlaceholder: "e.g. Community-acquired pneumonia",
    },
    {
      id: "endocrine-rx",
      label: "Endocrine Pharmacotherapy",
      contentArea: "NAPLEX — Endocrine",
      textbookRefs: "OpenStax diabetes chapters, ADA open summaries",
      examHints: "insulin, oral hypoglycemics, thyroid, corticosteroids, osteoporosis",
      keywords: ["diabetes", "insulin", "metformin", "thyroid", "corticosteroid"],
      focusPlaceholder: "e.g. Insulin types",
    },
    {
      id: "cns-rx",
      label: "CNS & Psychiatric Medications",
      contentArea: "NAPLEX — CNS",
      textbookRefs: "OpenStax psychopharmacology modules",
      examHints: "antidepressants, antipsychotics, antiepileptics, opioids, benzodiazepines",
      keywords: ["CNS", "SSRI", "antipsychotic", "seizure", "opioid", "benzodiazepine"],
      focusPlaceholder: "e.g. SSRI selection",
    },
    {
      id: "oncology-rx",
      label: "Oncology Pharmacotherapy",
      contentArea: "NAPLEX — Oncology",
      textbookRefs: "NCI open references, chemotherapy basics OER",
      examHints: "chemotherapy classes, emesis prophylaxis, neutropenia, supportive care",
      keywords: ["oncology", "chemotherapy", "neutropenia", "antiemetic", "cancer"],
      focusPlaceholder: "e.g. Chemotherapy-induced nausea",
    },
    {
      id: "otc-self-care",
      label: "OTC & Self-Care",
      contentArea: "NAPLEX — Nonprescription",
      textbookRefs: "OTC labeling standards, FDA open resources",
      examHints: "analgesics, cough/cold, allergies, GI OTC, pregnancy/lactation counseling",
      keywords: ["OTC", "self-care", "acetaminophen", "ibuprofen", "antihistamine"],
      focusPlaceholder: "e.g. Cold symptom management",
    },
    {
      id: "patient-counseling",
      label: "Patient Counseling",
      contentArea: "NAPLEX — Communication",
      textbookRefs: "ASHP counseling guidelines (open summaries)",
      examHints: "medication adherence, literacy, REMS, inhaler technique, monitoring",
      keywords: ["counseling", "adherence", "patient", "education", "monitoring"],
      focusPlaceholder: "e.g. Inhaler technique teaching",
    },
    {
      id: "pharmacy-law",
      label: "Pharmacy Law & Ethics",
      contentArea: "NAPLEX — Professional practice",
      textbookRefs: "State practice act summaries, DEA scheduling basics",
      examHints: "controlled substances, dispensing, confidentiality, errors, MTM",
      keywords: ["law", "ethics", "controlled substance", "DEA", "dispensing", "HIPAA"],
      focusPlaceholder: "e.g. Controlled substance schedules",
    },
  ],
};

export function getSubjectsForField(fieldLabel: string): FieldSubject[] {
  const meta = getFieldMeta(fieldLabel);
  const id = meta?.id ?? fieldLabel.toLowerCase().replace(/\s+/g, "-");
  return FIELD_SUBJECTS[id] ?? [];
}

export function getFieldSubject(
  fieldLabel: string,
  subjectId: string
): FieldSubject | undefined {
  return getSubjectsForField(fieldLabel).find(
    (s) => s.id === subjectId || s.label.toLowerCase() === subjectId.toLowerCase()
  );
}

export function buildScopedTopic(
  fieldLabel: string,
  subjectId: string,
  specificFocus?: string
): string {
  const subject = getFieldSubject(fieldLabel, subjectId);
  const base = subject?.label ?? subjectId;
  const focus = specificFocus?.trim();
  return focus ? `${base} — ${focus}` : base;
}

export function subjectMatchesQuestion(
  subject: FieldSubject,
  questionText: string,
  tags: string[] = []
): boolean {
  const haystack = `${questionText} ${tags.join(" ")}`.toLowerCase();
  return subject.keywords.some((kw) => haystack.includes(kw.toLowerCase()));
}
