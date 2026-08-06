/**
 * Assemble structured rationales into storage and display formats.
 */
import type { StructuredRationale } from "../prompts/rationale-generation";

export type AssembledRationale = {
  /** Full markdown-style explanation for question bank / review UI. */
  explanation: string;
  /** Per-wrong-option map for APIs and tutor mode. */
  distractorRationale: Record<string, string>;
  /** Short clinical reasoning block (legacy field support). */
  clinicalReasoning: string;
  keyTakeaways: string[];
  memoryHook?: string;
  explanationDetail: {
    summary: string;
    whyCorrect: string;
    whyIncorrect: Record<string, string>;
    keyTakeaways: string[];
    pearls: string[];
    relatedConcepts?: string[];
  };
};

function formatWhyIncorrectEntry(entry: StructuredRationale["whyIncorrect"][number]): string {
  return [
    `**${entry.option}**`,
    `• Trap: ${entry.misconception}`,
    `• Why it fails here: ${entry.correction}`,
    `• Remember: ${entry.conceptLink}`,
  ].join("\n");
}

/** Convert AI structured rationale → bank item + study UI fields. */
export function assembleStructuredRationale(rationale: StructuredRationale): AssembledRationale {
  const { whyCorrect, whyIncorrect, keyTakeaway, memoryHook } = rationale;

  const conceptBullets = whyCorrect.conceptBreakdown
    .map((b) => (b.startsWith("•") || b.startsWith("-") ? b : `• ${b}`))
    .join("\n");

  const wrongSection =
    whyIncorrect.length > 0
      ? [
          "## Why the other options are wrong",
          "",
          ...whyIncorrect.map((entry) => formatWhyIncorrectEntry(entry)),
        ].join("\n\n")
      : "";

  const explanation = [
    "## Why this answer is correct",
    "",
    whyCorrect.headline,
    "",
    conceptBullets,
    "",
    `**In practice:** ${whyCorrect.clinicalContext}`,
    "",
    "## Clinical pearl",
    "",
    whyCorrect.clinicalContext,
    wrongSection,
    "",
    "## Key takeaway",
    "",
    `**${keyTakeaway}**`,
    memoryHook ? `\n**Memory hook:** ${memoryHook}` : "",
  ]
    .filter(Boolean)
    .join("\n")
    .trim();

  const distractorRationale = Object.fromEntries(
    whyIncorrect.map((entry) => [
      entry.option,
      `${entry.correction} (${entry.conceptLink})`,
    ])
  );

  const clinicalReasoning = [
    whyCorrect.headline,
    ...whyCorrect.conceptBreakdown.slice(0, 2),
  ].join(" ");

  const pearls = memoryHook ? [memoryHook] : [];

  return {
    explanation,
    distractorRationale,
    clinicalReasoning,
    keyTakeaways: [keyTakeaway],
    memoryHook,
    explanationDetail: {
      summary: whyCorrect.headline,
      whyCorrect: [whyCorrect.headline, conceptBullets, whyCorrect.clinicalContext]
        .filter(Boolean)
        .join("\n\n"),
      whyIncorrect: distractorRationale,
      keyTakeaways: [keyTakeaway],
      pearls,
    },
  };
}

/** Flatten assembled rationale into legacy "Why other options are incorrect" text. */
export function legacyDistractorBlock(distractorRationale: Record<string, string>): string {
  const lines = Object.entries(distractorRationale).map(([opt, why]) => `• ${opt}: ${why}`);
  if (!lines.length) return "";
  return `Why other options are incorrect:\n${lines.join("\n")}`;
}
