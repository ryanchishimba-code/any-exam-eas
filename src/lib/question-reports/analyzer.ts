import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import { bankItemPassesIngestGate } from "@/lib/exam-prep/bank-ingest-gate";
import { auditUsmleQaEditor } from "@/lib/exam-prep/usmle-qa-editor";
import { isUsmleField } from "@/lib/exam-prep/usmle-bank-bridge";
import { hasGenericPlaceholderOptions, normalizeQuestionOptions } from "@/lib/question-format";
import { SESSION_QUALITY_REQUIREMENTS } from "@/lib/questions/session-quality";
import type {
  QuestionReportProposedFix,
  QuestionReportReason,
  QuestionReportSystemIssue,
  SubmitQuestionReportInput,
} from "./types";

const USER_REASON_ISSUES: Record<
  QuestionReportReason,
  { code: string; message: string; severity: "error" | "warn" | "info" }
> = {
  wrong_answer: {
    code: "user_wrong_answer",
    message: "Student reports the keyed correct answer may be incorrect.",
    severity: "error",
  },
  unclear: {
    code: "user_unclear_stem",
    message: "Student reports the stem or vignette is ambiguous.",
    severity: "warn",
  },
  typo: {
    code: "user_typo",
    message: "Student reports a typo or formatting error.",
    severity: "warn",
  },
  weak_distractors: {
    code: "user_weak_distractors",
    message: "Student reports distractors are unrealistic or too easy to eliminate.",
    severity: "warn",
  },
  duplicate: {
    code: "user_duplicate",
    message: "Student reports this item duplicates another question.",
    severity: "info",
  },
  outdated: {
    code: "user_outdated",
    message: "Student reports clinical or exam content may be outdated.",
    severity: "warn",
  },
  other: {
    code: "user_other",
    message: "Student submitted a general quality concern.",
    severity: "info",
  },
};

function buildBankItemFromInput(input: SubmitQuestionReportInput): BankItem {
  return {
    id: input.bankItemId,
    subjectId: input.subjectId ?? "unknown",
    question: input.stemPreview ?? input.questionKey,
    options: input.options ?? [],
    correctAnswer: input.correctAnswer ?? "",
    explanation: "Reported item — explanation not included in snapshot.",
    vignette: undefined,
  };
}

function buildGenerationNotes(fieldId: string, issueCodes: string[]): string {
  const lines = [
    "Future generation must obey platform question rules:",
    `- ${SESSION_QUALITY_REQUIREMENTS.exactCount}`,
    `- ${SESSION_QUALITY_REQUIREMENTS.strongDistractors}`,
  ];

  if (issueCodes.includes("generic_placeholder_options")) {
    lines.push("- Replace placeholder options (Option A/B) with four board-plausible clinical distractors.");
  }
  if (issueCodes.includes("orphan_deictic_stem")) {
    lines.push("- Pair deictic stems ('these findings') with a preceding clinical vignette.");
  }
  if (issueCodes.includes("user_wrong_answer")) {
    lines.push("- Cross-check keyed answer against current guidelines before publishing.");
  }
  if (fieldId === "nursing" || fieldId.startsWith("usmle")) {
    lines.push("- Include age, setting, vitals/labs, and a discriminating lead-in for clinical items.");
  }
  if (fieldId === "pharmacy") {
    lines.push("- NAPLEX items need patient-specific context, aligned calculations, and cited rationale.");
  }

  return lines.join("\n");
}

