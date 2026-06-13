/**
 * Smart USMLE curation engine — heuristic QA → rule polish → AI Self-RAG repair.
 */
import OpenAI from "openai";
import type { ExamQuestion } from "@/lib/ai";
import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import {
  normalizeUsmleBankItemFields,
  splitUsmleBankItem,
} from "@/lib/exam-prep/usmle-clinical-gate";
import { bankItemToUsmleExam } from "@/lib/exam-prep/usmle-bank-bridge";
import { auditUsmleQaEditor, type UsmleQaReport } from "@/lib/exam-prep/usmle-qa-editor";
import {
  applyUsmleStemRepairs,
  needsUsmlePolish,
  polishUsmleBankItem,
} from "@/lib/engine/polish/usmle-polish";
import { VIGNETTE_REQUIREMENTS } from "@/lib/engine/prompts/vignette";
import { getFieldSubject } from "@/lib/field-subjects";
import { gatherStudyMaterial } from "@/lib/research";
import {
  passesQualityGate,
  reflectOnQuestion,
  regenerateQuestion,
} from "@/lib/rag/self-rag";
import type { RetrievedChunk, SelfRagReflection } from "@/lib/rag/types";
import { examQuestionToBankItem } from "./exam-to-bank";

let openaiClient: OpenAI | null | undefined;

function getOpenAI(): OpenAI | null {
  if (openaiClient !== undefined) return openaiClient;
  openaiClient = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;
  return openaiClient;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withOpenAiRetry<T>(fn: () => Promise<T>, maxAttempts = 4): Promise<T> {
  let delayMs = 5000;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const rateLimited = message.includes("429") || message.includes("rate limit");
      if (!rateLimited || attempt === maxAttempts - 1) throw error;
      await sleep(delayMs);
      delayMs = Math.min(delayMs * 2, 120_000);
    }
  }
  throw new Error("OpenAI retry exhausted");
}

export type UsmleCurationAction =
  | "accepted"
  | "rule_polished"
  | "ai_curated"
  | "rejected";

export type UsmleCurationResult = {
  item: BankItem;
  action: UsmleCurationAction;
  before: UsmleQaReport;
  after: UsmleQaReport;
  bankOk: boolean;
  reflection?: SelfRagReflection;
  notes: string[];
};

export type UsmleCuratorOptions = {
  fieldId: string;
  itemId?: string;
  source?: string;
  difficulty?: number | null;
  /** Minimum editorial overall score to accept without AI (default 8). */
  minAcceptScore?: number;
  /** Max AI rewrite attempts (default 2). */
  maxAiAttempts?: number;
  /** Fetch RAG context for AI repair (default true when API key set). */
  useRag?: boolean;
  /** Skip OpenAI even if key is present. */
  offline?: boolean;
  /** Skip rule polish — go straight to AI repair (hash-collision retries). */
  aiOnly?: boolean;
  /** Skip rule polish for failing items — use AI rewrite directly (default when API available). */
  aiFirst?: boolean;
  seed?: number;
};

const USMLE_CURATOR_SYSTEM = `You are a senior USMLE item writer (UWorld/NBME editorial standard).

Rewrite ONE multiple-choice question so the vignette, stem, options, correct answer, and explanation are clinically coherent.

${VIGNETTE_REQUIREMENTS}

USMLE EDITORIAL RULES:
- Step 1: emphasize mechanism, pathophysiology, pharmacology MOA, or lab interpretation.
- Step 2 CK / Step 3: emphasize diagnosis, next best step, initial test, or management — use current guideline language.
- All eligibility criteria for the keyed answer MUST appear in the vignette (not only in the explanation).
- Provide 4 or 5 plausible distractors — no joke options, no "defer/discharge without workup" unless clinically appropriate.
- Explanation must state why the correct answer fits AND why each distractor fails (UWorld style).
- correctAnswer must exactly match one option string.

Return JSON:
{
  "vignette": "2-4 sentence clinical scenario",
  "question": "USMLE lead-in ending with ?",
  "options": ["...", "..."],
  "correctAnswer": "exact option text",
  "explanation": "comprehensive rationale",
  "clinicalReasoning": "2-4 sentence reasoning chain",
  "distractorRationale": { "wrong option text": "why incorrect" },
  "tags": ["topic-tag", "ai-curated"]
}`;

