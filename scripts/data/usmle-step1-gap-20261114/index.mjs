import { GI_ITEMS } from "./gi.mjs";
import { GI_HARD_ITEMS } from "./gi-hard.mjs";
import { CV_ITEMS } from "./cv.mjs";
import { CV_REST_ITEMS } from "./cv-rest.mjs";
import { REPRO_ITEMS } from "./repro.mjs";
import { RESP_ITEMS } from "./resp.mjs";
import { MSK_ITEMS, BLOOD_ITEMS } from "./msk-blood.mjs";
import { NEURO_ITEMS, SOCIAL_ITEMS, DEV_ITEMS } from "./neuro-social.mjs";

export const GAP_BATCH_ID = "usmle-s1-gap-20261114";
export const GAP_SOURCE = "gap-batch-20261114";
export const FIELD_ID = "usmle-step-1";
export const STEP_LEVEL = "step1";

export const GAP_ITEMS = [
  ...GI_ITEMS,
  ...GI_HARD_ITEMS,
  ...CV_ITEMS,
  ...CV_REST_ITEMS,
  ...REPRO_ITEMS,
  ...RESP_ITEMS,
  ...MSK_ITEMS,
  ...BLOOD_ITEMS,
  ...NEURO_ITEMS,
  ...SOCIAL_ITEMS,
  ...DEV_ITEMS,
];

const ABSOLUTE =
  /\b(always|never|only|all|none|every|must|completely|invariably|exclusively|solely|definitely|impossible|guaranteed|certainly|pathognomonic)\b/i;

/** Stored rationale names the keyed option, then the authored explanation. */
export function finalizeExplanation(item) {
  const marker = `**${item.correctAnswer}**`;
  if (item.explanation.includes(item.correctAnswer)) return item.explanation;
  return item.explanation.replace(
    "## Why this answer is correct\n",
    `## Why this answer is correct\n${marker}\n`
  );
}

export function lintGapItems(items = GAP_ITEMS) {
  const errors = [];
  const slugs = new Set();
  const expected = {
    gastrointestinal: 34,
    cardiovascular: 18,
    "reproductive-endocrine": 11,
    "respiratory-renal": 11,
    "msk-skin": 9,
    "blood-lymph-immune": 7,
    "behavioral-nervous": 5,
    "social-sciences": 4,
    "human-development": 1,
  };
  const bands = { easy: 0, medium: 0, hard: 0 };
  const byDomain = {};

  if (items.length !== 100) errors.push(`count ${items.length} !== 100`);

  for (const item of items) {
    if (slugs.has(item.slug)) errors.push(`duplicate slug ${item.slug}`);
    slugs.add(item.slug);
    byDomain[item.domain] = (byDomain[item.domain] ?? 0) + 1;
    bands[item.band] = (bands[item.band] ?? 0) + 1;
    const wantDiff = item.band === "easy" ? 2 : item.band === "medium" ? 3 : 5;
    if (item.difficulty !== wantDiff) {
      errors.push(`${item.slug} difficulty ${item.difficulty} != ${wantDiff}`);
    }
    if (!item.options.includes(item.correctAnswer)) {
      errors.push(`${item.slug} key not in options`);
    }
    if (item.options.length !== 5) errors.push(`${item.slug} option count ${item.options.length}`);
    if (new Set(item.options).size !== item.options.length) errors.push(`${item.slug} duplicate options`);
    const others = item.options.filter((o) => o !== item.correctAnswer);
    const keyLen = item.correctAnswer.length;
    if (others.every((o) => o.length < keyLen)) {
      errors.push(`${item.slug} key is uniquely longest (${keyLen})`);
    }
    if (others.every((o) => o.length > keyLen)) {
      errors.push(`${item.slug} key is uniquely shortest (${keyLen})`);
    }
    for (const option of item.options) {
      const hit = option.match(ABSOLUTE);
      if (hit) errors.push(`${item.slug} absolute word "${hit[0]}" in option: ${option}`);
    }
    const explained = finalizeExplanation(item);
    for (const option of item.options) {
      if (!explained.includes(option)) {
        errors.push(`${item.slug} explanation missing option: ${option.slice(0, 60)}`);
      }
    }
    if (item.scenario.length < 80) errors.push(`${item.slug} scenario short`);
    if (!item.citationTitle) errors.push(`${item.slug} missing citation title`);
  }

  for (const [domain, n] of Object.entries(expected)) {
    if (byDomain[domain] !== n) errors.push(`${domain} count ${byDomain[domain] ?? 0} !== ${n}`);
  }
  if (bands.easy !== 20 || bands.medium !== 30 || bands.hard !== 50) {
    errors.push(`bands easy ${bands.easy} medium ${bands.medium} hard ${bands.hard}`);
  }

  return { errors, bands, byDomain };
}
