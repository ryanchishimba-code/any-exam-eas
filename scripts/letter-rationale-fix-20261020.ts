#!/usr/bin/env node
/**
 * Rewrite unambiguous letter option labels in rationales to numbers (A→1 … F→6)
 * using **stored** QuestionBankItem option order. UI MCQ buttons use index+1 on the
 * delivered option list; shuffle is skipped when stems/rationales lock order (bare
 * "B is incorrect", etc.). For shufflable items, serve-time rewrite adjusts labeled
 * "Option X" letters only — stored-index numbers are unsafe → excluded from apply.
 *
 *   npx tsx scripts/letter-rationale-fix-20261020.ts
 *   npx tsx scripts/letter-rationale-fix-20261020.ts --apply
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import { cleanOptionText } from "@/lib/question-format";
import { shuffleDeliveryChoices } from "@/lib/questions/shuffle-delivery";

const BACKUP_TABLE = "qbi_letter_rationale_fix_backup_20261020";
const MISMATCH_JSON = path.join(
  process.cwd(),
  "scripts/data/letter-mismatch-23.json"
);

const prisma = new PrismaClient();

const MCQ_TYPES = new Set([
  "mcq",
  "vignette",
  "case_based",
  "abstract",
  "drug_ad",
  "ethics",
  "biostats",
]);

const MASK_PATTERNS: RegExp[] = [
  /vitamin\s+[A-F]\d*/gi,
  /hepatitis\s+[A-F]\b/gi,
  /\bclass\s+[A-F]\b/gi,
  /\btype\s+[A-F]\b/gi,
  /Rho\s*\(\s*[A-F]\s*\)/gi,
  /\b[A-F]\s*-\s*dimer\b/gi,
  /factor\s+[A-F]\b/gi,
  /grade\s+[A-F]\b/gi,
];

type OptionsPayload = {
  raw: string;
  options: string[];
  clinicalReasoning?: string;
  distractorRationale?: Record<string, string>;
  solutionSteps?: string[];
  expertRationale?: unknown;
  keyTakeaways?: unknown;
};

type Row = {
  id: string;
  fieldId: string;
  question: string;
  scenario: string | null;
  options: string;
  explanation: string;
  correctAnswer: string;
  itemType: string;
};

function normKey(text: string): string {
  return cleanOptionText(text).toLowerCase().replace(/\s+/g, " ").trim();
}

export function parseOptionsPayload(raw: string): OptionsPayload {
  const base: OptionsPayload = { raw, options: [] };
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      base.options = parsed.map((o) => (typeof o === "string" ? o : String(o)));
      return base;
    }
    if (parsed && typeof parsed === "object") {
      const obj = parsed as Record<string, unknown>;
      if (Array.isArray(obj.options)) {
        base.options = obj.options.map((o) => (typeof o === "string" ? o : String(o)));
      }
      if (typeof obj.clinicalReasoning === "string") base.clinicalReasoning = obj.clinicalReasoning;
      if (obj.distractorRationale && typeof obj.distractorRationale === "object") {
        base.distractorRationale = obj.distractorRationale as Record<string, string>;
      }
      if (Array.isArray(obj.solutionSteps)) {
        base.solutionSteps = obj.solutionSteps.map((s) => String(s));
      }
      if (obj.expertRationale !== undefined) base.expertRationale = obj.expertRationale;
      if (obj.keyTakeaways !== undefined) base.keyTakeaways = obj.keyTakeaways;
    }
  } catch {
    /* ignore */
  }
  return base;
}

function usesNumberedOptions(optionTexts: string[]): boolean {
  if (optionTexts.length < 3) return false;
  const letterLed = optionTexts.filter((o) =>
    /^[\(\[]?[A-Da-d][\)\].:\-]\s/.test(cleanOptionText(o).trim())
  );
  return letterLed.length < Math.ceil(optionTexts.length / 2);
}

function maskProtectedPhrases(text: string): { masked: string; tokens: Map<string, string> } {
  const tokens = new Map<string, string>();
  let i = 0;
  let masked = text;
  for (const re of MASK_PATTERNS) {
    masked = masked.replace(re, (match) => {
      const key = `⟦MASK${i++}⟧`;
      tokens.set(key, match);
      return key;
    });
  }
  return { masked, tokens };
}

