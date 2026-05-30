import type {
  ConceptExtractionInput,
  DifficultyContext,
  DifficultyEvaluation,
  ExtractedConcepts,
  SubjectArea,
  SubjectCapabilities,
  SubjectMetadata,
  SubjectModule,
  TaxonomyNode,
  ValidationInput,
  ValidationResult,
} from "./types";
import { linkTaxonomyToSubjects } from "./taxonomy";

type CreateModuleConfig = {
  metadata: SubjectMetadata;
  subjectAreas: SubjectArea[];
  capabilities?: SubjectCapabilities;
  systemAugmentation: string;
  userAugmentation?: string;
  searchHints?: (topic: string, subjectId?: string) => string[];
  distractorPatterns?: SubjectModule["distractorPatterns"];
};

function genericValidate(input: ValidationInput): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  for (const q of input.exam.questions) {
    if (!q.options || q.options.length < 2) {
      errors.push(`Question ${q.id}: needs at least 2 options.`);
    }
    if (q.options && !q.options.includes(q.correctAnswer)) {
      errors.push(`Question ${q.id}: correctAnswer must match an option.`);
    }
  }
  return { valid: errors.length === 0, errors, warnings };
}

function buildTaxonomy(metadata: SubjectMetadata, areas: SubjectArea[]): TaxonomyNode {
  const root: TaxonomyNode = {
    id: metadata.id,
    label: metadata.label,
    children: areas.map((a) => ({
      id: a.id,
      label: a.label,
      subjectId: a.id,
    })),
  };
  return linkTaxonomyToSubjects(root, areas);
}

export function createSubjectModule(config: CreateModuleConfig): SubjectModule {
  const capabilities: SubjectCapabilities = {
    supportsCalculations: config.metadata.category === "stem",
    supportsClinicalVignettes: config.metadata.category === "professional",
    allMultipleChoice: true,
    defaultHighYield: true,
    ...config.capabilities,
  };

  return {
    metadata: config.metadata,
    subjectAreas: config.subjectAreas,
    taxonomy: buildTaxonomy(config.metadata, config.subjectAreas),
    capabilities,
    cognitiveFramework: {
      name: `${config.metadata.label} exam ladder`,
      levels: ["recall", "application", "analysis", "synthesis"],
      difficultyMapping: {
        easy: "recall and foundational concepts",
        medium: "application and interpretation",
        hard: "analysis, synthesis, and multi-step reasoning",
      },
    },
    terminologyRules: {
      namingConvention: `Use standard ${config.metadata.label.toLowerCase()} terminology.`,
    },
    distractorPatterns: config.distractorPatterns ?? [
      {
        id: "plausible-error",
        label: "Plausible error",
        description: "Common misconception",
        promptHint: "Distractors reflect typical student errors, not absurd options.",
      },
    ],
    questionTemplates: [
      {
        id: "multiple_choice",
        label: "Multiple choice",
        description: "Single best answer",
        promptFragment: "Single best answer, exactly 4 options.",
      },
      {
        id: "calculation",
        label: "Calculation",
        description: "Numeric or formula-based",
        promptFragment: "Include necessary data in stem; distractors = common calculation errors.",
      },
    ],
    sourcePreferences: { oerDomains: config.metadata.oerDomains },
    supportedQuestionTypes: ["multiple_choice", "calculation", "clinical_vignette"],

    getExamSystemAugmentation: () => config.systemAugmentation,
    getExamUserAugmentation: () => config.userAugmentation ?? "",
    buildSearchQueryHints: config.searchHints,

    extractConcepts: async (input: ConceptExtractionInput): Promise<ExtractedConcepts> => ({
      concepts: [input.topic, config.metadata.label],
      relationships: [],
      highYieldTopics: [input.topic],
    }),

    evaluateDifficulty: async (ctx: DifficultyContext): Promise<DifficultyEvaluation> => ({
      score: ctx.difficulty === "hard" ? 0.8 : 0.5,
      rationale: `${config.metadata.label} difficulty aligned to ${ctx.difficulty}.`,
      adjustments: [],
    }),

    validateExam: genericValidate,
  };
}
