import type { BankItem } from "@/lib/question-bank";
import type { ExamQuestion } from "@/lib/ai";
import { getDrugById, TOP_500_DRUGS } from "@/lib/drugs300/catalog";
import { searchDrugs } from "@/lib/drugs300/search";
import type { DrugEntry } from "@/lib/drugs300/types";
import { enrichQuestion } from "@/lib/engine/stages/enrich-questions";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import {
  resolveNaplexStem,
  resolveNaplexVignette,
} from "@/lib/exam-prep/naplex-bank-audit";
import {
  formatDrugProfileForExplanation,
  normalizeDrugProfile,
  type PharmDrugProfile,
} from "@/lib/engine/prompts/pharm-drug-profile";

const NAPLEX_PREFIX = /^NAPLEX\s+\d+:\s*/i;

const WEAK_CORRECT_PATTERNS = [
  /^Monitor for interaction between/i,
  /^Counsel on adherence/i,
  /^Recognize serious adverse effect linked to/i,
  /^Verify indication, dose, and legal/i,
  /^Select therapy class appropriate for/i,
  /mechanism relevant to/i,
  /^No receptor interaction/i,
];

const WEAK_OPTION_PATTERNS = [
  /^Ignore the new prescription/i,
  /^Discontinue all chronic/i,
  /^Share medication with family/i,
  /^Skip monitoring labs in all patients/i,
  /^Mild taste change that never requires action/i,
  /^Beneficial effect requiring no monitoring/i,
  /^Unlimited refills without documentation/i,
  /^Bypass inventory controls/i,
  /^Therapy with no evidence/i,
  /^Avoid all monitoring parameters/i,
];

export type NaplexPolishResult = {
  item: BankItem;
  changed: boolean;
  qualityBefore: number;
  qualityAfter: number;
};

export function scoreNaplexBankItem(item: BankItem): number {
  let score = 0.35;
  const stem = item.question;

  if (stem.length > 180) score += 0.12;
  else if (stem.length > 100) score += 0.06;

  if (/\d{1,3}[-‑]year|\d+\s*kg|mg\/|BP|creatinine|allerg|patient|pharmacist/i.test(stem)) {
    score += 0.1;
  }

  if (item.explanation.length > 200) score += 0.15;
  else if (item.explanation.length > 80) score += 0.06;

  if (/why other options|incorrect because|distractor|pathophys|mechanism|monitor|counsel|generic|brand/i.test(item.explanation)) {
    score += 0.1;
  }

  if (!NAPLEX_PREFIX.test(stem)) score += 0.04;

  if (WEAK_CORRECT_PATTERNS.some((re) => re.test(item.correctAnswer))) score -= 0.2;
  if (item.options.some((o) => WEAK_OPTION_PATTERNS.some((re) => re.test(o)))) score -= 0.15;

  if (item.options.length === 4 && item.options.includes(item.correctAnswer)) score += 0.08;

  return Math.max(0, Math.min(1, score));
}

function pickDrug(index: number): DrugEntry {
  return TOP_500_DRUGS[index % TOP_500_DRUGS.length]!;
}

function pickDistractorDrugs(primary: DrugEntry, count: number, seed: number): DrugEntry[] {
  const pool = TOP_500_DRUGS.filter((d) => d.id !== primary.id);
  const out: DrugEntry[] = [];
  for (let i = 0; i < count; i++) {
    out.push(pool[(seed + i * 17) % pool.length]!);
  }
  return out;
}

function formatDrugOption(drug: DrugEntry, suffix = ""): string {
  const brands = brandList(drug.brand).slice(0, 1).join("");
  const brandPart = brands ? ` (${brands})` : "";
  return `${drug.generic}${brandPart}${suffix}`;
}

function lacksDrugDetails(item: BankItem): boolean {
  if (scoreNaplexBankItem(item) >= 0.68) return false;

  const combined = `${item.question} ${item.explanation}`.toLowerCase();
  const mentionsTopDrug = TOP_500_DRUGS.some((d) => combined.includes(d.generic.toLowerCase()));
  const hasMonitoring = /monitor|creatinine|potassium|inr|a1c|lab|blood pressure|lft|ck/i.test(
    item.explanation
  );
  const hasBrandOrClass = /brand|generic|\([A-Z][a-z]+\)|therapeutic class|ace inhibitor|statin|ssri|ppi/i.test(
    `${item.question} ${item.explanation}`
  );
  const hasPatientCentered = /counsel|adherence|patient|dispens|why other options|incorrect because/i.test(
    item.explanation
  );
  return (
    !mentionsTopDrug ||
    !hasMonitoring ||
    !hasBrandOrClass ||
    item.explanation.length < 160 ||
    !hasPatientCentered
  );
}

