/**
 * Deterministic + optional AI repair for AANP FNP bank items before QC rejection.
 */
import OpenAI from "openai";
import type { BankItem } from "@/lib/question-bank";
import type { ExamQuestion } from "@/lib/ai";
import {
  normalizeLeadInStem,
  splitCombinedStem,
  validateClinicalVignette,
} from "@/lib/engine/prompts/vignette";
import { normalizeUsmleBankItemFields, splitUsmleBankItem } from "../usmle-clinical-gate";
import { bankItemPassesIngestGate } from "../bank-ingest-gate";
import { bankItemToUsmleExam } from "../usmle-bank-bridge";
import { assessAanpFnpBankItem } from "./quality-gate";
import { AANP_FNP_CLINICAL_GATE_CHECKLIST } from "./clinical-gate-prompt";

const FIELD_ID = "aanp-fnp";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/** Normalize age phrasing for vignette gate regexes (e.g. "52 year old" → "52-year-old"). */
export function normalizeAgePhrasing(text: string): string {
  return text
    .replace(/\b(\d{1,3})\s+year\s+old\b/gi, "$1-year-old")
    .replace(/\b(\d{1,2})\s+week\s+old\b/gi, "$1-week-old")
    .replace(/\b(\d{1,2})\s+month\s+old\b/gi, "$1-month-old")
    .replace(/\b(\d{1,2})\s+day\s+old\b/gi, "$1-day-old");
}

function bankItemToExamQuestion(item: BankItem): ExamQuestion {
  const { vignette, stem } = splitUsmleBankItem(item);
  return {
    question: stem,
    vignette: vignette ?? "",
    options: item.options ?? [],
    correctAnswer: item.correctAnswer,
    explanation: item.explanation ?? "",
    type: "mcq",
  };
}

function examQuestionToBankItemFields(item: BankItem, exam: ExamQuestion): BankItem {
  return {
    ...item,
    vignette: exam.vignette?.trim() || item.vignette,
    question: normalizeLeadInStem(exam.question.trim()),
    options: exam.options?.length ? exam.options : item.options,
    correctAnswer: exam.correctAnswer ?? item.correctAnswer,
    explanation: exam.explanation?.trim() || item.explanation,
  };
}

/** Fast local fixes — split combined stems, normalize age phrasing, lead-in stems. */
export function repairAanpFnpBankItemDeterministic(item: BankItem): BankItem {
  let normalized = normalizeUsmleBankItemFields(item);

  const exam = splitCombinedStem(bankItemToExamQuestion(normalized));
  const repairedExam: ExamQuestion = {
    ...exam,
    vignette: exam.vignette ? normalizeAgePhrasing(exam.vignette) : exam.vignette,
    question: normalizeLeadInStem(exam.question),
  };

  normalized = examQuestionToBankItemFields(normalized, repairedExam);

  if (normalized.scenario && !normalized.vignette) {
    normalized = { ...normalized, vignette: normalizeAgePhrasing(normalized.scenario) };
  }

  return normalized;
}

export type AanpFnpRepairResult = {
  item: BankItem;
  repaired: boolean;
  method: "none" | "deterministic" | "ai";
  issuesBefore: string[];
  issuesAfter: string[];
};

/** Repair item and return whether it passes the hybrid ingest bar. */
export function tryRepairAanpFnpBankItem(
  item: BankItem,
  opts: { source?: string | null } = {}
): AanpFnpRepairResult {
  const source = opts.source ?? "generated";
  const before = assessAanpFnpBankItem(item, { fieldId: FIELD_ID, source });
  const issuesBefore = [...before.issues];

  if (bankItemPassesIngestGate(FIELD_ID, item, source)) {
    return {
      item,
      repaired: false,
      method: "none",
      issuesBefore,
      issuesAfter: [],
    };
  }

  const deterministic = repairAanpFnpBankItemDeterministic(item);
  const afterDet = assessAanpFnpBankItem(deterministic, { fieldId: FIELD_ID, source });
  if (bankItemPassesIngestGate(FIELD_ID, deterministic, source)) {
    return {
      item: deterministic,
      repaired: true,
      method: "deterministic",
      issuesBefore,
      issuesAfter: afterDet.issues,
    };
  }

  return {
    item: deterministic,
    repaired: true,
    method: "deterministic",
    issuesBefore,
    issuesAfter: afterDet.issues,
  };
}

/** AI vignette repair when deterministic fixes are insufficient. */
export async function repairAanpFnpBankItemWithAi(
  item: BankItem,
  issues: string[]
): Promise<BankItem | null> {
  if (!openai || issues.length === 0) return null;

  const exam = bankItemToUsmleExam(repairAanpFnpBankItemDeterministic(item), 0);
  const validationIssues = validateClinicalVignette(exam);
  const allIssues = [...new Set([...issues, ...validationIssues])];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    max_tokens: 2000,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You fix AANP FNP clinical vignette MCQs. Preserve the tested concept, correct answer, and distractors unless a distractor is invalid. Return JSON only.",
      },
      {
        role: "user",
        content: `Fix this question so it passes clinical vignette QA.

${AANP_FNP_CLINICAL_GATE_CHECKLIST}

Issues to fix:
${allIssues.map((i) => `- ${i}`).join("\n")}

Rules:
- vignette: 2–4 sentences with age (use "N-year-old" format), setting, CC, history/meds, objective data (vitals/labs/exam)
- question: lead-in stem only, ending with ?
- Keep exactly 4 options; correctAnswer must match one option exactly
- Do not change the clinical concept being tested

Current item:
${JSON.stringify(
  {
    vignette: exam.vignette,
    question: exam.question,
    options: exam.options,
    correctAnswer: exam.correctAnswer,
    explanation: exam.explanation?.slice(0, 400),
  },
  null,
  2
)}

Return: { "vignette": "...", "question": "...", "options": [...], "correctAnswer": "...", "explanation": "..." }`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  let parsed: Partial<ExamQuestion>;
  try {
    parsed = JSON.parse(raw) as Partial<ExamQuestion>;
  } catch {
    return null;
  }

  if (!parsed.question || !parsed.correctAnswer || !parsed.options?.length) return null;

  const merged = examQuestionToBankItemFields(item, {
    ...exam,
    vignette: parsed.vignette ?? exam.vignette,
    question: parsed.question,
    options: parsed.options,
    correctAnswer: parsed.correctAnswer,
    explanation: parsed.explanation ?? exam.explanation,
  });

  return repairAanpFnpBankItemDeterministic(merged);
}

/** Full repair chain: deterministic → optional AI → hybrid ingest gate. */
export async function repairAanpFnpBankItemForIngest(
  item: BankItem,
  opts: { source?: string | null; useAi?: boolean } = {}
): Promise<{ item: BankItem; accepted: boolean; method: AanpFnpRepairResult["method"] }> {
  const { runAanpFnpHybridGate } = await import("./hybrid-gate");
  const result = await runAanpFnpHybridGate(item, {
    source: opts.source,
    useAiRepair: opts.useAi !== false,
  });
  return {
    item: result.item,
    accepted: result.ingestReady,
    method: result.repairMethod,
  };
}
