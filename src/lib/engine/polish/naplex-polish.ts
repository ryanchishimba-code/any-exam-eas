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
import { normalizeNaplexBankItemFields } from "@/lib/exam-prep/naplex-bank-normalize";
import { NAPLEX_QUALITY_V2 } from "@/lib/exam-prep/naplex-quality-v2";
import {
  hasInvalidControlledSubstanceStem,
  isControlledSubstanceDrug,
} from "@/lib/exam-prep/naplex-controlled-substances";

const NAPLEX_PREFIX = /^NAPLEX\s+\d+:\s*/i;

const WEAK_CORRECT_PATTERNS = [
  /^Monitor for interaction between/i,
  /^Counsel on adherence/i,
  /^Recognize serious adverse effect linked to/i,
  /^Verify indication, dose, and legal/i,
  /^Verify indication, quantity, patient identity, and DEA requirements/i,
  /before dispensing controlled medications related to/i,
  /^Select therapy class appropriate for/i,
  /mechanism relevant to/i,
  /^No receptor interaction/i,
  /^.+\s+—\s+.+\s+targeting\s/i,
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
  /— non-selective histamine blockade/i,
  /— direct thrombin inhibition unrelated/i,
  /— dopamine reuptake inhibition in the CNS/i,
  /^[A-Za-z/\s]+ — [A-Za-z/ ]+ targeting /i,
];

/** Plausible but incorrect MOA statements for NAPLEX distractors. */
const WRONG_MOA_STATEMENTS = [
  "Selective serotonin reuptake inhibition increasing synaptic serotonin in the CNS",
  "Direct thrombin inhibition reducing fibrin formation in the coagulation cascade",
  "Non-selective histamine H1 receptor blockade causing sedation without vascular effect",
  "Dopamine D2 receptor antagonism in the mesolimbic pathway",
  "Angiotensin-converting enzyme inhibition preventing angiotensin II formation",
  "Inhibition of HMG-CoA reductase reducing hepatic cholesterol synthesis",
  "β1-adrenergic receptor blockade decreasing heart rate and contractility",
  "Dihydropyridine L-type calcium channel blockade causing peripheral vasodilation",
  "Sodium-glucose cotransporter 2 inhibition increasing urinary glucose excretion",
  "Proton pump inhibition irreversibly blocking gastric H+/K+-ATPase",
];

export type NaplexPolishResult = {
  item: BankItem;
  changed: boolean;
  qualityBefore: number;
  qualityAfter: number;
};

function clinicalContextText(item: BankItem): string {
  const vignette = resolveNaplexVignette(item) ?? item.scenario ?? "";
  return `${vignette} ${item.question} ${item.explanation}`.trim();
}

/** Case vignettes that test recommendations/actions, not Top-500 drug selection. */
function isNonDrugCaseManagementItem(item: BankItem): boolean {
  if (item.itemType === "case_based") return true;

  const tags = (item.tags ?? []).map((t) => t.toLowerCase());
  if (tags.some((t) => t.includes("case-vignette") || t === "case_based")) return true;

  const vignette = resolveNaplexVignette(item) ?? "";
  const stem = resolveNaplexStem(item);
  const drugTherapyShell = / — (guideline-supported|no evidence for this indication|maximum dose above labeled limits|requires no monitoring in all patients)/i;
  if (item.options.filter((o) => drugTherapyShell.test(o)).length >= 2) return false;

  const asksManagement =
    /which recommendation|which action|which step|which counseling|which verification|which monitoring|priority (action|intervention)|order implementation|select all that apply/i.test(
      stem
    ) ||
    (/most appropriate/i.test(stem) &&
      !/which medication|pharmacist-recommended therapy|therapeutic choice/i.test(stem));

  const hasClinicalVignette = vignette.length > 30;
  if (hasClinicalVignette && asksManagement) return true;

  const brandDrugOption = /^[A-Za-z0-9/\-\s]+\s*\([A-Z][a-z][^\)]*\)\s*—/i;
  const drugNamedOptions = item.options.filter((o) => brandDrugOption.test(o));
  return hasClinicalVignette && drugNamedOptions.length === 0 && item.options.length === 4;
}