function inferDrugFromText(text: string): DrugEntry | null {
  const hits = searchDrugs(text, undefined, 3);
  if (hits.length === 0) return null;
  return getDrugById(hits[0]!.id) ?? null;
}

function brandList(brand: string): string[] {
  return brand
    .split(/[,/]+/)
    .map((b) => b.trim())
    .filter(Boolean);
}

function inferMonitoring(drug: DrugEntry): string[] {
  const cls = drug.therapeuticClass.toLowerCase();
  const generic = drug.generic.toLowerCase();
  const monitoring: string[] = [];

  if (/anticoag|warfarin|doac|factor xa|thrombin/i.test(cls + generic)) {
    monitoring.push("INR or anti-Xa as appropriate", "Signs of bleeding");
  }
  if (/statin|hmg/i.test(cls + generic)) {
    monitoring.push("LFTs", "CK if muscle symptoms", "Fasting lipid panel");
  }
  if (/ace|arb|antihypertensive/i.test(cls + generic)) {
    monitoring.push("Blood pressure", "Serum creatinine and potassium");
  }
  if (/insulin|antidiabet|sglt|glp|metformin/i.test(cls + generic)) {
    monitoring.push("Blood glucose", "A1c", "Hypoglycemia symptoms");
  }
  if (/ppi|proton pump/i.test(cls + generic)) {
    monitoring.push("Symptom relief", "Magnesium with prolonged use");
  }
  if (/opioid/i.test(cls + generic)) {
    monitoring.push("Pain control", "Sedation", "Respiratory rate", "Bowel function");
  }
  if (/antibiotic|antimicrobial/i.test(cls + generic)) {
    monitoring.push("Culture/sensitivity", "Resolution of infection signs", "Adverse drug reactions");
  }

  if (monitoring.length === 0) {
    monitoring.push("Therapeutic response", "Adverse effects", "Relevant labs per guideline");
  }

  return monitoring.slice(0, 4);
}

function buildDrugProfile(drug: DrugEntry, indicationHint?: string): PharmDrugProfile {
  const indication = indicationHint ?? drug.indications.split(/[;,]/)[0]?.trim() ?? drug.indications;
  const symptoms = drug.indications
    .split(/[;,]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);

  return {
    generic: drug.generic,
    brandNames: brandList(drug.brand),
    therapeuticClass: drug.therapeuticClass,
    indication,
    conditionSymptoms: symptoms.length ? symptoms : [indication],
    conditionEtiology: `Pathophysiology related to ${indication.toLowerCase()} — ${drug.therapeuticClass.toLowerCase()} therapy targets this mechanism.`,
    majorSideEffects: drug.sideEffects
      .split(/[;,]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 5),
    monitoring: inferMonitoring(drug),
  };
}

function stripPrefix(question: string): string {
  return question.replace(NAPLEX_PREFIX, "").trim();
}

function detectTemplate(stem: string, seed = 0): string {
  if (/calculate|mg\/kg|dose|concentration|infusion rate/i.test(stem)) return "calculation";
  if (/mechanism of action|MOA|how .* supports management/i.test(stem)) return "moa";
  if (/interaction|concurrent|new medication/i.test(stem)) return "interaction";
  if (/counseling|counsel|dispensing|adherence/i.test(stem)) return "counseling";
  if (/adverse effect|dispensing .* for/i.test(stem)) return "adr";
  if (/professional practice|controlled|legal|DEA/i.test(stem)) return "law";
  if (/therapeutic choice|most appropriate/i.test(stem)) return "therapy";
  const pool = ["moa", "counseling", "interaction", "adr", "therapy", "calculation", "law"] as const;
  return pool[Math.abs(seed) % pool.length]!;
}

