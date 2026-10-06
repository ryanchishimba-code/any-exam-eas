import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  KEYFIX_BACKUP_TABLES,
  collectHandFixedIds,
  decideSeedUpsert,
  type SeedExistingRow,
} from "./sync-question-bank-guard";

const incoming = {
  question: "Using Cockcroft–Gault (female), which estimated creatinine clearance (mL/min) is closest?",
  correctAnswer: "38 mL/min",
  options: '["28 mL/min","38 mL/min","48 mL/min","58 mL/min"]',
  contentHash: "abc123",
};

function existing(overrides: Partial<SeedExistingRow> = {}): SeedExistingRow {
  return {
    id: "cmr31dgmm006vjs042cilnn5j",
    question: incoming.question,
    correctAnswer: "28 mL/min",
    options: incoming.options,
    active: true,
    manualCorrection: false,
    generationMeta: null,
    ...overrides,
  };
}

describe("KEYFIX_BACKUP_TABLES", () => {
  it("includes the 2026-10-05 batch 1 backup", () => {
    expect(KEYFIX_BACKUP_TABLES).toContain("qbi_fixes_task5_backup_20261005");
  });
});

describe("decideSeedUpsert", () => {
  it("creates a row the bank has never stored", () => {
    expect(
      decideSeedUpsert({
        existing: null,
        incoming,
        protectedIds: new Set(),
        backupHashes: new Set(),
        hideIds: new Set(),
      })
    ).toEqual({ action: "create" });
  });

  it("does not insert the pre-fix seed when that hash was snapshotted", () => {
    expect(
      decideSeedUpsert({
        existing: null,
        incoming,
        protectedIds: new Set(),
        backupHashes: new Set([incoming.contentHash]),
        hideIds: new Set(),
      })
    ).toEqual({ action: "skip", reason: "manual-correction", id: incoming.contentHash });
  });

  it("skips a row locked by the column, generationMeta, or a key-fix backup id", () => {
    const locked = [
      existing({ manualCorrection: true }),
      existing({ generationMeta: { manualCorrection: true } }),
      existing({ generationMeta: { keyFix: true } }),
    ];
    for (const row of locked) {
      expect(
        decideSeedUpsert({
          existing: row,
          incoming,
          protectedIds: new Set(),
          backupHashes: new Set(),
          hideIds: new Set(),
        }).action
      ).toBe("skip");
    }
    expect(
      decideSeedUpsert({
        existing: existing(),
        incoming,
        protectedIds: new Set([existing().id]),
        backupHashes: new Set(),
        hideIds: new Set(),
      })
    ).toEqual({ action: "skip", reason: "manual-correction", id: existing().id });
  });

  it("does not reactivate an inactive row or a code-hide row", () => {
    expect(
      decideSeedUpsert({
        existing: existing({ active: false, correctAnswer: incoming.correctAnswer }),
        incoming,
        protectedIds: new Set(),
        backupHashes: new Set(),
        hideIds: new Set(),
      })
    ).toEqual({ action: "skip", reason: "unchanged" });

    expect(
      decideSeedUpsert({
        existing: existing({ active: false }),
        incoming,
        protectedIds: new Set(),
        backupHashes: new Set(),
        hideIds: new Set(),
      })
    ).toEqual({ action: "update", active: false });

    expect(
      decideSeedUpsert({
        existing: existing({ active: false }),
        incoming,
        protectedIds: new Set(),
        backupHashes: new Set(),
        hideIds: new Set([existing().id]),
      })
    ).toEqual({ action: "update", active: false });

    expect(
      decideSeedUpsert({
        existing: existing({ active: true }),
        incoming,
        protectedIds: new Set(),
        backupHashes: new Set(),
        hideIds: new Set([existing().id]),
      })
    ).toEqual({ action: "update", active: true });
  });

  it("updates a visible unlocked row whose key drifted from the seed", () => {
    expect(
      decideSeedUpsert({
        existing: existing(),
        incoming,
        protectedIds: new Set(),
        backupHashes: new Set(),
        hideIds: new Set(),
      })
    ).toEqual({ action: "update", active: true });
  });
});

describe("collectHandFixedIds", () => {
  it("counts the applied key fixes, including typo-only rows", () => {
    const read = (name: string) =>
      JSON.parse(readFileSync(path.join(process.cwd(), "scripts/data", name), "utf8"));
    const collected = collectHandFixedIds({
      naplexProposed: read("naplex-keyfix-20260927/proposed-changes.json"),
      nclexBatch1: read("nclex-keyfix-20260927/proposed-changes.json"),
      nclexBatch2: read("nclex-keyfix-20260927-b2/proposed-changes.json"),
      nclexTypos: read("nclex-keyfix-20260927/typo-fixes.json"),
      naplexTypos: read("naplex-keyfix-20260927/typo-fixes.json"),
    });
    expect(collected.proposedIds).toHaveLength(229);
    expect(collected.typoOnlyIds).toEqual([
      "cmr1bha2y001b1yrm7mqc09ja",
      "cmr1bhex1002o1yrm5ppc87uz",
    ]);
    expect(new Set(collected.ids).size).toBe(231);
  });
});
