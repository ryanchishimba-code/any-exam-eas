/**
 * Exam blueprint weights aligned to published board exam test plans.
 * Used to steer question mix toward high-yield, exam-realistic coverage.
 */

import { normalizeFieldId } from "@/lib/subjects/field-ids";

export type BlueprintCategory = {
  id: string;
  label: string;
  /** Share of a full exam (0–1); categories within a blueprint sum to 1. */
  weight: number;
  subjectIds?: string[];
  highYieldTopics?: string[];
};

export type NgnFormatMix = {
  format: string;
  weight: number;
  label: string;
};

export type ExamBlueprint = {
  fieldId: string;
  examName: string;
  sourceNote: string;
  categories: BlueprintCategory[];
  ngnMix?: NgnFormatMix[];
  /** Minimum share of items that should use a clinical vignette (0–1). */
  vignetteMinRatio: number;
};

/** NCSBN NCLEX-RN Client Needs (approximate item distribution). */
const NCLEX_RN: ExamBlueprint = {
  fieldId: "nursing",
  examName: "NCLEX",
  sourceNote: "NCSBN NCLEX-RN Test Plan + Clinical Judgment Measurement Model (CJMM)",
  vignetteMinRatio: 0.65,
  ngnMix: [
    { format: "unfolding_case", weight: 0.1, label: "Unfolding clinical case" },
    { format: "bow_tie", weight: 0.07, label: "Bow-tie (actions / conditions to monitor)" },
    { format: "select_all", weight: 0.06, label: "Select all that apply (SATA)" },
    { format: "matrix", weight: 0.04, label: "Matrix / grid" },
    { format: "drag_drop", weight: 0.03, label: "Drag & drop / ordered priority" },
  ],
  categories: [
    {
      id: "management-of-care",
      label: "Management of Care",
      weight: 0.2,
      subjectIds: ["management-of-care"],
      highYieldTopics: ["delegation", "prioritization", "advocacy", "informed consent"],
    },
    {
      id: "safety-infection",
      label: "Safety & Infection Control",
      weight: 0.12,
      subjectIds: ["safety-infection"],
      highYieldTopics: ["standard precautions", "transmission-based precautions", "restraints", "falls"],
    },
    {
      id: "health-promotion",
      label: "Health Promotion",
      weight: 0.09,
      subjectIds: ["health-promotion"],
      highYieldTopics: ["screening", "immunizations", "lifestyle teaching"],
    },
    {
      id: "psychosocial",
      label: "Psychosocial Integrity",
      weight: 0.09,
      subjectIds: ["psychosocial"],
      highYieldTopics: ["therapeutic communication", "crisis", "grief", "abuse reporting"],
    },
    {
      id: "basic-care",
      label: "Basic Care & Comfort",
      weight: 0.09,
      subjectIds: ["basic-care-comfort"],
      highYieldTopics: ["nutrition", "elimination", "sleep", "mobility"],
    },
    {
      id: "pharmacology",
      label: "Pharmacological Therapies",
      weight: 0.15,
      subjectIds: ["pharmacology-nursing"],
      highYieldTopics: ["medication rights", "anticoagulants", "insulin", "opioids", "IV therapy"],
    },
    {
      id: "risk-reduction",
      label: "Reduction of Risk Potential",
      weight: 0.12,
      subjectIds: ["reduction-risk"],
      highYieldTopics: ["diagnostic tests", "post-procedure monitoring", "complications"],
    },
    {
      id: "physiological-adaptation",
      label: "Physiological Adaptation",
      weight: 0.14,
      subjectIds: ["physiological-adaptation", "med-surg"],
      highYieldTopics: ["shock", "respiratory failure", "electrolytes", "cardiac emergencies"],
    },
  ],
};

