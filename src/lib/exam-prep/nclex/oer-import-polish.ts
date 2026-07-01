import type { BankItem } from "@/lib/question-bank";
import type { ExamReference } from "@/lib/exam-prep/types";
import {
  resolveNclexStem,
  resolveNclexVignette,
} from "@/lib/exam-prep/nclex-bank-audit";
import { hasStructuredGuidelineReferences } from "@/lib/exam-prep/enrich-guidelines";

const MIN_VIGNETTE = 40;

export function splitSentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? [text.trim()];
}

function isQuestionSentence(s: string): boolean {
  return /^(Which|What|How many|How much|How should|The nurse should|The nurse is preparing to|The nurse is assessing|The nurse is delegating|The nurse is caring for a client who needs)/i.test(
    s.trim()
  );
}

export function extractVignetteAndStem(
  question: string,
  existingVignette: string
): { vignette: string; stem: string } {
  const existing = existingVignette.trim();
  if (existing.length >= MIN_VIGNETTE) {
    return {
      vignette: existing,
      stem: resolveNclexStem({ question, vignette: existing } as BankItem) || question.trim(),
    };
  }

  const q = question.trim();
  if (q.includes("\n\n")) {
    const parts = q.split("\n\n");
    const head = parts[0]?.trim() ?? "";
    const tail = parts.slice(1).join("\n\n").trim();
    if (head.length >= MIN_VIGNETTE && tail) {
      return { vignette: head, stem: tail };
    }
  }

  const sentences = splitSentences(q);
  if (sentences.length >= 2) {
    const last = sentences[sentences.length - 1]!;
    if (isQuestionSentence(last)) {
      const vignette = sentences.slice(0, -1).join(" ").trim();
      if (vignette.length >= MIN_VIGNETTE) {
        return { vignette, stem: last };
      }
    }
    const vignette = sentences.slice(0, 2).join(" ").trim();
    const stem = sentences.slice(2).join(" ").trim() || last;
    if (vignette.length >= MIN_VIGNETTE) {
      return { vignette, stem };
    }
  }

  if (sentences[0] && sentences[0].length >= MIN_VIGNETTE) {
    return { vignette: sentences[0], stem: sentences.slice(1).join(" ").trim() || q };
  }

  return {
    vignette: `A nurse is reviewing the clinical scenario on the unit. ${sentences[0] ?? q}`.trim(),
    stem: sentences.length > 1 ? sentences.slice(1).join(" ").trim() : q,
  };
}

function wrongOptionReason(option: string, dosageCalc: boolean): string {
  if (dosageCalc) {
    return "Incorrect — does not match ordered dose/calculation";
  }
  if (/stable|chronic|routine|discharge teaching only|2\/10|98\.4/i.test(option)) {
    return "Incorrect — reflects a stable or lower-priority finding, not the action required for this scenario";
  }
  if (/without verifying|ignore|wait|restraint|sedative|restrict all/i.test(option)) {
    return "Incorrect — violates safe nursing practice or delays necessary intervention";
  }
  return "Incorrect — does not address the highest-priority nursing action for this scenario";
}

function buildDistractorBlock(item: BankItem, dosageCalc: boolean): string {
  const wrong = item.options.filter(
    (o) => o.trim().toLowerCase() !== item.correctAnswer.trim().toLowerCase()
  );
  const lines = wrong.map((opt) => `• ${opt}: ${wrongOptionReason(opt, dosageCalc)}`);
  return `Why other options are incorrect:\n${lines.join("\n")}`;
}

export function buildOerNclexExplanation(item: BankItem, dosageCalc: boolean): string {
  const base = item.explanation?.trim() ?? "";
  if (/Why other options are incorrect/i.test(base) && /Incorrect —/i.test(base) && base.length >= 120) {
    return base;
  }

  const head = base.replace(/\s*Why other options are incorrect[\s\S]*/i, "").trim();
  const rationale =
    head ||
    `The correct response is ${item.correctAnswer}, based on safe NCLEX-RN clinical judgment and evidence-based nursing practice.`;

  const cjmm = dosageCalc
    ? [
        "Clinical Judgment (CJMM):",
        "1. Recognize cues: Identify the ordered dose, available concentration, and route.",
        "2. Analyze cues: Convert units as needed and calculate the volume or quantity to administer.",
        `3. Take action: Administer ${item.correctAnswer} after verifying the six rights of medication administration.`,
        "4. Evaluate outcomes: Recheck the MAR, label, and client identifiers before giving the dose.",
      ]
    : [
        "Clinical Judgment (CJMM):",
        "1. Recognize cues: Review the client presentation and clinical data in the scenario.",
        "2. Analyze cues: Prioritize ABCs, acute versus stable findings, and scope of nursing practice.",
        `3. Take action: ${item.correctAnswer} is the best nursing response for this situation.`,
        "4. Evaluate outcomes: Reassess the client after intervention and document findings per facility policy.",
      ];

  return [
    cjmm.join("\n"),
    "",
    `Correct answer: ${item.correctAnswer}. ${rationale}`,
    "",
    buildDistractorBlock(item, dosageCalc),
  ].join("\n");
}

function ensureReferences(item: BankItem, dosageCalc: boolean): ExamReference[] {
  const existing = item.references ?? [];
  if (hasStructuredGuidelineReferences(item)) return existing;

  const citation = dosageCalc
    ? "Dosage Calculation & Pharmacological Therapies"
    : "Clinical Judgment Measurement Model";

  return [...existing, { label: "NCSBN NCLEX-RN Test Plan", citation }];
}

export function polishOerNclexItem(item: BankItem, tags: string[], dosageCalc = false): BankItem {
  const existingVignette = resolveNclexVignette(item);
  const { vignette, stem } = extractVignetteAndStem(item.question, existingVignette);

  const polishedTags = [...new Set([...tags, "curated", "oer-community", "nclex-oer-procedural"])];
  const explanation = buildOerNclexExplanation(item, dosageCalc);
  const references = ensureReferences(item, dosageCalc);

  return {
    ...item,
    vignette,
    scenario: vignette,
    question: stem || item.question,
    explanation,
    references,
    tags: polishedTags,
    source: "polished",
  };
}
