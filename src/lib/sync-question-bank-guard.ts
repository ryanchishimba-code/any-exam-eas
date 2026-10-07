import { createHash } from "crypto";

/**
 * Decides whether a seed upsert may overwrite a bank row.
 *
 * contentHash is sha256(fieldId|subjectId|scenario|stem). It does not include
 * correctAnswer or explanation, so a key fix keeps the same hash and the
 * nightly sync would otherwise write the seed key back over the correction.
 */

export function bankItemContentHash(
  fieldId: string,
  subjectId: string,
  item: { question: string; vignette?: string | null; scenario?: string | null }
): string {
  const scenario = (item.vignette ?? item.scenario ?? "").trim().toLowerCase();
  const stem = item.question.trim().toLowerCase();
  return createHash("sha256")
    .update(`${fieldId}|${subjectId}|${scenario}|${stem}`)
    .digest("hex");
}

export const KEYFIX_BACKUP_TABLES = [
  "qbi_naplex_keyfix_backup_20260927",
  "qbi_keyfix_backup_20260927",
  "qbi_keyfix_backup_20260927_b2",
  // 2026-10-05 batch 1. Holds the pre-rewrite hashes so a later seed match
  // cannot insert a second copy after the live contentHash moved.
  "qbi_fixes_task5_backup_20261005",
] as const;

export type SeedExistingRow = {
  id: string;
  question: string;
  correctAnswer: string;
  options: string;
  active: boolean;
  manualCorrection?: boolean | null;
  generationMeta?: unknown;
};

export type SeedIncomingContent = {
  question: string;
  correctAnswer: string;
  options: string;
  contentHash: string;
};

export type SeedUpsertDecision =
  | { action: "create" }
  | { action: "skip"; reason: "unchanged" }
  | { action: "skip"; reason: "manual-correction"; id: string }
  | { action: "update"; active: boolean };

export function generationMetaLocksSeed(meta: unknown): boolean {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return false;
  const record = meta as Record<string, unknown>;
  return record.manualCorrection === true || record.keyFix === true;
}

export function rowIsManuallyCorrected(
  existing: Pick<SeedExistingRow, "id" | "manualCorrection" | "generationMeta">,
  protectedIds: ReadonlySet<string>
): boolean {
  return (
    existing.manualCorrection === true ||
    generationMetaLocksSeed(existing.generationMeta) ||
    protectedIds.has(existing.id)
  );
}

/**
 * Inactive rows and code-hide-list rows stay at their current `active` value.
 * A visible row can be refreshed to active.
 */
export function nextSeedActive(existing: Pick<SeedExistingRow, "id" | "active">, hideIds: ReadonlySet<string>): boolean {
  if (!existing.active || hideIds.has(existing.id)) return existing.active;
  return true;
}

/** Tag prefix: `preserve-bank-row:<questionBankItem.id>`. */
export const PRESERVE_BANK_ROW_TAG_PREFIX = "preserve-bank-row:";

/**
 * Live row for the morphine-to-hydromorphone calc. Its contentHash is kept
 * by a separate manual correction, so the rewritten seed stem must not insert
 * a second copy and must not drop the live hash out of the active set.
 */
export const HYDROMORPHONE_ROTATION_PRESERVED_ROW_ID = "cmr31dhuk008ajs04ftdoajhj";

/**
 * Live AANP row for INR 6.8 without bleeding. A separate rewrite is landing
 * on this id. The seed key is corrected here; the tag keeps a hash mismatch
 * from inserting a second row or retiring the live one.
 */
export const WARFARIN_INR_NO_BLEED_PRESERVED_ROW_ID = "cmqgdi30k00251yr8p1il4n6l";

export function preserveBankRowTag(id: string): string {
  return `${PRESERVE_BANK_ROW_TAG_PREFIX}${id}`;
}

export function preservedBankRowIdFromTags(tags: readonly string[] | null | undefined): string | null {
  const tag = tags?.find((entry) => entry.startsWith(PRESERVE_BANK_ROW_TAG_PREFIX));
  if (!tag) return null;
  const id = tag.slice(PRESERVE_BANK_ROW_TAG_PREFIX.length).trim();
  return id.length > 0 ? id : null;
}

/**
 * Nightly sync matches seeds to bank rows by contentHash (scenario + stem),
 * not by id. A rewritten stem is a new hash. When the tagged live row still
 * exists under a different hash, do not upsert the seed (that would insert a
 * duplicate) and keep the live hash active so retirement leaves the row in
 * place. Manual-correction protection still applies if the hashes already match.
 * An empty bank has no live row, so the corrected seed may be created.
 */
export function planPreservedHashSeed(input: {
  seedHash: string;
  preservedRow: { id: string; contentHash: string } | null;
}): { upsertSeed: boolean; activeHashes: string[] } {
  if (!input.preservedRow || input.preservedRow.contentHash === input.seedHash) {
    return { upsertSeed: true, activeHashes: [input.seedHash] };
  }
  return { upsertSeed: false, activeHashes: [input.preservedRow.contentHash] };
}

export function decideSeedUpsert(input: {
  existing: SeedExistingRow | null;
  incoming: SeedIncomingContent;
  protectedIds: ReadonlySet<string>;
  /** contentHash values snapshotted in a key-fix backup. */
  backupHashes: ReadonlySet<string>;
  hideIds: ReadonlySet<string>;
}): SeedUpsertDecision {
  const { existing, incoming, protectedIds, backupHashes, hideIds } = input;

  if (!existing) {
    if (backupHashes.has(incoming.contentHash)) {
      return { action: "skip", reason: "manual-correction", id: incoming.contentHash };
    }
    return { action: "create" };
  }

  if (rowIsManuallyCorrected(existing, protectedIds)) {
    return { action: "skip", reason: "manual-correction", id: existing.id };
  }

  const active = nextSeedActive(existing, hideIds);
  const contentSame =
    existing.question === incoming.question &&
    existing.correctAnswer === incoming.correctAnswer &&
    existing.options === incoming.options;

  if (contentSame && existing.active === active) {
    return { action: "skip", reason: "unchanged" };
  }

  return { action: "update", active };
}

type IdRecord = Record<string, unknown>;

export function collectHandFixedIds(files: {
  naplexProposed: IdRecord;
  nclexBatch1: IdRecord;
  nclexBatch2: IdRecord;
  nclexTypos: IdRecord;
  naplexTypos: IdRecord;
}): { proposedIds: string[]; typoOnlyIds: string[]; ids: string[] } {
  const proposed = new Set<string>([
    ...Object.keys(files.naplexProposed),
    ...Object.keys(files.nclexBatch1),
    ...Object.keys(files.nclexBatch2),
  ]);
  const typoOnly = [...Object.keys(files.nclexTypos), ...Object.keys(files.naplexTypos)].filter(
    (id) => !proposed.has(id)
  );
  return {
    proposedIds: [...proposed],
    typoOnlyIds: typoOnly,
    ids: [...proposed, ...typoOnly],
  };
}