function rebuildFromTemplate(
  stem: string,
  template: string,
  drug: DrugEntry,
  subjectLabel: string,
  seed = 0
): { vignette: string; question: string; options: [string, string, string, string]; correctAnswer: string } {
  const brands = brandList(drug.brand).slice(0, 2).join(" / ");
  const age = 45 + ((drug.rank + seed) % 25);
  const sex = (drug.rank + seed) % 2 === 0 ? "man" : "woman";
  const encounter = 1000 + (Math.abs(seed) % 9000);

  const vignette = [
    `A ${age}-year-old ${sex} with ${drug.indications.split(/[;,]/)[0]?.trim().toLowerCase() ?? "a chronic condition"} is seen in the outpatient pharmacy (encounter ${encounter}).`,
    `Current medications include ${drug.generic}${brands ? ` (${brands})` : ""} and other chronic therapies.`,
    `Relevant assessment: no known drug allergies; renal and hepatic function within patient-specific targets unless noted.`,
  ].join(" ");

  switch (template) {
    case "moa": {
      const indication = drug.indications.split(/[;,]/)[0]?.trim() ?? "indication";
      const correct = `${drug.generic} — ${drug.therapeuticClass} targeting ${indication.toLowerCase()}`;
      const distractors = pickDistractorDrugs(drug, 3, drug.rank + seed);
      return {
        vignette,
        question: `Which mechanism of action best explains the therapeutic benefit of ${formatDrugOption(drug)} in this patient?`,
        options: [
          correct,
          `${distractors[0]!.generic} — non-selective histamine blockade without vascular effect`,
          `${distractors[1]!.generic} — direct thrombin inhibition unrelated to this indication`,
          `${distractors[2]!.generic} — dopamine reuptake inhibition in the CNS`,
        ],
        correctAnswer: correct,
      };
    }
    case "interaction": {
      const interactant = pickDistractorDrugs(drug, 1, drug.rank + seed + 3)[0]!;
      const correct = `Screen ${drug.generic}–${interactant.generic} interactions, verify renal/hepatic function, and counsel on warning signs before dispensing`;
      return {
        vignette: `${vignette} A new ${interactant.generic} prescription may interact with ${formatDrugOption(drug)}.`,
        question: "What is the pharmacist's priority action before release to the patient?",
        options: [
          correct,
          `Dispense both ${drug.generic} and ${interactant.generic} without review — prescriber is solely responsible`,
          `Recommend doubling ${drug.generic} without contacting the prescriber`,
          "Discontinue all chronic medications indefinitely",
        ],
        correctAnswer: correct,
      };
    }
    case "counseling": {
      const adr = drug.sideEffects.split(/[;,]/)[0]?.trim() ?? "adverse effects";
      const monitor = inferMonitoring(drug)[0] ?? "therapeutic response";
      const correct = `Counsel on ${drug.generic} adherence, expected benefits, recognizing ${adr}, monitoring ${monitor}, and when to call the pharmacist or prescriber`;
      return {
        vignette: `${vignette} The patient picks up a new ${formatDrugOption(drug)} prescription.`,
        question: "Which counseling point is most essential before the patient leaves the pharmacy?",
        options: [
          correct,
          "Encourage sharing unused tablets with family members with similar symptoms",
          `Advise stopping ${drug.generic} without calling anyone if any question arises`,
          "State that no monitoring or follow-up is ever required for this medication",
        ],
        correctAnswer: correct,
      };
    }
    case "adr": {
      const adr = drug.sideEffects.split(/[;,]/)[0]?.trim() ?? "serious adverse effect";
      const secondAdr = drug.sideEffects.split(/[;,]/)[1]?.trim() ?? adr;
      const correct = `Educate the patient to recognize ${adr} on ${drug.generic} and report it promptly — hold therapy and contact the prescriber if severe`;
      return {
        vignette: `${vignette} The patient asks which warning signs to watch for on ${formatDrugOption(drug)}.`,
        question: "Which adverse-effect counseling is most appropriate?",
        options: [
          correct,
          `Reassure that ${adr} and ${secondAdr} have never been reported with ${drug.generic}`,
          "Advise ignoring muscle pain, bleeding, or rash unless symptoms become unbearable",
          "Recommend adding OTC sedatives nightly to mask side effects",
        ],
        correctAnswer: correct,
      };
    }
    case "therapy": {
      const indication = drug.indications.split(/[;,]/)[0]?.trim() ?? subjectLabel.toLowerCase();
      const correct = `${formatDrugOption(drug)} — guideline-supported ${drug.therapeuticClass.toLowerCase()} for ${indication.toLowerCase()}`;
      const distractors = pickDistractorDrugs(drug, 3, drug.rank + seed + 11);
      return {
        vignette,
        question: `Which medication is the most appropriate pharmacist-recommended therapy for this ${subjectLabel.toLowerCase()} presentation?`,
        options: [
          correct,
          `${formatDrugOption(distractors[0]!)} — no evidence for this indication`,
          `${formatDrugOption(distractors[1]!)} — maximum dose above labeled limits without justification`,
          `${formatDrugOption(distractors[2]!)} — requires no monitoring in all patients`,
        ],
        correctAnswer: correct,
      };
    }
    case "calculation": {
      const dosePerKg = 2 + ((drug.rank + seed) % 8);
      const weight = 55 + ((drug.rank + seed) % 35);
      const total = dosePerKg * weight;
      const correct = `${total} mg/day in divided doses`;
      const q = `A ${weight}-kg patient receives ${drug.generic} at ${dosePerKg} mg/kg/day for ${drug.indications.split(/[;,]/)[0]?.trim().toLowerCase() ?? "therapy"}. What is the total daily dose?`;
      return {
        vignette: `A clinical pharmacist verifies dosing for ${formatDrugOption(drug)} before dispensing.`,
        question: q,
        options: [
          correct,
          `${dosePerKg} mg once daily regardless of weight`,
          `${weight} mg daily`,
          `${(dosePerKg + weight).toFixed(0)} mg every 12 hours`,
        ],
        correctAnswer: correct,
      };
    }
    case "law":
    default: {
      const correct = `Verify indication, quantity, patient identity, and DEA requirements before dispensing controlled medications related to ${drug.therapeuticClass.toLowerCase()}`;
      return {
        vignette: `${vignette} A controlled-substance prescription for ${drug.generic} requires verification.`,
        question: "Which professional practice standard applies before dispensing?",
        options: [
          correct,
          "Allow unlimited refills without documentation or PDMP review",
          "Share prescription data publicly to expedite dispensing",
          "Bypass inventory controls when the patient appears in a hurry",
        ],
        correctAnswer: correct,
      };
    }
  }
}

