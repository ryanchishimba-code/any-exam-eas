import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { NAPLEX_CALC_CASES_V3 } from "@/lib/exam-prep/naplex-calc-cases-v3";
import { AANP_FNP_PHYSICIAN_EDUCATOR_BATCH_EVALUATE } from "@/lib/edtech/seeds/aanp-fnp-physician-educator-batch-evaluate";
import {
  HYDROMORPHONE_ROTATION_PRESERVED_ROW_ID,
  KEYFIX_BACKUP_TABLES,
  WARFARIN_INR_NO_BLEED_PRESERVED_ROW_ID,
  bankItemContentHash,
  collectHandFixedIds,
  decideSeedUpsert,
  planPreservedHashSeed,
  preservedBankRowIdFromTags,
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

describe("hydromorphone rotation seed vs preserved content hash", () => {
  const item = NAPLEX_CALC_CASES_V3.find((row) =>
    /hydromorphone/i.test(`${row.vignette ?? ""} ${row.question}`)
  );

  const previousStem = {
    vignette: "Chronic pain | Morphine SR 90 mg q12h (180 mg/day PO) | Rotate to hydromorphone PO",
    question:
      "Approximate equianalgesic daily hydromorphone (mg) using 4:1 morphine:hydromorphone ratio? (Round to nearest whole mg.)",
  };

  it("keys 30 mg/day after a stated 4:1 ratio and one-third reduction", () => {
    expect(item).toBeDefined();
    expect(item?.correctAnswer).toBe("30");
    expect(`${item?.vignette} ${item?.question}`).toMatch(/4:1 oral morphine:oral hydromorphone/i);
    expect(`${item?.vignette} ${item?.question}`).toMatch(/one-third \(33%\)/i);
    expect(item?.explanation).toMatch(/CDC 2022 Clinical Practice Guideline for Prescribing Opioids/);
    expect(item?.explanation).toMatch(/25–50%/);
    expect(item?.solutionSteps?.join(" ")).toMatch(/45 × 2\/3 = 30/);
    expect(preservedBankRowIdFromTags(item?.tags)).toBe(HYDROMORPHONE_ROTATION_PRESERVED_ROW_ID);
  });

  it("does not insert the rewritten stem beside the preserved-hash row", () => {
    const seedHash = bankItemContentHash("pharmacy", item!.subjectId, item!);
    const preservedHash = bankItemContentHash("pharmacy", "pharmacokinetics", previousStem);
    expect(seedHash).not.toBe(preservedHash);

    expect(
      planPreservedHashSeed({
        seedHash,
        preservedRow: {
          id: HYDROMORPHONE_ROTATION_PRESERVED_ROW_ID,
          contentHash: preservedHash,
        },
      })
    ).toEqual({ upsertSeed: false, activeHashes: [preservedHash] });

    expect(
      planPreservedHashSeed({
        seedHash,
        preservedRow: null,
      })
    ).toEqual({ upsertSeed: true, activeHashes: [seedHash] });

    expect(
      planPreservedHashSeed({
        seedHash,
        preservedRow: {
          id: HYDROMORPHONE_ROTATION_PRESERVED_ROW_ID,
          contentHash: seedHash,
        },
      })
    ).toEqual({ upsertSeed: true, activeHashes: [seedHash] });
  });
});

describe("AANP INR 6.8 seed vs preserved content hash", () => {
  const item = AANP_FNP_PHYSICIAN_EDUCATOR_BATCH_EVALUATE.find((row) =>
    /INR 6\.8/.test(row.vignette ?? "")
  );

  it("holds warfarin without routine vitamin K for INR 4.5–10 and no bleeding", () => {
    expect(item).toBeDefined();
    expect(item?.correctAnswer).toBe("Hold warfarin; do not give routine vitamin K; recheck INR");
    expect(item?.options).toContain(item?.correctAnswer);
    expect(item?.correctAnswer).not.toMatch(/give vitamin K/i);
    expect(item?.explanation).toMatch(/CHEST 2012/);
    expect(item?.explanation).toMatch(/do not give routine vitamin K/i);
    expect(item?.explanation).toMatch(/INR >10/);
    expect(preservedBankRowIdFromTags(item?.tags)).toBe(WARFARIN_INR_NO_BLEED_PRESERVED_ROW_ID);
  });

  it("does not insert a second row or drop the live hash when production was rewritten", () => {
    const seedHash = bankItemContentHash("aanp-fnp", item!.subjectId, item!);
    const rewrittenHash = bankItemContentHash("aanp-fnp", "evaluate", {
      scenario: "A rewritten production vignette for the same INR case.",
      question: "What is the most appropriate management?",
    });
    expect(seedHash).not.toBe(rewrittenHash);
    expect(
      planPreservedHashSeed({
        seedHash,
        preservedRow: {
          id: WARFARIN_INR_NO_BLEED_PRESERVED_ROW_ID,
          contentHash: rewrittenHash,
        },
      })
    ).toEqual({ upsertSeed: false, activeHashes: [rewrittenHash] });
    expect(
      planPreservedHashSeed({
        seedHash,
        preservedRow: {
          id: WARFARIN_INR_NO_BLEED_PRESERVED_ROW_ID,
          contentHash: seedHash,
        },
      })
    ).toEqual({ upsertSeed: true, activeHashes: [seedHash] });
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
