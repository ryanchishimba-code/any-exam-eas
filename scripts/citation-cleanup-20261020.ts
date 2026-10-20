#!/usr/bin/env node
/**
 * Citation / tag cleanup on live QuestionBankItem rows (dry run by default).
 *
 * 1) Remove leftover tag `nclex-growth-pilot1` from tags JSON (other tags unchanged).
 * 2) Drop exam-blueprint-only reference entries when a clinical reference remains.
 * 3) Report counts of letter-labeled rationales on numbered-option MCQs (no auto-fix).
 *
 *   npx tsx scripts/citation-cleanup-20261020.ts
 *   npx tsx scripts/citation-cleanup-20261020.ts --apply
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import { cleanOptionText } from "@/lib/question-format";

const PILOT_TAG = "nclex-growth-pilot1";
const BACKUP_TABLE = "qbi_citation_cleanup_backup_20261020";

const prisma = new PrismaClient();

type Ref = Record<string, unknown>;

function parseTags(raw: string | null): string[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((t): t is string => typeof t === "string");
  } catch {
    return [];
  }
}

function parseReferences(raw: unknown): Ref[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((r) => r && typeof r === "object") as Ref[];
}

function refLabel(ref: Ref): string {
  const parts = [ref.label, ref.citation, ref.src].filter((v) => typeof v === "string") as string[];
  return parts.join(" ").trim();
}

/** Exam blueprint / test-plan citations — not clinical society sources. */
export function isBlueprintReference(ref: Ref): boolean {
  const label = String(ref.label ?? "").trim();
  const citation = String(ref.citation ?? "").trim();
  const src = String(ref.src ?? "").trim();
  const text = label || citation || src;
  if (!text) return false;

  // Standalone blueprint rows (typical generation output).
  if (
    /^(NCSBN|NCLEX)\b/i.test(text) &&
    /test plan|clinical judgment measurement|\bCJMM\b/i.test(text) &&
    text.length < 200
  ) {
    return true;
  }
  if (/^NABP\b/i.test(text) && /NAPLEX|MPJE|UMPJE/i.test(text) && /content outline/i.test(text)) {
    return true;
  }
  if (/^USMLE\b/i.test(text) && /content outline/i.test(text)) {
    return true;
  }
  if (/^NCCPA\b/i.test(text) && /PANCE|content outline/i.test(text)) {
    return true;
  }
  if (/^(FSBPT|NPTE)\b/i.test(text) && /content outline|test content/i.test(text)) {
    return true;
  }
  if (/^Source\s+[12]\s+—\s+NCLEX-RN Test Plan/i.test(label)) {
    return true;
  }
  if (/^NCSBN NCLEX-NGN Clinical Judgment Model$/i.test(label)) {
    return true;
  }

  return false;
}

function isClinicalReference(ref: Ref): boolean {
  if (isBlueprintReference(ref)) return false;
  const text = refLabel(ref);
  if (!text) return false;
  if (String(ref.src ?? "").startsWith("FDA_")) return true;
  if (/https?:\/\//i.test(text)) return true;
  if (/\b(PMC\d+|PMID|doi\.org|openFDA|DailyMed|ACC\/AHA|ADA|CDC|AHA|ISMP|ACOG|AAP|JNC|GOLD|CHEST|IDSA|ASHP|USP|NIH|MedlinePlus)\b/i.test(text)) {
    return true;
  }
  if (/guideline|consensus|label|textbook|OpenStax|LibreTexts/i.test(text)) return true;
  // Named society / drug label style without blueprint wording.
  if (text.length >= 12 && !/content outline|test plan/i.test(text)) return true;
  return false;
}

function stripPilotTag(tags: string[]): { next: string[]; changed: boolean } {
  if (!tags.includes(PILOT_TAG)) return { next: tags, changed: false };
  return { next: tags.filter((t) => t !== PILOT_TAG), changed: true };
}

function stripBlueprintRefs(refs: Ref[]): { next: Ref[]; removed: number } {
  const blueprint = refs.filter(isBlueprintReference);
  const clinical = refs.filter(isClinicalReference);
  if (blueprint.length === 0) return { next: refs, removed: 0 };
  if (clinical.length === 0) return { next: refs, removed: 0 };
  const drop = new Set(blueprint);
  const next = refs.filter((r) => !drop.has(r));
  return { next, removed: blueprint.length };
}

function parseOptionTexts(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map((o) => (typeof o === "string" ? o : String(o)));
    }
    if (parsed && typeof parsed === "object" && Array.isArray((parsed as { options?: unknown }).options)) {
      return ((parsed as { options: unknown[] }).options ?? []).map((o) =>
        typeof o === "string" ? o : String(o)
      );
    }
  } catch {
    /* ignore */
  }
  return [];
}

