/**
 * Prompt blocks that mirror automated clinical / ingest gate checks for AANP FNP generation.
 */
import type { BankItem } from "@/lib/question-bank";
import { auditUsmleQaEditor } from "../usmle-qa-editor";
import { validateClinicalVignette } from "@/lib/engine/prompts/vignette";
import { bankItemToUsmleExam } from "../usmle-bank-bridge";
import { splitUsmleBankItem } from "../usmle-clinical-gate";

/** Injected into variant + batch generation prompts — matches serve-time validators. */
export const AANP_FNP_CLINICAL_GATE_CHECKLIST = `
CLINICAL GATE CHECKLIST (mandatory — automated QA rejects items missing any of these):

VIGNETTE field (2–4 sentences, 80–120 words; NEVER put vignette text in "question"):
□ Opening: "A [N]-year-old [man/woman/patient/infant]" OR "[N]-week-old" — hyphens required
□ Care setting: primary care clinic, ED, inpatient unit, urgent care, etc.
□ Chief complaint / reason for visit
□ History anchor: PMH, current medications, allergies, surgery, pregnancy, or risk factor
□ ≥2 objective values WITH units: e.g. "BP 128/78 mm Hg", "HR 88/min", "creatinine 1.4 mg/dL", "SpO2 94%"
□ Exam finding OR discriminating symptom when clinically relevant

QUESTION field (lead-in stem ONLY, ends with ?):
□ USMLE-style lead-in: "What is the most appropriate next step?", "Which is the most likely diagnosis?", etc.
□ ≥20 characters; say "this patient" / "this presentation" — NEVER "these findings"
□ Do NOT repeat vignette demographics in the question field

OPTIONS: exactly 4 unique, clinically distinct strings (no A/B/C/D prefixes)

EXPLANATION (≥180 characters):
□ Why the keyed answer fits the vignette data
□ Why each wrong option fails (distractor rationale — use "Incorrect because…" or bullet points)
□ Reference mechanism/guideline when applicable (USPSTF, AHA, IDSA, etc.)

FORBIDDEN: "Furthermore", "It is important to note", duplicate vignette in question, placeholder options, generic correct answers
`.trim();

export function buildPassingVignetteExemplar(seed: BankItem): string {
  const { vignette, stem } = splitUsmleBankItem(seed);
  return `PASSING EXEMPLAR (mirror this structure and density, do NOT copy clinical content):
Vignette: ${vignette ?? ""}
Stem: ${stem}
Explanation length: ${(seed.explanation ?? "").length} characters (match this depth)`;
}

/** Summarize gate failures for a targeted regeneration retry. */
export function summarizeAanpFnpGateFailures(item: BankItem): string[] {
  const fieldId = "aanp-fnp";
  const { vignette, stem } = splitUsmleBankItem(item);
  const exam = bankItemToUsmleExam({ ...item, vignette, question: stem }, 0);

  const messages: string[] = [];
  for (const msg of validateClinicalVignette(exam)) {
    messages.push(msg);
  }

  const report = auditUsmleQaEditor(item, {
    fieldId,
    source: "generated",
    difficulty: item.difficulty ?? null,
  });

  for (const issue of report.issues) {
    if (issue.severity === "error" || issue.severity === "warn") {
      messages.push(`[${issue.code}] ${issue.message}`);
    }
  }

  if (!report.examReady) {
    messages.push(
      `Editorial score ${report.overallScore}/10 (need ≥8). Priority: ${report.recommendations[0] ?? "strengthen vignette vitals/history and explanation distractor rationale"}`
    );
  }

  return [...new Set(messages)].slice(0, 12);
}

export function buildVariantGenerationUserPrompt(params: {
  variantTask: string;
  seed: BankItem;
  domain: string;
  retryFeedback?: string[];
}): string {
  const { vignette, stem } = splitUsmleBankItem(params.seed);
  const feedbackBlock = params.retryFeedback?.length
    ? `\nPRIOR ATTEMPT FAILED QA — fix these specific issues:\n${params.retryFeedback.map((m) => `- ${m}`).join("\n")}\n`
    : "";

  return `Create ONE variant of this AANP FNP seed question.

${AANP_FNP_CLINICAL_GATE_CHECKLIST}

VARIANT TASK: ${params.variantTask}
${feedbackBlock}
${buildPassingVignetteExemplar(params.seed)}

SEED SOURCE (same clinical concept, new presentation — do NOT copy sentences verbatim):
Vignette: ${vignette ?? ""}
Stem: ${stem}
Options: ${JSON.stringify(params.seed.options)}
Correct: ${params.seed.correctAnswer}
Domain: ${params.domain}
Explanation summary: ${(params.seed.explanation ?? "").slice(0, 400)}

Return JSON: { "vignette": "...", "question": "...", "options": [4 strings], "correctAnswer": "...", "explanation": "...", "clinicalReasoning": "..." }
- blueprintDomain stays "${params.domain}"
- Match seed quality: rich vignette, separate stem, teaching explanation with distractor rationale`;
}
