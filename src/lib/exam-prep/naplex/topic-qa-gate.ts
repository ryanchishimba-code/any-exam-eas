/**
 * Static QA gate for NAPLEX topic registry, Study Hub seeds, and practice alignment.
 */
import { getSubjectsForField } from "@/lib/field-subjects";
import { getHighYieldTopics } from "@/lib/edtech/seeds";
import { REVIEW_MODULE_TOPICS } from "@/lib/edtech/seeds/review-module-topics";
import { NAPLEX_CALC_TOPIC_SLUGS } from "./calc-topic-qa";
import {
  NAPLEX_TOPIC_REGISTRY,
  getNaplexTopicMeta,
  resolveNaplexTopicSlugForBlueprint,
} from "./topic-registry";
import { resolveNaplexTopicPracticeParams } from "./topic-practice";

export type NaplexTopicQaIssue = {
  code: string;
  message: string;
  slug?: string;
};

const PHARMACY_SUBJECTS = new Set(getSubjectsForField("pharmacy").map((s) => s.id));

function auditRegistryCoverage(): NaplexTopicQaIssue[] {
  const issues: NaplexTopicQaIssue[] = [];
  const topics = getHighYieldTopics("naplex");

  for (const topic of topics) {
    const meta = NAPLEX_TOPIC_REGISTRY[topic.slug];
    if (!meta) {
      issues.push({
        code: "topic_missing_registry",
        message: `Study Hub topic "${topic.slug}" has no NAPLEX_TOPIC_REGISTRY entry`,
        slug: topic.slug,
      });
      continue;
    }

    if (!meta.blueprintTopicSlugs?.length) {
      issues.push({
        code: "topic_missing_blueprint_slugs",
        message: `"${topic.slug}" has no blueprintTopicSlugs (practice cannot align to module content)`,
        slug: topic.slug,
      });
    }

    if (!PHARMACY_SUBJECTS.has(topic.practiceTopicSlug)) {
      issues.push({
        code: "invalid_practice_subject",
        message: `"${topic.slug}" practiceTopicSlug "${topic.practiceTopicSlug}" is not a pharmacy subject`,
        slug: topic.slug,
      });
    }

    for (const bp of meta.blueprintTopicSlugs ?? []) {
      const resolved = resolveNaplexTopicSlugForBlueprint(bp);
      if (!resolved) {
        issues.push({
          code: "blueprint_unresolved",
          message: `Blueprint label "${bp}" does not resolve to a Study Hub topic`,
          slug: bp,
        });
      }
    }
  }

  for (const slug of Object.keys(NAPLEX_TOPIC_REGISTRY)) {
    if (!topics.some((t) => t.slug === slug)) {
      issues.push({
        code: "registry_orphan",
        message: `Registry slug "${slug}" has no Study Hub topic card`,
        slug,
      });
    }
  }

  return issues;
}

function auditReviewModules(): NaplexTopicQaIssue[] {
  const issues: NaplexTopicQaIssue[] = [];
  const naplexModules = REVIEW_MODULE_TOPICS.filter((t) => t.examSlug === "naplex");

  for (const mod of naplexModules) {
    const meta = getNaplexTopicMeta(mod.slug);
    if (!meta.contentDomain) {
      issues.push({
        code: "review_module_missing_registry",
        message: `Review module "${mod.slug}" is not in NAPLEX_TOPIC_REGISTRY`,
        slug: mod.slug,
      });
    }
  }

  return issues;
}

function auditPracticeAlignment(): NaplexTopicQaIssue[] {
  const issues: NaplexTopicQaIssue[] = [];

  for (const topic of getHighYieldTopics("naplex")) {
    const params = resolveNaplexTopicPracticeParams(topic);

    if (!params.blueprintTopics?.length) {
      issues.push({
        code: "practice_not_aligned",
        message: `"${topic.slug}" practice resolves to subject-only pool (no blueprint filter)`,
        slug: topic.slug,
      });
    }

    if (NAPLEX_CALC_TOPIC_SLUGS.includes(topic.slug as (typeof NAPLEX_CALC_TOPIC_SLUGS)[number])) {
      const expected =
        topic.slug === "calculations-creatinine-clearance" ||
        topic.slug === "compounding-basics"
          ? ["compounding-calculations", "pharmacokinetics", "pharmaceutics"]
          : ["compounding-calculations"];
      if (!expected.includes(params.subjectId)) {
        issues.push({
          code: "calc_wrong_subject",
          message: `"${topic.slug}" calc topic should pull ${expected.join(" or ")}, got "${params.subjectId}"`,
          slug: topic.slug,
        });
      }
    }

    if (topic.slug === "renal-ckd-pharmacotherapy" && params.subjectId === "compounding-calculations") {
      issues.push({
        code: "renal_wrong_subject",
        message: `"renal-ckd-pharmacotherapy" should not route to compounding-calculations subject`,
        slug: topic.slug,
      });
    }
  }

  return issues;
}

export function runNaplexTopicQaGate(): { passed: boolean; issues: NaplexTopicQaIssue[] } {
  const issues = [
    ...auditRegistryCoverage(),
    ...auditReviewModules(),
    ...auditPracticeAlignment(),
  ];
  return { passed: issues.length === 0, issues };
}

export function auditNaplexTopicIntegration(): NaplexTopicQaIssue[] {
  return runNaplexTopicQaGate().issues;
}