function usesNumberedOptions(optionTexts: string[]): boolean {
  if (optionTexts.length < 3) return false;
  const letterLed = optionTexts.filter((o) =>
    /^[\(\[]?[A-Da-d][\)\].:\-]\s/.test(cleanOptionText(o).trim())
  );
  return letterLed.length < Math.ceil(optionTexts.length / 2);
}

const LETTER_RATIONALE_RE =
  /\b(?:option|choice|answer)\s+[A-D]\b|\b[A-D]\s+is\s+(?:correct|incorrect|wrong|right)\b|\b(?:Correct|Incorrect):\s*[A-D]\b/i;

function rationaleBlob(row: {
  explanation: string;
  options: string;
}): string {
  const parts = [row.explanation];
  try {
    const parsed = JSON.parse(row.options) as Record<string, unknown>;
    for (const key of ["clinicalReasoning", "distractorRationale", "keyTakeaways"]) {
      const v = parsed[key];
      if (typeof v === "string") parts.push(v);
      if (v && typeof v === "object") {
        parts.push(JSON.stringify(v));
      }
    }
  } catch {
    /* ignore */
  }
  return parts.join("\n");
}

type Row = {
  id: string;
  fieldId: string;
  tags: string | null;
  references: unknown;
  options: string;
  explanation: string;
  itemType: string;
};

