import type { SearchResult } from "../search";
import type { BankItem } from "../question-bank";
import type { ExamQuestion, GeneratedExam } from "../ai";

/** Canonical subject area within a discipline (exam stratification). */
export type SubjectArea = {
  id: string;
  label: string;
  textbookRefs: string;
  examHints: string;
  keywords: string[];
  focusPlaceholder: string;
  contentArea?: string;
  /** Prerequisite subject IDs within the same discipline */
  prerequisites?: string[];
  /** Suggested difficulty progression 1 (intro) – 5 (advanced) */
  difficultyLevel?: number;
};

/** Hierarchical taxonomy node (domain → subdomain → topic). */
export type TaxonomyNode = {
  id: string;
  label: string;
  description?: string;
  subjectId?: string;
  /** Populated when taxonomy is linked to subject areas */
  subjectArea?: SubjectArea;
  prerequisites?: string[];
  difficultyLevel?: number;
  examWeight?: number;
  children?: TaxonomyNode[];
};

export type QuestionTemplateId =
  | "multiple_choice"
  | "case_study"
  | "clinical_vignette"
  | "calculation"
  | "prioritization"
  | "legal_scenario"
  | "code_analysis"
  | "diagram_interpretation"
  | "numerical_problem";

export type QuestionTemplate = {
  id: QuestionTemplateId;
  label: string;
  description: string;
  /** Prompt fragment injected when this template is active */
  promptFragment: string;
  supportedDifficulties?: ("easy" | "medium" | "hard")[];
};

export type CognitiveFramework = {
  name: string;
  levels: string[];
  /** How to map difficulty to cognitive demand for this discipline */
  difficultyMapping: Record<string, string>;
};

export type TerminologyRules = {
  preferredTerms?: string[];
  avoidTerms?: string[];
  abbreviationPolicy?: string;
  /** Field-specific naming (e.g. generic drug names in pharmacy) */
  namingConvention?: string;
};

export type DistractorPattern = {
  id: string;
  label: string;
  description: string;
  promptHint: string;
};

export type SourcePreferences = {
  oerDomains: string[];
  searchQueryHints?: string[];
  preferredSourceTypes?: string[];
};

export type SubjectCapabilities = {
  supportsCaseStudies?: boolean;
  supportsClinicalVignettes?: boolean;
  supportsDrugQuestions?: boolean;
  supportsCalculations?: boolean;
  supportsPrioritization?: boolean;
  supportsCodeAnalysis?: boolean;
  requiresCitationValidation?: boolean;
  requiresFormulaValidation?: boolean;
  requiresJurisdictionValidation?: boolean;
  allMultipleChoice?: boolean;
  defaultHighYield?: boolean;
};

export type DifficultyContext = {
  difficulty: string;
  subjectId?: string;
  topic: string;
  questionCount: number;
};

export type DifficultyEvaluation = {
  score: number;
  rationale: string;
  adjustments?: string[];
};

export type ConceptExtractionInput = {
  topic: string;
  subjectId?: string;
  researchBrief: string;
  sources: SearchResult[];
};

export type ExtractedConcepts = {
  concepts: string[];
  relationships: { from: string; to: string; type: string }[];
  highYieldTopics: string[];
};

export type ValidationInput = {
  exam: GeneratedExam;
  subjectId?: string;
  field: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export type ExamGenerationContext = {
  field: string;
  fieldId: string;
  topic: string;
  subjectId?: string;
  subject?: SubjectArea;
  difficulty: string;
  questionCount: number;
  sources: SearchResult[];
  researchBrief: string;
  /** MPJE: uniform (UMPJE) vs state-specific generation scope. */
  mpjeVariant?: "uniform" | "state";
  /** MPJE state/territory code when mpjeVariant is "state". */
  mpjeStateCode?: string;
};

export type ComposedPrompt = {
  system: string;
  user: string;
};

export type SubjectMetadata = {
  id: string;
  label: string;
  category: "professional" | "stem" | "humanities" | "certification" | "language";
  boardExam?: string;
  examFocus: string;
  topicPlaceholder: string;
  oerDomains: string[];
};

/**
 * Plugin contract for a discipline. Core engine calls these hooks;
 * domain intelligence lives only inside subject modules.
 */
export interface SubjectModule {
  metadata: SubjectMetadata;
  subjectAreas: SubjectArea[];
  taxonomy: TaxonomyNode;
  capabilities: SubjectCapabilities;
  cognitiveFramework: CognitiveFramework;
  terminologyRules: TerminologyRules;
  distractorPatterns: DistractorPattern[];
  questionTemplates: QuestionTemplate[];
  sourcePreferences: SourcePreferences;
  supportedQuestionTypes: QuestionTemplateId[];

  /** Board- or discipline-specific system prompt augmentation */
  getExamSystemAugmentation(): string;
  /** Layered user-prompt augmentation (injected after universal base) */
  getExamUserAugmentation(ctx: ExamGenerationContext): string;
  /** Search query bias for retrieval */
  buildSearchQueryHints?(topic: string, subjectId?: string): string[];

  extractConcepts(input: ConceptExtractionInput): Promise<ExtractedConcepts>;
  evaluateDifficulty(ctx: DifficultyContext): Promise<DifficultyEvaluation>;
  validateExam(input: ValidationInput): ValidationResult;
  buildBulkQuestion?(subject: SubjectArea, index: number): BankItem;
  scoreQuestionQuality?(question: ExamQuestion, ctx: ExamGenerationContext): number;
}
