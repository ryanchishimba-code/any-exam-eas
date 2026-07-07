import { describe, expect, it } from "vitest";
import { allUsmle2026TopicSlugs, USMLE_CROSS_CUTTING_TOPICS } from "./blueprint-topics-2026";
import {
  getUsmleStudyDomain,
  getUsmleTopicMeta,
  resolveUsmleTopicSlugForBlueprint,
  resolveUsmleTopicSlugForCategory,
} from "./topic-registry";
import { USMLE_STUDY_PRESETS } from "./study-presets";
import { REVIEW_MODULE_CONTENT_BY_SLUG } from "@/lib/edtech/review-modules/content";
import { REVIEW_MODULE_TOPICS } from "@/lib/edtech/seeds/review-module-topics";
import { getHighYieldTopic } from "@/lib/edtech/seeds";
import { getExamBlueprint } from "@/lib/engine/blueprints";
import { getMemoryCardsByReviewModuleSlug } from "@/lib/library/seeds";
import { auditUsmleTopicIntegration, runUsmleTopicQaGate } from "./topic-qa-gate";

const USMLE_FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;

describe("USMLE topic integration QA gate", () => {
  it("passes the consolidated static audit", () => {
    const { passed, issues } = runUsmleTopicQaGate();
    if (!passed) {
      const summary = issues.map((i) => `[${i.code}] ${i.message}`).join("\n");
      expect.fail(`USMLE topic QA failed:\n${summary}`);
    }
    expect(passed).toBe(true);
  });

  it("maps every 2026 blueprint slug to a study domain", () => {
    for (const slug of allUsmle2026TopicSlugs()) {
      const meta = getUsmleTopicMeta(slug);
      expect(meta.studyDomain, slug).toBeDefined();
      expect(getUsmleStudyDomain(meta.studyDomain!), slug).toBeDefined();
    }
  });

  it("resolves blueprint slugs for roadmap weak-area linking", () => {
    for (const slug of allUsmle2026TopicSlugs()) {
      expect(resolveUsmleTopicSlugForBlueprint(slug), slug).toBeDefined();
    }
  });

  it("links every USMLE review module to 8-section content and hub entry", () => {
    const usmleModules = REVIEW_MODULE_TOPICS.filter((t) => t.examSlug === "usmle");
    for (const mod of usmleModules) {
      const content = REVIEW_MODULE_CONTENT_BY_SLUG[mod.slug];
      expect(content, mod.slug).toBeDefined();
      expect(content!.sections.length).toBeGreaterThanOrEqual(6);
      expect(getHighYieldTopic("usmle", mod.slug), mod.slug).toBeDefined();
    }
  });

  it("links Step 3 deep-dive modules to memory cards", () => {
    const step3Slugs = [
      "next-best-step",
      "ccs-monitoring-escalation",
      "ccs-initial-workup",
      "ambulatory-chronic-care",
      "nnt-arr",
      "biostatistics-epidemiology",
      "ccs-case-management",
    ];
    for (const slug of step3Slugs) {
      const cards = getMemoryCardsByReviewModuleSlug("usmle", slug);
      expect(cards.length, slug).toBeGreaterThanOrEqual(6);
    }
  });

  it("resolves roadmap category primaries for all USMLE fields", () => {
    for (const fieldId of USMLE_FIELDS) {
      const blueprint = getExamBlueprint(fieldId)!;
      expect(blueprint).toBeDefined();
      for (const category of blueprint.categories) {
        const primarySlug = resolveUsmleTopicSlugForCategory(category.id, fieldId);
        expect(primarySlug, `${fieldId}/${category.id}`).toBeDefined();
        expect(getHighYieldTopic("usmle", primarySlug!), primarySlug).toBeDefined();
      }
    }
  });

  it("resolves weak-area bridge slugs for Step 3 categories", () => {
    const ccsSlug = resolveUsmleTopicSlugForBlueprint("next-best-step");
    expect(ccsSlug).toBe("next-best-step");
    expect(getHighYieldTopic("usmle", ccsSlug!)).toBeDefined();

    const categorySlug = resolveUsmleTopicSlugForCategory("ccs", "usmle-step-3");
    expect(categorySlug).toBe("ccs-case-management");
    expect(getHighYieldTopic("usmle", categorySlug!)).toBeDefined();
  });

  it("uses valid study preset ids from registry enrichment", () => {
    const presetIds = new Set(USMLE_STUDY_PRESETS.map((p) => p.id));
    for (const slug of [...allUsmle2026TopicSlugs(), ...USMLE_CROSS_CUTTING_TOPICS.map((t) => t.slug)]) {
      const topic = getHighYieldTopic("usmle", slug);
      for (const id of topic?.relatedPresetIds ?? []) {
        expect(presetIds.has(id as (typeof USMLE_STUDY_PRESETS)[number]["id"]), `${slug}:${id}`).toBe(
          true
        );
      }
    }
  });

  it("auditUsmleTopicIntegration returns no issues", () => {
    expect(auditUsmleTopicIntegration()).toEqual([]);
  });
});
