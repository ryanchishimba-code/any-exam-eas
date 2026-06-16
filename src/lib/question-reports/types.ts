export const QUESTION_REPORT_REASONS = [
  { id: "wrong_answer", label: "Wrong answer keyed" },
  { id: "unclear", label: "Unclear or ambiguous stem" },
  { id: "typo", label: "Typo or formatting error" },
  { id: "weak_distractors", label: "Weak or unrealistic distractors" },
  { id: "duplicate", label: "Duplicate or too similar to another item" },
  { id: "outdated", label: "Outdated clinical or exam content" },
  { id: "other", label: "Other issue" },
] as const;

export type QuestionReportReason = (typeof QUESTION_REPORT_REASONS)[number]["id"];

export type QuestionReportStatus = "open" | "applied" | "resolved" | "dismissed";

export type QuestionReportAnalysisStatus = "pending" | "complete" | "failed";

export type QuestionReportSystemIssue = {
  code: string;
  message: string;
  severity: "error" | "warn" | "info";
  source: "audit" | "serve_gate" | "user" | "field_qa";
};

export type QuestionReportProposedFix = {
  /** Fields that would change on the bank item if applied. */
  changes: Partial<{
    question: string;
    scenario: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }>;
  /** Human-readable summary of each change for admin review. */
  changeSummary: string[];
  /** Whether automated apply is safe without manual edit. */
  autoApplicable: boolean;
};

export type QuestionReportListItem = {
  id: string;
  createdAt: string;
  status: QuestionReportStatus;
  analysisStatus: QuestionReportAnalysisStatus;
  reason: string;
  message: string | null;
  fieldId: string;
  examSlug: string | null;
  examName: string | null;
  subjectId: string | null;
  stemPreview: string | null;
  issueSummary: string | null;
  issueCodes: string[];
  bankItemId: string | null;
  userEmail: string | null;
};

export type QuestionReportDetail = QuestionReportListItem & {
  questionKey: string;
  sessionId: string | null;
  sessionMode: string | null;
  selectedAnswer: string | null;
  optionsSnapshot: string[] | null;
  correctAnswerSnapshot: string | null;
  systemIssues: QuestionReportSystemIssue[];
  proposedFix: QuestionReportProposedFix | null;
  generationNotes: string | null;
  appliedAt: string | null;
  resolvedAt: string | null;
};

export type SubmitQuestionReportInput = {
  bankItemId?: string;
  questionKey: string;
  fieldId: string;
  examSlug?: string;
  subjectId?: string;
  sessionId?: string;
  sessionMode?: string;
  reason: QuestionReportReason;
  message?: string;
  selectedAnswer?: string;
  stemPreview?: string;
  options?: string[];
  correctAnswer?: string;
};