function bankItemToExam(item: BankItem, subjectId?: string): ExamQuestion {
  const vignette = resolveNaplexVignette(item);
  const stem = resolveNaplexStem(item);
  const combined = vignette ? `${vignette}\n\n${stem}` : stem;

  return {
    id: 1,
    type: "multiple_choice",
    question: combined,
    vignette,
    options: [...item.options],
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
    tags: item.tags ?? [subjectId ?? "pharmacology"],
    highYield: true,
  };
}

function examToBankItem(base: BankItem, exam: ExamQuestion): BankItem {
  const polished: BankItem = {
    ...base,
    vignette: exam.vignette?.trim() || resolveNaplexVignette(base),
    options: (exam.options?.slice(0, 4) ?? base.options) as [string, string, string, string],
    correctAnswer: exam.correctAnswer,
    explanation: exam.explanation,
    tags: exam.tags ?? base.tags,
    question: exam.question,
  };
  const vignette = polished.vignette?.trim() || resolveNaplexVignette(polished);
  const stem = resolveNaplexStem(polished);

  return {
    ...polished,
    vignette,
    scenario: vignette,
    question: stem,
  };
}

/** Polish a single NAPLEX bank item to uniform, high-yield format. */
export function polishNaplexBankItem(
  item: BankItem,
  subjectId: string,
  subjectLabel = "NAPLEX pharmacotherapy",
  seed = 0
): NaplexPolishResult {
  const qualityBefore = scoreNaplexBankItem(item);
  const hasWeakPatterns =
    WEAK_CORRECT_PATTERNS.some((re) => re.test(item.correctAnswer)) ||
    item.options.some((o) => WEAK_OPTION_PATTERNS.some((re) => re.test(o)));

  if (!needsNaplexPolish(item) && !hasWeakPatterns && !lacksDrugDetails(item)) {
    return { item, changed: false, qualityBefore, qualityAfter: qualityBefore };
  }

  const stem = stripPrefix(item.question);
  const isWeak =
    qualityBefore < 0.55 ||
    WEAK_CORRECT_PATTERNS.some((re) => re.test(item.correctAnswer)) ||
    NAPLEX_PREFIX.test(item.question) ||
    lacksDrugDetails(item);

  let working: BankItem = { ...item, question: stem };

  if (isWeak) {
    const drug =
      inferDrugFromText(stem) ??
      inferDrugFromText(item.correctAnswer) ??
      pickDrug(stem.length + (item.subjectId?.length ?? 0) + seed);

    const template = detectTemplate(stem, seed);
    const rebuilt = rebuildFromTemplate(stem, template, drug, subjectLabel, seed);

    if (rebuilt.correctAnswer && rebuilt.options.every(Boolean)) {
      working = {
        ...item,
        vignette: rebuilt.vignette,
        scenario: rebuilt.vignette,
        question: rebuilt.question,
        options: rebuilt.options,
        correctAnswer: rebuilt.correctAnswer,
        explanation: buildNaplexExplanation(rebuilt.correctAnswer, rebuilt.options, drug, template),
        tags: [...(item.tags ?? []), drug.generic, "naplex-polished"],
      };
    }
  }

  const drug =
    inferDrugFromText(working.question) ??
    inferDrugFromText(working.correctAnswer) ??
    null;

  let exam = bankItemToExam(working, subjectId);
  if (drug) {
    exam.drugProfile = buildDrugProfile(drug);
  }

  exam = enrichQuestion(exam, "pharmacy");

  // enrichQuestion merges vignette into question for display; bank rows keep them split.
  if (exam.vignette?.trim()) {
    exam = { ...exam, question: resolveNaplexStem({ ...working, question: exam.question, vignette: exam.vignette, scenario: exam.vignette }) };
  }

  if (drug && exam.drugProfile) {
    const profile = normalizeDrugProfile(exam.drugProfile);
    if (profile && !exam.explanation.toLowerCase().includes(profile.generic.toLowerCase())) {
      exam.explanation = `${exam.explanation.trim()}\n\n${formatDrugProfileForExplanation(profile)}`.trim();
    }
  }

  const polished = examToBankItem(working, exam);
  const qualityAfter = scoreNaplexBankItem(polished);

  const changed =
    polished.question !== item.question ||
    polished.correctAnswer !== item.correctAnswer ||
    polished.explanation !== item.explanation ||
    JSON.stringify(polished.options) !== JSON.stringify(item.options);

  return { item: polished, changed, qualityBefore, qualityAfter };
}