/** USMLE Step 1 — basic sciences. */
const USMLE_STEP_1: ExamBlueprint = {
  fieldId: "usmle-step-1",
  examName: "USMLE Step 1",
  sourceNote: "USMLE Content Outline — Step 1 basic sciences",
  vignetteMinRatio: 0.55,
  categories: [
    {
      id: "anatomy",
      label: "Anatomy",
      weight: 0.18,
      subjectIds: ["anatomy"],
      highYieldTopics: ["regional anatomy", "embryology", "histology", "cranial nerves"],
    },
    {
      id: "physiology",
      label: "Physiology",
      weight: 0.18,
      subjectIds: ["physiology"],
      highYieldTopics: ["cardiovascular", "renal", "respiratory", "endocrine", "acid-base"],
    },
    {
      id: "pathology",
      label: "Pathology",
      weight: 0.18,
      subjectIds: ["pathology"],
      highYieldTopics: ["inflammation", "neoplasia", "hemodynamics", "mechanisms of disease"],
    },
    {
      id: "pharmacology",
      label: "Pharmacology",
      weight: 0.16,
      subjectIds: ["pharmacology"],
      highYieldTopics: ["MOA", "adverse effects", "interactions", "autonomic drugs"],
    },
    {
      id: "biochemistry",
      label: "Biochemistry",
      weight: 0.15,
      subjectIds: ["biochemistry"],
      highYieldTopics: ["metabolic pathways", "enzymes", "nutrition", "genetics"],
    },
    {
      id: "microbiology",
      label: "Microbiology & Immunology",
      weight: 0.15,
      subjectIds: ["microbiology"],
      highYieldTopics: ["bacteria", "viruses", "hypersensitivity", "vaccines"],
    },
  ],
};

/** USMLE Step 2 CK — clinical sciences. */
const USMLE_STEP_2: ExamBlueprint = {
  fieldId: "usmle-step-2",
  examName: "USMLE Step 2 CK",
  sourceNote: "USMLE Content Outline — Step 2 CK clinical sciences",
  vignetteMinRatio: 0.75,
  categories: [
    {
      id: "cardiovascular",
      label: "Cardiovascular",
      weight: 0.12,
      subjectIds: ["cardiology", "internal-medicine"],
      highYieldTopics: ["ACS", "heart failure", "hypertension", "arrhythmias", "valvular disease"],
    },
    {
      id: "respiratory",
      label: "Respiratory",
      weight: 0.1,
      subjectIds: ["pulmonology", "internal-medicine"],
      highYieldTopics: ["COPD", "asthma", "pneumonia", "PE", "respiratory failure"],
    },
    {
      id: "gastrointestinal",
      label: "Gastrointestinal",
      weight: 0.07,
      subjectIds: ["internal-medicine"],
      highYieldTopics: ["GERD", "PUD", "IBD", "hepatitis", "pancreatitis", "GI bleeding"],
    },
    {
      id: "endocrine",
      label: "Endocrine",
      weight: 0.07,
      subjectIds: ["internal-medicine"],
      highYieldTopics: ["diabetes", "DKA/HHS", "thyroid disorders", "adrenal insufficiency"],
    },
    {
      id: "infectious-disease",
      label: "Infectious Disease",
      weight: 0.07,
      subjectIds: ["internal-medicine"],
      highYieldTopics: ["sepsis", "HIV", "UTI", "meningitis", "antibiotic selection"],
    },
    {
      id: "internal-medicine",
      label: "Internal Medicine (other)",
      weight: 0.05,
      subjectIds: ["internal-medicine", "nephrology"],
      highYieldTopics: ["AKI", "electrolytes", "anemia", "rheumatology"],
    },
    {
      id: "surgery",
      label: "Surgery & Acute Care",
      weight: 0.14,
      subjectIds: ["emergency-medicine"],
      highYieldTopics: ["acute abdomen", "trauma", "post-op complications", "wound care"],
    },
    {
      id: "pediatrics",
      label: "Pediatrics",
      weight: 0.12,
      subjectIds: ["pediatrics"],
      highYieldTopics: ["development", "vaccines", "neonatal jaundice", "febrile infant"],
    },
    {
      id: "obgyn",
      label: "OB/GYN",
      weight: 0.12,
      subjectIds: ["obgyn"],
      highYieldTopics: ["prenatal care", "labor complications", "contraception", "preeclampsia"],
    },
    {
      id: "psychiatry",
      label: "Psychiatry",
      weight: 0.07,
      subjectIds: ["psychiatry"],
      highYieldTopics: ["mood disorders", "psychosis", "substance use", "suicide risk"],
    },
    {
      id: "emergency-medicine",
      label: "Emergency Medicine",
      weight: 0.07,
      subjectIds: ["emergency-medicine"],
      highYieldTopics: ["anaphylaxis", "shock", "toxicology", "ACLS"],
    },
  ],
};

