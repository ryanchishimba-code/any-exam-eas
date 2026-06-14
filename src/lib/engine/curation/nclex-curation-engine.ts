/**
 * NCLEX curation engine — triage weak bank items, rule-polish, then AI rewrite
 * so vignettes, stems, options, and correct answers stay aligned.
 */
import OpenAI from "openai";
import type { BankItem } from "@/lib/question-bank";
import type { ExamQuestion } from "@/lib/ai";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import {
  auditNclexBankItem,
  getNclexEditorialWarnCodes,
} from "@/lib/exam-prep/nclex-bank-audit";
import { bankItemToExamQuestion } from "@/lib/exam-prep/ngn-bank-bridge";
import { enrichQuestion } from "@/lib/engine/stages/enrich-questions";
import {
  needsNclexPolish,
  polishNclexBankItem,
  scoreNclexBankItem,
} from "@/lib/engine/polish/nclex-polish";
import { cleanOptionText } from "@/lib/question-format";
import { reflectOnQuestion } from "@/lib/rag/self-rag";
import type {
  NclexCurationOptions,
  NclexCurationResult,
  NclexCurationTriage,
} from "./nclex-curation-types";

let openaiClient: OpenAI | null | undefined;

function getOpenAi(): OpenAI | null {
  if (openaiClient === undefined) {
    openaiClient = process.env.OPENAI_API_KEY
      ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      : null;
  }
  return openaiClient;
}

const DEFAULT_MIN_SERVE = 0.62;
const DEFAULT_MIN_PASS = 0.72;

export function triageNclexBankItem(item: BankItem): NclexCurationTriage {
  const nclexAudit = auditNclexBankItem(item);
  const qaGate = auditBankItem(item, "nursing");
  const qualityScore = scoreNclexBankItem(item);
  const issues = [...nclexAudit.issues, ...qaGate.issues.filter((i) => i.severity === "error")];

  const editorialWarnCodes = getNclexEditorialWarnCodes(item);

  return {
    qualityScore,
    needsPolish: needsNclexPolish(item),
    qaGateOk: qaGate.ok,
    nclexAuditOk: nclexAudit.ok,
    editorialWarnCodes,
    issues,
    issueCodes: [...new Set(issues.map((i) => i.code))],
  };
}

export function validateCuratedBankItem(
  item: BankItem,
  minScore = DEFAULT_MIN_PASS
): { ok: boolean; issues: string[]; score: number } {
  const issues: string[] = [];
  const score = scoreNclexBankItem(item);

  if (item.options.length !== 4) {
    issues.push(`Expected 4 options, got ${item.options.length}.`);
  }

  const cleanedOptions = item.options.map((o) => cleanOptionText(String(o)));
  const cleanedCorrect = cleanOptionText(item.correctAnswer);
  if (!cleanedOptions.some((o) => o.toLowerCase() === cleanedCorrect.toLowerCase())) {
    issues.push("correctAnswer must exactly match one option after normalization.");
  }

  const qa = auditBankItem(item, "nursing");
  if (!qa.ok) {
    issues.push(...qa.issues.filter((i) => i.severity === "error").map((i) => `${i.code}: ${i.message}`));
  }

  const nclex = auditNclexBankItem(item);
  if (!nclex.ok) {
    issues.push(...nclex.issues.filter((i) => i.severity === "error").map((i) => `${i.code}: ${i.message}`));
  }

  if (score < minScore) {
    issues.push(`Quality score ${score.toFixed(3)} below minimum ${minScore}.`);
  }

  if (!item.vignette?.trim() && !item.scenario?.trim()) {
    const q = item.question.trim();
    if (q.length < 80 || !q.includes("\n")) {
      issues.push("Missing clinical vignette (scenario field or embedded paragraph).");
    }
  }

  return { ok: issues.length === 0, issues, score };
}

type AiNclexPayload = {
  vignette?: string;
  question?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  clinicalReasoning?: string;
  distractorRationale?: Record<string, string>;
  references?: Array<{ label: string; url?: string; citation?: string }>;
  tags?: string[];
  topicCategory?: string;
};

