/**
 * Assemble expert NCLEX rationales into storage + display formats.
 */
import type { ExpertStructuredRationale } from "./expert-rationale-types";
import { assembleStructuredRationale, type AssembledRationale } from "./assemble-rationale";

export type AssembledExpertRationale = AssembledRationale & {
  expert: ExpertStructuredRationale;
  /** One-line preview for collapsed UI. */
  concisePreview: string;
};

function section(title: string, body: string): string {
  if (!body.trim()) return "";
  return `## ${title}\n\n${body.trim()}`;
}

function bulletList(items: string[]): string {
  return items.map((i) => (i.startsWith("•") ? i : `• ${i}`)).join("\n");
}

/** Full markdown explanation with all expert sections. */
export function assembleExpertRationale(expert: ExpertStructuredRationale): AssembledExpertRationale {
  const base = assembleStructuredRationale(expert);

  const stepsBlock =
    expert.stepByStepReasoning.length > 0
      ? expert.stepByStepReasoning.map((s, i) => `${i + 1}. ${s}`).join("\n")
      : "";

  const expertSections = [
    section("Step-by-step reasoning", stepsBlock),
    section("Clinical pearl", expert.clinicalPearl),
    expert.pharmacologyTieIn?.trim()
      ? section("Pharmacology tie-in", expert.pharmacologyTieIn)
      : "",
    expert.highYieldFacts.length > 0
      ? section("High-yield facts", bulletList(expert.highYieldFacts))
      : "",
    expert.commonPitfalls.length > 0
      ? section("Common pitfalls", bulletList(expert.commonPitfalls))
      : "",
    expert.nextStepInCare?.trim()
      ? section("Next step in care", expert.nextStepInCare)
      : "",
    section("Test-taking tip", expert.testTakingTip),
    section("Real-world nursing application", expert.realWorldApplication),
    expert.layeredDepth
      ? section(
          "Layered depth",
          [
            `**Basic:** ${expert.layeredDepth.basic}`,
            `**Intermediate:** ${expert.layeredDepth.intermediate}`,
            `**Advanced:** ${expert.layeredDepth.advanced}`,
          ].join("\n\n")
        )
      : "",
    expert.visualCues?.length
      ? section(
          "Visual cues",
          expert.visualCues.map((v) => `• **${v.label}:** ${v.description}`).join("\n")
        )
      : "",
    expert.crossReferences?.length
      ? section(
          "Related topics",
          expert.crossReferences.map((c) => `• **${c.exam} — ${c.topic}:** ${c.note}`).join("\n")
        )
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const explanation = [base.explanation, expertSections].filter(Boolean).join("\n\n").trim();

  const concisePreview = [expert.whyCorrect.headline, expert.keyTakeaway]
    .filter(Boolean)
    .join(" — ");

  return {
    ...base,
    explanation,
    expert,
    concisePreview,
    explanationDetail: {
      ...base.explanationDetail,
      pearls: [
        expert.clinicalPearl,
        ...(expert.highYieldFacts.slice(0, 2) ?? []),
        ...(base.memoryHook ? [base.memoryHook] : []),
      ].filter(Boolean),
      relatedConcepts: expert.crossReferences?.map((c) => `${c.exam}: ${c.topic}`),
    },
  };
}

/** Concise markdown — correct + takeaway only (legacy clients). */
export function assembleConciseExpertMarkdown(expert: ExpertStructuredRationale): string {
  const bullets = expert.whyCorrect.conceptBreakdown
    .slice(0, 2)
    .map((b) => (b.startsWith("•") ? b : `• ${b}`))
    .join("\n");

  return [
    "## Why this answer is correct",
    "",
    expert.whyCorrect.headline,
    bullets,
    "",
    "## Key takeaway",
    "",
    `**${expert.keyTakeaway}**`,
  ]
    .filter(Boolean)
    .join("\n")
    .trim();
}