/** NABP NAPLEX Content Outline (2025, effective May 1) — five domains. */
const NAPLEX: ExamBlueprint = {
  fieldId: "pharmacy",
  examName: "NAPLEX",
  sourceNote:
    "NABP NAPLEX Content Outline (2025) — 25% Foundations, 25% Medication Use, 40% Treatment Planning, 5% Professional Practice, 5% Management",
  vignetteMinRatio: 0.6,
  categories: [
    {
      id: "naplex-area1-foundations",
      label: "Foundational Knowledge for Pharmacy Practice",
      weight: 0.25,
      subjectIds: ["pharmacology", "pharmacokinetics", "pharmaceutics", "compounding-calculations"],
      highYieldTopics: ["PK/PD", "calculations", "compounding", "pharmaceutics", "biopharmaceutics"],
    },
    {
      id: "naplex-area2-therapeutics",
      label: "Medication Use Process",
      weight: 0.25,
      subjectIds: [
        "pharmacology",
        "cardiovascular-rx",
        "infectious-disease-rx",
        "endocrine-rx",
        "cns-rx",
      ],
      highYieldTopics: [
        "dispensing",
        "monitoring",
        "drug interactions",
        "immunizations",
        "MTM",
        "REMS",
      ],
    },
    {
      id: "naplex-area3-treatment-planning",
      label: "Person-Centered Assessment & Treatment Planning",
      weight: 0.4,
      subjectIds: [
        "cardiovascular-rx",
        "infectious-disease-rx",
        "endocrine-rx",
        "cns-rx",
        "patient-counseling",
        "otc-self-care",
      ],
      highYieldTopics: [
        "guideline-based therapy",
        "special populations",
        "adherence",
        "therapeutic substitution",
        "clinical scenarios",
      ],
    },
    {
      id: "naplex-area4-safety",
      label: "Professional Practice",
      weight: 0.05,
      subjectIds: ["pharmacy-law", "patient-counseling"],
      highYieldTopics: ["ethics", "HIPAA", "error reporting", "patient safety", "diversion"],
    },
    {
      id: "naplex-area5-management",
      label: "Pharmacy Management & Leadership",
      weight: 0.05,
      subjectIds: ["pharmacy-law", "patient-counseling"],
      highYieldTopics: ["inventory", "precepting", "operations", "quality improvement"],
    },
  ],
};

