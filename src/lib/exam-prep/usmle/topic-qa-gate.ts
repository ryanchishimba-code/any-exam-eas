/**
 * Static QA gate for USMLE topic registry, 2026 content depth, review modules, and roadmap links.
 */
import { allUsmle2026TopicSlugs, USMLE_CROSS_CUTTING_TOPICS } from "./blueprint-topics-2026";
import {
  getUsmleStudyDomain,
  getUsmleTopicMeta,
  resolveUsmleTopicSlugForBlueprint,
  resolveUsmleTopicSlugForCategory,
} from "./topic-registry";
import { USMLE_STUDY_PRESETS, type UsmleStudyPresetId } from "./study-presets";
import { REVIEW_MODULE_CONTENT_BY_SLUG } from "@/lib/edtech/review-modules/content";
import { REVIEW_MODULE_TOPICS } from "@/lib/edtech/seeds/review-module-topics";
import { USMLE_2026_STUDY_CONTENT } from "@/lib/edtech/seeds/usmle-2026-high-yield-content";
import { getHighYieldTopic } from "@/lib/edtech/seeds";
import { getExamBlueprint } from "@/lib/engine/blueprints";

export type UsmleTopicQaIssue = {
  code: string;
  message: string;
  slug?: string;
};

const USMLE_FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;
const PRESET_IDS = new Set(USMLE_STUDY_PRESETS.map((p) => p.id));

function auditBlueprintRegistry(): UsmleTopicQaIssue[] {
  const issues: UsmleTopicQaIssue[] = [];
  for (const slug of allUsmle2026TopicSlugs()) {
    const meta = getUsmleTopicMeta(slug);
    if (!meta.studyDomain) {
      issues.push({
        code: "registry_missing_domain",
        message: `Blueprint slug "${slug}" has no study domain in registry`,
        slug,
      });
      continue;
    }
    if (!getUsmleStudyDomain(meta.studyDomain)) {
      issues.push({
        code: "registry_invalid_domain",
        message: `Blueprint slug "${slug}" references unknown domain "${meta.studyDomain}"`,
        slug,
      });
    }
    const resolved = resolveUsmleTopicSlugForBlueprint(slug);
    if (!resolved) {
      issues.push({
        code: "blueprint_unresolved",
        message: `Blueprint slug "${slug}" does not resolve via resolveUsmleTopicSlugForBlueprint`,
        slug,
      });
    }
  }
  return issues;
}

function auditStudyContentDepth(): UsmleTopicQaIssue[] {
  const issues: UsmleTopicQaIssue[] = [];
  const required = [
    ...allUsmle2026TopicSlugs(),
    ...USMLE_CROSS_CUTTING_TOPICS.map((t) => t.slug),
  ];
  for (const slug of required) {
    const content = USMLE_2026_STUDY_CONTENT[slug];
    if (!content) {
      issues.push({
        code: "content_missing",
        message: `Missing curated study content for "${slug}"`,
        slug,
      });
      continue;
    }
    if ((content.keyConcepts?.length ?? 0) < 5) {
      issues.push({
        code: "content_shallow_concepts",
        message: `"${slug}" has fewer than 5 keyConcepts`,
        slug,
      });
    }
    if ((content.pearls?.length ?? 0) < 1) {
      issues.push({
        code: "content_missing_pearls",
        message: `"${slug}" has no pearls`,
        slug,
      });
    }
    if ((content.pitfalls?.length ?? 0) < 1) {
      issues.push({
        code: "content_missing_pitfalls",
        message: `"${slug}" has no pitfalls`,
        slug,
      });
    }
  }
  return issues;
}

function auditReviewModules(): UsmleTopicQaIssue[] {
  const issues: UsmleTopicQaIssue[] = [];
  const usmleModules = REVIEW_MODULE_TOPICS.filter((t) => t.examSlug === "usmle");

  for (const mod of usmleModules) {
    const content = REVIEW_MODULE_CONTENT_BY_SLUG[mod.slug];
    if (!content) {
      issues.push({
        code: "review_module_missing_content",
        message: `USMLE review module "${mod.slug}" has no REVIEW_MODULE_CONTENT_BY_SLUG entry`,
        slug: mod.slug,
      });
      continue;
    }
    if (content.sections.length < 6) {
      issues.push({
        code: "review_module_section_count",
        message: `"${mod.slug}" review module has ${content.sections.length} sections (expected at least 6)`,
        slug: mod.slug,
      });
    }
    const card = getHighYieldTopic("usmle", mod.slug);
    if (!card) {
      issues.push({
        code: "review_module_not_in_hub",
        message: `"${mod.slug}" review module slug missing from high-yield topic hub`,
        slug: mod.slug,
      });
    }
  }
  return issues;
}

