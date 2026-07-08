/**
 * Static QA gate for NCLEX topic registry, Study Hub seeds, and practice alignment.
 */
import { getSubjectsForField } from "@/lib/field-subjects";
import { getHighYieldTopics } from "@/lib/edtech/seeds";
import { REVIEW_MODULE_TOPICS } from "@/lib/edtech/seeds/review-module-topics";
import { allNclex2026TopicSlugs } from "./blueprint-topics-2026";
import { NCLEX_LEARNING_PATH_ORDER } from "./topic-learning-path";
import {
  NCLEX_TOPIC_REGISTRY,
  getNclexTopicMeta,
  resolveNclexTopicSlugForBlueprint,
} from "./topic-registry";
import { resolveNclexTopicPracticeParams } from "./topic-practice";
import { NCLEX_STUDY_PRESETS } from "./study-presets";

export type NclexTopicQaIssue = {
  code: string;
  message: string;
  slug?: string;
};

const PRESET_IDS = new Set(NCLEX_STUDY_PRESETS.map((p) => p.id));
const BLUEPRINT_SLUGS = new Set(allNclex2026TopicSlugs());
const NURSING_SUBJECTS = new Set(getSubjectsForField("nursing").map((s) => s.id));

function auditRegistryCoverage(): NclexTopicQaIssue[] {
  const issues: NclexTopicQaIssue[] = [];
  const topics = getHighYieldTopics("nclex");

  for (const topic of topics) {
    const meta = NCLEX_TOPIC_REGISTRY[topic.slug];
    if (!meta) {
      issues.push({
        code: "topic_missing_registry",
        message: `Study Hub topic "${topic.slug}" has no NCLEX_TOPIC_REGISTRY entry`,
        slug: topic.slug,
      });
      continue;
    }

    if (meta.clientNeedsDomain !== "ngn-strategy" && meta.blueprintTopicSlugs.length === 0) {
      issues.push({
        code: "topic_missing_blueprint_slugs",
        message: `"${topic.slug}" has no blueprintTopicSlugs (practice cannot align to module content)`,
        slug: topic.slug,
      });
    }

    if (!NURSING_SUBJECTS.has(topic.practiceTopicSlug)) {
      issues.push({
        code: "invalid_practice_subject",
        message: `"${topic.slug}" practiceTopicSlug "${topic.practiceTopicSlug}" is not a nursing subject`,
        slug: topic.slug,
      });
    }

    for (const bp of meta.blueprintTopicSlugs) {
      if (!BLUEPRINT_SLUGS.has(bp)) {
        issues.push({
          code: "invalid_blueprint_slug",
          message: `"${topic.slug}" references unknown blueprint slug "${bp}"`,
          slug: topic.slug,
        });
      }
      const resolved = resolveNclexTopicSlugForBlueprint(bp);
      if (!resolved) {
        issues.push({
          code: "blueprint_unresolved",
          message: `Blueprint slug "${bp}" does not resolve to a Study Hub topic`,
          slug: bp,
        });
      }
    }

    for (const presetId of meta.relatedPresetIds ?? []) {
      if (!PRESET_IDS.has(presetId)) {
        issues.push({
          code: "invalid_preset_id",
          message: `"${topic.slug}" references unknown preset "${presetId}"`,
          slug: topic.slug,
        });
      }
    }
  }

  for (const slug of Object.keys(NCLEX_TOPIC_REGISTRY)) {
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

function auditLearningPath(): NclexTopicQaIssue[] {
  const issues: NclexTopicQaIssue[] = [];
  const topicSlugs = new Set(getHighYieldTopics("nclex").map((t) => t.slug));

  for (const slug of NCLEX_LEARNING_PATH_ORDER) {
    if (!topicSlugs.has(slug)) {
      issues.push({
        code: "learning_path_missing_topic",
        message: `Learning path references missing topic "${slug}"`,
        slug,
      });
    }
  }

  return issues;
}

function auditReviewModules(): NclexTopicQaIssue[] {
  const issues: NclexTopicQaIssue[] = [];
  const nclexModules = REVIEW_MODULE_TOPICS.filter((t) => t.examSlug === "nclex");

  for (const mod of nclexModules) {
    const meta = getNclexTopicMeta(mod.slug);
    if (!meta.clientNeedsDomain) {
      issues.push({
        code: "review_module_missing_registry",
        message: `Review module "${mod.slug}" is not in NCLEX_TOPIC_REGISTRY`,
        slug: mod.slug,
      });
    }
  }

  return issues;
}

function auditPracticeAlignment(): NclexTopicQaIssue[] {
  const issues: NclexTopicQaIssue[] = [];

  for (const topic of getHighYieldTopics("nclex")) {
    const params = resolveNclexTopicPracticeParams(topic);
    const meta = getNclexTopicMeta(topic.slug);

    if (meta.clientNeedsDomain === "ngn-strategy") {
      if (!params.nclexPreset) {
        issues.push({
          code: "ngn_missing_preset",
          message: `"${topic.slug}" NGN strategy card has no nclexPreset for practice`,
          slug: topic.slug,
        });
      }
      continue;
    }

    if (!params.blueprintTopics?.length && !params.nclexPreset) {
      issues.push({
        code: "practice_not_aligned",
        message: `"${topic.slug}" practice resolves to subject-only pool (no blueprint or preset filter)`,
        slug: topic.slug,
      });
    }
  }

  return issues;
}

export function runNclexTopicQaGate(): { passed: boolean; issues: NclexTopicQaIssue[] } {
  const issues = [
    ...auditRegistryCoverage(),
    ...auditLearningPath(),
    ...auditReviewModules(),
    ...auditPracticeAlignment(),
  ];
  return { passed: issues.length === 0, issues };
}

export function auditNclexTopicIntegration(): NclexTopicQaIssue[] {
  return runNclexTopicQaGate().issues;
}