/** NCCPA PANCE Content Blueprint (effective January 2025). */
const PANCE: ExamBlueprint = {
  fieldId: "pance",
  examName: "PANCE",
  sourceNote: "NCCPA PANCE Content Blueprint (effective January 2025)",
  vignetteMinRatio: 0.85,
  categories: [
    {
      id: "cardiovascular",
      label: "Cardiovascular System",
      weight: 0.11,
      subjectIds: ["cardiovascular"],
      highYieldTopics: ["ACS", "heart failure", "arrhythmias", "hypertension", "valvular disease"],
    },
    {
      id: "pulmonary",
      label: "Pulmonary System",
      weight: 0.09,
      subjectIds: ["pulmonary"],
      highYieldTopics: ["COPD", "asthma", "pneumonia", "PE", "pleural effusion"],
    },
    {
      id: "gastrointestinal",
      label: "Gastrointestinal / Nutrition",
      weight: 0.08,
      subjectIds: ["gastrointestinal"],
      highYieldTopics: ["GERD", "pancreatitis", "hepatitis", "IBD", "GI bleeding"],
    },
    {
      id: "musculoskeletal",
      label: "Musculoskeletal System",
      weight: 0.08,
      subjectIds: ["musculoskeletal"],
      highYieldTopics: ["fractures", "arthritis", "back pain", "compartment syndrome"],
    },
    {
      id: "infectious-diseases",
      label: "Infectious Diseases",
      weight: 0.07,
      subjectIds: ["infectious-diseases"],
      highYieldTopics: ["sepsis", "HIV", "meningitis", "skin infections", "antibiotic selection"],
    },
    {
      id: "neurologic",
      label: "Neurologic System",
      weight: 0.07,
      subjectIds: ["neurologic"],
      highYieldTopics: ["stroke", "seizure", "headache", "MS", "neuropathy"],
    },
    {
      id: "psychiatry",
      label: "Psychiatry / Behavioral Science",
      weight: 0.07,
      subjectIds: ["psychiatry"],
      highYieldTopics: ["depression", "anxiety", "psychosis", "substance use", "suicide risk"],
    },
    {
      id: "reproductive",
      label: "Reproductive System",
      weight: 0.07,
      subjectIds: ["reproductive"],
      highYieldTopics: ["pregnancy complications", "STIs", "contraception", "gynecologic emergencies"],
    },
    {
      id: "endocrine",
      label: "Endocrine System",
      weight: 0.06,
      subjectIds: ["endocrine"],
      highYieldTopics: ["diabetes", "thyroid", "DKA", "adrenal disorders"],
    },
    {
      id: "eent",
      label: "Eyes, Ears, Nose & Throat",
      weight: 0.06,
      subjectIds: ["eent"],
      highYieldTopics: ["red eye", "otitis", "sinusitis", "pharyngitis", "vertigo"],
    },
    {
      id: "hematologic",
      label: "Hematologic System",
      weight: 0.05,
      subjectIds: ["hematologic"],
      highYieldTopics: ["anemia", "coagulopathy", "thrombocytopenia", "bleeding disorders"],
    },
    {
      id: "renal",
      label: "Renal System",
      weight: 0.05,
      subjectIds: ["renal"],
      highYieldTopics: ["AKI", "CKD", "electrolytes", "acid-base", "dialysis"],
    },
    {
      id: "dermatologic",
      label: "Dermatologic System",
      weight: 0.04,
      subjectIds: ["dermatologic"],
      highYieldTopics: ["cellulitis", "rash patterns", "drug eruptions", "melanoma screening"],
    },
    {
      id: "genitourinary",
      label: "Genitourinary System",
      weight: 0.04,
      subjectIds: ["genitourinary"],
      highYieldTopics: ["UTI", "BPH", "nephrolithiasis", "urologic emergencies"],
    },
    {
      id: "professional-practice",
      label: "Professional Practice",
      weight: 0.06,
      subjectIds: ["professional-practice"],
      highYieldTopics: ["ethics", "consent", "scope of practice", "patient safety", "documentation"],
    },
  ],
};

/** AANPCB FNP Content Outline (2024+ blueprint). */
const AANP_FNP: ExamBlueprint = {
  fieldId: "aanp-fnp",
  examName: "AANP FNP-C",
  sourceNote: "AANPCB FNP Content Outline (2024+ blueprint) — Assess, Diagnose, Plan, Evaluate",
  vignetteMinRatio: 0.85,
  categories: [
    {
      id: "assess",
      label: "Assess",
      weight: 0.32,
      subjectIds: ["assess", "pediatrics", "geriatrics", "womens-health"],
      highYieldTopics: ["history", "physical exam", "screening", "diagnostics", "lifespan assessment"],
    },
    {
      id: "diagnose",
      label: "Diagnose",
      weight: 0.265,
      subjectIds: ["diagnose", "cardiovascular", "pulmonary", "endocrine", "infectious-disease"],
      highYieldTopics: ["differential diagnosis", "clinical reasoning", "red flags", "data synthesis"],
    },
    {
      id: "plan",
      label: "Plan",
      weight: 0.265,
      subjectIds: ["plan", "psychiatry-behavioral", "womens-health", "endocrine"],
      highYieldTopics: ["pharmacotherapy", "patient education", "referrals", "preventive care"],
    },
    {
      id: "evaluate",
      label: "Evaluate",
      weight: 0.15,
      subjectIds: ["evaluate", "geriatrics", "psychiatry-behavioral"],
      highYieldTopics: ["treatment response", "adverse effects", "follow-up", "care plan modification"],
    },
  ],
};