/** Hand-authored seeds (vignette, SATA, case, calc) — skip weak rebuild unless already corrupted. */
function shouldPreserveHandAuthoredItem(item: BankItem): boolean {
  if (isCorruptedPolishedDrugShell(item) || isCorruptedPolishedLawShell(item)) return false;

  const tags = (item.tags ?? []).map((t) => t.toLowerCase());
  if (
    tags.some((t) =>
      ["physician-educator", "high-yield", "v2", "v3", "clinical-judgment", "sata", "ordered"].includes(t)
    )
  ) {
    if (!WEAK_CORRECT_PATTERNS.some((re) => re.test(item.correctAnswer))) return true;
  }

  const format = item.itemType ?? "mcq";
  if (
    ["case_based", "vignette", "select_all", "sata", "ordered_response", "constructed_response"].includes(
      format
    )
  ) {
    const drugShell = item.options.filter((o) => POLISHED_DRUG_THERAPY_SHELL.test(o)).length >= 2;
    if (!drugShell && !WEAK_CORRECT_PATTERNS.some((re) => re.test(item.correctAnswer))) return true;
  }

  return false;
}

/** Law-template polish applied to a non-controlled drug (e.g. metformin + DEA stem). */
function isCorruptedPolishedLawShell(item: BankItem): boolean {
  const blob = clinicalContextText(item);
  if (!/controlled-substance prescription for/i.test(blob)) return false;
  if (hasInvalidControlledSubstanceStem(blob) || hasInvalidControlledSubstanceStem(item.correctAnswer)) {
    return true;
  }
  const drug = inferDrugFromText(blob);
  return Boolean(drug && !isControlledSubstanceDrug(drug));
}

const POLISHED_DRUG_THERAPY_SHELL =
  / — (guideline-supported|no evidence for this indication|maximum dose above labeled limits|requires no monitoring in all patients)/i;

/** Vignette kept from seed while polish replaced stem/options with random Top-500 drugs. */
function isCorruptedPolishedDrugShell(item: BankItem): boolean {
  const vignette = resolveNaplexVignette(item) ?? "";
  const stem = resolveNaplexStem(item);
  const drugShellStem = /which medication is the most appropriate pharmacist-recommended therapy/i.test(stem);
  const drugShellOptions = item.options.filter((o) => POLISHED_DRUG_THERAPY_SHELL.test(o)).length;
  if (!drugShellStem || drugShellOptions < 2 || vignette.length < 30) return false;

  const vignetteDrug = inferDrugFromText(vignette);
  const optionDrug = inferDrugFromText(item.correctAnswer);
  if (vignetteDrug && optionDrug && vignetteDrug.id === optionDrug.id) return false;
  if (!optionDrug) return false;

  return !vignetteDrug || vignetteDrug.id !== optionDrug.id;
}

function restoreCorruptedCaseFromSeed(item: BankItem): BankItem | null {
  const vignette = resolveNaplexVignette(item)?.trim();
  if (!vignette) return null;

  const seed = NAPLEX_QUALITY_V2.find((q) => (q.vignette?.trim() ?? q.scenario?.trim()) === vignette);
  if (!seed) return null;

  return {
    ...item,
    vignette: seed.vignette,
    scenario: seed.vignette,
    question: seed.question,
    options: [...seed.options] as BankItem["options"],
    correctAnswer: seed.correctAnswer,
    explanation: seed.explanation,
    tags: seed.tags,
    itemType: seed.itemType,
  };
}

