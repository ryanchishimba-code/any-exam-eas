import type { SubjectModule } from "../types";
import { MPJE_SUBJECTS } from "./subjects";
import { MPJE_DISTRACTOR_PATTERNS } from "./distractors";
import { MPJE_TAXONOMY } from "./taxonomy";
import { getMpjeState } from "@/lib/mpje/config";
import { MPJE_EXAM_SYSTEM_AUGMENTATION, getMpjeUserAugmentation } from "./prompts";
import { validateMpjeExam, scoreMpjeQuestionQuality } from "./validation";
import { evaluateMpjeDifficulty } from "./difficulty";
import { extractMpjeConcepts } from "./concepts";

export const mpjeModule: SubjectModule = {
  metadata: {
    id: "mpje",
    label: "MPJE",
    category: "professional",
    boardExam: "MPJE",
    examFocus:
      "pharmacy law, federal and state regulations, controlled substances, dispensing rules, ethics, HIPAA, compounding",
    topicPlaceholder: "Select MPJE area (e.g. Controlled Substances, State Practice Act)",
    oerDomains: ["fda.gov", "deadiversion.usdoj.gov", "hhs.gov", "nabp.pharmacy"],
  },
  subjectAreas: MPJE_SUBJECTS,
  taxonomy: MPJE_TAXONOMY,
  capabilities: {
    supportsDrugQuestions: false,
    supportsCalculations: false,
    requiresCitationValidation: true,
    requiresJurisdictionValidation: true,
    allMultipleChoice: true,
    defaultHighYield: true,
  },
  cognitiveFramework: {
    name: "MPJE jurisprudence",
    levels: ["recall", "application", "analysis"],
    difficultyMapping: {
      easy: "single-rule recall",
      medium: "scenario application",
      hard: "federal vs state conflict resolution",
    },
  },
  terminologyRules: {
    namingConvention: "Cite statutes/regulations by common name (DEA, HIPAA, practice act).",
  },
  distractorPatterns: MPJE_DISTRACTOR_PATTERNS,
  questionTemplates: [
    {
      id: "legal_scenario",
      label: "Legal scenario MCQ",
      description: "Pharmacy practice fact pattern → regulatory application",
      promptFragment: "Scenario with pharmacist role; four options testing law application.",
    },
  ],
  sourcePreferences: {
    oerDomains: ["fda.gov", "deadiversion.usdoj.gov", "nabp.pharmacy"],
    searchQueryHints: ["MPJE", "pharmacy law", "jurisprudence", "DEA", "practice act"],
  },
  supportedQuestionTypes: ["multiple_choice", "legal_scenario"],
  getExamSystemAugmentation: () => MPJE_EXAM_SYSTEM_AUGMENTATION,
  getExamUserAugmentation: (ctx) => {
    const state = ctx.mpjeStateCode ? getMpjeState(ctx.mpjeStateCode) : undefined;
    return getMpjeUserAugmentation({
      variant: ctx.mpjeVariant ?? "uniform",
      stateCode: ctx.mpjeStateCode,
      stateName: state?.name ?? ctx.topic,
    });
  },
  buildSearchQueryHints: (topic, subjectId) => {
    const hints = ["MPJE", "pharmacy law", "jurisprudence"];
    const isStateTopic =
      subjectId === "state-practice-act" || /state[- ]specific/i.test(topic);
    if (isStateTopic) {
      hints.push(
        `${topic} pharmacy practice act`,
        `${topic} board of pharmacy regulations`,
        `${topic} state MPJE dispensing rules`
      );
    } else {
      hints.push("Uniform MPJE UMPJE", "DEA FDA HIPAA federal pharmacy law");
    }
    if (subjectId) hints.push(subjectId);
    return hints;
  },
  extractConcepts: extractMpjeConcepts,
  evaluateDifficulty: evaluateMpjeDifficulty,
  validateExam: validateMpjeExam,
  scoreQuestionQuality: scoreMpjeQuestionQuality,
};