function mergeAiPayload(base: BankItem, payload: AiNclexPayload): BankItem {
  const vignette = payload.vignette?.trim() || base.vignette?.trim() || base.scenario?.trim();
  const options = (payload.options?.map(String).slice(0, 4) ?? base.options) as BankItem["options"];
  let correctAnswer = payload.correctAnswer?.trim() || base.correctAnswer;
  const cleanedOptions = options.map(cleanOptionText);
  const cleanedCorrect = cleanOptionText(correctAnswer);
  if (!cleanedOptions.some((o) => o.toLowerCase() === cleanedCorrect.toLowerCase())) {
    if (payload.distractorRationale) {
      const wrongKeys = new Set(
        Object.keys(payload.distractorRationale).map((k) => cleanOptionText(k).toLowerCase())
      );
      const missingIdx = cleanedOptions.findIndex((o) => !wrongKeys.has(o.toLowerCase()));
      if (missingIdx >= 0) correctAnswer = options[missingIdx]!;
    }
  }

  return {
    ...base,
    vignette,
    scenario: vignette,
    question: payload.question?.trim() || base.question,
    options,
    correctAnswer,
    explanation: payload.explanation?.trim() || base.explanation,
    clinicalReasoning: payload.clinicalReasoning?.trim() || base.clinicalReasoning,
    distractorRationale: payload.distractorRationale ?? base.distractorRationale,
    references: payload.references?.length ? payload.references : base.references,
    tags: payload.tags ?? base.tags,
    topicCategory: payload.topicCategory ?? base.topicCategory,
    itemType: base.itemType ?? "vignette",
  };
}

function bankItemToReflectExam(item: BankItem, subjectId: string): ExamQuestion {
  return bankItemToExamQuestion(item, 0, { field: "nursing", subjectId });
}

