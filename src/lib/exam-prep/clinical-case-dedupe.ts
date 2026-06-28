import type { BankItem } from "@/lib/question-bank";
import { stripEncounterBoilerplate } from "@/lib/engine/polish/usmle-polish";
import { splitUsmleBankItem } from "@/lib/exam-prep/usmle-bank-split";

export type RankedBankRow = {
  id: string;
  item: BankItem;
  rank: number;
  serveReady: boolean;
  clinicalCaseKey: string;
  stemKey: string;
  subjectId: string;
};

export function normalizeStem(stem: string): string {
  return stem.trim().toLowerCase();
}

/** Collapse template noise so near-duplicate vignettes share one case key. */
export function normalizeClinicalCaseText(text: string): string {
  return stripEncounterBoilerplate(text)
    .replace(/\bselect the one best response for this scenario\.?\s*/gi, "")
    .replace(/\b\d{1,3}[- ]year[- ]old\b/gi, "N-year-old")
    .replace(/\bencounter\s+\d+\.?\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** Vignette text for dedupe — includes USMLE rows with case embedded in question. */
export function resolveClinicalVignetteText(item: BankItem): string {
  const explicit = item.vignette?.trim() || item.scenario?.trim();
  if (explicit && explicit.length >= 40) return explicit;

  const split = splitUsmleBankItem(item);
  if (split.vignette && split.vignette.length >= 40) return split.vignette;

  const question = item.question?.trim() ?? "";
  if (question.includes("\n\n")) {
    const head = question.split("\n\n")[0]?.trim() ?? "";
    if (head.length >= 40) return head;
  }

  const leadInMatch = question.match(
    /\n+(?:select the one best response(?: for this scenario)?\.?|which (?:diagnosis|finding|of the following)|what is the most likely)/i
  );
  if (leadInMatch?.index != null && leadInMatch.index >= 60) {
    return question.slice(0, leadInMatch.index).trim();
  }

  const templateBreak = question.search(
    /\n\n(?:which |what |how |select |the patient|laboratory studies show|physical examination)/i
  );
  if (templateBreak >= 60) return question.slice(0, templateBreak).trim();

  return explicit ?? question;
}

function isSequentialBlock(item: BankItem): boolean {
  const payload = item.ngnPayload as { kind?: string; setId?: string } | undefined;
  return payload?.kind === "sequential" && Boolean(payload.setId?.trim());
}

function sessionDomainFor(item: BankItem): string {
  return (
    item.blueprintDomain?.trim() ||
    item.topicCategory?.trim() ||
    item.subjectId?.trim() ||
    "general"
  );
}

/** Stable key for one clinical scenario — collapses same vignette, different stems. */
export function clinicalCaseKey(item: BankItem): string {
  if (isSequentialBlock(item)) {
    return `seq:${(item.ngnPayload as { setId: string }).setId}`;
  }
  const topic = sessionDomainFor(item);
  const vignette = normalizeClinicalCaseText(resolveClinicalVignetteText(item));
  if (vignette.length >= 40) {
    return `${topic}:v:${vignette.slice(0, 120)}`;
  }
  const stem = normalizeClinicalCaseText(item.question);
  return `${topic}:stem:${stem.slice(0, 120)}`;
}

export function stemKeyFor(item: BankItem): string {
  const subject = item.subjectId?.trim() || item.topicCategory?.trim() || "general";
  return `${subject}:${normalizeStem(item.question)}`;
}

/** Keep the highest-ranked row per clinical case; retire the rest. */
export function pickBestPerClinicalCase(rows: RankedBankRow[]): {
  keep: RankedBankRow[];
  retire: RankedBankRow[];
} {
  const byCase = new Map<string, RankedBankRow[]>();
  for (const row of rows) {
    const list = byCase.get(row.clinicalCaseKey) ?? [];
    list.push(row);
    byCase.set(row.clinicalCaseKey, list);
  }

  const keep: RankedBankRow[] = [];
  const retire: RankedBankRow[] = [];

  for (const group of byCase.values()) {
    group.sort((a, b) => b.rank - a.rank || a.id.localeCompare(b.id));
    keep.push(group[0]!);
    retire.push(...group.slice(1));
  }

  return { keep, retire };
}

/** Cap identical stems — keep top N ranked rows per stem key. */
export function applyStemCap(rows: RankedBankRow[], maxPerStem: number): {
  keep: RankedBankRow[];
  retire: RankedBankRow[];
} {
  if (maxPerStem <= 0) return { keep: rows, retire: [] };

  const byStem = new Map<string, RankedBankRow[]>();
  for (const row of rows) {
    const list = byStem.get(row.stemKey) ?? [];
    list.push(row);
    byStem.set(row.stemKey, list);
  }

  const keep: RankedBankRow[] = [];
  const retire: RankedBankRow[] = [];

  for (const group of byStem.values()) {
    group.sort((a, b) => b.rank - a.rank || a.id.localeCompare(b.id));
    keep.push(...group.slice(0, maxPerStem));
    retire.push(...group.slice(maxPerStem));
  }

  return { keep, retire };
}

export function buildRankedRow(
  id: string,
  item: BankItem,
  rank: number,
  serveReady: boolean
): RankedBankRow {
  return {
    id,
    item,
    rank,
    serveReady,
    clinicalCaseKey: clinicalCaseKey(item),
    stemKey: stemKeyFor(item),
    subjectId: item.subjectId ?? "general",
  };
}

export function summarizeDedupe(
  before: number,
  keep: RankedBankRow[],
  retire: RankedBankRow[]
) {
  const uniqueCases = new Set(keep.map((r) => r.clinicalCaseKey)).size;
  const uniqueStems = new Set(keep.map((r) => r.stemKey)).size;
  return {
    before,
    kept: keep.length,
    retired: retire.length,
    uniqueClinicalCases: uniqueCases,
    uniqueStems,
  };
}