function auditPresetLinks(): UsmleTopicQaIssue[] {
  const issues: UsmleTopicQaIssue[] = [];
  for (const topic of REVIEW_MODULE_TOPICS.filter((t) => t.examSlug === "usmle")) {
    const enriched = getHighYieldTopic("usmle", topic.slug);
    for (const presetId of enriched?.relatedPresetIds ?? []) {
      if (!PRESET_IDS.has(presetId as UsmleStudyPresetId)) {
        issues.push({
          code: "invalid_preset_id",
          message: `"${topic.slug}" references unknown preset "${presetId}"`,
          slug: topic.slug,
        });
      }
    }
  }
  for (const slug of allUsmle2026TopicSlugs()) {
    const enriched = getHighYieldTopic("usmle", slug);
    for (const presetId of enriched?.relatedPresetIds ?? []) {
      if (!PRESET_IDS.has(presetId as UsmleStudyPresetId)) {
        issues.push({
          code: "invalid_preset_id",
          message: `Blueprint topic "${slug}" references unknown preset "${presetId}"`,
          slug,
        });
      }
    }
  }
  return issues;
}

function auditRoadmapCategoryLinks(): UsmleTopicQaIssue[] {
  const issues: UsmleTopicQaIssue[] = [];

  for (const fieldId of USMLE_FIELDS) {
    const blueprint = getExamBlueprint(fieldId);
    if (!blueprint) {
      issues.push({
        code: "blueprint_missing",
        message: `No exam blueprint for field "${fieldId}"`,
      });
      continue;
    }

    for (const category of blueprint.categories) {
      const primarySlug = resolveUsmleTopicSlugForCategory(category.id, fieldId);
      if (!primarySlug) {
        issues.push({
          code: "roadmap_category_unmapped",
          message: `Blueprint category "${category.id}" on ${fieldId} has no primary topic slug`,
          slug: category.id,
        });
        continue;
      }
      const card = getHighYieldTopic("usmle", primarySlug);
      if (!card) {
        issues.push({
          code: "roadmap_topic_missing",
          message: `Roadmap category "${category.id}" on ${fieldId} resolves to "${primarySlug}" but topic is not in hub`,
          slug: primarySlug,
        });
      }
    }
  }
  return issues;
}

function auditWeakAreaBridge(): UsmleTopicQaIssue[] {
  const issues: UsmleTopicQaIssue[] = [];
  const samples: Array<{ topic: string; fieldId: string; expectedSlug?: string }> = [
    { topic: "cardiovascular", fieldId: "usmle-step-2" },
    { topic: "biostatistics", fieldId: "usmle-step-3" },
    { topic: "ccs", fieldId: "usmle-step-3", expectedSlug: "ccs-case-management" },
    { topic: "next-best-step", fieldId: "usmle-step-3", expectedSlug: "next-best-step" },
    { topic: "pharm-advertising", fieldId: "usmle-step-3" },
  ];

  for (const { topic, fieldId, expectedSlug } of samples) {
    const slug =
      resolveUsmleTopicSlugForCategory(topicNameToSlug(topic), fieldId) ??
      resolveUsmleTopicSlugForBlueprint(topicNameToSlug(topic));
    if (!slug) {
      issues.push({
        code: "bridge_unresolved",
        message: `Could not resolve USMLE topic slug for "${topic}" on ${fieldId}`,
        slug: topic,
      });
      continue;
    }
    if (expectedSlug && slug !== expectedSlug) {
      issues.push({
        code: "bridge_unexpected_slug",
        message: `"${topic}" on ${fieldId} resolved to "${slug}", expected "${expectedSlug}"`,
        slug: topic,
      });
    }
    if (!getHighYieldTopic("usmle", slug)) {
      issues.push({
        code: "bridge_topic_missing",
        message: `Resolved slug "${slug}" for "${topic}" is not in the topic hub`,
        slug,
      });
    }
  }
  return issues;
}

function topicNameToSlug(topic: string): string {
  return topic
    .trim()
    .toLowerCase()
    .replace(/^(tag|subject):/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Run all static USMLE topic integration checks. */
export function auditUsmleTopicIntegration(): UsmleTopicQaIssue[] {
  return [
    ...auditBlueprintRegistry(),
    ...auditStudyContentDepth(),
    ...auditReviewModules(),
    ...auditPresetLinks(),
    ...auditRoadmapCategoryLinks(),
    ...auditWeakAreaBridge(),
  ];
}

export function runUsmleTopicQaGate(): { passed: boolean; issues: UsmleTopicQaIssue[] } {
  const issues = auditUsmleTopicIntegration();
  return { passed: issues.length === 0, issues };
}