function stepLabel(fieldId: string): string {
  if (fieldId === "usmle-step-1") return "USMLE Step 1";
  if (fieldId === "usmle-step-3") return "USMLE Step 3";
  return "USMLE Step 2 CK";
}

function auditItem(
  item: BankItem,
  opts: UsmleCuratorOptions
): UsmleQaReport {
  return auditUsmleQaEditor(item, {
    fieldId: opts.fieldId,
    source: opts.source,
    itemId: opts.itemId,
    difficulty: opts.difficulty,
  });
}

function isAcceptable(qa: UsmleQaReport, bankOk: boolean, minScore: number): boolean {
  return qa.examReady && qa.overallScore >= minScore && bankOk;
}

function toRetrievedChunk(
  id: string,
  title: string,
  content: string,
  sourceType: RetrievedChunk["sourceType"] = "web"
): RetrievedChunk {
  return {
    id,
    documentId: id,
    title,
    content,
    chunkIndex: 0,
    sourceType,
    url: "",
    vectorScore: 1,
    keywordScore: 1,
    hybridScore: 1,
  };
}

function researchChunks(brief: string, sources: { title: string; snippet: string }[]): RetrievedChunk[] {
  const chunks = sources
    .slice(0, 6)
    .map((s, i) => toRetrievedChunk(`src-${i}`, s.title, s.snippet));
  if (brief.trim()) {
    chunks.unshift(toRetrievedChunk("brief", "Research brief", brief.slice(0, 1200), "curriculum"));
  }
  return chunks;
}

async function fetchRagContext(
  fieldId: string,
  subjectId: string,
  item: BankItem
): Promise<RetrievedChunk[]> {
  const topic = item.tags?.[0] ?? subjectId;
  try {
    const material = await gatherStudyMaterial(fieldId, topic, subjectId, {
      useAdvancedRag: true,
    });
    return (
      material.advanced?.retrievedChunks ??
      researchChunks(
        material.researchBrief,
        material.sources.map((s) => ({ title: s.title, snippet: s.content }))
      )
    );
  } catch {
    return [];
  }
}

function stripChartBoilerplate(text: string): string {
  return text
    .replace(/\s*Encounter\s+\d+\.?\s*$/i, "")
    .replace(/\s*Handoff ref\s+\d+\.?\s*$/i, "")
    .trim();
}

function parseAiBankItem(raw: string, base: BankItem): BankItem | null {
  try {
    const parsed = JSON.parse(raw) as ExamQuestion & {
      vignette?: string;
      question?: string;
      options?: string[];
    };
    const vignette = stripChartBoilerplate(parsed.vignette?.trim() ?? "");
    const question = stripChartBoilerplate(parsed.question?.trim() ?? "");
    if (!question || !parsed.correctAnswer?.trim()) return null;
    if (!vignette || vignette.length < 40) return null;
    if (!Array.isArray(parsed.options) || parsed.options.length < 4) return null;
    if (!parsed.options.includes(parsed.correctAnswer)) return null;

    const exam: ExamQuestion = {
      id: 1,
      type: "multiple_choice",
      vignette,
      question,
      options: parsed.options.map((o) => o.trim()),
      correctAnswer: parsed.correctAnswer.trim(),
      explanation: parsed.explanation ?? "",
      clinicalReasoning: parsed.clinicalReasoning,
      distractorRationale: parsed.distractorRationale,
      tags: parsed.tags,
    };

    return normalizeUsmleBankItemFields(examQuestionToBankItem(exam, base));
  } catch {
    return null;
  }
}

