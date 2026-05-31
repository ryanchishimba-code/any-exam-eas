import type { ExamQuestion, GeneratedExam } from "@/lib/ai";

const NGN_TYPES = new Set([
  "select_all",
  "bow_tie",
  "matrix",
  "unfolding_case",
  "highlight",
  "ordered_response",
  "drag_drop",
]);

/**
 * Post-process AI output: merge vignette into display stem, fill missing rationales,
 * and flag high-yield items lacking board-style depth.
 */
export function enrichGeneratedExam(exam: GeneratedExam): GeneratedExam {
  return {
    ...exam,
    questions: exam.questions.map(enrichQuestion),
  };
}

export function enrichQuestion(q: ExamQuestion): ExamQuestion {
  const enriched = { ...q };

  if (enriched.vignette?.trim()) {
    const vignette = enriched.vignette.trim();
    if (!enriched.question.includes(vignette.slice(0, Math.min(40, vignette.length)))) {
      enriched.question = `${vignette}\n\n${enriched.question.trim()}`;
    }
  }

  enriched.distractorRationale = enrichDistractorRationale(enriched);
  enriched.clinicalReasoning =
    enriched.clinicalReasoning?.trim() ||
    deriveClinicalReasoning(enriched);
  enriched.explanation = enrichExplanationText(enriched);
  enriched.highYield = enriched.highYield ?? inferHighYield(enriched);

  return enriched;
}

function enrichDistractorRationale(q: ExamQuestion): Record<string, string> {
  const existing = q.distractorRationale ?? {};
  const options = q.options ?? [];
  if (options.length === 0) return existing;

  const incorrect = options.filter(
    (o) => o.trim() && o.trim() !== q.correctAnswer.trim()
  );

  const result = { ...existing };
  for (const opt of incorrect) {
    if (result[opt]?.trim()) continue;
    result[opt] = inferDistractorWhy(opt, q);
  }

  return result;
}

function inferDistractorWhy(option: string, q: ExamQuestion): string {
  const stem = q.question.slice(0, 120);
  return `Incorrect — "${option}" does not best address the clinical priority or key finding in this scenario. Review the discriminating data in the stem. Context: ${stem}${stem.length >= 120 ? "…" : ""}`;
}

function deriveClinicalReasoning(q: ExamQuestion): string {
  if (!q.vignette && q.question.length < 80) return "";

  const steps = [
    "1. Recognize cues: identify abnormal findings and client context from the vignette.",
    "2. Analyze: link findings to the underlying problem or nursing/medical priority.",
    "3. Prioritize: apply ABCs, Maslow, or safety-first principles to rank actions.",
    "4. Act: select the single best intervention or answer supported by evidence.",
  ];

  if (q.explanation.length > 40) {
    steps.push(`5. Evaluate: ${q.explanation.slice(0, 180)}${q.explanation.length > 180 ? "…" : ""}`);
  }

  return steps.join("\n");
}

function enrichExplanationText(q: ExamQuestion): string {
  let text = q.explanation?.trim() ?? "";
  if (!text) return text;

  const hasDistractorSection = /why (other|incorrect|wrong)/i.test(text);
  const rationales = q.distractorRationale ?? {};
  const incorrectEntries = Object.entries(rationales).filter(
    ([opt]) => opt.trim() !== q.correctAnswer.trim()
  );

  if (!hasDistractorSection && incorrectEntries.length >= 2) {
    const block = incorrectEntries
      .slice(0, 4)
      .map(([opt, why]) => `• ${opt}: ${why}`)
      .join("\n");
    text = `${text}\n\nWhy other options are incorrect:\n${block}`;
  }

  if (q.references?.length && !/reference|source \[/i.test(text)) {
    text = `${text}\n\nReferences: ${q.references.join("; ")}`;
  }

  return text;
}

function inferHighYield(q: ExamQuestion): boolean {
  if (q.highYield !== undefined) return q.highYield;
  const hasVignette = Boolean(q.vignette?.trim()) || q.question.length > 100;
  const hasDepth =
    q.explanation.length > 60 &&
    Object.keys(q.distractorRationale ?? {}).length >= 2;
  const isNgn = NGN_TYPES.has(q.type);
  return hasVignette && (hasDepth || isNgn);
}
