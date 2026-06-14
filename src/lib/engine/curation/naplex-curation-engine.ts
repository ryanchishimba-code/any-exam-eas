/**
 * NAPLEX curation engine — triage weak bank items, rule-polish, then AI rewrite
 * so vignettes, stems, options, drug profiles, and correct answers stay aligned.
 */
import OpenAI from "openai";
import type { BankItem } from "@/lib/question-bank";
import type { ExamQuestion } from "@/lib/ai";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import { auditNaplexBankItem } from "@/lib/exam-prep/naplex-bank-audit";
import { bankItemToNaplexExam } from "@/lib/exam-prep/naplex-bank-bridge";
import { enrichQuestion } from "@/lib/engine/stages/enrich-questions";
import {
  needsNaplexPolish,
  polishNaplexBankItem,
  scoreNaplexBankItem,
} from "@/lib/engine/polish/naplex-polish";
import {
  type PharmDrugProfile,
} from "@/lib/engine/prompts/pharm-drug-profile";
import { cleanOptionText } from "@/lib/question-format";
import { reflectOnQuestion } from "@/lib/rag/self-rag";
import { normalizeNaplexBankItemFields } from "@/lib/exam-prep/naplex-bank-normalize";
import type {
  NaplexCurationOptions,
  NaplexCurationResult,
  NaplexCurationTriage,
} from "./naplex-curation-types";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const DEFAULT_MIN_SERVE = 0.62;
const DEFAULT_MIN_PASS = 0.72;

/** Warn-level issues that still degrade session quality — fix in full-bank runs. */
const CURATION_WARN_CODES = new Set([
  "duplicate_vignette_in_stem",
  "naplex_missing_clinical_data",
]);

function hasNaplexCurationWarnings(item: BankItem): boolean {
  const qa = auditBankItem(item, "pharmacy");
  return qa.issues.some((i) => CURATION_WARN_CODES.has(i.code));
}

export function needsNaplexCuration(item: BankItem, aggressive = false): boolean {
  const normalized = normalizeNaplexBankItemFields(item);
  if (needsNaplexPolish(normalized)) return true;
  const naplexAudit = auditNaplexBankItem(normalized);
  const qaGate = auditBankItem(normalized, "pharmacy");
  if (!qaGate.ok || !naplexAudit.ok) return true;
  if (scoreNaplexBankItem(normalized) < DEFAULT_MIN_PASS) return true;
  if (aggressive && hasNaplexCurationWarnings(normalized)) return true;
  return false;
}

export function triageNaplexBankItem(item: BankItem): NaplexCurationTriage {
  const normalized = normalizeNaplexBankItemFields(item);
  const naplexAudit = auditNaplexBankItem(normalized);
  const qaGate = auditBankItem(normalized, "pharmacy");
  const qualityScore = scoreNaplexBankItem(normalized);
  const issues = [...naplexAudit.issues, ...qaGate.issues.filter((i) => i.severity === "error")];

  return {
    qualityScore,
    needsPolish: needsNaplexCuration(normalized, true),
    qaGateOk: qaGate.ok,
    naplexAuditOk: naplexAudit.ok,
    issues,
    issueCodes: [...new Set(issues.map((i) => i.code))],
  };
}

