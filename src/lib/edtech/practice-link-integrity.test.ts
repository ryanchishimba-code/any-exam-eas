import { describe, expect, it } from "vitest";
import { getSubjectsForField } from "@/lib/field-subjects";
import { ANATOMY_STRUCTURES } from "@/lib/anatomy/structures";
import { REVIEW_MODULE_ANATOMY } from "@/lib/anatomy/review-module-anatomy";
import { isValidAnatomyStructureId } from "@/lib/anatomy/structure-ids";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { getHighYieldTopics } from "@/lib/edtech/seeds";
import { REVIEW_MODULE_TOPICS } from "@/lib/edtech/seeds/review-module-topics";
import { REVIEW_MODULE_CONTENT_BY_SLUG } from "@/lib/edtech/review-modules/content";
import { WEAK_AREA_MEMORY_CARD_MAP } from "@/lib/reference/memory-cards";
import { MEMORY_CARDS } from "@/lib/reference/seeds";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-01";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_02 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-02";
import { USMLE_PHYSICIAN_EDUCATOR_BATCH_03 } from "@/lib/edtech/seeds/usmle-physician-educator-batch-03";
import { NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/naplex-physician-educator-batch-01";
import { MPJE_PHYSICIAN_EDUCATOR_BATCH_01 } from "@/lib/edtech/seeds/mpje-physician-educator-batch-01";
import { NCLEX_CURATED_QUALITY } from "@/lib/exam-prep/nclex-curated-quality";
import type { EnrichedBankItem } from "@/lib/exam-prep/seed-helpers";
import type { ExamSlug } from "@/types/edtech";

/**
 * Cross-feature link integrity: memory cards → review modules → high-yield
 * topics → question-bank subjects. Every slug that becomes a link target must
 * resolve, otherwise practice CTAs silently land on the wrong content.
 */

const EXAM_SLUGS = Object.keys(EXAM_CATALOG) as ExamSlug[];

function validSubjectIds(examSlug: ExamSlug): Set<string> {
  const subjects = getSubjectsForField(EXAM_CATALOG[examSlug].fieldId);
  return new Set(subjects.map((s) => s.id));
}

const SUBJECTS_BY_EXAM = new Map(EXAM_SLUGS.map((slug) => [slug, validSubjectIds(slug)]));

const MODULE_EXAM_BY_SLUG = new Map(REVIEW_MODULE_TOPICS.map((t) => [t.slug, t.examSlug]));

describe("memory card link integrity", () => {
  it("every card's practiceTopicSlug is a real question-bank subject for its exam", () => {
    for (const card of MEMORY_CARDS) {
      const subjects = SUBJECTS_BY_EXAM.get(card.examSlug);
      expect(
        subjects?.has(card.practiceTopicSlug),
        `card ${card.id} (${card.examSlug}) has invalid practiceTopicSlug "${card.practiceTopicSlug}"`
      ).toBe(true);
    }
  });

  it("every card's reviewModuleSlug resolves to a module registered for the card's exam", () => {
    for (const card of MEMORY_CARDS) {
      if (!card.reviewModuleSlug) continue;
      expect(
        REVIEW_MODULE_CONTENT_BY_SLUG[card.reviewModuleSlug],
        `card ${card.id} points at unknown review module "${card.reviewModuleSlug}"`
      ).toBeDefined();
      expect(
        MODULE_EXAM_BY_SLUG.get(card.reviewModuleSlug),
        `card ${card.id} (${card.examSlug}) deep-links into a module registered for a different exam`
      ).toBe(card.examSlug);
    }
  });

  it("weak-area map ids all resolve to existing cards", () => {
    const cardIds = new Set(MEMORY_CARDS.map((c) => c.id));
    for (const [topicKey, ids] of Object.entries(WEAK_AREA_MEMORY_CARD_MAP)) {
      for (const id of ids) {
        expect(cardIds.has(id), `weak-area key "${topicKey}" references missing card "${id}"`).toBe(
          true
        );
      }
    }
  });

  it("anatomy structure memoryCardIds all resolve to existing cards", () => {
    const cardIds = new Set(MEMORY_CARDS.map((c) => c.id));
    for (const structure of ANATOMY_STRUCTURES) {
      for (const id of structure.memoryCardIds ?? []) {
        expect(
          cardIds.has(id),
          `anatomy structure "${structure.id}" references missing card "${id}"`
        ).toBe(true);
      }
    }
  });

  it("memory card structureIds reference valid anatomy structures", () => {
    for (const card of MEMORY_CARDS) {
      for (const id of card.structureIds ?? []) {
        expect(
          isValidAnatomyStructureId(id),
          `card ${card.id} has invalid structureId "${id}"`
        ).toBe(true);
      }
    }
  });

  it("review module anatomy registry structureIds are valid", () => {
    for (const [slug, entry] of Object.entries(REVIEW_MODULE_ANATOMY)) {
      for (const id of entry.structureIds) {
        expect(
          isValidAnatomyStructureId(id),
          `review module "${slug}" has invalid structureId "${id}"`
        ).toBe(true);
      }
    }
  });
});

describe("question ngnPayload related-content integrity", () => {
  const BATCHES: Array<[string, ExamSlug, EnrichedBankItem[]]> = [
    ["usmle batch 01", "usmle", USMLE_PHYSICIAN_EDUCATOR_BATCH_01],
    ["usmle batch 02", "usmle", USMLE_PHYSICIAN_EDUCATOR_BATCH_02],
    ["usmle batch 03", "usmle", USMLE_PHYSICIAN_EDUCATOR_BATCH_03],
    ["naplex batch 01", "naplex", NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01],
    ["mpje batch 01", "pance", MPJE_PHYSICIAN_EDUCATOR_BATCH_01],
    ["nclex curated", "nclex", NCLEX_CURATED_QUALITY],
  ];

  const cardById = new Map(MEMORY_CARDS.map((c) => [c.id, c]));

  for (const [name, examSlug, batch] of BATCHES) {
    it(`${name}: memoryCardIds and reviewModuleSlug resolve for ${examSlug}`, () => {
      for (const item of batch) {
        const payload = item.ngnPayload ?? {};
        const cardIds = (payload.memoryCardIds as string[] | undefined) ?? [];
        for (const id of cardIds) {
          const card = cardById.get(id);
          expect(card, `question "${item.subjectId}" references missing card "${id}"`).toBeDefined();
          expect(
            card?.examSlug,
            `question "${item.subjectId}" references card "${id}" from another exam`
          ).toBe(examSlug);
        }
        const moduleSlug = payload.reviewModuleSlug as string | undefined;
        if (moduleSlug) {
          expect(
            REVIEW_MODULE_CONTENT_BY_SLUG[moduleSlug],
            `question "${item.subjectId}" points at unknown review module "${moduleSlug}"`
          ).toBeDefined();
          expect(
            MODULE_EXAM_BY_SLUG.get(moduleSlug),
            `question "${item.subjectId}" deep-links into a module for a different exam`
          ).toBe(examSlug);
        }
      }
    });
  }
});

describe("high-yield topic link integrity", () => {
  it("every review-module topic's practiceTopicSlug is a real question-bank subject", () => {
    for (const topic of REVIEW_MODULE_TOPICS) {
      const subjects = SUBJECTS_BY_EXAM.get(topic.examSlug);
      expect(
        subjects?.has(topic.practiceTopicSlug),
        `module topic ${topic.examSlug}/${topic.slug} has invalid practiceTopicSlug "${topic.practiceTopicSlug}"`
      ).toBe(true);
    }
  });

  for (const examSlug of EXAM_SLUGS) {
    it(`every ${examSlug} static topic's practiceTopicSlug is a real question-bank subject`, () => {
      const subjects = SUBJECTS_BY_EXAM.get(examSlug);
      for (const topic of getHighYieldTopics(examSlug)) {
        expect(
          subjects?.has(topic.practiceTopicSlug),
          `topic ${examSlug}/${topic.slug} has invalid practiceTopicSlug "${topic.practiceTopicSlug}"`
        ).toBe(true);
      }
    });
  }

  it("review modules with anatomy registry expose relatedStructureIds", () => {
    for (const examSlug of EXAM_SLUGS) {
      for (const topic of getHighYieldTopics(examSlug)) {
        if (!topic.reviewModule) continue;
        const expected = REVIEW_MODULE_ANATOMY[topic.slug]?.structureIds;
        if (!expected?.length) continue;
        expect(
          topic.relatedStructureIds,
          `topic ${examSlug}/${topic.slug} missing relatedStructureIds from anatomy registry`
        ).toEqual(expected);
      }
    }
  });
});
