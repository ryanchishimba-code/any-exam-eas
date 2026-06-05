import type { ExamQuestion } from "@/lib/ai";
import type { BankItem } from "@/lib/question-bank";
import { enrichQuestion } from "@/lib/engine/stages/enrich-questions";
import { polishNclexBankItem } from "@/lib/engine/polish/nclex-polish";
import { polishUsmleBankItem } from "@/lib/engine/polish/usmle-polish";
import { polishNaplexBankItem } from "@/lib/engine/polish/naplex-polish";
import {
  ensureClinicalVignette,
  hasOrphanDeicticStem,
  isVignetteRich,
  validateClinicalVignette,
} from "@/lib/engine/prompts/vignette";
import { OER_SOURCE_PRIORITY } from "@/lib/engine/prompts/oer-grounding";

export type SampleQuestionResult = {
  board: "NCLEX" | "USMLE" | "NAPLEX";
  fieldId: string;
  subjectId: string;
  subjectLabel: string;
  question: ExamQuestion;
  validationIssues: string[];
  passed: boolean;
};

/** Intentionally bad seed — tests vignette repair (orphan "these findings" stem). */
function orphanStemSeed(subjectId: string): BankItem {
  return {
    subjectId,
    question: "Which pathophysiologic process is most likely responsible for these findings?",
    options: [
      "Option A — placeholder",
      "Option B — placeholder",
      "Option C — placeholder",
      "Option D — placeholder",
    ],
    correctAnswer: "Option A — placeholder",
    explanation: "Placeholder explanation without clinical context.",
    tags: ["sample-generation", "orphan-stem-seed"],
  };
}

function bankItemToExamQuestion(item: BankItem, fieldId: string, board: string): ExamQuestion {
  const parts = item.question.split("\n\n");
  const hasSplit = parts.length >= 2;

  const raw: ExamQuestion = {
    id: 1,
    type: "multiple_choice",
    vignette: hasSplit ? parts[0] : undefined,
    question: hasSplit ? parts.slice(1).join("\n\n") : item.question,
    options: [...item.options],
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
    clinicalReasoning: item.solutionSteps?.join("\n"),
    references: [
      `Source [1] — ${OER_SOURCE_PRIORITY[board === "NCLEX" ? 0 : board === "USMLE" ? 1 : 2]}`,
      board === "NCLEX"
        ? "NCSBN NCLEX-RN Test Plan / Clinical Judgment Measurement Model"
        : board === "USMLE"
          ? "USMLE Content Outline / NBME-style clinical vignette"
          : "NABP NAPLEX Content Outline (2025)",
    ],
    tags: item.tags,
    highYield: true,
    topicCategory:
      board === "NCLEX"
        ? "Pharmacological Therapies"
        : board === "USMLE"
          ? "Cardiovascular"
          : "Medication Use Process",
    difficultyLabel: "Medium",
    bloomLevel: "apply",
  };

  return enrichQuestion(ensureClinicalVignette(raw), fieldId);
}

function buildSample(
  board: SampleQuestionResult["board"],
  fieldId: string,
  subjectId: string,
  subjectLabel: string,
  polished: BankItem,
  seed: number
): SampleQuestionResult {
  const question = bankItemToExamQuestion(polished, fieldId, board);
  question.id = seed;

  const validationIssues = validateClinicalVignette(question);
  const passed =
    validationIssues.length === 0 &&
    !hasOrphanDeicticStem(question) &&
    Boolean(question.vignette && isVignetteRich(question.vignette));

  return {
    board,
    fieldId,
    subjectId,
    subjectLabel,
    question,
    validationIssues,
    passed,
  };
}

/**
 * Generate 3 validated sample questions (NCLEX, USMLE, NAPLEX) using the
 * vignette + OER polish pipeline. Starts from orphan stems to prove repair logic.
 */
export function generateSampleQuestions(): SampleQuestionResult[] {
  const nclexPolished = polishNclexBankItem(
    orphanStemSeed("pharmacology-nursing"),
    "pharmacology-nursing",
    "Pharmacological & Parenteral Therapies",
    42
  );

  const usmlePolished = polishUsmleBankItem(
    orphanStemSeed("cardiology"),
    "usmle-step-1",
    "cardiology",
    "Cardiovascular",
    84
  );

  const naplexPolished = polishNaplexBankItem(
    orphanStemSeed("pharmacotherapy"),
    "pharmacotherapy",
    "Pharmacotherapy",
    126
  );

  return [
    buildSample(
      "NCLEX",
      "nursing",
      "pharmacology-nursing",
      "Pharmacological & Parenteral Therapies",
      nclexPolished.item,
      1
    ),
    buildSample(
      "USMLE",
      "usmle-step-1",
      "cardiology",
      "Cardiovascular",
      usmlePolished.item,
      2
    ),
    buildSample("NAPLEX", "pharmacy", "pharmacotherapy", "Pharmacotherapy", naplexPolished.item, 3),
  ];
}

function extractLeadInStem(q: ExamQuestion): string {
  const vignette = q.vignette?.trim() ?? "";
  const combined = q.question.trim();
  if (vignette && combined.startsWith(vignette)) {
    return combined.slice(vignette.length).trim();
  }
  return combined;
}

export function formatSampleQuestionForDisplay(result: SampleQuestionResult): string {
  const q = result.question;
  const leadIn = extractLeadInStem(q);
  const lines = [
    `=== ${result.board} (${result.subjectLabel}) ===`,
    `Passed validation: ${result.passed ? "YES" : "NO"}`,
    ...(result.validationIssues.length
      ? [`Issues: ${result.validationIssues.join("; ")}`]
      : []),
    "",
    "VIGNETTE:",
    q.vignette ?? "(missing)",
    "",
    "STEM:",
    leadIn,
    "",
    "OPTIONS:",
    ...(q.options ?? []).map((o, i) => `  ${String.fromCharCode(65 + i)}. ${o}`),
    "",
    `CORRECT: ${q.correctAnswer}`,
    "",
    "RATIONALE (excerpt):",
    (q.explanation ?? "").slice(0, 500) + (q.explanation && q.explanation.length > 500 ? "…" : ""),
    "",
    "REFERENCES:",
    ...(q.references ?? []).map((r) => `  - ${r}`),
    "",
  ];
  return lines.join("\n");
}
