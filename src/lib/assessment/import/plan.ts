import { errorCount, validatePilotDocument } from "@/lib/assessment/validators/ngn";
import type { NgnCase, NgnItem, PilotDocument, ValidationIssue } from "@/lib/assessment/types";

export type PlannedBatch = {
  batchId: string;
  schemaVersion: string;
  boardProfile: string;
  sourceSha256: string;
  sources: PilotDocument["sources"];
  rowCounts: {
    cases: number;
    items: number;
    caseItems: number;
    bowties: number;
    trends: number;
  };
  notes: string | null;
};

export type PlannedCase = {
  id: string;
  version: number;
  batchId: string;
  boardProfile: string;
  status: "draft";
  title: string;
  primaryClientNeed: string;
  setting: string;
  patient: NgnCase["patient"];
  timepoints: NgnCase["timepoints"];
  chart: NgnCase["chart"];
  revealRule: string;
  references: NgnCase["references"];
};

export type PlannedItem = {
  id: string;
  version: number;
  batchId: string;
  caseId: string | null;
  caseVersion: number | null;
  caseStep: number | null;
  itemType: NgnItem["itemType"];
  cjmmFunction: NgnItem["cjmmFunction"];
  timepoint: string | null;
  responseFormat: NgnItem["responseFormat"];
  scoringRule: NgnItem["scoringRule"];
  maxPoints: number;
  stem: string;
  payload: NgnItem["payload"];
  exhibit: NgnItem["exhibit"] | null;
  rationale: NgnItem["rationale"];
  clientNeeds: NgnItem["clientNeeds"];
  references: NgnItem["references"];
  rnFlags: string[];
  status: "draft";
};

export type SeedPlan = {
  sha256: string;
  issues: ValidationIssue[];
  errorCount: number;
  batch: PlannedBatch;
  cases: PlannedCase[];
  items: PlannedItem[];
};

function planItem(item: NgnItem, batchId: string, caseVersion: number | null): PlannedItem {
  const standalone = item.itemType === "bowtie" || item.itemType === "trend";
  return {
    id: item.id,
    version: item.version,
    batchId,
    caseId: standalone ? null : item.caseId,
    caseVersion: standalone ? null : caseVersion,
    caseStep: standalone ? null : item.caseStep,
    itemType: item.itemType,
    cjmmFunction: item.cjmmFunction,
    timepoint: item.timepoint,
    responseFormat: item.responseFormat,
    scoringRule: item.scoringRule,
    maxPoints: item.maxPoints,
    stem: item.stem,
    payload: item.payload,
    exhibit: item.exhibit ?? null,
    rationale: item.rationale,
    clientNeeds: item.clientNeeds,
    references: item.references,
    rnFlags: item.rnFlags,
    status: "draft",
  };
}

/** File status is ignored. Every planned row is draft. */
export function buildSeedPlan(doc: PilotDocument, sha256: string): SeedPlan {
  const issues = validatePilotDocument(doc);
  const caseItems = doc.cases.reduce((sum, caseDoc) => sum + caseDoc.items.length, 0);
  const bowties = doc.standalone.filter((item) => item.itemType === "bowtie").length;
  const trends = doc.standalone.filter((item) => item.itemType === "trend").length;
  const items = [
    ...doc.cases.flatMap((caseDoc) => caseDoc.items.map((item) => planItem(item, doc.batchId, caseDoc.version))),
    ...doc.standalone.map((item) => planItem(item, doc.batchId, null)),
  ];
  return {
    sha256,
    issues,
    errorCount: errorCount(issues),
    batch: {
      batchId: doc.batchId,
      schemaVersion: doc.schemaVersion,
      boardProfile: doc.boardProfile,
      sourceSha256: sha256,
      sources: doc.sources,
      rowCounts: {
        cases: doc.cases.length,
        items: items.length,
        caseItems,
        bowties,
        trends,
      },
      notes: doc.servingPolicy ?? null,
    },
    cases: doc.cases.map((caseDoc) => ({
      id: caseDoc.id,
      version: caseDoc.version,
      batchId: doc.batchId,
      boardProfile: caseDoc.boardProfile,
      status: "draft" as const,
      title: caseDoc.title,
      primaryClientNeed: caseDoc.primaryClientNeed,
      setting: caseDoc.setting,
      patient: caseDoc.patient,
      timepoints: caseDoc.timepoints,
      chart: caseDoc.chart,
      revealRule: caseDoc.revealRule,
      references: caseDoc.references,
    })),
    items,
  };
}
