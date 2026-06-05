import type { ExamQuestion } from "@/lib/ai";
import type { BankItem } from "@/lib/question-bank";
import { enrichQuestion } from "@/lib/engine/stages/enrich-questions";
import { getMpjeState, type MpjeVariant } from "@/lib/mpje/config";
import { getStateLawProfile } from "@/lib/mpje/state-law";

export type MpjePolishResult = {
  item: BankItem;
  changed: boolean;
  qualityBefore: number;
  qualityAfter: number;
};

type LawScenario = {
  setting: string;
  role: string;
  facts: string;
  issue: string;
};

const SCENARIOS: LawScenario[] = [
  {
    setting: "community pharmacy",
    role: "staff pharmacist",
    facts: "A patient presents a handwritten Schedule II prescription for oxycodone dated 45 days ago with no emergency notation.",
    issue: "prescription validity and controlled substance dispensing",
  },
  {
    setting: "hospital outpatient pharmacy",
    role: "clinical pharmacist",
    facts: "A nurse requests a partial fill of a C-II fentanyl patch for a discharged hospice patient.",
    issue: "partial fill rules for Schedule II controlled substances",
  },
  {
    setting: "independent pharmacy",
    role: "pharmacist-in-charge",
    facts: "A quarterly controlled substance inventory reveals a 20-tablet discrepancy in hydrocodone stock with no documented explanation.",
    issue: "inventory controls and theft/loss reporting",
  },
  {
    setting: "retail pharmacy counter",
    role: "pharmacist",
    facts: "Law enforcement requests patient prescription records for an active investigation without a warrant or court order.",
    issue: "HIPAA disclosure exceptions and minimum necessary rule",
  },
  {
    setting: "compounding pharmacy",
    role: "pharmacist",
    facts: "A prescriber orders a non-sterile compounded cream with a beyond-use date exceeding USP <795> limits for the formulation.",
    issue: "compounding regulations and beyond-use dating",
  },
  {
    setting: "chain pharmacy",
    role: "pharmacist",
    facts: "A pharmacy technician attempts to perform the final verification of a new opioid prescription without pharmacist review.",
    issue: "technician scope of practice and supervision requirements",
  },
  {
    setting: "mail-order pharmacy",
    role: "pharmacist",
    facts: "A transferred prescription lacks the required elements documented by the sending pharmacy under multistate transfer rules.",
    issue: "prescription transfer requirements between pharmacies",
  },
  {
    setting: "community pharmacy",
    role: "relief pharmacist",
    facts: "A prescriber's DEA registration appears expired on the PDMP query before dispensing a Schedule III medication.",
    issue: "prescriber DEA validity and dispensing authorization",
  },
];

const TEMPLATES = [
  "federal-law",
  "state-law",
  "ethics",
  "dispensing",
  "controlled-substances",
] as const;

type MpjeTemplate = (typeof TEMPLATES)[number];

function pickScenario(seed: number): LawScenario {
  return SCENARIOS[seed % SCENARIOS.length]!;
}

const UNIFORM_TEMPLATES: MpjeTemplate[] = [
  "federal-law",
  "controlled-substances",
  "dispensing",
  "federal-law",
  "controlled-substances",
];

function detectTemplate(
  subjectId: string,
  seed: number,
  variant: MpjeVariant
): MpjeTemplate {
  if (variant === "uniform") {
    if (subjectId.includes("federal") || subjectId.includes("controlled")) {
      return subjectId.includes("controlled") ? "controlled-substances" : "federal-law";
    }
    return UNIFORM_TEMPLATES[seed % UNIFORM_TEMPLATES.length]!;
  }
  if (subjectId.includes("federal")) return "federal-law";
  if (subjectId.includes("uniform") || subjectId.includes("state-practice")) return "state-law";
  if (subjectId.includes("ethics")) return "ethics";
  if (subjectId.includes("controlled")) return "controlled-substances";
  if (subjectId.includes("dispensing")) return "dispensing";
  return variant === "state" ? "state-law" : TEMPLATES[seed % TEMPLATES.length]!;
}

