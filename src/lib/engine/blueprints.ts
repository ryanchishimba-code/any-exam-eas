/**
 * Exam blueprint weights aligned to published board exam test plans.
 * Used to steer question mix toward high-yield, exam-realistic coverage.
 */

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
  examName: "NCLEX-RN",
  sourceNote: "NCSBN NCLEX-RN test plan — Client Needs categories",
  vignetteMinRatio: 0.65,
  ngnMix: [
    { format: "unfolding_case", weight: 0.12, label: "Unfolding clinical case" },
    { format: "bow_tie", weight: 0.08, label: "Bow-tie (actions / conditions to monitor)" },
    { format: "select_all", weight: 0.06, label: "Select all that apply" },
    { format: "matrix", weight: 0.04, label: "Matrix / grid" },
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

/** USMLE / clinical board-style mix (Step 2 CK–oriented when clinical). */
const USMLE_CLINICAL: ExamBlueprint = {
  fieldId: "medicine",
  examName: "USMLE / clinical boards",
  sourceNote: "NBME clinical science content outline (approximate)",
  vignetteMinRatio: 0.75,
  categories: [
    {
      id: "internal-medicine",
      label: "Internal Medicine",
      weight: 0.25,
      subjectIds: ["internal-medicine", "cardiology", "nephrology", "pulmonology"],
      highYieldTopics: ["hypertension", "diabetes", "COPD", "heart failure", "AKI"],
    },
    {
      id: "surgery",
      label: "Surgery",
      weight: 0.2,
      subjectIds: ["surgery", "emergency-medicine"],
      highYieldTopics: ["acute abdomen", "trauma", "post-op complications", "wound care"],
    },
    {
      id: "pediatrics",
      label: "Pediatrics",
      weight: 0.15,
      subjectIds: ["pediatrics"],
      highYieldTopics: ["development", "vaccines", "neonatal jaundice", "febrile infant"],
    },
    {
      id: "obgyn",
      label: "OB/GYN",
      weight: 0.15,
      subjectIds: ["obgyn"],
      highYieldTopics: ["prenatal care", "labor complications", "contraception", "preeclampsia"],
    },
    {
      id: "psychiatry",
      label: "Psychiatry",
      weight: 0.1,
      subjectIds: ["psychiatry"],
      highYieldTopics: ["mood disorders", "psychosis", "substance use", "suicide risk"],
    },
    {
      id: "basic-sciences",
      label: "Basic Sciences",
      weight: 0.15,
      subjectIds: ["pathology", "pharmacology", "microbiology", "physiology", "anatomy", "biochemistry"],
      highYieldTopics: ["mechanism of disease", "drug MOA", "microbial virulence", "physiologic integration"],
    },
  ],
};

/** NAPLEX competency areas (simplified content weighting). */
const NAPLEX: ExamBlueprint = {
  fieldId: "pharmacy",
  examName: "NAPLEX",
  sourceNote: "NABP NAPLEX competency statements (approximate emphasis)",
  vignetteMinRatio: 0.55,
  categories: [
    {
      id: "pharmacotherapy",
      label: "Pharmacotherapy & Therapeutic Classes",
      weight: 0.35,
      subjectIds: ["pharmacology", "cardiovascular-rx", "infectious-disease-rx", "endocrine-rx", "cns-rx"],
      highYieldTopics: ["drug interactions", "contraindications", "monitoring parameters"],
    },
    {
      id: "pk-pd",
      label: "Pharmacokinetics & Pharmacodynamics",
      weight: 0.2,
      subjectIds: ["pharmacokinetics"],
      highYieldTopics: ["half-life", "renal dosing", "protein binding", "receptor activity"],
    },
    {
      id: "calculations",
      label: "Pharmacy Calculations",
      weight: 0.15,
      subjectIds: ["compounding-calculations"],
      highYieldTopics: ["IV rate", "concentrations", "alligation", "pediatric weight-based dosing"],
    },
    {
      id: "patient-safety",
      label: "Patient Safety & Counseling",
      weight: 0.15,
      subjectIds: ["patient-counseling", "pharmaceutics", "otc-self-care"],
      highYieldTopics: ["counseling points", "adverse effects", "storage", "compliance"],
    },
    {
      id: "law-ethics",
      label: "Pharmacy Law & Ethics",
      weight: 0.15,
      subjectIds: ["pharmacy-law"],
      highYieldTopics: ["controlled substances", "prescription validity", "confidentiality"],
    },
  ],
};

/** INBDE / dental board content areas. */
const INBDE: ExamBlueprint = {
  fieldId: "dentistry",
  examName: "INBDE",
  sourceNote: "JCNDE INBDE content outline (approximate)",
  vignetteMinRatio: 0.5,
  categories: [
    {
      id: "diagnosis",
      label: "Diagnosis & Treatment Planning",
      weight: 0.25,
      subjectIds: ["oral-pathology", "treatment-planning", "radiology"],
      highYieldTopics: ["radiographic interpretation", "differential diagnosis", "periodontal staging"],
    },
    {
      id: "oral-health",
      label: "Oral Health & Prevention",
      weight: 0.2,
      subjectIds: ["dental-anatomy", "periodontics"],
      highYieldTopics: ["caries risk", "fluoride", "anatomy landmarks"],
    },
    {
      id: "pharmacology",
      label: "Dental Pharmacology",
      weight: 0.15,
      subjectIds: ["dental-pharmacology"],
      highYieldTopics: ["local anesthetics", "analgesics", "antibiotics", "medical emergencies"],
    },
    {
      id: "restorative",
      label: "Restorative & Prosthodontics",
      weight: 0.2,
      subjectIds: ["restorative-dentistry"],
      highYieldTopics: ["material selection", "crown prep", "occlusion"],
    },
    {
      id: "specialty",
      label: "Endodontics, Perio, Oral Surgery",
      weight: 0.2,
      subjectIds: ["endodontics", "periodontics"],
      highYieldTopics: ["abscess management", "SRP indications", "extraction complications"],
    },
  ],
};

const BLUEPRINTS: Record<string, ExamBlueprint> = {
  nursing: NCLEX_RN,
  medicine: USMLE_CLINICAL,
  pharmacy: NAPLEX,
  dentistry: INBDE,
};

export function getExamBlueprint(fieldId: string): ExamBlueprint | undefined {
  return BLUEPRINTS[fieldId];
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

  return floors.flatMap((f, i) => {
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
  const vignetteCount = Math.ceil(questionCount * blueprint.vignetteMinRatio);

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

  lines.push(`- At least ${vignetteCount} of ${questionCount} items MUST include a clinical vignette (2–5 sentences of client/patient data before the question stem).`);

  if (blueprint.ngnMix?.length) {
    const ngnCount = slots.filter((s) => s.ngnFormat).length;
    lines.push(`- Include ${ngnCount} NGN-format item(s): ${blueprint.ngnMix.map((m) => m.label).join(", ")}.`);
    lines.push(
      `- Tag each NGN item with ngnFormat and type; number unfolding_case items with caseStep (1, 2, 3) when linked.`
    );
  }

  return lines.join("\n");
}