export async function rewriteNclexBankItemWithAi(
  item: BankItem,
  reflection: { issues: string[]; suggestions: string[] },
  subjectLabel: string
): Promise<BankItem | null> {
  if (!getOpenAi()) return null;

  const completion = await getOpenAi()!.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.22,
    max_tokens: 2800,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a senior NCLEX-RN item writer (UWorld / NCSBN CJMM standard).
Rewrite ONE nursing exam item so vignette, stem, four options, and correctAnswer are fully aligned.

Rules:
- vignette: 2–4 sentences — age, setting, history, discriminating signs/symptoms, vitals/labs
- question: NCLEX lead-in ONLY (e.g. "Which action should the nurse take first?") — no vignette text repeated
- options: exactly 4 complete nursing actions or findings (not meta-text like "unstable ABC")
- correctAnswer: must match one option verbatim
- explanation: CJMM structure + why correct; reference pathophysiology
- clinicalReasoning: Recognize → Analyze → Prioritize → Take action
- distractorRationale: object keyed by EXACT option text → why wrong for THIS client
- references: 1–2 entries from allowed societies only (e.g. CDC, AHA, NCSBN, Surviving Sepsis, ISMP, ACOG, AAP) with label + citation; no invented section numbers
- Use "client" not "patient"; inclusive, professional tone
- Preserve clinical topic intent from the original when sound; fix incoherent template swaps

Return JSON:
{
  "vignette": string,
  "question": string,
  "options": [string,string,string,string],
  "correctAnswer": string,
  "explanation": string,
  "clinicalReasoning": string,
  "distractorRationale": { "option text": "rationale" },
  "references": [{ "label": string, "url"?: string, "citation"?: string }],
  "tags": string[],
  "topicCategory": string
}`,
      },
      {
        role: "user",
        content: `Subject: ${subjectLabel}
QA issues: ${reflection.issues.join("; ") || "low quality / misaligned content"}
Suggestions: ${reflection.suggestions.join("; ") || "none"}

Original item:
${JSON.stringify(
  {
    vignette: item.vignette ?? item.scenario,
    question: item.question,
    options: item.options,
    correctAnswer: item.correctAnswer,
    explanation: item.explanation?.slice(0, 500),
  },
  null,
  2
)}`,
      },
    ],
  });

  try {
    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}") as AiNclexPayload;
    if (!parsed.question || !parsed.options?.length) return null;
    return mergeAiPayload(item, parsed);
  } catch {
    return null;
  }
}

export async function curateNclexBankItem(
  item: BankItem,
  subjectId: string,
  opts: NclexCurationOptions = {}
): Promise<NclexCurationResult> {
  const minServe = opts.minServeScore ?? DEFAULT_MIN_SERVE;
  const minPass = opts.minPassScore ?? DEFAULT_MIN_PASS;
  const seed = opts.seed ?? 0;
  const subjectLabel = opts.subjectLabel ?? subjectId;
  const useAi = opts.useAi ?? Boolean(getOpenAi());

  const triage = triageNclexBankItem(item);
  const qualityBefore = triage.qualityScore;

  if (
    !triage.needsPolish &&
    triage.qaGateOk &&
    triage.qualityScore >= minServe &&
    !opts.forceAi
  ) {
    const validation = validateCuratedBankItem(item, minPass);
    return {
      item,
      stage: "pass",
      changed: false,
      qualityBefore,
      qualityAfter: triage.qualityScore,
      triage,
      aiUsed: false,
      validationOk: validation.ok,
      validationIssues: validation.issues,
    };
  }

  let working = { ...item, subjectId: item.subjectId ?? subjectId };
  let stage: NclexCurationResult["stage"] = "failed";
  let aiUsed = false;
  let reflection: NclexCurationResult["reflection"];
  let changed = false;

  if (!opts.aiOnly) {
    const polished = polishNclexBankItem(working, subjectId, subjectLabel, seed);
    if (polished.changed) {
      working = { ...polished.item, subjectId: polished.item.subjectId ?? subjectId };
      changed = true;
      stage = "rule_polish";
    }
  }

  const afterRule = validateCuratedBankItem(working, minPass);
  const needsAi =
    useAi &&
    (opts.forceAi || opts.aiOnly || !afterRule.ok || scoreNclexBankItem(working) < minPass);

  if (needsAi) {
    if (!getOpenAi()) {
      return {
        item: working,
        stage: opts.aiOnly ? "failed" : stage === "rule_polish" ? "rule_polish" : "failed",
        changed,
        qualityBefore,
        qualityAfter: scoreNclexBankItem(working),
        triage,
        aiUsed: false,
        validationOk: validateCuratedBankItem(working, minPass).ok,
        validationIssues: ["OPENAI_API_KEY missing — AI rewrite skipped."],
      };
    }
    const exam = bankItemToReflectExam(working, subjectId);
    reflection = await reflectOnQuestion(exam, [], "nursing");
    const rewritten = await rewriteNclexBankItemWithAi(working, reflection, subjectLabel);
    if (rewritten) {
      let enriched = bankItemToExamQuestion(rewritten, 0, { field: "nursing", subjectId });
      enriched = enrichQuestion(enriched, "nursing");
      working = {
        ...mergeAiPayload(rewritten, {
          vignette: enriched.vignette,
          question: enriched.question,
          options: enriched.options,
          correctAnswer: enriched.correctAnswer,
          explanation: enriched.explanation,
          clinicalReasoning: enriched.clinicalReasoning,
          distractorRationale: enriched.distractorRationale,
          tags: enriched.tags,
        }),
        subjectId: rewritten.subjectId ?? subjectId,
      };
      aiUsed = true;
      changed = true;
      stage = "ai_rewrite";
    }
  } else if (afterRule.ok) {
    stage = stage === "rule_polish" ? "rule_polish" : "pass";
  }

  const qualityAfter = scoreNclexBankItem(working);
  const validation = validateCuratedBankItem(working, minPass);

  if (!validation.ok && stage !== "failed") {
    stage = "failed";
  } else if (validation.ok && stage === "failed") {
    stage = aiUsed ? "ai_rewrite" : "rule_polish";
  }

  return {
    item: working,
    stage,
    changed,
    qualityBefore,
    qualityAfter,
    triage,
    reflection,
    aiUsed,
    validationOk: validation.ok,
    validationIssues: validation.issues,
  };
}