function buildVignette(
  scenario: LawScenario,
  variant: MpjeVariant,
  stateCode?: string,
  stateName?: string
): string {
  const profile = stateCode ? getStateLawProfile(stateCode) : undefined;
  const jurisdiction =
    variant === "state" && stateName
      ? `in ${stateName} (${profile?.boardName ?? "state board of pharmacy"} practice act applies)`
      : "under federal law (DEA/FDA/HIPAA) and uniform multistate jurisprudence (UMPJE) standards";
  const stateContext =
    variant === "state" && profile
      ? ` Relevant ${stateName} focus: ${profile.focusAreas[seedMod(profile, scenario.facts.length)] ?? profile.focusAreas[0]}.`
      : "";
  return `A ${scenario.role} at a ${scenario.setting} ${jurisdiction} encounters the following: ${scenario.facts}${stateContext}`;
}

function seedMod(profile: { focusAreas: string[] }, n: number): number {
  return n % profile.focusAreas.length;
}

function rebuildQuestion(
  template: MpjeTemplate,
  scenario: LawScenario,
  subjectLabel: string,
  variant: MpjeVariant,
  stateCode: string | undefined,
  stateName: string | undefined,
  seed: number
): Pick<BankItem, "question" | "options" | "correctAnswer" | "explanation"> {
  const vignette = buildVignette(scenario, variant, stateCode, stateName);

  const answers: Record<MpjeTemplate, { q: string; correct: string; wrong: string[] }> = {
    "federal-law": {
      q: "Which federal regulatory requirement takes priority in this situation?",
      correct:
        "Apply the applicable federal statute (DEA/FDA/HIPAA) before dispensing or releasing records",
      wrong: [
        "State board rules always supersede all federal pharmacy law",
        "Federal law does not apply to community pharmacy practice",
        "Verbal agreement with the patient replaces statutory requirements",
      ],
    },
    "state-law": {
      q: "Which action aligns with the state pharmacy practice act and board regulations?",
      correct:
        "Follow the state practice act and board rule governing this dispensing or practice decision",
      wrong: [
        "Apply another state's practice act because it is more permissive",
        "Ignore board rules when the prescriber insists on dispensing",
        "Delegate pharmacist-only duties to an uncertified clerk without supervision",
      ],
    },
    ethics: {
      q: "What is the pharmacist's most appropriate ethical and professional response?",
      correct:
        "Act in the patient's best interest while upholding legal and professional standards, including reporting obligations if required",
      wrong: [
        "Prioritize pharmacy revenue over patient safety and legal compliance",
        "Ignore suspected forgery to avoid conflict with the patient",
        "Share confidential information with unauthorized parties to expedite care",
      ],
    },
    dispensing: {
      q: "What is the legally required step before completing this dispensing?",
      correct:
        "Verify all prescription validity elements, perform DUR, and document pharmacist professional judgment",
      wrong: [
        "Dispense immediately without verifying prescriber credentials or prescription elements",
        "Allow unlimited refills on controlled substances without documentation",
        "Skip patient counseling on high-risk medications to save time",
      ],
    },
    "controlled-substances": {
      q: "Which controlled substance regulation applies to this scenario?",
      correct:
        "Comply with DEA schedule-specific requirements for records, quantity limits, PDMP, and reporting",
      wrong: [
        "Treat all controlled substances identically regardless of schedule",
        "Dispense Schedule II medications with unlimited refills",
        "Delay theft/loss reporting until the next annual inventory",
      ],
    },
  };

  const block = answers[template];
  const profile = stateCode ? getStateLawProfile(stateCode) : undefined;
  const slot = seed % 3;

  let correct = block.correct;
  if (variant === "state" && stateName && template === "state-law") {
    correct = `Follow ${stateName} practice act and ${profile?.boardName ?? "board of pharmacy"} rules governing this dispensing or practice decision`;
  }

  return {
    question: `${vignette}\n\n${block.q}`,
    options: [
      correct,
      block.wrong[slot]!,
      block.wrong[(slot + 1) % 3]!,
      block.wrong[(slot + 2) % 3]!,
    ] as [string, string, string, string],
    correctAnswer: correct,
    explanation: buildMpjeExplanation(
      correct,
      block.wrong,
      template,
      subjectLabel,
      variant,
      stateCode,
      stateName
    ),
  };
}