const BLUEPRINTS: Record<string, ExamBlueprint> = {
  nursing: NCLEX_RN,
  "usmle-step-1": USMLE_STEP_1,
  "usmle-step-2": USMLE_STEP_2,
  pharmacy: NAPLEX,
  pance: PANCE,
  "aanp-fnp": AANP_FNP,
};

export { AANP_FNP };

export function getExamBlueprint(fieldId: string): ExamBlueprint | undefined {
  return BLUEPRINTS[normalizeFieldId(fieldId)];
}

export type QuestionSlot = {
  categoryId: string;
  categoryLabel: string;
  subjectIds?: string[];
  highYieldTopics?: string[];
  ngnFormat?: string;
};

/** Allocate integer question counts per blueprint category (largest remainder). */
export function allocateQuestionsByBlueprint(
  questionCount: number,
  blueprint: ExamBlueprint,
  focusSubjectId?: string
): QuestionSlot[] {
  if (focusSubjectId) {
    return allocateFocusedExam(questionCount, blueprint, focusSubjectId);
  }

  const raw = blueprint.categories.map((c) => ({
    category: c,
    exact: c.weight * questionCount,
  }));

  const floors = raw.map((r) => ({
    ...r,
    count: Math.floor(r.exact),
    remainder: r.exact - Math.floor(r.exact),
  }));

  let assigned = floors.reduce((n, f) => n + f.count, 0);
  const sorted = [...floors].sort((a, b) => b.remainder - a.remainder);
  for (const row of sorted) {
    if (assigned >= questionCount) break;
    row.count += 1;
    assigned += 1;
  }

  const ngnSlots = assignNgnFormats(questionCount, blueprint);

  return floors.flatMap((f) => {
    const slots: QuestionSlot[] = [];
    for (let q = 0; q < f.count; q++) {
      const ngn = ngnSlots.shift();
      slots.push({
        categoryId: f.category.id,
        categoryLabel: f.category.label,
        subjectIds: f.category.subjectIds,
        highYieldTopics: f.category.highYieldTopics,
        ngnFormat: ngn,
      });
    }
    return slots;
  });
}

function allocateFocusedExam(
  questionCount: number,
  blueprint: ExamBlueprint,
  focusSubjectId: string
): QuestionSlot[] {
  const matching = blueprint.categories.filter((c) =>
    c.subjectIds?.includes(focusSubjectId)
  );
  const topics = matching.length
    ? matching.flatMap((c) => c.highYieldTopics ?? [])
    : blueprint.categories.flatMap((c) => c.highYieldTopics ?? []);

  const ngnSlots = assignNgnFormats(questionCount, blueprint);
  const slots: QuestionSlot[] = [];

  for (let i = 0; i < questionCount; i++) {
    slots.push({
      categoryId: matching[0]?.id ?? "focused",
      categoryLabel: matching[0]?.label ?? "Focused subject",
      subjectIds: [focusSubjectId],
      highYieldTopics: topics.slice(0, 8),
      ngnFormat: ngnSlots[i],
    });
  }

  return slots;
}