export function validateCuratedNaplexItem(
  item: BankItem,
  minScore = DEFAULT_MIN_PASS
): { ok: boolean; issues: string[]; score: number } {
  const issues: string[] = [];
  const score = scoreNaplexBankItem(item);

  if (item.options.length !== 4) {
    issues.push(`Expected 4 options, got ${item.options.length}.`);
  }

  const cleanedOptions = item.options.map((o) => cleanOptionText(String(o)));
  const cleanedCorrect = cleanOptionText(item.correctAnswer);
  if (!cleanedOptions.some((o) => o.toLowerCase() === cleanedCorrect.toLowerCase())) {
    issues.push("correctAnswer must exactly match one option after normalization.");
  }

  const qa = auditBankItem(item, "pharmacy");
  if (!qa.ok) {
    issues.push(...qa.issues.filter((i) => i.severity === "error").map((i) => `${i.code}: ${i.message}`));
  }

  const naplex = auditNaplexBankItem(item);
  if (!naplex.ok) {
    issues.push(...naplex.issues.filter((i) => i.severity === "error").map((i) => `${i.code}: ${i.message}`));
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

type AiNaplexPayload = {
  vignette?: string;
  question?: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  clinicalReasoning?: string;
  distractorRationale?: Record<string, string>;
  drugProfile?: PharmDrugProfile;
  tags?: string[];
  topicCategory?: string;
};

function mergeAiPayload(base: BankItem, payload: AiNaplexPayload): BankItem {
  const vignette = payload.vignette?.trim() || base.vignette?.trim() || base.scenario?.trim();
  const options = (payload.options?.map(String).slice(0, 4) ?? base.options) as BankItem["options"];
  let correctAnswer = payload.correctAnswer?.trim() || base.correctAnswer;
  const cleanedOptions = options.map(cleanOptionText);
  const cleanedCorrect = cleanOptionText(correctAnswer);
  if (!cleanedOptions.some((o) => o.toLowerCase() === cleanedCorrect.toLowerCase())) {
    const match = cleanedOptions.find((o) =>
      payload.distractorRationale ? !payload.distractorRationale[o] : false
    );
    if (match) correctAnswer = options[cleanedOptions.indexOf(match)] ?? correctAnswer;
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
    tags: payload.tags ?? base.tags,
    topicCategory: payload.topicCategory ?? base.topicCategory,
    itemType: base.itemType ?? "vignette",
  };
}

function bankItemToReflectExam(item: BankItem): ExamQuestion {
  return bankItemToNaplexExam(item, 0);
}

export async function rewriteNaplexBankItemWithAi(
  item: BankItem,
  reflection: { issues: string[]; suggestions: string[] },
  subjectLabel: string
): Promise<BankItem | null> {
  if (!openai) return null;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.22,
    max_tokens: 3200,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a senior NAPLEX item writer (UWorld / NABP 2025 Content Outline standard).
Rewrite ONE pharmacy exam item so vignette, stem, four options, correctAnswer, and drugProfile are fully aligned.

Rules:
- vignette: 2–4 sentences — age, allergies, current meds, renal/hepatic function, labs/vitals, presenting complaint
- question: NAPLEX lead-in ONLY (e.g. "Which action should the pharmacist take first?") — no vignette text repeated
- options: exactly 4 complete pharmacy actions, counseling points, or therapeutic choices (not meta-text like "monitor adherence")
- correctAnswer: must match one option verbatim
- drugProfile REQUIRED when item is drug-centered: generic, brandNames[], therapeuticClass, indication, conditionSymptoms[], conditionEtiology, majorSideEffects[], monitoring[]
- explanation: why correct + monitoring/counseling; cite generic and class
- clinicalReasoning: Assess → Analyze → Select → Counsel → Monitor
- distractorRationale: object keyed by EXACT option text → why wrong for THIS patient
- Use "patient" in pharmacy context; professional, health-literacy-aware tone
- Preserve clinical topic intent from the original when sound; fix incoherent template swaps
- NEVER use legacy "NAPLEX N:" prefixes

Return JSON:
{
  "vignette": string,
  "question": string,
  "options": [string,string,string,string],
  "correctAnswer": string,
  "explanation": string,
  "clinicalReasoning": string,
  "distractorRationale": { "option text": "rationale" },
  "drugProfile": {
    "generic": string,
    "brandNames": string[],
    "therapeuticClass": string,
    "indication": string,
    "conditionSymptoms": string[],
    "conditionEtiology": string,
    "majorSideEffects": string[],
    "monitoring": string[]
  },
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
    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}") as AiNaplexPayload;
    if (!parsed.question || !parsed.options?.length) return null;
    return mergeAiPayload(item, parsed);
  } catch {
    return null;
  }
}

export async function curateNaplexBankItem(
  item: BankItem,
  subjectId: string,
  opts: NaplexCurationOptions = {}
): Promise<NaplexCurationResult> {
  const minServe = opts.minServeScore ?? DEFAULT_MIN_SERVE;
  const minPass = opts.minPassScore ?? DEFAULT_MIN_PASS;
  const seed = opts.seed ?? 0;
  const subjectLabel = opts.subjectLabel ?? subjectId;
  const useAi = opts.useAi ?? Boolean(openai);

  const triage = triageNaplexBankItem(item);
  const qualityBefore = triage.qualityScore;

  let working = normalizeNaplexBankItemFields({ ...item, subjectId: item.subjectId ?? subjectId });

  if (
    !triage.needsPolish &&
    triage.qaGateOk &&
    triage.qualityScore >= minServe &&
    !opts.forceAi
  ) {
    const validation = validateCuratedNaplexItem(working, minPass);
    return {
      item: working,
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

  let changed =
    working.question !== item.question ||
    (working.vignette ?? working.scenario) !== (item.vignette ?? item.scenario);
  let stage: NaplexCurationResult["stage"] = changed ? "rule_polish" : "failed";
  let aiUsed = false;
  let reflection: NaplexCurationResult["reflection"];

  if (!opts.aiOnly) {
    const polished = polishNaplexBankItem(working, subjectId, subjectLabel, seed);
    if (polished.changed) {
      working = polished.item;
      changed = true;
      stage = "rule_polish";
    }
  }

  const afterRule = validateCuratedNaplexItem(working, minPass);
  const needsAi =
    useAi &&
    (opts.forceAi || opts.aiOnly || !afterRule.ok || scoreNaplexBankItem(working) < minPass);

  if (needsAi) {
    const exam = bankItemToReflectExam(working);
    reflection = await reflectOnQuestion(exam, [], "pharmacy");
    const rewritten = await rewriteNaplexBankItemWithAi(working, reflection, subjectLabel);
    if (rewritten) {
      let enriched = bankItemToNaplexExam(rewritten, 0);
      enriched = enrichQuestion(enriched, "pharmacy");
      working = mergeAiPayload(rewritten, {
        vignette: enriched.vignette,
        question: enriched.question,
        options: enriched.options,
        correctAnswer: enriched.correctAnswer,
        explanation: enriched.explanation,
        clinicalReasoning: enriched.clinicalReasoning,
        distractorRationale: enriched.distractorRationale,
        tags: enriched.tags,
      });
      aiUsed = true;
      changed = true;
      stage = "ai_rewrite";
    }
  } else if (afterRule.ok) {
    stage = stage === "rule_polish" ? "rule_polish" : "pass";
  }

  const qualityAfter = scoreNaplexBankItem(working);
  const validation = validateCuratedNaplexItem(working, minPass);

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