function buildMpjeExplanation(
  correct: string,
  wrong: string[],
  template: MpjeTemplate,
  subjectLabel: string,
  variant: MpjeVariant,
  stateCode?: string,
  stateName?: string
): string {
  const profile = stateCode ? getStateLawProfile(stateCode) : undefined;
  const scope =
    variant === "state" && stateName
      ? `${stateName} state pharmacy law and ${profile?.boardName ?? "board"} regulations`
      : "federal pharmacy law (DEA, FDA, HIPAA) and uniform MPJE (UMPJE) multistate standards";

  const stateLawNote =
    variant === "state" && profile
      ? `State law basis: ${profile.highlights[0]}`
      : variant === "uniform"
        ? "Federal/uniform basis: DEA Controlled Substances Act, FDA pharmacy regulations, HIPAA Privacy Rule, NABP UMPJE framework."
        : "";

  const intro: Record<MpjeTemplate, string> = {
    "federal-law": "MPJE federal law items test DEA, FDA, and HIPAA authority applicable nationwide.",
    "state-law": "State practice act items require applying board-specific rules within the pharmacist's jurisdiction.",
    ethics: "Professional ethics require balancing patient welfare, legal compliance, and reporting duties.",
    dispensing: "Dispensing law requires valid prescriptions, DUR, and pharmacist verification before release.",
    "controlled-substances": "DEA schedule-specific rules govern quantity, refills, records, and reporting.",
  };

  return [
    intro[template],
    `Scope: ${scope} (${subjectLabel}).`,
    stateLawNote,
    `Correct: ${correct}.`,
    "Why other options are incorrect:",
    ...wrong.map((w) => `• ${w} — violates applicable pharmacy law or board standard.`),
  ]
    .filter(Boolean)
    .join("\n\n");
}

function scoreMpjeBankItem(item: BankItem): number {
  let score = 0.45;
  if (item.question.length > 150) score += 0.1;
  if (/pharmacist|pharmacy|DEA|controlled|HIPAA|board|prescription/i.test(item.question)) score += 0.15;
  if (item.explanation.length > 120) score += 0.1;
  if (/federal|state|regulation|statute|practice act/i.test(item.explanation)) score += 0.1;
  return Math.min(1, score);
}

export function needsMpjePolish(item: BankItem): boolean {
  return (
    scoreMpjeBankItem(item) < 0.65 ||
    !/pharmacist|pharmacy law|DEA|controlled|board/i.test(item.question)
  );
}

export function polishMpjeBankItem(
  item: BankItem,
  subjectId: string,
  subjectLabel = "MPJE pharmacy law",
  seed = 0,
  options?: { variant?: MpjeVariant; stateCode?: string; forceContextualize?: boolean }
): MpjePolishResult {
  const qualityBefore = scoreMpjeBankItem(item);
  const variant = options?.variant ?? "uniform";
  const state = getMpjeState(options?.stateCode);

  const skipPolish =
    !options?.forceContextualize &&
    !needsMpjePolish(item) &&
    qualityBefore >= 0.75;

  if (skipPolish) {
    return { item, changed: false, qualityBefore, qualityAfter: qualityBefore };
  }

  const scenario = pickScenario(seed + (subjectId?.length ?? 0) + item.question.length);
  const template = detectTemplate(subjectId, seed, variant);
  const rebuilt = rebuildQuestion(
    template,
    scenario,
    subjectLabel,
    variant,
    state?.code,
    state?.name,
    seed
  );

  const working: BankItem = {
    ...item,
    question: rebuilt.question,
    options: rebuilt.options,
    correctAnswer: rebuilt.correctAnswer,
    explanation: rebuilt.explanation,
    tags: [
      ...(item.tags ?? []).filter((t) => t !== "generated"),
      "mpje-polished",
      template,
      variant,
      ...(state ? [`state-${state.code}`] : []),
      subjectId,
    ],
  };

  let exam: ExamQuestion = {
    id: 1,
    type: "multiple_choice",
    question: working.question,
    options: [...working.options],
    correctAnswer: working.correctAnswer,
    explanation: working.explanation,
    tags: working.tags,
    highYield: true,
    references: [
      variant === "uniform"
        ? "NABP Uniform MPJE (UMPJE) content outline"
        : `NABP MPJE — ${state?.name ?? "state"} pharmacy practice act`,
      "DEA Pharmacist's Manual / Controlled Substances Act",
    ],
  };

  exam = enrichQuestion(exam, "mpje");

  const polished: BankItem = {
    ...working,
    question: exam.vignette
      ? `${exam.vignette}\n\n${exam.question.replace(exam.vignette, "").trim() || exam.question}`
      : exam.question,
    explanation: exam.explanation,
  };

  const qualityAfter = scoreMpjeBankItem(polished);
  const changed =
    polished.question !== item.question ||
    polished.correctAnswer !== item.correctAnswer ||
    polished.explanation !== item.explanation;

  return { item: polished, changed, qualityBefore, qualityAfter };
}
