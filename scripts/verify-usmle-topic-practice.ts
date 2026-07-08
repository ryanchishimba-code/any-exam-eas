#!/usr/bin/env node
/**
 * Verify USMLE topic practice sessions match the selected Study Hub topic.
 *
 * Usage:
 *   npx tsx scripts/verify-usmle-topic-practice.ts
 *   npx tsx scripts/verify-usmle-topic-practice.ts --step1
 *   npx tsx scripts/verify-usmle-topic-practice.ts --step2 --step3
 *   npx tsx scripts/verify-usmle-topic-practice.ts acute-coronary-syndrome pharmacology-moa
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { getHighYieldTopics } from "../src/lib/edtech/seeds/index.ts";
import { topicMatchesUsmleStep } from "../src/lib/edtech/usmle-library-catalog.ts";
import { resolveUsmleTopicPracticeParams } from "../src/lib/exam-prep/usmle/topic-practice.ts";
import { gatherTopicBankSessionPool } from "../src/lib/exam-prep/topic-bank-practice.ts";
import {
  filterItemsForUsmleTopicPractice,
  matchesUsmleTopicPracticeItem,
} from "../src/lib/exam-prep/usmle/topic-practice-filter.ts";
import type { UsmleStepLevel } from "../src/lib/exam-prep/usmle/types.ts";

const MIN_RELEVANCE_PCT = Number(process.env.USMLE_TOPIC_MIN_RELEVANCE ?? "70");
const MIN_SESSION_SIZE = Number(process.env.USMLE_TOPIC_MIN_SESSION ?? "3");

function parseStepFilters(argv: string[]): { steps: UsmleStepLevel[]; slugs: string[] } {
  const steps: UsmleStepLevel[] = [];
  const slugs: string[] = [];

  for (const arg of argv) {
    if (arg === "--step1" || arg === "--step-1") steps.push("step1");
    else if (arg === "--step2" || arg === "--step-2") steps.push("step2");
    else if (arg === "--step3" || arg === "--step-3") steps.push("step3");
    else if (!arg.startsWith("-")) slugs.push(arg);
  }

  return { steps, slugs };
}

async function verifyTopic(slug: string) {
  const topics = getHighYieldTopics("usmle");
  const topic = topics.find((t) => t.slug === slug);
  if (!topic) {
    console.error(`Unknown USMLE topic slug: ${slug}`);
    return false;
  }

  const params = resolveUsmleTopicPracticeParams(topic);

  console.log(`\n=== ${topic.title} (${slug}) ===`);
  console.log(`  fieldId: ${params.fieldId}`);
  console.log(`  subjectId: ${params.subjectId}`);
  console.log(`  blueprintTopics: ${params.blueprintTopics?.join(", ") ?? "(none)"}`);
  console.log(`  usmleTopic: ${params.topicSlug ?? "(none)"}`);

  const pool = await gatherTopicBankSessionPool({
    fieldId: params.fieldId,
    subjectId: params.subjectId,
    sessionLimit: 10,
    blueprintTopics: params.blueprintTopics,
    usmleTopic: params.topicSlug,
  });

  const items = filterItemsForUsmleTopicPractice(pool, {
    blueprintTopics: params.blueprintTopics,
    topicSlug: params.topicSlug,
  }).slice(0, 10);

  if (items.length === 0) {
    console.error(`  ✗ No aligned questions returned for session`);
    return false;
  }

  if (items.length < MIN_SESSION_SIZE) {
    console.warn(`  ⚠ Small session (${items.length}/${MIN_SESSION_SIZE} minimum preferred)`);
  }

  console.log(`  Session size: ${items.length} questions\n`);

  let relevant = 0;

  for (const [i, item] of items.entries()) {
    const aligned = matchesUsmleTopicPracticeItem(item, {
      blueprintTopics: params.blueprintTopics,
      topicSlug: params.topicSlug,
    });
    if (aligned) relevant++;

    const stem = (item.vignette ?? item.scenario ?? item.question ?? "").slice(0, 90);
    console.log(
      `  ${i + 1}. [${item.subjectId}] bp=${item.blueprintTopic ?? "—"} type=${item.itemType ?? "mcq"}`
    );
    console.log(`     aligned=${aligned ? "✓" : "✗"}`);
    console.log(`     stem: ${stem}${stem.length >= 90 ? "…" : ""}`);
  }

  const rate = (relevant / items.length) * 100;
  console.log(`\n  Topic alignment: ${relevant}/${items.length} (${rate.toFixed(0)}%)`);

  const ok = rate >= MIN_RELEVANCE_PCT;
  console.log(ok ? "  ✓ PASS" : `  ✗ FAIL (alignment ≥${MIN_RELEVANCE_PCT}%)`);
  return ok;
}

async function main() {
  const { steps, slugs } = parseStepFilters(process.argv.slice(2));
  const allTopics = getHighYieldTopics("usmle");

  let targets = slugs.length > 0 ? slugs : allTopics.map((t) => t.slug);

  if (steps.length > 0) {
    targets = allTopics
      .filter((topic) => steps.some((step) => topicMatchesUsmleStep(topic, step)))
      .map((t) => t.slug)
      .filter((slug) => (slugs.length > 0 ? slugs.includes(slug) : true));
  }

  let allOk = true;
  let passed = 0;
  let failed = 0;

  console.log(`\nVerifying ${targets.length} USMLE topic(s)...`);
  if (steps.length) console.log(`  Step filter: ${steps.join(", ")}`);

  for (const slug of targets) {
    const ok = await verifyTopic(slug);
    if (ok) passed++;
    else {
      failed++;
      allOk = false;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);

  const { disconnectScriptPrisma } = await import("./lib/script-db.ts");
  await disconnectScriptPrisma();

  process.exit(allOk ? 0 : 1);
}

main().catch(async (err) => {
  console.error(err);
  const { disconnectScriptPrisma } = await import("./lib/script-db.ts");
  await disconnectScriptPrisma().catch(() => {});
  process.exit(1);
});
