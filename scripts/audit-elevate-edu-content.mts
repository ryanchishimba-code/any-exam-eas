#!/usr/bin/env node
/**
 * Educational-content elevation audit for NCLEX + NAPLEX.
 *
 * 1) Blueprint / tag coverage snapshot from Neon
 * 2) Rationale depth snapshot (expert JSON / enriched)
 * 3) Optional: kick dry-run or live enrichment for a topic slice
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/audit-elevate-edu-content.mts
 *   bash scripts/run-with-node.sh npx tsx scripts/audit-elevate-edu-content.mts --field nursing
 *   bash scripts/run-with-node.sh npx tsx scripts/audit-elevate-edu-content.mts --field pharmacy --topic infectious-disease-rx
 *   bash scripts/run-with-node.sh npx tsx scripts/audit-elevate-edu-content.mts --enrich --limit 25
 *   bash scripts/run-with-node.sh npx tsx scripts/audit-elevate-edu-content.mts --enrich --limit 25 --apply
 *
 * Requires DATABASE_URL. OPENAI_API_KEY required only with --enrich --apply.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { loadEnvFiles, requireOpenAiKey } from "./load-env";

loadEnvFiles();

import { PrismaClient } from "@prisma/client";
import { NCLEX_2026_CLIENT_NEEDS } from "../src/lib/exam-prep/nclex/blueprint-topics-2026";
import { NCLEX_NGN_SERVE_TARGETS } from "../src/lib/exam-prep/nclex/types";
import { NAPLEX_CONTENT_OUTLINE } from "../src/lib/exam-prep/naplex/content-outline";

const prisma = new PrismaClient();
const OUT = path.join(process.cwd(), "tmp", "edu-content-elevation-audit.json");

type FieldArg = "nursing" | "pharmacy" | "both";

function parseArgs() {
  const args = process.argv.slice(2);
  let field: FieldArg = "both";
  let topic: string | undefined;
  let enrich = false;
  let apply = false;
  let limit = 25;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--field" && args[i + 1]) {
      const f = args[++i]!;
      field = f === "nursing" || f === "pharmacy" ? f : "both";
    } else if (args[i] === "--topic" && args[i + 1]) topic = args[++i];
    else if (args[i] === "--enrich") enrich = true;
    else if (args[i] === "--apply") apply = true;
    else if (args[i] === "--limit" && args[i + 1]) limit = Number(args[++i]);
  }
  return { field, topic, enrich, apply, limit };
}

async function fieldSnapshot(fieldId: "nursing" | "pharmacy") {
  const [active, serve, subjects, topics, types, domains, expert, enriched, missingTopic, missingDomain] =
    await Promise.all([
      prisma.questionBankItem.count({ where: { fieldId, active: true } }),
      prisma.questionBankItem.count({ where: { fieldId, active: true, qaPassed: true } }),
      prisma.questionBankItem.groupBy({
        by: ["subjectId"],
        where: { fieldId, active: true, qaPassed: true },
        _count: { _all: true },
      }),
      prisma.$queryRaw<Array<{ n: number }>>`
        SELECT COUNT(DISTINCT "blueprintTopic")::int AS n FROM "QuestionBankItem"
        WHERE "fieldId" = ${fieldId} AND active AND "qaPassed"
          AND "blueprintTopic" IS NOT NULL AND TRIM("blueprintTopic") <> ''
      `,
      prisma.questionBankItem.groupBy({
        by: ["itemType"],
        where: { fieldId, active: true, qaPassed: true },
        _count: { _all: true },
      }),
      prisma.questionBankItem.groupBy({
        by: ["blueprintDomain"],
        where: { fieldId, active: true, qaPassed: true },
        _count: { _all: true },
      }),
      prisma.$queryRawUnsafe<Array<{ n: number }>>(
        `SELECT COUNT(*)::int AS n FROM "QuestionBankItem"
         WHERE "fieldId" = $1 AND active AND "qaPassed"
           AND "generationMeta"::text LIKE '%expertRationale%'`,
        fieldId
      ),
      prisma.$queryRawUnsafe<Array<{ n: number }>>(
        `SELECT COUNT(*)::int AS n FROM "QuestionBankItem"
         WHERE "fieldId" = $1 AND active AND "qaPassed"
           AND "generationMeta"::text LIKE '%rationaleEnrichedAt%'`,
        fieldId
      ),
      prisma.questionBankItem.count({
        where: {
          fieldId,
          active: true,
          qaPassed: true,
          OR: [{ blueprintTopic: null }, { blueprintTopic: "" }],
        },
      }),
      prisma.questionBankItem.count({
        where: {
          fieldId,
          active: true,
          qaPassed: true,
          OR: [{ blueprintDomain: null }, { blueprintDomain: "" }],
        },
      }),
    ]);

  const bySubject = Object.fromEntries(
    subjects
      .sort((a, b) => b._count._all - a._count._all)
      .map((g) => [g.subjectId ?? "null", g._count._all])
  );
  const byType = Object.fromEntries(types.map((g) => [g.itemType ?? "null", g._count._all]));
  const byDomain = Object.fromEntries(
    domains
      .filter((g) => g.blueprintDomain)
      .sort((a, b) => b._count._all - a._count._all)
      .map((g) => [g.blueprintDomain!, g._count._all])
  );

  const expertN = expert[0]?.n ?? 0;
  const enrichedN = enriched[0]?.n ?? 0;

  const flags: string[] = [];
  if (serve > 0 && missingTopic / serve > 0.15) {
    flags.push(`high_untagged_blueprintTopic:${Math.round((missingTopic / serve) * 100)}%`);
  }
  if (serve > 0 && missingDomain / serve > 0.25) {
    flags.push(`high_untagged_blueprintDomain:${Math.round((missingDomain / serve) * 100)}%`);
  }
  if (serve > 0 && expertN / serve < 0.1 && fieldId === "nursing") {
    flags.push(`expert_rationale_coverage_low:${Math.round((expertN / serve) * 1000) / 10}%`);
  }
  if (serve > 0 && enrichedN / serve < 0.1 && fieldId === "pharmacy") {
    flags.push(`enriched_rationale_coverage_low:${Math.round((enrichedN / serve) * 1000) / 10}%`);
  }

  let ngnGaps: Record<string, { have: number; target: number; gap: number }> | undefined;
  if (fieldId === "nursing") {
    ngnGaps = {};
    for (const [type, target] of Object.entries(NCLEX_NGN_SERVE_TARGETS)) {
      const have = byType[type] ?? 0;
      ngnGaps[type] = { have, target, gap: Math.max(0, target - have) };
      if (target - have > 0) flags.push(`ngn_gap:${type}:${target - have}`);
    }
  }

  let outlineGaps: Array<{ id: string; label: string; weight: string; proxyServe: number }> | undefined;
  if (fieldId === "pharmacy") {
    // Proxy: map subject buckets onto NAPLEX domains for quick visibility
    const proxy: Record<string, number> = {
      "naplex-area1-foundations":
        (bySubject["compounding-calculations"] ?? 0) +
        (bySubject["pharmaceutics"] ?? 0) +
        (bySubject["pharmacokinetics"] ?? 0) +
        (bySubject["pharmacology"] ?? 0),
      "naplex-area2-therapeutics":
        (byDomain["naplex-2026-medication-dispensing"] ?? 0) +
        (byDomain["naplex-2026-pharmacist-tasks"] ?? 0),
      "naplex-area3-treatment-planning":
        (bySubject["cardiovascular-rx"] ?? 0) +
        (bySubject["infectious-disease-rx"] ?? 0) +
        (bySubject["endocrine-rx"] ?? 0) +
        (bySubject["cns-rx"] ?? 0) +
        (byDomain["naplex-2026-pharmacotherapy"] ?? 0),
      "naplex-area4-safety":
        (bySubject["patient-counseling"] ?? 0) + (bySubject["pharmacy-law"] ?? 0),
      "naplex-area5-management": byDomain["naplex-2026-health-wellness"] ?? 0,
    };
    outlineGaps = NAPLEX_CONTENT_OUTLINE.map((d) => ({
      id: d.id,
      label: d.label,
      weight: d.weightLabel,
      proxyServe: proxy[d.id] ?? 0,
    }));
    if ((bySubject["pharmacokinetics"] ?? 0) < 50) {
      flags.push("critical_pk_underbuild");
    }
  }

  return {
    fieldId,
    active,
    serve,
    distinctBlueprintTopics: topics[0]?.n ?? 0,
    missingBlueprintTopic: missingTopic,
    missingBlueprintDomain: missingDomain,
    expertRationaleCount: expertN,
    expertPct: serve ? Math.round((expertN / serve) * 1000) / 10 : 0,
    rationaleEnrichedCount: enrichedN,
    enrichedPct: serve ? Math.round((enrichedN / serve) * 1000) / 10 : 0,
    bySubject,
    byType,
    byDomain,
    ngnGaps,
    outlineGaps,
    clientNeedsExpected:
      fieldId === "nursing"
        ? NCLEX_2026_CLIENT_NEEDS.map((c) => ({
            id: c.id,
            label: c.label,
            weightPct: c.weightPct,
            serve: bySubject[c.id] ?? 0,
          }))
        : undefined,
    flags,
  };
}

async function topicSlice(fieldId: "nursing" | "pharmacy", topic: string, take = 8) {
  const rows = await prisma.questionBankItem.findMany({
    where: {
      fieldId,
      active: true,
      qaPassed: true,
      OR: [
        { subjectId: topic },
        { blueprintTopic: topic },
        { tags: { contains: topic } },
      ],
    },
    take,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      subjectId: true,
      blueprintTopic: true,
      blueprintDomain: true,
      itemType: true,
      question: true,
      explanation: true,
      generationMeta: true,
    },
  });
  return rows.map((r) => {
    const meta =
      r.generationMeta && typeof r.generationMeta === "object"
        ? (r.generationMeta as Record<string, unknown>)
        : {};
    return {
      id: r.id,
      subjectId: r.subjectId,
      blueprintTopic: r.blueprintTopic,
      blueprintDomain: r.blueprintDomain,
      itemType: r.itemType,
      stemPreview: r.question.slice(0, 120),
      explanationLen: r.explanation?.length ?? 0,
      hasExpert: Boolean(meta.expertRationale),
      hasEnriched: Boolean(meta.rationaleEnrichedAt),
    };
  });
}

function runChild(cmd: string, args: string[]): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd: process.cwd(), stdio: "inherit", env: process.env });
    child.on("close", (code) => resolve(code ?? 1));
  });
}

async function main() {
  const { field, topic, enrich, apply, limit } = parseArgs();
  console.log(`\nEdu-content elevation audit · field=${field}${topic ? ` · topic=${topic}` : ""}\n`);

  const report: Record<string, unknown> = {
    checkedAt: new Date().toISOString(),
    standard: {
      nclex: "NCLEX-RN 2026 Client Needs + NGN CJMM item types",
      naplex: "NABP NAPLEX Content Outline (May 2025 / 2026) 5 domains",
    },
    rationaleTemplateVersion: {
      nclex: "nclex-expert-v1 → generationMeta.expertRationale",
      naplex: "structured + rationaleEnrichedAt (board expert pipeline)",
    },
  };

  if (field === "nursing" || field === "both") {
    report.nclex = await fieldSnapshot("nursing");
    if (topic) report.nclexTopicSlice = await topicSlice("nursing", topic);
  }
  if (field === "pharmacy" || field === "both") {
    report.naplex = await fieldSnapshot("pharmacy");
    if (topic) report.naplexTopicSlice = await topicSlice("pharmacy", topic);
  }

  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(`Wrote ${OUT}`);

  const flags = [
    ...(((report.nclex as { flags?: string[] } | undefined)?.flags ?? []) as string[]),
    ...(((report.naplex as { flags?: string[] } | undefined)?.flags ?? []) as string[]),
  ];
  if (flags.length) {
    console.log("\nPriority flags:");
    for (const f of flags.slice(0, 20)) console.log(`  · ${f}`);
  }

  console.log(`
Recommended next commands:
  # NCLEX NGN format fill
  npm run db:rebalance-nclex-ngn

  # NCLEX expert CJMM rationales
  bash scripts/run-with-node.sh npx tsx scripts/enrich-nclex-expert-rationales.ts --missing-expert --serve-only --limit ${limit}

  # NAPLEX structured/expert rationales
  bash scripts/run-with-node.sh npx tsx scripts/enrich-board-expert-rationales.ts --field pharmacy --serve-only --limit ${limit}

  # Tough rating re-check
  bash scripts/run-with-node.sh npx tsx scripts/rate-nclex-ncsbn-tough.mts --sample 24
  bash scripts/run-with-node.sh npx tsx scripts/rate-naplex-nabp-tough.mts --sample 24
`);

  if (enrich) {
    if (apply) requireOpenAiKey();
    const mode = apply ? "APPLY" : "DRY-RUN";
    console.log(`\nEnrich orchestration [${mode}] limit=${limit}\n`);

    if (field === "nursing" || field === "both") {
      const args = [
        "scripts/enrich-nclex-expert-rationales.ts",
        "--missing-expert",
        "--serve-only",
        "--limit",
        String(limit),
      ];
      if (!apply) args.push("--dry-run");
      await runChild("bash", ["scripts/run-with-node.sh", "npx", "tsx", ...args]);
    }
    if (field === "pharmacy" || field === "both") {
      const args = [
        "scripts/enrich-board-expert-rationales.ts",
        "--field",
        "pharmacy",
        "--serve-only",
        "--limit",
        String(limit),
      ];
      if (!apply) args.push("--dry-run");
      await runChild("bash", ["scripts/run-with-node.sh", "npx", "tsx", ...args]);
    }
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