function assignNgnFormats(questionCount: number, blueprint: ExamBlueprint): (string | undefined)[] {
  const slots: (string | undefined)[] = Array(questionCount).fill(undefined);
  if (!blueprint.ngnMix?.length) return slots;

  const totalNgnWeight = blueprint.ngnMix.reduce((n, m) => n + m.weight, 0);
  const ngnCount = Math.round(questionCount * totalNgnWeight);
  let idx = 0;

  for (const mix of blueprint.ngnMix) {
    const count = Math.max(0, Math.round((mix.weight / totalNgnWeight) * ngnCount));
    for (let i = 0; i < count && idx < ngnCount; i++) {
      slots[idx++] = mix.format;
    }
  }

  return slots;
}

/** Human-readable blueprint block for the LLM user prompt. */
export function buildBlueprintPromptBlock(
  fieldId: string,
  questionCount: number,
  focusSubjectId?: string
): string {
  const blueprint = getExamBlueprint(fieldId);
  if (!blueprint) {
    return "Align items with high-yield board exam topics for this discipline.";
  }

  const slots = allocateQuestionsByBlueprint(questionCount, blueprint, focusSubjectId);

  const lines = [
    `EXAM BLUEPRINT (${blueprint.examName} — ${blueprint.sourceNote}):`,
    focusSubjectId
      ? `- Focus subject: ${focusSubjectId} (${questionCount} items, blueprint-informed style).`
      : `- Distribute ${questionCount} items across these weighted categories:`,
  ];

  if (!focusSubjectId) {
    const byCategory = new Map<string, number>();
    for (const slot of slots) {
      byCategory.set(slot.categoryLabel, (byCategory.get(slot.categoryLabel) ?? 0) + 1);
    }
    for (const cat of blueprint.categories) {
      const n = byCategory.get(cat.label) ?? 0;
      if (n > 0) {
        const pct = Math.round(cat.weight * 100);
        lines.push(
          `  • ${cat.label}: ${n} question(s) (~${pct}%) — high-yield: ${(cat.highYieldTopics ?? []).slice(0, 4).join(", ")}`
        );
      }
    }
  } else {
    const topics = slots[0]?.highYieldTopics ?? [];
    if (topics.length) {
      lines.push(`- Prioritize high-yield subtopics: ${topics.join(", ")}.`);
    }
  }

  lines.push(
    `- ALL ${questionCount} items MUST include a separate vignette field (2–4 concise sentences: demographics, pertinent history, signs/symptoms, etiology clues). The question field is the lead-in stem only.`
  );

  if (blueprint.ngnMix?.length) {
    const ngnCount = slots.filter((s) => s.ngnFormat).length;
    lines.push(`- Include ${ngnCount} NGN-format item(s): ${blueprint.ngnMix.map((m) => m.label).join(", ")}.`);
    lines.push(
      `- Tag each NGN item with ngnFormat and type; number unfolding_case items with caseStep (1, 2, 3) when linked.`
    );
  }

  return lines.join("\n");
}

/** Per-question blueprint slot assignment for the LLM to follow item-by-item. */
export function buildDetailedSlotAllocationBlock(
  fieldId: string,
  questionCount: number,
  focusSubjectId?: string
): string {
  const blueprint = getExamBlueprint(fieldId);
  if (!blueprint) return "";

  const slots = allocateQuestionsByBlueprint(questionCount, blueprint, focusSubjectId);
  const lines = slots.map((slot, i) => {
    const parts = [
      `Q${i + 1}: ${slot.categoryLabel}`,
      slot.subjectIds?.length ? `subjects: ${slot.subjectIds.join(", ")}` : "",
      slot.highYieldTopics?.length
        ? `high-yield: ${slot.highYieldTopics.slice(0, 3).join(", ")}`
        : "",
      slot.ngnFormat ? `format: ${slot.ngnFormat}` : "format: multiple_choice + vignette",
    ];
    return `  ${parts.filter(Boolean).join(" | ")}`;
  });

  return `
ITEM-BY-ITEM ALLOCATION (generate each question to match its slot):
${lines.join("\n")}`;
}
