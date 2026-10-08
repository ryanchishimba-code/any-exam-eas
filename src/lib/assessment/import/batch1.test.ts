import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  assertKeysMatchDocument,
  buildBatch1Plan,
  diffBatch1,
  emptyResponse,
  NGN_BATCH1_DOCUMENT,
  NGN_BATCH1_ID,
  NGN_BATCH1_KEYS,
  projectBatchCounts,
} from "@/lib/assessment/import/batch1";
import { NCLEX_RN_2026_PROFILE, NCLEX_RN_2026_SOURCE_DOMAINS } from "@/lib/assessment/profiles/nclex-rn-2026";
import { perfect, scoringRegistry } from "@/lib/assessment/scoring/registry";
import type { NgnItem, PilotDocument, ScoringRule } from "@/lib/assessment/types";
import { validatePilotDocument } from "@/lib/assessment/validators/ngn";

const PILOT_DOMAINS = [
  "codeofethics.ana.org",
  "dailymed.nlm.nih.gov",
  "digitalassets.jointcommission.org",
  "kdigo.org",
  "medlineplus.gov",
  "ncsbn.zendesk.com",
  "pmc.ncbi.nlm.nih.gov",
  "www.ahrq.gov",
  "www.cdc.gov",
  "www.cms.gov",
  "www.ecfr.gov",
  "www.glasgowcomascale.org",
  "www.heart.org",
  "www.lifeblood.com.au",
  "www.nclex.com",
  "www.ncsbn.org",
  "www.nice.org.uk",
  "www.nursingworld.org",
  "www.rcp.ac.uk",
  "www.sccm.org",
  "www.ukkidney.org",
] as const;

const BATCH1_DOMAINS = [
  "academic.oup.com",
  "ascopubs.org",
  "cpr.heart.org",
  "doi.org",
  "emedicine.medscape.com",
  "journal.chestnet.org",
  "journals.bioscientifica.com",
  "journals.lww.com",
  "link.springer.com",
  "onlinelibrary.wiley.com",
  "publications.smfm.org",
  "thorax.bmj.com",
  "www.accessdata.fda.gov",
  "www.acog.org",
  "www.ahajournals.org",
  "www.ameriburn.org",
  "www.amjmed.com",
  "www.facs.org",
  "www.liebertpub.com",
  "www.merckmanuals.com",
  "www.ncbi.nlm.nih.gov",
  "www.nccn.org",
  "www.vumc.org",
] as const;

const bytes = readFileSync(NGN_BATCH1_DOCUMENT);
const doc = JSON.parse(bytes.toString("utf8")) as PilotDocument;
const keys = JSON.parse(readFileSync(NGN_BATCH1_KEYS, "utf8")) as unknown;

function allItems(document: PilotDocument): NgnItem[] {
  return [...document.cases.flatMap((caseDoc) => caseDoc.items), ...document.standalone];
}

describe("NGN batch 1 document", () => {
  it("keeps the pilot source hosts and adds only this batch's publisher hosts", () => {
    const domains = new Set<string>(NCLEX_RN_2026_SOURCE_DOMAINS);
    expect(domains.size).toBe(PILOT_DOMAINS.length + BATCH1_DOMAINS.length);
    for (const host of PILOT_DOMAINS) expect(domains.has(host)).toBe(true);
    for (const host of BATCH1_DOMAINS) expect(domains.has(host)).toBe(true);
  });

  it("validates against the stock allow-list with no errors", () => {
    assertKeysMatchDocument(doc, keys);
    const issues = validatePilotDocument(doc);
    const errors = issues.filter((issue) => issue.level === "error");
    const warnings = issues.filter((issue) => issue.level === "warning");
    expect(errors).toEqual([]);
    expect(warnings).toHaveLength(14);
    expect(warnings.every((issue) => issue.message.startsWith("longest option "))).toBe(true);
  });

  it("scores every item with the registry rule: perfect is maxPoints and empty is 0", () => {
    const items = allItems(doc);
    expect(items).toHaveLength(96);
    for (const item of items) {
      const rule = item.scoringRule as ScoringRule;
      expect(NCLEX_RN_2026_PROFILE.scoringMap[item.responseFormat]).toBe(rule);
      expect(scoringRegistry[rule](item, perfect(item))).toBe(item.maxPoints);
      expect(scoringRegistry[rule](item, emptyResponse(item.responseFormat))).toBe(0);
    }
  });

  it("plans one insert and a no-op re-run that only fills a missing manual_correction flag", () => {
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    const plan = buildBatch1Plan(doc, sha256);
    expect(plan.errorCount).toBe(0);
    expect(plan.batch.batchId).toBe(NGN_BATCH1_ID);
    expect(plan.batch.rowCounts).toEqual({
      cases: 15,
      items: 96,
      caseItems: 90,
      bowties: 4,
      trends: 2,
    });
    expect(plan.items.every((row) => row.scoringRule === NCLEX_RN_2026_PROFILE.scoringMap[row.responseFormat])).toBe(
      true
    );

    const first = diffBatch1(plan, { batch: false, cases: [], items: [] });
    expect(first.insertBatch).toBe(true);
    expect(first.insertCases).toHaveLength(15);
    expect(first.insertItems).toHaveLength(96);
    const afterFirst = projectBatchCounts(
      { batches: 0, cases: 0, items: 0, manualCorrectionCases: 0, manualCorrectionItems: 0 },
      first
    );
    expect(afterFirst).toEqual({
      batches: 1,
      cases: 15,
      items: 96,
      manualCorrectionCases: 15,
      manualCorrectionItems: 96,
    });

    const present = {
      batch: true,
      cases: plan.cases.map((row) => ({ id: row.id, version: row.version, manualCorrection: true })),
      items: plan.items.map((row) => ({ id: row.id, version: row.version, manualCorrection: true })),
    };
    const second = diffBatch1(plan, present);
    expect(second.insertBatch).toBe(false);
    expect(second.insertCases).toHaveLength(0);
    expect(second.insertItems).toHaveLength(0);
    expect(second.flagCases).toHaveLength(0);
    expect(second.flagItems).toHaveLength(0);
    expect(projectBatchCounts(afterFirst, second)).toEqual(afterFirst);

    const unmarked = diffBatch1(plan, {
      batch: true,
      cases: plan.cases.map((row) => ({ id: row.id, version: row.version, manualCorrection: false })),
      items: plan.items.map((row) => ({ id: row.id, version: row.version, manualCorrection: false })),
    });
    expect(unmarked.insertCases).toHaveLength(0);
    expect(unmarked.insertItems).toHaveLength(0);
    expect(unmarked.flagCases).toHaveLength(15);
    expect(unmarked.flagItems).toHaveLength(96);
  });
});
