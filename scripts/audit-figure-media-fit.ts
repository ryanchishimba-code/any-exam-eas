/**
 * Audit NCLEX/USMLE/NAPLEX figure catalog + bank attachment quality.
 * Prints JSON summary to stdout.
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";
loadEnvFiles();
ensureDatabaseUrlEnv();

import { writeFileSync, mkdirSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import {
  NCLEX_FIGURE_CATALOG,
  NCLEX_FIGURE_CONTENT_KEYWORDS,
  findApprovedNclexFiguresForTopic,
} from "../src/lib/exam-prep/nclex/figure-assets";
import {
  NAPLEX_FIGURE_CATALOG,
  NAPLEX_FIGURE_CONTENT_KEYWORDS,
  findApprovedNaplexFiguresForTopic,
} from "../src/lib/exam-prep/naplex/figure-assets";
import {
  AANP_FNP_FIGURE_CATALOG,
  AANP_FNP_FIGURE_CONTENT_KEYWORDS,
  findApprovedAanpFnpFiguresForTopic,
} from "../src/lib/exam-prep/aanp-fnp/figure-assets";
import { USMLE_FIGURE_CATALOG, USMLE_FIGURE_CONTENT_KEYWORDS } from "../src/lib/exam-prep/usmle/figure-assets";

function decodeSvg(dataUri: string): string {
  return decodeURIComponent(dataUri.replace(/^data:image\/svg\+xml;charset=utf-8,/, ""));
}

function keywordScore(text: string, keywords: string[]): number {
  const t = text.toLowerCase();
  let score = 0;
  for (const k of keywords) {
    if (t.includes(k.toLowerCase())) score += 1;
  }
  return score;
}

const FIGURE_FIT: Record<string, string[]> = {
  ...NCLEX_FIGURE_CONTENT_KEYWORDS,
  ...USMLE_FIGURE_CONTENT_KEYWORDS,
  ...NAPLEX_FIGURE_CONTENT_KEYWORDS,
  ...AANP_FNP_FIGURE_CONTENT_KEYWORDS,
};

const ALL_CATALOG = [
  ...NCLEX_FIGURE_CATALOG,
  ...USMLE_FIGURE_CATALOG,
  ...NAPLEX_FIGURE_CATALOG,
  ...AANP_FNP_FIGURE_CATALOG,
];

type Sample = {
  figureId: string;
  bankId: string;
  topic: string | null;
  scenario: string;
  question: string;
  fitScore: number;
  fitOk: boolean;
};

async function auditField(
  prisma: PrismaClient,
  fieldId: string,
  figureIds: string[],
  samples: Sample[],
  counts: Record<string, { total: number; fitOk: number; fitBad: number }>
) {
  for (const figId of figureIds) {
    counts[figId] ??= { total: 0, fitOk: 0, fitBad: 0 };
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId,
        active: true,
        options: { contains: figId },
      },
      take: 40,
      select: {
        id: true,
        scenario: true,
        question: true,
        blueprintTopic: true,
      },
    });

    for (const row of rows) {
      const text = `${row.scenario ?? ""}\n${row.question ?? ""}`;
      const keys = FIGURE_FIT[figId] ?? [];
      const fitScore = keywordScore(text, keys);
      const fitOk = fitScore >= 1;
      counts[figId]!.total += 1;
      if (fitOk) counts[figId]!.fitOk += 1;
      else counts[figId]!.fitBad += 1;

      if (samples.filter((s) => s.figureId === figId).length < 5) {
        samples.push({
          figureId: figId,
          bankId: row.id,
          topic: row.blueprintTopic,
          scenario: (row.scenario ?? "").slice(0, 220),
          question: row.question.slice(0, 160),
          fitScore,
          fitOk,
        });
      }
    }
  }
}

async function main() {
  mkdirSync("tmp-figure-audit", { recursive: true });

  const catalogIssues: string[] = [];
  for (const fig of ALL_CATALOG) {
    if (fig.reviewStatus !== "approved") catalogIssues.push(`${fig.id}: not approved`);
    if (!fig.url.startsWith("data:image/svg+xml")) catalogIssues.push(`${fig.id}: not svg data uri`);
    if (!fig.alt || fig.alt.length < 8) catalogIssues.push(`${fig.id}: weak alt`);
    if (!fig.topics?.length) catalogIssues.push(`${fig.id}: no topics`);
    const svg = decodeSvg(fig.url);
    if (!svg.includes("<svg")) catalogIssues.push(`${fig.id}: invalid svg`);
    writeFileSync(`tmp-figure-audit/${fig.id}.svg`, svg);
  }

  const prisma = new PrismaClient();
  const samples: Sample[] = [];
  const counts: Record<string, { total: number; fitOk: number; fitBad: number }> = {};

  await auditField(
    prisma,
    "nursing",
    NCLEX_FIGURE_CATALOG.map((f) => f.id),
    samples,
    counts
  );
  await auditField(
    prisma,
    "pharmacy",
    NAPLEX_FIGURE_CATALOG.map((f) => f.id),
    samples,
    counts
  );
  await auditField(
    prisma,
    "aanp-fnp",
    AANP_FNP_FIGURE_CATALOG.map((f) => f.id),
    samples,
    counts
  );

  const topicChecks = [
    { topic: "labor-fetal-monitoring", expect: "nclex-fetal-late-decels", via: "nclex" as const },
    { topic: "asthma-copd-inhalers", expect: "naplex-inhaler-mdi-steps", via: "naplex" as const },
    { topic: "tdm-monitoring", expect: "naplex-vanco-tdm-pathway", via: "naplex" as const },
    { topic: "calculations-creatinine-clearance", expect: "naplex-crcl-formula", via: "naplex" as const },
    { topic: "immunizations", expect: null, via: "naplex" as const },
    {
      topic: "atrial-fibrillation-anticoagulation",
      expect: "aanp-ecg-afib",
      via: "aanp" as const,
    },
    { topic: "skin-cancer-detection", expect: "aanp-derm-abcde", via: "aanp" as const },
  ].map((c) => {
    const found =
      c.via === "nclex"
        ? findApprovedNclexFiguresForTopic(c.topic).map((f) => f.id)
        : c.via === "aanp"
          ? findApprovedAanpFnpFiguresForTopic(c.topic).map((f) => f.id)
          : findApprovedNaplexFiguresForTopic(c.topic).map((f) => f.id);
    return {
      topic: c.topic,
      found,
      ok: c.expect ? found.includes(c.expect) : found.length === 0,
    };
  });

  const summary = {
    catalogCount: ALL_CATALOG.length,
    catalogIssues,
    attachmentCounts: counts,
    topicChecks,
    badSamples: samples.filter((s) => !s.fitOk).slice(0, 30),
    goodSamples: samples.filter((s) => s.fitOk).slice(0, 12),
  };

  writeFileSync("tmp-figure-audit/summary.json", JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
