/**
 * Cross-field "giveaway" detector.
 *
 * Catches the three template anti-patterns that let low-quality NCLEX/NAPLEX
 * items reach students despite the existing gates:
 *
 *  1. answer_in_stem      — selection/mechanism lead-in whose correct option
 *                           is the drug/agent already named in the stem.
 *  2. strawman_distractor — implausible "no one would ever do this" options
 *                           that make the key obvious.
 *  3. boilerplate_explanation — content-free, templated rationales.
 *
 * Each pattern is intentionally specific so it never fires on legitimate
 * board-style items (counseling questions, infection-control distractors, etc.).
 */
import type { BankItem } from "@/lib/question-bank";

export type GiveawayIssue = {
  code: string;
  message: string;
  severity: "error" | "warn";
};

/**
 * Absurd distractors no real board item would write. Kept narrow on purpose —
 * "reuse equipment without cleaning", "without notifying the provider", etc.
 * are deliberately EXCLUDED because they are valid infection-control / safety
 * distractors in legitimate questions.
 */
const STRAWMAN_OPTION_PATTERNS: RegExp[] = [
  /\bno evidence for this indication\b/i,
  /\b(?:requires?|needs?) no monitoring\b/i,
  /\bno monitoring (?:or follow-?up )?is (?:ever )?(?:required|needed)\b/i,
  /\bmaximum dose above labeled limits\b/i,
  // NOTE: a plain "share unused tablets with family" option is a LEGITIMATE
  // (wrong) opioid-safety distractor, so we only flag the imperative
  // "encourage sharing" phrasing the procedural generator emitted.
  /\bencourage sharing\b/i,
  /\bborrow(?:ing)? (?:a )?(?:similar )?dose from another (?:client|patient)\b/i,
  /\bassume understanding because the (?:client|patient) nodded\b/i,
  /\bdiscourage questions\b/i,
  /\btell the (?:physician|provider).{0,30}\boverreacting\b/i,
];

/** Exact templated rationales emitted by the procedural generator. */
const BOILERPLATE_EXPLANATION_PATTERNS: RegExp[] = [
  /Therapeutic selection follows guidelines, patient-specific factors, and monitoring requirements\./i,
  /The correct answer links the patient'?s presentation to the evidence-based mechanism of the selected agent\./i,
  /Person-centered care requires actionable counseling on benefits, adverse effects, adherence, and follow-?up\./i,
];

/**
 * Lead-ins where naming the correct drug/agent in the stem is a giveaway.
 * Scoped to "select the therapy/agent" and "which mechanism" prompts so that
 * counseling items ("which counseling point…") are never flagged.
 */
const GIVEAWAY_LEAD_IN =
  /which (?:medication|therapy|agent|drug|treatment|regimen)\b[^?]*\b(?:most appropriate|best|preferred|recommended|first[- ]?line|indicated)\b|which mechanism of action best explains/i;

const STOP_TOKENS = new Set([
  "the",
  "this",
  "that",
  "with",
  "for",
  "and",
  "counsel",
  "monitor",
  "select",
  "verify",
  "recognize",
]);

function stripOptionsFromText(item: BankItem): string {
  // We only want the stem + vignette, never the answer options themselves.
  return `${item.vignette ?? item.scenario ?? ""}\n${item.question ?? ""}`;
}

/** Distinctive leading token of the correct answer (drug/proper-noun candidate). */
function correctAnswerKeyTokens(correctAnswer: string): string[] {
  const beforeRaw = correctAnswer.split(/\s+—\s+| \(/)[0]?.trim() ?? "";
  // Only treat the pre-delimiter phrase as a key when it is short (a drug/agent
  // name), never a full sentence (which would be a meaningless concatenation).
  const beforeDelimiter = beforeRaw.split(/\s+/).length <= 4 ? beforeRaw : "";
  const firstWord = correctAnswer.trim().split(/\s+/)[0] ?? "";
  const candidates = [beforeDelimiter, firstWord]
    .map((t) => t.replace(/[^A-Za-z0-9-]/g, "").trim())
    .filter((t) => t.length >= 4 && !STOP_TOKENS.has(t.toLowerCase()));
  return [...new Set(candidates)];
}

export function auditGiveawayPatterns(item: BankItem): GiveawayIssue[] {
  const issues: GiveawayIssue[] = [];
  const options = Array.isArray(item.options) ? item.options.map((o) => String(o)) : [];
  const correct = (item.correctAnswer ?? "").trim();
  const explanation = item.explanation ?? "";
  const stemText = stripOptionsFromText(item);

  // 1. Strawman distractors (any non-correct option that is implausible).
  const strawman = options.some(
    (opt) => opt.trim() !== correct && STRAWMAN_OPTION_PATTERNS.some((re) => re.test(opt))
  );
  if (strawman) {
    issues.push({
      severity: "error",
      code: "strawman_distractor",
      message: "An answer option is an implausible giveaway distractor.",
    });
  }

  // 2. Boilerplate / content-free explanation.
  if (BOILERPLATE_EXPLANATION_PATTERNS.some((re) => re.test(explanation))) {
    issues.push({
      severity: "error",
      code: "boilerplate_explanation",
      message: "Explanation is a templated, content-free rationale.",
    });
  }

  // 3. Answer named in the stem under a selection/mechanism lead-in.
  if (correct && GIVEAWAY_LEAD_IN.test(item.question ?? "")) {
    const tokens = correctAnswerKeyTokens(correct);
    const distractorsNameToken = options
      .filter((o) => o.trim() !== correct)
      .some((o) => tokens.some((t) => new RegExp(`\\b${escapeRegExp(t)}\\b`, "i").test(o)));
    const stemNamesToken = tokens.some((t) =>
      new RegExp(`\\b${escapeRegExp(t)}\\b`, "i").test(stemText)
    );
    // Only a giveaway when the stem names the correct agent AND the distractors
    // do not — i.e. the answer can be picked by name-matching alone.
    if (stemNamesToken && !distractorsNameToken) {
      issues.push({
        severity: "error",
        code: "answer_in_stem",
        message:
          "Correct agent is named in the stem under a selection lead-in, making the answer obvious.",
      });
    }
  }

  return issues;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