function buildProposedFix(
  item: BankItem,
  issues: QuestionReportSystemIssue[]
): QuestionReportProposedFix {
  const codes = new Set(issues.map((i) => i.code));
  const changes: QuestionReportProposedFix["changes"] = {};
  const changeSummary: string[] = [];
  let autoApplicable = false;

  if (codes.has("generic_placeholder_options") && item.options.length === 4) {
    const normalized = normalizeQuestionOptions(item.options, item.correctAnswer);
    if (!hasGenericPlaceholderOptions(normalized.options)) {
      changes.options = normalized.options;
      changes.correctAnswer = normalized.correctAnswer;
      changeSummary.push(
        "Replace placeholder distractors with board-plausible clinical options (auto-synthesized where needed)."
      );
      autoApplicable = true;
    }
  }

  if (codes.has("empty_explanation") || codes.has("short_explanation")) {
    changeSummary.push(
      "Expand explanation with why the correct answer is best and why each distractor fails (manual editorial required)."
    );
  }

  if (codes.has("user_wrong_answer")) {
    changeSummary.push(
      "Verify keyed answer against current references; update correctAnswer and explanation if the student is correct."
    );
    if (item.correctAnswer) {
      changes.correctAnswer = item.correctAnswer;
      changeSummary.push(`Current keyed answer: "${item.correctAnswer.slice(0, 120)}".`);
    }
  }

  if (codes.has("orphan_deictic_stem")) {
    changeSummary.push(
      "Add or restore a clinical vignette above the stem so 'these findings' references explicit data."
    );
  }

  if (codes.has("usmle_short_stem")) {
    changeSummary.push(
      "Add a board-style vignette (demographics, presentation, vitals/labs) before the lead-in question."
    );
  }

  if (changeSummary.length === 0) {
    changeSummary.push("Manual editorial review recommended — no safe automated patch identified.");
  }

  return { changes, changeSummary, autoApplicable };
}

export type QuestionReportAnalysis = {
  issueSummary: string;
  issueCodes: string[];
  systemIssues: QuestionReportSystemIssue[];
  proposedFix: QuestionReportProposedFix;
  generationNotes: string;
};

/** Rule-based triage aligned with ingest and serve quality gates. */
export function analyzeReportedQuestion(
  input: SubmitQuestionReportInput,
  bankItem?: BankItem | null
): QuestionReportAnalysis {
  const item = bankItem ?? buildBankItemFromInput(input);
  const systemIssues: QuestionReportSystemIssue[] = [];

  systemIssues.push({
    ...USER_REASON_ISSUES[input.reason],
    source: "user",
  });

  if (input.message?.trim()) {
    systemIssues.push({
      code: "user_comment",
      message: input.message.trim(),
      severity: "info",
      source: "user",
    });
  }

  const audit = auditBankItem(item, input.fieldId);
  for (const issue of audit.issues) {
    systemIssues.push({
      code: issue.code,
      message: issue.message,
      severity: issue.severity,
      source: "audit",
    });
  }

  if (!bankItemPassesIngestGate(input.fieldId, item, "seed")) {
    systemIssues.push({
      code: "ingest_gate_fail",
      message: "Item would not pass the same ingest gate used before questions reach students.",
      severity: "error",
      source: "serve_gate",
    });
  }

  if (isUsmleField(input.fieldId) || input.fieldId === "pance" || input.fieldId === "aanp-fnp") {
    const usmleQa = auditUsmleQaEditor(item, {
      fieldId: input.fieldId,
      source: "reported",
      itemId: item.id,
      difficulty: item.difficulty ?? null,
    });
    for (const issue of usmleQa.issues.filter((i) => i.severity !== "info").slice(0, 6)) {
      systemIssues.push({
        code: issue.code,
        message: issue.message,
        severity: issue.severity,
        source: "field_qa",
      });
    }
  }

  const issueCodes = [...new Set(systemIssues.map((i) => i.code))];
  const errors = systemIssues.filter((i) => i.severity === "error");
  const warns = systemIssues.filter((i) => i.severity === "warn");

  const issueSummary =
    errors.length > 0
      ? `${errors.length} critical issue(s) detected${warns.length ? ` and ${warns.length} warning(s)` : ""}.`
      : warns.length > 0
        ? `${warns.length} editorial warning(s) detected — review recommended.`
        : "No automated gate failures; student report may reflect subjective difficulty or edge case.";

  const proposedFix = buildProposedFix(item, systemIssues);
  const generationNotes = buildGenerationNotes(input.fieldId, issueCodes);

  return {
    issueSummary,
    issueCodes,
    systemIssues,
    proposedFix,
    generationNotes,
  };
}