async function main() {
  const apply = process.argv.includes("--apply");
  const rows = (await prisma.$queryRawUnsafe(`
    SELECT id, "fieldId", tags, "references", options, explanation, "itemType"
    FROM "QuestionBankItem"
    WHERE active = true AND "qaPassed" = true
  `)) as Row[];

  let pilotTagRows = 0;
  let blueprintAnyByField: Record<string, number> = {};
  let blueprintOnlyByField: Record<string, number> = {};
  let blueprintMechanicalByField: Record<string, number> = {};
  const blueprintOnlySamples: string[] = [];
  let letterRationaleByField: Record<string, number> = {};

  const pilotSamples: { id: string; fieldId: string; before: string[]; after: string[] }[] = [];
  const blueprintSamples: {
    id: string;
    fieldId: string;
    before: Ref[];
    after: Ref[];
  }[] = [];

  const toUpdate: {
    id: string;
    tags?: string;
    references?: Prisma.InputJsonValue;
    pilot: boolean;
    blueprint: boolean;
  }[] = [];

  for (const row of rows) {
    const tags = parseTags(row.tags);
    const refs = parseReferences(row.references);
    const pilot = stripPilotTag(tags);
    const blueprint = stripBlueprintRefs(refs);

    if (pilot.changed) {
      pilotTagRows += 1;
      if (pilotSamples.length < 3) {
        pilotSamples.push({
          id: row.id,
          fieldId: row.fieldId,
          before: tags,
          after: pilot.next,
        });
      }
    }

    const hasBlueprint = refs.some(isBlueprintReference);
    if (hasBlueprint) {
      blueprintAnyByField[row.fieldId] = (blueprintAnyByField[row.fieldId] ?? 0) + 1;
      const clinical = refs.filter(isClinicalReference);
      if (clinical.length === 0) {
        blueprintOnlyByField[row.fieldId] = (blueprintOnlyByField[row.fieldId] ?? 0) + 1;
        if (blueprintOnlySamples.length < 12) {
          blueprintOnlySamples.push(`${row.id} (${row.fieldId}) refs=${refs.map(refLabel).join(" | ")}`);
        }
      } else if (blueprint.removed > 0) {
        blueprintMechanicalByField[row.fieldId] =
          (blueprintMechanicalByField[row.fieldId] ?? 0) + 1;
        if (blueprintSamples.length < 3) {
          blueprintSamples.push({
            id: row.id,
            fieldId: row.fieldId,
            before: refs,
            after: blueprint.next,
          });
        }
      }
    }

    const optionTexts = parseOptionTexts(row.options);
    const numberedMcq =
      usesNumberedOptions(optionTexts) &&
      ["mcq", "vignette", "case_based", "abstract", "drug_ad", "ethics", "biostats"].includes(
        row.itemType
      );
    if (numberedMcq && LETTER_RATIONALE_RE.test(rationaleBlob(row))) {
      letterRationaleByField[row.fieldId] = (letterRationaleByField[row.fieldId] ?? 0) + 1;
    }

    if (pilot.changed || blueprint.removed > 0) {
      toUpdate.push({
        id: row.id,
        pilot: pilot.changed,
        blueprint: blueprint.removed > 0,
        ...(pilot.changed ? { tags: JSON.stringify(pilot.next) } : {}),
        ...(blueprint.removed > 0
          ? { references: blueprint.next as Prisma.InputJsonValue }
          : {}),
      });
    }
  }

  const sum = (m: Record<string, number>) =>
    Object.values(m).reduce((a, b) => a + b, 0);

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`live qaPassed rows scanned: ${rows.length}`);
  console.log("\n(1) Pilot tag nclex-growth-pilot1 in tags");
  console.log(`  rows to strip tag: ${pilotTagRows}`);
  if (pilotSamples.length) {
    console.log("  samples (tags before → after):");
    for (const s of pilotSamples) {
      console.log(`    ${s.id} [${s.fieldId}]`);
      console.log(`      before: ${JSON.stringify(s.before)}`);
      console.log(`      after:  ${JSON.stringify(s.after)}`);
    }
  }

  console.log("\n(2) Blueprint references in references[]");
  console.log(`  rows citing any blueprint ref: ${sum(blueprintAnyByField)}`);
  console.log("  by field (any blueprint):", blueprintAnyByField);
  console.log(`  blueprint-only rows (no clinical ref — list only): ${sum(blueprintOnlyByField)}`);
  console.log("  by field (blueprint-only):", blueprintOnlyByField);
  if (blueprintOnlySamples.length) {
    console.log("  blueprint-only samples (first 12):");
    for (const line of blueprintOnlySamples.slice(0, 12)) console.log(`    ${line}`);
  }
  console.log(`  mechanical blueprint drop (has clinical ref): ${sum(blueprintMechanicalByField)}`);
  console.log("  by field (mechanical):", blueprintMechanicalByField);
  if (blueprintSamples.length) {
    console.log("  samples (references before → after):");
    for (const s of blueprintSamples) {
      console.log(`    ${s.id} [${s.fieldId}]`);
      console.log(`      before: ${JSON.stringify(s.before)}`);
      console.log(`      after:  ${JSON.stringify(s.after)}`);
    }
  }

  console.log("\n(3) Letter-labeled rationales on numbered-option MCQs (count only)");
  console.log(`  total: ${sum(letterRationaleByField)}`);
  console.log("  by field:", letterRationaleByField);

  console.log(`\nrows with any apply change: ${toUpdate.length}`);
  console.log(`backup table (apply): ${BACKUP_TABLE}`);
  console.log("apply command: npx tsx scripts/citation-cleanup-20261020.ts --apply");

  if (!apply) {
    console.log("\nNo writes.");
    return;
  }

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "${BACKUP_TABLE}" AS
    SELECT q.*, now() AS backed_up_at
    FROM "QuestionBankItem" q
    WHERE false
  `);

  for (const patch of toUpdate) {
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

    const data: Prisma.QuestionBankItemUpdateInput = {};
    if (patch.tags !== undefined) data.tags = patch.tags;
    if (patch.references !== undefined) data.references = patch.references;
    await prisma.questionBankItem.update({ where: { id: patch.id }, data });
  }

  console.log(`\nApplied ${toUpdate.length} row updates. Backup: ${BACKUP_TABLE}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
