#!/usr/bin/env node
/**
 * Full tally: every Study Hub NCLEX topic × blueprint-tagged questions,
 * plus nursing bank-wide inventory.
 *
 * Mirrors the serve path (field-wide tag match + alias expansion).
 *
 * Usage:
 *   npm run db:audit-nclex-topics
 *   npm run db:audit-nclex-topics -- --json
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { getHighYieldTopics } from "../src/lib/edtech/seeds/index.ts";
import { getNclexTopicMeta } from "../src/lib/exam-prep/nclex/topic-registry.ts";
import { resolveNclexTopicPracticeParams } from "../src/lib/exam-prep/nclex/topic-practice.ts";
import { expandNclexBlueprintTopicMatchers } from "../src/lib/exam-prep/nclex/blueprint-topic-aliases.ts";
import {
  assertScriptDbConnection,
  disconnectScriptPrisma,
  getScriptPrisma,
} from "./lib/script-db.ts";

const MIN_BLUEPRINT_MATCH = Number(process.env.NCLEX_TOPIC_MIN_MATCH ?? "8");
const jsonOut = process.argv.includes("--json");
const prisma = getScriptPrisma();

type TopicReport = {
  slug: string;
  title: string;
  domain: string;
  kind: "blueprint" | "ngn-preset" | "subject-only";
  subjectId: string;
  blueprintTopicSlugs: string[];
  nclexPreset?: string;
  taggedMatch: number;
  subjectPool: number;
  aligned: boolean;
};

function pad(s: string, n: number): string {
  return s.length >= n ? s.slice(0, n) : s + " ".repeat(n - s.length);
}

function csvEscape(value: string | number | boolean): string {
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

async function main() {
  await assertScriptDbConnection();

  const topics = getHighYieldTopics("nclex");
  const reports: TopicReport[] = [];

  const [
    bankTotal,
    bankTagged,
    blueprintGroups,
    subjectGroups,
    itemTypeGroups,
  ] = await Promise.all([
    prisma.questionBankItem.count({
      where: { fieldId: "nursing", active: true, qaPassed: true },
    }),
    prisma.questionBankItem.count({
      where: {
        fieldId: "nursing",
        active: true,
        qaPassed: true,
        NOT: { OR: [{ blueprintTopic: null }, { blueprintTopic: "" }] },
      },
    }),
    prisma.questionBankItem.groupBy({
      by: ["blueprintTopic"],
      where: {
        fieldId: "nursing",
        active: true,
        qaPassed: true,
        NOT: { OR: [{ blueprintTopic: null }, { blueprintTopic: "" }] },
      },
      _count: { _all: true },
      orderBy: { _count: { blueprintTopic: "desc" } },
    }),
    prisma.questionBankItem.groupBy({
      by: ["subjectId"],
      where: { fieldId: "nursing", active: true, qaPassed: true },
      _count: { _all: true },
      orderBy: { _count: { subjectId: "desc" } },
    }),
    prisma.questionBankItem.groupBy({
      by: ["itemType"],
      where: { fieldId: "nursing", active: true, qaPassed: true },
      _count: { _all: true },
      orderBy: { _count: { itemType: "desc" } },
    }),
  ]);

  const blueprintInventory = blueprintGroups.map((g) => ({
    blueprintTopic: g.blueprintTopic ?? "(null)",
    count: g._count._all,
  }));
  const subjectInventory = subjectGroups.map((g) => ({
    subjectId: g.subjectId,
    count: g._count._all,
  }));
  const itemTypeInventory = itemTypeGroups.map((g) => ({
    itemType: g.itemType ?? "(null)",
    count: g._count._all,
  }));

  for (const topic of topics) {
    const meta = getNclexTopicMeta(topic.slug);
    const domain = meta.clientNeedsDomain ?? "unknown";
    const practice = resolveNclexTopicPracticeParams(topic);
    const blueprintSlugs = practice.blueprintTopics ?? meta.blueprintTopicSlugs ?? [];
    const subjectId = practice.subjectId;

    const subjectPool = await prisma.questionBankItem.count({
      where: {
        fieldId: "nursing",
        active: true,
        qaPassed: true,
        subjectId,
      },
    });

    if (domain === "ngn-strategy") {
      const presetId = practice.nclexPreset ?? topic.relatedPresetIds?.[0];
      let taggedMatch = 0;

      if (topic.slug === "sata-mastery" || presetId === "sata-mastery") {
        taggedMatch = await prisma.questionBankItem.count({
          where: {
            fieldId: "nursing",
            active: true,
            qaPassed: true,
            OR: [
              { itemType: { contains: "select" } },
              { tags: { contains: "sata" } },
              { tags: { contains: "select_all" } },
              { tags: { contains: "select-all" } },
            ],
          },
        });
      } else if (topic.slug === "bow-tie-ngn") {
        taggedMatch = await prisma.questionBankItem.count({
          where: {
            fieldId: "nursing",
            active: true,
            qaPassed: true,
            OR: [
              { itemType: { contains: "bow" } },
              { tags: { contains: "bow-tie" } },
              { tags: { contains: "bow_tie" } },
              { tags: { contains: "bowtie" } },
            ],
          },
        });
      } else if (topic.slug === "case-study-ngn") {
        taggedMatch = await prisma.questionBankItem.count({
          where: {
            fieldId: "nursing",
            active: true,
            qaPassed: true,
            OR: [
              { itemType: "case_study" },
              { itemType: "ngn_matrix" },
              { itemType: "ngn_highlight" },
              { tags: { contains: "case-study" } },
            ],
          },
        });
      } else if (presetId === "trap-tier-drill") {
        taggedMatch = await prisma.questionBankItem.count({
          where: {
            fieldId: "nursing",
            active: true,
            qaPassed: true,
            OR: [
              { tags: { contains: "trap-tier" } },
              { tags: { contains: "nclex-trap" } },
              { itemType: { contains: "bow" } },
            ],
          },
        });
      } else {
        // CAT / full mixed sessions draw from the whole nursing bank.
        taggedMatch = bankTotal;
      }

      reports.push({
        slug: topic.slug,
        title: topic.title,
        domain,
        kind: "ngn-preset",
        subjectId,
        blueprintTopicSlugs: blueprintSlugs,
        nclexPreset: practice.nclexPreset,
        taggedMatch,
        subjectPool: bankTotal,
        aligned: taggedMatch >= MIN_BLUEPRINT_MATCH,
      });
      continue;
    }

    if (blueprintSlugs.length === 0) {
      reports.push({
        slug: topic.slug,
        title: topic.title,
        domain,
        kind: "subject-only",
        subjectId,
        blueprintTopicSlugs: [],
        nclexPreset: practice.nclexPreset,
        taggedMatch: 0,
        subjectPool,
        aligned: false,
      });
      continue;
    }

    const matchers = expandNclexBlueprintTopicMatchers(blueprintSlugs);
    const taggedMatch = await prisma.questionBankItem.count({
      where: {
        fieldId: "nursing",
        active: true,
        qaPassed: true,
        blueprintTopic: { in: matchers },
      },
    });

    reports.push({
      slug: topic.slug,
      title: topic.title,
      domain,
      kind: "blueprint",
      subjectId,
      blueprintTopicSlugs: blueprintSlugs,
      nclexPreset: practice.nclexPreset,
      taggedMatch,
      subjectPool,
      aligned: taggedMatch >= MIN_BLUEPRINT_MATCH,
    });
  }

  reports.sort((a, b) => a.slug.localeCompare(b.slug));

  const studyHubMatchers = [
    ...new Set(
      reports
        .filter((r) => r.kind === "blueprint")
        .flatMap((r) => expandNclexBlueprintTopicMatchers(r.blueprintTopicSlugs))
    ),
  ];

  const uniqueCoveredByAnyTopic = studyHubMatchers.length
    ? await prisma.questionBankItem.count({
        where: {
          fieldId: "nursing",
          active: true,
          qaPassed: true,
          blueprintTopic: { in: studyHubMatchers },
        },
      })
    : 0;

  const misaligned = reports.filter((r) => !r.aligned);
  const aligned = reports.filter((r) => r.aligned);
  const sumTopicTagged = reports
    .filter((r) => r.kind === "blueprint")
    .reduce((n, r) => n + r.taggedMatch, 0);

  const summary = {
    generatedAt: new Date().toISOString(),
    minBlueprintMatch: MIN_BLUEPRINT_MATCH,
    bank: {
      fieldId: "nursing",
      activeQaPassed: bankTotal,
      withBlueprintTopic: bankTagged,
      withoutBlueprintTopic: bankTotal - bankTagged,
      uniqueCoveredByAnyStudyHubTopic: uniqueCoveredByAnyTopic,
      notCoveredByStudyHubTags: bankTotal - uniqueCoveredByAnyTopic,
    },
    topics: {
      total: reports.length,
      aligned: aligned.length,
      misaligned: misaligned.length,
      byKind: {
        blueprint: reports.filter((r) => r.kind === "blueprint").length,
        "ngn-preset": reports.filter((r) => r.kind === "ngn-preset").length,
        "subject-only": reports.filter((r) => r.kind === "subject-only").length,
      },
      /** Sum of per-topic tagged counts (items can appear in multiple topics). */
      sumTopicTaggedMatches: sumTopicTagged,
    },
    misaligned: misaligned.map((r) => ({
      slug: r.slug,
      title: r.title,
      kind: r.kind,
      taggedMatch: r.taggedMatch,
      required: MIN_BLUEPRINT_MATCH,
      blueprintTopicSlugs: r.blueprintTopicSlugs,
      subjectId: r.subjectId,
    })),
    reports,
    blueprintInventory,
    subjectInventory,
    itemTypeInventory,
  };

  const artifactsDir = path.join(process.cwd(), "artifacts");
  mkdirSync(artifactsDir, { recursive: true });
  const jsonPath = path.join(artifactsDir, "nclex-topic-alignment-audit.json");
  const csvPath = path.join(artifactsDir, "nclex-topic-question-tally.csv");

  writeFileSync(jsonPath, JSON.stringify(summary, null, 2));

  const csvLines = [
    [
      "slug",
      "title",
      "domain",
      "kind",
      "subjectId",
      "blueprintTopics",
      "taggedMatch",
      "subjectPool",
      "aligned",
      "required",
    ].join(","),
    ...reports.map((r) =>
      [
        r.slug,
        r.title,
        r.domain,
        r.kind,
        r.subjectId,
        r.blueprintTopicSlugs.join("|"),
        r.taggedMatch,
        r.subjectPool,
        r.aligned,
        MIN_BLUEPRINT_MATCH,
      ]
        .map(csvEscape)
        .join(",")
    ),
  ];
  writeFileSync(csvPath, csvLines.join("\n") + "\n");

  console.log(`\nNCLEX topic × question tally`);
  console.log(`────────────────────────────────────────────────────────────`);
  console.log(`Nursing bank (active + qaPassed): ${bankTotal}`);
  console.log(`  with blueprintTopic tag:        ${bankTagged}`);
  console.log(`  without blueprintTopic tag:     ${bankTotal - bankTagged}`);
  console.log(`  covered by any Study Hub topic: ${uniqueCoveredByAnyTopic}`);
  console.log(`  not covered by Study Hub tags:  ${bankTotal - uniqueCoveredByAnyTopic}`);
  console.log(`Topics tallied: ${reports.length}  |  aligned ≥${MIN_BLUEPRINT_MATCH}: ${aligned.length}  |  short: ${misaligned.length}`);
  console.log(`Sum of per-topic tagged counts (overlap allowed): ${sumTopicTagged}`);
  console.log(`────────────────────────────────────────────────────────────`);
  console.log(`Subject inventory:`);
  for (const row of subjectInventory) {
    console.log(`  ${pad(row.subjectId, 32)} ${row.count}`);
  }
  console.log(`Item-type inventory:`);
  for (const row of itemTypeInventory.slice(0, 12)) {
    console.log(`  ${pad(row.itemType, 32)} ${row.count}`);
  }
  console.log(`────────────────────────────────────────────────────────────`);
  console.log(
    `${pad("TOPIC", 28)} ${pad("TAGGED", 8)} ${pad("SUBJECT", 8)} ${pad("OK", 4)} BLUEPRINTS`
  );

  for (const row of reports) {
    const ok = row.aligned ? "✓" : "✗";
    const bps =
      row.kind === "ngn-preset"
        ? `preset:${row.nclexPreset ?? "—"}`
        : row.blueprintTopicSlugs.join(", ") || "(none)";
    console.log(
      `${pad(row.slug, 28)} ${pad(String(row.taggedMatch), 8)} ${pad(String(row.subjectPool), 8)} ${pad(ok, 4)} ${bps}`
    );
  }

  if (misaligned.length > 0) {
    console.log(`\nShort of ${MIN_BLUEPRINT_MATCH} tagged matches:`);
    for (const row of misaligned) {
      console.log(
        `  • ${row.slug}: ${row.taggedMatch}/${MIN_BLUEPRINT_MATCH} (${row.kind}; subject=${row.subjectId})`
      );
    }
  }

  console.log(`\nWrote ${jsonPath}`);
  console.log(`Wrote ${csvPath}\n`);

  await disconnectScriptPrisma();

  if (jsonOut) {
    console.log(JSON.stringify(summary, null, 2));
  }

  process.exit(misaligned.length > 0 ? 1 : 0);
}

main().catch(async (err) => {
  console.error(err);
  await disconnectScriptPrisma().catch(() => {});
  process.exit(1);
});