/** USMLE-tuned AI rewrite with explicit editorial JSON schema. */
export async function regenerateUsmleBankItemWithAi(params: {
  item: BankItem;
  reflection: SelfRagReflection;
  chunks: RetrievedChunk[];
  fieldId: string;
  subjectId: string;
}): Promise<BankItem | null> {
  if (!getOpenAI()) return null;

  const exam = bankItemToUsmleExam(params.item, 0);
  const context = params.chunks
    .slice(0, 8)
    .map((c, i) => `[${i + 1}] ${c.title}: ${c.content.slice(0, 400)}`)
    .join("\n");

  const completion = await withOpenAiRetry(() =>
    getOpenAI()!.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.22,
      max_tokens: 2200,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: USMLE_CURATOR_SYSTEM },
        {
          role: "user",
          content: [
            `Exam: ${stepLabel(params.fieldId)}`,
            `Subject: ${params.subjectId}`,
            `Item ref: ${params.item.id ?? "unknown"} — vignette must be unique to this case`,
            `QA issues: ${params.reflection.issues.join("; ")}`,
            `Suggestions: ${params.reflection.suggestions.join("; ")}`,
            "",
            "Original item:",
            JSON.stringify(
              {
                vignette: exam.vignette,
                question: exam.question,
                options: exam.options,
                correctAnswer: exam.correctAnswer,
                explanation: exam.explanation,
              },
              null,
              2
            ),
            "",
            "Reference material:",
            context || "(none — use standard medical knowledge)",
          ].join("\n"),
        },
      ],
    })
  );

  const content = completion.choices[0]?.message?.content ?? "";
  return parseAiBankItem(content, params.item);
}

function tryRulePolish(
  item: BankItem,
  fieldId: string,
  subjectId: string,
  seed: number
): BankItem {
  let current = normalizeUsmleBankItemFields(applyUsmleStemRepairs(item));

  if (needsUsmlePolish(current, fieldId)) {
    const subject = getFieldSubject(fieldId, subjectId);
    const { item: polished } = polishUsmleBankItem(
      current,
      fieldId,
      subjectId,
      subject?.label ?? "USMLE",
      seed
    );
    current = normalizeUsmleBankItemFields(polished);
  }

  return current;
}

/**
 * Curate a single USMLE bank item: accept if strong, else rule-polish, else AI repair.
 */