export function scoreNaplexBankItem(item: BankItem): number {
  let score = 0.35;
  const stem = resolveNaplexStem(item);
  const context = clinicalContextText(item);

  if (stem.length > 180) score += 0.12;
  else if (stem.length > 100) score += 0.06;

  if (/\d{1,3}[-‑]year|\d+\s*kg|mg\/|BP|creatinine|allerg|patient|pharmacist|a1c|hypoglycemia|insulin/i.test(context)) {
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

  const tags = (item.tags ?? []).map((t) => t.toLowerCase());
  if (tags.some((t) => ["vignette", "high-yield", "v2", "physician-educator", "case-vignette", "case-calculation", "procedural-calc"].includes(t))) {
    score += 0.06;
  }
  if (item.itemType === "vignette") score += 0.08;
  if (item.itemType === "constructed_response") score += 0.12;
  if ((item.solutionSteps?.length ?? 0) > 0) score += 0.04;

  return Math.max(0, Math.min(1, score));
}

function pickDrug(index: number): DrugEntry {
  return TOP_500_DRUGS[index % TOP_500_DRUGS.length]!;
}

function pickDistractorDrugs(primary: DrugEntry, count: number, seed: number): DrugEntry[] {
  const cls = primary.therapeuticClass.toLowerCase();
  const sameClass = TOP_500_DRUGS.filter(
    (d) => d.id !== primary.id && d.therapeuticClass.toLowerCase().includes(cls.split(/[/]/)[0]!.trim().slice(0, 12))
  );
  const pool = sameClass.length >= count ? sameClass : TOP_500_DRUGS.filter((d) => d.id !== primary.id);
  const out: DrugEntry[] = [];
  for (let i = 0; i < count; i++) {
    out.push(pool[(seed + i * 17) % pool.length]!);
  }
  return out;
}

function inferDrugMoa(drug: DrugEntry): string {
  const blob = `${drug.therapeuticClass} ${drug.generic}`.toLowerCase();

  if (/antiepileptic|anticonvuls/i.test(blob)) {
    if (/topiramate/i.test(blob)) {
      return "Blocks voltage-gated sodium channels, potentiates GABA-A receptor activity, and antagonizes AMPA/kainate glutamate receptors — reducing neuronal hyperexcitability";
    }
    if (/levetiracetam/i.test(blob)) {
      return "Binds synaptic vesicle protein 2A (SV2A), modulating neurotransmitter release and reducing seizure propagation";
    }
    if (/phenytoin|carbamazepine|lamotrigine/i.test(blob)) {
      return "Stabilizes inactive voltage-gated sodium channels, limiting repetitive neuronal firing";
    }
    if (/valpro/i.test(blob)) {
      return "Increases GABA availability and blocks sodium and T-type calcium channels";
    }
    return "Modulates ion channels and/or enhances inhibitory neurotransmission to reduce neuronal hyperexcitability";
  }
  if (/ace inhibitor|arb|angiotensin/i.test(blob)) {
    return "Inhibits angiotensin-converting enzyme, decreasing angiotensin II and reducing vasoconstriction and aldosterone secretion";
  }
  if (/statin|hmg-coa/i.test(blob)) {
    return "Competitively inhibits HMG-CoA reductase, reducing hepatic cholesterol synthesis";
  }
  if (/ppi|proton pump/i.test(blob)) {
    return "Irreversibly inhibits the H+/K+-ATPase proton pump in gastric parietal cells, suppressing acid secretion";
  }
  if (/ssri|snri|serotonin|antidepress/i.test(blob)) {
    return "Inhibits presynaptic reuptake of serotonin (and/or norepinephrine), increasing synaptic neurotransmitter availability";
  }
  if (/beta.?block|β-block/i.test(blob)) {
    return "Antagonizes β-adrenergic receptors, reducing heart rate, contractility, and renin release";
  }
  if (/calcium channel|dihydropyridine|amlodipine/i.test(blob)) {
    return "Blocks L-type voltage-gated calcium channels in vascular smooth muscle, causing peripheral vasodilation";
  }
  if (/sglt2/i.test(blob)) {
    return "Inhibits SGLT2 in the proximal renal tubule, increasing urinary glucose excretion and lowering plasma glucose";
  }
  if (/insulin/i.test(blob)) {
    return "Binds insulin receptors, facilitating cellular glucose uptake and inhibiting hepatic glucose production";
  }
  if (/anticoag|warfarin|doac|factor xa|thrombin/i.test(blob)) {
    return "Inhibits key steps in the coagulation cascade, reducing thrombin generation or activity";
  }
  if (/antibiotic|antimicrobial|penicillin|cephalosporin|macrolide|fluoroquinolone/i.test(blob)) {
    return "Interferes with bacterial cell wall synthesis, protein synthesis, or nucleic acid replication — bactericidal or bacteriostatic per class";
  }
  if (/metformin|biguanide/i.test(blob)) {
    return "Decreases hepatic gluconeogenesis and improves peripheral insulin sensitivity without stimulating insulin secretion";
  }

  return `${drug.generic} exerts its therapeutic effect through ${drug.therapeuticClass.toLowerCase()} pathways relevant to ${drug.indications.split(/[;,]/)[0]?.trim().toLowerCase() ?? "the treated condition"}`;
}

function buildMoaOptions(drug: DrugEntry, seed: number): {
  options: [string, string, string, string];
  correctAnswer: string;
} {
  const correct = inferDrugMoa(drug);
  const wrongPool = WRONG_MOA_STATEMENTS.filter((m) => m !== correct);
  const distractors: string[] = [];
  for (let i = 0; i < 3; i++) {
    distractors.push(wrongPool[(seed + i * 7) % wrongPool.length]!);
  }
  const options = [correct, ...distractors] as [string, string, string, string];
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (seed + i * 13) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return {
    options: shuffled as [string, string, string, string],
    correctAnswer: correct,
  };
}

function buildClinicalVignette(drug: DrugEntry, seed: number): string {
  const brands = brandList(drug.brand).slice(0, 1).join("");
  const brandPart = brands ? ` (${brands})` : "";
  const age = 45 + ((drug.rank + seed) % 25);
  const sex = (drug.rank + seed) % 2 === 0 ? "man" : "woman";
  const indication = drug.indications.split(/[;,]/)[0]?.trim().toLowerCase() ?? "a chronic condition";
  const cls = drug.therapeuticClass.toLowerCase();

  if (/antiepileptic|anticonvuls/i.test(cls)) {
    return [
      `A ${age}-year-old ${sex} with ${indication} picks up a refill for ${drug.generic}${brandPart} at the community pharmacy.`,
      `The patient reports improved seizure control over the past 3 months with twice-daily dosing.`,
      `Assessment: BP 124/78 mmHg, HR 76/min, serum creatinine 1.0 mg/dL, no known drug allergies.`,
    ].join(" ");
  }
  if (/antihypertensive|ace|arb|beta|calcium channel/i.test(cls)) {
    return [
      `A ${age}-year-old ${sex} with ${indication} is counseled on ${drug.generic}${brandPart} at the outpatient pharmacy.`,
      `Home BP log averages 142/88 mmHg; serum creatinine 1.1 mg/dL; potassium 4.2 mEq/L.`,
      `No cough, angioedema, or dizziness reported today.`,
    ].join(" ");
  }

  return [
    `A ${age}-year-old ${sex} with ${indication} is seen in the outpatient pharmacy for medication therapy management.`,
    `Current therapy includes ${drug.generic}${brandPart} and other chronic medications.`,
    `No known drug allergies; renal and hepatic function within patient-specific targets.`,
  ].join(" ");
}

function formatDrugOption(drug: DrugEntry, suffix = ""): string {
  const brands = brandList(drug.brand).slice(0, 1).join("");
  const brandPart = brands ? ` (${brands})` : "";
  return `${drug.generic}${brandPart}${suffix}`;
}

function lacksDrugDetails(item: BankItem): boolean {
  if (isNonDrugCaseManagementItem(item)) return false;
  if (scoreNaplexBankItem(item) >= 0.68) return false;

  const combined = clinicalContextText(item).toLowerCase();
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
  if (/which medication|pharmacist-recommended therapy|therapeutic choice/i.test(stem)) return "therapy";
  if (/most appropriate/i.test(stem)) {
    if (/recommendation|counsel|action|monitoring|parameter|priority/i.test(stem)) return "counseling";
    return "therapy";
  }
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
  const vignette = buildClinicalVignette(drug, seed);

  switch (template) {
    case "moa": {
      const { options, correctAnswer } = buildMoaOptions(drug, seed);
      return {
        vignette,
        question: `Which mechanism of action best explains the therapeutic benefit of ${drug.generic}${brandList(drug.brand).slice(0, 1).length ? ` (${brandList(drug.brand)[0]})` : ""} in this patient?`,
        options,
        correctAnswer,
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
      if (!isControlledSubstanceDrug(drug)) {
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

function hasPolishWarnings(item: BankItem): boolean {
  return auditBankItem(item, "pharmacy").issues.some(
    (i) =>
      i.code === "duplicate_vignette_in_stem" ||
      i.code === "naplex_missing_clinical_data" ||
      i.code === "naplex_stem_lead_in" ||
      i.code === "naplex_explanation_short"
  );
}

function itemFieldsChanged(before: BankItem, after: BankItem): boolean {
  return (
    after.question !== before.question ||
    after.correctAnswer !== before.correctAnswer ||
    after.explanation !== before.explanation ||
    JSON.stringify(after.options) !== JSON.stringify(before.options) ||
    (after.vignette ?? after.scenario) !== (before.vignette ?? before.scenario)
  );
}

/** Polish a single NAPLEX bank item to uniform, high-yield format. */
export function polishNaplexBankItem(
  item: BankItem,
  subjectId: string,
  subjectLabel = "NAPLEX pharmacotherapy",
  seed = 0
): NaplexPolishResult {
  const qualityBefore = scoreNaplexBankItem(item);
  const normalized = normalizeNaplexBankItemFields(item);

  if (isCorruptedPolishedLawShell(normalized)) {
    const stem = stripPrefix(normalized.question);
    const drug =
      inferDrugFromText(resolveNaplexVignette(normalized) ?? "") ??
      inferDrugFromText(clinicalContextText(normalized)) ??
      pickDrug(seed);
    const rebuilt = rebuildFromTemplate(stem, "counseling", drug, subjectLabel, seed);
    const repaired: BankItem = {
      ...normalized,
      vignette: rebuilt.vignette,
      scenario: rebuilt.vignette,
      question: rebuilt.question,
      options: rebuilt.options,
      correctAnswer: rebuilt.correctAnswer,
      explanation: buildNaplexExplanation(rebuilt.correctAnswer, rebuilt.options, drug, "counseling"),
      tags: [...(normalized.tags ?? []).filter((t) => t !== "naplex-polished"), drug.generic, "naplex-repaired"],
    };
    const qualityAfter = scoreNaplexBankItem(repaired);
    return {
      item: repaired,
      changed: itemFieldsChanged(item, repaired),
      qualityBefore,
      qualityAfter,
    };
  }

  if (isCorruptedPolishedDrugShell(normalized)) {
    const restored = restoreCorruptedCaseFromSeed(normalized);
    if (restored) {
      const qualityAfter = scoreNaplexBankItem(restored);
      return {
        item: restored,
        changed: itemFieldsChanged(item, restored),
        qualityBefore,
        qualityAfter,
      };
    }
  }

  if (isNonDrugCaseManagementItem(normalized)) {
    const qualityAfter = scoreNaplexBankItem(normalized);
    const changed = itemFieldsChanged(item, normalized);
    return { item: normalized, changed, qualityBefore, qualityAfter };
  }

  if (shouldPreserveHandAuthoredItem(normalized)) {
    const qualityAfter = scoreNaplexBankItem(normalized);
    const changed = itemFieldsChanged(item, normalized);
    return { item: normalized, changed, qualityBefore, qualityAfter };
  }

  const hasWeakPatterns =
    WEAK_CORRECT_PATTERNS.some((re) => re.test(normalized.correctAnswer)) ||
    normalized.options.some((o) => WEAK_OPTION_PATTERNS.some((re) => re.test(o)));

  if (!needsNaplexPolish(normalized) && !hasWeakPatterns && !lacksDrugDetails(normalized)) {
    if (itemFieldsChanged(item, normalized)) {
      return {
        item: normalized,
        changed: true,
        qualityBefore,
        qualityAfter: scoreNaplexBankItem(normalized),
      };
    }
    return { item: normalized, changed: false, qualityBefore, qualityAfter: qualityBefore };
  }

  const stem = stripPrefix(normalized.question);
  const isWeak =
    scoreNaplexBankItem(normalized) < 0.55 ||
    WEAK_CORRECT_PATTERNS.some((re) => re.test(normalized.correctAnswer)) ||
    NAPLEX_PREFIX.test(normalized.question) ||
    lacksDrugDetails(normalized);

  let working: BankItem = { ...normalized, question: stem };

  if (isWeak) {
    const drug =
      inferDrugFromText(stem) ??
      inferDrugFromText(item.correctAnswer) ??
      pickDrug(stem.length + (item.subjectId?.length ?? 0) + seed);

    let template = detectTemplate(stem, seed);
    if (template === "law" && !isControlledSubstanceDrug(drug)) {
      template = "counseling";
    }
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

  const changed = itemFieldsChanged(item, polished);

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
  const normalized = normalizeNaplexBankItemFields(item);
  if (itemFieldsChanged(item, normalized)) return true;
  return (
    scoreNaplexBankItem(normalized) < 0.62 ||
    NAPLEX_PREFIX.test(normalized.question) ||
    lacksDrugDetails(normalized) ||
    !auditBankItem(normalized, "pharmacy").ok ||
    hasPolishWarnings(normalized)
  );
}
