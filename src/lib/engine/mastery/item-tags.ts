/**
 * Read mastery tags from QuestionBankItem fields / generationMeta / tags string.
 * Nullable — fill where we can; never block on perfect ontology.
 */

import type { CjmmFunction, MasteryItemTags } from "./types";

const CJMM: ReadonlySet<string> = new Set([
  "recognize_cues",
  "analyze_cues",
  "prioritize_hypotheses",
  "generate_solutions",
  "take_action",
  "evaluate_outcomes",
]);

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string" && x.length > 0);
}

function parseTagsCsv(tags: string | null | undefined): string[] {
  if (!tags) return [];
  return tags
    .split(/[,;|]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

export function parseMasteryItemTags(input: {
  clientNeeds?: string | null;
  cjmmFunction?: string | null;
  tags?: string | null;
  generationMeta?: unknown;
  curationMeta?: unknown;
}): MasteryItemTags {
  const meta =
    (input.generationMeta && typeof input.generationMeta === "object"
      ? (input.generationMeta as Record<string, unknown>)
      : {}) || {};
  const curation =
    (input.curationMeta && typeof input.curationMeta === "object"
      ? (input.curationMeta as Record<string, unknown>)
      : {}) || {};

  const mastery =
    (meta.mastery && typeof meta.mastery === "object"
      ? (meta.mastery as Record<string, unknown>)
      : curation.mastery && typeof curation.mastery === "object"
        ? (curation.mastery as Record<string, unknown>)
        : {}) || {};

  const csv = parseTagsCsv(input.tags);
  const clientNeeds =
    input.clientNeeds ||
    (typeof mastery.clientNeeds === "string" ? mastery.clientNeeds : null) ||
    csv.find((t) => t.startsWith("cn:"))?.slice(3) ||
    null;

  const rawCjmm =
    input.cjmmFunction ||
    (typeof mastery.cjmmFunction === "string" ? mastery.cjmmFunction : null) ||
    csv.find((t) => t.startsWith("cjmm:"))?.slice(5) ||
    null;
  const cjmmFunction =
    rawCjmm && CJMM.has(rawCjmm) ? (rawCjmm as CjmmFunction) : null;

  const drugIds = [
    ...asStringArray(mastery.drug_ids ?? mastery.drugIds),
    ...csv.filter((t) => t.startsWith("drug:")).map((t) => t.slice(5)),
  ];
  const anatomyId =
    (typeof mastery.anatomy_id === "string" ? mastery.anatomy_id : null) ||
    (typeof mastery.anatomyId === "string" ? mastery.anatomyId : null) ||
    csv.find((t) => t.startsWith("anatomy:"))?.slice(8) ||
    null;
  const labFlags = [
    ...asStringArray(mastery.lab_flags ?? mastery.labFlags),
    ...csv.filter((t) => t.startsWith("lab:")).map((t) => t.slice(4)),
  ];
  const calcFlags = [
    ...asStringArray(mastery.calc_flags ?? mastery.calcFlags),
    ...csv.filter((t) => t.startsWith("calc:")).map((t) => t.slice(5)),
  ];

  const rawNaplexDomain =
    mastery.naplexDomain ??
    mastery.naplex_domain ??
    csv.find((t) => t.startsWith("naplexDomain:"))?.slice("naplexDomain:".length) ??
    csv.find((t) => /^naplex-?[1-5]$/i.test(t))?.replace(/[^0-9]/g, "");
  const naplexDomainNum = Number(rawNaplexDomain);
  const naplexDomain =
    naplexDomainNum >= 1 && naplexDomainNum <= 5
      ? (naplexDomainNum as 1 | 2 | 3 | 4 | 5)
      : null;

  const naplexSubtopic =
    (typeof mastery.naplexSubtopic === "string" ? mastery.naplexSubtopic : null) ||
    (typeof mastery.naplex_subtopic === "string" ? mastery.naplex_subtopic : null) ||
    csv.find((t) => t.startsWith("naplexSubtopic:"))?.slice("naplexSubtopic:".length) ||
    null;

  const primerCardId =
    (typeof mastery.primerCardId === "string" ? mastery.primerCardId : null) ||
    (typeof mastery.primer_card_id === "string" ? mastery.primer_card_id : null);

  return {
    clientNeeds,
    cjmmFunction,
    drugIds: [...new Set(drugIds)],
    anatomyId,
    labFlags: [...new Set(labFlags)],
    naplexDomain,
    naplexSubtopic,
    calcFlags: [...new Set(calcFlags)],
    primerCardId,
  };
}