export async function curateUsmleBankItem(
  rawItem: BankItem,
  opts: UsmleCuratorOptions
): Promise<UsmleCurationResult> {
  const minScore = opts.minAcceptScore ?? 8;
  const maxAi = opts.maxAiAttempts ?? 3;
  const notes: string[] = [];
  const subjectId = rawItem.subjectId ?? "internal-medicine";
  const seed = opts.seed ?? 0;
  const useAiFirst = opts.aiFirst ?? (!opts.offline && Boolean(getOpenAI()) && !opts.aiOnly);

  let item = normalizeUsmleBankItemFields(rawItem);
  const before = auditItem(item, opts);
  let bankReport = auditBankItem(item, opts.fieldId);

  if (isAcceptable(before, bankReport.ok, minScore)) {
    return {
      item,
      action: "accepted",
      before,
      after: before,
      bankOk: bankReport.ok,
      notes: ["Already exam-ready"],
    };
  }

  notes.push(`Initial QA ${before.overallScore}/10 (${before.issues.map((i) => i.code).slice(0, 3).join(", ")})`);

  if (!opts.aiOnly && !useAiFirst) {
    item = tryRulePolish(item, opts.fieldId, subjectId, seed);
    const after = auditItem(item, opts);
    bankReport = auditBankItem(item, opts.fieldId);

    if (isAcceptable(after, bankReport.ok, minScore)) {
      notes.push("Rule-based polish sufficient");
      return {
        item,
        action: "rule_polished",
        before,
        after,
        bankOk: bankReport.ok,
        notes,
      };
    }
  } else if (opts.aiOnly) {
    notes.push("AI-only retry (skipped rule polish)");
  } else if (useAiFirst) {
    notes.push("AI-first mode (skipped rule polish for failing item)");
  }

  const after = auditItem(item, opts);
  bankReport = auditBankItem(item, opts.fieldId);

  if (opts.aiOnly && isAcceptable(after, bankReport.ok, minScore)) {
    return {
      item,
      action: "ai_curated",
      before,
      after,
      bankOk: bankReport.ok,
      notes,
    };
  }

  if (opts.offline || !getOpenAI()) {
    notes.push("AI curation skipped (offline or no API key)");
    return {
      item,
      action: after.overallScore >= before.overallScore ? "rule_polished" : "rejected",
      before,
      after,
      bankOk: bankReport.ok,
      notes,
    };
  }

  const chunks =
    opts.useRag !== false && !useAiFirst
      ? await fetchRagContext(opts.fieldId, subjectId, item)
      : [];

  let reflection: SelfRagReflection | undefined;
  let bestItem = item;
  let bestAfter = after;
  let bestBankOk = bankReport.ok;

  const auditReflection: SelfRagReflection = {
    relevant: true,
    grounded: true,
    clinicallySound: before.overallScore >= 6,
    formatValid: Boolean(splitUsmleBankItem(item).vignette),
    qualityScore: before.overallScore / 10,
    issues: before.issues.map((i) => `${i.code}: ${i.message}`),
    suggestions: before.recommendations,
  };

  for (let attempt = 0; attempt < maxAi; attempt++) {
    reflection = useAiFirst
      ? auditReflection
      : await reflectOnQuestion(bankItemToUsmleExam(bestItem, attempt), chunks, opts.fieldId);

    if (!useAiFirst && passesQualityGate(reflection) && bestAfter.overallScore >= minScore && bestBankOk) {
      notes.push(`Self-RAG pass on attempt ${attempt + 1}`);
      break;
    }

    let improved: BankItem | null = null;

    improved = await regenerateUsmleBankItemWithAi({
      item: bestItem,
      reflection,
      chunks: useAiFirst ? [] : chunks,
      fieldId: opts.fieldId,
      subjectId,
    });

    if (!improved && !useAiFirst) {
      const regen = await regenerateQuestion({
        question: bankItemToUsmleExam(bestItem, attempt),
        reflection,
        chunks,
        field: opts.fieldId,
        topic: subjectId,
        difficulty: "medium",
      });
      if (regen) {
        improved = normalizeUsmleBankItemFields(
          examQuestionToBankItem(regen, { ...bestItem, tags: [...(bestItem.tags ?? []), "ai-curated"] })
        );
      }
    }

    if (!improved) {
      notes.push(`AI attempt ${attempt + 1} produced no valid item`);
      continue;
    }

    const candidate = normalizeUsmleBankItemFields(improved);
    const candidateQa = auditItem(candidate, opts);
    const candidateBank = auditBankItem(candidate, opts.fieldId);

    if (
      candidateQa.overallScore > bestAfter.overallScore ||
      (candidateQa.examReady && !bestAfter.examReady)
    ) {
      bestItem = candidate;
      bestAfter = candidateQa;
      bestBankOk = candidateBank.ok;
      notes.push(
        `AI attempt ${attempt + 1}: QA ${candidateQa.overallScore}/10 (was ${after.overallScore})`
      );
    }

    if (isAcceptable(candidateQa, candidateBank.ok, minScore)) {
      bestItem = candidate;
      bestAfter = candidateQa;
      bestBankOk = candidateBank.ok;
      break;
    }
  }

  const { vignette } = splitUsmleBankItem(bestItem);
  if (!vignette) {
    notes.push("Rejected — still missing vignette after curation");
    return {
      item: bestItem,
      action: "rejected",
      before,
      after: bestAfter,
      bankOk: bestBankOk,
      reflection,
      notes,
    };
  }

  if (isAcceptable(bestAfter, bestBankOk, minScore)) {
    return {
      item: bestItem,
      action: "ai_curated",
      before,
      after: bestAfter,
      bankOk: bestBankOk,
      reflection,
      notes,
    };
  }

  if (bestAfter.overallScore > before.overallScore + 0.5) {
    return {
      item: bestItem,
      action: "ai_curated",
      before,
      after: bestAfter,
      bankOk: bestBankOk,
      reflection,
      notes: [...notes, "Improved but below exam-ready threshold"],
    };
  }

  return {
    item: bestItem,
    action: "rejected",
    before,
    after: bestAfter,
    bankOk: bestBankOk,
    reflection,
    notes: [...notes, "Could not reach acceptable QA score"],
  };
}

export function isUsmleCurationEnabled(): boolean {
  return Boolean(getOpenAI());
}
