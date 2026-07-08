#!/usr/bin/env node
/**
 * Verify NAPLEX topic practice sessions match the selected Study Hub topic.
 * Calc topics also score solvability via naplex-format-coherence rules.
 *
 * Usage:
 *   npx tsx scripts/verify-naplex-topic-practice.ts
 *   npx tsx scripts/verify-naplex-topic-practice.ts calculations-workshop calculations-drip-rates
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { getHighYieldTopics } from "../src/lib/edtech/seeds/index.ts";
import { resolveNaplexTopicPracticeParams } from "../src/lib/exam-prep/naplex/topic-practice.ts";
import { gatherTopicBankSessionPool } from "../src/lib/exam-prep/topic-bank-practice.ts";
import {
  filterItemsForNaplexTopicPractice,
  matchesNaplexTopicPracticeItem,
  passesNaplexCalcTopicQa,
} from "../src/lib/exam-prep/naplex/topic-practice-filter.ts";
import {
  assessNaplexCalcTopicItem,
  isNaplexCalcTopicSlug,
} from "../src/lib/exam-prep/naplex/calc-topic-qa.ts";
import { resolveNaplexStem } from "../src/lib/exam-prep/naplex-bank-audit.ts";

const MIN_RELEVANCE_PCT = Number(process.env.NAPLEX_TOPIC_MIN_RELEVANCE ?? "70");
const MIN_CALC_QA_PCT = Number(process.env.NAPLEX_CALC_MIN_QA ?? "80");
const MIN_SESSION_SIZE = Number(process.env.NAPLEX_TOPIC_MIN_SESSION ?? "3");

async function verifyTopic(slug: string) {
  const topics = getHighYieldTopics("naplex");
  const topic = topics.find((t) => t.slug === slug);
  if (!topic) {
    console.error(`Unknown NAPLEX topic slug: ${slug}`);
    return false;
  }

  const params = resolveNaplexTopicPracticeParams(topic);
  const isCalcTopic = isNaplexCalcTopicSlug(slug);

  console.log(`\n=== ${topic.title} (${slug}) ===`);
  console.log(`  subjectId: ${params.subjectId}`);
  console.log(`  blueprintTopics: ${params.blueprintTopics?.join(", ") ?? "(none)"}`);
  console.log(`  naplexTopic: ${params.topicSlug ?? "(none)"}`);
  if (isCalcTopic) console.log(`  calc QA: enabled`);

  const pool = await gatherTopicBankSessionPool({
    fieldId: "pharmacy",
    subjectId: params.subjectId,
    sessionLimit: 10,
    blueprintTopics: params.blueprintTopics,
    naplexTopic: params.topicSlug,
  });

  const items = filterItemsForNaplexTopicPractice(pool, {
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
  let calcQaPass = 0;

  for (const [i, item] of items.entries()) {
    const aligned = matchesNaplexTopicPracticeItem(item, {
      blueprintTopics: params.blueprintTopics,
      topicSlug: params.topicSlug,
    });
    if (aligned) relevant++;

    const calcQa = isCalcTopic ? assessNaplexCalcTopicItem(item, slug) : null;
    const calcOk = isCalcTopic ? passesNaplexCalcTopicQa(item, slug) : true;
    if (calcOk) calcQaPass++;

    const stem = resolveNaplexStem(item).slice(0, 90);
    const vignette = (item.vignette ?? item.scenario ?? "").slice(0, 100);
    console.log(`  ${i + 1}. [${item.subjectId}] bp=${item.blueprintTopic ?? "—"}`);
    console.log(`     aligned=${aligned ? "✓" : "✗"}`);
    if (calcQa) {
      console.log(
        `     calc: subtopic=${calcQa.subtopicMatch ? "✓" : "✗"} solvable=${calcQa.solvable ? "✓" : "✗"} format=${calcQa.formatOk ? "✓" : "✗"}`
      );
      if (calcQa.issues.length) console.log(`     issues: ${calcQa.issues.join(", ")}`);
    }
    if (vignette) console.log(`     vignette: ${vignette}${vignette.length >= 100 ? "…" : ""}`);
    console.log(`     stem: ${stem}${stem.length >= 90 ? "…" : ""}`);
  }

  const rate = (relevant / items.length) * 100;
  console.log(`\n  Topic alignment: ${relevant}/${items.length} (${rate.toFixed(0)}%)`);

  let ok = rate >= MIN_RELEVANCE_PCT;

  if (isCalcTopic) {
    const calcRate = (calcQaPass / items.length) * 100;
    console.log(`  Calc QA pass: ${calcQaPass}/${items.length} (${calcRate.toFixed(0)}%)`);
    ok = ok && calcRate >= MIN_CALC_QA_PCT;
  }

  console.log(
    ok
      ? "  ✓ PASS"
      : `  ✗ FAIL (alignment ≥${MIN_RELEVANCE_PCT}%${isCalcTopic ? `, calc QA ≥${MIN_CALC_QA_PCT}%` : ""})`
  );
  return ok;
}

async function main() {
  const slugs = process.argv.slice(2);
  const calcSlugs = [
    "calculations-workshop",
    "calculations-drip-rates",
    "calculations-creatinine-clearance",
    "compounding-basics",
  ];
  const allSlugs = getHighYieldTopics("naplex").map((t) => t.slug);
  const targets = slugs.length > 0 ? slugs : allSlugs;

  let allOk = true;
  let passed = 0;
  let failed = 0;

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
  if (slugs.length === 0) {
    console.log(`  Calc topics in registry: ${calcSlugs.join(", ")}`);
  }

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
