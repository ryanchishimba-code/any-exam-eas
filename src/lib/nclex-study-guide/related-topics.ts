import { getAnatomyStructuresForMemoryCardIds } from "@/lib/anatomy/topic-links";
import { anatomyHref } from "@/lib/edtech/practice-links-core";
import { getHighYieldTopic } from "@/lib/edtech/seeds";
import { getExamTopicStudyLinks } from "@/lib/library/exam-topic-bridge";
import { getTopicSlugsForChapter } from "./chapter-topics";
import type { SgRelatedTopic } from "./types";

function humanize(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Deep-dive destinations for a chapter, resolved through the existing
 * `exam-topic-bridge`. Topics with nothing on the other side are dropped, so the
 * reader only ever offers a link that actually leads somewhere.
 */
export function getChapterRelatedTopics(chapterSlug: string): SgRelatedTopic[] {
  const related: SgRelatedTopic[] = [];

  for (const slug of getTopicSlugsForChapter(chapterSlug)) {
    const links = getExamTopicStudyLinks("nclex", slug);
    const topic = getHighYieldTopic("nclex", links.topicKey);

    // `deepDiveHref` is only set for review-module topics. The eight NCLEX
    // topics without a module (burns-trauma, heme-oncology, ...) exist in the
    // static seeds but were never written to `highYieldTopic`, and the hub
    // renders from the DB — so `?topic=<slug>` for them would land on the hub
    // with nothing selected. Better to omit the link than to strand the reader.

    // `memoryCardIds` is empty when the Library has no cards for the topic.
    const libraryHref = links.memoryCardIds.length > 0 ? links.libraryHref : undefined;

    // Deliberately not `links.anatomyStructures`: that ranking scores every
    // structure on its own high-yield flag, so it always returns something —
    // which surfaced "Adrenal Glands" under anticoagulation. The reverse lookup
    // only matches structures explicitly tied to the topic.
    const structure = getAnatomyStructuresForMemoryCardIds(links.memoryCardIds, {
      structureIds: topic?.relatedStructureIds ?? [],
      limit: 1,
    })[0];

    if (!links.deepDiveHref && !libraryHref && !structure) continue;

    related.push({
      slug,
      title: topic?.title ?? humanize(slug),
      summary: topic?.summary?.trim() || undefined,
      deepDiveHref: links.deepDiveHref,
      libraryHref,
      libraryCardCount: links.memoryCardIds.length,
      anatomyHref: structure ? anatomyHref("nclex", structure.id) : undefined,
      anatomyLabel: structure?.name,
    });
  }

  return related;
}