function unmask(text: string, tokens: Map<string, string>): string {
  let out = text;
  for (const [key, value] of tokens) out = out.replaceAll(key, value);
  return out;
}

function numForLetter(letter: string, optionCount: number): string | null {
  const idx = letter.toUpperCase().charCodeAt(0) - 65;
  if (idx < 0 || idx >= optionCount) return null;
  return String(idx + 1);
}

export function rewriteLettersToNumbers(text: string, optionCount: number): { text: string; changed: boolean } {
  if (!text?.trim() || optionCount < 2) return { text, changed: false };
  const { masked, tokens } = maskProtectedPhrases(text);
  let changed = false;

  const bump = (next: string, original: string) => {
    if (next !== original) changed = true;
    return next;
  };

  let out = masked
    .replace(
      /(^|\n)([ \t]*(?:[-*•][ \t]+)?)(\()([A-F])(\))(?=\s|$)/gm,
      (full, lead: string, indent: string, open: string, letter: string, close: string) => {
        const n = numForLetter(letter, optionCount);
        return n ? bump(`${lead}${indent}${open}${n}${close}`, full) : full;
      }
    )
    .replace(
      /(^|\n)([ \t]*)(\*\*)([A-F])(\.)/g,
      (full, lead: string, indent: string, stars: string, letter: string, dot: string) => {
        const n = numForLetter(letter, optionCount);
        return n ? bump(`${lead}${indent}${stars}${n}${dot}`, full) : full;
      }
    )
    .replace(
      /(^|\n)([ \t]*)([A-F])([.)])(?=\s+[A-Z])/g,
      (full, lead: string, indent: string, letter: string, mark: string) => {
        const n = numForLetter(letter, optionCount);
        return n ? bump(`${lead}${indent}${n}${mark}`, full) : full;
      }
    )
    .replace(
      /\b([Oo]ption|[Cc]hoice|[Aa]nswer)\s+([A-F])(?![A-Za-z0-9-])/g,
      (full, word: string, letter: string) => {
        const n = numForLetter(letter, optionCount);
        return n ? bump(`${word} ${n}`, full) : full;
      }
    )
    .replace(
      /\b(?:Correct|Incorrect|Answer)\s*:\s*([A-F])\b/g,
      (full, letter: string) => {
        const n = numForLetter(letter, optionCount);
        return n ? bump(full.replace(letter, n), full) : full;
      }
    )
    .replace(
      /(?:^|[.;:\n(])\s*([A-F])\s+is\s+(correct|incorrect|wrong|right)\b/gim,
      (full, letter: string, word: string) => {
        const n = numForLetter(letter, optionCount);
        return n ? bump(full.replace(letter, n), full) : full;
      }
    )
    .replace(
      /(?:^|[.;:\n(])\s*([A-F])\s+does\s+not\b/gim,
      (full, letter: string) => {
        const n = numForLetter(letter, optionCount);
        return n ? bump(full.replace(letter, n), full) : full;
      }
    )
    .replace(
      /(?:^|[.;:\n])\s*([A-F])\s+\(/g,
      (full, letter: string) => {
        const n = numForLetter(letter, optionCount);
        return n ? bump(full.replace(letter, n), full) : full;
      }
    );

  out = unmask(out, tokens);
  return { text: out, changed };
}

const LETTER_SIGNAL_RE =
  /\b(?:option|choice|answer)\s+[A-F]\b|\b[A-F]\s+is\s+(?:correct|incorrect|wrong|right)\b|\b(?:Correct|Incorrect|Answer)\s*:\s*[A-F]\b|(?:^|\n)\s*\([A-F]\)/i;

/** Same detector as citation-cleanup audit (~411 rows). */
const LEGACY_LETTER_RE =
  /\b(?:option|choice|answer)\s+[A-D]\b|\b[A-D]\s+is\s+(?:correct|incorrect|wrong|right)\b|\b(?:Correct|Incorrect):\s*[A-D]\b/i;

function legacyLetterBlob(row: Row, payload: OptionsPayload): string {
  const parts = [row.explanation];
  if (payload.clinicalReasoning) parts.push(payload.clinicalReasoning);
  if (payload.distractorRationale) parts.push(Object.values(payload.distractorRationale).join("\n"));
  return parts.join("\n");
}

function inLegacy411Scope(row: Row, payload: OptionsPayload): boolean {
  return (
    MCQ_TYPES.has(row.itemType) &&
    usesNumberedOptions(payload.options) &&
    LEGACY_LETTER_RE.test(legacyLetterBlob(row, payload))
  );
}

const RISKY_REMAINING_RE =
  /\b(?:both|options|choices|answers)\s+[A-F]\s*(?:,|\band\b|\bor\b)\s*[A-F]\b/i;

function optionTextForLetter(letter: string, options: string[]): string | null {
  const idx = letter.toUpperCase().charCodeAt(0) - 65;
  if (idx < 0 || idx >= options.length) return null;
  return options[idx] ?? null;
}

function keyedOptionTexts(options: string[], correctAnswer: string): string[] {
  const trimmed = correctAnswer.trim();
  if (/^[A-F]$/i.test(trimmed)) {
    const opt = optionTextForLetter(trimmed, options);
    return opt ? [opt] : [];
  }
  const key = normKey(trimmed);
  const hits = options.filter((o) => normKey(o) === key);
  return hits.length ? hits : trimmed ? [trimmed] : [];
}

function claimedCorrectLetters(maskedText: string): string[] {
  const found = new Set<string>();
  for (const m of maskedText.matchAll(/\b(?:Correct|Answer)\s*:\s*([A-F])\b/gi)) {
    found.add(m[1]!.toUpperCase());
  }
  for (const m of maskedText.matchAll(/(?:^|[.;:\n(])\s*([A-F])\s+is\s+correct\b/gim)) {
    found.add(m[1]!.toUpperCase());
  }
  for (const m of maskedText.matchAll(
    /\b(?:Option|Choice|Answer)\s+([A-F])\s+is\s+(?:the\s+)?correct\b/gi
  )) {
    found.add(m[1]!.toUpperCase());
  }
  return [...found];
}

function mismatchCorrectClaims(maskedText: string, options: string[], correctAnswer: string): string | null {
  const claims = claimedCorrectLetters(maskedText);
  if (!claims.length) return null;
  const keyed = keyedOptionTexts(options, correctAnswer).map(normKey);
  if (!keyed.length) return "no keyed option";
  for (const letter of claims) {
    const opt = optionTextForLetter(letter, options);
    if (!opt) return `letter ${letter} out of range`;
    if (!keyed.includes(normKey(opt))) {
      return `claims ${letter} (${cleanOptionText(opt).slice(0, 40)}…) vs key ${correctAnswer.slice(0, 40)}`;
    }
  }
  return null;
}

function serveOrderLocked(
  options: string[],
  correctAnswer: string,
  stem: string,
  corpus: string,
  payload: OptionsPayload
): boolean {
  const input = {
    options,
    correctAnswer,
    question: stem,
    explanation: corpus,
    clinicalReasoning: payload.clinicalReasoning,
    distractorRationale: payload.distractorRationale,
    solutionSteps: payload.solutionSteps,
    expertRationale: payload.expertRationale,
  };
  for (const seed of [1, 2, 7, 42]) {
    if (shuffleDeliveryChoices({ ...input, seed }).shuffled) return false;
  }
  return true;
}

export function rewriteUnknown(value: unknown, optionCount: number): { value: unknown; changed: boolean } {
  if (typeof value === "string") {
    const r = rewriteLettersToNumbers(value, optionCount);
    return { value: r.text, changed: r.changed };
  }
  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((entry) => {
      const r = rewriteUnknown(entry, optionCount);
      changed = changed || r.changed;
      return r.value;
    });
    return { value: next, changed };
  }
  if (!value || typeof value !== "object") return { value, changed: false };
  let changed = false;
  const out: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    let nextKey = key;
    if (/^[A-F]$/i.test(key)) {
      const n = numForLetter(key, optionCount);
      if (n) {
        nextKey = n;
        changed = true;
      }
    }
    const r = rewriteUnknown(entry, optionCount);
    changed = changed || r.changed;
    out[nextKey] = r.value;
  }
  return { value: out, changed };
}

export function rebuildOptionsRaw(payload: OptionsPayload): string {
  try {
    const parsed = JSON.parse(payload.raw) as unknown;
    if (Array.isArray(parsed)) return JSON.stringify(payload.options);
    if (parsed && typeof parsed === "object") {
      const obj = { ...(parsed as Record<string, unknown>) };
      if (obj.options) obj.options = payload.options;
      if (payload.clinicalReasoning !== undefined) obj.clinicalReasoning = payload.clinicalReasoning;
      if (payload.distractorRationale !== undefined) {
        obj.distractorRationale = payload.distractorRationale;
      }
      if (payload.solutionSteps !== undefined) obj.solutionSteps = payload.solutionSteps;
      if (payload.expertRationale !== undefined) obj.expertRationale = payload.expertRationale;
      if (payload.keyTakeaways !== undefined) obj.keyTakeaways = payload.keyTakeaways;
      return JSON.stringify(obj);
    }
  } catch {
    /* fall through */
  }
  return payload.raw;
}

function rationaleCorpus(row: Row, payload: OptionsPayload): string {
  const parts = [row.explanation];
  if (payload.clinicalReasoning) parts.push(payload.clinicalReasoning);
  if (payload.solutionSteps?.length) parts.push(payload.solutionSteps.join("\n"));
  if (payload.distractorRationale) parts.push(Object.values(payload.distractorRationale).join("\n"));
  if (payload.expertRationale != null) parts.push(JSON.stringify(payload.expertRationale));
  return parts.join("\n");
}

type ProcessResult =
  | { kind: "skip"; reason: string }
  | { kind: "ambiguous"; reason: string }
  | { kind: "mismatch"; reason: string }
  | {
      kind: "fixable";
      explanation: string;
      optionsRaw: string;
      beforeSnippet: string;
      afterSnippet: string;
    };

function processRow(row: Row): ProcessResult {
  if (!MCQ_TYPES.has(row.itemType)) return { kind: "skip", reason: "item type" };
  const payload = parseOptionsPayload(row.options);
  if (!usesNumberedOptions(payload.options)) return { kind: "skip", reason: "letter-led options" };

  const corpus = rationaleCorpus(row, payload);
  const legacyScope = inLegacy411Scope(row, payload);
  if (!legacyScope && !LETTER_SIGNAL_RE.test(corpus)) {
    return { kind: "skip", reason: "no letter signal" };
  }
  if (!legacyScope) {
    return { kind: "skip", reason: "outside legacy 411 scope" };
  }

  const stem = [row.scenario, row.question].filter(Boolean).join("\n");
  if (!serveOrderLocked(payload.options, row.correctAnswer, stem, corpus, payload)) {
    return { kind: "ambiguous", reason: "serve-time shuffle may reorder options vs stored index" };
  }

  const { masked } = maskProtectedPhrases(corpus);
  const mismatch = mismatchCorrectClaims(masked, payload.options, row.correctAnswer);
  if (mismatch) return { kind: "mismatch", reason: mismatch };

  if (RISKY_REMAINING_RE.test(masked)) {
    return { kind: "ambiguous", reason: "multi-letter composite reference" };
  }

  let anyChanged = false;
  const exp = rewriteLettersToNumbers(row.explanation, payload.options.length);
  anyChanged = anyChanged || exp.changed;

  if (payload.clinicalReasoning) {
    const r = rewriteLettersToNumbers(payload.clinicalReasoning, payload.options.length);
    payload.clinicalReasoning = r.text;
    anyChanged = anyChanged || r.changed;
  }
  if (payload.solutionSteps?.length) {
    payload.solutionSteps = payload.solutionSteps.map((step) => {
      const r = rewriteLettersToNumbers(step, payload.options.length);
      anyChanged = anyChanged || r.changed;
      return r.text;
    });
  }
  if (payload.distractorRationale) {
    const next: Record<string, string> = {};
    for (const [key, value] of Object.entries(payload.distractorRationale)) {
      let nextKey = key;
      if (/^[A-F]$/i.test(key)) {
        const n = numForLetter(key, payload.options.length);
        if (n) {
          nextKey = n;
          anyChanged = true;
        }
      }
      const r = rewriteLettersToNumbers(value, payload.options.length);
      anyChanged = anyChanged || r.changed;
      next[nextKey] = r.text;
    }
    payload.distractorRationale = next;
  }
  if (payload.expertRationale != null) {
    const r = rewriteUnknown(payload.expertRationale, payload.options.length);
    anyChanged = anyChanged || r.changed;
    payload.expertRationale = r.value;
  }
  if (payload.keyTakeaways != null) {
    const r = rewriteUnknown(payload.keyTakeaways, payload.options.length);
    anyChanged = anyChanged || r.changed;
    payload.keyTakeaways = r.value;
  }

  if (!anyChanged) return { kind: "ambiguous", reason: "no safe rewrites" };

  const afterCorpus = rationaleCorpus({ ...row, explanation: exp.text }, payload);
  const { masked: afterMasked } = maskProtectedPhrases(afterCorpus);
  if (LETTER_SIGNAL_RE.test(afterMasked) || RISKY_REMAINING_RE.test(afterMasked)) {
    return { kind: "ambiguous", reason: "leftover letter signals after rewrite" };
  }

  const beforeSnippet = corpus.slice(0, 220).replace(/\s+/g, " ");
  const afterSnippet = [exp.text, payload.clinicalReasoning ?? ""]
    .join(" ")
    .slice(0, 220)
    .replace(/\s+/g, " ");

  return {
    kind: "fixable",
    explanation: exp.text,
    optionsRaw: rebuildOptionsRaw(payload),
    beforeSnippet,
    afterSnippet,
  };
}

async function main() {
  const apply = process.argv.includes("--apply");
  const rows = (await prisma.$queryRawUnsafe(`
    SELECT id, "fieldId", question, scenario, options, explanation, "correctAnswer", "itemType"
    FROM "QuestionBankItem"
    WHERE active = true AND "qaPassed" = true
  `)) as Row[];

  const byField = {
    fixable: {} as Record<string, number>,
    ambiguous: {} as Record<string, number>,
    mismatch: {} as Record<string, number>,
  };
  const legacyByKind = { fixable: 0, ambiguous: 0, mismatch: 0, skip: 0 };
  const legacyByField = {
    fixable: {} as Record<string, number>,
    ambiguous: {} as Record<string, number>,
    mismatch: {} as Record<string, number>,
  };
  const samples: { id: string; fieldId: string; before: string; after: string }[] = [];
  const toApply: { id: string; explanation: string; options: string }[] = [];
  const mismatchRows: {
    id: string;
    fieldId: string;
    claimedLetters: string[];
    correctAnswer: string;
    keyedOptions: string[];
    detail: string;
  }[] = [];

  let shufflableLetterRows = 0;

  for (const row of rows) {
    const payload = parseOptionsPayload(row.options);
    const corpus = rationaleCorpus(row, payload);
    if (
      usesNumberedOptions(payload.options) &&
      MCQ_TYPES.has(row.itemType) &&
      LETTER_SIGNAL_RE.test(corpus)
    ) {
      const stem = [row.scenario, row.question].filter(Boolean).join("\n");
      if (!serveOrderLocked(payload.options, row.correctAnswer, stem, corpus, payload)) {
        shufflableLetterRows += 1;
      }
    }

    const result = processRow(row);
    if (inLegacy411Scope(row, payload)) {
      if (result.kind === "fixable") {
        legacyByKind.fixable += 1;
        legacyByField.fixable[row.fieldId] = (legacyByField.fixable[row.fieldId] ?? 0) + 1;
      } else if (result.kind === "ambiguous") {
        legacyByKind.ambiguous += 1;
        legacyByField.ambiguous[row.fieldId] = (legacyByField.ambiguous[row.fieldId] ?? 0) + 1;
      } else if (result.kind === "mismatch") {
        legacyByKind.mismatch += 1;
        legacyByField.mismatch[row.fieldId] = (legacyByField.mismatch[row.fieldId] ?? 0) + 1;
        const { masked } = maskProtectedPhrases(legacyLetterBlob(row, payload));
        mismatchRows.push({
          id: row.id,
          fieldId: row.fieldId,
          claimedLetters: claimedCorrectLetters(masked),
          correctAnswer: row.correctAnswer,
          keyedOptions: keyedOptionTexts(payload.options, row.correctAnswer),
          detail: result.reason,
        });
      } else legacyByKind.skip += 1;
    }

    if (result.kind === "fixable") {
      byField.fixable[row.fieldId] = (byField.fixable[row.fieldId] ?? 0) + 1;
      toApply.push({ id: row.id, explanation: result.explanation, options: result.optionsRaw });
      if (samples.length < 3) {
        samples.push({
          id: row.id,
          fieldId: row.fieldId,
          before: result.beforeSnippet,
          after: result.afterSnippet,
        });
      }
    } else if (result.kind === "ambiguous") {
      byField.ambiguous[row.fieldId] = (byField.ambiguous[row.fieldId] ?? 0) + 1;
    } else if (result.kind === "mismatch") {
      byField.mismatch[row.fieldId] = (byField.mismatch[row.fieldId] ?? 0) + 1;
    }
  }

  const sum = (m: Record<string, number>) => Object.values(m).reduce((a, b) => a + b, 0);

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(
    "Display model: MCQ UI labels options 1..n in delivered order; bank stores canonical order (A=1..). " +
      "shuffleDeliveryChoices skips shuffle when stems/rationales lock order; otherwise letters in " +
      '"Option X" are rewritten at serve time — stored-index number rewrites are only proposed when serve order is locked.'
  );
  console.log(
    `letter-signal numbered MCQs with serve shuffle possible: ${shufflableLetterRows} (excluded from fixable set)`
  );

  console.log("\nPrior audit scope (411 numbered MCQs, legacy letter detector):");
  console.log(
    `  fixable ${legacyByKind.fixable}, skipped-ambiguous ${legacyByKind.ambiguous}, mismatch ${legacyByKind.mismatch}`
  );
  console.log("  fixable by board:", legacyByField.fixable);
  console.log("  skipped-ambiguous by board:", legacyByField.ambiguous);
  console.log("  mismatch by board:", legacyByField.mismatch);

  if (samples.length) {
    console.log("\nSamples (before → after snippet):");
    for (const s of samples) {
      console.log(`  ${s.id} [${s.fieldId}]`);
      console.log(`    before: ${s.before}…`);
      console.log(`    after:  ${s.after}…`);
    }
  }

  console.log(`\nrows in apply set: ${toApply.length}`);
  console.log(`backup table (apply): ${BACKUP_TABLE}`);
  console.log("apply command: npx tsx scripts/letter-rationale-fix-20261020.ts --apply");

  mkdirSync(path.dirname(MISMATCH_JSON), { recursive: true });
  writeFileSync(
    MISMATCH_JSON,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: mismatchRows.length,
        rows: mismatchRows,
      },
      null,
      2
    ) + "\n"
  );
  console.log(`mismatch report: ${MISMATCH_JSON} (${mismatchRows.length} rows)`);

  if (!apply) {
    console.log("\nNo writes.");
    return;
  }

  if (Math.abs(legacyByKind.fixable - 147) > 2) {
    console.error(
      `STOP: fixable count ${legacyByKind.fixable} differs from approved 147 by more than 2.`
    );
    process.exit(1);
  }

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "${BACKUP_TABLE}" AS
    SELECT q.*, now() AS backed_up_at
    FROM "QuestionBankItem" q
    WHERE false
  `);

  for (const patch of toApply) {
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO "${BACKUP_TABLE}"
      SELECT q.*, now() AS backed_up_at
      FROM "QuestionBankItem" q
      WHERE q.id = $1
        AND NOT EXISTS (SELECT 1 FROM "${BACKUP_TABLE}" b WHERE b.id = q.id)
      `,
      patch.id
    );
    await prisma.questionBankItem.update({
      where: { id: patch.id },
      data: { explanation: patch.explanation, options: patch.options },
    });
  }

  console.log(`\nApplied ${toApply.length} updates. Backup: ${BACKUP_TABLE}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