function buildNaplexExplanation(
  correct: string,
  options: string[],
  drug: DrugEntry,
  template: string
): string {
  const profile = buildDrugProfile(drug);
  const incorrect = options.filter((o) => o !== correct);

  const templateIntro: Record<string, string> = {
    moa: "The correct answer links the patient's presentation to the evidence-based mechanism of the selected agent.",
    interaction: "Pharmacists must resolve interaction risk, verify dosing, and document counseling before dispensing.",
    counseling: "Person-centered care requires actionable counseling on benefits, adverse effects, adherence, and follow-up.",
    adr: "Patients must recognize serious adverse effects and know when to hold therapy and seek care.",
    therapy: "Therapeutic selection follows guidelines, patient-specific factors, and monitoring requirements.",
    calculation: "Apply NAPLEX calculation competencies with correct units and patient parameters.",
    law: "Federal and state pharmacy law govern controlled substances, records, and patient confidentiality.",
    general: "Apply NAPLEX Medication Use Process and Person-Centered Care domains.",
  };

  const whyWrong = incorrect
    .slice(0, 3)
    .map((o) => `• ${o}: Incorrect — does not address the priority clinical/pharmacy issue or conflicts with ${drug.generic} safety/indication.`)
    .join("\n");

  return [
    templateIntro[template] ?? templateIntro.general,
    `Correct: ${correct}. ${drug.generic} (${profile.brandNames.join(", ")}) is a ${profile.therapeuticClass} used for ${profile.indication}.`,
    `Monitor: ${profile.monitoring.join("; ")}. Counsel on ${profile.majorSideEffects.slice(0, 2).join(" and ")}.`,
    whyWrong ? `\nWhy other options are incorrect:\n${whyWrong}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function needsNaplexPolish(item: BankItem): boolean {
  return (
    scoreNaplexBankItem(item) < 0.62 ||
    NAPLEX_PREFIX.test(item.question) ||
    lacksDrugDetails(item) ||
    !auditBankItem(item, "pharmacy").ok
  );
}
